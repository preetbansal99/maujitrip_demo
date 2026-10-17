# Handoff Report — Explorer 2: Backend & Data Persistence

**Date**: 2026-10-16T17:34:00Z  
**Agent**: Explorer 2 (Backend & Persistence Investigator)  
**Target Project**: `/Users/preetbansal/maujitrip1currentsite`  
**Handoff Type**: Hard (Investigation Complete)

---

## 1. Observation

### 1.1 Project Environment & Dependencies
From `/Users/preetbansal/maujitrip1currentsite/package.json` (lines 11–30):
- **Next.js**: `16.4.0` (Turbopack, App Router)
- **React**: `19.3.0`
- **Node Types**: `@types/node: ^20`
- **External Dependencies**: `clsx`, `leaflet`, `lucide-react`, `next`, `react`, `react-dom`, `tailwind-merge`
- Neither `nanoid` nor `zod` is installed in `dependencies`. Node 20 provides built-in `crypto` (`node:crypto`), `fs/promises` (`node:fs/promises`), and `path` (`node:path`).

### 1.2 Route Conventions & Dynamic Route Typing
1. In existing API routes such as `src/app/api/ai/plan/route.ts` (lines 6–16):
   - Request handlers use `NextRequest` and `NextResponse` from `"next/server"`.
   - Body parsing: `try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 }); }`.
   - Required fields are checked, returning `{ error: string }` with HTTP 400.
2. In dynamic routes such as `src/app/api/live/holidays/packages/[slug]/route.ts` (lines 5–6) and `src/app/api/live/holidays/destinations/[slug]/route.ts` (lines 5–6):
   ```ts
   export async function GET(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
     const { slug } = await params;
   ```
   **Critical Next.js 15/16 observation**: `params` is a `Promise`. Awaiting `params` (`const { id } = await params;`) is mandatory for all dynamic route handlers in this Next.js version.

### 1.3 Existing Filesystem Data Access Patterns
In `src/lib/ai/tools.ts` (lines 7–31):
- Filesystem access uses `import { promises as fs } from "fs";` and `import path from "path";`.
- Base directory is resolved via `process.cwd()`:
  ```ts
  const MEMORY_FILE = path.join(process.cwd(), "data", "memory.md");
  ```
- Directory creation is handled defensively:
  ```ts
  await fs.mkdir(path.dirname(MEMORY_FILE), { recursive: true });
  ```
- Currently, `data/` contains only `data/memory.md`. Directory `data/plans/` does not yet exist.

### 1.4 Plan and Profile Data Types
From `src/lib/planner/engine.ts` (lines 19–31, 72–96):
- `TripProfile`:
  ```ts
  export interface TripProfile {
    destination: string | null;
    destSlug: string | null;
    days: number | null;
    travellers: number;
    budget: number | null;
    themes: string[];
    origin: string;
    _askedTrav?: boolean;
    _askedTheme?: boolean;
    _suggest?: { field: "days" | "travellers" | "budget"; value: number };
    _nudgedTrav?: boolean;
  }
  ```
- `TripPlan`:
  ```ts
  export interface PlanDay {
    day: number;
    title: string;
    detail: string;
  }
  export interface PlanStay {
    name: string;
    city: string;
    price: number;
    href: string;
  }
  export interface TripPlan {
    title: string;
    summary: string;
    days: PlanDay[];
    packageSlug: string | null;
    packageTitle: string | null;
    packagePrice: number | null;
    stay: PlanStay | null;
    flightHref: string | null;
    flightNote: string | null;
    estimate: number;
  }
  ```

### 1.5 Chat State & Continuation Hook
In `src/app/planner/page.tsx` (lines 218–228, 239–244):
- Chat persistence is stored in `localStorage.getItem("maujitrip-planner")` as `{ profile, msgs, phase, guided }`.
- Resuming a saved plan in the `/planner` chat requires both `plan` and `profile`. Storing both in `data/plans/[id].json` allows `/planner/[id]` to re-hydrate the chat without losing the user's destination, days, travellers, or budget.

### 1.6 Build and Linter Status
- Command `npm run build` executed cleanly in ~2.4 seconds with 0 errors.
- Command `node .opencode/skills/design-taste-frontend/scripts/lint.mjs src/app/planner` exits with code 0 (0 FAIL).

---

## 2. Logic Chain

1. **Zero External Dependency Selection**:
   - *Premise*: `nanoid` is not in `package.json`. Installing extra packages adds risk and modifies package locks.
   - *Deduction*: Node's built-in `crypto.randomBytes(6).toString("hex")` produces a 12-character URL-safe string with $16^{12} \approx 2.8 \times 10^{14}$ combinations. It is concise, alphanumeric, URL-safe without encoding, and requires zero external dependencies.
2. **Atomic Writes for Data Consistency**:
   - *Premise*: Direct writes via `fs.writeFile` to `[id].json` could expose partial writes or corrupted JSON if interrupted or if read concurrently.
   - *Deduction*: Writing to a temporary file (`.${id}.${crypto.randomUUID()}.tmp`) in the *same* directory and calling `fs.rename` guarantees POSIX filesystem-level atomic replacement. A `try...finally`/cleanup block removes orphaned temp files on write failure.
3. **Directory Auto-Creation**:
   - *Premise*: `data/plans` does not exist in the repository.
   - *Deduction*: Any write operation must execute `await fs.mkdir(PLANS_DIR, { recursive: true })` prior to writing.
4. **Path Traversal Security (Defense-in-Depth)**:
   - *Premise*: User-supplied `id` in dynamic routes can potentially contain `../`, `..\\`, null bytes, slashes, or special file names.
   - *Deduction*:
     - **Layer 1 (Regex)**: Enforce `/^[a-zA-Z0-9_-]{6,64}$/`. Any input containing slashes, dots, or non-printable characters fails immediately.
     - **Layer 2 (Canonical Path Resolution)**: `path.resolve(PLANS_DIR, `${id}.json`)` must start with `path.resolve(PLANS_DIR) + path.sep`.
     - **Layer 3 (Error Masking)**: Invalid IDs return HTTP 404 with `{ error: "Plan not found." }` rather than leaking server file structure or distinguishing between "invalid syntax" and "not found".
5. **Next.js 16 Route Handler Compatibility**:
   - *Premise*: Next.js 16 requires dynamic route params to be treated as `Promise`.
   - *Deduction*: `src/app/api/plans/[id]/route.ts` must use `{ params }: { params: Promise<{ id: string }> }` and `await params`.

---

## 3. Caveats

- **Filesystem Persistence Scope**: Per R1 and ORIGINAL_REQUEST.md, plans are stored in local JSON files under `data/plans/`. In a multi-instance serverless deployment (e.g. ephemeral AWS Lambda / Vercel), local disk is read-only or ephemeral across instances. For this local MaujiTrip deployment, local disk persistence satisfies all project specifications.
- **Payload Size**: While individual trip plans are typically 2–10 KB, an arbitrary POST could submit multi-megabyte payloads. A payload size check or JSON depth limit should be present to avoid disk exhaustion.
- **No Git Repository**: As noted in HANDOFF.md, this directory is not yet a git repository. File edits should be made directly and tested with `npm run build`.

---

## 4. Conclusion & Recommended Implementation

### 4.1 Recommended Architecture & File Paths
Implement 3 backend files:
1. `src/lib/planner/storage.ts`: Core persistence module (ID generation, validation, atomic write, safe read).
2. `src/app/api/plans/route.ts`: Collection endpoint (`POST /api/plans`, and optional `GET /api/plans?id=...`).
3. `src/app/api/plans/[id]/route.ts`: Dynamic item endpoint (`GET /api/plans/[id]`).

### 4.2 Data Persistence Design

#### Stored Schema (`data/plans/[id].json`)
```typescript
export interface SavedTripPlan {
  id: string;
  createdAt: string; // ISO 8601 string, e.g. "2026-10-16T17:35:00.000Z"
  plan: TripPlan;
  profile: TripProfile;
}
```

#### Atomic Write Pattern
```typescript
const tempPath = path.join(PLANS_DIR, `.${id}.${crypto.randomUUID()}.tmp`);
const targetPath = path.join(PLANS_DIR, `${id}.json`);
try {
  await fs.writeFile(tempPath, JSON.stringify(record, null, 2), "utf-8");
  await fs.rename(tempPath, targetPath);
} catch (err) {
  try { await fs.unlink(tempPath); } catch {}
  throw err;
}
```

#### Path Traversal Defense
```typescript
const PLAN_ID_REGEX = /^[a-zA-Z0-9_-]{6,64}$/;

export function isValidPlanId(id: unknown): id is string {
  if (typeof id !== "string") return false;
  if (!PLAN_ID_REGEX.test(id)) return false;
  const targetPath = path.resolve(PLANS_DIR, `${id}.json`);
  const resolvedDir = path.resolve(PLANS_DIR);
  if (!targetPath.startsWith(resolvedDir + path.sep)) return false;
  return true;
}
```

### 4.3 API Contracts

#### A. `POST /api/plans`
- **Request Headers**: `Content-Type: application/json`
- **Request Body**:
  ```json
  {
    "plan": {
      "title": "4 Days in Goa",
      "summary": "Sun, sand, and coastal heritage in Goa.",
      "days": [
        { "day": 1, "title": "Arrival & North Goa Beaches", "detail": "Check into hotel and visit Baga beach." }
      ],
      "packageSlug": "goa-tour-packages",
      "packageTitle": "Goa Beach Gateway",
      "packagePrice": 14999,
      "stay": {
        "name": "Heritage Resort",
        "city": "Goa",
        "price": 3200,
        "href": "/hotels/details/heritage-resort"
      },
      "flightHref": "/flights",
      "flightNote": "Direct flight options from Delhi",
      "estimate": 28400
    },
    "profile": {
      "destination": "Goa",
      "destSlug": "goa-tour-packages",
      "days": 4,
      "travellers": 2,
      "budget": 30000,
      "themes": ["beach"],
      "origin": "Delhi"
    }
  }
  ```
- **Validation**:
  - `plan` must be an object with non-empty `title` (string) and `days` (non-empty array).
  - If `profile` is omitted, defaults to `blankProfile()`.
- **Response 201 Created**:
  ```json
  {
    "id": "e9a712f4c3b1",
    "url": "/planner/e9a712f4c3b1"
  }
  ```
- **Response 400 Bad Request**:
  ```json
  {
    "error": "Invalid plan payload: 'title' and non-empty 'days' array are required."
  }
  ```
- **Response 500 Internal Server Error**:
  ```json
  {
    "error": "Failed to persist trip plan."
  }
  ```

#### B. `GET /api/plans/[id]`
- **Request**: `GET /api/plans/e9a712f4c3b1`
- **Response 200 OK**:
  ```json
  {
    "id": "e9a712f4c3b1",
    "createdAt": "2026-10-16T17:35:00.000Z",
    "plan": {
      "title": "4 Days in Goa",
      "summary": "Sun, sand, and coastal heritage in Goa.",
      "days": [
        { "day": 1, "title": "Arrival & North Goa Beaches", "detail": "Check into hotel and visit Baga beach." }
      ],
      "packageSlug": "goa-tour-packages",
      "packageTitle": "Goa Beach Gateway",
      "packagePrice": 14999,
      "stay": {
        "name": "Heritage Resort",
        "city": "Goa",
        "price": 3200,
        "href": "/hotels/details/heritage-resort"
      },
      "flightHref": "/flights",
      "flightNote": "Direct flight options from Delhi",
      "estimate": 28400
    },
    "profile": {
      "destination": "Goa",
      "destSlug": "goa-tour-packages",
      "days": 4,
      "travellers": 2,
      "budget": 30000,
      "themes": ["beach"],
      "origin": "Delhi"
    }
  }
  ```
- **Response 404 Not Found** (for unknown ID or path traversal attempt):
  ```json
  {
    "error": "Plan not found."
  }
  ```

### 4.4 Reference Code Blueprints

#### 1. `src/lib/planner/storage.ts`
```typescript
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

const PLANS_DIR = path.join(process.cwd(), "data", "plans");
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

export async function savePlan(plan: TripPlan, profile: TripProfile, customId?: string): Promise<SavedTripPlan> {
  const id = customId && isValidPlanId(customId) ? customId : generatePlanId();
  await fs.mkdir(PLANS_DIR, { recursive: true });

  const record: SavedTripPlan = {
    id,
    createdAt: new Date().toISOString(),
    plan,
    profile,
  };

  const targetPath = path.join(PLANS_DIR, `${id}.json`);
  const tempPath = path.join(PLANS_DIR, `.${id}.${crypto.randomUUID()}.tmp`);

  try {
    await fs.writeFile(tempPath, JSON.stringify(record, null, 2), "utf-8");
    await fs.rename(tempPath, targetPath);
  } catch (err) {
    try { await fs.unlink(tempPath); } catch {}
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
```

#### 2. `src/app/api/plans/route.ts`
```typescript
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

  if (!plan || typeof plan !== "object" || !plan.title || !Array.isArray(plan.days) || plan.days.length === 0) {
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
    return NextResponse.json({ error: "Failed to persist trip plan." }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id || !isValidPlanId(id)) {
    return NextResponse.json({ error: "Plan not found." }, { status: 404 });
  }

  const saved = await getPlan(id);
  if (!saved) {
    return NextResponse.json({ error: "Plan not found." }, { status: 404 });
  }

  return NextResponse.json(saved, { status: 200 });
}
```

#### 3. `src/app/api/plans/[id]/route.ts`
```typescript
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
```

---

## 5. Verification Method

Once implemented, the implementation agent can verify the persistence layer with the following procedures:

1. **Build & Type Check**:
   ```bash
   npm run build
   ```
   *Expected result*: Build succeeds with exit code 0. New routes `/api/plans` and `/api/plans/[id]` appear in route table.

2. **Design Linter Check**:
   ```bash
   node .opencode/skills/design-taste-frontend/scripts/lint.mjs src/app/api
   ```
   *Expected result*: 0 FAIL.

3. **API Functional Verification (curl commands)**:
   - **POST `/api/plans` (Success)**:
     ```bash
     curl -i -X POST http://localhost:3000/api/plans \
       -H "Content-Type: application/json" \
       -d '{"plan":{"title":"Goa Getaway","summary":"4 days in Goa","days":[{"day":1,"title":"Arrival","detail":"Check in"}],"estimate":25000},"profile":{"destination":"Goa","days":4,"travellers":2,"budget":25000,"themes":["beach"],"origin":"Delhi"}}'
     ```
     *Expected*: HTTP 201 Created with JSON `{ "id": "<12-char-id>", "url": "/planner/<12-char-id>" }`. File `data/plans/<12-char-id>.json` is created on disk.

   - **GET `/api/plans/[id]` (Success)**:
     ```bash
     curl -i http://localhost:3000/api/plans/<12-char-id>
     ```
     *Expected*: HTTP 200 OK with the full stored JSON.

   - **GET `/api/plans/[id]` (Unknown ID)**:
     ```bash
     curl -i http://localhost:3000/api/plans/nonexistent99
     ```
     *Expected*: HTTP 404 Not Found with `{ "error": "Plan not found." }`.

   - **Path Traversal Guard Verification**:
     ```bash
     curl -i "http://localhost:3000/api/plans/..%2f..%2fpackage.json"
     curl -i "http://localhost:3000/api/plans?id=..%2f..%2fpackage.json"
     ```
     *Expected*: HTTP 404 Not Found with `{ "error": "Plan not found." }`. No directory traversal or file reading outside `data/plans/`.

   - **POST `/api/plans` (Bad Request)**:
     ```bash
     curl -i -X POST http://localhost:3000/api/plans \
       -H "Content-Type: application/json" \
       -d '{"invalid": true}'
     ```
     *Expected*: HTTP 400 Bad Request with `{ "error": "Invalid plan payload: 'title' and non-empty 'days' array are required." }`.
