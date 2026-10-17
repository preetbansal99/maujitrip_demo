import { NextRequest, NextResponse } from "next/server";
import { inventoryBlock, readMemory, runTool, TOOL_DEFS } from "@/lib/ai/tools";
import { buildInventoryBlock, buildSystemPrompt } from "@/lib/ai/system";
import { callOpencodeLocal, isOpencodeLocal, OPENCODE_LOCAL_DEFAULT_MODEL } from "@/lib/ai/opencode-local";

// Dev-phase: per-request key, never stored. Free built-in preset needs no key.
export async function POST(req: NextRequest) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }
  const { baseUrl, apiKey, model, messages, temperature } = body || {};
  if (!baseUrl || !model || !Array.isArray(messages)) {
    return NextResponse.json(
      { error: "baseUrl, model and messages[] are required." },
      { status: 400 }
    );
  }
  const useLocal = isOpencodeLocal(baseUrl);
  let url = "";
  if (!useLocal) {
    try {
      url = baseUrl.replace(/\/+$/, "") + "/chat/completions";
      new URL(url);
    } catch {
      return NextResponse.json({ error: "Invalid baseUrl." }, { status: 400 });
    }
  }

  const call = async (msgs: any[], tools?: any) => {
    let lastErr = "";
    for (let attempt = 0; attempt < 3; attempt++) {
      if (attempt > 0) await new Promise((res) => setTimeout(res, 1500 * attempt));
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 60000);
      let r: Response;
      try {
        r = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
            "HTTP-Referer": "http://localhost:3000/planner",
            "X-Title": "MaujiTrip Planner (dev)",
          },
          body: JSON.stringify({
            model,
            messages: msgs,
            temperature: typeof temperature === "number" ? temperature : 0.7,
            ...(tools ? { tools, tool_choice: "auto" } : {}),
          }),
          signal: ctrl.signal,
        });
      } catch (e: any) {
        clearTimeout(timer);
        lastErr = e?.name === "AbortError" ? "Model timed out." : `Network error: ${String(e?.message || e).slice(0, 100)}`;
        continue;
      }
      clearTimeout(timer);
      const text = await r.text();
      let data: any = null;
      try {
        data = JSON.parse(text);
      } catch {
        /* non-JSON */
      }
      if (r.ok && data?.choices?.[0]) return { ok: true as const, data };
      lastErr =
        data?.error?.message || data?.message || `Upstream error (HTTP ${r.status}).`;
      if (r.status < 500 && r.status !== 429) return { ok: false as const, fatal: true, err: lastErr };
    }
    return { ok: false as const, fatal: false, err: lastErr };
  };

  try {
    const invData = inventoryBlock();
    const memory = await readMemory();
    const system = buildSystemPrompt({
      inventory: buildInventoryBlock({
        destinations: invData.dests,
        packages: invData.pkgs,
        hotels: invData.hotels,
        flights:
          "always search live via the search_flights tool, then link /search/flight with the same params. Also useful: /holidays/search (all packages), /hotels, /bus, /flights, /blog.",
      }),
      memory,
      date: new Date().toISOString().slice(0, 10),
    });

    let convo = [{ role: "system", content: system }, ...messages];
    let first: any;
    let plan: any = null;
    if (useLocal) {
      const local = await callOpencodeLocal({
        messages: convo.map((m: any) => ({ role: m.role, content: m.content })),
        model: model || OPENCODE_LOCAL_DEFAULT_MODEL,
      });
      if (!local.ok || !local.content) {
        return NextResponse.json(
          { error: `${local.errorMessage || "OpenCode local model failed."} Tap send again to retry.` },
          { status: 502 }
        );
      }
      first = {
        ok: true,
        data: {
          model: local.model,
          choices: [{ message: { role: "assistant", content: local.content } }],
        },
      };
    } else {
      first = await call(convo, TOOL_DEFS);

      // Fallback: model without tool support → plain chat (client Generate button still builds plans).
      if (!first.ok && /tool/i.test((first as any).err || "")) {
        first = await call(convo);
      }
      if (!first.ok) {
        return NextResponse.json(
          { error: `${(first as any).err} The free model is busy. Tap send again to retry.` },
          { status: 502 }
        );
      }

      for (let i = 0; i < 4; i++) {
        const msg = first.data.choices[0].message;
        const calls = msg?.tool_calls;
        if (!calls || calls.length === 0) {
          return NextResponse.json({ reply: msg?.content || "…", model: first.data?.model || model, plan });
        }
        convo = [...convo, msg];
        for (const c of calls.slice(0, 4)) {
          let args: any = {};
          try {
            args = JSON.parse(c.function?.arguments || "{}");
          } catch {
            /* keep empty */
          }
          const out = await runTool(c.function?.name, args);
          if (c.function?.name === "build_trip_plan") {
            try {
              const j = JSON.parse(out);
              if (j?.plan) plan = j.plan;
            } catch {
              /* text fallback */
            }
          }
          convo = [
            ...convo,
            { role: "tool", tool_call_id: c.id, name: c.function?.name, content: String(out).slice(0, 4000) },
          ];
        }
        const next = await call(convo, TOOL_DEFS);
        if (!next.ok) {
          return NextResponse.json(
            { reply: "I hit a snag reaching trip data. Tap send again to retry.", plan },
            { status: 200 }
          );
        }
        first = next;
      }
    }
    const last = first.data.choices[0].message;
    return NextResponse.json({ reply: last?.content || "…", model: first.data?.model || model, plan });
  } catch (e: any) {
    return NextResponse.json(
      { error: `Brain error: ${String(e?.message || e).slice(0, 160)}` },
      { status: 502 }
    );
  }
}
