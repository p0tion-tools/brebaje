import { Command } from "commander";

export function setUpSetupCommands(program: Command): void {
  const setupCommand = program.command("setup").description("Configuration and setup commands");

  setupCommand
    .command("gh-token")
    .description("Configure GitHub classic token for gist creation")
    .argument("<github_token>", "GitHub personal access token (classic)")
    .action(async (githubToken: string) => {
      const { setupGitHubToken } = await import("./token.js");
      await setupGitHubToken(githubToken);
    });

  setupCommand
    .command("gh-token-scoped")
    .description("Configure fine-grained GitHub token for ceremony repository operations")
    .argument("<github_token_scoped>", "GitHub fine-grained personal access token")
    .action(async (githubTokenScoped: string) => {
      const { setupGitHubTokenScoped } = await import("./token.js");
      await setupGitHubTokenScoped(githubTokenScoped);
    });

  setupCommand
    .command("ceremony-repo")
    .description("Configure ceremony repository URL for official contribution records")
    .argument(
      "<repository_url>",
      "GitHub repository URL (e.g., https://github.com/owner/ceremony-repo)",
    )
    .action(async (repositoryUrl: string) => {
      const { setupCeremonyRepository } = await import("./ceremony-repo.js");
      await setupCeremonyRepository(repositoryUrl);
    });
}
