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
