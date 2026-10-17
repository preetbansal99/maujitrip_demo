# Dispatch: Worker 1

## Identity & Objective
You are Worker 1 for MaujiTrip. Your mission is to implement trip plan persistence and a dedicated `/planner/[id]` view page, integrate the in-thread "Save & Share" action in `/planner`, conform strictly to brand/architectural guardrails, update `HANDOFF.md`, and verify with linting and production build.

## Working Directory
`/Users/preetbansal/maujitrip1currentsite/.agents/teamwork/worker_1`

## Mandatory Integrity Warning
> DO NOT CHEAT. All implementations must be genuine. DO NOT
> hardcode test results, create dummy/facade implementations, or
> circumvent the intended task. An auditor will independently
> verify your work. Integrity violations WILL be detected and your
> work WILL be rejected.

## Input Files to Read First
1. `/Users/preetbansal/maujitrip1currentsite/.agents/teamwork/ORIGINAL_REQUEST.md` (authoritative specifications)
2. `/Users/preetbansal/maujitrip1currentsite/.agents/teamwork/PROJECT.md`
3. `/Users/preetbansal/maujitrip1currentsite/.agents/teamwork/explorer_1/handoff.md` (planner UI, state, chat resumption)
4. `/Users/preetbansal/maujitrip1currentsite/.agents/teamwork/explorer_2/handoff.md` (persistence, atomic file write, Next.js 16 dynamic route params)
5. `/Users/preetbansal/maujitrip1currentsite/.agents/teamwork/explorer_3/handoff.md` (design taste lint rules, ticket-ledger tokens, layout blueprint, HANDOFF.md updates)

## File Ownership (You exclusively own and edit these files)
- `src/lib/planner/storage.ts` (new: persistence logic, atomic write via temp file + fs.rename, ID generation, path traversal check)
- `src/lib/planner/engine.ts` (only add optional `id?: string;` to `TripPlan` interface if needed; DO NOT change interview logic or regexes)
- `src/app/api/plans/route.ts` (new: POST saves to data/plans/[id].json and returns `{ id, url: "/planner/[id]" }` 201; optional GET fallback)
- `src/app/api/plans/[id]/route.ts` (new: GET returns stored plan or 404 clean JSON `{ error: "Plan not found." }`. Note in Next.js 16 params is a Promise: `const { id } = await params;`)
- `src/app/planner/[id]/page.tsx` (new: ticket-ledger style saved plan page with title, meta, days, package, stay, flight, estimate, 1-click "Copy share link", "Continue in planner chat" CTA, and branded 404 not found state. Strict design tokens, zero prohibited styles)
- `src/app/planner/page.tsx` (edit: add "Save & Share" button to `PlanCard` calling POST `/api/plans`, showing in-thread share URL & copy feedback; add mount effect checking `new URLSearchParams(window.location.search).get("planId")` to load saved plan into chat session)
- `HANDOFF.md` in `/Users/preetbansal/maujitrip1currentsite/HANDOFF.md` (update reflecting new routes, persistence layer, verification status, and mark Item 4 completed)

## Design Guardrails & Linter Constraints
Strictly satisfy all rules in `.opencode/skills/design-taste-frontend/scripts/lint.mjs`:
- Brand colors: Teal `#023341`, Ink `#003b53`, Action Orange `#d63f00` (hover `#b53a00`), Text Accent Orange `#a83200`, Cream `#efeeeb`.
- NO `shadow-*` (except real dialog/overlay marked data-ui, none in planner).
- NO `border-*` or `divide-*` (hairlines/divided boxes). Separate with tone (`bg-white` on `bg-[#efeeeb]`, with child rows in `bg-[#efeeeb]`).
- NO `font-mono` on ticket data, prices, or IDs.
- NO `01` leading zeros (use `Day ${d.day}`).
- NO emojis (use Lucide icons like `Copy`, `Send`, `Share2`, `CheckCircle2`, `Compass`, `Sparkles`).
- NO `h-screen` (use `min-h-dvh`).
- NO `transition-all` (use `transition-colors`).
- Sentence-case copy throughout.

## Required Verification Steps
Run and verify:
1. `node .opencode/skills/design-taste-frontend/scripts/lint.mjs src/app/planner` -> must exit with 0 FAIL.
2. `npm run build` -> must succeed with 0 errors (all routes statically generated).
3. Test API via curl or node script:
   - POST `/api/plans` creates `data/plans/[id].json` and returns `{ id, url }` with 201.
   - GET `/api/plans/[id]` returns 200 with stored JSON.
   - GET `/api/plans/nonexistent` returns 404 with clean JSON `{ error: "Plan not found." }`.
   - GET `/api/plans/..%2f..%2fpackage.json` returns 404.

## Handoff Report Requirements
Write your detailed report to `/Users/preetbansal/maujitrip1currentsite/.agents/teamwork/worker_1/handoff.md` with:
- Observation (files changed and created)
- Logic Chain (key architectural decisions)
- Caveats
- Conclusion (summary of implementation)
- Verification (exact commands executed and stdout/stderr results)
Then send a completion message.


## 2026-10-16T17:41:58Z
Read your dispatch instructions at /Users/preetbansal/maujitrip1currentsite/.agents/teamwork/worker_1/DISPATCH.md.
Also read /Users/preetbansal/maujitrip1currentsite/.agents/teamwork/ORIGINAL_REQUEST.md.
Follow all requirements and architectural blueprints from the explorer handoff reports:
- /Users/preetbansal/maujitrip1currentsite/.agents/teamwork/explorer_1/handoff.md
- /Users/preetbansal/maujitrip1currentsite/.agents/teamwork/explorer_2/handoff.md
- /Users/preetbansal/maujitrip1currentsite/.agents/teamwork/explorer_3/handoff.md

Implement R1 (API routes and persistence), R2 (/planner/[id] page), R3 (In-thread Save & Share), and R4 (design tokens, zero lint errors), update HANDOFF.md, run the lint.mjs check and npm run build verification, and write your handoff report to /Users/preetbansal/maujitrip1currentsite/.agents/teamwork/worker_1/handoff.md.

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. An auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.
