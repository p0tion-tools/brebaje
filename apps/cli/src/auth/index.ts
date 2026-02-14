import { Command } from "commander";
import { githubAuth } from "./github.js";
import { logout } from "./logout.js";
import { checkAuthStatus } from "./status.js";
import { whoami } from "./whoami.js";

export function setUpAuthCommands(program: Command): void {
  const authCommand = program.command("auth").description("Authentication commands");

  authCommand
    .command("login-github")
    .description("Login with GitHub Device Flow")
    .action(githubAuth);

  authCommand.command("logout").description("Logout and clear stored tokens").action(logout);

  authCommand.command("status").description("Check authentication status").action(checkAuthStatus);

  authCommand.command("whoami").description("Show current user information").action(whoami);
}
