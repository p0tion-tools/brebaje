import { scriptLoggerTitle } from "../utils/constant.js";
import { ScriptLogger } from "../utils/logger.js";
import { authenticatedFetch } from "../auth/http.js";

interface Ceremony {
  id: string;
  title: string;
  description?: string;
  startTime?: string;
  endTime?: string;
  circuitCount?: number;
  contributorsCount?: number;
  coordinatorId?: string;
  phase?: string;
}

export async function list() {
  const logger = new ScriptLogger(`${scriptLoggerTitle}List`);

  try {
    // Check authentication

    logger.log("📡 Fetching ceremonies from backend...");

    const response = await authenticatedFetch("/ceremonies");

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Authentication required. Please run: brebaje-cli auth login");
      }
      throw new Error(`Failed to fetch ceremonies: ${response.statusText}`);
    }

    const ceremonies = (await response.json()) as Ceremony[];

    if (ceremonies.length === 0) {
      logger.log("No ceremonies found.");
      return;
    }

    logger.success(`✅ Found ${ceremonies.length} ceremony(ies):`);

    ceremonies.forEach((ceremony, index) => {
      logger.log(`${index + 1}. ${ceremony.title}`);
      logger.log(`   ID: ${ceremony.id}`);

      if (ceremony.description) {
        logger.log(`   Description: ${ceremony.description}`);
      }

      if (ceremony.phase) {
        logger.log(`   Phase: ${ceremony.phase}`);
      }

      if (ceremony.circuitCount !== undefined) {
        logger.log(`   Circuits: ${ceremony.circuitCount}`);
      }

      if (ceremony.contributorsCount !== undefined) {
        logger.log(`   Contributors: ${ceremony.contributorsCount}`);
      }

      if (ceremony.startTime) {
        logger.log(`   Start: ${new Date(ceremony.startTime).toLocaleString()}`);
      }

      if (ceremony.endTime) {
        logger.log(`   End: ${new Date(ceremony.endTime).toLocaleString()}`);
      }

      logger.log("\n");
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error(`❌ Failed to list ceremonies: ${errorMessage}`);
    process.exit(1);
  }
}
