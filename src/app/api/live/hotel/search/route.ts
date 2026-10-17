import { NextRequest, NextResponse } from "next/server";

const UPSTREAM = "https://unbrandonline.com/maujitrip/api/hotel/search";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") || "";
  const r = await fetch(`${UPSTREAM}?q=${encodeURIComponent(q)}`, {
    headers: { Accept: "application/json" },
  });
  const text = await r.text();
  return new NextResponse(text, {
    status: r.status,
    headers: { "Content-Type": "application/json" },
  });
}
