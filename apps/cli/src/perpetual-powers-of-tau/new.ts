/* eslint-disable @typescript-eslint/no-explicit-any */

import { loadConfig } from "../utils/config.js";
import { existsSync, mkdirSync, statSync, writeFileSync } from "fs";
import { basename, join } from "path";
import { execSync } from "child_process";

export async function newPerpetualPowersOfTau(): Promise<void> {
  try {
    // Load configuration from global/local config
    const config = loadConfig();
    const CEREMONY_POWER = parseInt(config.CEREMONY_POWER);
    const CEREMONY_ELLIPTIC_CURVE = config.CEREMONY_ELLIPTIC_CURVE;

    console.log(
      `Creating new Powers of Tau ceremony with power ${CEREMONY_POWER} and curve ${CEREMONY_ELLIPTIC_CURVE}...`,
    );

    // Create output directory if it doesn't exist
    const outputDir = "output";
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }

    const outputFile = join(outputDir, `pot${CEREMONY_POWER}_0000.ptau`);

    // Run snarkjs CLI command
    const command = `npx snarkjs powersoftau new ${CEREMONY_ELLIPTIC_CURVE} ${CEREMONY_POWER} ${outputFile}`;
    console.log(`Running: ${command}`);

    // Capture command output
    let ceremonyOutput: string;
    try {
      ceremonyOutput = execSync(command, { encoding: "utf-8" });
    } catch (error: any) {
      console.error("❌ Ceremony creation command failed");
      throw error;
    }

    console.log(`✅ New ceremony file created: ${outputFile}`);
    console.log(
      `Power: ${CEREMONY_POWER} (supports up to ${Math.pow(2, CEREMONY_POWER)} constraints)`,
    );
    console.log(`Elliptic curve: ${CEREMONY_ELLIPTIC_CURVE}`);

    // Save ceremony initialization log to record file
    console.log("📝 Saving ceremony initialization record...");

    const recordFileName = `pot${CEREMONY_POWER}_0000_init_record.txt`;
    const recordFilePath = join(outputDir, recordFileName);

    try {
      const timestamp = new Date().toISOString();
      const stats = statSync(outputFile);

      // Create record content with ceremony initialization log
      const recordLines = [
        `Ceremony Initialization Record`,
        `============================`,
        ``,
        `File: ${basename(outputFile)}`,
        `Size: ${stats.size} bytes (${(stats.size / (1024 * 1024)).toFixed(2)} MB)`,
        `Ceremony Power: ${CEREMONY_POWER}`,
        `Elliptic Curve: ${CEREMONY_ELLIPTIC_CURVE}`,
        `Constraints Supported: ${Math.pow(2, CEREMONY_POWER)}`,
        `Generated: ${timestamp}`,
        ``,
        `Initialization Log:`,
        `==================`,
        ceremonyOutput,
        ``,
        `This record contains the output from the snarkjs new command`,
        `including the initial challenge hash for verification purposes.`,
      ];

      const recordContent = recordLines.join("\n");

      // Write record file
      writeFileSync(recordFilePath, recordContent, "utf-8");

      console.log(`✅ Initialization record saved: ${recordFileName}`);
    } catch (error) {
      console.warn(`⚠️  Warning: Failed to save initialization record file`);
      console.warn(`Error: ${error}`);
      console.warn(`Your ceremony file is still valid.`);
    }
  } catch (error) {
    console.error("❌ Failed to create new ceremony:", error);
    process.exit(1);
  }
}
