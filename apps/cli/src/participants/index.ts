import { Command } from "commander";
import { list } from "./list.js";

export function setUpParticipantCommands(program: Command) {
  const participantCommand = program
    .command("participants")
    .description("commands for managing participants");

  participantCommand
    .command("list")
    .description("list participants for a ceremony")
    .option("-c, --ceremony <string>", "the ceremony to list participants for", "")
    .action(list);
}
