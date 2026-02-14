import { ScriptLogger } from "../utils/logger";
import { scriptLoggerTitle } from "../utils/constant";
import { authenticatedFetch, fetchWithoutAuth } from "../auth/http";

interface DeleteOptions {
  id: number;
  yes?: boolean;
}

export async function remove(options: DeleteOptions) {
  const logger = new ScriptLogger(`${scriptLoggerTitle}Delete`);

  try {
    logger.log("🔍 Fetching ceremony details...");
    const getResponse = await fetchWithoutAuth(`/ceremonies/${options.id}`);
    if (!getResponse.ok) {
      logger.failure(`Failed to fetch ceremony: ${getResponse.status} ${await getResponse.text()}`);
      return;
    }

    const ceremony = await getResponse.json();

    logger.log(
      `Ceremony Details:\n
      ID: ${ceremony.id}\n
      Project ID: ${ceremony.projectId}\n
      Type: ${ceremony.type}\n
      State: ${ceremony.state}`,
    );

    if (!options.yes) {
      // TODO: Use confirmAction utility for prompt
      logger.log(
        "⚠️  WARNING: This action cannot be undone!\nAre you sure you want to delete this ceremony? (yes/no):",
      );
      // For now, auto-cancel
      logger.log("Delete cancelled (confirmation prompt not implemented).");
      return;
    }

    logger.log("🗑️  Deleting ceremony...");
    const delResponse = await authenticatedFetch(`/ceremonies/${options.id}`, {
      method: "DELETE",
    });

    if (!delResponse.ok) {
      logger.failure(
        `Failed to delete ceremony: ${delResponse.status} ${await delResponse.text()}`,
      );
      return;
    }

    logger.success("Ceremony deleted successfully!");
  } catch (err) {
    logger.failure(`Error: ${(err as Error).message}`);
  }
}
