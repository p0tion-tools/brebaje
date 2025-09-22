/**
 * Define a custom file data chunk associated with a pre-signed url.
 * @dev Useful when interacting with AWS S3 buckets using pre-signed urls for multi-part upload or download storing temporary information on the database.
 * @typedef {Object} ChunkWithUrl
 * @property {number} partNumber - indicate where the chunk is positioned in order to reconhstruct the file with multiPartUpload/Download.
 * @property {Buffer} chunk - the piece of information in bytes.
 * @property {string} preSignedUrl - the unique reference to the pre-signed url to which this chunk is linked too.
 */
export type ChunkWithUrl = {
  partNumber: number;
  chunk: Buffer;
  preSignedUrl: string;
};

/**
 * Group a pre-signed url chunk core information.
 * @typedef {Object} ETagWithPartNumber
 * @property {string | null} ETag - a unique reference to this chunk associated to a pre-signed url.
 * @property {number} PartNumber - indicate where the chunk is positioned in order to reconhstruct the file with multiPartUpload/Download.
 */
export type ETagWithPartNumber = {
  ETag: string | undefined;
  PartNumber: number;
};

/**
 * Auxiliary data needed for resumption in an intermediate step of contribution.
 * @dev The data is used when the current contributorinterrupts during the download, contribute, upload steps
 * to prevent it from having to start over but can pick up where it left off.
 * This restart operation does NOT interact with the timeout mechanism (which remains unchanged).
 * @typedef {Object} TemporaryParticipantContributionData
 * @property {number} contributionComputationTime - the time spent since the contribution start.
 * @property {string} uploadId - the unique identifier of the pre-signed url PUT request to upload the newest contribution.
 * @property {Array<ETagWithPartNumber>} chunks - the list of ETags and PartNumbers that make up the chunks.
 */
export type TemporaryParticipantContributionData = {
  contributionComputationTime: number;
  uploadId: string;
  chunks: Array<ETagWithPartNumber>;
};
