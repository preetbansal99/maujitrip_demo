import { NextRequest, NextResponse } from "next/server";

const UPSTREAM = "https://unbrandonline.com/maujitrip/api/flights/search";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const r = await fetch(UPSTREAM, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body,
  });
  const text = await r.text();
  return new NextResponse(text, {
    status: r.status,
    headers: { "Content-Type": "application/json" },
  });
}
