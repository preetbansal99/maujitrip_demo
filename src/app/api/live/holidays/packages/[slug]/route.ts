import { NextRequest, NextResponse } from "next/server";

const UPSTREAM = "https://unbrandonline.com/maujitrip/api/holidays/packages";

export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const r = await fetch(`${UPSTREAM}/${slug}`, { headers: { Accept: "application/json" } });
  const text = await r.text();
  return new NextResponse(text, {
    status: r.status,
    headers: { "Content-Type": "application/json" },
  });
}
