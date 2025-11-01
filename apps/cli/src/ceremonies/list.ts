import { scriptLoggerTitle } from "src/utils/constant.js";
import { ScriptLogger } from "../utils/logger.js";

export async function list() {
  const logger = new ScriptLogger(`${scriptLoggerTitle}List`);

  logger.log("Listing all ceremonies...");

  // TODO: Implement actual ceremony listing logic
  // This should fetch ceremonies from the backend API
  logger.log("Available ceremonies:");
  logger.log("- ceremony-001");
  logger.log("- ceremony-002");
  logger.log("- ceremony-003");
}
