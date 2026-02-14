import { Command } from "commander";
import { create } from "./create.js";
import { list } from "./list.js";
import { TEMPLATE_FILE_PATH } from "../utils/constant.js";

/**
 * Sets up project-related commands.
 *
 * @param program - The Commander program instance
 */
export function setUpProjectCommands(program: Command): void {
  const projectCommand = program.command("projects").description("Project management commands");

  projectCommand
    .command("create")
    .description("Create a new project from a JSON template file")
    .requiredOption(
      "-t, --template <path>",
      "The path to the project create template",
      TEMPLATE_FILE_PATH,
    )
    .action(create);

  projectCommand.command("list").description("List all projects").action(list);
}
