export type UserErrorResponse = {
  message: string;
  name: string;
  statusCode: number;
  user: null;
};

export type AWSError = {
  $metadata?: {
    httpStatusCode?: number;
  };
  message?: string;
};
