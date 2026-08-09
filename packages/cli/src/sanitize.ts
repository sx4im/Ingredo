// Rendering helpers for UNTRUSTED capsule text.
//
// Every `chronos` command that shows a capsule (trace, stats, export, explain)
// interpolates strings an attacker chose — `summary`, `invariant.detail`, node
// ids — into a terminal line, a Markdown table, or a CSV cell. Each of those
// three sinks has its own injection grammar, and none of them is covered by the
// capsule validator: `validateCapsule` bounds a summary's LENGTH, but a 40-char
// summary is more than enough to repaint a terminal or smuggle a formula into a
// spreadsheet. Sanitizing belongs at the point of rendering, per sink.

/** Strip terminal control sequences from untrusted text.
 *
 *  A capsule's `summary` is written straight to stdout by `chronos trace`. Left
 *  raw, an attacker-authored capsule can embed ANSI/OSC escapes and:
 *    - erase and repaint earlier output (`\x1b[2J`, `\x1b[A`, `\r`) so a run
 *      that reported a violation appears to report "0 violations" — the trace
 *      viewer's entire job is telling a human what happened, so a capsule that
 *      can lie about that is worse than one that crashes;
 *    - rewrite the window/tab title (OSC 0), or drive terminals whose escape
 *      handling has its own history of memory-safety bugs.
 *
 *  So: drop ESC-introduced sequences, then drop every remaining C0/C1 control
 *  character. Tab survives (harmless, and real payloads contain it); newline
 *  does NOT, because these renderers emit one line per event and a summary
 *  containing `\n` would forge additional event lines. */
//
// The byte ranges below are ECMA-48's, and each pass's quantified classes are
// mutually disjoint — no input can be split between two of them — so every
// pass is linear and none of this is a ReDoS vector on attacker-chosen text.
export function sanitizeText(s: string): string {
  return (
    s
      // OSC: ESC ] … terminated by BEL or ST (ESC \), or left unterminated.
      // Matched first, because its payload may legitimately contain `[`.
      .replace(/\x1b\][^\x07\x1b]*(?:\x07|\x1b\\)?/g, "")
      // CSI: ESC [ · parameter bytes 0x30–0x3F · intermediates 0x20–0x2F ·
      // final byte 0x40–0x7E. Covers colors, cursor movement, and erasure.
      .replace(/\x1b\[[0-?]*[ -/]*[@-~]?/g, "")
      // Any other ESC-introduced sequence (charset selection, two-character
      // escapes) and a lone trailing ESC.
      .replace(/\x1b[ -/]*[0-~]?/g, "")
      // Remaining C0 (except tab), DEL, and C1 controls — including the
      // single-byte C1 forms such as 0x9B, which is CSI in its own right.
      .replace(/[\x00-\x08\x0a-\x1f\x7f-\x9f]/g, "")
  );
}

/** Sanitize an untrusted value for terminal output, with a length cap.
 *  `validateCapsule` already bounds these fields, but a renderer should never
 *  depend on a bound enforced somewhere else. */
export function safeText(s: unknown, maxLen = 512): string {
  const raw = typeof s === "string" ? s : String(s);
  const clean = sanitizeText(raw);
  return clean.length > maxLen ? `${clean.slice(0, maxLen)}…` : clean;
}

// Excel, LibreOffice, and Google Sheets treat a cell whose first character is
// one of these as a FORMULA, not text. `=cmd|'/c calc'!A1` in a capsule summary
// becomes code execution on the machine of whoever opens the exported CSV — the
// export is meant to be shared, which is exactly what makes this reachable.
const CSV_FORMULA_LEAD = /^[=+\-@\t\r]/;

/** Render one CSV cell: neutralize formula leads, then quote per RFC 4180.
 *  The leading apostrophe is the standard mitigation — spreadsheets consume it
 *  as a "treat as text" marker rather than displaying it. */
export function escapeCsvCell(val: string): string {
  const clean = sanitizeText(val);
  const safe = CSV_FORMULA_LEAD.test(clean) ? `'${clean}` : clean;
  if (/[",\n\r]/.test(safe)) return `"${safe.replace(/"/g, '""')}"`;
  return safe;
}

/** Render untrusted text inside a Markdown table cell. Pipes would forge extra
 *  columns and backticks would break out of the inline-code spans the exporter
 *  wraps values in, so both are escaped; `sanitizeText` has already removed the
 *  newlines that would forge extra rows. */
export function escapeMarkdownCell(val: string): string {
  return sanitizeText(val).replace(/([\\`|*_[\]<>])/g, "\\$1");
}
