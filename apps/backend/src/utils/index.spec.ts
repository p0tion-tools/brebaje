import { fetchWithTimeout } from './index';

// Mock global fetch
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe('fetchWithTimeout', () => {
  let setTimeoutSpy: jest.SpyInstance;
  let clearTimeoutSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock setTimeout and clearTimeout with proper spies
    setTimeoutSpy = jest.spyOn(global, 'setTimeout').mockImplementation((fn, delay) => {
      // Return a mock timer ID
      return 12345 as any;
    });

    clearTimeoutSpy = jest.spyOn(global, 'clearTimeout').mockImplementation(() => {
      // Mock implementation
    });
  });

  afterEach(() => {
    setTimeoutSpy.mockRestore();
    clearTimeoutSpy.mockRestore();
  });

  it('should successfully fetch with default timeout', async () => {
    const mockResponse = new Response('test data', { status: 200 });
    mockFetch.mockResolvedValueOnce(mockResponse);

    const result = await fetchWithTimeout('https://example.com');

    expect(mockFetch).toHaveBeenCalledWith('https://example.com', {
      signal: expect.any(AbortSignal),
    });
    expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), 10000);
    expect(clearTimeoutSpy).toHaveBeenCalled();
    expect(result).toBe(mockResponse);
  });

  it('should use custom timeout value', async () => {
    const mockResponse = new Response('test data', { status: 200 });
    mockFetch.mockResolvedValueOnce(mockResponse);

    await fetchWithTimeout('https://example.com', {}, 5000);

    expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), 5000);
  });

  it('should pass through fetch options', async () => {
    const mockResponse = new Response('test data', { status: 200 });
    mockFetch.mockResolvedValueOnce(mockResponse);

    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ test: 'data' }),
    };

    await fetchWithTimeout('https://example.com', options);

    expect(mockFetch).toHaveBeenCalledWith('https://example.com', {
      ...options,
      signal: expect.any(AbortSignal),
    });
  });

  it('should handle AbortError and throw timeout error', async () => {
    const abortError = new Error('The operation was aborted');
    abortError.name = 'AbortError';
    mockFetch.mockRejectedValueOnce(abortError);

    await expect(fetchWithTimeout('https://example.com', {}, 1000)).rejects.toThrow(
      'Request timeout after 1000ms',
    );

    expect(clearTimeoutSpy).toHaveBeenCalled();
  });

  it('should handle network errors and rethrow them', async () => {
    const networkError = new Error('Network error');
    mockFetch.mockRejectedValueOnce(networkError);

    await expect(fetchWithTimeout('https://example.com')).rejects.toThrow('Network error');

    expect(clearTimeoutSpy).toHaveBeenCalled();
  });

  it('should handle generic errors and rethrow them', async () => {
    const genericError = new Error('Something went wrong');
    mockFetch.mockRejectedValueOnce(genericError);

    await expect(fetchWithTimeout('https://example.com')).rejects.toThrow('Something went wrong');

    expect(clearTimeoutSpy).toHaveBeenCalled();
  });

  it('should clear timeout even when fetch succeeds', async () => {
    const mockResponse = new Response('test data', { status: 200 });
    mockFetch.mockResolvedValueOnce(mockResponse);

    await fetchWithTimeout('https://example.com');

    expect(clearTimeoutSpy).toHaveBeenCalled();
  });

  it('should clear timeout even when fetch fails', async () => {
    const error = new Error('Fetch failed');
    mockFetch.mockRejectedValueOnce(error);

    await expect(fetchWithTimeout('https://example.com')).rejects.toThrow('Fetch failed');

    expect(clearTimeoutSpy).toHaveBeenCalled();
  });

  it('should work with empty options object', async () => {
    const mockResponse = new Response('test data', { status: 200 });
    mockFetch.mockResolvedValueOnce(mockResponse);

    const result = await fetchWithTimeout('https://example.com', {});

    expect(mockFetch).toHaveBeenCalledWith('https://example.com', {
      signal: expect.any(AbortSignal),
    });
    expect(result).toBe(mockResponse);
  });

  it('should merge existing signal with abort controller signal', async () => {
    const existingController = new AbortController();
    const mockResponse = new Response('test data', { status: 200 });
    mockFetch.mockResolvedValueOnce(mockResponse);

    const options = { signal: existingController.signal };
    await fetchWithTimeout('https://example.com', options);

    // The function should override the signal with its own AbortController
    expect(mockFetch).toHaveBeenCalledWith('https://example.com', {
      signal: expect.any(AbortSignal),
    });

    // Ensure the signal passed is not the original one
    const callArgs = mockFetch.mock.calls[0];
    expect(callArgs[1].signal).not.toBe(existingController.signal);
  });

  it('should handle timeout of 0ms', async () => {
    const mockResponse = new Response('test data', { status: 200 });
    mockFetch.mockResolvedValueOnce(mockResponse);

    await fetchWithTimeout('https://example.com', {}, 0);

    expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), 0);
  });

  it('should preserve response properties', async () => {
    const mockResponse = new Response('test data', {
      status: 201,
      statusText: 'Created',
      headers: { 'Content-Type': 'application/json' },
    });
    mockFetch.mockResolvedValueOnce(mockResponse);

    const result = await fetchWithTimeout('https://example.com');

    expect(result.status).toBe(201);
    expect(result.statusText).toBe('Created');
    expect(result.headers.get('Content-Type')).toBe('application/json');
  });
});
