import { ScriptLogger } from "../utils/logger";
import { scriptLoggerTitle } from "../utils/constant";
import { readTemplate, validateUpdateTemplate } from "./utils";
import { CeremonyUpdate } from "./declarations";
import { authenticatedFetch, fetchWithoutAuth } from "../auth/http";

interface UpdateOptions {
  id: number;
  template: string;
}

// Handler for ceremonies update command
export async function update(options: UpdateOptions) {
  const logger = new ScriptLogger(`${scriptLoggerTitle}Update`);

  try {
    logger.log("📄 Reading ceremony update template...");
    const template = readTemplate<CeremonyUpdate>(options.template);
    validateUpdateTemplate(template);

    logger.log("🔍 Fetching current ceremony details...");
    const getResponse = await fetchWithoutAuth(`/ceremonies/${options.id}`);
    if (!getResponse.ok) {
      logger.failure(`Failed to fetch ceremony: ${getResponse.status} ${await getResponse.text()}`);
      return;
    }

    const current = await getResponse.json();
    logger.log(`Current state: ${current.state}`);

    logger.log("🔄 Updating ceremony...");
    const patchResponse = await authenticatedFetch(`/ceremonies/${options.id}`, {
      method: "PATCH",
      body: JSON.stringify(template),
    });

    if (!patchResponse.ok) {
      logger.failure(
        `Failed to update ceremony: ${patchResponse.status} ${await patchResponse.text()}`,
      );
      return;
    }

    const updated = await patchResponse.json();
    logger.success("Ceremony updated successfully!");

    Object.keys(template).forEach((key) => {
      if (template[key as keyof CeremonyUpdate] !== undefined) {
        logger.log(`   ${key}: ${updated[key]} (updated)`);
      }
    });
  } catch (err) {
    logger.failure(`Error: ${(err as Error).message}`);
  }
}
