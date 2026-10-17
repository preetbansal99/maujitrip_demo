<div align="center">

# MaujiTrip · AI Travel Concierge & Portal

**A production-ready full-stack online travel booking portal and agentic AI travel planner built with Next.js 16, React 19, TypeScript, and Tailwind CSS v4.**

[![Next.js](https://img.shields.io/badge/Next.js-16.4.0-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.3.0-blue?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-teal?style=flat-square)](LICENSE)

[Features](#-features) • [AI Agent](#-agentic-ai-travel-planner) • [Tech Stack](#-tech-stack) • [Quick Start](#-quick-start) • [Project Structure](#-project-structure) • [Design System](#-design-system)

</div>

---

## ✈️ Overview

**MaujiTrip** provides a comprehensive online travel platform for Indian and international travel, featuring live flight search proxies, verified hotel and resort catalogs, holiday packages, bus bookings, and a unified **Agentic AI Travel Consultant** (`/planner`).

The AI chatbot acts as a seasoned human travel agent: it understands traveler vibes, verifies budgets against live site inventory, performs real-time travel web research, generates day-by-day customized itineraries, and guides travelers step-by-step to booking completion.

---

## 🌟 Features

### 🛫 Flight Booking Engine
* **Live Search Proxy**: Same-origin proxied domestic and international flight search with real-time fares.
* **Smart Route Previews**: Top Indian routes (DEL-BOM, BLR-GOI, etc.) with live calendar fare indicators.
* **Zero Convenience Fee**: Transparent pricing structure with instant fare comparisons.

### 🏨 Hotels & Partner Resorts
* **Verified Properties**: Curated luxury and budget stays (Three Heavens Resort Corbett, Sea Breeze Calangute, Misty Tea Valley Munnar, etc.).
* **Dynamic Results & Filters**: Search by destination city, check-in/out dates, guest count, and star ratings.

### 🏖️ Holiday Packages & Custom Tours
* **Curated Packages**: Handcrafted tours across Kerala, Rajasthan, Himachal, Kashmir, Dubai, Bali, and Thailand.
* **Rich Itineraries**: Day-by-day schedule breakdown, hotel tier selections, and sightseeing inclusions.

### 🚌 Bus Reservation System
* **Pan-India Routes**: Search AC Sleeper, Seater, and Volvo Multi-Axle buses connecting 10+ major transit hubs.
* **Boarding & Dropping Points**: Transparent boarding locations and operator amenities.

---

## 🤖 Agentic AI Travel Planner

Located at [`/planner`](file:///Users/preetbansal/maujitrip1currentsite/src/app/planner/page.tsx), the AI consultant combines deterministic inventory checking with multi-turn LLM reasoning:

```
User Query ("Kerala trip for 2 under 1 Lakh")
                     │
                     ▼
       ┌───────────────────────────┐
       │   Deterministic Engine    │
       │   (engine.ts / tools.ts)  │
       └─────────────┬─────────────┘
                     │ Matches destination inventory
                     ▼
       ┌───────────────────────────┐
       │     Agent Tool Loop       │ ◄───► [search_flights]
       │   (/api/ai/chat route)    │ ◄───► [search_hotels]
       └─────────────┬─────────────┘ ◄───► [list_packages]
                     │               ◄───► [search_web]
                     │               ◄───► [build_trip_plan]
                     ▼
       ┌───────────────────────────┐
       │   ChatMessageContent UI   │
       │  • Formatted HTML Tables  │
       │  • 1-Click Booking CTAs   │
       │  • Quick-Reply Chips      │
       └─────────────┬─────────────┘
                     │
                     ▼
       ┌───────────────────────────┐
       │    Plan Persistence API   │
       │     (/planner/[id])       │
       └───────────────────────────┘
```

### Key AI Capabilities:
* **Destination Isolation**: Strict destination filtering prevents hallucinated package mismatches (asking for Kerala never returns Dubai).
* **Dynamic Custom Itineraries**: When a custom duration or off-beat destination lacks a catalog package, the LLM constructs an authentic day-by-day schedule with live hotel/flight pricing estimates.
* **Web Travel Search (`search_web`)**: Integrated live Wikivoyage and Wikipedia travel encyclopedias (with optional Tavily API fallback) for up-to-date sightseeing, local food, and seasonal climate tips.
* **Budget Honesty Enforcement**: Validates budgets server-side against realistic minimum thresholds; provides actionable compromises rather than false promises.
* **Strict Domain Guardrails**: Politely declines off-topic requests (coding, homework, non-travel advice) while steering the user back to vacation planning.
* **Ticket-Ledger Table Rendering**: Automatically renders markdown pipe tables into styled high-contrast tables with cell bullets, brand accents, and 1-click booking CTAs.
* **Auto-Extracted Quick-Reply Chips**: Numbered next steps are parsed into interactive tap-to-reply chips.
* **Plan Persistence (`/api/plans`)**: Generated itineraries are persisted atomically to `data/plans/[id].json` and shareable via permanent links at `/planner/[id]`.
* **Voice & Audio Support**: Speech-to-text input (Chrome Web Speech) and ElevenLabs text-to-speech with device voice fallback.
* **Flexible AI Backends**: Free built-in brain via Pollinations AI (no API key required), OpenAI (`gpt-4o-mini`), OpenRouter, Google Gemini, or local models via OpenCode Local.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 16.4.0](https://nextjs.org/) (App Router, Turbopack, Partial Prerendering) |
| **UI Library** | [React 19.3.0](https://react.dev/) |
| **Language** | [TypeScript 5.x](https://www.typescriptlang.org/) (strict mode) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) (`@tailwindcss/turbopack`) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Maps** | [Leaflet](https://leafletjs.com/) |
| **Persistence** | Atomic filesystem JSON storage (`data/plans/`, `data/memory.md`) |
| **Architecture** | Same-origin API route proxies (`/api/live/*`, `/api/ai/*`) |

---

## 📂 Project Structure

```
├── data/                      # Persisted user data (git-ignored)
│   ├── memory.md              # Long-term user preferences
│   └── plans/                 # Saved trip plan JSON files
├── public/                    # Static assets & optimized WebP photography
│   └── images/                # Brand logos, destination & package banners
├── src/
│   ├── app/                   # Next.js 16 App Router (38 routes)
│   │   ├── api/
│   │   │   ├── ai/            # Chat agent, trip plan enrichment, memory, TTS
│   │   │   ├── live/          # Same-origin upstream proxies (flights, hotels, packages)
│   │   │   └── plans/         # Trip plan persistence API (/api/plans/[id])
│   │   ├── flights/           # Flight search & route details
│   │   ├── hotels/            # Hotel search, city listings & property details
│   │   ├── holidays/          # Tour packages, themes & destination guides
│   │   ├── bus/               # Intercity bus routes & seat finder
│   │   ├── planner/           # Unified AI Travel Chatbot shell
│   │   │   └── [id]/          # Dedicated shareable saved itinerary view
│   │   └── layout.tsx         # Global typography & root layout
│   ├── components/            # Reusable UI components
│   │   ├── ChatMessageContent # Ticket-ledger markdown table & CTA parser
│   │   ├── SiteChrome.tsx     # Unified header, footer & mobile navigation
│   │   ├── Header.tsx         # Top navigation bar
│   │   ├── BottomNav.tsx      # Mobile bottom navigation bar
│   │   └── Hero.tsx           # Search widget tabs for flights, stays & buses
│   ├── data/
│   │   ├── demo.ts            # Local package catalog, hotel directory & bus routes
│   │   └── site.ts            # Destination metadata & company info
│   └── lib/
│       ├── ai/                # Hardened system prompts, tool executors & local bridge
│       └── planner/           # Rule interviewer, budget feasibility & storage
├── HANDOFF.md                 # Project architecture & current status log
└── package.json
```

---

## 🚀 Quick Start

### Prerequisites
* **Node.js**: v20.x or later
* **npm**: v10.x or later

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/preetbansal99/maujitrip_demo.git
   cd maujitrip_demo
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Build for production**:
   ```bash
   npm run build
   npm run start
   ```

---

## 🎨 Design System & Guidelines

MaujiTrip uses an opinionated, high-contrast design language optimized for legibility and usability:

* **Brand Palette**:
  * **Deep Teal**: `#023341` (primary headers, tickets, active states)
  * **Action Orange**: `#d63f00` (booking CTAs, price highlights, bullet dots)
  * **Warm Cream**: `#efeeeb` (page background, card fills)
* **Design Principles**:
  * **High Contrast**: Minimum WCAG AA compliance across text and buttons.
  * **Flat Surfaces**: Physical surfaces separated by tone and fill rather than heavy shadows or hairlines.
  * **Readable Typography**: 16px base body font; system display fonts for numerals and headers.
  * **Taste Linter**: Automated scan via `design-taste-frontend` maintaining 0 violations.

---

## 📄 License

Distributed under the [MIT License](LICENSE). Copyright &copy; 2026 Preet Bansal.
