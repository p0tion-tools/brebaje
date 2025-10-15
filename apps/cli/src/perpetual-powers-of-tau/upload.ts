export async function uploadPerpetualPowersOfTau(uploadUrl: string): Promise<void> {
  try {
    console.log(`Uploading contribution using pre-signed URL...`);

    const fs = await import("fs");
    const path = await import("path");

    // Check if output directory exists
    const outputDir = "output";
    if (!fs.existsSync(outputDir)) {
      console.error(`❌ Error: Output directory does not exist: ${outputDir}`);
      console.error(`Please make a contribution first using the contribute command.`);
      process.exit(1);
    }

    // Find all .ptau files in output directory
    const files = fs.readdirSync(outputDir);
    const ptauFiles = files.filter((file) => file.endsWith(".ptau"));

    if (ptauFiles.length === 0) {
      console.error(`❌ Error: No .ptau files found in ${outputDir} directory`);
      console.error(`Please make a contribution first using the contribute command.`);
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
      console.error(
        `❌ Error: No valid contribution files found with format pot<power>_<index>.ptau`,
      );
      console.error(`Found files: ${ptauFiles.join(", ")}`);
      process.exit(1);
    }

    // Get the file with highest index
    const latestFile = contributionFiles.reduce((latest, current) =>
      current.index > latest.index ? current : latest,
    );

    const filePath = path.join(outputDir, latestFile.file);
    const fileStats = fs.statSync(filePath);

    console.log(`Found contribution file: ${latestFile.file}`);
    console.log(`File size: ${(fileStats.size / (1024 * 1024)).toFixed(2)} MB`);

    // Check if curl is available
    const { execSync } = await import("child_process");
    const os = await import("os");

    const isWindows = os.platform() === "win32";
    const curlCommand = isWindows ? "curl.exe" : "curl";
    const checkCommand = isWindows ? "where curl.exe" : "which curl";

    try {
      execSync(checkCommand, { stdio: "pipe" });
    } catch {
      console.error("❌ Error: curl is not installed or not available in PATH");
      console.error("Please install curl to upload files:");
      console.error("  Ubuntu/Debian: sudo apt-get install curl");
      console.error("  macOS: curl is pre-installed");
      console.error("  Windows: Run install.ps1 or install via winget install curl.curl");
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
          console.error(`❌ Error: Upload URL has expired!`);
          console.error(`URL expired at: ${expirationDate.toISOString()}`);
          console.error(`Current time: ${now.toISOString()}`);
          console.error(`\n💡 Please generate new URLs with:`);
          console.error(`   brebaje-cli ppot generate-urls <filename>`);
          process.exit(1);
        }

        const timeLeft = Math.floor((expirationDate.getTime() - now.getTime()) / 1000 / 60);
        console.log(`⏰ Upload URL expires in ${timeLeft} minutes`);
      }
    } catch {
      console.error(`❌ Error: Invalid upload URL format: ${uploadUrl}`);
      process.exit(1);
    }

    // Upload file using curl with pre-signed URL
    console.log("📤 Uploading contribution file...");

    const uploadCommand = `${curlCommand} -X PUT -T "${filePath}" --progress-bar "${uploadUrl}"`;
    console.log(`Running: ${uploadCommand}`);

    try {
      execSync(uploadCommand, { stdio: "inherit" });
    } catch (error: any) {
      console.error("❌ Upload failed during file transfer");

      // Check if it's likely an expiration error (common HTTP status codes)
      const errorOutput = error.stderr?.toString() || error.stdout?.toString() || "";
      if (
        errorOutput.includes("403") ||
        errorOutput.includes("Forbidden") ||
        errorOutput.includes("RequestTimeTooSkewed") ||
        errorOutput.includes("expired")
      ) {
        console.error("🕐 This appears to be an expired URL error");
        console.error("💡 Please generate new URLs with:");
        console.error("   brebaje-cli ppot generate-urls <filename>");
      } else {
        console.error("Please check your internet connection and try again");
      }
      process.exit(1);
    }

    console.log("✅ File uploaded successfully!");
    console.log(`📁 Uploaded: ${latestFile.file}`);
    console.log(`📊 Your contribution index: ${latestFile.index}`);
    console.log(`💡 Please notify the ceremony coordinator that your contribution is ready.`);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("❌ Failed to upload contribution:", errorMessage);
    process.exit(1);
  }
}
