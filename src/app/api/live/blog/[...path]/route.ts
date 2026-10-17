import { NextRequest, NextResponse } from "next/server";

const UPSTREAM = "https://unbrandonline.com/maujitrip/api/blog";

async function pass(url: string) {
  const r = await fetch(url, { headers: { Accept: "application/json" } });
  const text = await r.text();
  return new NextResponse(text, {
    status: r.status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const qs = req.nextUrl.search;
  return pass(`${UPSTREAM}/${path.join("/")}${qs}`);
}
