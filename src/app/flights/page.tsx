"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  ArrowUpDown,
  CalendarDays,
  ChevronRight,
  Minus,
  Plane,
  Plus,
  Users,
} from "lucide-react";
import SiteChrome from "@/components/SiteChrome";
import Hero from "@/components/Hero";
import TopRoutes from "@/components/TopRoutes";
import PageFaq from "@/components/PageFaq";
import { flightFaqs, flightOffers } from "@/data/demo";
import { buildFlightSearchUrl, type FlightSearchParams } from "@/lib/searchUrl";

const CITIES = [
  { city: "Delhi", code: "DEL", airport: "Indira Gandhi Intl Airport" },
  { city: "Mumbai", code: "BOM", airport: "Chhatrapati Shivaji Airport" },
  { city: "Bengaluru", code: "BLR", airport: "Kempegowda Intl Airport" },
  { city: "Chennai", code: "MAA", airport: "Chennai Intl Airport" },
  { city: "Hyderabad", code: "HYD", airport: "Rajiv Gandhi Intl Airport" },
  { city: "Kolkata", code: "CCU", airport: "Netaji Subhash Chandra Airport" },
  { city: "Goa", code: "GOI", airport: "Dabolim Airport" },
  { city: "Dubai", code: "DXB", airport: "Dubai Intl Airport" },
  { city: "Pune", code: "PNQ", airport: "Pune Airport" },
  { city: "Kochi", code: "COK", airport: "Cochin International Airport" },
  { city: "Lucknow", code: "LKO", airport: "Chaudhary Charan Singh Airport" },
  { city: "Ahmedabad", code: "AMD", airport: "Sardar Vallabhbhai Patel Airport" },
  { city: "Jaipur", code: "JAI", airport: "Jaipur International Airport" },
  { city: "Singapore", code: "SIN", airport: "Changi Airport" },
  { city: "Bangkok", code: "BKK", airport: "Suvarnabhumi Airport" },
  { city: "London", code: "LHR", airport: "Heathrow Airport" },
  { city: "Paris", code: "CDG", airport: "Charles de Gaulle Airport" },
  { city: "Colombo", code: "CMB", airport: "Bandaranaike International Airport" },
  { city: "Kathmandu", code: "KTM", airport: "Tribhuvan International Airport" },
];

type City = (typeof CITIES)[number];

function fmtD(d: Date) {
  return {
    main: d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
    sub: d.toLocaleDateString("en-GB", { weekday: "long" }),
  };
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="rounded-xl flex items-center justify-center shrink-0 w-9 h-9"
      style={{ background: "rgba(0, 59, 83, 0.07)" }}
    >
      {children}
    </div>
  );
}

const teal = { color: "rgb(0, 59, 83)" };

export function FlightsMobileHero({
  onSearch,
  initFrom,
  initTo,
}: {
  onSearch: (p: FlightSearchParams) => void;
  initFrom?: string;
  initTo?: string;
}) {
  const [mode, setMode] = useState<"oneway" | "roundtrip">("oneway");
  const [fare, setFare] = useState("Regular");
  const [from, setFrom] = useState<City>(
    CITIES.find((c) => c.code === initFrom) || CITIES[0]
  );
  const [to, setTo] = useState<City>(CITIES.find((c) => c.code === initTo) || CITIES[1]);
  const [depart, setDepart] = useState<Date | null>(null);
  const [ret, setRet] = useState<Date | null>(null);
  const [sheet, setSheet] = useState<null | "from" | "to" | "trav">(null);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [cabin, setCabin] = useState("Economy");
  const dateRef = useRef<HTMLInputElement>(null);
  const retRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    setDepart(d);
  }, []);

  const dep = depart ? fmtD(depart) : { main: "Select date", sub: "" };
  const pick = (c: City) => {
    if (sheet === "from") setFrom(c);
    else if (sheet === "to") setTo(c);
    setSheet(null);
  };

  return (
    <section aria-label="Search flights" className="lg:hidden w-full px-4 pt-20 pb-10">
      <div className="flex gap-2 mb-3">
        {(["oneway", "roundtrip"] as const).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
              mode === m
                ? "text-white border-transparent shadow-sm"
                : "bg-white/80 text-gray-600 border-gray-200"
            }`}
            style={mode === m ? { background: "rgb(0, 59, 83)" } : undefined}
          >
            {m === "oneway" ? "One Way" : "Round Trip"}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
        <div className="divide-y divide-gray-100">
          <button
            type="button"
            onClick={() => setSheet("from")}
            className="w-full flex items-center text-left transition-colors hover:bg-gray-50 active:bg-gray-100 gap-3 px-4 py-3.5"
          >
            <Chip>
              <Plane size={16} style={teal} />
            </Chip>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide leading-none mb-1">
                From
              </p>
              <p className="text-[14px] font-bold leading-tight break-words text-gray-900" title={`${from.city} (${from.code})`}>
                {from.city} ({from.code})
              </p>
              <p className="text-[11px] text-gray-500 leading-snug mt-0.5 truncate">{from.airport}</p>
            </div>
            <ChevronRight size={14} className="ml-auto text-gray-300 shrink-0" />
          </button>
          <div className="relative">
            <button
              type="button"
              aria-label="Swap origin and destination"
              onClick={() => {
                setFrom(to);
                setTo(from);
              }}
              className="absolute right-4 -top-3.5 z-10 w-7 h-7 rounded-full border border-gray-200 bg-white flex items-center justify-center shadow-sm transition-transform active:scale-90"
            >
              <ArrowUpDown size={13} style={teal} />
            </button>
          </div>
          <button
            type="button"
            onClick={() => setSheet("to")}
            className="w-full flex items-center text-left transition-colors hover:bg-gray-50 active:bg-gray-100 gap-3 px-4 py-3.5"
          >
            <Chip>
              <Plane size={16} style={teal} />
            </Chip>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide leading-none mb-1">
                To
              </p>
              <p className="text-[14px] font-bold leading-tight break-words text-gray-900" title={`${to.city} (${to.code})`}>
                {to.city} ({to.code})
              </p>
              <p className="text-[11px] text-gray-500 leading-snug mt-0.5 truncate">{to.airport}</p>
            </div>
            <ChevronRight size={14} className="ml-auto text-gray-300 shrink-0" />
          </button>
          <div className="grid grid-cols-2 divide-x divide-gray-100">
            <button
              type="button"
              onClick={() => dateRef.current?.showPicker?.()}
              className="w-full flex items-center text-left transition-colors hover:bg-gray-50 active:bg-gray-100 gap-2 px-3 py-3"
            >
              <div
                className="rounded-xl flex items-center justify-center shrink-0 w-7 h-7"
                style={{ background: "rgba(0, 59, 83, 0.07)" }}
              >
                <CalendarDays size={14} style={teal} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide leading-none mb-1">
                  Depart
                </p>
                <p className="text-[14px] font-bold leading-tight truncate text-gray-900" title={dep.main}>
                  {dep.main}
                </p>
                <p className="text-[11px] text-gray-500 leading-snug mt-0.5 truncate">{dep.sub}</p>
              </div>
            </button>
            <button
              type="button"
              onClick={() => {
                if (ret) setRet(null);
                else retRef.current?.showPicker?.();
              }}
              className="w-full flex items-center text-left transition-colors hover:bg-gray-50 active:bg-gray-100 gap-2 px-3 py-3"
            >
              <div
                className="rounded-xl flex items-center justify-center shrink-0 w-7 h-7"
                style={{ background: "rgba(0, 59, 83, 0.07)" }}
              >
                <CalendarDays size={14} style={teal} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide leading-none mb-1">
                  Return
                </p>
                <p
                  className={`text-[14px] font-bold leading-tight truncate ${ret ? "text-gray-900" : "text-gray-400"}`}
                  title={ret ? fmtD(ret).main : "+ Add date"}
                >
                  {ret ? fmtD(ret).main : "+ Add date"}
                </p>
                {ret && (
                  <p className="text-[11px] text-gray-500 leading-snug mt-0.5 truncate">{fmtD(ret).sub}</p>
                )}
              </div>
            </button>
          </div>
          <div className="grid grid-cols-2 divide-x divide-gray-100">
            <button
              type="button"
              onClick={() => setSheet("trav")}
              className="w-full flex items-center text-left transition-colors hover:bg-gray-50 active:bg-gray-100 gap-2 px-3 py-3"
            >
              <div
                className="rounded-xl flex items-center justify-center shrink-0 w-7 h-7"
                style={{ background: "rgba(0, 59, 83, 0.07)" }}
              >
                <Users size={14} style={teal} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide leading-none mb-1">
                  Travellers
                </p>
                <p className="text-[14px] font-bold leading-tight truncate text-gray-900" title={`${adults + children} Traveller`}>
                  {adults + children} Traveller{(adults + children > 1 ? "s" : "")}
                </p>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setSheet("trav")}
              className="w-full flex items-center text-left transition-colors hover:bg-gray-50 active:bg-gray-100 gap-2 px-3 py-3"
            >
              <div
                className="rounded-xl flex items-center justify-center shrink-0 w-7 h-7"
                style={{ background: "rgba(0, 59, 83, 0.07)" }}
              >
                <Plane size={14} style={teal} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide leading-none mb-1">
                  Class
                </p>
                <p className="text-[14px] font-bold leading-tight truncate text-gray-900" title={cabin}>
                  {cabin}
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>

      <input
        ref={dateRef}
        type="date"
        className="sr-only"
        value={depart ? depart.toISOString().slice(0, 10) : ""}
        onChange={(e) => e.target.value && setDepart(new Date(e.target.value + "T00:00:00"))}
      />
      <input
        ref={retRef}
        type="date"
        className="sr-only"
        value={ret ? ret.toISOString().slice(0, 10) : ""}
        onChange={(e) => e.target.value && setRet(new Date(e.target.value + "T00:00:00"))}
      />

      <div className="px-4 pb-4 pt-3 space-y-3">
        <div
          className="flex items-center gap-1.5 px-3 py-2.5 border-t border-gray-100 flex-nowrap overflow-x-auto no-scrollbar"
          role="radiogroup"
          aria-label="fareType"
        >
          {["Regular", "Student", "Senior Citizen", "Armed Forces"].map((f) => (
            <button
              key={f}
              type="button"
              role="radio"
              aria-checked={fare === f}
              onClick={() => setFare(f)}
              className={`flex items-center gap-1 rounded-full px-2.5 py-[4px] text-[11px] font-semibold transition-all duration-150 whitespace-nowrap flex-shrink-0 border outline-none ${
                fare === f
                  ? "bg-[#023341] text-white border-[#023341]"
                  : "bg-white text-gray-700 border-gray-200 hover:border-[#023341] hover:text-[#023341]"
              }`}
            >
              {fare === f && (
                <span className="w-1.5 h-1.5 rounded-full bg-white inline-block flex-shrink-0" aria-hidden="true" />
              )}
              {f}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() =>
            onSearch({
              fromCity: from.city,
              fromCode: from.code,
              toCity: to.city,
              toCode: to.code,
              depart: depart ? depart.toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
              ret: ret ? ret.toISOString().slice(0, 10) : null,
              trip: mode,
              adults,
              children,
              cabin,
            })
          }
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#023341] py-3.5 text-sm font-bold text-white shadow-lg hover:opacity-95 active:scale-[0.99] transition-all"
        >
          Search Flights <ArrowRight size={15} />
        </button>
      </div>

      {sheet && (
        <div className="fixed inset-0 z-[100]" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/50 backdrop-enter" onClick={() => setSheet(null)} />
          <div className="drawer-enter absolute inset-x-0 bottom-0 max-h-[75vh] overflow-y-auto rounded-t-3xl bg-white p-4 pb-8">
            <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-gray-300" />
            {sheet === "trav" ? (
              <div>
                <p className="mb-3 text-sm font-bold text-gray-900">Travellers & Class</p>
                {[
                  { label: "Adults", v: adults, set: setAdults, min: 1 },
                  { label: "Children", v: children, set: setChildren, min: 0 },
                ].map((r) => (
                  <div key={r.label} className="mb-3 flex items-center justify-between">
                    <p className="text-sm font-semibold text-gray-800">{r.label}</p>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        aria-label={`Fewer ${r.label}`}
                        onClick={() => r.set(Math.max(r.min, r.v - 1))}
                        className="rounded-full border border-gray-200 p-2"
                      >
                        <Minus size={13} />
                      </button>
                      <span className="w-5 text-center text-sm font-bold">{r.v}</span>
                      <button
                        type="button"
                        aria-label={`More ${r.label}`}
                        onClick={() => r.set(Math.min(9, r.v + 1))}
                        className="rounded-full border border-gray-200 p-2"
                      >
                        <Plus size={13} />
                      </button>
                    </div>
                  </div>
                ))}
                <select
                  value={cabin}
                  onChange={(e) => setCabin(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#023341]"
                >
                  {["Economy", "Premium Economy", "Business", "First Class"].map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setSheet(null)}
                  className="mt-3 w-full rounded-xl bg-[#023341] py-3 text-sm font-bold text-white"
                >
                  Done
                </button>
              </div>
            ) : (
              <div>
                <p className="mb-2 text-sm font-bold text-gray-900">
                  Select {sheet === "from" ? "origin" : "destination"}
                </p>
                {CITIES.map((c) => (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => pick(c)}
                    className="block w-full rounded-xl px-3 py-2.5 text-left hover:bg-gray-50"
                  >
                    <span className="block text-sm font-bold text-gray-900">
                      {c.city} ({c.code})
                    </span>
                    <span className="block text-xs text-gray-500">{c.airport}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

function FlightOffers() {
  return (
    <section aria-label="Flight offers" className="w-full bg-[#efeeeb] section-pad section-y overflow-x-hidden">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-center text-2xl md:text-4xl font-bold text-[#073b4c] mb-8">
          Find <span className="text-orange-600">exciting offers</span> and best deals.
        </h2>
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {flightOffers.map((o) => (
            <div key={o.alt} className="rounded-2xl overflow-hidden h-28 md:h-36 shadow-sm">
              <img alt={o.alt} loading="lazy" className="w-full h-full object-cover" src={o.img} />
            </div>
          ))}
        </div>
        <div className="sm:hidden mb-6">
          <div className="flex overflow-x-auto no-scrollbar snap-x snap-mandatory gap-3">
            {flightOffers.map((o) => (
              <div
                key={o.alt}
                className="flex-shrink-0 w-full snap-center rounded-2xl overflow-hidden shadow-md"
                style={{ height: 200 }}
              >
                <img alt={o.alt} loading="lazy" className="w-full h-full object-cover" src={o.img} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FlightSeo() {
  return (
    <section aria-label="About flight booking" className="w-full bg-[#efeeeb] py-10 md:py-12 section-pad">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-[#003b53] leading-snug mb-2">
          Online Flight Ticket Booking Made Simple and Affordable
        </h1>
        <div className="text-[14px] md:text-[15px] leading-[1.75] text-gray-700 [&_h2]:text-lg [&_h2]:md:text-xl [&_h2]:font-bold [&_h2]:text-[#003b53] [&_h2]:mt-7 [&_h2]:mb-2.5 [&_h3]:text-base [&_h3]:md:text-lg [&_h3]:font-semibold [&_h3]:text-[#003b53] [&_h3]:mt-6 [&_h3]:mb-2 [&_p]:mb-3.5 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ul]:space-y-1.5 [&_li]:leading-relaxed [&_strong]:font-semibold [&_strong]:text-gray-900">
          <p>
            In today&apos;s fast-paced world, planning your travel shouldn&apos;t be a hassle. At
            MaujiTrip, we make <strong>online flight ticket booking</strong> a seamless
            experience. Whether you&apos;re heading for a business trip, a family vacation, or a
            quick weekend getaway, you can <strong>book flight tickets online</strong> with just
            a few clicks.
          </p>
          <h2>Book Domestic and International Flights with Ease</h2>
          <p>
            From metro cities like Delhi, Mumbai, and Bangalore to scenic international
            destinations, we help you book tickets that suit your schedule and budget —{" "}
            <strong>domestic flight booking</strong> and{" "}
            <strong>international flight booking</strong> on one platform.
          </p>
          <h2>Why Choose MaujiTrip for Online Flight Booking?</h2>
          <ul>
            <li>Instant flight ticket confirmation</li>
            <li>Access to cheap flight ticket booking deals</li>
            <li>100% safe and secure online flight booking process</li>
            <li>Easy-to-use interface for quick searches and bookings</li>
            <li>24/7 support for all your travel needs</li>
          </ul>
          <h2>Book Round Trip Flight Tickets Online – Save More!</h2>
          <p>
            Round trips often offer better value. With MaujiTrip you can{" "}
            <strong>book round trip flight tickets online</strong> with real-time fare updates
            and exclusive discounts.
          </p>
          <h2>Safe and Secure Online Flight Ticket Booking</h2>
          <p>
            Every step of our booking process is encrypted and backed by trusted payment
            gateways. Plus, we never charge hidden fees — what you see is what you pay.
          </p>
          <h2>Instant Flight Ticket Confirmation</h2>
          <p>
            Your tickets and e-receipts reach your email within seconds, with real-time
            availability directly integrated with airline servers.
          </p>
          <h2>Best Flight Booking Website for Indian Travelers</h2>
          <p>
            Strong customer support, user-friendly interface, and unbeatable prices make
            MaujiTrip stand out as the <strong>best flight booking website in India</strong>.
          </p>
        </div>
      </div>
    </section>
  );
}

export default function FlightsPage() {
  const go = (p: FlightSearchParams) => {
    window.location.href = buildFlightSearchUrl(p);
  };

  return (
    <SiteChrome active="flights">
      <div className="min-h-screen bg-[#eef4f8] pb-16 md:pb-0">
        <FlightsMobileHero onSearch={go} />
        <Hero onSearch={go} />
        <TopRoutes />
        <FlightOffers />
        <FlightSeo />
        <PageFaq title="Flight Booking FAQs" items={flightFaqs} />
      </div>
    </SiteChrome>
  );
}
