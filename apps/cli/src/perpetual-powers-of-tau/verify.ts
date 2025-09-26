export async function verifyPerpetualPowersOfTau(ptauFilePath: string): Promise<void> {
  try {
    console.log(`Verifying Powers of Tau file: ${ptauFilePath}`);

    // Check if input file exists
    const fs = await import("fs");
    if (!fs.existsSync(ptauFilePath)) {
      console.error(`❌ Error: File does not exist: ${ptauFilePath}`);
      console.error(`Please provide a valid path to the .ptau file.`);
      process.exit(1);
    }

    // Validate file extension
    const path = await import("path");
    const fileExtension = path.extname(ptauFilePath);
    if (fileExtension !== ".ptau") {
      console.error(`❌ Error: Invalid file extension. Expected .ptau, got: ${fileExtension}`);
      process.exit(1);
    }

    // Run snarkjs CLI command for verification
    const { execSync } = await import("child_process");

    const command = `npx snarkjs powersoftau verify ${ptauFilePath}`;
    console.log(`Running: ${command}`);

    execSync(command, { stdio: "inherit" });

    console.log(`✅ Verification completed for: ${path.basename(ptauFilePath)}`);
    console.log(`The Powers of Tau file is valid and properly formatted.`);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);

    if (errorMessage.includes("ENOENT: no such file or directory")) {
      console.error(`❌ Error: File path is incorrect or file does not exist.`);
      console.error(`Please check the file path and try again.`);
    } else if (errorMessage.includes("Command failed")) {
      console.error(`❌ Verification failed: The Powers of Tau file may be corrupted or invalid.`);
    } else {
      console.error("❌ Failed to verify Powers of Tau file:", error);
    }
    process.exit(1);
  }
}
