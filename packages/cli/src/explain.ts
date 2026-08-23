// chronos explain (§4.3, optional) — summarize a failing capsule in plain English.
// Zero LLM dependencies in core — CLI-only convenience using native fetch.

import { readCapsule, type FailureCapsule } from "@sx4im/chronos-vitest/engine";
import type { TraceEvent } from "@sx4im/chronos-core";
import { CHRONOS_VERSION } from "@sx4im/chronos-core";
import { resolveCapsulePath, capsuleReadError } from "./util.js";
import { safeText } from "./sanitize.js";
import { C, drawBox, selectPrompt, inputPrompt, secretPrompt, renderTopBanner } from "./ui.js";

export interface ExplainResult {
  exitCode: number;
  message: string;
}

export interface ProviderDefinition {
  id: string;
  name: string;
  envKey: string;
  baseUrl: string;
  defaultModel: string;
  type: "openai" | "anthropic" | "gemini";
}

export const PROVIDERS: ProviderDefinition[] = [
  {
    id: "openai",
    name: "OpenAI",
    envKey: "OPENAI_API_KEY",
    baseUrl: "https://api.openai.com/v1",
    defaultModel: "gpt-4o",
    type: "openai",
  },
  {
    id: "anthropic",
    name: "Anthropic",
    envKey: "ANTHROPIC_API_KEY",
    baseUrl: "https://api.anthropic.com/v1",
    defaultModel: "claude-3-7-sonnet-20250219",
    type: "anthropic",
  },
  {
    id: "gemini",
    name: "Google Gemini",
    envKey: "GEMINI_API_KEY",
    baseUrl: "https://generativelanguage.googleapis.com/v1beta",
    defaultModel: "gemini-2.0-flash",
    type: "gemini",
  },
  {
    id: "custom",
    name: "Custom (OpenAI-Compatible)",
    envKey: "LLM_BASE_URL",
    baseUrl: "http://localhost:8080/v1",
    defaultModel: "custom-model",
    type: "openai",
  },
];

// Exported for tests — these are the security-critical pure transforms
// (credential redaction, endpoint validation) that deserve direct coverage.
export function sanitizeSummary(summary: string): string {
  // Control characters first: this text is bound for a third-party API AND for
  // the terminal, and the credential redaction below should not be dodgeable by
  // splicing an escape sequence into the middle of a token.
  return safeText(summary)
    .replace(/eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/g, "[REDACTED_JWT]")
    .replace(
      /(bearer\s+|token[=:]\s*|key[=:]\s*|secret[=:]\s*|password[=:]\s*)(?!\[REDACTED)("[^"]*"|[^\s,;"]+)/gi,
      "$1[REDACTED]",
    );
}

/** An LLM endpoint must be plain `http:`/`https:`.
 *
 *  The base URL comes from `CHRONOS_EXPLAIN_BASE_URL`/`LLM_BASE_URL` or an
 *  interactive prompt, and the API key is attached to whatever it names — so a
 *  malformed or hostile value is a credential-exfiltration path, and a scheme
 *  like `file:` is a request the user never intended. Validate before the key
 *  is ever attached. */
function assertUsableEndpoint(baseUrl: string): URL {
  let url: URL;
  try {
    url = new URL(baseUrl);
  } catch {
    throw new Error("LLM base URL is not a valid absolute URL (expected http:// or https://)");
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error(`LLM base URL scheme ${url.protocol} is not allowed (use http: or https:)`);
  }
  return url;
}

/** Loopback hosts are the legitimate plaintext case (Ollama, LM Studio, a local
 *  vLLM). Anywhere else, `http:` puts the API key on the wire in the clear. */
/** Exported for tests. */
export function isLoopback(url: URL): boolean {
  const h = url.hostname.toLowerCase();
  return h === "localhost" || h === "127.0.0.1" || h === "::1" || h === "[::1]";
}

function formatEvent(e: TraceEvent): string {
  const where = `t=${e.t} seq=${e.seq}`;
  switch (e.kind) {
    case "timer":
      return `${where} timer${e.nodeId !== undefined ? " " + e.nodeId : ""}`;
    case "wake":
      return `${where} wake ${e.nodeId}`;
    case "send":
      return `${where} send ${e.from}→${e.to} ${sanitizeSummary(e.summary)}`;
    case "deliver":
      return `${where} deliver ${e.from}→${e.to} ${sanitizeSummary(e.summary)}`;
    case "crash":
      return `${where} crash ${e.nodeId}`;
    case "restart":
      return `${where} restart ${e.nodeId}`;
    case "partition":
      return `${where} partition [${e.groups.map((g) => g.join(",")).join("] | [")}] healAt=${e.healAt}`;
    case "invariant-violation":
      return `${where} VIOLATION ${e.name} — ${sanitizeSummary(e.detail)}`;
  }
}

function summarize(c: FailureCapsule): string {
  const events = c.trace.events;
  const tail = events.slice(-30);
  return [
    `seed=${c.seed}`,
    `nodes=[${c.nodes.join(", ")}]`,
    `invariant: ${c.invariant.name} — ${sanitizeSummary(c.invariant.detail)}`,
    `network: latency ${c.config.network.minLatency}-${c.config.network.maxLatency}ms, drop=${c.config.network.dropProb}, dup=${c.config.network.dupProb}`,
    `chaos: partition=${c.config.chaos.partitionProb} crash=${c.config.chaos.crashProb} restart=${c.config.chaos.restartProb}`,
    `events (last ${tail.length} of ${events.length}):`,
    ...tail.map(formatEvent),
  ].join("\n");
}

function detectEnvironmentProvider(): { provider: ProviderDefinition; key: string; model: string; baseUrl: string } | null {
  const env = process.env;
  if (env.CHRONOS_EXPLAIN_BASE_URL || env.LLM_BASE_URL) {
    const customProv = PROVIDERS.find((p) => p.id === "custom")!;
    return {
      provider: customProv,
      key: env.CHRONOS_EXPLAIN_KEY || env.LLM_API_KEY || "dummy",
      model: env.CHRONOS_EXPLAIN_MODEL || env.LLM_MODEL || "default",
      baseUrl: env.CHRONOS_EXPLAIN_BASE_URL || env.LLM_BASE_URL || "",
    };
  }
  for (const prov of PROVIDERS) {
    if (prov.id === "custom") continue;
    const val = env[prov.envKey] || (prov.id === "gemini" ? env.GOOGLE_API_KEY : undefined);
    if (val) {
      return {
        provider: prov,
        key: val,
        model: env.CHRONOS_EXPLAIN_MODEL || prov.defaultModel,
        baseUrl: prov.baseUrl,
      };
    }
  }
  return null;
}

async function runInteractivePrompt(): Promise<{ provider: ProviderDefinition; key: string; model: string; baseUrl: string }> {
  const providerOptions = PROVIDERS.map((p) => ({ label: p.name, value: p }));
  const selectedProvider = await selectPrompt("Select AI Provider", providerOptions, 0);

  let targetBaseUrl = selectedProvider.baseUrl;
  if (selectedProvider.id === "custom") {
    targetBaseUrl = await inputPrompt("Enter Base Endpoint URL", "http://localhost:8080/v1");
  }

  const envKeyVal = process.env[selectedProvider.envKey] || (selectedProvider.id === "gemini" ? process.env.GOOGLE_API_KEY : undefined);
  let apiKey = envKeyVal || "";
  if (envKeyVal) {
    process.stdout.write(`${C.emerald("✔")} ${C.bold("API Key")} ${C.cyan(`Loaded from ${selectedProvider.envKey}`)}\n\n`);
  } else {
    // Never `inputPrompt` for a credential — that echoes it into the scrollback.
    apiKey = await secretPrompt(`Enter ${selectedProvider.name} API Key`);
  }

  const selectedModel = await inputPrompt("Enter Model ID", selectedProvider.defaultModel);

  return { provider: selectedProvider, key: apiKey, model: selectedModel, baseUrl: targetBaseUrl };
}

export async function explainCommand(capsulePath: string): Promise<ExplainResult> {
  const topHeader = renderTopBanner(CHRONOS_VERSION);
  let capsule: FailureCapsule;
  try {
    capsule = await readCapsule(resolveCapsulePath(capsulePath));
  } catch (e) {
    return { exitCode: 2, message: topHeader + capsuleReadError(capsulePath, e) };
  }

  const envDetect = detectEnvironmentProvider();
  if (!process.stdout.isTTY && !envDetect) {
    return {
      exitCode: 0,
      message: topHeader + `  ${C.badgeIndigo(" EXPLAIN ")} skipped: no AI provider key set.\n`,
    };
  }

  let config;
  if (envDetect && (!process.stdout.isTTY || process.env.CI)) {
    config = envDetect;
  } else {
    process.stdout.write(topHeader);
    process.stdout.write(`${C.bold("Chronos Failure Capsule AI Explanation")}\n`);
    process.stdout.write(`${C.muted(`Loaded capsule: ${safeText(capsulePath)}`)}\n\n`);
    config = await runInteractivePrompt();
  }

  const prompt = "You are a distributed-systems debugging expert. Explain the root cause of this failure:\n\n" + summarize(capsule);

  try {
    const explanationText = await executeLLMCall(config.provider, config.key, config.model, config.baseUrl, prompt);
    const reportLines = [
      `${C.bold("Provider")}: ${C.cyan(config.provider.name)}  ${C.bold("Model")}: ${C.purple(config.model)}`,
      `${C.bold("Capsule")}:  ${C.white(safeText(capsulePath))}`,
      "",
      `${C.bold("ROOT CAUSE ANALYSIS")}:`,
      // The model's reply is doubly untrusted: it is generated text, and the
      // capsule that shaped the prompt is attacker-controlled, so this is the
      // exit of a prompt-injection path straight onto the user's terminal.
      ...explanationText.split("\n").map((line) => `  ${safeText(line)}`),
    ];
    return { exitCode: 0, message: "\n" + drawBox(`${C.indigo("EXPLANATION")}`, reportLines) + "\n" };
  } catch (e) {
    const err = e instanceof Error ? e.message : "API call failed";
    return {
      exitCode: 1,
      message: `\n${C.badgeRose(" ERROR ")} ${C.rose(`${config.provider.name} failed: ${err}`)}\n`,
    };
  }
}

// Minimal structural views of the three response shapes. Typing them (rather
// than `as any`) is what makes the optional chaining below actually checked.
interface GeminiResponse {
  candidates?: { content?: { parts?: { text?: string }[] } }[];
}
interface AnthropicResponse {
  content?: { text?: string }[];
}
interface OpenAIResponse {
  choices?: { message?: { content?: string } }[];
}

async function executeLLMCall(provider: ProviderDefinition, key: string, model: string, baseUrl: string, prompt: string): Promise<string> {
  const url = assertUsableEndpoint(baseUrl);
  if (url.protocol === "http:" && !isLoopback(url) && key) {
    throw new Error(
      `refusing to send an API key over plaintext http to ${url.hostname} — use https (loopback is exempt)`,
    );
  }
  const ctrl = new AbortController();
  const to = setTimeout(() => ctrl.abort(), 30_000);
  try {
    if (provider.type === "gemini") {
      // The key goes in a HEADER, never `?key=`. Query strings are logged by
      // proxies, CDNs, and the server's own access log, and they leak through
      // `Referer` — putting a long-lived credential there means it outlives the
      // request in places nobody audits.
      const endpoint = baseUrl.endsWith("/generateContent")
        ? baseUrl
        : `${baseUrl.replace(/\/$/, "")}/models/${encodeURIComponent(model)}:generateContent`;
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "content-type": "application/json", "x-goog-api-key": key },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
        signal: ctrl.signal,
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as GeminiResponse;
      return data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    }
    if (provider.type === "anthropic") {
      const endpoint = baseUrl.endsWith("/messages") ? baseUrl : `${baseUrl.replace(/\/$/, "")}/messages`;
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "content-type": "application/json", "x-api-key": key, "anthropic-version": "2023-06-01" },
        body: JSON.stringify({ model, max_tokens: 600, messages: [{ role: "user", content: prompt }] }),
        signal: ctrl.signal,
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as AnthropicResponse;
      return data.content?.[0]?.text ?? "";
    }
    const endpoint = baseUrl.endsWith("/chat/completions") ? baseUrl : `${baseUrl.replace(/\/$/, "")}/chat/completions`;
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "content-type": "application/json", authorization: `Bearer ${key}` },
      body: JSON.stringify({ model, messages: [{ role: "user", content: prompt }], temperature: 0.2, max_tokens: 600 }),
      signal: ctrl.signal,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = (await res.json()) as OpenAIResponse;
    return data.choices?.[0]?.message?.content ?? "";
  } finally {
    clearTimeout(to);
  }
}
