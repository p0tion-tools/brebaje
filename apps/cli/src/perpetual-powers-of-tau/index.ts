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
    .command("contribute")
    .description("Make a contribution to the perpetual powers of tau ceremony")
    .action(() => {
      console.log("Perpetual powers of tau contribution not implemented yet");
    });

  ppotCommand
    .command("verify")
    .description("Verify contributions in the perpetual powers of tau ceremony")
    .action(() => {
      console.log("Perpetual powers of tau verification not implemented yet");
    });

  ppotCommand
    .command("status")
    .description("Show status of the perpetual powers of tau ceremony")
    .action(() => {
      console.log("Perpetual powers of tau status not implemented yet");
    });
}
