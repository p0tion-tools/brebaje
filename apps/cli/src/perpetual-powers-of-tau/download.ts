export async function downloadPerpetualPowersOfTau(url: string): Promise<void> {
  try {
    console.log(`Downloading Powers of Tau file from: ${url}`);

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
          console.error(`❌ Error: Download URL has expired!`);
          console.error(`URL expired at: ${expirationDate.toISOString()}`);
          console.error(`Current time: ${now.toISOString()}`);
          console.error(`\n💡 Please generate new URLs with:`);
          console.error(`   brebaje-cli ppot generate-urls <filename>`);
          process.exit(1);
        }

        const timeLeft = Math.floor((expirationDate.getTime() - now.getTime()) / 1000 / 60);
        console.log(`⏰ Download URL expires in ${timeLeft} minutes`);
      }
    } catch {
      console.error(`❌ Error: Invalid URL format: ${url}`);
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
      console.error(`❌ Error: Cannot extract filename from URL: ${url}`);
      console.error(`Please provide a URL with a valid filename`);
      process.exit(1);
    }

    const outputFile = path.join(outputDir, filename);

    // Check if wget is available
    const { execSync } = await import("child_process");

    try {
      execSync("which wget", { stdio: "pipe" });
    } catch {
      console.error("❌ Error: wget is not installed or not available in PATH");
      console.error("Please install wget to download files:");
      console.error("  Ubuntu/Debian: sudo apt-get install wget");
      console.error("  macOS: brew install wget");
      console.error("  Windows: Download from https://eternallybored.org/misc/wget/");
      process.exit(1);
    }

    // Check if output file already exists
    if (fs.existsSync(outputFile)) {
      console.log(`⚠️  File already exists: ${outputFile}`);
      console.log(`Using --continue to resume download if incomplete...`);
    }

    // Run wget command with progress bar and resume capability
    const command = `wget --continue --progress=bar --show-progress -O "${outputFile}" "${url}"`;
    console.log(`Running: ${command}`);

    execSync(command, { stdio: "inherit" });

    // Verify file was downloaded and has content
    const stats = fs.statSync(outputFile);
    if (stats.size === 0) {
      console.error(`❌ Error: Downloaded file is empty: ${outputFile}`);
      fs.unlinkSync(outputFile); // Clean up empty file
      process.exit(1);
    }

    console.log(`✅ Download completed successfully: ${outputFile}`);
    console.log(`File size: ${(stats.size / (1024 * 1024)).toFixed(2)} MB`);

    // Verify it's a .ptau file
    const fileExtension = path.extname(outputFile);
    if (fileExtension === ".ptau") {
      console.log(`✅ File appears to be a valid .ptau file`);
    } else {
      console.log(`⚠️  Warning: File extension is not .ptau (${fileExtension})`);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);

    if (
      errorMessage.includes("Name or service not known") ||
      errorMessage.includes("Host not found")
    ) {
      console.error(`❌ Network Error: Cannot reach the download URL`);
      console.error(`Please check your internet connection and URL validity`);
    } else if (errorMessage.includes("404")) {
      console.error(`❌ Error: File not found (404) at the specified URL`);
    } else if (errorMessage.includes("403")) {
      console.error(`❌ Error: Access forbidden (403) - likely expired URL`);
      console.error(`💡 Please generate new URLs with:`);
      console.error(`   brebaje-cli ppot generate-urls <filename>`);
    } else if (errorMessage.includes("Command failed")) {
      console.error(`❌ Download failed: wget command execution failed`);
      console.error(`Please check the URL and your network connection`);
    } else {
      console.error("❌ Failed to download Powers of Tau file:", error);
    }
    process.exit(1);
  }
}
