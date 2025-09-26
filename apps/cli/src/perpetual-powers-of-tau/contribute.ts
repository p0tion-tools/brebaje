import { config } from "dotenv";

// Load environment variables
config();

// Environment variables
const CEREMONY_POWER = parseInt(process.env.CEREMONY_POWER || "12");

export async function contributePerpetualPowersOfTau(): Promise<void> {
  try {
    console.log(`Contributing to perpetual powers of tau ceremony...`);

    const fs = await import("fs");
    const path = await import("path");

    // Check if input directory exists
    const inputDir = "input";
    if (!fs.existsSync(inputDir)) {
      console.error(`❌ Error: Input directory does not exist: ${inputDir}`);
      console.error(`Please download a challenge file first using the download command.`);
      process.exit(1);
    }

    // Find all .ptau files in input directory
    const files = fs.readdirSync(inputDir);
    const ptauFiles = files.filter((file) => file.endsWith(".ptau"));

    if (ptauFiles.length === 0) {
      console.error(`❌ Error: No .ptau files found in ${inputDir} directory`);
      console.error(`Please download a challenge file first using the download command.`);
      process.exit(1);
    }

    // Parse ceremony power and contribution index from filenames
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
      console.error(`❌ Error: No valid ceremony files found with format pot<power>_<index>.ptau`);
      console.error(`Found files: ${ptauFiles.join(", ")}`);
      process.exit(1);
    }

    // Find the file with highest contribution index for the ceremony power
    const ceremonyPower = parseInt(process.env.CEREMONY_POWER || "12");
    const matchingPowerFiles = contributionFiles.filter((f) => f.power === ceremonyPower);

    if (matchingPowerFiles.length === 0) {
      console.error(`❌ Error: No ceremony files found for power ${ceremonyPower}`);
      console.error(
        `Available powers: ${[...new Set(contributionFiles.map((f) => f.power))].join(", ")}`,
      );
      console.error(`You can change CEREMONY_POWER in your .env file if needed.`);
      process.exit(1);
    }

    // Get the file with highest index
    const latestFile = matchingPowerFiles.reduce((latest, current) =>
      current.index > latest.index ? current : latest,
    );

    const inputFilePath = path.join(inputDir, latestFile.file);
    console.log(`Found latest contribution file: ${latestFile.file}`);
    console.log(`Input file: ${inputFilePath}`);

    const outputDir = "output";
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Calculate next increment
    const nextIncrement = (latestFile.index + 1).toString().padStart(4, "0");
    const outputFile = path.join(outputDir, `pot${ceremonyPower}_${nextIncrement}.ptau`);

    // Run snarkjs CLI command for contribution and capture output
    const { execSync } = await import("child_process");

    const command = `npx snarkjs powersoftau contribute ${inputFilePath} ${outputFile}`;
    console.log(`Running: ${command}`);

    // Capture the output from snarkjs contribution
    let contributionOutput: string;
    try {
      contributionOutput = execSync(command, { encoding: "utf-8" });
      console.log(contributionOutput); // Display output to user
    } catch (error: any) {
      // If execSync fails, still try to get output from stderr
      contributionOutput = error.stdout || error.stderr || "Contribution command failed";
      throw error;
    }

    console.log(`✅ Contribution completed: ${outputFile}`);
    console.log(`Previous: ${latestFile.file} -> New: ${path.basename(outputFile)}`);

    // Save contribution log to record file
    console.log("📝 Saving contribution record...");

    const recordFileName = `pot${ceremonyPower}_${nextIncrement}_record.txt`;
    const recordFilePath = path.join(outputDir, recordFileName);

    try {
      const timestamp = new Date().toISOString();
      const stats = fs.statSync(outputFile);

      // Create record content with contribution log
      const recordContent = [
        `Contribution Record`,
        `==================`,
        ``,
        `File: ${path.basename(outputFile)}`,
        `Size: ${stats.size} bytes (${(stats.size / (1024 * 1024)).toFixed(2)} MB)`,
        `Ceremony Power: ${ceremonyPower}`,
        `Contribution Index: ${latestFile.index + 1}`,
        `Previous File: ${latestFile.file}`,
        `Generated: ${timestamp}`,
        ``,
        `Contribution Log:`,
        `================`,
        contributionOutput,
        ``,
        `This record contains the output from the snarkjs contribution command`,
        `including cryptographic hashes for verification purposes.`,
      ].join("\n");

      // Write record file
      fs.writeFileSync(recordFilePath, recordContent, "utf-8");

      console.log(`✅ Contribution record saved: ${recordFileName}`);
    } catch (error) {
      console.warn(`⚠️  Warning: Failed to save contribution record file`);
      console.warn(`Error: ${error}`);
      console.warn(`Your contribution is still valid, but manual verification may be needed.`);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);

    if (errorMessage.includes("ENOENT: no such file or directory")) {
      console.warn(`⚠️  Warning: Input file path is incorrect or file does not exist.`);
      console.warn(`Please check the file path and try again.`);
    } else {
      console.error("❌ Failed to contribute to ceremony:", error);
    }
    process.exit(1);
  }
}
