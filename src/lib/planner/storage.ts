import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";
import type { TripPlan, TripProfile } from "./engine";

export interface SavedTripPlan {
  id: string;
  createdAt: string;
  plan: TripPlan;
  profile: TripProfile;
}

export const PLANS_DIR = path.join(process.cwd(), "data", "plans");
const PLAN_ID_REGEX = /^[a-zA-Z0-9_-]{6,64}$/;

export function generatePlanId(): string {
  return crypto.randomBytes(6).toString("hex");
}

export function isValidPlanId(id: unknown): id is string {
  if (typeof id !== "string") return false;
  if (!PLAN_ID_REGEX.test(id)) return false;
  const targetPath = path.resolve(PLANS_DIR, `${id}.json`);
  const resolvedDir = path.resolve(PLANS_DIR);
  if (!targetPath.startsWith(resolvedDir + path.sep)) return false;
  return true;
}

export async function savePlan(
  plan: TripPlan,
  profile: TripProfile,
  customId?: string
): Promise<SavedTripPlan> {
  const id = customId && isValidPlanId(customId) ? customId : generatePlanId();
  await fs.mkdir(PLANS_DIR, { recursive: true });

  const planWithId: TripPlan = {
    ...plan,
    id,
  };

  const record: SavedTripPlan = {
    id,
    createdAt: new Date().toISOString(),
    plan: planWithId,
    profile,
  };

  const targetPath = path.join(PLANS_DIR, `${id}.json`);
  const tempPath = path.join(PLANS_DIR, `.${id}.${crypto.randomUUID()}.tmp`);

  try {
    await fs.writeFile(tempPath, JSON.stringify(record, null, 2), "utf-8");
    await fs.rename(tempPath, targetPath);
  } catch (err) {
    try {
      await fs.unlink(tempPath);
    } catch {
      /* ignore cleanup error */
    }
    throw err;
  }

  return record;
}

export async function getPlan(id: string): Promise<SavedTripPlan | null> {
  if (!isValidPlanId(id)) {
    return null;
  }

  const targetPath = path.join(PLANS_DIR, `${id}.json`);
  try {
    const data = await fs.readFile(targetPath, "utf-8");
    return JSON.parse(data) as SavedTripPlan;
  } catch (err: any) {
    if (err?.code === "ENOENT") {
      return null;
    }
    throw err;
  }
}
