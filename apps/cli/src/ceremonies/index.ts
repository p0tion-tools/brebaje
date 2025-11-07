import { Command } from "commander";
import { contribute } from "./contribute.js";
import { create } from "./create.js";
import { finalize } from "./finalize.js";
import { list } from "./list.js";

export function setUpCeremonyCommands(program: Command) {
  // Individual ceremony commands (not grouped)
  program
    .command("contribute")
    .description("compute contributions for a Phase2 Trusted Setup ceremony circuits")
    .option("-c, --ceremony <string>", "the prefix of the ceremony you want to contribute for", "")
    .option("-e, --entropy <string>", "the entropy (aka toxic waste) of your contribution", "")
    .option("-a, --auth <string>", "the authentication token", "")
    .action(contribute);

  program.command("list").description("List all ceremonies prefixes").action(list);

  // Coordinator commands (grouped under 'coordinate')
  const coordinate = program
    .command("coordinate")
    .description("commands for coordinating a ceremony");

  coordinate
    .command("create")
    .description("setup a Groth16 Phase 2 Trusted Setup ceremony for zk-SNARK circuits")
    .option("-t, --template <path>", "The path to the ceremony setup template", "")
    .option("-a, --auth <string>", "The authentication token", "")
    .action(create);

  coordinate
    .command("finalize")
    .description(
      "finalize a Phase2 Trusted Setup ceremony by applying a beacon, exporting verification key and verifier contract",
    )
    .option("-a, --auth <string>", "the authentication token", "")
    .action(finalize);
}
