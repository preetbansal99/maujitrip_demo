# Orchestration Plan: Trip Plan Persistence & Shareable View

## Overview
Implement persistence for trip plans (`/api/plans` and `data/plans/[id].json`), a ticket-ledger style shareable itinerary view page (`/planner/[id]`), and an in-thread "Save & Share" action on `/planner` trip plan cards. Conform to strict brand guardrails (teal #023341, action orange #d63f00, cream #efeeeb, no prohibited styles) and zero lint/build errors.

## Scope & Milestones
- **M1: Survey & Technical Investigation** (3 Explorers in parallel)
  - Explorer 1: Inspect `/planner/page.tsx`, `src/lib/planner/engine.ts`, itinerary data structures, and state management.
  - Explorer 2: Inspect existing API routes, file system / data persistence conventions, next.js app router structure, and `data/plans` requirements.
  - Explorer 3: Inspect `.opencode/skills/design-taste-frontend/scripts/lint.mjs`, design tokens, existing styles/components, and build setup.
- **M2: Implementation** (Worker)
  - Implement R1: POST `/api/plans` and GET `/api/plans/[id]` (clean 404 JSON, atomic/safe file write to `data/plans/[id].json`).
  - Implement R2: `/planner/[id]/page.tsx` rendering saved plan in ticket-ledger style with "Copy Share Link" and "Continue in Planner Chat" (loading plan into planner), handling 404 gracefully.
  - Implement R3: `/planner/page.tsx` "Save & Share" button on plan cards, in-thread link copy with toast/feedback.
  - Implement R4: Brand tokens, 16px body, zero lint errors, update `HANDOFF.md`.
  - Worker runs lint and build verification commands.
- **M3: Verification & Review** (2 Reviewers)
  - Reviewer 1: Functional review (API, chat integration, resumption in planner, 404 states, copy link).
  - Reviewer 2: Architectural and design-taste review (tokens, no shadows/gradients/hairlines/emojis, lint.mjs pass, build pass).
- **M4: Gate & Completion Report**
  - Gate check on all criteria.
  - Send completion report to Sentinel.
