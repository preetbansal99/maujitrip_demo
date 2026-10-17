import { NextRequest, NextResponse } from "next/server";
import { getPlan, isValidPlanId } from "@/lib/planner/storage";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id || !isValidPlanId(id)) {
    return NextResponse.json({ error: "Plan not found." }, { status: 404 });
  }

  try {
    const saved = await getPlan(id);
    if (!saved) {
      return NextResponse.json({ error: "Plan not found." }, { status: 404 });
    }

    return NextResponse.json(saved, { status: 200 });
  } catch (err: any) {
    console.error(`Error reading plan ${id}:`, err);
    return NextResponse.json({ error: "Failed to read plan." }, { status: 500 });
  }
}
