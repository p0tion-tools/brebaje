#!/usr/bin/env node

import { createCommand } from "commander";
import { readFileSync } from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { setUpAuthCommands } from "./auth/index.js";
import { setUpCeremonyCommands } from "./ceremonies/index.js";
import { setUpParticipantCommands } from "./participants/index.js";

// Get pkg info (e.g., name, version).
const packagePath = `${dirname(fileURLToPath(import.meta.url))}/..`;
const { description, version, name } = JSON.parse(
  readFileSync(`${packagePath}/package.json`, "utf8"),
);
const program = createCommand();

// Entry point.
program.name(name).description(description).version(version);

// Set up command groups
setUpAuthCommands(program);
setUpCeremonyCommands(program);
setUpParticipantCommands(program);

program.parseAsync(process.argv);
