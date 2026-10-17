// Dev-phase planner engine: deterministic, no API keys.
// Talks the user through destination → days → travellers → budget → theme,
// then builds a TripPlan from local demo data + deep links into live flows
// (flight search, package pages, hotel pages).
// LLM seam: replace `planReply` internals with a call to /api/ai/chat;
// the message/plan contracts below stay identical.

import { demoPackages, discoverHotels, demoHotels, inr } from "@/data/demo";
import { destinations } from "@/data/site";
import { buildFlightSearchUrl } from "@/lib/searchUrl";

export interface ChatMsg {
  role: "ai" | "user";
  text: string;
  chips?: string[];
  plan?: TripPlan;
}

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

// ---- Human interview helpers: vague answers get suggestions, never loops ----

const UNCERTAIN = /idk|i don'?t know|dont know|not sure|no idea|no clue|you decide|you choose|u decide|suggest|whatever|flexible|open to|anything|as you wish|up to you|\bskip\b|confused|surprise/i;
const YES = /^(yes|yeah|yep|yup|ok|okay|sure|fine|good|great|perfect|done|sounds good|lock it|haan|haanji|correct|right|sahi|chalega)$/i;
const NO = /^(no|nope|nah|not really|change|different|bilkul nahi)$/i;

export const isUncertain = (t: string) => UNCERTAIN.test(t);
const isYes = (t: string) => YES.test(t.trim());
const isNo = (t: string) => NO.test(t.trim());

const DEST_DEFAULTS: { days: number; budget: number; themes: string[] } = { days: 4, budget: 25000, themes: ["family"] };

function defaultsFor(p: TripProfile): { days: number; budget: number; themes: string[] } {
  const key = `${p.destSlug || ""} ${p.destination || ""}`.toLowerCase();
  if (/goa/.test(key)) return { days: 4, budget: 25000, themes: ["beach"] };
  if (/manali/.test(key)) return { days: 5, budget: 25000, themes: ["adventure"] };
  if (/kerala/.test(key)) return { days: 6, budget: 30000, themes: ["family"] };
  if (/rajasthan|jaipur|jaisalmer|udaipur/.test(key)) return { days: 6, budget: 30000, themes: ["family"] };
  if (/dubai/.test(key)) return { days: 5, budget: 80000, themes: ["luxury"] };
  if (/europe/.test(key)) return { days: 7, budget: 150000, themes: ["luxury"] };
  if (/thailand/.test(key)) return { days: 6, budget: 60000, themes: ["beach"] };
  if (/bali/.test(key)) return { days: 6, budget: 60000, themes: ["beach"] };
  if (/singapore/.test(key)) return { days: 5, budget: 80000, themes: ["family"] };
  if (/maldives/.test(key)) return { days: 4, budget: 90000, themes: ["beach"] };
  if (/kashmir/.test(key)) return { days: 5, budget: 25000, themes: ["family"] };
  if (/andaman/.test(key)) return { days: 5, budget: 30000, themes: ["beach"] };
  return DEST_DEFAULTS;
}

function matchVibe(t: string): { name: string; slug: string } | null {
  const s = t.toLowerCase();
  if (/beach|sea|island|party/.test(s)) return { name: "Goa", slug: "goa-tour-packages" };
  if (/mountain|hill|snow|trek|paraglid/.test(s)) return { name: "Manali", slug: "manali-tour-packages" };
  if (/desert|fort|royal|palace|camel/.test(s)) return { name: "Rajasthan", slug: "rajasthan-tour-packages" };
  if (/backwater|green|houseboat|ayurv/.test(s)) return { name: "Kerala", slug: "kerala-tour-packages" };
  if (/abroad|foreign|international|luxury|shopping|city break/.test(s)) return { name: "Dubai", slug: "dubai-tour-packages" };
  return null;
}

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

export const blankProfile = (): TripProfile => ({
  destination: null,
  destSlug: null,
  days: null,
  travellers: 2,
  budget: null,
  themes: [],
  origin: "Delhi",
});

const DEST_ALIASES: { slug: string; names: string[] }[] = [
  { slug: "goa-tour-packages", names: ["goa", "baga", "calangute", "north goa"] },
  { slug: "manali-tour-packages", names: ["manali", "himachal", "shimla", "kullu"] },
  { slug: "kerala-tour-packages", names: ["kerala", "kochi", "munnar", "alleppey"] },
  { slug: "rajasthan-tour-packages", names: ["rajasthan", "jaipur", "udaipur", "jaisalmer"] },
  { slug: "dubai-tour-packages", names: ["dubai", "abu dhabi"] },
  { slug: "europe-tour-packages", names: ["europe", "paris", "switzerland", "italy"] },
  { slug: "thailand-tour-packages", names: ["thailand", "bangkok", "phuket", "pattaya"] },
  { slug: "bali-tour-packages", names: ["bali"] },
  { slug: "singapore-tour-packages", names: ["singapore"] },
  { slug: "maldives-tour-packages", names: ["maldives", "male"] },
  { slug: "kashmir-tour-packages", names: ["kashmir", "srinagar", "gulmarg"] },
  { slug: "andaman-tour-packages", names: ["andaman", "port blair", "havelock"] },
];

const KNOWN = destinations.map((d) => ({ name: d.name, slug: d.slug }));

export function matchDestination(text: string): { name: string; slug: string } | null {
  const t = text.toLowerCase();
  for (const d of DEST_ALIASES) {
    if (d.names.some((n) => t.includes(n))) {
      const known = KNOWN.find((k) => k.slug === d.slug);
      const label = d.slug
        .replace(/-tour-packages?$/, "")
        .replace(/-/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
      return { name: known?.name || label, slug: d.slug };
    }
  }
  for (const k of KNOWN) {
    if (t.includes(k.name.toLowerCase())) return { name: k.name, slug: k.slug };
  }
  return null;
}

export function parseDays(text: string): number | null {
  const t = text.toLowerCase();
  if (/weekend/.test(t)) return 3;
  if (/\bweek\b/.test(t)) return 7;
  const m = t.match(/(\d+)\s*(day|night)/);
  if (m) return Math.min(14, Math.max(1, Number(m[1])));
  const n = t.match(/\b(\d{1,2})\b/);
  if (n) {
    const v = Number(n[1]);
    if (v >= 1 && v <= 14) return v;
  }
  return null;
}

export function parseBudget(text: string): number | null {
  const t = text.toLowerCase().replace(/,/g, "");
  let m = t.match(/(\d+(?:\.\d+)?)\s*(k|lakh|l)\b/);
  if (m) {
    const v = parseFloat(m[1]);
    return m[2].startsWith("l") ? Math.round(v * 100000) : Math.round(v * 1000);
  }
  m = t.match(/₹?\s*(\d{4,7})/);
  if (m) return Number(m[1]);
  if (/cheap|budget|low/.test(t)) return 15000;
  if (/mid|medium|moderate|average/.test(t)) return 30000;
  if (/luxury|premium|5 star/.test(t)) return 100000;
  return null;
}

export function parseTravellers(text: string): number | null {
  const t = text.toLowerCase();
  if (/honeymoon|couple|just married|2 of us|wife|husband/.test(t)) return 2;
  if (/solo|alone|just me|myself/.test(t)) return 1;
  if (/family/.test(t)) return 4;
  if (/friend|group|squad|gang|colleague/.test(t)) return 4;
  const m = t.match(/(\d+)\s*(people|person|traveller|adult|pax|member|friend)/);
  if (m) return Math.min(20, Math.max(1, Number(m[1])));
  const n = t.match(/\b([1-9]|1\d|20)\b/);
  if (n && /\b(traveller|adult|people|person|pax|member|friend|kid|child)/.test(t)) return Number(n[1]);
  return null;
}

const THEME_WORDS: Record<string, string[]> = {
  beach: ["beach", "sea", "island", "sand"],
  adventure: ["adventure", "trek", "raft", "paragliding", "safari", "snow"],
  honeymoon: ["honeymoon", "romantic", "couple"],
  family: ["family", "kids", "children"],
  pilgrimage: ["temple", "pilgrim", "yatra", "spiritual"],
  luxury: ["luxury", "premium", "5 star"],
};

export function detectThemes(text: string): string[] {
  const t = text.toLowerCase();
  return Object.keys(THEME_WORDS).filter((k) => THEME_WORDS[k].some((w) => t.includes(w)));
}

const AIRPORTS: Record<string, string> = {
  Goa: "GOI",
  Delhi: "DEL",
  Mumbai: "BOM",
  Jaipur: "JAI",
  Kochi: "COK",
  Kerala: "COK",
  Bengaluru: "BLR",
  Hyderabad: "HYD",
  Kolkata: "CCU",
  Chennai: "MAA",
  Dubai: "DXB",
  Singapore: "SIN",
  Bangkok: "BKK",
};

export function buildPlan(p: TripProfile): TripPlan {
  const dest = p.destination || "Goa";
  const days = p.days || 4;
  const budget = p.budget || 30000;
  const perDay = Math.round(budget / Math.max(1, days));

  // Match packages for the requested destination only
  const cleanDest = dest.trim().toLowerCase();
  const destPkgs = demoPackages.filter((x) => {
    const xDest = x.dest.toLowerCase();
    const xTitle = x.title.toLowerCase();
    return (
      xDest === cleanDest ||
      cleanDest.includes(xDest) ||
      xDest.includes(cleanDest) ||
      xTitle.includes(cleanDest) ||
      (p.destSlug && x.slug.includes(p.destSlug.replace(/-tour-packages?$/, "")))
    );
  });

  // Filter by theme only if at least one destination package matches that theme
  let pkgs = destPkgs;
  if (p.themes.length > 0 && destPkgs.length > 0) {
    const themed = destPkgs.filter((x) =>
      p.themes.some((t) => {
        const themeLower = t.toLowerCase();
        return (
          x.title.toLowerCase().includes(themeLower) ||
          (themeLower === "beach" && /beach|coast|sea|island/i.test(x.title + " " + x.route)) ||
          (themeLower === "adventure" && /adventure|raft|trek|safari|wildlife/i.test(x.title + " " + x.route)) ||
          (themeLower === "honeymoon" && /honeymoon|romantic/i.test(x.title)) ||
          (themeLower === "family" && /family|nature|escape|tour|break/i.test(x.title + " " + x.route))
        );
      })
    );
    if (themed.length > 0) {
      pkgs = themed;
    }
  }

  // Pick closest package for THIS destination within budget if available, otherwise closest price
  const withinBudget = pkgs.filter((x) => x.price <= budget * 1.5);
  const eligiblePkgs = withinBudget.length > 0 ? withinBudget : pkgs;

  const pkg = eligiblePkgs.length > 0
    ? [...eligiblePkgs].sort((a, b) => Math.abs(a.price - budget) - Math.abs(b.price - budget))[0]
    : null;

  const stay =
    discoverHotels.find((h) => h.city.toLowerCase() === dest.toLowerCase() && h.price <= perDay) ||
    discoverHotels.find((h) => h.city.toLowerCase() === dest.toLowerCase()) ||
    (() => {
      const budgetHotel = demoHotels
        .filter((h) =>
          h.city.toLowerCase() === dest.toLowerCase() ||
          dest.toLowerCase().includes(h.city.toLowerCase()) ||
          h.city.toLowerCase().includes(dest.toLowerCase().split(" ")[0])
        )
        .sort((a, b) => a.price - b.price)[0];
      if (budgetHotel) {
        return { ...budgetHotel, amenities: "", reviews: "", mrp: budgetHotel.price, off: "", freeCancel: false, image: "" } as any;
      }
      // Rajasthan fallback: Jaipur / Jaisalmer budget options live in demoHotels under nearby city names
      if (/rajasthan|jaipur|jaisalmer|udaipur|jodhpur/i.test(dest)) {
        const raj = [...demoHotels].sort((a, b) => a.price - b.price)[0];
        if (raj) return { ...raj, amenities: "", reviews: "", mrp: raj.price, off: "", freeCancel: false, image: "" } as any;
      }
      return null;
    })() ||
    null;

  const cities = pkg?.route ? pkg.route.split(/[·•]/).map((s) => s.trim()).filter(Boolean) : [dest];
  const planDays: PlanDay[] = Array.from({ length: days }).map((_, i) => {
    const city = cities[Math.min(i, cities.length - 1)];
    const titles = [
      `Arrive in ${city}. Settle in, easy evening stroll`,
      `Sightseeing around ${city}`,
      `Day trip & local experiences near ${city}`,
      `Leisure day in ${city}`,
      `Explore ${city} like a local`,
      `Adventure & highlights of ${city}`,
      `Last sights & sunset in ${city}`,
      `Pack up & departure from ${city}`,
    ];
    return {
      day: i + 1,
      title: i === days - 1 && days > 1 ? `Departure from ${city}` : titles[Math.min(i, titles.length - 2)],
      detail:
        i === 0
          ? `Check in${stay ? ` at ${stay.name}` : ""}, rest, and an easy evening nearby.`
          : `Full day mapped around ${city}, sights in the morning, free evening.`,
    };
  });

  const code = AIRPORTS[dest] || (pkg ? AIRPORTS[pkg.dest] : null) || null;
  const flightHref = code
    ? buildFlightSearchUrl({
        fromCity: p.origin,
        fromCode: AIRPORTS[p.origin] || "DEL",
        toCity: dest,
        toCode: code,
        depart: new Date(Date.now() + 21 * 864e5).toISOString().slice(0, 10),
        trip: "oneway",
        adults: Math.min(p.travellers, 9),
        children: 0,
        cabin: "Economy",
      })
    : null;

  const estimate = pkg
    ? Math.round((pkg.price / Math.max(1, pkg.days)) * days + (stay ? stay.price * Math.max(1, days - 1) : 0))
    : Math.round((stay ? stay.price * Math.max(1, days - 1) : 3200 * Math.max(1, days - 1)) + Math.min(budget, 3000 * days * p.travellers));

  return {
    title: `${days}-day ${dest} trip for ${p.travellers}`,
    summary: `Based on your answers: ${days} days in ${dest}, ${p.travellers} ${p.travellers === 1 ? "traveller" : "travellers"}${
      p.budget ? `, around ${inr(budget)}` : ""
    }${p.themes.length ? `, leaning ${p.themes.join(" + ")}` : ""}. ${
      pkg ? `Matched package: ${pkg.title} (${inr(pkg.price)}).` : `Custom curated itinerary for ${dest}.`
    }`,
    days: planDays,
    packageSlug: pkg?.slug || null,
    packageTitle: pkg?.title || null,
    packagePrice: pkg?.price || null,
    stay: stay
      ? { name: stay.name, city: stay.city, price: stay.price, href: `/hotels/details/${stay.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}` }
      : null,
    flightHref,
    flightNote: flightHref ? `${p.origin} → ${dest} live fares` : null,
    estimate,
  };
}

export interface Feasibility {
  feasible: boolean;
  minNeeded: number;
  cheapestPkg: number | null;
  backpackFloor: number;
  reason: string;
}

// Honest budget gate: never fake a plan below the floor. Uses real inventory
// (cheapest package for the destination + cheapest stay + transport/food floors).
export function checkFeasibility(p: TripProfile): Feasibility {
  const dest = p.destination || "Goa";
  const days = p.days || 4;
  const destPkgs = demoPackages.filter(
    (x) =>
      x.dest.toLowerCase() === dest.toLowerCase() ||
      x.title.toLowerCase().includes(dest.toLowerCase())
  );
  const cheapestPkg = destPkgs.length ? Math.min(...destPkgs.map((x) => x.price)) : null;

  const allStays = [
    ...discoverHotels.map((h) => ({ city: h.city, price: h.price })),
    ...demoHotels.map((h) => ({ city: h.city, price: h.price })),
  ];
  const destStays = allStays.filter(
    (h) =>
      h.city.toLowerCase() === dest.toLowerCase() ||
      dest.toLowerCase().includes(h.city.toLowerCase())
  );
  const stayPool = destStays.length ? destStays : allStays;
  const cheapestNight = stayPool.length ? Math.min(...stayPool.map((h) => h.price)) : 3000;

  // Rajasthan / desert circuits skew cheaper on stay but need transfers; keep one floor.
  const transportFloor = /dubai|europe|thailand|bali|singapore|maldives/i.test(dest) ? 15000 : 1500;
  const foodFloorPerDay = 900;
  const backpackFloor = transportFloor + cheapestNight * Math.max(1, days - 1) + foodFloorPerDay * days;
  const minNeeded = Math.min(
    cheapestPkg ?? backpackFloor,
    backpackFloor
  );

  const budget = p.budget ?? 0;
  if (!p.budget) {
    return { feasible: true, minNeeded, cheapestPkg, backpackFloor, reason: "" };
  }
  if (budget < backpackFloor * 0.85) {
    return {
      feasible: false,
      minNeeded: Math.round(backpackFloor / 500) * 500,
      cheapestPkg,
      backpackFloor,
      reason: `honest-budget-gap`,
    };
  }
  return { feasible: true, minNeeded, cheapestPkg, backpackFloor, reason: "" };
}

export function infeasibleMessage(p: TripProfile, f: Feasibility): { text: string; chips: string[] } {
  const dest = p.destination || "your destination";
  const days = p.days || 4;
  const have = p.budget ? inr(p.budget) : "your budget";
  const need = inr(f.minNeeded);
  const pkgLine = f.cheapestPkg
    ? ` The cheapest ${dest} package on this site alone is ${inr(f.cheapestPkg)}.`
    : "";
  return {
    text:
      `Honest check. ${have} cannot cover ${days} day(s) in ${dest} for ${p.travellers} ${p.travellers === 1 ? "traveller" : "travellers"}. A realistic minimum is about ${need}.${pkgLine}` +
      ` That covers a budget bus/train (~₹1.5k), the cheapest stay I can actually find, plus food and local travel. I won't fake an itinerary that falls apart on arrival.` +
      ` Tell me which way to fix it: raise the budget, cut days, or switch to a backpack-style bus trip?`,
    chips: [`Raise to ${inr(f.minNeeded)}`, `${Math.max(1, days - 2)} days instead`, "Backpack by bus", "Change destination"],
  };
}

export function nextQuestion(p: TripProfile): { text: string; chips?: string[] } | null {
  if (!p.destination)
    return {
      text: "Hey, I'm Mauji. Let's find you a trip. Tell me a place, a vibe like beach, or just say surprise me.",
      chips: ["Goa", "Manali", "Kerala", "Rajasthan", "Dubai", "Just chat"],
    };
  if (!p.days)
    return {
      text: `${p.destination}, lovely pick. Roughly how long do you want to be away? No need to be exact.`,
      chips: ["Weekend (3D)", "4 days", "A week", "Not sure"],
    };
  if (p.travellers === 2 && !p._askedTrav)
    return {
      text: "And who's coming along?",
      chips: ["Solo", "Couple", "Family", "Friends", "Not sure"],
    };
  if (!p.budget)
    return {
      text: "Last money question, I promise. Rough budget per person? A ballpark is fine.",
      chips: ["Budget", "Mid-range", "Luxury", "Not sure"],
    };
  if (p.themes.length === 0 && !p._askedTheme)
    return {
      text: "Final touch. What should the trip feel like?",
      chips: ["Beach", "Adventure", "Family", "Honeymoon", "Surprise me"],
    };
  return null;
}

export function step(
  p: TripProfile,
  input: string
): { profile: TripProfile; replies: ChatMsg[]; done: boolean; handoffToAgent?: boolean } {
  const replies: ChatMsg[] = [];
  const t = input.trim();
  if (!t) return { profile: p, replies, done: false };

  // Pending suggestion awaiting a yes or no. Never force, always confirm.
  // Pending suggestion. Only exact answers are handled here; any free typing
  // the rules cannot parse goes to the agent (handoffToAgent) instead of looping.
  if (p._suggest) {
    const s = p._suggest;
    const low = t.toLowerCase();
    const clear = () => ({ ...p, _suggest: undefined as never });
    const parseFor = (field: string, text: string): number | null =>
      field === "days" ? parseDays(text) : field === "budget" ? parseBudget(text) : parseTravellers(text);
    const applyValue = (v: number) => {
      const np = clear();
      if (s.field === "days") np.days = v;
      else if (s.field === "budget") np.budget = v;
      else {
        np.travellers = v;
        np._askedTrav = true;
      }
      return np;
    };
    if (isYes(low) || low === "sounds good") {
      p = applyValue(s.value);
    } else if (s.field === "days" && low === "shorter") {
      const v = Math.max(1, s.value - 2);
      p = { ...p, _suggest: { field: "days", value: v } };
      replies.push({ role: "ai", text: `Got it, shorter is better. How about ${v} day(s)?`, chips: ["Sounds good", "Longer"] });
      return { profile: p, replies, done: false };
    } else if (s.field === "days" && low === "longer") {
      const v = Math.min(14, s.value + 2);
      p = { ...p, _suggest: { field: "days", value: v } };
      replies.push({ role: "ai", text: `More time to soak it in. ${v} days?`, chips: ["Sounds good", "Shorter"] });
      return { profile: p, replies, done: false };
    } else if (s.field === "budget" && low === "cheaper") {
      p = { ...p, _suggest: { field: "budget", value: 15000 } };
      replies.push({ role: "ai", text: "Budget mode, noted. Shall I plan around ₹15,000 per person?", chips: ["Sounds good", "Luxury"] });
      return { profile: p, replies, done: false };
    } else if (s.field === "budget" && low === "luxury") {
      p = { ...p, _suggest: { field: "budget", value: 100000 } };
      replies.push({ role: "ai", text: "The good life. Around ₹1,00,000 per person?", chips: ["Sounds good", "Cheaper"] });
      return { profile: p, replies, done: false };
    } else if (isNo(low) || low === "i'll type it") {
      p = clear();
      replies.push({ role: "ai", text: "No worries at all. Tell me in your own words.", chips: nextQuestion(p)?.chips });
      return { profile: p, replies, done: false };
    } else {
      const v = parseFor(s.field, t);
      if (v) {
        p = applyValue(v);
      } else {
        // Human typing the rules cannot parse. Hand to the agent, never loop.
        return { profile: p, replies, done: false, handoffToAgent: true };
      }
    }
  }

  if (!p.destination) {
    const vibe = matchVibe(t);
    if (vibe && !matchDestination(t)) {
      p = { ...p, destination: vibe.name, destSlug: vibe.slug };
    } else {
      const m = matchDestination(t);
      if (!m) {
        if (isUncertain(t)) {
          return {
            profile: p,
            done: false,
            replies: [
              {
                role: "ai",
                text: "Love that. Let's discover it together. What kind of feeling are you craving?",
                chips: ["Beach", "Mountains", "Desert", "Abroad", "Surprise me"],
              },
            ],
          };
        }
        // Free human typing ("somewhere quiet", typos). Agent handles it.
        return { profile: p, replies, done: false, handoffToAgent: true };
      }
      p = { ...p, destination: m.name, destSlug: m.slug };
    }
  } else if (!p.days) {
    const d = parseDays(t);
    if (d) {
      p = { ...p, days: d };
    } else if (t.trim().toLowerCase() === "not sure") {
      // Tapped chip. Instant sweet-spot suggestion, confirmed, never a loop.
      const n = defaultsFor(p).days;
      p = { ...p, _suggest: { field: "days", value: n } };
      return {
        profile: p,
        done: false,
        replies: [
          {
            role: "ai",
            text: `No stress. For ${p.destination}, ${n} days is the sweet spot. Enough to see it properly without it dragging. Shall I lock that in?`,
            chips: ["Sounds good", "Shorter", "Longer"],
          },
        ],
      };
    } else {
      // Human typing the rules cannot parse. Agent takes it from here.
      return { profile: p, replies, done: false, handoffToAgent: true };
    }
  } else if (!p._askedTrav) {
    const n = parseTravellers(t);
    if (n) {
      p = { ...p, travellers: n, _askedTrav: true };
    } else if (t.trim().toLowerCase() === "not sure" && !p._nudgedTrav) {
      p = { ...p, _nudgedTrav: true };
      return {
        profile: p,
        done: false,
        replies: [
          {
            role: "ai",
            text: "Fair enough. Is this a solo escape, a couple trip, or are family or friends joining?",
            chips: ["Solo", "Couple", "Family", "Friends"],
          },
        ],
      };
    } else {
      return { profile: p, replies, done: false, handoffToAgent: true };
    }
  } else if (!p.budget) {
    const b = parseBudget(t);
    if (b) {
      p = { ...p, budget: b };
    } else if (t.trim().toLowerCase() === "not sure") {
      const y = defaultsFor(p).budget;
      p = { ...p, _suggest: { field: "budget", value: y } };
      return {
        profile: p,
        done: false,
        replies: [
          {
            role: "ai",
            text: `Totally fine. For ${p.days} day(s) in ${p.destination}, most people spend around ${inr(y)} per person. Shall I go with that?`,
            chips: ["Sounds good", "Cheaper", "Luxury"],
          },
        ],
      };
    } else {
      return { profile: p, replies, done: false, handoffToAgent: true };
    }
  } else if (!p._askedTheme) {
    const th = detectThemes(t);
    if (th.length) {
      p = { ...p, themes: th, _askedTheme: true };
    } else {
      // Anything vague or unrecognised ("chill", "idk", "fun") → destination-flavoured default, stated openly.
      const d = defaultsFor(p).themes;
      p = { ...p, themes: d, _askedTheme: true };
      if (!isUncertain(t) && !/surprise/i.test(t)) {
        // Note the interpretation openly, then flow straight into plan building below.
        replies.push({ role: "ai", text: `"${t}". I like it. I will lean ${d.join(" and ")} for ${p.destination}. Say the word anytime to change it.` });
      }
    }
  }

  const q = nextQuestion(p);
  if (!q) {
    if (/change destination/i.test(t)) {
      const np = { ...p, destination: null, destSlug: null, themes: [], _askedTheme: false };
      const nq = nextQuestion(np);
      replies.push({ role: "ai", text: "No problem. Where should we go instead?", chips: nq?.chips });
      return { profile: np, replies, done: false };
    }
    // A question, not an adjustment ("is 30k enough?"). Numbers inside questions
    // must not reset slots. Let the agent answer.
    if (/\?\s*$/.test(t) && !/raise|increase|backpack|change destination/i.test(t)) {
      return { profile: p, replies, done: false, handoffToAgent: true };
    }
    // Post-plan tweaks ("under 20k", "5 days", "Goa", "3 of us"): apply every
    // slot the message carries, then rebuild. Never silently repeat the old plan.
    let tweaked = false;
    const destM = matchDestination(t);
    if (destM && destM.name.toLowerCase() !== (p.destination || "").toLowerCase()) {
      p = {
        ...blankProfile(),
        destination: destM.name,
        destSlug: destM.slug,
        days: p.days,
        travellers: p.travellers,
        budget: p.budget,
        origin: p.origin,
        _askedTrav: true,
        _askedTheme: false,
        themes: [],
      };
      tweaked = true;
    }
    const dayM = parseDays(t);
    if (dayM && dayM !== p.days) {
      p = { ...p, days: dayM };
      tweaked = true;
    }
    const travM = parseTravellers(t);
    if (travM && travM !== p.travellers) {
      p = { ...p, travellers: travM, _askedTrav: true };
      tweaked = true;
    }
    const budM = parseBudget(t);
    if (budM && budM !== p.budget) {
      p = { ...p, budget: budM };
      tweaked = true;
    }
    const themeM = detectThemes(t);
    if (themeM.length && themeM.join() !== [...p.themes].sort().join()) {
      p = { ...p, themes: themeM, _askedTheme: true };
      tweaked = true;
    }
    if (tweaked && (!p.destination || !p.days)) {
      // Tweaks left a slot empty (should not happen). Ask for it plainly.
      const nq = nextQuestion(p);
      if (nq) {
        replies.push({ role: "ai", text: `Got it, updating. ${nq.text}`, chips: nq.chips });
        return { profile: p, replies, done: false };
      }
    }
    if (tweaked && p.themes.length === 0 && !p._askedTheme) {
      // Destination changed: re-ask the feel question once.
      const nq = nextQuestion({ ...p });
      if (nq) {
        replies.push({ role: "ai", text: `Switched to ${p.destination}. ${nq.text}`, chips: nq.chips });
        return { profile: p, replies, done: false };
      }
    }
    if (/backpack/i.test(t)) {
      const f0 = checkFeasibility(p);
      replies.push({
        role: "ai",
        text: `Backpack math for ${p.destination} (${p.days} day(s)). Bus or train about ₹1,500, cheapest stay I can find about ${inr(f0.backpackFloor - 1500 - 900 * (p.days || 4))}, food and local travel about ${inr(900 * (p.days || 4))}. Minimum about ${inr(f0.backpackFloor)}. Your ${p.budget ? inr(p.budget) : "budget"} is still short. Want me to cut to ${Math.max(1, (p.days || 4) - 1)} day or raise to ${inr(f0.minNeeded)}?`,
        chips: [`Raise to ${inr(f0.minNeeded)}`, `${Math.max(1, (p.days || 2) - 1)} day instead`, "Change destination"],
      });
      return { profile: { ...p, _askedTrav: true, _askedTheme: true }, replies, done: false };
    }
    // Budget recovery intents: user picked a fix chip after an infeasible verdict.
    const raiseM = t.replace(/,/g, "").match(/(?:raise|increase|budget|to)\s*(?:to\s*)?₹?\s*(\d+(?:\.\d+)?)\s*(k|lakh|l)?/i);
    if (raiseM && p.budget) {
      const v = parseFloat(raiseM[1]);
      const mult = raiseM[2] ? (raiseM[2].toLowerCase().startsWith("l") ? 100000 : 1000) : 1;
      const nb = Math.round(v * mult);
      if (nb > p.budget) {
        p = { ...p, budget: nb };
      }
    }
    const fewerM = t.match(/(\d+)\s*days?\s*instead/i);
    if (fewerM) {
      const nd = Math.min(14, Math.max(1, Number(fewerM[1])));
      p = { ...p, days: nd };
    }
    const f = checkFeasibility(p);
    if (!f.feasible) {
      const msg = infeasibleMessage(p, f);
      replies.push({ role: "ai", text: msg.text, chips: msg.chips });
      // Stay open for a fix. Never emit a fake plan card.
      return { profile: { ...p, _askedTrav: true, _askedTheme: true }, replies, done: false };
    }
    const plan = buildPlan(p);
    const plural = (n: number) => (n === 1 ? "traveller" : "travellers");
    replies.push({
      role: "ai",
      text: `Done. ${plan.title}${p.budget ? `, working budget about ${inr(p.budget)} per person` : ""}. ${plan.packageTitle ? `Matched real package: ${plan.packageTitle} (${plan.packagePrice ? inr(plan.packagePrice) : "price on page"}). ` : `Custom curated itinerary for ${plan.title}. `}Stay: ${plan.stay ? `${plan.stay.name} (${inr(plan.stay.price)} a night)` : "budget pickup below"}. Estimate ${inr(plan.estimate)} total for ${p.travellers} ${plural(p.travellers)}. I am refining the day details with AI now. Tweak anything by typing, like 5 days or budget 40k.`,
      plan,
    });
    return { profile: { ...p, _askedTrav: true, _askedTheme: true }, replies, done: true };
  }
  replies.push({ role: "ai", text: q.text, chips: q.chips });
  return { profile: p, replies, done: false };
}
