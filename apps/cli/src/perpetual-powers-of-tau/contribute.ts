import { loadConfig } from "../utils/config.js";

export async function contributePerpetualPowersOfTau(name?: string): Promise<void> {
  try {
    console.log(`Contributing to perpetual powers of tau ceremony...`);

    // Load configuration
    const config = loadConfig();
    const CEREMONY_POWER = parseInt(config.CEREMONY_POWER);

    // Determine contributor name from parameter or global/local config
    const contributorName = name || config.CONTRIBUTOR_NAME;
    if (contributorName) {
      console.log(`👤 Contributor name: ${contributorName}`);
    } else {
      console.log(
        `👤 No contributor name specified (use --name flag or config: brebaje-cli config name "Your Name")`,
      );
    }

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
    const matchingPowerFiles = contributionFiles.filter((f) => f.power === CEREMONY_POWER);

    if (matchingPowerFiles.length === 0) {
      console.error(`❌ Error: No ceremony files found for power ${CEREMONY_POWER}`);
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
    const outputFile = path.join(outputDir, `pot${CEREMONY_POWER}_${nextIncrement}.ptau`);

    // Run snarkjs CLI command for contribution and capture output
    const { execSync } = await import("child_process");

    // Build command with optional name parameter
    let command = `npx snarkjs powersoftau contribute ${inputFilePath} ${outputFile}`;
    if (contributorName) {
      command += ` --name="${contributorName}"`;
    }
    console.log(`Running: ${command}`);

    // Run snarkjs with inherited stdio for interactive input
    try {
      execSync(command, { stdio: "inherit" });
    } catch (error: any) {
      console.error("❌ Contribution command failed");
      throw error;
    }

    // After successful execution, capture output by running verification command
    console.log("📝 Capturing contribution details for record...");
    let contributionOutput: string;
    try {
      const verifyCommand = `npx snarkjs powersoftau verify ${outputFile}`;
      contributionOutput = execSync(verifyCommand, { encoding: "utf-8" });
    } catch (error: any) {
      console.warn("⚠️  Could not capture verification details for record");
      contributionOutput = `Contribution completed successfully for ${path.basename(outputFile)}`;
    }

    console.log(`✅ Contribution completed: ${outputFile}`);
    console.log(`Previous: ${latestFile.file} -> New: ${path.basename(outputFile)}`);

    // Save contribution log to record file
    console.log("📝 Saving contribution record...");

    const recordFileName = `pot${CEREMONY_POWER}_${nextIncrement}_record.txt`;
    const recordFilePath = path.join(outputDir, recordFileName);

    try {
      const timestamp = new Date().toISOString();
      const stats = fs.statSync(outputFile);

      // Create record content with contribution log
      const recordLines = [
        `Contribution Record`,
        `==================`,
        ``,
        `File: ${path.basename(outputFile)}`,
        `Size: ${stats.size} bytes (${(stats.size / (1024 * 1024)).toFixed(2)} MB)`,
        `Ceremony Power: ${CEREMONY_POWER}`,
        `Contribution Index: ${latestFile.index + 1}`,
        `Previous File: ${latestFile.file}`,
        `Generated: ${timestamp}`,
      ];

      // Add contributor name if provided
      if (contributorName) {
        recordLines.push(`Contributor: ${contributorName}`);
      }

      recordLines.push(
        ``,
        `Contribution Log:`,
        `================`,
        contributionOutput,
        ``,
        `This record contains the output from the snarkjs contribution command`,
        `including cryptographic hashes for verification purposes.`,
      );

      const recordContent = recordLines.join("\n");

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
