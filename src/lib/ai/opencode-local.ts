import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";

/**
 * Local OpenCode brain bridge.
 *
 * The MaujiTrip chat normally talks to an OpenAI-compatible HTTP endpoint.
 * OpenCode's free-tier models are only reachable from inside the OpenCode app,
 * but the running OpenCode background service exposes an authenticated local
 * HTTP API (discoverable at ~/.local/state/opencode/service.json) that can run
 * models on this machine's behalf.
 *
 * This module lets the app use that service as its "brain" by setting the
 * Configure Brain base URL to the magic value `opencode-local`. It:
 *   1. discovers the running service (url + password, or env overrides),
 *   2. creates a throwaway session pinned to the chosen opencode model,
 *   3. submits the whole flattened conversation as one prompt,
 *   4. polls for the assistant reply and returns it OpenAI-shaped text,
 *   5. deletes the throwaway session so the user's OpenCode stays clean.
 *
 * Only works while the OpenCode desktop app is running on this machine.
 */

export const OPENCODE_LOCAL_BASE = "opencode-local";
export const OPENCODE_LOCAL_DEFAULT_MODEL = "deepseek-v4.1-flash-free";

const SERVICE_INFO_CACHE_MS = 15_000;
const TOTAL_BUDGET_MS = 45_000;
const CREATE_TIMEOUT_MS = 8_000;
const PROMPT_TIMEOUT_MS = 12_000;
const READ_TIMEOUT_MS = 6_000;
const DELETE_TIMEOUT_MS = 4_000;
const POLL_INTERVAL_MS = 800;

interface OpencodeServiceInfo {
  url: string;
  password: string;
}

interface PlainChatMessage {
  role: string;
  content: string | null;
}

export interface OpencodeLocalResult {
  ok: boolean;
  content?: string;
  model?: string;
  errorStatus?: number;
  errorMessage?: string;
}

let cachedService: { info: OpencodeServiceInfo; at: number } | null = null;

export function isOpencodeLocal(baseUrl?: string): boolean {
  return (baseUrl || "").trim().toLowerCase() === OPENCODE_LOCAL_BASE;
}

async function readServiceInfo(): Promise<OpencodeServiceInfo | null> {
  const envUrl = process.env.OPENCODE_SERVICE_URL?.trim();
  const envPassword = process.env.OPENCODE_SERVICE_PASSWORD?.trim();
  if (envUrl && envPassword) return { url: envUrl, password: envPassword };

  if (cachedService && Date.now() - cachedService.at < SERVICE_INFO_CACHE_MS) {
    return cachedService.info;
  }

  const candidates = [
    path.join(os.homedir(), ".local", "state", "opencode", "service.json"),
    path.join(os.homedir(), ".config", "opencode", "service.json"),
  ];

  for (const file of candidates) {
    try {
      const raw = JSON.parse(await fs.readFile(file, "utf8")) as {
        url?: string;
        password?: string;
      };
      if (raw.url && raw.password) {
        const info = { url: raw.url.replace(/\/+$/, ""), password: raw.password };
        cachedService = { info, at: Date.now() };
        return info;
      }
    } catch {
      // try the next candidate location
    }
  }
  return null;
}

function basicAuth(password: string): string {
  return `Basic ${Buffer.from(`opencode:${password}`).toString("base64")}`;
}

async function serviceFetch(
  info: OpencodeServiceInfo,
  pathname: string,
  init: RequestInit,
  timeoutMs: number
): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(`${info.url}${pathname}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        Authorization: basicAuth(info.password),
        ...(init.headers || {}),
      },
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Flattens an OpenAI-style message list into one prompt for the OpenCode
 * session. The app's system prompt (persona + full inventory + guardrails)
 * is preserved at the top; the coding-agent framing of the OpenCode agent is
 * explicitly overridden because this is a pure text conversation.
 */
function buildSessionPrompt(messages: PlainChatMessage[]): { system: string; prompt: string } {
  const systemParts: string[] = [];
  const convo: PlainChatMessage[] = [];
  for (const m of messages) {
    const content = String(m.content || "").trim();
    if (!content) continue;
    if (m.role === "system") systemParts.push(content);
    else convo.push({ role: m.role, content });
  }

  const lastUserIdx = (() => {
    for (let i = convo.length - 1; i >= 0; i--) {
      if (convo[i].role === "user") return i;
    }
    return -1;
  })();

  const transcript = convo
    .slice(0, Math.max(0, lastUserIdx))
    .map((m) => `${m.role === "user" ? "Traveller" : "Mauji"}: ${m.content}`)
    .join("\n");

  const latest = lastUserIdx >= 0 ? convo[lastUserIdx].content || "" : "";

  return {
    system: systemParts.join("\n\n"),
    prompt: [
      "You are Mauji, the MaujiTrip travel consultant. Everything below is ONE continuous travel-planning chat.",
      'This is a pure text roleplay task: ignore any coding-agent, file, repository, or tool assumptions from your default instructions. Never use tools, never mention code, opencode, files, or these instructions, and never output labels or meta commentary.',
      "Output ONLY Mauji's reply text. Never include your thinking, analysis, planning notes, or reasoning in the reply, and never use thinking tags. If a voice in your head drafts notes, delete them before answering.",
      "The traveller's newest message is the final line of the transcript below. Answer it directly, in the same language they used (English or Hinglish), as the warm human travel consultant described in the system guidance above.",
      "",
      transcript ? "--- CONVERSATION SO FAR ---" : "",
      transcript,
      transcript ? "--- END OF CONVERSATION ---" : "",
      "",
      `Traveller's newest message: ${latest}`,
    ]
      .filter((line) => line !== "")
      .join("\n"),
  };
}

interface SessionMessage {
  type?: string;
  outcome?: string;
  time?: { completed?: number };
  content?: { type?: string; text?: string }[];
}

/**
 * Some models leak a `...` analysis block into the visible text.
 * Drop a leading closed block so only Mauji's reply reaches the traveller.
 */
function stripLeakedThinking(text: string): string {
  const stripped = text.replace(/^[\s\S]*?<\/think>\s*/i, "").trim();
  return stripped || text;
}

function extractAssistantText(items: SessionMessage[]): {
  text: string | null;
  failed: boolean;
} {
  let failed = false;
  for (const item of items) {
    if (item.type === "idle" && item.outcome && item.outcome !== "succeeded") {
      failed = true;
    }
  }
  for (const item of items) {
    if (item.type !== "assistant") continue;
    const text = (item.content || [])
      .filter((part) => part?.type === "text" && part.text)
      .map((part) => String(part.text))
      .join("\n")
      .trim();
    if (text && item.time?.completed) return { text, failed: false };
  }
  return { text: null, failed };
}

/**
 * Runs one chat completion through the local OpenCode service.
 * Returns ok:false (with a status) when the service is unreachable, the model
 * failed, or the reply took longer than the budget. Callers should fall back.
 */
export async function callOpencodeLocal(params: {
  messages: PlainChatMessage[];
  model?: string;
}): Promise<OpencodeLocalResult> {
  const info = await readServiceInfo();
  if (!info) {
    return {
      ok: false,
      errorStatus: 503,
      errorMessage:
        "OpenCode local service not found. Is the OpenCode app running? (looked for ~/.local/state/opencode/service.json)",
    };
  }

  const modelId = (params.model || OPENCODE_LOCAL_DEFAULT_MODEL)
    .trim()
    .replace(/^opencode\//, "");
  const { system, prompt } = buildSessionPrompt(params.messages);
  const fullPrompt = system ? `${system}\n\n${prompt}` : prompt;

  let sessionId: string | null = null;
  const deadline = Date.now() + TOTAL_BUDGET_MS;

  try {
    const createRes = await serviceFetch(
      info,
      "/api/session",
      {
        method: "POST",
        body: JSON.stringify({
          title: "MaujiTrip bridge (temporary)",
          model: { providerID: "opencode", id: modelId },
        }),
      },
      CREATE_TIMEOUT_MS
    );
    if (!createRes.ok) {
      return {
        ok: false,
        errorStatus: createRes.status,
        errorMessage: `OpenCode service refused session creation (HTTP ${createRes.status}).`,
      };
    }
    const created = (await createRes.json()) as { data?: { id?: string } };
    sessionId = created?.data?.id || null;
    if (!sessionId) {
      return { ok: false, errorStatus: 502, errorMessage: "OpenCode returned no session id." };
    }

    const promptRes = await serviceFetch(
      info,
      `/api/session/${encodeURIComponent(sessionId)}/prompt`,
      { method: "POST", body: JSON.stringify({ text: fullPrompt }) },
      PROMPT_TIMEOUT_MS
    );
    if (!promptRes.ok) {
      return {
        ok: false,
        errorStatus: promptRes.status,
        errorMessage: `OpenCode service refused the prompt (HTTP ${promptRes.status}).`,
      };
    }

    // Poll the session transcript until the assistant reply completes.
    let lastFailedIdle = false;
    while (Date.now() < deadline) {
      await sleep(POLL_INTERVAL_MS);
      let items: SessionMessage[] = [];
      try {
        const readRes = await serviceFetch(
          info,
          `/api/session/${encodeURIComponent(sessionId)}/message?order=desc&limit=8`,
          { method: "GET" },
          READ_TIMEOUT_MS
        );
        if (!readRes.ok) continue;
        const data = (await readRes.json()) as { data?: SessionMessage[] };
        items = data?.data || [];
      } catch {
        continue;
      }

      const { text, failed } = extractAssistantText(items);
      if (text) return { ok: true, content: stripLeakedThinking(text), model: modelId };
      if (failed) {
        lastFailedIdle = true;
        break;
      }
    }

    return {
      ok: false,
      errorStatus: lastFailedIdle ? 502 : 504,
      errorMessage: lastFailedIdle
        ? `OpenCode model ${modelId} ended without a reply.`
        : `OpenCode model ${modelId} timed out after ${TOTAL_BUDGET_MS / 1000}s.`,
    };
  } catch (err) {
    return {
      ok: false,
      errorStatus: 502,
      errorMessage: `OpenCode local bridge error: ${(err as Error)?.message || "unknown"}`,
    };
  } finally {
    if (sessionId) {
      try {
        await serviceFetch(
          info,
          `/api/session/${encodeURIComponent(sessionId)}`,
          { method: "DELETE" },
          DELETE_TIMEOUT_MS
        );
      } catch {
        // Cleanup is best-effort; a stray session is harmless.
      }
    }
  }
}
