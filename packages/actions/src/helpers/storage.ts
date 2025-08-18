/**
 * Return the bucket name based on the input arguments.
 * @param postfix <string> - the s3 postfix to identify created buckets.
 * @param project <string> - the project name.
 * @param description <string> - the ceremony description.
 * @returns <string>
 */
export const getBucketName = (postfix: string, project: string, description?: string): string =>
  `${project}-${description || "default"}-${postfix}`;
