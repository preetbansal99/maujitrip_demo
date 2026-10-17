import { promises as fs } from "fs";
import path from "path";
import { demoPackages, discoverHotels, demoHotels, inr } from "@/data/demo";
import { destinations } from "@/data/site";
import { buildPlan, checkFeasibility, type TripProfile } from "@/lib/planner/engine";

const MEMORY_FILE = path.join(process.cwd(), "data", "memory.md");

export async function readMemory(): Promise<string> {
  try {
    return await fs.readFile(MEMORY_FILE, "utf-8");
  } catch {
    return "";
  }
}

export async function appendMemory(fact: string): Promise<string> {
  const line = `- ${fact.trim().slice(0, 200)}`;
  let cur = "";
  try {
    cur = await fs.readFile(MEMORY_FILE, "utf-8");
  } catch {
    /* create */
  }
  if (cur.toLowerCase().includes(fact.trim().toLowerCase().slice(0, 24))) {
    return "Fact already saved.";
  }
  await fs.mkdir(path.dirname(MEMORY_FILE), { recursive: true });
  await fs.writeFile(MEMORY_FILE, (cur.replace(/\s+$/, "") + "\n" + line + "\n").trimStart());
  return "Saved to memory.";
}

export const TOOL_DEFS = [
  {
    type: "function",
    function: {
      name: "search_flights",
      description: "Search LIVE flight fares for a route and date. Returns cheapest options first.",
      parameters: {
        type: "object",
        properties: {
          from_code: { type: "string", description: "Origin airport code, e.g. DEL" },
          to_code: { type: "string", description: "Destination airport code, e.g. BOM" },
          date: { type: "string", description: "YYYY-MM-DD" },
          adults: { type: "number", description: "Adult travellers, default 1" },
        },
        required: ["from_code", "to_code", "date"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "search_hotels",
      description: "Find stays in a city from site inventory.",
      parameters: {
        type: "object",
        properties: { city: { type: "string" } },
        required: ["city"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "list_packages",
      description: "List holiday packages, optionally filtered.",
      parameters: {
        type: "object",
        properties: {
          destination: { type: "string" },
          theme: { type: "string", description: "honeymoon|family|adventure|beach" },
          budget_max: { type: "number" },
          limit: { type: "number" },
        },
      },
    },
  },
  {
    type: "function",
    function: {
      name: "get_destination",
      description: "Get destination meta: best time to visit, description.",
      parameters: {
        type: "object",
        properties: { slug: { type: "string", description: "e.g. goa-tour-packages" } },
        required: ["slug"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "build_trip_plan",
      description: "Build a complete day-wise trip plan card from a collected profile.",
      parameters: {
        type: "object",
        properties: {
          destination: { type: "string" },
          days: { type: "number" },
          travellers: { type: "number" },
          budget: { type: "number" },
          themes: { type: "array", items: { type: "string" } },
        },
        required: ["destination", "days"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "search_web",
      description: "Search the web for up-to-date travel information, destination guides, weather, sightseeing spots, local food, culture, travel advice, or entry guidelines.",
      parameters: {
        type: "object",
        properties: {
          query: { type: "string", description: "Search query, e.g. 'Kerala tourism best places to visit' or 'Manali weather in December'" },
        },
        required: ["query"],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "remember_fact",
      description: "Save one durable user fact to long-term memory (preferences, home city, past trips). Never store secrets or payment data.",
      parameters: {
        type: "object",
        properties: { fact: { type: "string" } },
        required: ["fact"],
      },
    },
  },
];

const UP = "https://unbrandonline.com/maujitrip/api";

async function searchWeb(query: string): Promise<string> {
  const q = String(query || "").trim();
  if (!q) return "Please provide a search query.";

  const results: { title: string; snippet: string; url: string }[] = [];

  // Optional Tavily API if key present
  if (process.env.TAVILY_API_KEY) {
    try {
      const tr = await timedFetch("https://api.tavily.com/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ api_key: process.env.TAVILY_API_KEY, query: q, max_results: 4 }),
      }, 8000).then((r) => r.json());
      if (Array.isArray(tr?.results) && tr.results.length) {
        return tr.results.map((r: any) => `${r.title}\n${r.content}\nSource: ${r.url}`).join("\n\n");
      }
    } catch {
      /* fallback to encyclopedias */
    }
  }

  // 1. Wikivoyage travel search (destinations, attractions, itineraries, travel advice)
  try {
    const voyUrl = `https://en.wikivoyage.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(q)}&utf8=&format=json&srlimit=3`;
    const r = await timedFetch(voyUrl, { headers: { "User-Agent": "MaujiTripBot/1.0" } }, 6000).then((x) => x.json());
    const list = r?.query?.search || [];
    for (const item of list) {
      results.push({
        title: item.title,
        snippet: item.snippet.replace(/<[^>]+>/g, "").replace(/&quot;/g, '"').replace(/&#039;/g, "'"),
        url: `https://en.wikivoyage.org/wiki/${encodeURIComponent(item.title.replace(/ /g, "_"))}`,
      });
    }
  } catch {
    /* fallback to wikipedia */
  }

  // 2. Wikipedia search
  if (results.length < 3) {
    try {
      const wikiUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(q)}&utf8=&format=json&srlimit=3`;
      const r = await timedFetch(wikiUrl, { headers: { "User-Agent": "MaujiTripBot/1.0" } }, 6000).then((x) => x.json());
      const list = r?.query?.search || [];
      for (const item of list) {
        if (!results.some((existing) => existing.title.toLowerCase() === item.title.toLowerCase())) {
          results.push({
            title: item.title,
            snippet: item.snippet.replace(/<[^>]+>/g, "").replace(/&quot;/g, '"').replace(/&#039;/g, "'"),
            url: `https://en.wikipedia.org/wiki/${encodeURIComponent(item.title.replace(/ /g, "_"))}`,
          });
        }
      }
    } catch {
      /* ignore */
    }
  }

  // 3. DuckDuckGo Instant Answer
  if (results.length === 0) {
    try {
      const ddgUrl = `https://api.duckduckgo.com/?q=${encodeURIComponent(q)}&format=json&no_html=1&skip_disambig=1`;
      const d = await timedFetch(ddgUrl, { headers: { "User-Agent": "MaujiTripBot/1.0" } }, 5000).then((x) => x.json());
      if (d?.AbstractText) {
        results.push({
          title: d.Heading || q,
          snippet: d.AbstractText,
          url: d.AbstractURL || "https://duckduckgo.com/?q=" + encodeURIComponent(q),
        });
      }
    } catch {
      /* ignore */
    }
  }

  if (!results.length) {
    return `No live web search results found for "${q}". You can answer using your comprehensive travel knowledge.`;
  }

  return results
    .slice(0, 4)
    .map((r) => `[${r.title}]\n${r.snippet}\nSource: ${r.url}`)
    .join("\n\n");
}

async function timedFetch(url: string, init: RequestInit, ms: number) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), ms);
  try {
    return await fetch(url, { ...init, signal: ctrl.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function liveFlightSearch(from: string, to: string, date: string, adults: number) {
  const s = await timedFetch(`${UP}/flights/search`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      from, to, depart_date: date, return_date: null, trip_type: "ONEWAY",
      adults, children: 0, infants: 0, cabin_class: "ECONOMY", customer_type: "B2C",
    }),
  }, 25000).then((r) => r.json());
  const key = s?.cacheKey;
  if (!key) return [];
  for (let i = 0; i < 10; i++) {
    const j = await timedFetch(`${UP}/flights/results`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ cacheKey: key }),
    }, 25000).then((r) => r.json());
    const list = j?.Result?.onward;
    if (Array.isArray(list) && j?.Result?.loading === false) return list;
    await new Promise((res) => setTimeout(res, 1500));
  }
  return [];
}

function fmtBrand(t: string) {
  if (!t) return "";
  if (t === t.toUpperCase()) return t.replace(/_/g, " ");
  return t.split(/[_ ]+/).map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ");
}

export async function runTool(name: string, args: any): Promise<string> {
  try {
    if (name === "search_flights") {
      const list = await liveFlightSearch(
        String(args.from_code || "DEL").toUpperCase(),
        String(args.to_code || "BOM").toUpperCase(),
        String(args.date),
        Number(args.adults || 1)
      );
      const top = list.slice(0, 5).map((f: any) => {
        const legs: any[] = Array.isArray(f.segments) ? f.segments.flat() : [];
        const fares = f.FareList || [];
        const cheapest = fares.reduce(
          (a: any, b: any) =>
            Number(a?.DisplayedPrice ?? a?.OfferedPrice ?? 1e12) <=
            Number(b?.DisplayedPrice ?? b?.OfferedPrice ?? 1e12)
              ? a
              : b,
          fares[0]
        );
        const aname = legs[0]?.Airline?.AirlineName || f.airline;
        const nos = legs.map((s: any) => `${s?.Airline?.AirlineCode}-${s?.Airline?.FlightNumber}`).join(", ");
        const price = cheapest ? Number(cheapest.DisplayedPrice ?? cheapest.OfferedPrice) : f.cheapest_price;
        return `${aname} ${nos}: ${f.from} ${String(f.depart_time).slice(11, 16)} → ${f.to} ${String(f.arrival_time).slice(11, 16)} (${fmtBrand(cheapest?.FareType)}${cheapest?.IsRefundable ? ", refundable" : ""}) ${inr(price)}`;
      });
      return top.length ? top.join("\n") : "No flights found for this route and date.";
    }
    if (name === "search_web") {
      return await searchWeb(args.query);
    }
    if (name === "search_hotels") {
      const rawCity = String(args.city || "").toLowerCase();
      const q = rawCity.replace(/\b(trip|tour|stay|hotel|resort|in|near)\b/g, "").trim() || rawCity;
      const hits = discoverHotels.filter((h) =>
        h.city.toLowerCase().includes(q) || q.includes(h.city.toLowerCase()) ||
        h.name.toLowerCase().includes(q)
      );
      if (!hits.length) {
        const demoHits = demoHotels.filter((h) =>
          h.city.toLowerCase().includes(q) || q.includes(h.city.toLowerCase()) ||
          h.name.toLowerCase().includes(q)
        );
        if (demoHits.length) {
          return demoHits.slice(0, 5).map((h) => `${h.name} (${h.city}), ₹${h.price} a night`).join("\n");
        }
        return `No direct partner stays in our static catalog for ${args.city}. You can recommend popular stay areas in ${args.city} and guide the user to search /hotels for live inventory.`;
      }
      return hits.map((h) => `${h.name} (${h.city}), ${h.rating} stars, ${h.amenities}, ${inr(h.price)} a night`).join("\n");
    }
    if (name === "list_packages") {
      let list = [...demoPackages];
      if (args.destination) {
        const rawD = String(args.destination).toLowerCase();
        const d = rawD.replace(/\b(trip|tour|packages?|holiday|vacation|visit|plan|under|lakh|k|\d+)\b/g, "").trim() || rawD;
        list = list.filter(
          (p) =>
            p.dest.toLowerCase().includes(d) ||
            d.includes(p.dest.toLowerCase()) ||
            p.title.toLowerCase().includes(d)
        );
      }
      if (args.theme) {
        const t = String(args.theme).toLowerCase();
        const themed = list.filter((p) => p.title.toLowerCase().includes(t));
        if (themed.length) list = themed;
      }
      if (args.budget_max) {
        const budgeted = list.filter((p) => p.price <= Number(args.budget_max));
        if (budgeted.length) list = budgeted;
      }
      const n = Math.min(Number(args.limit) || 5, 8);
      if (!list.length) {
        return `We do not have a pre-packaged holiday tour matching "${args.destination}" in our catalog. However, as an expert travel consultant, you can craft a customized day-by-day itinerary for ${args.destination} on your own! Guide the user to search live flights on /flights and stays on /hotels.`;
      }
      return list.slice(0, n).map((p) => `${p.title}, ${p.nights}N/${p.days}D, ${inr(p.price)}, /holidays/packages/${p.slug}`).join("\n");
    }
    if (name === "get_destination") {
      const slug = String(args.slug);
      const local = destinations.find((d) => d.slug === slug);
      try {
        const r = await fetch(`${UP}/holidays/destinations/${slug}`, {
          headers: { Accept: "application/json" },
        }).then((x) => x.json());
        const d = r?.data;
        if (d) return `${d.name} (${d.country}): best time ${d.best_time || "year-round"}. ${d.description || ""}`.slice(0, 400);
      } catch {
        /* offline fallback */
      }
      if (local) return `${local.name}: see /holidays/destinations/${local.slug}`;
      return "Destination not found.";
    }
    if (name === "build_trip_plan") {
      const rawDest = String(args.destination || "").trim();
      const cleanDest = rawDest.replace(/\b(trip|tour|packages?|holiday|vacation|visit|plan|under|lakh|k|\d+)\b/gi, "").trim() || rawDest;
      const profile: TripProfile = {
        destination: cleanDest || rawDest,
        destSlug: null,
        days: Number(args.days) || 4,
        travellers: Number(args.travellers) || 2,
        budget: Number(args.budget) || null,
        themes: Array.isArray(args.themes) ? args.themes : [],
        origin: "Delhi",
      };
      // Honesty gate, server side: no fake plans below the floor, whoever asks.
      const f = checkFeasibility(profile);
      if (!f.feasible && profile.budget) {
        return `BUDGET_INFEASIBLE: ${inr(profile.budget)} cannot cover ${profile.days} days in ${profile.destination} for ${profile.travellers}. Realistic minimum about ${inr(f.minNeeded)}. The cheapest ${profile.destination} package alone is ${f.cheapestPkg ? inr(f.cheapestPkg) : "above budget"}. Do NOT present a plan. Explain honestly with these exact numbers and offer fixes: raise the budget, cut days, backpack by bus, or change destination.`;
      }
      const plan = buildPlan(profile);
      return JSON.stringify({ plan_card: "TRIP_PLAN_JSON", plan });
    }
    if (name === "remember_fact") {
      const fact = String(args.fact || "");
      if (/otp|password|card|cvv|aadhaar|upi.*\d{4,}/i.test(fact)) return "Refused: cannot store secrets or payment data.";
      return await appendMemory(fact);
    }
    return `Unknown tool: ${name}`;
  } catch (e: any) {
    return `Tool ${name} failed: ${String(e?.message || e).slice(0, 160)}`;
  }
}

export function inventoryBlock() {
  const dests = destinations.map((d) => d.slug.replace(/-tour-packages?$/, "")).join(", ");
  const pkgs = demoPackages.map((p) => `${p.title} (₹${p.price}, /holidays/packages/${p.slug})`).join("\n");
  const hotels = [...discoverHotels, ...demoHotels.map((h) => ({ name: h.name, city: h.city, price: h.price }))]
    .map((h) => `${h.name}, ${h.city}, ₹${h.price}`).join("\n");
  return { dests, pkgs, hotels };
}
