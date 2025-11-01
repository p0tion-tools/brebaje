import { Command } from "commander";
import { showConfigPath } from "./path.js";
import { createNewConfig } from "./new.js";
import { setupGitHubTokenGlobal } from "./gh-token.js";
import { setupGitHubTokenScopedGlobal } from "./gh-token-scoped.js";
import { setupContributorNameGlobal } from "./name.js";
import { setupCeremonyRepositoryGlobal } from "./ceremony-repo.js";
import { migrateConfig } from "./migrate.js";

export function setUpConfigCommands(program: Command): void {
  const configCommand = program
    .command("config")
    .description("Global configuration management commands");

  // Check if global .env exists and show path info
  configCommand
    .command("path")
    .description("Check if global configuration exists and show file location")
    .action(() => {
      showConfigPath();
    });

  // Create new global configuration file
  configCommand
    .command("new")
    .description("Create new global configuration file in ~/.brebaje/")
    .action(async () => {
      await createNewConfig();
    });

  // Configure GitHub classic token
  configCommand
    .command("gh-token <token>")
    .description("Configure GitHub classic token for gist creation")
    .action(async (token: string) => {
      await setupGitHubTokenGlobal(token);
    });

  // Configure GitHub fine-grained token
  configCommand
    .command("gh-token-scoped <token>")
    .description("Configure fine-grained GitHub token for ceremony repository operations")
    .action(async (token: string) => {
      await setupGitHubTokenScopedGlobal(token);
    });

  // Configure contributor name
  configCommand
    .command("name <fullName>")
    .description("Configure contributor name for ceremony contributions")
    .action(async (fullName: string) => {
      await setupContributorNameGlobal(fullName);
    });

  // Configure ceremony repository URL
  configCommand
    .command("ceremony-repo <repositoryUrl>")
    .description("Configure ceremony repository URL for official contribution records")
    .action(async (repositoryUrl: string) => {
      await setupCeremonyRepositoryGlobal(repositoryUrl);
    });

  // Migrate local configuration to global
  configCommand
    .command("migrate")
    .description("Migrate local .env configuration to global ~/.brebaje/.env")
    .action(() => {
      migrateConfig();
    });
}
