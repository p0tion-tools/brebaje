import * as snarkjs from "snarkjs";
import { loadConfig } from "../utils/config.js";

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
    console.log(`Running: ${command}`);

    execSync(command, { stdio: "inherit" });

    console.log(`✅ New ceremony file created: ${outputFile}`);
    console.log(
      `Power: ${CEREMONY_POWER} (supports up to ${Math.pow(2, CEREMONY_POWER)} constraints)`,
    );
    console.log(`Elliptic curve: ${CEREMONY_ELLIPTIC_CURVE}`);
  } catch (error) {
    console.error("❌ Failed to create new ceremony:", error);
    process.exit(1);
  }
}
