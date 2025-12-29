import { readFileSync } from "fs";
import { ScriptLogger } from "../utils/logger.js";
import { authenticatedFetch } from "../auth/http.js";
import { scriptLoggerTitle } from "../utils/constant.js";
import { ProjectCreate } from "./declarations.js";

/**
 * Creates a new project from a JSON template file.
 *
 * @param template - Path to the JSON template file containing project data
 */
export async function create(options: { template: string }): Promise<void> {
  const logger = new ScriptLogger(`${scriptLoggerTitle}Projects:Create`);

  const { template: templatePath } = options;

  try {
    logger.log("📄 Reading project template...");

    // Read and parse JSON template file
    let template: ProjectCreate;
    try {
      const jsonContent = readFileSync(templatePath, "utf-8");
      template = JSON.parse(jsonContent);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.error(`❌ Failed to read template file: ${errorMessage}`);
      logger.error(`Please ensure the file exists and contains valid JSON`);
      process.exit(1);
    }

    // Validate required fields
    if (!template.name) {
      logger.error("❌ Template missing required field: name");
      process.exit(1);
    }

    if (!template.contact) {
      logger.error("❌ Template missing required field: contact");
      process.exit(1);
    }

    logger.log("🚀 Creating project...");

    // Make API request
    const response = await authenticatedFetch("/projects", {
      method: "POST",
      body: JSON.stringify({
        name: template.name,
        contact: template.contact,
      }),
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Authentication required. Please run: brebaje-cli auth login-github");
      }
      const errorText = await response.text();
      throw new Error(`Failed to create project: ${response.statusText} - ${errorText}`);
    }

    const project = await response.json();

    logger.success("✅ Project created successfully!");
    logger.log(`   ID: ${project.id}`);
    logger.log(`   Name: ${project.name}`);
    logger.log(`   Contact: ${project.contact}`);
    logger.log(`   Coordinator ID: ${project.coordinatorId}`);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error(`❌ Failed to create project: ${errorMessage}`);
    process.exit(1);
  }
}
