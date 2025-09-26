import { Command } from "commander";
import { config } from "dotenv";
import * as snarkjs from "snarkjs";

// Load environment variables
config();

// Environment variables
const CEREMONY_POWER = parseInt(process.env.CEREMONY_POWER || "12");
const CEREMONY_ELLIPTIC_CURVE = process.env.CEREMONY_ELLIPTIC_CURVE || "bn128";

export function setUpPerpetualPowersOfTau(program: Command): void {
  const ppotCommand = program
    .command("perpetual-powers-of-tau")
    .alias("ppot")
    .description("Perpetual Powers of Tau ceremony commands");

  ppotCommand
    .command("new")
    .description("Initialize a new perpetual powers of tau ceremony")
    .action(async () => {
      const { newPerpetualPowersOfTau } = await import("./new.js");
      await newPerpetualPowersOfTau();
    });

  ppotCommand
    .command("download")
    .description("Download a Powers of Tau file from URL")
    .argument("<url>", "URL to download the .ptau file from")
    .action(async (url: string) => {
      const { downloadPerpetualPowersOfTau } = await import("./download.js");
      await downloadPerpetualPowersOfTau(url);
    });

  ppotCommand
    .command("contribute")
    .description("Make a contribution to the perpetual powers of tau ceremony")
    .action(async () => {
      const { contributePerpetualPowersOfTau } = await import("./contribute.js");
      await contributePerpetualPowersOfTau();
    });

  ppotCommand
    .command("upload")
    .description("Upload contribution file using pre-signed URL")
    .argument("<uploadUrl>", "Pre-signed URL for uploading the contribution file")
    .action(async (uploadUrl: string) => {
      const { uploadPerpetualPowersOfTau } = await import("./upload.js");
      await uploadPerpetualPowersOfTau(uploadUrl);
    });

  ppotCommand
    .command("verify")
    .description("Verify a Powers of Tau file")
    .argument("<ptauFile>", "Path to the .ptau file to verify")
    .action(async (ptauFile: string) => {
      const { verifyPerpetualPowersOfTau } = await import("./verify.js");
      await verifyPerpetualPowersOfTau(ptauFile);
    });

  ppotCommand
    .command("beacon")
    .description("Apply beacon to finalize a Powers of Tau ceremony")
    .argument("<inputFile>", "Path to the input .ptau file")
    .argument("<beacon>", "Beacon value in hexadecimal format")
    .argument("<iterations>", "Number of iterations", (value) => parseInt(value, 10))
    .argument("<name>", "Name for the beacon (in quotes)")
    .action(async (inputFile: string, beacon: string, iterations: number, name: string) => {
      const { applyBeaconPerpetualPowersOfTau } = await import("./beacon.js");
      await applyBeaconPerpetualPowersOfTau(inputFile, beacon, iterations, name);
    });
}
