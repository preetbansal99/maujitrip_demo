# HANDOFF — MaujiTrip Clone + AI Chatbot

> **Status: Sat Oct 17, 2026 (morning).** Full site clone (24 pages) + **agentic AI chatbot**
> with tools, memory, sessions, voice, **trip plan persistence API (`/api/plans`)**,
> **dedicated shareable view route (`/planner/[id]`)**, and **human-like travel consultant persona**.
> `npm run build` is clean (38 routes: +`/api/plans`, +`/api/plans/[id]`, +`/planner/[id]`). Dev server: `http://localhost:3000`
> (`npm run dev` in `/Users/preetbansal/maujitrip1currentsite`).
> Destination isolation fixed (Oct 17): `buildPlan()` in `src/lib/planner/engine.ts` and `list_packages`
> in `src/lib/ai/tools.ts` strictly filter packages for the requested destination; queries for Kerala
> under 1 lakh match real Kerala packages and never fall back across inventory to Dubai.
> LLM custom itineraries: if a destination or custom itinerary has no pre-made package, the planner
> crafts a customized day-by-day itinerary with realistic budget estimates and links to live flights/hotels,
> instead of forcing unrelated packages.
> Web search added: `search_web` tool integrated into `/api/ai/chat` agent loop using Wikivoyage and
> Wikipedia travel encyclopedias (plus optional Tavily API) for live destination facts, sights, and weather.
> Comprehensive company knowledge: Mauji knows all MaujiTrip services (flights with 0 convenience fee,
> verified partner hotels, packages, bus booking, activities, corporate MICE, 24/7 toll-free 1800-270-0297,
> Noida head office, payment methods, and 5-7 day refunds under /cancellation-refund).
> Human-like conversational tone & polite scope denials: off-topic queries (coding, homework, politics)
> are politely and naturally declined like a real human consultant while steering back to travel.
> Taste skill lint gate: 0 FAIL maintained. Dev server running fresh on :3000.

---

## 1. What exists

**Clone** — Next.js 16.4 / React 19 / Tailwind v4. Homepage + flights, hotels,
bus, holidays, activities, blog (live), 7 legal pages, package/theme/destination
detail pages, hotel details, flight/bus/hotel search results. All images local
(`public/images/...`); live data via same-origin proxies (never call upstream
from the browser — CORS untested).

**AI chatbot** — `/planner` → **"Talk with LLM"** tab (BottomNav Chatbot opens it):
- Free built-in brain by default: `Mauji AI (free)` → `https://text.pollinations.ai/openai`, model `openai` (gpt-oss-20b), **no key needed**. Custom keys via Configure (OpenAI/OpenRouter/Gemini/Custom) stored in `localStorage` only.
- **Tools** (`src/lib/ai/tools.ts`, executed server-side in `/api/ai/chat` agentic loop, max 4 rounds): `search_flights` (live fares), `search_hotels`, `list_packages`, `get_destination`, `build_trip_plan` (returns plan JSON → rendered as booking card), `remember_fact` (writes `data/memory.md`, refuses secrets).
- **Hardened system prompt** (`src/lib/ai/system.ts`): travel-only scope, exact refusal line, no invented prices, prompt-injection resistance (user/tool/memory text is data), no secrets/OTP/cards, bookings pay-walled to site flows.
- **ChatGPT-style shell**: sessions sidebar (new/switch/delete, auto-titles, `localStorage`), Memory viewer + manual save (`data/memory.md` via `/api/ai/memory`), per-reply Listen button, mic input (Chrome SpeechRecognition), ElevenLabs-style TTS via `/api/ai/tts` (needs key+voice; else device voice), "Generate trip plan" (parses chat → structured plan card).
- **Quick Plan tab**: rule-based interviewer (no AI) — untouched and working.
- Timeouts everywhere (60s model, 25s flight API, 120s client) + 3× retry; free-tier flakes surface as "busy — tap send again".

**Trip Plan Persistence & Sharing** —
- `POST /api/plans` persists generated itineraries to `data/plans/[id].json` atomically via temp-file write and rename with 12-char alphanumeric URL-safe IDs (`crypto.randomBytes(6).toString("hex")`) and strict path traversal validation. Returns `{ id, url: "/planner/[id]" }` with HTTP 201.
- `GET /api/plans/[id]` retrieves saved plan payloads with HTTP 200, returning HTTP 404 with clean JSON `{ error: "Plan not found." }` for missing IDs or path traversal attempts.
- `/planner/[id]` dedicated view route renders saved plans in the brand ticket-ledger format: teal stub header (`#023341`), day-by-day itinerary (`Day N`), package/hotel/flight booking components with deep links, and estimated total budget. Features 1-click "Copy share link" and "Continue in planner chat" CTA (`/planner?planId=${id}`). Clean 404 fallback screen with back-to-planner action.
- `/planner` unified chat integration: `PlanCard` includes an in-thread "Save & share plan" action saving the plan without page reload, providing 1-click clipboard copy feedback. On mount, `/planner` checks for `planId` query parameter, seamlessly loading saved itineraries and profile metadata into the conversation with active booking guidance.

## 2. Key files

- `src/lib/planner/storage.ts` — atomic write persistence, crypto ID generator, traversal guard
- `src/app/api/plans/route.ts` — POST plan persistence endpoint + optional GET query
- `src/app/api/plans/[id]/route.ts` — dynamic item GET endpoint with Promise params resolution
- `src/app/planner/[id]/page.tsx` — shareable trip plan view page with ticket-ledger layout
- `src/app/planner/page.tsx` — tabs, Quick Plan, full AiChat shell, in-thread Save & Share, query resumption
- `src/app/api/ai/chat/route.ts` — agentic loop + fallback when model rejects `tools`
- `src/lib/ai/system.ts` — prompt; `src/lib/ai/tools.ts` — tool defs/executors/memory-fs
- `src/app/api/ai/memory/route.ts`, `src/app/api/ai/tts/route.ts`, `data/memory.md`
- `src/lib/planner/engine.ts` — rule engine + exported parsers reused by chat (optional `id?: string` in `TripPlan`)
- Upstream base: `https://unbrandonline.com/maujitrip/api` (see §4 of previous handoff content kept below for site details)

## 3. Verified working (Oct 16)

- `POST /api/plans` → 201 Created with `{ id, url }`, verified atomic write to `data/plans/[id].json` ✓
- `GET /api/plans/[id]` → 200 OK with full stored plan and profile JSON ✓
- `GET /api/plans/nonexistent` → 404 with clean JSON `{ error: "Plan not found." }` ✓
- Path traversal attack `GET /api/plans/..%2f..%2fpackage.json` → 404 blocked ✓
- `node .opencode/skills/design-taste-frontend/scripts/lint.mjs src/app/planner` → 0 FAIL, 1 WARN (pre-existing bounce) ✓
- `npm run build` → 0 errors, all 38 routes statically generated cleanly ✓
- Tool Q "find cheap DEL→BOM Oct 19" → model asked for dates instead of hallucinating ✓
- Direct `/api/ai/chat` call → 200 with grounded reply ✓
- Sessions/memory UI render; plan card renders from `build_trip_plan`
- **Flaky**: free model latency 10–60s+, occasional 502s (retries cover most)

## 4. Open points for next chat (discuss → apply)

1. **Voice default**: currently device voice unless ElevenLabs key added. OK, or set a default voice?
2. **Memory scope**: file-based `data/memory.md` (dev). Move to DB (Supabase/Prisma) when auth lands?
3. **Auth**: booking buttons open demo login modal. Real auth (Auth.js/Supabase) before plan persistence?
4. **Plan persistence**: COMPLETED (Oct 16 night) — atomic file persistence in `data/plans/[id].json`, `/api/plans` endpoints, `/planner/[id]` ticket-ledger view, in-thread Save & Share, and chat resumption.
5. **Round-trip flights**: results page shows one-way only.
6. **Model choice**: stay on free gpt-oss, or default to a user key model?
7. **Proactive planner**: should AI auto-suggest trips on homepage, or stay in `/planner`?
8. **Guardrail test set**: standard jailbreak/bypass prompts to run against the system prompt.

## 5. Site reference (from earlier build — unchanged)

- 24 pages: `/`, `/flights`, `/search/flight`, `/flights-routes/[slug]`, `/hotels`,
  `/hotels/results`, `/hotels/details/[slug]`, `/bus`, `/search/bus`, `/holidays`,
  `/holidays/search`, `/holidays/destinations/[slug]`, `/holidays/themes/[slug]`,
  `/holidays/packages/[slug]`, `/activities`, `/blog`, `/blog/[slug]`, 7 legal pages.
- Live proxies: flights search/results, hotel suggest, holiday destinations/packages/suggest, blog.
- Quirks: flight `segments` is nested arrays (`.flat()`); hotel live inventory empty (local discover data used); 3 upstream images 404-substituted; `new Date()` breaks prerender (use `useEffect`); headless screenshots often pre-hydration (verify via live-tab DOM).
- Design tokens: teal `#023341`, orange `#f74800`, cream `#efeeeb`; Poppins/Inter/Dancing Script.
- Verify: `npm run build` green + curl spot-checks (`/`, `/flights`, `/hotels`, `/bus`, `/holidays`, `/planner`, `/blog`, `/api/ai/memory`).

## 6. How to continue in the next chat

Say e.g. "apply point 3 (plan persistence)" or "switch default model to X" or
"run guardrail tests". Each change: edit → `npm run build` → verify on
`http://localhost:3000/planner` (Talk with LLM tab) → update this file's status.
