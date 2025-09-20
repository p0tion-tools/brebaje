/**
 * Centralized logger utility for scripts and services
 * Uses consistent formatting across the application
 */
export class ScriptLogger {
  private context: string;

  constructor(context: string) {
    this.context = context;
  }

  log(message: string): void {
    console.log(`[${new Date().toISOString()}] [${this.context}] ${message}`);
  }

  error(message: string, error?: Error): void {
    console.error(`[${new Date().toISOString()}] [${this.context}] ERROR: ${message}`);
    if (error) {
      console.error(error.stack);
    }
  }

  warn(message: string): void {
    console.warn(`[${new Date().toISOString()}] [${this.context}] WARN: ${message}`);
  }

  success(message: string): void {
    console.log(`[${new Date().toISOString()}] [${this.context}] ✅ ${message}`);
  }

  failure(message: string): void {
    console.log(`[${new Date().toISOString()}] [${this.context}] ❌ ${message}`);
  }
}
