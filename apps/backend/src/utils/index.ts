import { createWriteStream, mkdirSync } from 'fs';
import { dirname } from 'path';
import { pipeline } from 'stream';
import { promisify } from 'util';

/**
 * Download a file from a given URL and save it to the specified output path.
 * @param url - The URL to download from
 * @param outputPath - The local file path to save to
 */
export const downloadAndSaveFile = async (url: string, outputPath: string): Promise<void> => {
  const streamPipeline = promisify(pipeline);

  try {
    // Ensure the directory exists
    mkdirSync(dirname(outputPath), { recursive: true });

    // Fetch the file
    const response = await fetch(url);

    if (!response.ok && response.status !== 200) {
      throw new Error(`(url: ${url}): ${response.status} ${response.statusText}`);
    }

    if (!response.body) {
      throw new Error('Response body is null');
    }

    // Create write stream and pipe the response
    await streamPipeline(response.body, createWriteStream(outputPath));
  } catch (error) {
    throw new Error(
      `Failed to download and save file: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  }
};
