import { Command } from "commander";

export function setUpSetupCommands(program: Command): void {
  const setupCommand = program.command("setup").description("Configuration and setup commands");

  setupCommand
    .command("gh-token")
    .description("Configure GitHub token for contribution records")
    .argument("<github_token>", "GitHub personal access token (classic)")
    .action(async (githubToken: string) => {
      const { setupGitHubToken } = await import("./token.js");
      await setupGitHubToken(githubToken);
    });
}
