/**
 * Gets the newest file from a directory that matches the filter string
 * @param directory - Directory path to search in
 * @param filterString - String to filter files (e.g., "_record.txt")
 * @returns The newest matching file name, or null if no files found
 */
import fs from "fs";
import path from "path";

export function getNewerFile(directory: string, filterString: string): string | null {
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

/**
 * Gets ceremony URLs JSON file from input directory with comprehensive validation
 * @param inputDir - Input directory path (default: "input")
 * @param providedPath - Optional specific file path to use instead of searching
 * @returns Full path to the valid ceremony URLs JSON file
 * @throws Error with specific user guidance if file not found or invalid
 */
export function getUrlsJson(inputDir: string = "input", providedPath?: string): string {
  let ceremonyUrlsPath: string;

  if (providedPath) {
    // Use provided path
    ceremonyUrlsPath = providedPath;
  } else {
    // Check input folder for ceremony-urls JSON files
    if (!fs.existsSync(inputDir)) {
      console.error(
        `❌ Error: No ceremony URLs JSON file provided and ${inputDir}/ folder not found`,
      );
      console.error(`Please either:`);
      console.error(`  1. Provide JSON file path as argument`);
      console.error(`  2. Place ceremony URLs JSON file in ${inputDir}/ folder`);
      process.exit(1);
    }

    const jsonFiles = fs
      .readdirSync(inputDir)
      .filter((file: string) => file.startsWith("ceremony-urls-") && file.endsWith(".json"));

    if (jsonFiles.length === 0) {
      console.error(`❌ Error: No ceremony URLs JSON file found in ${inputDir}/ folder`);
      console.error(`Please either:`);
      console.error(`  1. Provide JSON file path as argument`);
      console.error(
        `  2. Generate URLs: brebaje-cli ppot generate-urls <filename> -o ${inputDir}/ceremony-urls-<name>.json`,
      );
      process.exit(1);
    }

    if (jsonFiles.length > 1) {
      console.warn(`⚠️ Multiple ceremony URLs JSON files found in ${inputDir}/ folder:`);
      jsonFiles.forEach((file: string) => console.warn(`  - ${file}`));
      console.log(`📅 Automatically selecting the newest file...`);

      // Use getNewerFile to select the newest ceremony URLs file
      const newestFile = getNewerFile(inputDir, jsonFiles[0]);
      if (!newestFile) {
        console.error(`❌ Error: Could not determine newest ceremony URLs file`);
        process.exit(1);
      }

      ceremonyUrlsPath = path.join(inputDir, newestFile);
      console.log(`✅ Using newest file: ${newestFile}`);
    } else {
      ceremonyUrlsPath = path.join(inputDir, jsonFiles[0]);
    }
  }

  // Check if file exists
  if (!fs.existsSync(ceremonyUrlsPath)) {
    console.error(`❌ Error: Ceremony URLs file not found: ${ceremonyUrlsPath}`);
    process.exit(1);
  }

  return ceremonyUrlsPath;
}
