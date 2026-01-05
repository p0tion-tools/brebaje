import { GenericBar } from "cli-progress";
import { createReadStream, createWriteStream } from "fs";
import { lookup } from "mime-types";
import { ChunkWithUrl, ETagWithPartNumber, TemporaryParticipantContributionData } from "../types";
import { fetchRetry } from "./fetch";

/**
 * Return the bucket name based on the input arguments.
 * @param postfix - the s3 postfix to identify created buckets.
 * @param project - the project name.
 * @param description - the ceremony description.
 * @returns - the bucket name.
 */
export const getBucketName = (postfix: string, project: string, description?: string): string => {
  const sanitize = (value?: string) =>
    (value ?? "default").toString().trim().replace(/\s+/g, "-").toLowerCase();

  return `${sanitize(project)}-${sanitize(description)}-${sanitize(postfix)}`;
};

/**
 * Get chunks and signed urls related to an object that must be uploaded using a multi-part upload.
 * @param accessToken - the access token for authentication.
 * @param ceremonyId - the unique identifier of the ceremony.
 * @param userId - the unique identifier of the user.
 * @param objectKey - the unique key to identify the object inside the given AWS S3 bucket.
 * @param localFilePath - the local path where the artifact will be downloaded.
 * @param uploadId - the unique identifier of the multi-part upload.
 * @param configStreamChunkSize - size of each chunk into which the artifact is going to be splitted (nb. will be converted in MB).
 * @returns - the chunks with related pre-signed url.
 */
export const getChunksAndPreSignedUrlsAPI = async (
  accessToken: string,
  ceremonyId: number,
  userId: number,
  objectKey: string,
  localFilePath: string,
  uploadId: string,
  configStreamChunkSize: number,
): Promise<Array<ChunkWithUrl>> => {
  // Prepare a new stream to read the file.
  const stream = createReadStream(localFilePath, {
    highWaterMark: configStreamChunkSize * 1024 * 1024, // convert to MB.
  });

  // Split in chunks.
  const chunks: Buffer[] = [];
  for await (const chunk of stream) chunks.push(chunk);

  // Check if the file is not empty.
  if (!chunks.length) throw new Error("Unable to split an empty file into chunks.");

  // Request pre-signed url generation for each chunk.
  const { parts: preSignedUrls } = await generatePreSignedUrlsPartsAPI(
    objectKey,
    uploadId,
    chunks.length,
    ceremonyId,
    userId,
    accessToken,
  );

  // Map pre-signed urls with corresponding chunks.
  return chunks.map((val1, index) => ({
    partNumber: index + 1,
    chunk: val1,
    preSignedUrl: preSignedUrls[index],
  }));
};

/**
 * Forward the request to upload each single chunk of the related ceremony artifact.
 * @param chunksWithUrls - the array containing each chunk mapped with the corresponding pre-signed urls.
 * @param contentType - the content type of the ceremony artifact.
 * @param cloudFunctions - the Firebase Cloud Functions service instance.
 * @param ceremonyId - the unique identifier of the ceremony.
 * @param userId - the unique identifier of the user.
 * @param alreadyUploadedChunks - the temporary information about the already uploaded chunks.
 * @param logger - an optional logger to show progress.
 * @returns - the completed (uploaded) chunks information.
 */
export const uploadPartsAPI = async (
  accessToken: string,
  chunksWithUrls: Array<ChunkWithUrl>,
  contentType: string | false,
  ceremonyId: number,
  userId: number,
  creatingCeremony?: boolean,
  alreadyUploadedChunks?: Array<ETagWithPartNumber>,
  logger?: GenericBar,
): Promise<Array<ETagWithPartNumber>> => {
  // Keep track of uploaded chunks.
  const uploadedChunks: Array<ETagWithPartNumber> = alreadyUploadedChunks || [];

  // if we were passed a logger, start it
  if (logger) logger.start(chunksWithUrls.length, 0);

  // Loop through remaining chunks.
  for (
    let i = alreadyUploadedChunks ? alreadyUploadedChunks.length : 0;
    i < chunksWithUrls.length;
    i += 1
  ) {
    // Consume the pre-signed url to upload the chunk.
    const response = await fetchRetry(chunksWithUrls[i].preSignedUrl, {
      retryOptions: {
        retryInitialDelay: 500, // 500 ms.
        socketTimeout: 60000, // 60 seconds.
        retryMaxDuration: 300000, // 5 minutes.
      },
      method: "PUT",
      body: new Uint8Array(chunksWithUrls[i].chunk),
      headers: {
        "Content-Type": contentType ? contentType.toString() : "application/octet-stream",
        "Content-Length": chunksWithUrls[i].chunk.length.toString(),
      },
    });

    // Verify the response.
    if (response.status !== 200 || !response.ok)
      throw new Error(
        `Unable to upload chunk number ${i}. Please, terminate the current session and retry to resume from the latest uploaded chunk.`,
      );

    // Extract uploaded chunk data.
    const chunk = {
      ETag: response.headers.get("etag") || undefined,
      PartNumber: chunksWithUrls[i].partNumber,
    };
    uploadedChunks.push(chunk);

    // Temporary store uploaded chunk data to enable later resumable contribution.
    // nb. this must be done only when contributing (not finalizing).
    if (ceremonyId && !creatingCeremony)
      await temporaryStoreCurrentContributionUploadedChunkDataAPI(
        ceremonyId,
        userId,
        accessToken,
        chunk,
      );

    // increment the count on the logger
    if (logger) logger.increment();
  }

  return uploadedChunks;
};

/**
 * Complete a multi-part upload for a specific object in the given AWS S3 bucket.
 * @param functions - the Firebase cloud functions object instance.
 * @param bucketName - the name of the ceremony bucket.
 * @param objectKey - the storage path that locates the artifact to be downloaded in the bucket.
 * @param uploadId - the unique identifier of the multi-part upload.
 * @param parts - the completed .
 * @param ceremonyId - the unique identifier of the ceremony.
 * @param userId - the unique identifier of the user.
 * @returns - the location of the uploaded ceremony artifact.
 */
export const completeMultiPartUploadAPI = async (
  ceremonyId: number,
  userId: number,
  token: string,
  objectKey: string,
  uploadId: string,
  parts: Array<ETagWithPartNumber>,
) => {
  const url = new URL(`${process.env.API_URL}/storage/multipart/complete`);
  url.search = new URLSearchParams({
    id: ceremonyId.toString(),
    userId: userId.toString(),
  }).toString();
  const result = (await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      objectKey,
      uploadId,
      parts,
    }),
  }).then((res) => res.json())) as { location: string };
  return result;
};

/**
 * Write temporary information about the etags and part numbers for each uploaded chunk in order to make the upload resumable from last chunk.
 * @param functions - the Firebase cloud functions object instance.
 * @param ceremonyId - the unique identifier of the ceremony.
 * @param userId - the unique identifier of the user.
 * @param chunk - the information about the already uploaded chunk.
 */
export const temporaryStoreCurrentContributionUploadedChunkDataAPI = async (
  ceremonyId: number,
  userId: number,
  token: string,
  chunk: ETagWithPartNumber,
) => {
  const url = new URL(
    `${process.env.API_URL}/storage/temporary-store-current-contribution-uploaded-chunk-data`,
  );
  url.search = new URLSearchParams({
    id: ceremonyId.toString(),
    userId: userId.toString(),
  }).toString();
  const result = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      chunk,
    }),
  });
  if (result.status < 200 || result.status >= 300) {
    throw new Error(result.status.toString());
  }
  return true;
};

/**
 * Generate a new pre-signed url for each chunk related to a started multi-part upload.
 * @param functions - the Firebase cloud functions object instance.
 * @param bucketName - the name of the ceremony bucket.
 * @param objectKey - the storage path that locates the artifact to be downloaded in the bucket.
 * @param uploadId - the unique identifier of the multi-part upload.
 * @param numberOfChunks - the number of pre-signed urls to be generated.
 * @param ceremonyId - the unique identifier of the ceremony.
 * @param userId - the unique identifier of the user.
 * @returns - the set of pre-signed urls (one for each chunk).
 */
export const generatePreSignedUrlsPartsAPI = async (
  objectKey: string,
  uploadId: string,
  numberOfParts: number,
  ceremonyId: number,
  userId: number,
  token: string,
) => {
  const url = new URL(`${process.env.API_URL}/storage/multipart/urls`);
  url.search = new URLSearchParams({
    id: ceremonyId.toString(),
    userId: userId.toString(),
  }).toString();
  const result = (await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      objectKey,
      uploadId,
      numberOfParts,
    }),
  }).then((res) => res.json())) as { parts: string[] };
  return result;
};

/**
 * Start a new multi-part upload for a specific object in the given AWS S3 bucket.
 * @param functions - the Firebase cloud functions object instance.
 * @param bucketName - the name of the ceremony bucket.
 * @param objectKey - the storage path that locates the artifact to be downloaded in the bucket.
 * @param ceremonyId - the unique identifier of the ceremony.
 * @param userId - the unique identifier of the user.
 * @returns - the multi-part upload id.
 */
export const openMultiPartUploadAPI = async (
  objectKey: string,
  ceremonyId: number,
  userId: number,
  token: string,
) => {
  const url = new URL(`${process.env.API_URL}/storage/multipart/start`);
  url.search = new URLSearchParams({
    id: ceremonyId.toString(),
    userId: userId.toString(),
  }).toString();
  const result = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      objectKey,
    }),
  });

  if (!result.ok) {
    throw new Error(result.status.toString());
  }

  const data = (await result.json()) as { uploadId: string };

  return data;
};

/**
 * Write temporary information about the unique identifier about the opened multi-part upload to eventually resume the contribution.
 * @param functions - the Firebase cloud functions object instance.
 * @param ceremonyId - the unique identifier of the ceremony.
 * @param userId - the unique identifier of the user.
 * @param uploadId - the unique identifier of the multi-part upload.
 */
export const temporaryStoreCurrentContributionMultiPartUploadIdAPI = async (
  ceremonyId: number,
  userId: number,
  uploadId: string,
  token: string,
) => {
  const url = new URL(
    `${process.env.API_URL}/storage/temporary-store-current-contribution-multipart-upload-id`,
  );
  url.search = new URLSearchParams({
    id: ceremonyId.toString(),
    userId: userId.toString(),
  }).toString();
  const result = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      uploadId,
    }),
  });
  if (result.status < 200 || result.status >= 300) {
    throw new Error(result.status.toString());
  }
};

/**
 * Upload a ceremony artifact to the corresponding bucket.
 * this method implements the multi-part upload using pre-signed urls, optimal for large files.
 * Steps:
 * 0) Check if current contributor could resume a multi-part upload.
 *    0.A) If yes, continue from last uploaded chunk using the already opened multi-part upload.
 *    0.B) Otherwise, start creating a new multi-part upload.
 * 1) Generate a pre-signed url for each (remaining) chunk of the ceremony artifact.
 * 2) Consume the pre-signed urls to upload chunks.
 * 3) Complete the multi-part upload.
 * @param cloudFunctions - the Firebase Cloud Functions service instance.
 * @param bucketName - the name of the ceremony artifacts bucket (AWS S3).
 * @param objectKey - the unique key to identify the object inside the given AWS S3 bucket.
 * @param localPath - the local path where the artifact will be downloaded.
 * @param configStreamChunkSize - size of each chunk into which the artifact is going to be splitted (nb. will be converted in MB).
 * @param userId - the unique identifier of the user.
 * @param ceremonyId - the unique identifier of the ceremony (used as a double-edge sword - as identifier and as a check if current contributor is the coordinator finalizing the ceremony).
 * @param temporaryDataToResumeMultiPartUpload - the temporary information necessary to resume an already started multi-part upload.
 * @param logger - an optional logger to show progress.
 */
export const multiPartUploadAPI = async (
  accessToken: string,
  ceremonyId: number,
  userId: number,
  objectKey: string,
  localFilePath: string,
  configStreamChunkSize: number,
  creatingCeremony?: boolean,
  temporaryDataToResumeMultiPartUpload?: TemporaryParticipantContributionData,
  logger?: GenericBar,
) => {
  // The unique identifier of the multi-part upload.
  let multiPartUploadId: string = "";
  // The list of already uploaded chunks.
  let alreadyUploadedChunks: Array<ETagWithPartNumber> = [];

  // Step (0).
  if (temporaryDataToResumeMultiPartUpload && !!temporaryDataToResumeMultiPartUpload.uploadId) {
    // Step (0.A).
    multiPartUploadId = temporaryDataToResumeMultiPartUpload.uploadId;
    alreadyUploadedChunks = temporaryDataToResumeMultiPartUpload.chunks;
  } else {
    // Step (0.B).
    // Open a new multi-part upload for the ceremony artifact.
    const { uploadId } = await openMultiPartUploadAPI(objectKey, ceremonyId, userId, accessToken);
    multiPartUploadId = uploadId;

    // Store multi-part upload identifier on document collection.
    if (ceremonyId && !creatingCeremony) {
      // Store Multi-Part Upload ID after generation.
      await temporaryStoreCurrentContributionMultiPartUploadIdAPI(
        ceremonyId,
        userId,
        multiPartUploadId,
        accessToken,
      );
    }
  }

  // Step (1).
  const chunksWithUrlsZkey = await getChunksAndPreSignedUrlsAPI(
    accessToken,
    ceremonyId,
    userId,
    objectKey,
    localFilePath,
    multiPartUploadId,
    configStreamChunkSize,
  );

  // Step (2).
  const partNumbersAndETagsZkey = await uploadPartsAPI(
    accessToken,
    chunksWithUrlsZkey,
    lookup(localFilePath) || false, // content-type.
    ceremonyId,
    userId,
    creatingCeremony,
    alreadyUploadedChunks,
    logger,
  );

  // Step (3).
  await completeMultiPartUploadAPI(
    ceremonyId,
    userId,
    accessToken,
    objectKey,
    multiPartUploadId,
    partNumbersAndETagsZkey,
  );
};

/**
 * Return a pre-signed url for a given object contained inside the provided AWS S3 bucket in order to perform a GET request.
 * @param accessToken - the access token for authentication.
 * @param ceremonyId - the unique identifier of the ceremony.
 * @param objectKey - the storage path that locates the artifact to be downloaded in the bucket.
 * @returns - the pre-signed url w/ GET request permissions for specified object key.
 */
export const generateGetObjectPreSignedUrlAPI = async (
  accessToken: string,
  ceremonyId: number,
  objectKey: string,
) => {
  const url = new URL(`${process.env.API_URL}/storage/object/presigned-url`);
  url.search = new URLSearchParams({
    id: ceremonyId.toString(),
  }).toString();
  const result = (await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      objectKey,
    }),
  }).then((res) => res.json())) as { url: string };
  return result.url;
};

/**
 * Check if a specified object exist in a given AWS S3 bucket.
 * @param accessToken - the access token for authentication.
 * @param ceremonyId - the unique identifier of the ceremony.
 * @param objectKey - the storage path that locates the artifact to be downloaded in the bucket.
 * @returns - true if and only if the object exists, otherwise false.
 */
export const checkIfObjectExistAPI = async (
  accessToken: string,
  ceremonyId: number,
  objectKey: string,
) => {
  const url = new URL(`${process.env.API_URL}/storage/object/exists`);
  url.search = new URLSearchParams({ id: ceremonyId.toString() }).toString();
  const result = (await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      objectKey,
    }),
  }).then((res) => res.json())) as { result: boolean };
  return result.result;
};

/**
 * Download an artifact from S3 (only for authorized users)
 * @param accessToken - the access token for authentication.
 * @param ceremonyId - the unique identifier of the ceremony.
 * @param storagePath - Path to the artifact in the bucket.
 * @param localPath - Path to the local file where the artifact will be saved.
 */
export const downloadCeremonyArtifact = async (
  accessToken: string,
  ceremonyId: number,
  storagePath: string,
  localPath: string,
) => {
  // Request pre-signed url to make GET download request.
  const getPreSignedUrl = await generateGetObjectPreSignedUrlAPI(
    accessToken,
    ceremonyId,
    storagePath,
  );

  // Make fetch to get info about the artifact.
  const response = await fetchRetry(getPreSignedUrl, {
    retryOptions: {
      retryInitialDelay: 500,
      socketTimeout: 60000,
      retryMaxDuration: 300000,
    },
  });

  if (response.status !== 200 && !response.ok)
    throw new Error(
      `There was an error while downloading the object ${storagePath} from ceremony ${ceremonyId}. Please check the function inputs and try again.`,
    );

  const content: any = response.body;
  // Prepare stream.
  const writeStream = createWriteStream(localPath);

  // Write chunk by chunk.
  for await (const chunk of content) {
    writeStream.write(chunk);
  }

  // Close stream
  writeStream.end();
};
