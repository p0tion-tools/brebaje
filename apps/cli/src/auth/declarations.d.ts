export interface BackendClientIdResponse {
  client_id: string;
}

export interface BackendAuthResponse {
  user: {
    id: string;
    displayName: string;
    avatarUrl?: string;
    provider: string;
  };
  jwt: string;
}

export interface JWTPayload {
  user: {
    id: string;
    displayName: string;
    avatarUrl?: string;
    provider: string;
    githubId?: string;
    walletAddress?: string;
  };
  iat: number;
  exp: number;
}
