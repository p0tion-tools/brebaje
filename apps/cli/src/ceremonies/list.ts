import { scriptLoggerTitle } from "../utils/constant.js";
import { ScriptLogger } from "../utils/logger.js";
import { authenticatedFetch } from "../auth/http.js";
import { validateToken } from "../auth/token.js";
import { loadConfig } from "../utils/config.js";

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
    const config = loadConfig();
    const validation = validateToken(config.BREBAJE_AUTH_TOKEN_PATH);

    if (!validation.valid) {
      logger.warn("⚠️  Authentication recommended for listing ceremonies");
      logger.log("Some information may be limited without authentication.");
      logger.log("To authenticate, run: brebaje-cli auth login");
      console.log("");
    }

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
    console.log("");

    ceremonies.forEach((ceremony, index) => {
      console.log(`${index + 1}. ${ceremony.title}`);
      console.log(`   ID: ${ceremony.id}`);

      if (ceremony.description) {
        console.log(`   Description: ${ceremony.description}`);
      }

      if (ceremony.phase) {
        console.log(`   Phase: ${ceremony.phase}`);
      }

      if (ceremony.circuitCount !== undefined) {
        console.log(`   Circuits: ${ceremony.circuitCount}`);
      }

      if (ceremony.contributorsCount !== undefined) {
        console.log(`   Contributors: ${ceremony.contributorsCount}`);
      }

      if (ceremony.startTime) {
        console.log(`   Start: ${new Date(ceremony.startTime).toLocaleString()}`);
      }

      if (ceremony.endTime) {
        console.log(`   End: ${new Date(ceremony.endTime).toLocaleString()}`);
      }

      console.log("");
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error(`❌ Failed to list ceremonies: ${errorMessage}`);
    process.exit(1);
  }
}
