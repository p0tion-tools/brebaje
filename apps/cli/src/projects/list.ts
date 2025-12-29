import { ScriptLogger } from "../utils/logger.js";
import { authenticatedFetch } from "../auth/http.js";
import { scriptLoggerTitle } from "../utils/constant.js";
import { Project } from "./declarations.js";

/**
 * Lists all projects.
 */
export async function list(): Promise<void> {
  const logger = new ScriptLogger(`${scriptLoggerTitle}Projects:List`);

  try {
    logger.log("📡 Fetching projects from backend...");

    const response = await authenticatedFetch("/projects");

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Authentication required. Please run: brebaje-cli auth login-github");
      }
      throw new Error(`Failed to fetch projects: ${response.statusText}`);
    }

    const projects = (await response.json()) as Project[];

    if (projects.length === 0) {
      logger.log("No projects found.");
      return;
    }

    logger.success(`✅ Found ${projects.length} project(s):`);

    projects.forEach((project, index) => {
      logger.log(`${index + 1}. ${project.name}`);
      logger.log(`   ID: ${project.id}`);
      logger.log(`   Contact: ${project.contact}`);
      logger.log(`   Coordinator ID: ${project.coordinatorId}`);

      if (project.creationTime) {
        logger.log(`   Created: ${new Date(project.creationTime).toLocaleString()}`);
      }

      if (project.lastUpdated) {
        logger.log(`   Updated: ${new Date(project.lastUpdated).toLocaleString()}`);
      }

      logger.log("\n");
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error(`❌ Failed to list projects: ${errorMessage}`);
    process.exit(1);
  }
}
