/**
 * Group the details for a VM EC2 instance.
 * @typedef {Object} EC2Instance
 * @property {string} instanceId - the unique identifier of the VM.
 * @property {string} imageId - the unique identifier of the image.
 * @property {string} instanceType - the VM type.
 * @property {string} keyName - the name of the key.
 * @property {string} launchTime - the timestamp of the launch of the VM.
 */
export type EC2Instance = {
  instanceId: string;
  imageId: string;
  instanceType: string;
  keyName: string;
  launchTime: string;
};

/**
 * Group a pre-signed url chunk core information.
 * @typedef {Object} ETagWithPartNumber
 * @property {string | null} ETag - a unique reference to this chunk associated to a pre-signed url.
 * @property {number} PartNumber - indicate where the chunk is positioned in order to reconstruct the file with multiPartUpload/Download.
 */
export type ETagWithPartNumber = {
  ETag: string | undefined;
  PartNumber: number;
};

/**
 * Auxiliary data needed for resumption in an intermediate step of contribution.
 * @dev The data is used when the current contributor interrupts during the download, contribute, upload steps
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
