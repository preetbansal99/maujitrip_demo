import { NextRequest, NextResponse } from "next/server";
import { appendMemory, readMemory } from "@/lib/ai/tools";

export async function GET() {
  return NextResponse.json({ memory: await readMemory() });
}

export async function POST(req: NextRequest) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }
  const fact = String(body?.fact || "").trim();
  if (!fact) return NextResponse.json({ error: "fact required." }, { status: 400 });
  if (/otp|password|card|cvv|aadhaar/i.test(fact)) {
    return NextResponse.json({ error: "Refused: cannot store secrets." }, { status: 400 });
  }
  const res = await appendMemory(fact);
  return NextResponse.json({ result: res, memory: await readMemory() });
}
