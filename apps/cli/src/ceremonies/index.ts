import { Command } from "commander";
import { contribute } from "./contribute.js";
import { create } from "./create.js";
import { finalize } from "./finalize.js";
import { list } from "./list.js";
import { TEMPLATE_FILE_PATH } from "src/utils/constant.js";
import { update } from "./update.js";
import { remove } from "./delete.js";

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
    .requiredOption(
      "-t, --template <path>",
      "The path to the ceremony setup template",
      TEMPLATE_FILE_PATH,
    )
    .action(create);

  coordinate
    .command("delete")
    .description("delete a ceremony")
    .requiredOption("-i, --id <number>", "the ID of the ceremony to delete")
    .option("-y, --yes", "confirm deletion without prompt")
    .action(remove);

  coordinate
    .command("finalize")
    .description(
      "finalize a Phase2 Trusted Setup ceremony by applying a beacon, exporting verification key and verifier contract",
    )
    .option("-a, --auth <string>", "the authentication token", "")
    .action(finalize);

  coordinate.command("list").description("list all ceremonies").action(list);

  coordinate
    .command("update")
    .description("update parameters of an existing Phase2 Trusted Setup ceremony")
    .requiredOption("-i, --id <number>", "the ID of the ceremony to update")
    .requiredOption(
      "-t, --template <path>",
      "The path to the ceremony update template",
      TEMPLATE_FILE_PATH,
    )
    .action(update);
}
