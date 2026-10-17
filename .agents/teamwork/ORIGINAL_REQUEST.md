# Original User Request

## 2026-10-16T17:23:25Z

This is a single self-contained fix; keep it small and focused.

Implement trip plan persistence and a dedicated `/planner/[id]` view page for MaujiTrip, allowing users to save, share via link, and resume generated trip plans while maintaining strict brand and architectural guardrails.

Working directory: `/Users/preetbansal/maujitrip1currentsite`
Integrity mode: development

## Requirements

### R1. Plan Persistence API (`/api/plans`)
- Implement a server-side route `/api/plans` that accepts a POST request with a generated trip plan payload (and profile metadata), generates a unique plan ID (e.g. nanoid / crypto random string), and persists the plan as JSON in `data/plans/[id].json`.
- Implement a GET endpoint (`/api/plans/[id]` or query parameter) to fetch a saved plan by ID, returning 404 with a clean JSON error if the plan does not exist.

### R2. Shareable Plan Page (`/planner/[id]`)
- Create a server-rendered or client-hydrated route at `src/app/planner/[id]/page.tsx` that loads and displays the saved trip plan.
- The page must render the plan details (title, days, activities, partner hotel, matching package, estimated budget breakdown) using the brand's ticket-ledger style.
- Include actionable buttons: a 1-click "Copy Share Link" button and a "Continue in Planner Chat" button that redirects or loads the plan into `/planner` so the user can continue conversing with the AI travel agent.

### R3. In-Thread "Save & Share" Integration (`src/app/planner/page.tsx`)
- On generated trip plan cards in `/planner`, provide a "Save & Share" button that triggers the `/api/plans` POST request.
- Once saved, display the share link with a 1-click copy button and confirmation toast/text in-thread without breaking the chat session or reloading the page.

### R4. Architectural & Taste Guardrails
- Maintain the unified single-thread chat architecture in `/planner`. Do not alter `src/lib/planner/engine.ts` deterministic interview logic or introduce fuzzy regexes.
- All UI code must conform strictly to design tokens: teal `#023341`, action orange `#d63f00`, cream `#efeeeb`. No gradients, shadows (except floating modals/dialogs), hairlines, emoji, or em-dashes. Body font 16px with AA contrast.
- Run `node .opencode/skills/design-taste-frontend/scripts/lint.mjs src` and ensure 0 FAIL.
- Verify `npm run build` (or `npm run build -- --webpack` if Turbopack port-bind issues occur) passes cleanly with 0 errors.
- Update `HANDOFF.md` in `/Users/preetbansal/maujitrip1currentsite` reflecting the new routes, persistence layer, and verification status.

## Acceptance Criteria

### Persistence & API
- [ ] POST `/api/plans` creates a file in `data/plans/[id].json` and returns `{ id, url: "/planner/[id]" }` with HTTP 200 or 201.
- [ ] GET `/api/plans/[id]` returns the stored trip plan JSON with HTTP 200, and HTTP 404 for unknown IDs.

### User Interface & Sharing
- [ ] Plan cards in `/planner` feature a "Save & Share" action that saves the plan and allows the user to copy `/planner/[id]`.
- [ ] `/planner/[id]` renders the saved itinerary cleanly in the ticket-ledger format with a button to continue in `/planner`.
- [ ] Navigating to `/planner/[id]` with an invalid ID shows a clean, styled "Plan not found" state with a link back to `/planner`.

### Design & Build Verification
- [ ] `node .opencode/skills/design-taste-frontend/scripts/lint.mjs src` exits with 0 FAIL.
- [ ] `npm run build` (or `npm run build -- --webpack`) succeeds with exit code 0.
- [ ] `HANDOFF.md` is updated with the changes and verification notes.
