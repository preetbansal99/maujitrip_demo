# Handoff Report: Planner UI, Data Structures & Resumption Investigation

## 1. Observation

### 1.1 Architecture & Current Planner UI
- **File**: `src/app/planner/page.tsx`
  - Unified single-thread client component (`"use client"`).
  - State variables:
    - Line 196: `const [profile, setProfile] = useState<TripProfile>(blankProfile);`
    - Line 197: `const [msgs, setMsgs] = useState<ChatMsg[]>([]);`
    - Line 201: `const [phase, setPhase] = useState<Phase>("interview");`
    - Line 202: `const [guided, setGuided] = useState(false);`
  - Mount hydration from localStorage (lines 215–235):
    - Reads `localStorage.getItem("maujitrip-planner")`.
    - If present with messages, sets `profile`, `msgs`, `phase`, and `guided`.
    - If empty, initiates deterministic question: `const q = nextQuestion(blankProfile()); if (q) setMsgs([{ role: "ai", text: q.text, chips: q.chips }]);`.
  - Continuous persistence (lines 237–244):
    - `useEffect` serializes `{ profile, msgs, phase, guided }` into `localStorage.setItem("maujitrip-planner", ...)` on every state change.
  - Plan card rendering in chat stream (lines 662–669):
    ```tsx
    {m.plan && (
      <PlanCard
        plan={m.plan}
        profile={profile}
        onGuide={phase === "interview" ? () => guideBooking(m.plan!, profile) : undefined}
        guided={guided}
      />
    )}
    ```

### 1.2 Trip Plan & Message Data Structures
- **File**: `src/lib/planner/engine.ts`
  - `ChatMsg` (lines 12–17):
    ```ts
    export interface ChatMsg {
      role: "ai" | "user";
      text: string;
      chips?: string[];
      plan?: TripPlan;
    }
    ```
  - `TripProfile` (lines 19–31):
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
  - `PlanDay` (lines 72–76):
    ```ts
    export interface PlanDay {
      day: number;
      title: string;
      detail: string;
    }
    ```
  - `PlanStay` (lines 78–83):
    ```ts
    export interface PlanStay {
      name: string;
      city: string;
      price: number;
      href: string;
    }
    ```
  - `TripPlan` (lines 85–96):
    ```ts
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

### 1.3 Plan Generation & Enrichment Workflow
- Plans can be produced in three ways:
  1. `generateNow()` in `src/app/planner/page.tsx` (lines 396–417): builds plan synchronously with `buildPlan(prof)`, then calls `enrichPlan(plan, prof)` to enrich summary and day details via `POST /api/ai/plan`.
  2. Rule-based interview completion in `step(profile, t)` (lines 451–467): when `done` is true, plan is added to `msgs`, followed by background `enrichPlan(built, p2)`.
  3. Conversational AI agent tool execution (`build_trip_plan` in `src/lib/ai/tools.ts` lines 230–247): returned in JSON payload `{ reply, model, plan }` from `POST /api/ai/chat` (lines 118–125), attached to `msgs` in `chatWithAgent()`.

### 1.4 Ticket-Ledger Rendering in `PlanCard`
- **File**: `src/app/planner/page.tsx` (lines 29–139)
  - Card container: `rounded-2xl bg-white overflow-hidden`.
  - Header: `bg-[#023341] px-5 py-4` with white title (`font-display text-lg font-bold`) and teal-100 metadata (`${profile.destination} · ${days} days · ${travellers} travellers · ${budget}`).
  - Summary: `px-5 py-4 text-base text-gray-900`.
  - Day-by-day: ordered list of `Day {d.day}` in tabular nums teal `#023341`, title and detail.
  - Linked Inventory ("Book this trip"):
    - Package: link to `/holidays/packages/${plan.packageSlug}`, title, and price in INR.
    - Stay: link to `${plan.stay.href}`, name, city, and `${inr(plan.stay.price)} a night`.
    - Flights: link to `${plan.flightHref}`, route note, and "Live fares · one way".
  - Estimated total: `bg-[#efeeeb] px-4 py-3`, large tabular numerals in `#023341`.
  - Action button: "Guide me through booking" in `#d63f00`.

### 1.5 Query Parameter Navigation Idioms
- Observed in `src/app/hotels/results/page.tsx` (line 19) and `src/app/search/flight/page.tsx` (lines 489, 917):
  ```tsx
  const [q, setQ] = useState<URLSearchParams | null>(null);
  useEffect(() => {
    setQ(new URLSearchParams(window.location.search));
  }, []);
  ```
  Neither page imports `useSearchParams` from `next/navigation`, avoiding Next.js 15/16 App Router Suspense bailout errors during static generation.

### 1.6 Taste Skill Linter & Build Baseline
- Command: `node .opencode/skills/design-taste-frontend/scripts/lint.mjs src/app/planner`
  - Output: `TASTESKILL · LINT 1 file(s)` -> `RESULT: 0 FAIL, 1 WARN` (bounce animation warning on typing indicator).
- Command: `npm run build`
  - Output: `▲ Next.js 16.4.0 (Turbopack) ... Generating static pages (36/36) ... Compiled successfully`.

---

## 2. Logic Chain

### 2.1 Persistence Record Structure & API Design
1. **Observation**: R1 mandates `POST /api/plans` creating `data/plans/[id].json` returning `{ id, url: "/planner/[id]" }`, and `GET /api/plans/[id]` returning the plan JSON.
2. **Observation**: `PlanCard` requires both `plan: TripPlan` and `profile: TripProfile` (for destination, travellers count, budget metadata) to render the ticket-ledger format.
3. **Inference**: Storing a canonical record containing both `plan` and `profile` ensures complete fidelity upon retrieval:
   ```ts
   export interface SavedPlanRecord {
     id: string;
     createdAt: string;
     plan: TripPlan;
     profile: TripProfile;
     // Top-level spreads for convenience/compatibility
     title: string;
     summary: string;
     days: PlanDay[];
     estimate: number;
     packageSlug: string | null;
     packageTitle: string | null;
     packagePrice: number | null;
     stay: PlanStay | null;
     flightHref: string | null;
     flightNote: string | null;
   }
   ```
4. **Inference**: For unique ID generation, standard Node.js crypto (e.g. `crypto.randomUUID().replace(/-/g, "").slice(0, 10)` or `crypto.randomBytes(5).toString("hex")`) produces clean, 10-character lowercase alphanumeric URL-safe slugs with zero new package dependencies.

### 2.2 In-Thread "Save & Share" Integration (R3)
1. **Observation**: `PlanCard` renders inside the chat stream mapping over `msgs`.
2. **Observation**: R3 requires "Save & Share" button on generated plan cards, saving via `/api/plans`, displaying share link with 1-click copy and confirmation toast/text in-thread without breaking the chat session or reloading the page.
3. **Inference**:
   - `PlanCard` can hold local state: `savedId`, `saving`, `copied`, `error`.
   - Optionally `plan.id?: string` can be added to `TripPlan` so previously saved plans restore their saved state automatically.
   - When the user taps "Save & Share":
     - Sends `POST /api/plans` with `{ plan, profile }`.
     - On success (HTTP 201/200), sets `savedId = res.id`.
     - Displays in-card confirmation block styled with `#e6f2e9` background, `#023341` copy button, and share link.
     - Automatically copies the full URL (`${window.location.origin}/planner/${res.id}`) to clipboard with temporary "Copied!" feedback.
     - The chat messages array and input form remain completely untouched and interactive.

### 2.3 Resumption via "Continue in Planner Chat" (R2)
1. **Observation**: R2 requires `/planner/[id]` to have a "Continue in Planner Chat" button that redirects or loads the plan into `/planner` so the user can continue conversing with the AI travel agent.
2. **Observation**: In Next.js App Router, using `useSearchParams()` in a client page without a `<Suspense>` wrapper causes static build failure.
3. **Inference**:
   - The button on `/planner/[id]` should link to `/planner?planId=${id}`.
   - In `src/app/planner/page.tsx`, mount effect checks `new URLSearchParams(window.location.search).get("planId")`.
   - If present:
     - Fetches `/api/plans/${planId}`.
     - If found, sets:
       - `profile` = `data.profile || fallbackProfile`
       - `phase` = `"interview"`
       - `guided` = `false`
       - `msgs` = `[{ role: "ai", text: "Loaded your saved plan: ...", plan: data.plan, chips: ["Guide me through booking", "💬 Just chat"] }]`
     - Calls `window.history.replaceState({}, "", "/planner")` to clean up the query param without reloading.
   - Why `phase = "interview"`?
     - In `"interview"` phase, `PlanCard` shows the prominent "Guide me through booking" action.
     - The user can make natural language adjustments ("under 20k", "5 days") handled deterministically by `step()`.
     - Any open travel question automatically triggers `handoffToAgent` to engage the AI travel agent.
     - Clicking "Guide me through booking" transitions to `phase = "guiding"` and initiates step-by-step agentic booking with tools.

### 2.4 Shareable Plan Page (`src/app/planner/[id]/page.tsx`)
1. **Observation**: Follows dynamic route client pattern established by `src/app/blog/[slug]/page.tsx` and `src/app/hotels/details/[slug]/page.tsx`.
2. **Inference**:
   - Accepts `{ params }: { params: Promise<{ id: string }> }`.
   - Fetches `/api/plans/${id}` on mount.
   - 404 state: clean "Plan not found" card with link back to `/planner`.
   - Loaded state:
     - Wrapped in `<SiteChrome active="planner">`.
     - Full ticket-ledger rendering: title header, metadata strip, summary, day-by-day activity itinerary, matching package, partner hotel stay, flight search link, and estimated budget breakdown.
     - 1-click "Copy Share Link" button.
     - Action orange "Continue in Planner Chat" CTA button (`/planner?planId=${id}`).

---

## 3. Caveats

1. **Local File Persistence Scope**:
   Plans are stored in `data/plans/[id].json` on local disk as requested. In serverless deployment environments with ephemeral filesystems (e.g. read-only Vercel functions), this would eventually migrate to a database (Supabase/PostgreSQL). For current dev/integrity scope, `data/plans/[id].json` is the designated target.
2. **AI Enrichment Concurrency**:
   If a user clicks "Save & Share" immediately after plan generation while the background `POST /api/ai/plan` is still executing, the saved file will contain the verified rule-based days and summary. Once enriched, saving again can update or re-save the enriched plan.
3. **Deterministic Engine Preservation**:
   Zero changes are made to the parsing or interview logic in `src/lib/planner/engine.ts`. Only the optional `id?: string` field is added to `TripPlan` interface.

---

## 4. Conclusion & Recommended Implementation Plan

### 4.1 Exact Files to Create & Modify

| File | Action | Purpose |
|------|--------|---------|
| `data/plans/` | Create directory | Storage folder for persisted plans |
| `src/lib/planner/engine.ts` | Edit (lines 85–96) | Add optional `id?: string;` to `TripPlan` interface |
| `src/app/api/plans/route.ts` | Create file | Handles `POST /api/plans` (save plan) & optional `GET /api/plans?id=...` |
| `src/app/api/plans/[id]/route.ts` | Create file | Handles `GET /api/plans/[id]` (fetch saved plan, 404 if absent) |
| `src/app/planner/page.tsx` | Edit (`PlanCard` & `PlannerPage`) | Integrate "Save & Share" in `PlanCard` + `planId` query resumption in `useEffect` |
| `src/app/planner/[id]/page.tsx` | Create file | Dedicated shareable plan page with ticket-ledger format, copy link, and continue chat CTA |

### 4.2 Proposed Code Snippets

#### A. `src/lib/planner/engine.ts` (Interface addition)
```ts
export interface TripPlan {
  id?: string;
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

#### B. `src/app/api/plans/route.ts`
```ts
import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";

const PLANS_DIR = path.join(process.cwd(), "data", "plans");

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const plan = body?.plan || body;
    const profile = body?.profile || null;

    if (!plan || !plan.title || !Array.isArray(plan.days)) {
      return NextResponse.json({ error: "Valid trip plan payload is required." }, { status: 400 });
    }

    const id = crypto.randomUUID().replace(/-/g, "").slice(0, 10);
    const record = {
      id,
      createdAt: new Date().toISOString(),
      plan,
      profile,
      ...plan,
    };

    await fs.mkdir(PLANS_DIR, { recursive: true });
    await fs.writeFile(path.join(PLANS_DIR, `${id}.json`), JSON.stringify(record, null, 2), "utf-8");

    return NextResponse.json({ id, url: `/planner/${id}` }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: `Failed to save plan: ${e?.message || e}` }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id || !/^[a-zA-Z0-9_-]+$/.test(id)) {
    return NextResponse.json({ error: "Missing or invalid plan ID." }, { status: 400 });
  }
  const filePath = path.join(PLANS_DIR, `${id}.json`);
  try {
    const content = await fs.readFile(filePath, "utf-8");
    return NextResponse.json(JSON.parse(content));
  } catch (e: any) {
    if (e.code === "ENOENT") {
      return NextResponse.json({ error: "Plan not found." }, { status: 404 });
    }
    return NextResponse.json({ error: "Failed to read plan." }, { status: 500 });
  }
}
```

#### C. `src/app/api/plans/[id]/route.ts`
```ts
import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const PLANS_DIR = path.join(process.cwd(), "data", "plans");

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!id || !/^[a-zA-Z0-9_-]+$/.test(id)) {
    return NextResponse.json({ error: "Invalid plan ID." }, { status: 404 });
  }

  const filePath = path.join(PLANS_DIR, `${id}.json`);
  try {
    const content = await fs.readFile(filePath, "utf-8");
    return NextResponse.json(JSON.parse(content));
  } catch (e: any) {
    if (e.code === "ENOENT") {
      return NextResponse.json({ error: "Plan not found." }, { status: 404 });
    }
    return NextResponse.json({ error: "Failed to read plan." }, { status: 500 });
  }
}
```

#### D. In-Thread "Save & Share" inside `PlanCard` (`src/app/planner/page.tsx`)
```tsx
// Inside PlanCard component:
const [savedId, setSavedId] = useState<string | null>(plan.id || null);
const [saving, setSaving] = useState(false);
const [copied, setCopied] = useState(false);
const [error, setError] = useState<string | null>(null);

const handleSave = async () => {
  if (saving) return;
  setSaving(true);
  setError(null);
  try {
    const res = await fetch("/api/plans", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan, profile }),
    });
    const data = await res.json();
    if (!res.ok || !data.id) throw new Error(data.error || "Save failed.");
    setSavedId(data.id);
    if (onSave) onSave(data.id);
    const fullUrl = `${window.location.origin}/planner/${data.id}`;
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  } catch (e: any) {
    setError(e?.message || "Could not save plan.");
  } finally {
    setSaving(false);
  }
};

const copyShareLink = async () => {
  if (!savedId) return;
  const fullUrl = `${window.location.origin}/planner/${savedId}`;
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(fullUrl);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  } catch {
    /* fallback */
  }
};

// Rendering inside PlanCard:
{!savedId ? (
  <button
    type="button"
    onClick={handleSave}
    disabled={saving}
    className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-[#efeeeb] py-2.5 text-base font-bold text-[#023341] transition-colors hover:bg-[#023341] hover:text-white"
  >
    <Share2 size={16} />
    {saving ? "Saving plan…" : "Save & Share"}
  </button>
) : (
  <div className="mt-3 rounded-xl bg-[#e6f2e9] p-3 text-green-900">
    <div className="flex items-center justify-between gap-2">
      <span className="text-sm font-semibold truncate">
        Saved to /planner/{savedId}
      </span>
      <button
        type="button"
        onClick={copyShareLink}
        className="shrink-0 rounded-full bg-[#023341] px-3.5 py-1 text-xs font-bold text-white transition-colors hover:bg-[#034a5c]"
      >
        {copied ? "Copied" : "Copy link"}
      </button>
    </div>
    <p className="mt-1 text-xs text-green-800">
      Anyone with this link can view this itinerary and continue chatting with Mauji.
    </p>
  </div>
)}
{error && <p className="mt-1 text-xs text-red-600">{error}</p>}
```

#### E. Resumption Logic inside `PlannerPage` (`src/app/planner/page.tsx`)
```tsx
useEffect(() => {
  setSettings(loadAiSettings());
  const params = new URLSearchParams(window.location.search);
  const planId = params.get("planId");

  if (planId) {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/plans/${encodeURIComponent(planId)}`);
        if (res.ok && !cancelled) {
          const data = await res.json();
          const loadedPlan: TripPlan = data.plan || data;
          const loadedProfile: TripProfile = data.profile || {
            ...blankProfile(),
            destination: loadedPlan.title.split(" ")[1] || null,
            days: loadedPlan.days?.length || 4,
          };
          setProfile(loadedProfile);
          setPhase("interview");
          setGuided(false);
          setMsgs([
            {
              role: "ai",
              text: `Loaded your saved plan: ${loadedPlan.title}. Estimate ${inr(loadedPlan.estimate)} for ${loadedProfile.travellers} traveller${loadedProfile.travellers === 1 ? "" : "s"}. You can tweak it (e.g. 5 days or budget 40k), ask any questions, or guide your booking below.`,
              plan: { ...loadedPlan, id: planId },
              chips: ["Guide me through booking", "💬 Just chat"],
            },
          ]);
          window.history.replaceState({}, "", "/planner");
          return;
        }
      } catch {
        /* fallback */
      }
      if (!cancelled) restoreNormal();
    })();
    return () => { cancelled = true; };
  }

  restoreNormal();
}, []);
```

---

## 5. Verification Method

### 5.1 Independent Verification Commands
1. **Taste Skill Design Linter**:
   ```bash
   node .opencode/skills/design-taste-frontend/scripts/lint.mjs src/app/planner
   ```
   *Expected result*: `0 FAIL`.
2. **Next.js Production Build**:
   ```bash
   npm run build
   ```
   *Expected result*: Exit code 0, 37+ routes generated cleanly without Turbopack or Suspense bailouts.
3. **API Endpoint Functionality**:
   - Save plan:
     ```bash
     curl -s -X POST http://localhost:3000/api/plans \
       -H "Content-Type: application/json" \
       -d '{"plan":{"title":"4-day Goa trip for 2","summary":"Sun and sand","days":[{"day":1,"title":"Arrive","detail":"Check in"}],"estimate":25000,"stay":null,"flightHref":null,"flightNote":null,"packageSlug":null,"packageTitle":null,"packagePrice":null},"profile":{"destination":"Goa","days":4,"travellers":2,"budget":25000,"themes":["beach"],"origin":"Delhi"}}'
     ```
     *Expected result*: HTTP 201 with `{ id: "...", url: "/planner/..." }`.
   - Retrieve plan:
     ```bash
     curl -s -i http://localhost:3000/api/plans/<ID>
     ```
     *Expected result*: HTTP 200 with saved plan JSON.
   - Non-existent plan:
     ```bash
     curl -s -i http://localhost:3000/api/plans/nonexistent999
     ```
     *Expected result*: HTTP 404 with `{ error: "Plan not found." }`.
4. **End-to-End UI Verification**:
   - Generate a trip plan on `http://localhost:3000/planner`.
   - Tap "Save & Share" on the plan card; verify share URL is shown with "Copy link" feedback without page refresh.
   - Open `/planner/<ID>` in a new tab; verify ticket-ledger layout, itinerary days, package/stay/flight details, budget breakdown, and 404 fallback on bad ID.
   - Tap "Continue in Planner Chat" from `/planner/<ID>`; verify it opens `/planner`, loads the saved plan card into the chat thread with active booking guidance and tweak support.

### 5.2 Invalidation Conditions
- Any edit modifying deterministic interview logic or regexes in `src/lib/planner/engine.ts`.
- Introduction of `useSearchParams()` without a `<Suspense>` boundary in `src/app/planner/page.tsx`.
- Introduction of design tokens violating the taste skill (shadows, gradients, hairlines, emoji, em-dashes).
