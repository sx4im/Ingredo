// chronos CLI UI design system — OpenCode / Claude Code CLI aesthetics.
// Pure zero-dependency ANSI 24-bit RGB color styling and box-drawing layout primitives.

import readline from "node:readline";

function useColor(): boolean {
  return !process.env.NO_COLOR && (!!process.stdout.isTTY || process.env.FORCE_COLOR === "1");
}

export const C = {
  reset: "\x1b[0m",
  bold: (s: string) => paint(s, "\x1b[1m"),
  dim: (s: string) => paint(s, "\x1b[2m"),
  italic: (s: string) => paint(s, "\x1b[3m"),

  // 24-bit RGB Tailored Palettes
  indigo: (s: string) => paint(s, "\x1b[38;2;99;102;241m"),
  purple: (s: string) => paint(s, "\x1b[38;2;168;85;247m"),
  cyan: (s: string) => paint(s, "\x1b[38;2;61;155;239m"),
  emerald: (s: string) => paint(s, "\x1b[38;2;16;185;129m"),
  rose: (s: string) => paint(s, "\x1b[38;2;244;63;94m"),
  amber: (s: string) => paint(s, "\x1b[38;2;245;158;11m"),
  slate: (s: string) => paint(s, "\x1b[38;2;148;163;184m"),
  muted: (s: string) => paint(s, "\x1b[38;2;100;116;139m"),
  white: (s: string) => paint(s, "\x1b[38;2;250;250;250m"),

  // Background Badges
  badgeIndigo: (s: string) => paint(` ${s} `, "\x1b[48;2;99;102;241m\x1b[38;2;255;255;255m\x1b[1m"),
  badgeRose: (s: string) => paint(` ${s} `, "\x1b[48;2;244;63;94m\x1b[38;2;255;255;255m\x1b[1m"),
  badgeEmerald: (s: string) => paint(` ${s} `, "\x1b[48;2;16;185;129m\x1b[38;2;255;255;255m\x1b[1m"),
  badgeAmber: (s: string) => paint(` ${s} `, "\x1b[48;2;245;158;11m\x1b[38;2;0;0;0m\x1b[1m"),
};

function paint(s: string, code: string): string {
  return useColor() ? `${code}${s}${C.reset}` : s;
}

export function renderTopBanner(version = "0.1.4"): string {
  return (
    `  ${C.badgeIndigo(" CHRONOS CLI ")} ${C.cyan("Deterministic Simulation Tooling")} ${C.slate(`v${version}`)}\n` +
    `  ${C.muted("Tip: Run 'chronos --help' for full command & ecosystem guide.")}\n\n`
  );
}



export function drawBox(title: string, contentLines: string[]): string {
  const cleanTitle = stripAnsi(title);
  const cleanLines = contentLines.map(stripAnsi);

  // Maximum content width calculation
  const maxContentLen = cleanLines.reduce((m, l) => Math.max(m, l.length), 0);
  const innerWidth = Math.max(maxContentLen, cleanTitle.length + 4, 48);

  const fillDashes = Math.max(0, innerWidth - cleanTitle.length - 2);
  const topBorder = `${C.indigo("╭─")} ${title} ${C.indigo("─".repeat(fillDashes))}${C.indigo("─╮")}`;
  const bottomBorder = `${C.indigo("╰─")}${C.indigo("─".repeat(innerWidth))}${C.indigo("─╯")}`;

  const body = contentLines.map((line, idx) => {
    const len = cleanLines[idx]?.length ?? 0;
    const padding = " ".repeat(Math.max(0, innerWidth - len));
    return `${C.indigo("│")} ${line}${padding} ${C.indigo("│")}`;
  });

  return [topBorder, ...body, bottomBorder].join("\n");
}

export function stripAnsi(str: string): string {
  return str
    .replace(/\x1b\[[0-9;]*m/g, "")
    .replace(/\x1b\][^\x07]*\x07/g, "");
}

export interface PromptOption<T> {
  label: string;
  value: T;
  hint?: string | undefined;
}

export function selectPrompt<T>(
  title: string,
  options: PromptOption<T>[],
  initialIndex = 0
): Promise<T> {
  return new Promise((resolve) => {
    if (!process.stdin.isTTY) {
      return resolve(options[initialIndex]?.value as T);
    }

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    process.stdout.write(`${C.indigo("?")} ${C.bold(title)}\n`);
    options.forEach((opt, i) => {
      process.stdout.write(`  ${C.cyan(String(i + 1))}. ${opt.label}${opt.hint ? ` ${C.muted(`(${opt.hint})`)}` : ""}\n`);
    });

    const ask = () => {
      rl.question(`\nSelect [1-${options.length}] (default ${initialIndex + 1}): `, (answer) => {
        const trimmed = answer.trim();
        if (trimmed === "") {
          rl.close();
          const selected = options[initialIndex]!;
          process.stdout.write(`${C.emerald("✔")} ${C.bold(title)} ${C.cyan(selected.label)}\n\n`);
          return resolve(selected.value);
        }

        const idx = parseInt(trimmed, 10) - 1;
        if (isNaN(idx) || idx < 0 || idx >= options.length) {
          process.stdout.write(C.rose("  Invalid selection. Please try again.\n"));
          return ask();
        }

        rl.close();
        const selected = options[idx]!;
        process.stdout.write(`${C.emerald("✔")} ${C.bold(title)} ${C.cyan(selected.label)}\n\n`);
        resolve(selected.value);
      });
    };
    ask();
  });
}

export function inputPrompt(
  questionText: string,
  defaultValue = ""
): Promise<string> {
  return new Promise((resolve) => {
    if (!process.stdin.isTTY) {
      return resolve(defaultValue);
    }

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    const hintStr = defaultValue ? ` ${C.muted(`(default: ${defaultValue})`)}` : "";
    const promptMsg = `${C.indigo("?")} ${C.bold(questionText)}${hintStr}: `;

    rl.question(promptMsg, (answer) => {
      rl.close();
      const finalVal = answer.trim() || defaultValue;
      process.stdout.write(`${C.emerald("✔")} ${C.bold(questionText)} ${C.cyan(finalVal ? "[Entered]" : "[Skipped]")}\n\n`);
      resolve(finalVal);
    });
  });
}
