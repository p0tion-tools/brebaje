import { GenericBar } from "cli-progress";
import { createReadStream, createWriteStream } from "fs";
import https from "https";
import mime from "mime-types";
import fetchretry from "@adobe/node-fetch-retry";
import { ChunkWithUrl, ETagWithPartNumber, TemporaryParticipantContributionData } from "../types";

/**
 * Return the bucket name based on the input arguments.
 * @param postfix <string> - the s3 postfix to identify created buckets.
 * @param project <string> - the project name.
 * @param description <string> - the ceremony description.
 * @returns <string>
 */
export const getBucketName = (postfix: string, project: string, description?: string): string => {
  const sanitize = (value?: string) =>
    (value ?? "default").toString().trim().replace(/\s+/g, "-").toLowerCase();

  return `${sanitize(project)}-${sanitize(description)}-${sanitize(postfix)}`;
};

/**
 * Get chunks and signed urls related to an object that must be uploaded using a multi-part upload.
 * @param cloudFunctions <Functions> - the Firebase Cloud Functions service instance.
 * @param bucketName <string> - the name of the ceremony artifacts bucket (AWS S3).
 * @param objectKey <string> - the unique key to identify the object inside the given AWS S3 bucket.
 * @param localFilePath <string> - the local path where the artifact will be downloaded.
 * @param uploadId <string> - the unique identifier of the multi-part upload.
 * @param configStreamChunkSize <number> - size of each chunk into which the artifact is going to be splitted (nb. will be converted in MB).
 * @param [ceremonyId] <string> - the unique identifier of the ceremony.
 * @param userId <string> - the unique identifier of the user.
 * @returns Promise<Array<ChunkWithUrl>> - the chunks with related pre-signed url.
 */
export const getChunksAndPreSignedUrlsAPI = async (
  accessToken: string,
  ceremonyId: number,
  userId: string,
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
 * @param chunksWithUrls <Array<ChunkWithUrl>> - the array containing each chunk mapped with the corresponding pre-signed urls.
 * @param contentType <string | false> - the content type of the ceremony artifact.
 * @param cloudFunctions <Functions> - the Firebase Cloud Functions service instance.
 * @param ceremonyId <string> - the unique identifier of the ceremony.
 * @param userId <string> - the unique identifier of the user.
 * @param alreadyUploadedChunks Array<ETagWithPartNumber> - the temporary information about the already uploaded chunks.
 * @param logger <GenericBar> - an optional logger to show progress.
 * @returns <Promise<Array<ETagWithPartNumber>>> - the completed (uploaded) chunks information.
 */
export const uploadPartsAPI = async (
  accessToken: string,
  chunksWithUrls: Array<ChunkWithUrl>,
  contentType: string | false,
  ceremonyId: number,
  userId: string,
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
    const response = await fetchretry(chunksWithUrls[i].preSignedUrl, {
      retryOptions: {
        retryInitialDelay: 500, // 500 ms.
        socketTimeout: 60000, // 60 seconds.
        retryMaxDuration: 300000, // 5 minutes.
      },
      method: "PUT",
      body: chunksWithUrls[i].chunk,
      headers: {
        "Content-Type": contentType ? contentType.toString() : "application/octet-stream",
        "Content-Length": chunksWithUrls[i].chunk.length.toString(),
      },
      agent: new https.Agent({ keepAlive: true }),
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
 * @param functions <Functions> - the Firebase cloud functions object instance.
 * @param bucketName <string> - the name of the ceremony bucket.
 * @param objectKey <string> - the storage path that locates the artifact to be downloaded in the bucket.
 * @param uploadId <string> - the unique identifier of the multi-part upload.
 * @param parts Array<ETagWithPartNumber> - the completed .
 * @param ceremonyId <string> - the unique identifier of the ceremony.
 * @param userId <string> - the unique identifier of the user.
 * @returns Promise<string> - the location of the uploaded ceremony artifact.
 */
export const completeMultiPartUploadAPI = async (
  ceremonyId: number,
  userId: string,
  token: string,
  objectKey: string,
  uploadId: string,
  parts: Array<ETagWithPartNumber>,
) => {
  const url = new URL(`${process.env.API_URL}/storage/multipart/complete`);
  url.search = new URLSearchParams({ id: ceremonyId.toString(), userId }).toString();
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
 * @param functions <Functions> - the Firebase cloud functions object instance.
 * @param ceremonyId <string> - the unique identifier of the ceremony.
 * @param userId <string> - the unique identifier of the user.
 * @param chunk <ETagWithPartNumber> - the information about the already uploaded chunk.
 */
export const temporaryStoreCurrentContributionUploadedChunkDataAPI = async (
  ceremonyId: number,
  userId: string,
  token: string,
  chunk: ETagWithPartNumber,
) => {
  const url = new URL(
    `${process.env.API_URL}/storage/temporary-store-current-contribution-uploaded-chunk-data`,
  );
  url.search = new URLSearchParams({ id: ceremonyId.toString(), userId }).toString();
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
 * @param functions <Functions> - the Firebase cloud functions object instance.
 * @param bucketName <string> - the name of the ceremony bucket.
 * @param objectKey <string> - the storage path that locates the artifact to be downloaded in the bucket.
 * @param uploadId <string> - the unique identifier of the multi-part upload.
 * @param numberOfChunks <number> - the number of pre-signed urls to be generated.
 * @param ceremonyId <string> - the unique identifier of the ceremony.
 * @param userId <string> - the unique identifier of the user.
 * @returns Promise<Array<string>> - the set of pre-signed urls (one for each chunk).
 */
export const generatePreSignedUrlsPartsAPI = async (
  objectKey: string,
  uploadId: string,
  numberOfParts: number,
  ceremonyId: number,
  userId: string,
  token: string,
) => {
  const url = new URL(`${process.env.API_URL}/storage/multipart/urls`);
  url.search = new URLSearchParams({ id: ceremonyId.toString(), userId }).toString();
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
 * @param functions <Functions> - the Firebase cloud functions object instance.
 * @param bucketName <string> - the name of the ceremony bucket.
 * @param objectKey <string> - the storage path that locates the artifact to be downloaded in the bucket.
 * @param ceremonyId <string> - the unique identifier of the ceremony.
 * @param userId <string> - the unique identifier of the user.
 * @returns Promise<string> - the multi-part upload id.
 */
export const openMultiPartUploadAPI = async (
  objectKey: string,
  ceremonyId: number,
  userId: string,
  token: string,
) => {
  const url = new URL(`${process.env.API_URL}/storage/multipart/start`);
  url.search = new URLSearchParams({ id: ceremonyId.toString(), userId }).toString();
  const result = (await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({
      objectKey,
    }),
  }).then((res) => res.json())) as { uploadId: string };
  return result;
};

/**
 * Write temporary information about the unique identifier about the opened multi-part upload to eventually resume the contribution.
 * @param functions <Functions> - the Firebase cloud functions object instance.
 * @param ceremonyId <string> - the unique identifier of the ceremony.
 * @param userId <string> - the unique identifier of the user.
 * @param uploadId <string> - the unique identifier of the multi-part upload.
 */
export const temporaryStoreCurrentContributionMultiPartUploadIdAPI = async (
  ceremonyId: number,
  userId: string,
  uploadId: string,
  token: string,
) => {
  const url = new URL(
    `${process.env.API_URL}/storage/temporary-store-current-contribution-multipart-upload-id`,
  );
  url.search = new URLSearchParams({ id: ceremonyId.toString(), userId }).toString();
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
 * @notice this method implements the multi-part upload using pre-signed urls, optimal for large files.
 * Steps:
 * 0) Check if current contributor could resume a multi-part upload.
 *    0.A) If yes, continue from last uploaded chunk using the already opened multi-part upload.
 *    0.B) Otherwise, start creating a new multi-part upload.
 * 1) Generate a pre-signed url for each (remaining) chunk of the ceremony artifact.
 * 2) Consume the pre-signed urls to upload chunks.
 * 3) Complete the multi-part upload.
 * @param cloudFunctions <Functions> - the Firebase Cloud Functions service instance.
 * @param bucketName <string> - the name of the ceremony artifacts bucket (AWS S3).
 * @param objectKey <string> - the unique key to identify the object inside the given AWS S3 bucket.
 * @param localPath <string> - the local path where the artifact will be downloaded.
 * @param configStreamChunkSize <number> - size of each chunk into which the artifact is going to be splitted (nb. will be converted in MB).
 * @param userId <string> - the unique identifier of the user.
 * @param [ceremonyId] <string> - the unique identifier of the ceremony (used as a double-edge sword - as identifier and as a check if current contributor is the coordinator finalizing the ceremony).
 * @param [temporaryDataToResumeMultiPartUpload] <TemporaryParticipantContributionData> - the temporary information necessary to resume an already started multi-part upload.
 * @param logger <GenericBar> - an optional logger to show progress.
 */
export const multiPartUploadAPI = async (
  accessToken: string,
  ceremonyId: number,
  userId: string,
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
    mime.lookup(localFilePath) || false, // content-type.
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
 * @param accessToken <string> - the access token for authentication.
 * @param ceremonyId <number> - the unique identifier of the ceremony.
 * @param objectKey <string> - the storage path that locates the artifact to be downloaded in the bucket.
 * @returns <Promise<string>> - the pre-signed url w/ GET request permissions for specified object key.
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
 * @param accessToken <string> - the access token for authentication.
 * @param ceremonyId <number> - the unique identifier of the ceremony.
 * @param objectKey <string> - the storage path that locates the artifact to be downloaded in the bucket.
 * @returns <Promise<boolean>> - true if and only if the object exists, otherwise false.
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
 * @param accessToken <string> - the access token for authentication.
 * @param ceremonyId <number> - the unique identifier of the ceremony.
 * @param storagePath <string> - Path to the artifact in the bucket.
 * @param localPath <string> - Path to the local file where the artifact will be saved.
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
  const response = await fetchretry(getPreSignedUrl, {
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
