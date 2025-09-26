import { config } from "dotenv";

// Load environment variables
config();

// Environment variables
const CEREMONY_POWER = parseInt(process.env.CEREMONY_POWER || "12");

export async function contributePerpetualPowersOfTau(inputFilePath: string): Promise<void> {
  try {
    console.log(`Contributing to perpetual powers of tau ceremony...`);
    console.log(`Input file: ${inputFilePath}`);

    // Create output directory if it doesn't exist
    const fs = await import("fs");
    const path = await import("path");

    // Check if input file exists
    if (!fs.existsSync(inputFilePath)) {
      console.warn(`⚠️  Warning: Input file does not exist: ${inputFilePath}`);
      console.warn(`Please provide a valid path to the previous contribution file.`);
      process.exit(1);
    }

    const outputDir = "output";
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Extract current increment from input file name
    const inputFileName = path.basename(inputFilePath);
    const match = inputFileName.match(/pot\d+_(\d+)\.ptau/);

    if (!match) {
      throw new Error(
        `Invalid input file format. Expected: pot<power>_<number>.ptau, got: ${inputFileName}`,
      );
    }

    const currentIncrement = parseInt(match[1]);
    const nextIncrement = (currentIncrement + 1).toString().padStart(4, "0");

    const outputFile = path.join(outputDir, `pot${CEREMONY_POWER}_${nextIncrement}.ptau`);

    // Run snarkjs CLI command for contribution
    const { execSync } = await import("child_process");

    const command = `npx snarkjs powersoftau contribute ${inputFilePath} ${outputFile}`;
    console.log(`Running: ${command}`);

    execSync(command, { stdio: "inherit" });

    console.log(`✅ Contribution completed: ${outputFile}`);
    console.log(`Previous: ${inputFileName} -> New: ${path.basename(outputFile)}`);
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
