/**
 * Gets the newest file from a directory that matches the filter string
 * @param directory - Directory path to search in
 * @param filterString - String to filter files (e.g., "_record.txt")
 * @returns The newest matching file name, or null if no files found
 */
export function getNewerFile(directory: string, filterString: string): string | null {
  const fs = require("fs");
  const path = require("path");

  try {
    // Check if directory exists
    if (!fs.existsSync(directory)) {
      throw new Error(`Directory does not exist: ${directory}`);
    }

    // Read all files in directory
    const files = fs.readdirSync(directory);

    // Filter files using the provided string (similar to endsWith)
    const matchingFiles = files.filter((file) => file.endsWith(filterString));

    if (matchingFiles.length === 0) {
      return null; // No matching files found
    }

    // Get file stats and sort by modification time (newest first)
    const filesWithStats = matchingFiles.map((file) => {
      const filePath = path.join(directory, file);
      const stats = fs.statSync(filePath);
      return {
        name: file,
        mtime: stats.mtime,
      };
    });

    // Sort by modification time (newest first)
    filesWithStats.sort((a, b) => b.mtime.getTime() - a.mtime.getTime());

    // Return the newest file
    return filesWithStats[0].name;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to get newest file: ${errorMessage}`);
  }
}
