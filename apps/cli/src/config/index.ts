import { Command } from "commander";

export function setUpConfigCommands(program: Command): void {
  const configCommand = program
    .command("config")
    .description("Global configuration management commands");

  // Check if global .env exists and show path info
  configCommand
    .command("path")
    .description("Check if global configuration exists and show file location")
    .action(async () => {
      const { showConfigPath } = await import("./path.js");
      await showConfigPath();
    });

  // Create new global configuration file
  configCommand
    .command("new")
    .description("Create new global configuration file in ~/.brebaje/")
    .action(async () => {
      const { createNewConfig } = await import("./new.js");
      await createNewConfig();
    });

  // Configure GitHub classic token
  configCommand
    .command("gh-token <token>")
    .description("Configure GitHub classic token for gist creation")
    .action(async (token: string) => {
      const { setupGitHubTokenGlobal } = await import("./gh-token.js");
      await setupGitHubTokenGlobal(token);
    });

  // Configure GitHub fine-grained token
  configCommand
    .command("gh-token-scoped <token>")
    .description("Configure fine-grained GitHub token for ceremony repository operations")
    .action(async (token: string) => {
      const { setupGitHubTokenScopedGlobal } = await import("./gh-token-scoped.js");
      await setupGitHubTokenScopedGlobal(token);
    });

  // Configure contributor name
  configCommand
    .command("name <fullName>")
    .description("Configure contributor name for ceremony contributions")
    .action(async (fullName: string) => {
      const { setupContributorNameGlobal } = await import("./name.js");
      await setupContributorNameGlobal(fullName);
    });

  // Configure ceremony repository URL
  configCommand
    .command("ceremony-repo <repositoryUrl>")
    .description("Configure ceremony repository URL for official contribution records")
    .action(async (repositoryUrl: string) => {
      const { setupCeremonyRepositoryGlobal } = await import("./ceremony-repo.js");
      await setupCeremonyRepositoryGlobal(repositoryUrl);
    });

  // Migrate local configuration to global
  configCommand
    .command("migrate")
    .description("Migrate local .env configuration to global ~/.brebaje/.env")
    .action(() => {
      import("./migrate.js").then(({ migrateConfig }) => {
        migrateConfig();
      });
    });
}
