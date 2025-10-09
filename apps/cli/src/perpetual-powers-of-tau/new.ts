import * as snarkjs from "snarkjs";
import { loadConfig } from "../utils/config.js";
import { banner } from "../utils/visual.js";
import { ScriptLogger } from "../utils/logger.js";
import { log } from "console";

export async function newPerpetualPowersOfTau(): Promise<void> {
  const logger = new ScriptLogger("CLI:PPOT:New");

  try {
    // Load configuration from global/local config
    const config = loadConfig();
    const CEREMONY_POWER = parseInt(config.CEREMONY_POWER);
    const CEREMONY_ELLIPTIC_CURVE = config.CEREMONY_ELLIPTIC_CURVE;

    banner(
      `Creating new Perpetual Powers of Tau ceremony`,
      `Up to 2^${CEREMONY_POWER} using ${CEREMONY_ELLIPTIC_CURVE} curve...`,
    );

    // Create output directory if it doesn't exist
    const fs = await import("fs");
    const path = await import("path");

    const outputDir = "output";
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputFile = path.join(outputDir, `pot${CEREMONY_POWER}_0000.ptau`);

    // Run snarkjs CLI command
    const { execSync } = await import("child_process");

    const command = `npx snarkjs powersoftau new ${CEREMONY_ELLIPTIC_CURVE} ${CEREMONY_POWER} ${outputFile}`;
    logger.info(`Running: ${command}`);

    // Capture command output
    let ceremonyOutput: string;
    try {
      ceremonyOutput = execSync(command, { encoding: "utf-8" });
    } catch (error: any) {
      logger.failure("❌ Ceremony creation command failed:", error);
      throw error;
    }

    logger.success(`New ceremony file created: ${outputFile}`);
    logger.info(
      `Power: ${CEREMONY_POWER} (supports up to ${Math.pow(2, CEREMONY_POWER)} constraints)`,
    );
    logger.info(`Elliptic curve: ${CEREMONY_ELLIPTIC_CURVE}`);

    // Save ceremony initialization log to record file
    logger.info("📝 Saving ceremony initialization record...");

    const recordFileName = `pot${CEREMONY_POWER}_0000_init_record.txt`;
    const recordFilePath = path.join(outputDir, recordFileName);

    try {
      const timestamp = new Date().toISOString();
      const stats = fs.statSync(outputFile);

      // Create record content with ceremony initialization log
      const recordLines = [
        `Ceremony Initialization Record`,
        `============================`,
        ``,
        `File: ${path.basename(outputFile)}`,
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
      fs.writeFileSync(recordFilePath, recordContent, "utf-8");

      logger.success(`Initialization record saved: ${recordFileName}`);
    } catch (error) {
      logger.failure(`❌ Failed to save initialization record file:`, error);
      logger.error(`Error: ${error}`);
      //logger.error(`Your ceremony file is still valid.`);
      process.exit(1);
    }
  } catch (error) {
    logger.failure("❌ Failed to create new ceremony:", error);
    logger.error(`Error: ${error}`);
    process.exit(1);
  }
}
