import { ScriptLogger } from "../utils/logger.js";

const logger = new ScriptLogger("CLI:List");

export async function list() {
  logger.log("Listing all ceremonies...");

  // TODO: Implement actual ceremony listing logic
  // This should fetch ceremonies from the backend API
  logger.log("Available ceremonies:");
  logger.log("- ceremony-001");
  logger.log("- ceremony-002");
  logger.log("- ceremony-003");
}
