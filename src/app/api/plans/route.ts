import { NextRequest, NextResponse } from "next/server";
import { savePlan, getPlan, isValidPlanId } from "@/lib/planner/storage";
import { blankProfile, type TripPlan, type TripProfile } from "@/lib/planner/engine";

export async function POST(req: NextRequest) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const plan: TripPlan = body?.plan || body;
  const profile: TripProfile = body?.profile || blankProfile();

  if (
    !plan ||
    typeof plan !== "object" ||
    typeof plan.title !== "string" ||
    !plan.title.trim() ||
    !Array.isArray(plan.days) ||
    plan.days.length === 0
  ) {
    return NextResponse.json(
      { error: "Invalid plan payload: 'title' and non-empty 'days' array are required." },
      { status: 400 }
    );
  }

  try {
    const saved = await savePlan(plan, profile);
    return NextResponse.json(
      {
        id: saved.id,
        url: `/planner/${saved.id}`,
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("Failed to save plan:", err);
    return NextResponse.json(
      { error: "Failed to persist trip plan." },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");

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
