import { scriptLoggerTitle } from "../utils/constant";
import { ScriptLogger } from "../utils/logger";
import { fetchWithoutAuth } from "../auth/http";
import { Ceremony } from "./declarations";
import { formatDate } from "./utils";

export async function list() {
  const logger = new ScriptLogger(`${scriptLoggerTitle}List`);

  try {
    logger.log("📡 Fetching ceremonies from backend...");
    const response = await fetchWithoutAuth("/ceremonies");

    if (!response.ok) {
      throw new Error(`Failed to fetch ceremonies: ${response.statusText}`);
    }

    const ceremonies = (await response.json()) as Ceremony[];

    if (ceremonies.length === 0) {
      logger.log("No ceremonies found.");
      return;
    }

    logger.success(`✅ Found ${ceremonies.length} ceremony(ies):`);

    ceremonies.forEach((ceremony, index) => {
      logger.log(`${index + 1}. Ceremony #${ceremony.id}`);
      logger.log(`   ID: ${ceremony.id}`);
      logger.log(`   Project ID: ${ceremony.projectId}`);
      logger.log(`   Type: ${ceremony.type}`);
      logger.log(`   State: ${ceremony.state}`);
      if (ceremony.description) {
        logger.log(`   Description: ${ceremony.description}`);
      }
      logger.log(`   Start Date: ${formatDate(ceremony.start_date)}`);
      logger.log(`   End Date: ${formatDate(ceremony.end_date)}`);
      logger.log(`   Penalty: ${ceremony.penalty}`);
    });
  } catch (err) {
    logger.failure(`Error: ${(err as Error).message}`);
  }
}
