import { Command } from "commander";
import { githubAuth } from "./github.js";

export function setUpAuthCommands(program: Command): void {
  const authCommand = program.command("auth").description("Authentication commands");

  authCommand.command("login").description("Login with GitHub OAuth").action(githubAuth);

  authCommand
    .command("logout")
    .description("Logout and clear stored tokens")
    .action(() => {
      console.log("Logout functionality not implemented yet");
    });

  authCommand
    .command("status")
    .description("Check authentication status")
    .action(() => {
      console.log("Auth status check not implemented yet");
    });

  authCommand
    .command("whoami")
    .description("Show current user information")
    .action(() => {
      console.log("Whoami functionality not implemented yet");
    });
}
