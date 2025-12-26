/**
 * Define a custom file data chunk associated with a pre-signed url.
 * @remarks Useful when interacting with AWS S3 buckets using pre-signed urls for multi-part upload or download storing temporary information on the database.
 */
export type ChunkWithUrl = {
  /** Indicate where the chunk is positioned in order to reconstruct the file with multiPartUpload/Download */
  partNumber: number;
  /** The piece of information in bytes */
  chunk: Buffer;
  /** The unique reference to the pre-signed url to which this chunk is linked too */
  preSignedUrl: string;
};

/**
 * Group a pre-signed url chunk core information.
 */
export type ETagWithPartNumber = {
  /** A unique reference to this chunk associated to a pre-signed url */
  ETag: string | undefined;
  /** Indicate where the chunk is positioned in order to reconstruct the file with multiPartUpload/Download */
  PartNumber: number;
};

/**
 * Auxiliary data needed for resumption in an intermediate step of contribution.
 * @remarks The data is used when the current contributor interrupts during the download, contribute, upload steps
 * to prevent it from having to start over but can pick up where it left off.
 * This restart operation does NOT interact with the timeout mechanism (which remains unchanged).
 */
export type TemporaryParticipantContributionData = {
  /** The time spent since the contribution start */
  contributionComputationTime: number;
  /** The unique identifier of the pre-signed url PUT request to upload the newest contribution */
  uploadId: string;
  /** The list of ETags and PartNumbers that make up the chunks */
  chunks: Array<ETagWithPartNumber>;
};
