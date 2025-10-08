import chalk from "chalk";

/**
 * Visual enhancement utilities for CLI output
 * Provides consistent styling, banners, progress indicators, and formatting
 */

// Brand colors and theme
export const colors = {
  primary: chalk.magenta,
  secondary: chalk.cyan,
  success: chalk.green,
  error: chalk.red,
  warning: chalk.yellow,
  info: chalk.blue,
  muted: chalk.dim,
  highlight: chalk.bold.yellow,
  accent: chalk.bold.blue,
};

/**
 * Display a main banner/header for major command sections
 */
export function banner(title: string, subtitle?: string): void {
  const width = 70;
  const titleLine = `  ${title}  `;
  const subtitleLine = subtitle ? `  ${subtitle}  ` : "";

  console.log("\n" + colors.primary("═".repeat(width)));
  console.log(
    colors.primary.bold(titleLine.padStart((width + titleLine.length) / 2).padEnd(width)),
  );
  if (subtitle) {
    console.log(
      colors.secondary(subtitleLine.padStart((width + subtitleLine.length) / 2).padEnd(width)),
    );
  }
  console.log(colors.primary("═".repeat(width)) + "\n");
}

/**
 * Display a section header
 */
export function section(title: string): void {
  console.log("\n" + colors.accent(`▶ ${title}`));
  console.log(colors.accent("─".repeat(Math.min(40, title.length + 3))) + "\n");
}

/**
 * Display a progress indicator with step information
 */
export function progress(current: number, total: number, description: string): void {
  const percentage = Math.round((current / total) * 100);
  const progressBar =
    "█".repeat(Math.floor(percentage / 5)) + "░".repeat(20 - Math.floor(percentage / 5));

  console.log(
    colors.info(`[${current}/${total}]`) +
      ` ${colors.muted(progressBar)} ` +
      colors.accent(`${percentage}%`) +
      ` ${description}`,
  );
}

/**
 * Display a status indicator
 */
export function status(
  type: "pending" | "running" | "success" | "error" | "warning",
  message: string,
): void {
  const indicators = {
    pending: colors.muted("○"),
    running: colors.info("⏳"),
    success: colors.success("✅"),
    error: colors.error("❌"),
    warning: colors.warning("⚠️"),
  };

  const colorMap = {
    pending: colors.muted,
    running: colors.info,
    success: colors.success,
    error: colors.error,
    warning: colors.warning,
  };

  console.log(`${indicators[type]} ${colorMap[type](message)}`);
}

/**
 * Display a formatted table
 */
export function table(data: Array<Record<string, string | number>>): void {
  if (data.length === 0) return;

  const headers = Object.keys(data[0]);
  const columnWidths = headers.map((header) =>
    Math.max(header.length, ...data.map((row) => String(row[header] || "").length)),
  );

  // Header
  console.log();
  const headerRow = headers
    .map((header, i) => colors.accent.bold(header.padEnd(columnWidths[i])))
    .join("  ");
  console.log(headerRow);

  // Separator
  const separator = headers.map((_, i) => colors.muted("─".repeat(columnWidths[i]))).join("  ");
  console.log(separator);

  // Data rows
  data.forEach((row) => {
    const dataRow = headers
      .map((header, i) => {
        const value = String(row[header] || "");
        const formattedValue =
          typeof row[header] === "number" ? colors.warning(value) : colors.secondary(value);
        return formattedValue.padEnd(columnWidths[i] + (formattedValue.length - value.length));
      })
      .join("  ");
    console.log(dataRow);
  });
  console.log();
}

/**
 * Display key-value pairs in a neat format
 */
export function keyValue(data: Record<string, string | number | boolean>): void {
  console.log();
  const maxKeyLength = Math.max(...Object.keys(data).map((k) => k.length));

  Object.entries(data).forEach(([key, value]) => {
    const formattedKey = colors.accent.bold(`${key}:`).padEnd(maxKeyLength + 10);
    let formattedValue: string;

    if (typeof value === "boolean") {
      formattedValue = value ? colors.success("✓ true") : colors.error("✗ false");
    } else if (typeof value === "number") {
      formattedValue = colors.warning(String(value));
    } else {
      formattedValue = colors.secondary(String(value));
    }

    console.log(`  ${formattedKey} ${formattedValue}`);
  });
  console.log();
}

/**
 * Display formatted JSON with syntax highlighting
 */
export function json(data: object): void {
  const jsonString = JSON.stringify(data, null, 2);

  // Simple syntax highlighting
  const highlighted = jsonString
    .replace(/(".*?"):/g, colors.accent("$1") + ":")
    .replace(/: (".*?")/g, ": " + colors.success("$1"))
    .replace(/: (true|false)/g, ": " + colors.warning("$1"))
    .replace(/: (\d+)/g, ": " + colors.info("$1"))
    .replace(/: (null)/g, ": " + colors.muted("$1"));

  console.log(highlighted);
}

/**
 * Display a link with proper formatting
 */
export function link(text: string, url: string): void {
  console.log(`${colors.info("🔗")} ${text}: ${colors.secondary.underline(url)}`);
}

/**
 * Remove emojis from a string
 */
function stripEmojis(str: string): string {
  return str.replace(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, "");
}

/**
 * Get the visual length of a string (handling emojis and ANSI codes)
 */
function getVisualLength(str: string): number {
  // Remove ANSI escape codes
  const cleanStr = str.replace(/\u001b\[[0-9;]*m/g, "");
  // Count emojis as 2 characters for consistent spacing
  const emojiCount = (
    cleanStr.match(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu) || []
  ).length;
  return cleanStr.length + emojiCount;
}

/**
 * Pad string to exact visual width
 */
function padToVisualWidth(str: string, targetWidth: number): string {
  const currentVisualLength = getVisualLength(str);
  const paddingNeeded = Math.max(0, targetWidth - currentVisualLength);
  return str + " ".repeat(paddingNeeded);
}

/**
 * Display a warning box with border
 */
export function warningBox(title: string, messages: string[]): void {
  // Clean title of any user-provided emojis
  const cleanTitle = stripEmojis(title);

  // Calculate width based on actual visual content
  const titleVisualLength = getVisualLength(` ⚠️  ${cleanTitle} `);
  const maxMessageLength = Math.max(...messages.map((m) => getVisualLength(` ${m}`)));
  const width = Math.max(50, Math.max(titleVisualLength, maxMessageLength) + 4);

  const contentWidth = width - 2; // Account for left and right borders

  console.log("\n" + colors.warning("┌" + "─".repeat(contentWidth) + "┐"));

  const titleContent = padToVisualWidth(` ⚠️  ${cleanTitle} `, contentWidth);
  console.log(colors.warning("│") + colors.warning.bold(titleContent) + colors.warning("  │"));

  console.log(colors.warning("├" + "─".repeat(contentWidth) + "┤"));

  messages.forEach((message) => {
    const messageContent = padToVisualWidth(` ${message}`, contentWidth);
    console.log(colors.warning("│") + messageContent + colors.warning("│"));
  });

  console.log(colors.warning("└" + "─".repeat(contentWidth) + "┘") + "\n");
}

/**
 * Display an info box with border
 */
export function infoBox(title: string, messages: string[]): void {
  // Clean title of any user-provided emojis
  const cleanTitle = stripEmojis(title);

  // Calculate width based on actual visual content
  const titleVisualLength = getVisualLength(` ℹ️  ${cleanTitle} `);
  const maxMessageLength = Math.max(...messages.map((m) => getVisualLength(` ${m}`)));
  const width = Math.max(50, Math.max(titleVisualLength, maxMessageLength) + 4);

  const contentWidth = width - 2; // Account for left and right borders

  console.log("\n" + colors.info("┌" + "─".repeat(contentWidth) + "┐"));

  const titleContent = padToVisualWidth(` ℹ️  ${cleanTitle} `, contentWidth);
  console.log(colors.info("│") + colors.info.bold(titleContent) + colors.info(" │"));

  console.log(colors.info("├" + "─".repeat(contentWidth) + "┤"));

  messages.forEach((message) => {
    const messageContent = padToVisualWidth(` ${message}`, contentWidth);
    console.log(colors.info("│") + messageContent + colors.info("│"));
  });

  console.log(colors.info("└" + "─".repeat(contentWidth) + "┘") + "\n");
}

/**
 * Display a spinner animation (for long-running tasks)
 */
export function spinner(message: string): { update: (msg: string) => void; stop: () => void } {
  const frames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
  let frameIndex = 0;
  let currentMessage = message;

  const interval = setInterval(() => {
    process.stdout.write(`\r${colors.info(frames[frameIndex])} ${currentMessage}`);
    frameIndex = (frameIndex + 1) % frames.length;
  }, 100);

  return {
    update: (msg: string) => {
      currentMessage = msg;
    },
    stop: () => {
      clearInterval(interval);
      process.stdout.write("\r" + " ".repeat(100) + "\r"); // Clear line
    },
  };
}

/**
 * Display file size in human readable format
 */
export function fileSize(bytes: number): string {
  const units = ["B", "KB", "MB", "GB"];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return colors.warning(`${size.toFixed(1)} ${units[unitIndex]}`);
}

/**
 * Display elapsed time in human readable format
 */
export function duration(milliseconds: number): string {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    return colors.muted(`${hours}h ${minutes % 60}m ${seconds % 60}s`);
  } else if (minutes > 0) {
    return colors.muted(`${minutes}m ${seconds % 60}s`);
  } else {
    return colors.muted(`${seconds}s`);
  }
}
