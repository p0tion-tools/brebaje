import { ScriptLogger } from "../utils/logger.js";

const logger = new ScriptLogger("CLI:ListParticipants");

interface ListParticipantsOptions {
  ceremony?: string;
}

export async function list(options: ListParticipantsOptions) {
  logger.log("Listing participants...");

  if (options.ceremony) {
    logger.log(`For ceremony: ${options.ceremony}`);
  }

  // TODO: Implement actual participant listing logic
  // This should fetch participants from the backend API
  logger.log("Participants:");
  logger.log("- participant-1 (status: active)");
  logger.log("- participant-2 (status: completed)");
  logger.log("- participant-3 (status: pending)");
}
