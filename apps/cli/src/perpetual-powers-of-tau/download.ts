import { ScriptLogger } from "../utils/logger.js";
import { status, fileSize, warningBox, infoBox, link } from "../utils/visual.js";

export async function downloadPerpetualPowersOfTau(url: string): Promise<void> {
  const logger = new ScriptLogger("CLI:PPOT:Download");

  try {
    logger.header("Download Powers of Tau");
    link("Downloading from", url);

    // Validate URL format and check expiration
    try {
      const urlObj = new URL(url);

      // Check if URL has expiration parameter (AWS pre-signed URL)
      const expires = urlObj.searchParams.get("X-Amz-Expires");
      const date = urlObj.searchParams.get("X-Amz-Date");

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
          logger.error("Download URL has expired!");
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
        status("warning", `Download URL expires in ${timeLeft} minutes`);
      }
    } catch {
      logger.error(`Invalid URL format: ${url}`);
      process.exit(1);
    }

    // Create output directory if it doesn't exist
    const fs = await import("fs");
    const path = await import("path");

    const outputDir = "input";
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Extract filename from URL
    const urlPath = new URL(url).pathname;
    const filename = path.basename(urlPath);

    if (!filename || !filename.includes(".")) {
      logger.error(`Cannot extract filename from URL: ${url}`);
      warningBox("Invalid Filename", ["Please provide a URL with a valid filename"]);
      process.exit(1);
    }

    const outputFile = path.join(outputDir, filename);

    // Check if wget is available
    const { execSync } = await import("child_process");

    try {
      execSync("which wget", { stdio: "pipe" });
    } catch {
      logger.error("wget is not installed or not available in PATH");
      warningBox("Missing Dependency", [
        "Please install wget to download files:",
        "  Ubuntu/Debian: sudo apt-get install wget",
        "  macOS: brew install wget",
        "  Windows: Download from https://eternallybored.org/misc/wget/",
      ]);
      process.exit(1);
    }

    // Check if output file already exists
    if (fs.existsSync(outputFile)) {
      status("warning", `File already exists: ${outputFile}`);
      logger.log("Using --continue to resume download if incomplete...");
    }

    // Run wget command with progress bar and resume capability
    const command = `wget --continue --progress=bar --show-progress -O "${outputFile}" "${url}"`;
    status("running", "Starting download...");
    logger.log(`Running: ${command}`);

    execSync(command, { stdio: "inherit" });

    // Verify file was downloaded and has content
    const stats = fs.statSync(outputFile);
    if (stats.size === 0) {
      logger.error(`Downloaded file is empty: ${outputFile}`);
      fs.unlinkSync(outputFile); // Clean up empty file
      process.exit(1);
    }

    logger.success("Download completed successfully!");

    const fileExtension = path.extname(outputFile);
    const isValidPtau = fileExtension === ".ptau";

    infoBox("Download Complete", [
      `File: ${outputFile}`,
      `Size: ${fileSize(stats.size)}`,
      `Extension: ${fileExtension}`,
      isValidPtau ? "✓ Valid .ptau file" : `⚠ Warning: Not a .ptau file (${fileExtension})`,
    ]);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);

    if (
      errorMessage.includes("Name or service not known") ||
      errorMessage.includes("Host not found")
    ) {
      logger.error("Network Error: Cannot reach the download URL");
      warningBox("Network Error", ["Please check your internet connection and URL validity"]);
    } else if (errorMessage.includes("404")) {
      logger.error("File not found (404) at the specified URL");
    } else if (errorMessage.includes("403")) {
      logger.error("Access forbidden (403) - likely expired URL");
      warningBox("Access Forbidden", [
        "This is likely an expired URL",
        "",
        "Please generate new URLs with:",
        "   brebaje-cli ppot generate-urls <filename>",
      ]);
    } else if (errorMessage.includes("Command failed")) {
      logger.error("Download failed: wget command execution failed");
      warningBox("Download Failed", ["Please check the URL and your network connection"]);
    } else {
      logger.error(
        "Failed to download Powers of Tau file",
        error instanceof Error ? error : undefined,
      );
    }
    process.exit(1);
  }
}
