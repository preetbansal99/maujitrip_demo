import { NextRequest, NextResponse } from "next/server";

// ElevenLabs-style TTS proxy (dev: bring your own key + voice id).
// Without a key the client falls back to built-in speechSynthesis.
export async function POST(req: NextRequest) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }
  const { baseUrl, apiKey, voiceId, text, model } = body || {};
  if (!baseUrl || !apiKey || !voiceId || !text) {
    return NextResponse.json(
      { error: "baseUrl, apiKey, voiceId and text are required." },
      { status: 400 }
    );
  }
  try {
    const url = baseUrl.replace(/\/+$/, "") + `/text-to-speech/${encodeURIComponent(voiceId)}/stream`;
    const r = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "audio/mpeg",
        "xi-api-key": apiKey,
      },
      body: JSON.stringify({
        text: String(text).slice(0, 900),
        model_id: model || "eleven_turbo_v2_5",
      }),
    });
    if (!r.ok || !r.body) {
      return NextResponse.json({ error: `Voice upstream error (HTTP ${r.status}).` }, { status: 502 });
    }
    return new NextResponse(r.body, {
      status: 200,
      headers: { "Content-Type": "audio/mpeg" },
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: `Voice error: ${String(e?.message || e).slice(0, 140)}` },
      { status: 502 }
    );
  }
}
