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
    .command("auto-contribute")
    .description("Complete contribution process: download → contribute → upload → post-record")
    .action(async () => {
      const { autoContributePerpetualPowersOfTau } = await import("./auto-contribute.js");
      await autoContributePerpetualPowersOfTau();
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
    .command("post-record")
    .alias("pt")
    .description("Post contribution record to GitHub Gist")
    .option("-t, --token <token>", "GitHub personal access token")
    .action(async (options: { token?: string }) => {
      const { postRecordPerpetualPowersOfTau } = await import("./post-record.js");
      await postRecordPerpetualPowersOfTau(options.token);
    });

  ppotCommand
    .command("generate-upload-url")
    .description("Generate pre-signed URL for uploading contribution (coordinators only)")
    .argument("<filename>", "Filename for the contribution file (e.g., pot12_0005.ptau)")
    .option(
      "-e, --expiration <minutes>",
      "URL expiration time in minutes (default: 60)",
      (value) => parseInt(value, 10),
      60,
    )
    .action(async (filename: string, options: { expiration: number }) => {
      const { generateUploadUrlPerpetualPowersOfTau } = await import("./generate-upload-url.js");
      await generateUploadUrlPerpetualPowersOfTau(filename, options.expiration);
    });

  ppotCommand
    .command("generate-download-url")
    .description("Generate pre-signed URL for downloading challenge file (coordinators only)")
    .argument("<filename>", "Filename for the challenge file (e.g., pot12_0005.ptau)")
    .option(
      "-e, --expiration <minutes>",
      "URL expiration time in minutes (default: 1440 = 24 hours)",
      (value) => parseInt(value, 10),
      1440,
    )
    .action(async (filename: string, options: { expiration: number }) => {
      const { generateDownloadUrlPerpetualPowersOfTau } = await import(
        "./generate-download-url.js"
      );
      await generateDownloadUrlPerpetualPowersOfTau(filename, options.expiration);
    });

  ppotCommand
    .command("generate-urls")
    .description(
      "Generate both download and upload URLs for ceremony coordination (coordinators only)",
    )
    .argument("<downloadFilename>", "Filename to download (e.g., pot12_0005.ptau)")
    .option(
      "--download-expiration <minutes>",
      "Download URL expiration time in minutes (default: 1440 = 24 hours)",
      (value) => parseInt(value, 10),
      1440,
    )
    .option(
      "--upload-expiration <minutes>",
      "Upload URL expiration time in minutes (default: 60 = 1 hour)",
      (value) => parseInt(value, 10),
      60,
    )
    .action(
      async (
        downloadFilename: string,
        options: { downloadExpiration: number; uploadExpiration: number },
      ) => {
        const { generateUrlsPerpetualPowersOfTau } = await import("./generate-urls.js");
        await generateUrlsPerpetualPowersOfTau(downloadFilename, {
          downloadExpiration: options.downloadExpiration,
          uploadExpiration: options.uploadExpiration,
        });
      },
    );

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
