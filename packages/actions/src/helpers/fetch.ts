/**
 * Options for configuring fetch retry behavior
 */
export interface FetchRetryOptions {
  /** Initial delay before first retry in milliseconds */
  retryInitialDelay?: number;
  /** Maximum time to keep retrying in milliseconds */
  retryMaxDuration?: number;
  /** Socket timeout in milliseconds */
  socketTimeout?: number;
  /** Maximum number of retry attempts (default: unlimited within retryMaxDuration) */
  maxRetries?: number;
}

/**
 * Fetch with automatic retry on failure
 * @param url - The URL to fetch
 * @param options - Fetch options including retry configuration
 * @returns Promise resolving to the Response
 */
export async function fetchRetry(
  url: string,
  options?: RequestInit & { retryOptions?: FetchRetryOptions },
): Promise<Response> {
  const retryOptions = options?.retryOptions ?? {};
  const {
    retryInitialDelay = 500,
    retryMaxDuration = 300000,
    socketTimeout = 60000,
    maxRetries = Infinity,
  } = retryOptions;

  const startTime = Date.now();
  let attempt = 0;
  let lastError: Error | null = null;

  // Remove retryOptions from fetch options
  const { retryOptions: _, ...fetchOptions } = options ?? {};

  while (attempt < maxRetries) {
    // Check if we've exceeded the maximum retry duration
    if (Date.now() - startTime > retryMaxDuration) {
      throw new Error(
        `Fetch retry timeout: exceeded maximum duration of ${retryMaxDuration}ms. Last error: ${lastError?.message ?? "unknown"}`,
      );
    }

    try {
      // Create an AbortController for socket timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), socketTimeout);

      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // If response is successful, return it
      if (response.ok) {
        return response;
      }

      // For non-ok responses, retry on 5xx errors
      if (response.status >= 500) {
        lastError = new Error(`Server error: ${response.status} ${response.statusText}`);
      } else {
        // For 4xx errors, don't retry
        return response;
      }
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // Don't retry on abort errors if we're out of time
      if (error instanceof Error && error.name === "AbortError") {
        if (Date.now() - startTime > retryMaxDuration) {
          throw new Error(
            `Fetch retry timeout: socket timeout exceeded. Duration: ${retryMaxDuration}ms`,
          );
        }
      }
    }

    // Calculate delay with exponential backoff
    const delay = retryInitialDelay * Math.pow(2, attempt);
    await new Promise((resolve) => setTimeout(resolve, delay));

    attempt++;
  }

  throw new Error(
    `Fetch failed after ${attempt} attempts. Last error: ${lastError?.message ?? "unknown"}`,
  );
}
