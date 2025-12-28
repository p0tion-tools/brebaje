import { Command } from "commander";
import { verifyVm } from "./verify.js";

export function setUpVmCommands(program: Command): void {
  const vmCommand = program.command("vm").description("Virtual Machine commands for verification");

  vmCommand
    .command("verify")
    .description("Start verification on VM instance using ceremony JSON file")
    .argument(
      "[jsonPath]",
      "Path to ceremony URLs JSON file (optional, will check current folder first)",
    )
    .action(async (jsonPath?: string) => {
      await verifyVm(jsonPath);
    });
}
