/**
 * Group the details for a VM EC2 instance.
 */
export type EC2Instance = {
  /** The unique identifier of the VM */
  instanceId: string;
  /** The unique identifier of the image */
  imageId: string;
  /** The VM type */
  instanceType: string;
  /** The name of the key */
  keyName: string;
  /** The timestamp of the launch of the VM */
  launchTime: string;
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

/**
 * Github OAuth token response structure.
 */
export type GithubTokenResponse = {
  /** The OAuth access token */
  access_token: string;
  /** The type of token */
  token_type: string;
  /** Error message if the request failed */
  error: string;
  /** Detailed error description if the request failed */
  error_description: string;
};
