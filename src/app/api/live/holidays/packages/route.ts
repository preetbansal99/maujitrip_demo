import { NextRequest, NextResponse } from "next/server";

const UPSTREAM = "https://unbrandonline.com/maujitrip/api/holidays/packages";

export async function GET(req: NextRequest) {
  const qs = req.nextUrl.search;
  const r = await fetch(`${UPSTREAM}${qs}`, { headers: { Accept: "application/json" } });
  const text = await r.text();
  return new NextResponse(text, {
    status: r.status,
    headers: { "Content-Type": "application/json" },
  });
}
