import { ScriptLogger } from "../utils/logger";
import { scriptLoggerTitle } from "../utils/constant";
import { readTemplate, validateCreateTemplate } from "./utils";
import { CeremonyCreate } from "./declarations";
import { authenticatedFetch } from "../auth/http";

interface CreateOptions {
  template: string;
}

export async function create(options: CreateOptions) {
  const logger = new ScriptLogger(`${scriptLoggerTitle}Create`);

  try {
    logger.log("📄 Reading ceremony template...");
    const template = readTemplate<CeremonyCreate>(options.template);
    validateCreateTemplate(template);

    logger.log("🚀 Creating ceremony...");
    const response = await authenticatedFetch("/ceremonies", {
      method: "POST",
      body: JSON.stringify(template),
    });

    if (!response.ok) {
      const errorText = await response.text();
      logger.failure(`Failed to create ceremony: ${response.status} ${errorText}`);
      return;
    }

    const ceremony = await response.json();

    logger.success("Ceremony created successfully!");
    logger.log(`   ID: ${ceremony.id}`);
    logger.log(`   Project ID: ${ceremony.projectId}`);
    logger.log(`   Type: ${ceremony.type}`);
    logger.log(`   State: ${ceremony.state}`);
    logger.log(`   Start Date: ${ceremony.start_date}`);
    logger.log(`   End Date: ${ceremony.end_date}`);
    logger.log(`   Penalty: ${ceremony.penalty}`);
  } catch (err) {
    logger.failure(`Error: ${(err as Error).message}`);
  }
}
