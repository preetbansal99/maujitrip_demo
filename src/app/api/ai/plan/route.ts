import { NextRequest, NextResponse } from "next/server";
import { callOpencodeLocal, isOpencodeLocal, OPENCODE_LOCAL_DEFAULT_MODEL } from "@/lib/ai/opencode-local";

// POST /api/ai/plan — enrich a rule-built plan with AI-written summary + day details,
// grounded in verified inventory passed from the client. Never invents prices/names.
// Body: { profile, plan, baseUrl?, model?, apiKey? } — defaults to free built-in brain.
export async function POST(req: NextRequest) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }
  const { profile, plan, baseUrl, model, apiKey } = body || {};
  if (!plan || !profile) {
    return NextResponse.json({ error: "profile and plan are required." }, { status: 400 });
  }

  const useLocal = isOpencodeLocal(baseUrl);
  const url = useLocal ? "" : `${String(baseUrl || "https://text.pollinations.ai/openai").replace(/\/+$/, "")}/chat/completions`;
  const mdl = String(model || (useLocal ? OPENCODE_LOCAL_DEFAULT_MODEL : "openai"));

  const inventory = [
    plan.packageTitle ? `Package: ${plan.packageTitle} (${plan.packagePrice ?? "?"} INR, /holidays/packages/${plan.packageSlug || ""})` : "Package: none matched",
    plan.stay ? `Stay: ${plan.stay.name} in ${plan.stay.city} (${plan.stay.price}/night)` : "Stay: no verified stay in inventory",
    plan.flightNote ? `Flight link: ${plan.flightNote}` : "Flight: see /flights",
    `Estimate: ${plan.estimate} INR`,
  ].join("\n");

  const system =
    "You are Mauji, the MaujiTrip travel planner. Rewrite the trip plan text ONLY using the verified inventory below. " +
    "Rules: never invent prices, hotel names, flight numbers, schedules, or activities. Day details may only mention sights, areas, and experiences that are typical and well-known for the listed cities. Never claim anything is booked, confirmed, or reserved. " +
    "Write in Indian English (travellers, not travelers; use the Rs symbol only as given in prices). State each price once, exactly as given, in INR. " +
    "Reply in strict JSON: {\"summary\": string (2-3 sentences, specific with numbers), \"days\": [{\"day\": n, \"title\": string, \"detail\": string}]}. " +
    "Summary must mention destination, days, travellers, budget and any package/stay names with prices if available. " +
    "Keep the same number of days and the same cities as the current days. Day details are 1-2 concrete sentences each. No markdown, JSON only.";

  const user =
    `Profile: destination=${profile.destination}, days=${profile.days}, travellers=${profile.travellers}, budget=${profile.budget ?? "flexible"}, themes=${(profile.themes || []).join(",")}. ` +
    `Verified inventory:\n${inventory}\n` +
    `Current generic days: ${JSON.stringify((plan.days || []).map((d: any) => ({ day: d.day, title: d.title })))}`;

  const call = async () => {
    if (useLocal) {
      const local = await callOpencodeLocal({
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
        model: mdl,
      });
      if (!local.ok || !local.content) {
        return { ok: false as const, err: local.errorMessage || "OpenCode local model failed." };
      }
      return { ok: true as const, content: local.content };
    }
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 60000);
    try {
      const r = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
        },
        body: JSON.stringify({
          model: mdl,
          temperature: 0.6,
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: system },
            { role: "user", content: user },
          ],
        }),
        signal: ctrl.signal,
      });
      const text = await r.text();
      let data: any = null;
      try {
        data = JSON.parse(text);
      } catch {
        return { ok: false as const, err: "Non-JSON upstream." };
      }
      if (!r.ok || !data?.choices?.[0]) {
        return { ok: false as const, err: data?.error?.message || `Upstream HTTP ${r.status}` };
      }
      return { ok: true as const, content: data.choices[0].message?.content || "" };
    } catch (e: any) {
      return { ok: false as const, err: e?.name === "AbortError" ? "AI timed out." : String(e?.message || e).slice(0, 120) };
    } finally {
      clearTimeout(timer);
    }
  };

  let lastErr = "";
  for (let i = 0; i < 2; i++) {
    if (i > 0) await new Promise((r) => setTimeout(r, 1500 * i));
    const res = await call();
    if (!res.ok) {
      lastErr = res.err;
      continue;
    }
    try {
      let c = res.content.trim().replace(/^```json\s*/i, "").replace(/```\s*$/, "");
      const j = JSON.parse(c);
      if (typeof j.summary !== "string" || !Array.isArray(j.days)) throw new Error("bad shape");
      const days = j.days.slice(0, plan.days.length || 14).map((d: any, idx: number) => ({
        day: Number(d.day) || idx + 1,
        title: String(d.title || plan.days[idx]?.title || `Day ${idx + 1}`).slice(0, 120),
        detail: String(d.detail || "").slice(0, 300),
      }));
      return NextResponse.json({ summary: String(j.summary).slice(0, 600), days, enhanced: true });
    } catch {
      lastErr = "AI returned bad JSON.";
    }
  }
  return NextResponse.json({ error: `${lastErr} Keeping rule-based text.` }, { status: 502 });
}
