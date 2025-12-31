import fs from "fs";
import path from "path";
import { CeremonyType, CeremonyState } from "./declarations";

/**
 * Reads and parses a JSON template file.
 * @param templatePath - Path to the template file
 * @throws If file does not exist or is invalid JSON
 */
export function readTemplate<T>(templatePath: string): T {
  const absPath = path.resolve(templatePath);
  if (!fs.existsSync(absPath)) {
    throw new Error(`Template file not found: ${absPath}`);
  }
  try {
    const content = fs.readFileSync(absPath, "utf-8");
    return JSON.parse(content) as T;
  } catch (err) {
    throw new Error(
      `Failed to read or parse template: ${err instanceof Error ? err.message : String(err)}`,
    );
  }
}

/**
 * Checks if a value is a valid CeremonyType.
 */
export function isValidCeremonyType(type: any): type is CeremonyType {
  return Object.values(CeremonyType).includes(type);
}

/**
 * Checks if a value is a valid CeremonyState.
 */
export function isValidCeremonyState(state: any): state is CeremonyState {
  return Object.values(CeremonyState).includes(state);
}

/**
 * Validates that start \< end and both are positive unix timestamps.
 */
export function validateTimestamps(start: number, end: number): boolean {
  return Number.isInteger(start) && Number.isInteger(end) && start > 0 && end > 0 && start < end;
}

/**
 * Formats a unix timestamp as YYYY-MM-DD HH:mm:ss.
 */
export function formatDate(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  return date.toISOString().replace("T", " ").substring(0, 19);
}

/**
 * Validates a ceremony creation template. Throws an error if invalid.
 */
export function validateCreateTemplate(template: any): void {
  if (typeof template !== "object" || template === null) {
    throw new Error("Template must be a non-null object");
  }
  if (typeof template.projectId !== "number" || template.projectId <= 0) {
    throw new Error("projectId must be a positive number");
  }
  if (!isValidCeremonyType(template.type)) {
    throw new Error(`type must be a valid CeremonyType: ${Object.values(CeremonyType).join(", ")}`);
  }
  if (!isValidCeremonyState(template.state)) {
    throw new Error(
      `state must be a valid CeremonyState: ${Object.values(CeremonyState).join(", ")}`,
    );
  }
  if (!validateTimestamps(template.start_date, template.end_date)) {
    throw new Error(
      "start_date and end_date must be valid unix timestamps and start_date < end_date",
    );
  }
  if (typeof template.penalty !== "number" || template.penalty < 0) {
    throw new Error("penalty must be a non-negative number");
  }
  if (typeof template.authProviders !== "object" || template.authProviders === null) {
    throw new Error("authProviders must be an object");
  }
}

/**
 * Validates a ceremony update template. Throws an error if invalid.
 */
export function validateUpdateTemplate(template: any): void {
  if (typeof template !== "object" || template === null) {
    throw new Error("Template must be a non-null object");
  }
  if (template.type !== undefined && !isValidCeremonyType(template.type)) {
    throw new Error(`type must be a valid CeremonyType: ${Object.values(CeremonyType).join(", ")}`);
  }
  if (template.state !== undefined && !isValidCeremonyState(template.state)) {
    throw new Error(
      `state must be a valid CeremonyState: ${Object.values(CeremonyState).join(", ")}`,
    );
  }
  if (
    (template.start_date !== undefined || template.end_date !== undefined) &&
    !validateTimestamps(template.start_date ?? 0, template.end_date ?? Number.MAX_SAFE_INTEGER)
  ) {
    throw new Error(
      "start_date and end_date must be valid unix timestamps and start_date < end_date",
    );
  }
  if (
    template.penalty !== undefined &&
    (typeof template.penalty !== "number" || template.penalty < 0)
  ) {
    throw new Error("penalty must be a non-negative number");
  }
  if (
    template.authProviders !== undefined &&
    (typeof template.authProviders !== "object" || template.authProviders === null)
  ) {
    throw new Error("authProviders must be an object");
  }
}
