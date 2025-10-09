import chalk from "chalk";

/**
 * Centralized logger utility for CLI commands
 * Uses consistent formatting and colors across the CLI application
 */
export class ScriptLogger {
  private context: string;

  constructor(context: string) {
    this.context = context;
  }

  private formatTimestamp(): string {
    return chalk.dim(new Date().toISOString());
  }

  private formatContext(): string {
    return chalk.cyan(`[${this.context}]`);
  }

  log(message: string): void {
    console.log(`${this.formatTimestamp()} ${this.formatContext()} ${message}`);
  }

  info(message: string): void {
    console.log(`${this.formatTimestamp()} ${this.formatContext()} ${chalk.blue("ℹ")} ${message}`);
  }

  error(message: string, error?: Error): void {
    console.error(
      `${this.formatTimestamp()} ${this.formatContext()} ${chalk.red("ERROR:")} ${chalk.red(message)}`,
    );
    if (error) {
      console.error(chalk.red(error.stack));
    }
  }

  warn(message: string): void {
    console.warn(
      `${this.formatTimestamp()} ${this.formatContext()} ${chalk.yellow("⚠ WARN:")} ${chalk.yellow(message)}`,
    );
  }

  success(message: string): void {
    console.log(
      `${this.formatTimestamp()} ${this.formatContext()} ${chalk.green("✅")} ${chalk.green(message)}`,
    );
  }

  failure(message: string, error: any): void {
    console.log(
      `${this.formatTimestamp()} ${this.formatContext()} ${chalk.red("❌")} ${chalk.red(message)}`,
    );
  }

  // New enhanced methods
  header(message: string): void {
    console.log("\n" + chalk.bold.magenta("═".repeat(60)));
    console.log(chalk.bold.magenta(`  ${message}`));
    console.log(chalk.bold.magenta("═".repeat(60)) + "\n");
  }

  subheader(message: string): void {
    console.log("\n" + chalk.bold.blue(`▶ ${message}`));
    console.log(chalk.blue("─".repeat(40)) + "\n");
  }

  highlight(message: string): void {
    console.log(
      `${this.formatTimestamp()} ${this.formatContext()} ${chalk.bold.yellow("⭐")} ${chalk.bold(message)}`,
    );
  }

  progress(message: string): void {
    console.log(
      `${this.formatTimestamp()} ${this.formatContext()} ${chalk.blue("⏳")} ${chalk.blue(message)}`,
    );
  }

  step(step: number, total: number, message: string): void {
    const progress = `${step}/${total}`;
    console.log(
      `${this.formatTimestamp()} ${this.formatContext()} ${chalk.magenta(`[${progress}]`)} ${message}`,
    );
  }

  table(data: Record<string, string | number>): void {
    console.log();
    Object.entries(data).forEach(([key, value]) => {
      const formattedKey = chalk.bold.cyan(`${key}:`);
      const formattedValue = typeof value === "string" ? chalk.white(value) : chalk.yellow(value);
      console.log(`  ${formattedKey.padEnd(25)} ${formattedValue}`);
    });
    console.log();
  }

  json(data: object): void {
    console.log(chalk.dim(JSON.stringify(data, null, 2)));
  }

  link(text: string, url: string): void {
    console.log(
      `${this.formatTimestamp()} ${this.formatContext()} ${chalk.blue("🔗")} ${text}: ${chalk.underline.blue(url)}`,
    );
  }
}
