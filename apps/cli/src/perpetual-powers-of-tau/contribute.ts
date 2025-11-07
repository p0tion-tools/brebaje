import { execSync } from "child_process";
import { loadConfig } from "../utils/config.js";
import crypto from "crypto";
import { existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from "fs";
import { basename, join } from "path";
import readline from "readline";

/**
 * Validates user-provided entropy input for strength
 */
function validateUserEntropy(input: string): { valid: boolean; warnings: string[] } {
  const warnings: string[] = [];
  const MIN_LENGTH = 60;

  // Check minimum length
  if (input.length < MIN_LENGTH) {
    return { valid: false, warnings: [`Input must be at least ${MIN_LENGTH} characters`] };
  }

  // Check for common weak patterns
  const weakPatterns = [
    { pattern: /^(.)\1+$/, message: "Avoid repeating the same character" },
    { pattern: /^(01|10|012|123|234|345|456|567|678|789)+$/, message: "Avoid simple sequences" },
    { pattern: /^(abc|xyz|qwerty|asdf)+/i, message: "Avoid keyboard patterns" },
    { pattern: /^(password|secret|random|entropy)/i, message: "Avoid common words" },
  ];

  for (const { pattern, message } of weakPatterns) {
    if (pattern.test(input)) {
      warnings.push(`⚠️  Weak pattern detected: ${message}`);
    }
  }

  return { valid: true, warnings };
}

/**
 * Generates secure entropy by combining user input with OS randomness
 */
async function generateSecureEntropy(): Promise<string> {
  return new Promise((resolve, reject) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    console.log("\n🔐 Secure Entropy Generation");
    console.log("━".repeat(50));
    console.log("Your input will be combined with OS randomness and hashed.");
    console.log("This ensures maximum entropy for your contribution.\n");

    rl.question("Please provide random text (minimum 60 characters):\n> ", (userInput) => {
      rl.close();

      // Validate user input
      const validation = validateUserEntropy(userInput);

      if (!validation.valid) {
        console.error(`\n❌ ${validation.warnings[0]}`);
        reject(new Error(validation.warnings[0]));
        return;
      }

      // Show warnings but continue
      if (validation.warnings.length > 0) {
        validation.warnings.forEach((warning) => console.warn(warning));
        console.log("Consider using a more random input for better security.\n");
      }

      try {
        // Get high-resolution timestamp (nanoseconds since process start)
        const timestamp = process.hrtime.bigint().toString();

        // Generate 256 bytes (2048 bits) of OS randomness (equivalent to xxd -p -l 256 /dev/urandom)
        const osRandom = crypto.randomBytes(256);

        // Combine timestamp + user input + OS randomness
        const combined = timestamp + userInput + osRandom.toString("hex");

        // Hash with SHA256
        const entropyHash = crypto.createHash("sha256").update(combined).digest("hex");

        // Clear sensitive data from memory (best effort)
        userInput = "";

        console.log("✅ Adding high-resolution timestamp...");
        console.log("✅ Combining with OS randomness...");
        console.log("✅ Entropy generated successfully\n");

        resolve(entropyHash);
      } catch (error) {
        console.error("❌ Failed to generate entropy:", error);
        reject(error);
      }
    });
  });
}

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

    // Check if input directory exists
    const inputDir = "input";
    if (!existsSync(inputDir)) {
      console.error(`❌ Error: Input directory does not exist: ${inputDir}`);
      console.error(`Please download a challenge file first using the download command.`);
      process.exit(1);
    }

    // Find all .ptau files in input directory
    const files = readdirSync(inputDir);
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

    const inputFilePath = join(inputDir, latestFile.file);
    console.log(`Found latest contribution file: ${latestFile.file}`);
    console.log(`Input file: ${inputFilePath}`);

    const outputDir = "output";
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }

    // Calculate next increment
    const nextIncrement = (latestFile.index + 1).toString().padStart(4, "0");
    const outputFile = join(outputDir, `pot${CEREMONY_POWER}_${nextIncrement}.ptau`);

    // Generate secure entropy
    let entropy: string;
    try {
      entropy = await generateSecureEntropy();
    } catch (error) {
      console.error("❌ Entropy generation failed");
      throw error;
    }

    // Run snarkjs CLI command for contribution and capture output

    // Build command with name and entropy parameters
    let command = `npx snarkjs powersoftau contribute ${inputFilePath} ${outputFile}`;
    if (contributorName) {
      command += ` --name="${contributorName}"`;
    }
    command += ` -e="${entropy}"`;

    console.log(
      `Running: npx snarkjs powersoftau contribute ${inputFilePath} ${outputFile}${contributorName ? ` --name="${contributorName}"` : ""} -e=[REDACTED]`,
    );

    // Run snarkjs with piped stdio
    try {
      execSync(command, { stdio: "pipe" });
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
      contributionOutput = `Contribution completed successfully for ${basename(outputFile)}`;
    }

    console.log(`✅ Contribution completed: ${outputFile}`);
    console.log(`Previous: ${latestFile.file} -> New: ${basename(outputFile)}`);

    // Save contribution log to record file
    console.log("📝 Saving contribution record...");

    const recordFileName = `pot${CEREMONY_POWER}_${nextIncrement}_record.txt`;
    const recordFilePath = join(outputDir, recordFileName);

    try {
      const timestamp = new Date().toISOString();
      const stats = statSync(outputFile);

      // Create record content with contribution log
      const recordLines = [
        `Contribution Record`,
        `==================`,
        ``,
        `File: ${basename(outputFile)}`,
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
      writeFileSync(recordFilePath, recordContent, "utf-8");

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
