import { ScriptLogger } from "../utils/logger.js";
import { status, fileSize, warningBox, infoBox } from "../utils/visual.js";

export async function uploadPerpetualPowersOfTau(uploadUrl: string): Promise<void> {
  const logger = new ScriptLogger("CLI:PPOT:Upload");

  try {
    logger.header("Upload Contribution");
    logger.progress("Starting upload using pre-signed URL...");

    const fs = await import("fs");
    const path = await import("path");

    // Check if output directory exists
    const outputDir = "output";
    if (!fs.existsSync(outputDir)) {
      logger.error(`Output directory does not exist: ${outputDir}`);
      warningBox("Missing Output Directory", [
        "Please make a contribution first using the contribute command.",
      ]);
      process.exit(1);
    }

    // Find all .ptau files in output directory
    const files = fs.readdirSync(outputDir);
    const ptauFiles = files.filter((file) => file.endsWith(".ptau"));

    if (ptauFiles.length === 0) {
      logger.error(`No .ptau files found in ${outputDir} directory`);
      warningBox("No Contribution Files Found", [
        "Please make a contribution first using the contribute command.",
      ]);
      process.exit(1);
    }

    // Find the latest contribution file (highest index)
    const contributionFiles: Array<{ file: string; power: number; index: number }> = [];

    for (const file of ptauFiles) {
      const match = file.match(/pot(\d+)_(\d+)\.ptau/);
      if (match) {
        const power = parseInt(match[1]);
        const index = parseInt(match[2]);
        contributionFiles.push({ file, power, index });
      }
    }

    if (contributionFiles.length === 0) {
      logger.error("No valid contribution files found with format pot<power>_<index>.ptau");
      warningBox("Invalid File Format", [
        `Found files: ${ptauFiles.join(", ")}`,
        "Expected format: pot<power>_<index>.ptau",
      ]);
      process.exit(1);
    }

    // Get the file with highest index
    const latestFile = contributionFiles.reduce((latest, current) =>
      current.index > latest.index ? current : latest,
    );

    const filePath = path.join(outputDir, latestFile.file);
    const fileStats = fs.statSync(filePath);

    status("success", `Found contribution file: ${latestFile.file}`);
    logger.log(`File size: ${fileSize(fileStats.size)}`);

    // Check if curl is available
    const { execSync } = await import("child_process");

    try {
      execSync("which curl", { stdio: "pipe" });
    } catch {
      logger.error("curl is not installed or not available in PATH");
      warningBox("Missing Dependency", [
        "Please install curl to upload files:",
        "  Ubuntu/Debian: sudo apt-get install curl",
        "  macOS: curl is pre-installed",
        "  Windows: Download from https://curl.se/windows/",
      ]);
      process.exit(1);
    }

    // Validate pre-signed URL and check expiration
    try {
      const url = new URL(uploadUrl);

      // Check if URL has expiration parameter
      const expires = url.searchParams.get("X-Amz-Expires");
      const date = url.searchParams.get("X-Amz-Date");

      if (expires && date) {
        // Parse expiration: X-Amz-Date format is YYYYMMDDTHHMMSSZ
        const year = parseInt(date.substring(0, 4));
        const month = parseInt(date.substring(4, 6)) - 1; // Month is 0-indexed
        const day = parseInt(date.substring(6, 8));
        const hour = parseInt(date.substring(9, 11));
        const minute = parseInt(date.substring(11, 13));
        const second = parseInt(date.substring(13, 15));

        const urlDate = new Date(Date.UTC(year, month, day, hour, minute, second));
        const expirationDate = new Date(urlDate.getTime() + parseInt(expires) * 1000);
        const now = new Date();

        if (now >= expirationDate) {
          logger.error("Upload URL has expired!");
          warningBox("URL Expired", [
            `URL expired at: ${expirationDate.toISOString()}`,
            `Current time: ${now.toISOString()}`,
            "",
            "Please generate new URLs with:",
            "   brebaje-cli ppot generate-urls <filename>",
          ]);
          process.exit(1);
        }

        const timeLeft = Math.floor((expirationDate.getTime() - now.getTime()) / 1000 / 60);
        status("warning", `Upload URL expires in ${timeLeft} minutes`);
      }
    } catch {
      logger.error(`Invalid upload URL format: ${uploadUrl}`);
      process.exit(1);
    }

    // Upload file using curl with pre-signed URL
    status("running", "Uploading contribution file...");

    const uploadCommand = `curl -X PUT -T "${filePath}" --progress-bar "${uploadUrl}"`;
    logger.log(`Running: ${uploadCommand}`);

    try {
      execSync(uploadCommand, { stdio: "inherit" });
    } catch (error: any) {
      logger.error("Upload failed during file transfer");

      // Check if it's likely an expiration error (common HTTP status codes)
      const errorOutput = error.stderr?.toString() || error.stdout?.toString() || "";
      if (
        errorOutput.includes("403") ||
        errorOutput.includes("Forbidden") ||
        errorOutput.includes("RequestTimeTooSkewed") ||
        errorOutput.includes("expired")
      ) {
        warningBox("URL Expired", [
          "This appears to be an expired URL error",
          "",
          "Please generate new URLs with:",
          "   brebaje-cli ppot generate-urls <filename>",
        ]);
      } else {
        warningBox("Upload Failed", ["Please check your internet connection and try again"]);
      }
      process.exit(1);
    }

    logger.success("File uploaded successfully!");

    infoBox("Upload Complete", [
      `Uploaded: ${latestFile.file}`,
      `Your contribution index: ${latestFile.index}`,
      "",
      "Please notify the ceremony coordinator that your contribution is ready.",
    ]);
  } catch (error) {
    logger.error("Failed to upload contribution", error instanceof Error ? error : undefined);
    process.exit(1);
  }
}
