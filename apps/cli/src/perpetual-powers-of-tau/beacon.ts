import { execSync } from "child_process";
import { existsSync, mkdirSync } from "fs";
import { basename, extname, join } from "path";

export async function applyBeaconPerpetualPowersOfTau(
  inputFilePath: string,
  beaconHex: string,
  iterations: number,
  name: string,
): Promise<void> {
  try {
    console.log(`Applying beacon to Powers of Tau file: ${inputFilePath}`);
    console.log(`Beacon: ${beaconHex}`);
    console.log(`Iterations: ${iterations}`);
    console.log(`Name: ${name}`);

    // Check if input file exists
    if (!existsSync(inputFilePath)) {
      console.error(`❌ Error: File does not exist: ${inputFilePath}`);
      console.error(`Please provide a valid path to the .ptau file.`);
      process.exit(1);
    }

    // Validate file extension
    const fileExtension = extname(inputFilePath);
    if (fileExtension !== ".ptau") {
      console.error(`❌ Error: Invalid file extension. Expected .ptau, got: ${fileExtension}`);
      process.exit(1);
    }

    // Validate beacon format (should be hex string)
    const beaconRegex = /^[0-9a-fA-F]+$/;
    if (!beaconRegex.test(beaconHex)) {
      console.error(
        `❌ Error: Invalid beacon format. Expected hexadecimal string, got: ${beaconHex}`,
      );
      process.exit(1);
    }

    // Validate iterations (should be positive number)
    if (iterations <= 0 || !Number.isInteger(iterations)) {
      console.error(`❌ Error: Invalid iterations. Expected positive integer, got: ${iterations}`);
      process.exit(1);
    }

    // Create output directory if it doesn't exist
    const outputDir = "output";
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }

    // Generate output filename based on input filename
    const inputFileName = basename(inputFilePath, ".ptau");
    const outputFile = join(outputDir, `${inputFileName}_beacon.ptau`);

    // Run snarkjs CLI command for beacon
    const command = `npx snarkjs powersoftau beacon ${inputFilePath} ${outputFile} ${beaconHex} ${iterations} -n="${name}"`;
    console.log(`Running: ${command}`);

    execSync(command, { stdio: "inherit" });

    console.log(`✅ Beacon applied successfully: ${outputFile}`);
    console.log(`Input: ${basename(inputFilePath)} -> Output: ${basename(outputFile)}`);
    console.log(`The ceremony is now finalized with the beacon.`);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);

    if (errorMessage.includes("ENOENT: no such file or directory")) {
      console.error(`❌ Error: File path is incorrect or file does not exist.`);
      console.error(`Please check the file path and try again.`);
    } else if (errorMessage.includes("Command failed")) {
      console.error(`❌ Beacon application failed: The command execution failed.`);
      console.error(`Please check your beacon parameters and try again.`);
    } else {
      console.error("❌ Failed to apply beacon to Powers of Tau file:", error);
    }
    process.exit(1);
  }
}
