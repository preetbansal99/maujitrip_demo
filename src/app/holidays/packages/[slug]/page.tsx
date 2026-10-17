"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BedDouble,
  Car,
  Check,
  ChevronDown,
  Hotel,
  MapPin,
  Minus,
  Plane,
  Plus,
  ShieldCheck,
  UtensilsCrossed,
  X,
} from "lucide-react";
import SiteChrome from "@/components/SiteChrome";
import { demoPackages, inr } from "@/data/demo";

interface Pkg {
  title: string;
  subtitle: string;
  destination: { name: string; slug: string; country: string; state: string };
  category: { name: string; slug: string };
  nights: number;
  days: number;
  duration_label: string;
  cities: string[];
  short_description: string;
  base_price: number;
  mrp_price: number | null;
  discount_percent: number | null;
  image: string | null;
  description: string;
  inclusions: string;
  exclusions: string;
  cancellation_policy: string;
  payment_policy: string;
  terms_conditions: string | null;
  hotel_category: string;
  meal_plan: string;
  min_pax: number;
  max_pax: number;
  itinerary: any[];
  departures: any[];
}

const TABS = [
  "Overview",
  "Price Calendar",
  "Inclusions & Exclusions",
  "Booking Procedure",
  "Payment Structure & Bank details",
  "Documentation",
  "Cancellation Policy & Charges",
  "Refund policy",
  "Terms & Conditions",
];

function lines(t: string) {
  return (t || "").split("\n").map((s) => s.trim()).filter(Boolean);
}

function BookingCard({ pkg }: { pkg: Pkg }) {
  const [depIdx, setDepIdx] = useState(0);
  const [guests, setGuests] = useState(Math.max(2, pkg.min_pax || 2));
  const deps = pkg.departures || [];
  const price = deps[depIdx]?.price || pkg.base_price;
  const mrp = pkg.mrp_price || Math.round(price * 1.28);
  const off = Math.round((1 - price / mrp) * 100);
  const total = Math.round(price * guests * 1.05);

  const fmtRange = (d: any) => {
    if (!d?.departure_date) return "";
    const f = (s: string) =>
      new Date(s.slice(0, 10) + "T00:00:00").toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    return `${f(d.departure_date)} – ${f(d.return_date || d.departure_date)}`;
  };

  return (
    <div className="mb-5">
      <div className="bg-white border border-gray-200 rounded-2xl shadow-lg overflow-visible">
        <div className="px-5 pt-4 pb-3 border-b border-gray-100">
          <h2 className="text-[15px] font-extrabold text-gray-900 leading-snug mb-3">
            Package Summary
          </h2>
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="text-[10px] text-gray-400">From</span>
            <span className="text-[22px] font-black text-gray-900 leading-none">{inr(price)}</span>
            <span className="text-[12px] text-gray-400 line-through">{inr(mrp)}</span>
            <span className="text-[11px] text-gray-700">/person</span>
            <span className="ml-auto text-[10px] font-semibold text-green-600 bg-green-50 border border-green-200 px-1.5 py-0.5 rounded-md">
              +Taxes &amp; fees
            </span>
          </div>
          <p className="text-[11px] text-gray-500 mt-1.5">
            ≈ {inr(price * guests)} for {guests} guests
          </p>
        </div>
        <div className="px-5 py-4 space-y-4">
          {off > 0 && (
            <div className="flex items-center gap-1.5 bg-green-50 border border-green-200 rounded-xl px-3 py-2">
              <ZapTag />
              <p className="text-[11px] text-green-700 font-medium">
                {off}% off — you save {inr(mrp - price)} per person
              </p>
            </div>
          )}
          <div className="flex items-center justify-between">
            {[
              { icon: <Hotel size={16} style={{ color: "rgb(0, 59, 83)" }} />, label: "Hotel" },
              { icon: <Car size={16} style={{ color: "rgb(0, 59, 83)" }} />, label: "Transfers" },
              { icon: <UtensilsCrossed size={16} style={{ color: "rgb(0, 59, 83)" }} />, label: "Meal" },
              { icon: <Plane size={16} style={{ color: "rgb(0, 59, 83)" }} />, label: "Sightseeing" },
            ].map((x) => (
              <div key={x.label} className="flex flex-col items-center gap-1.5 flex-1">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "rgba(0, 59, 83, 0.063)" }}
                >
                  {x.icon}
                </div>
                <span className="text-[10px] font-semibold text-gray-600">{x.label}</span>
              </div>
            ))}
          </div>
          <div>
            <p className="text-[12.5px] font-bold text-gray-900 mb-2">Select departure date</p>
            <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
              {deps.length > 0 ? (
                deps.map((d: any, i: number) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setDepIdx(i)}
                    className={`w-full text-left rounded-xl border px-3 py-2 transition-colors ${
                      depIdx === i
                        ? "border-[#023341] bg-teal-50/50"
                        : "border-gray-200 hover:border-gray-300 bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11.5px] font-bold text-gray-900">{fmtRange(d)}</span>
                      <span className="text-[11.5px] font-extrabold text-gray-900">
                        {inr(d.price || price)}
                      </span>
                    </div>
                    <p className="text-[10px] mt-0.5 text-gray-500">
                      {d.seats_left || d.seats || 16} seats left
                    </p>
                  </button>
                ))
              ) : (
                <p className="text-[11px] text-gray-500">Daily departures available on request.</p>
              )}
            </div>
          </div>
          <div>
            <p className="text-[12.5px] font-bold text-gray-900 mb-2">Guests</p>
            <div className="flex items-center justify-between rounded-xl border border-gray-200 px-3 py-2">
              <span className="text-[12px] font-semibold text-gray-700">{guests} guests</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Fewer guests"
                  onClick={() => setGuests((g) => Math.max(pkg.min_pax || 1, g - 1))}
                  className="rounded-full border border-gray-200 p-1.5 hover:border-[#023341]"
                >
                  <Minus size={12} />
                </button>
                <button
                  type="button"
                  aria-label="More guests"
                  onClick={() => setGuests((g) => Math.min(pkg.max_pax || 20, g + 1))}
                  className="rounded-full border border-gray-200 p-1.5 hover:border-[#023341]"
                >
                  <Plus size={12} />
                </button>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => window.dispatchEvent(new CustomEvent("maujitrip:open-callback"))}
            className="w-full rounded-xl bg-[#023341] py-3 text-sm font-bold text-white hover:bg-[#034a5c] transition-colors"
          >
            Get a Quote
          </button>
          <p className="flex items-center justify-center gap-1.5 text-[11px] text-gray-500">
            <ShieldCheck size={13} className="text-green-600" />
            Secure Booking Guarantee
          </p>
        </div>
      </div>
    </div>
  );
}

function ZapTag() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-tag text-green-600 shrink-0">
      <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z" />
      <circle cx="7.5" cy="7.5" r=".5" fill="currentColor" />
    </svg>
  );
}

function Itinerary({ days }: { days: any[] }) {
  const [open, setOpen] = useState<number[]>([0]);
  const [expandAll, setExpandAll] = useState(false);
  const toggle = (i: number) =>
    setOpen((o) => (o.includes(i) ? o.filter((x) => x !== i) : [...o, i]));
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-extrabold text-gray-900 tracking-wide">ITINERARY</h3>
        <button
          type="button"
          onClick={() => {
            if (expandAll) setOpen([]);
            else setOpen(days.map((_, i) => i));
            setExpandAll((v) => !v);
          }}
          className="text-[11px] font-bold text-[#023341] hover:underline"
        >
          {expandAll ? "Collapse all" : "Expand all"}
        </button>
      </div>
      <div className="space-y-3">
        {days.map((d: any, i: number) => {
          const isOpen = open.includes(i);
          return (
            <div key={i} className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={`itinerary-day-${i + 1}`}
                onClick={() => toggle(i)}
                className="w-full flex items-center gap-2.5 px-4 py-3 text-left hover:bg-gray-50"
              >
                <span className="shrink-0 text-[10px] font-extrabold text-white bg-orange-500 rounded-md px-2 py-1">
                  DAY {d.day_number || i + 1}
                </span>
                <span className="flex-1 min-w-0 text-[13.5px] font-bold text-gray-900">
                  {d.title}
                  {d.city && (
                    <span className="ml-1.5 inline-flex items-center gap-0.5 text-[11.5px] font-medium text-gray-500">
                      <MapPin size={11} /> {d.city}
                    </span>
                  )}
                </span>
                <ChevronDown
                  size={16}
                  className={`shrink-0 text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
              </button>
              {isOpen && (
                <div id={`itinerary-day-${i + 1}`} className="px-4 pb-4 border-t border-gray-100">
                  {d.description && (
                    <p className="pt-3 text-[12.5px] text-gray-600 leading-relaxed whitespace-pre-line">
                      {d.description}
                    </p>
                  )}
                  {Array.isArray(d.activities) && d.activities.length > 0 && (
                    <div className="pt-3">
                      <ul className="space-y-1.5">
                        {d.activities.map((a: any, j: number) => (
                          <li key={j} className="flex items-start gap-2 text-[12.5px] text-gray-700 leading-snug">
                            <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-gray-400 mt-[7px]" />
                            {typeof a === "string" ? a : a.title || a.activity || ""}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div className="flex flex-wrap items-center gap-2 mt-3">
                    {d.hotel_name && (
                      <span className="text-[11px] font-semibold text-gray-700 bg-gray-100 rounded-lg px-2.5 py-1">
                        <BedDouble size={11} className="inline mr-1" />
                        {d.hotel_name}
                      </span>
                    )}
                    {(d.meals_label || d.meals) && (
                      <span className="text-[11px] font-semibold text-gray-700 bg-gray-100 rounded-lg px-2.5 py-1">
                        {d.meals_label || d.meals}
                      </span>
                    )}
                    <span className="text-[11px] font-semibold text-gray-700 bg-gray-100 rounded-lg px-2.5 py-1">
                      Overnight stay
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TabContent({ tab, pkg }: { tab: string; pkg: Pkg }) {
  if (tab === "Overview") {
    return (
      <div>
        <div
          className="text-[13px] text-gray-600 leading-relaxed [&_p]:mb-3"
          dangerouslySetInnerHTML={{ __html: pkg.description || "" }}
        />
        <div className="mt-6">
          <Itinerary days={pkg.itinerary || []} />
        </div>
      </div>
    );
  }
  if (tab === "Price Calendar") {
    const deps = pkg.departures || [];
    return (
      <div className="space-y-2">
        {deps.length === 0 && (
          <p className="text-[13px] text-gray-600">Daily departures available on request.</p>
        )}
        {deps.map((d: any, i: number) => (
          <div key={i} className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 py-3">
            <span className="text-[12px] font-bold text-gray-900">
              {d.departure_date} – {d.return_date}
            </span>
            <span className="text-[12px] font-extrabold text-gray-900">{inr(d.price || pkg.base_price)}</span>
            <span className="text-[11px] text-gray-500">{d.seats_left || d.seats || ""} seats left</span>
          </div>
        ))}
      </div>
    );
  }
  if (tab === "Inclusions & Exclusions") {
    return (
      <div className="grid md:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-4">
          <h4 className="text-[13px] font-extrabold text-gray-900 mb-2">Inclusions</h4>
          <ul className="space-y-1.5">
            {lines(pkg.inclusions).map((l, i) => (
              <li key={i} className="flex items-start gap-2 text-[12.5px] text-gray-700">
                <Check size={13} className="text-green-600 shrink-0 mt-0.5" />
                {l}
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-gray-200 bg-white p-4">
          <h4 className="text-[13px] font-extrabold text-gray-900 mb-2">Exclusions</h4>
          <ul className="space-y-1.5">
            {lines(pkg.exclusions).map((l, i) => (
              <li key={i} className="flex items-start gap-2 text-[12.5px] text-gray-700">
                <X size={13} className="text-red-400 shrink-0 mt-0.5" />
                {l}
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
  if (tab === "Cancellation Policy & Charges") {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-4">
        <ul className="space-y-1.5">
          {lines(pkg.cancellation_policy).map((l, i) => (
            <li key={i} className="text-[12.5px] text-gray-700 leading-relaxed">· {l}</li>
          ))}
        </ul>
      </div>
    );
  }
  if (tab === "Terms & Conditions") {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-4">
        {pkg.terms_conditions ? (
          <ul className="space-y-1.5">
            {lines(pkg.terms_conditions).map((l, i) => (
              <li key={i} className="text-[12.5px] text-gray-700 leading-relaxed">· {l}</li>
            ))}
          </ul>
        ) : (
          <p className="text-[12.5px] text-gray-600 leading-relaxed">
            Standard tour terms apply. Package prices are per person on twin sharing unless
            stated otherwise. Schedules may change due to weather, permits, or operational
            requirements.
          </p>
        )}
      </div>
    );
  }
  const generic: Record<string, string> = {
    "Booking Procedure": "Choose your package and departure date, share traveller details, and confirm with an advance payment. Our team verifies availability within 24 hours and shares vouchers for hotels, transfers, and sightseeing.",
    "Payment Structure & Bank details": pkg.payment_policy || "30% advance to confirm. Balance due 15 days before the travel date. Bank details are shared on the booking confirmation.",
    Documentation: "Carry a valid government photo ID for all travellers. For international packages, passports must be valid for 6+ months with applicable visas arranged before departure.",
    "Refund policy": "Approved refunds are processed to the original payment method in 5–7 working days after deducting applicable cancellation charges.",
  };
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4">
      <p className="text-[12.5px] text-gray-600 leading-relaxed">{generic[tab] || ""}</p>
    </div>
  );
}

function PackageBody({ slug }: { slug: string }) {
  const [pkg, setPkg] = useState<Pkg | null>(null);
  const [tab, setTab] = useState(TABS[0]);
  const [guests, setGuests] = useState(2);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const r = await fetch(`/api/live/holidays/packages/${slug}`).then((x) => x.json());
        if (!cancelled && r?.data) {
          setPkg(r.data);
          setGuests(Math.max(2, r.data.min_pax || 2));
          return;
        }
      } catch {
        /* fall through to demo fallback */
      }
      if (!cancelled) {
        const demo = demoPackages.find((p) => p.slug === slug);
        if (demo) {
          setPkg({
            title: demo.title,
            subtitle: "",
            destination: { name: "", slug: "", country: "India", state: "" },
            category: { name: "", slug: "" },
            nights: demo.nights,
            days: demo.days,
            duration_label: `${demo.nights}N / ${demo.days}D`,
            cities: demo.route.split(/[·•]/).map((s) => s.trim()).filter(Boolean),
            short_description: "",
            base_price: demo.price,
            mrp_price: demo.mrp,
            discount_percent: null,
            image: demo.image,
            description: "",
            inclusions: "",
            exclusions: "",
            cancellation_policy: "",
            payment_policy: "",
            terms_conditions: null,
            hotel_category: "",
            meal_plan: "",
            min_pax: 2,
            max_pax: 20,
            itinerary: [],
            departures: [],
          });
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const total = useMemo(
    () => (pkg ? Math.round(pkg.base_price * guests * 1.05) : 0),
    [pkg, guests]
  );

  if (!pkg) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-gray-500">Loading package…</p>
      </div>
    );
  }

  const heroImg =
    pkg.image && pkg.image.startsWith("http")
      ? pkg.image
      : "/images/packages/manali-hero.jpg";

  return (
    <div className="min-h-screen pb-20 md:pb-0 bg-[#efeeeb]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-gray-500 mb-4">
          <a href="/" className="hover:text-[#023341]">Home</a>
          <span>/</span>
          <a href="/holidays" className="hover:text-[#023341]">Holidays</a>
          <span>/</span>
          <span className="text-gray-800 font-medium">{pkg.destination?.name || "Package"}</span>
        </nav>

        <div className="relative rounded-3xl overflow-hidden h-56 md:h-80">
          <img alt={pkg.title} className="w-full h-full object-cover" src={heroImg} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>

        <div className="mt-4 flex flex-col lg:flex-row gap-6 items-start">
          <div className="flex-1 min-w-0 w-full">
            {pkg.category?.name && (
              <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#f74800]">
                {pkg.category.name}
              </p>
            )}
            <h1 className="mt-1 font-display text-2xl md:text-3xl font-bold text-[#003b53]">
              {pkg.title}
            </h1>
            {pkg.subtitle && <p className="mt-1 text-sm text-gray-600">{pkg.subtitle}</p>}
            <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-semibold text-gray-700">
              <span className="rounded-full bg-white border border-gray-200 px-3 py-1">
                {pkg.duration_label}
              </span>
              {pkg.hotel_category && (
                <span className="rounded-full bg-white border border-gray-200 px-3 py-1">
                  {pkg.hotel_category} Hotel
                </span>
              )}
              {pkg.meal_plan && pkg.meal_plan !== "MAP" && (
                <span className="rounded-full bg-white border border-gray-200 px-3 py-1">
                  {pkg.meal_plan}
                </span>
              )}
              {pkg.meal_plan === "MAP" && (
                <span className="rounded-full bg-white border border-gray-200 px-3 py-1">
                  Breakfast + Dinner
                </span>
              )}
              <span className="rounded-full bg-white border border-gray-200 px-3 py-1">
                {pkg.min_pax}–{pkg.max_pax} travellers
              </span>
            </div>
            {pkg.cities?.length > 0 && (
              <p className="mt-3 text-[13px] text-gray-700">
                <span className="font-semibold">Route:</span> {pkg.cities.join(" → ")}
              </p>
            )}

            <div className="mt-6 flex flex-col md:flex-row gap-6 items-start">
              <aside className="md:w-64 shrink-0 w-full">
                <nav className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden md:sticky md:top-20">
                  <ul
                    className="flex md:flex-col overflow-x-auto md:overflow-visible divide-y divide-gray-100 md:divide-y"
                    style={{ scrollbarWidth: "none" }}
                  >
                    {TABS.map((t) => (
                      <li key={t} className="shrink-0 md:shrink">
                        <button
                          type="button"
                          onClick={() => setTab(t)}
                          className={`w-full text-left whitespace-nowrap md:whitespace-normal px-4 py-3 text-[13px] font-semibold transition-colors border-l-[3px] ${
                            tab === t
                              ? "text-white md:border-l-[3px]"
                              : "text-gray-600 hover:bg-gray-50 border-transparent"
                          }`}
                          style={
                            tab === t
                              ? { backgroundColor: "rgb(0, 59, 83)", borderLeftColor: "rgb(0, 59, 83)" }
                              : undefined
                          }
                        >
                          {t}
                        </button>
                      </li>
                    ))}
                  </ul>
                </nav>
              </aside>
              <div className="flex-1 min-w-0 w-full">
                <TabContent tab={tab} pkg={pkg} />
              </div>
            </div>
          </div>

          <div className="w-full lg:w-[340px] shrink-0 lg:sticky lg:top-24">
            <BookingCard pkg={pkg} />
          </div>
        </div>
      </div>

      <div className="md:hidden fixed bottom-16 left-0 right-0 z-40 bg-white border-t border-gray-200 px-4 py-2.5 flex items-center justify-between">
        <p className="text-[11px] text-gray-500">
          {guests} adult{guests > 1 ? "s" : ""} ·{" "}
          <span className="text-sm font-extrabold text-gray-900">{inr(total)}</span> total incl. GST
        </p>
        <button
          type="button"
          onClick={() => window.dispatchEvent(new CustomEvent("maujitrip:open-callback"))}
          className="rounded-full bg-[#023341] px-5 py-2 text-xs font-bold text-white"
        >
          Review & get quote
        </button>
      </div>
    </div>
  );
}

export default function PackagePage({ params }: { params: Promise<{ slug: string }> }) {
  const [slug, setSlug] = useState<string | null>(null);
  useEffect(() => {
    params.then((p) => setSlug(p.slug));
  }, [params]);

  return (
    <SiteChrome active="holidays">
      {slug ? (
        <PackageBody slug={slug} />
      ) : (
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-sm text-gray-500">Loading package…</p>
        </div>
      )}
    </SiteChrome>
  );
}
