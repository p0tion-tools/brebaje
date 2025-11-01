import type { VolumeType } from '@aws-sdk/client-ec2';

export type UserErrorResponse = {
  message: string;
  name: string;
  statusCode: number;
  user: null;
};

export class GithubUser {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
  name: string;
  company: string;
  blog: string;
  location: string;
  email: string;
  hireable: boolean;
  bio: string;
  twitter_username: string;
  public_repos: number;
  public_gists: number;
  followers: number;
  following: number;
  created_at: string;
  updated_at: string;
}

export type GithubOAuthResponse = {
  access_token: string;
  token_type: string;
  scope: string;
  error: string;
  error_description: string;
  error_uri: string;
};

export type AWSError = {
  $metadata?: {
    httpStatusCode?: number;
  };
  message?: string;
};

export type CircuitArtifactsType = {
  r1csStoragePath: string;
  wasmStoragePath: string;
};

/**
 * Group information about the VM configuration for circuit contribution verification.
 * @dev the coordinator could choose among CF and VM.
 * @notice the VM configurations could be retrieved at https://aws.amazon.com/ec2/instance-types/.
 * @typedef {Object} VMConfiguration
 * @property {string} [vmConfigurationType] - the VM configuration type.
 * @property {string} [vmDiskType] - the VM volume type (e.g., gp2)
 * @property {number} [vmDiskSize] - the VM disk size in GB.
 * @property {string} [vmInstanceId] - the VM instance identifier (after VM instantiation).
 */
export type VMConfiguration = {
  vmConfigurationType: string;
  vmDiskType: VolumeType;
  vmDiskSize?: number;
  vmInstanceId?: string;
};

export type CircuitVerificationType =
  | {
      serverOrVm: 'server';
    }
  | {
      serverOrVm: 'vm';
      vm: VMConfiguration;
    };

export type NotificationConfig = {
  coordinatorEmail?: string;
  webhookUrl?: string;
};
