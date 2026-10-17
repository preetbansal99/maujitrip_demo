"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowLeftRight,
  ArrowUpRight,
  Bus,
  CalendarDays,
  ChevronDown,
  Hotel,
  MapPin,
  Minus,
  Plane,
  Plus,
  Search,
  Tag,
  Umbrella,
  Users,
  X,
} from "lucide-react";
import { buildFlightSearchUrl, type FlightSearchParams } from "@/lib/searchUrl";

type Tab = "flight" | "hotel" | "bus" | "holidays";

const TABS: { key: Tab; label: string; icon: React.ReactNode }[] = [
  { key: "flight", label: "Flight", icon: <Plane size={13} /> },
  { key: "hotel", label: "Hotel", icon: <Hotel size={13} /> },
  { key: "bus", label: "Bus", icon: <Bus size={13} /> },
  { key: "holidays", label: "Holidays", icon: <Umbrella size={13} /> },
];

const CITIES = [
  { city: "Delhi", code: "DEL", airport: "Indira Gandhi International Airport" },
  { city: "Mumbai", code: "BOM", airport: "Chhatrapati Shivaji International Airport" },
  { city: "Bengaluru", code: "BLR", airport: "Kempegowda International Airport" },
  { city: "Chennai", code: "MAA", airport: "Chennai International Airport" },
  { city: "Hyderabad", code: "HYD", airport: "Rajiv Gandhi International Airport" },
  { city: "Kolkata", code: "CCU", airport: "Netaji Subhash Chandra Bose International Airport" },
  { city: "Goa", code: "GOI", airport: "Dabolim Goa International Airport" },
  { city: "Jaipur", code: "JAI", airport: "Jaipur International Airport" },
  { city: "Dubai", code: "DXB", airport: "Dubai International Airport" },
  { city: "Singapore", code: "SIN", airport: "Changi Airport" },
  { city: "Bangkok", code: "BKK", airport: "Suvarnabhumi Airport" },
  { city: "London", code: "LHR", airport: "Heathrow Airport" },
  { city: "Pune", code: "PNQ", airport: "Pune Airport" },
  { city: "Kochi", code: "COK", airport: "Cochin International Airport" },
  { city: "Lucknow", code: "LKO", airport: "Chaudhary Charan Singh Airport" },
  { city: "Ahmedabad", code: "AMD", airport: "Sardar Vallabhbhai Patel Airport" },
  { city: "Bhubaneswar", code: "BBI", airport: "Biju Patnaik International Airport" },
  { city: "Amritsar", code: "ATQ", airport: "Sri Guru Ram Dass Jee Intl Airport" },
  { city: "Chandigarh", code: "IXC", airport: "Chandigarh International Airport" },
  { city: "Indore", code: "IDR", airport: "Devi Ahilyabai Holkar Airport" },
  { city: "Coimbatore", code: "CJB", airport: "Coimbatore International Airport" },
  { city: "Jammu", code: "IXJ", airport: "Jammu Airport" },
  { city: "Guwahati", code: "GAU", airport: "Lokpriya Gopinath Bordoloi Airport" },
  { city: "Nagpur", code: "NAG", airport: "Dr. Babasaheb Ambedkar Intl Airport" },
  { city: "Abu Dhabi", code: "AUH", airport: "Abu Dhabi International Airport" },
  { city: "Sharjah", code: "SHJ", airport: "Sharjah International Airport" },
  { city: "Doha", code: "DOH", airport: "Hamad International Airport" },
  { city: "Muscat", code: "MCT", airport: "Muscat International Airport" },
  { city: "Kuwait City", code: "KWI", airport: "Kuwait International Airport" },
  { city: "Riyadh", code: "RUH", airport: "King Khalid International Airport" },
  { city: "Kuala Lumpur", code: "KUL", airport: "Kuala Lumpur Intl Airport" },
  { city: "Denpasar Bali", code: "DPS", airport: "Ngurah Rai International Airport" },
  { city: "Ho Chi Minh City", code: "SGN", airport: "Tan Son Nhat International Airport" },
  { city: "Manila", code: "MNL", airport: "Ninoy Aquino International Airport" },
  { city: "Siem Reap", code: "REP", airport: "Siem Reap International Airport" },
  { city: "Colombo", code: "CMB", airport: "Bandaranaike International Airport" },
  { city: "Tokyo", code: "NRT", airport: "Narita International Airport" },
  { city: "Hong Kong", code: "HKG", airport: "Hong Kong International Airport" },
  { city: "Paris", code: "CDG", airport: "Charles de Gaulle Airport" },
  { city: "Frankfurt", code: "FRA", airport: "Frankfurt Airport" },
  { city: "Amsterdam", code: "AMS", airport: "Amsterdam Schiphol Airport" },
  { city: "Tbilisi", code: "TBS", airport: "Tbilisi International Airport" },
  { city: "Kathmandu", code: "KTM", airport: "Tribhuvan International Airport" },
  { city: "Dhaka", code: "DAC", airport: "Hazrat Shahjalal Intl Airport" },
  { city: "Paro", code: "PBH", airport: "Paro Airport" },
  { city: "Mauritius", code: "MRU", airport: "Sir Seewoosagur Ramgoolam Intl Airport" },
];

type City = (typeof CITIES)[number];

function fmtDate(d: Date) {
  const day = d.getDate();
  const mon = d.toLocaleDateString("en-GB", { month: "short" });
  const yr = String(d.getFullYear()).slice(2);
  const wd = d.toLocaleDateString("en-GB", { weekday: "long" });
  return { main: `${day} ${mon} ${yr}`, sub: wd };
}

function CityInput({
  label,
  placeholder,
  value,
  onPick,
}: {
  label: string;
  placeholder: string;
  value: City;
  onPick: (c: City) => void;
}) {
  const [q, setQ] = useState(`${value.city} (${value.code})`);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    setQ(`${value.city} (${value.code})`);
  }, [value]);
  const list = CITIES.filter(
    (c) =>
      c.city.toLowerCase().includes(q.toLowerCase()) ||
      c.code.toLowerCase().includes(q.toLowerCase())
  ).slice(0, 7);
  return (
    <div className="relative">
      <p className="text-[10px] text-black font-semibold mb-0.5 select-none">{label}</p>
      <div className="flex items-center gap-1 min-w-0">
        <input
          placeholder={placeholder}
          autoComplete="off"
          spellCheck={false}
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          className="flex-1 min-w-0 text-[11px] lg:text-[13px] xl:text-[15px] font-bold leading-tight text-black bg-transparent outline-none border-none placeholder:text-black/30 placeholder:font-normal"
        />
        <button
          type="button"
          aria-label={`Clear ${label}`}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => setQ("")}
          className="shrink-0 text-black/30 hover:text-black/60 transition-colors"
        >
          <X size={12} />
        </button>
      </div>
      <p className="text-[10px] text-black/60 mt-0.5 truncate">{value.airport}</p>
      {open && q.length > 0 && (
        <div className="absolute left-0 top-full z-50 mt-1 w-64 rounded-2xl border border-gray-100 bg-white p-2 shadow-2xl">
          {list.map((c) => (
            <button
              key={c.code}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                onPick(c);
                setOpen(false);
              }}
              className="block w-full rounded-xl px-3 py-2 text-left hover:bg-gray-50"
            >
              <span className="block text-[13px] font-bold text-gray-900">
                {c.city} ({c.code})
              </span>
              <span className="block truncate text-[11px] text-gray-500">{c.airport}</span>
            </button>
          ))}
          {list.length === 0 && (
            <p className="px-3 py-2 text-xs text-gray-500">No matches found</p>
          )}
        </div>
      )}
    </div>
  );
}

function FlightPanel({
  onSearch,
  initFrom,
  initTo,
}: {
  onSearch: (p: FlightSearchParams) => void;
  initFrom?: string;
  initTo?: string;
}) {
  const [mode, setMode] = useState<"oneway" | "roundtrip">("oneway");
  const [deal, setDeal] = useState("deals");
  const [from, setFrom] = useState<City>(
    CITIES.find((c) => c.code === initFrom) || CITIES[0]
  );
  const [to, setTo] = useState<City>(CITIES.find((c) => c.code === initTo) || CITIES[1]);
  const [depart, setDepart] = useState<Date | null>(null);
  const [ret, setRet] = useState<Date | null>(null);
  const [travOpen, setTravOpen] = useState(false);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [cabin, setCabin] = useState("Economy");
  const dateRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    setDepart(d);
  }, []);

  const dep = depart ? fmtDate(depart) : { main: "Select date", sub: "" };

  return (
    <div>
      <div className="overflow-x-auto no-scrollbar -mx-4 md:mx-0 px-4 md:px-0 mb-4">
        <fieldset className="border-0 p-0 inline-flex items-center gap-1.5 bg-[#003b53] text-white rounded-full px-2.5 py-1.5 text-xs font-semibold shadow-md whitespace-nowrap">
          <legend className="sr-only">homeTripMode</legend>
          {(
            [
              { v: "oneway", label: "Oneway" },
              { v: "roundtrip", label: "Round Trip" },
            ] as const
          ).map((m) => (
            <label
              key={m.v}
              className={`flex items-center gap-1.5 cursor-pointer select-none px-3 py-1.5 rounded-full transition-all duration-200 ${
                mode === m.v
                  ? "bg-white/20 text-white"
                  : "bg-transparent text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <input
                className="accent-white w-3 h-3 cursor-pointer"
                type="radio"
                value={m.v}
                checked={mode === m.v}
                onChange={() => setMode(m.v)}
                name="homeTripMode"
              />
              <span className="whitespace-nowrap leading-none">{m.label}</span>
            </label>
          ))}
        </fieldset>
      </div>

      <div className="flex flex-col md:flex-row items-stretch gap-3 md:gap-0">
        <div className="flex-1 md:border-r border-black/10 md:pl-2 md:pr-2 lg:pl-4 lg:pr-5">
          <CityInput label="From" placeholder="Departure city" value={from} onPick={setFrom} />
        </div>
        <div className="hidden md:flex items-center justify-center px-1 lg:px-2">
          <button
            type="button"
            aria-label="Swap locations"
            onClick={() => {
              setFrom(to);
              setTo(from);
            }}
            className="border border-black/15 rounded-full p-1.5 bg-white/40 backdrop-blur-sm shadow-sm hover:bg-white/70 transition-colors focus:outline-none focus-visible:outline-none"
          >
            <ArrowLeftRight size={11} className="text-gray-700" />
          </button>
        </div>
        <div className="flex-1 md:border-r border-black/10 md:pl-2 md:pr-2 lg:pl-4 lg:pr-5">
          <CityInput label="To" placeholder="Destination city" value={to} onPick={setTo} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex-1 md:border-r border-black/10 md:pl-2 md:pr-2 lg:pl-4 lg:pr-5">
            <div className="relative cursor-pointer">
              <p className="text-[10px] text-black font-semibold mb-0.5">Depart</p>
              <button
                type="button"
                onClick={() => dateRef.current?.showPicker?.()}
                className="text-left bg-transparent border-none outline-none focus:outline-none focus-visible:outline-none p-0 w-full"
              >
                <div className="flex items-center gap-1">
                  <h2 className="text-[11px] lg:text-[13px] xl:text-[15px] font-bold leading-tight tracking-tight text-black">
                    {dep.main}
                  </h2>
                  <ChevronDown size={13} className="text-black/40 flex-shrink-0" />
                </div>
                <p className="text-[10px] text-black/60 mt-0.5">{dep.sub}</p>
              </button>
              <input
                ref={dateRef}
                type="date"
                className="sr-only"
                value={depart ? depart.toISOString().slice(0, 10) : ""}
                onChange={(e) =>
                  e.target.value && setDepart(new Date(e.target.value + "T00:00:00"))
                }
              />
            </div>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex-1 md:border-r border-black/10 md:pl-2 md:pr-2 lg:pl-4 lg:pr-5">
            <div className="relative">
              <p className="text-[10px] text-black font-semibold mb-0.5">Return</p>
              {ret ? (
                <button
                  type="button"
                  onClick={() => setRet(null)}
                  className="text-left bg-transparent border-none outline-none p-0 w-full"
                >
                  <h2 className="text-[11px] lg:text-[13px] xl:text-[15px] font-bold leading-tight tracking-tight text-black">
                    {fmtDate(ret).main}
                  </h2>
                  <p className="text-[10px] text-black/60 mt-0.5">{fmtDate(ret).sub}</p>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    if (!depart) return;
                    const d = new Date(depart);
                    d.setDate(d.getDate() + 3);
                    setRet(d);
                  }}
                  className="text-left bg-transparent border-none outline-none focus:outline-none focus-visible:outline-none p-0 w-full"
                >
                  <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-lg px-2 py-1.5 hover:bg-amber-100 transition-colors">
                    <Tag size={11} className="text-amber-600 flex-shrink-0" />
                    <p className="text-[10px] font-semibold text-amber-700 leading-tight">
                      Tap to add a return date for bigger discounts
                    </p>
                  </div>
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex-1 md:pl-2 lg:px-4">
            <div className="relative cursor-pointer">
              <p className="text-[10px] text-black font-semibold mb-0.5">Travellers &amp; Class</p>
              <button
                type="button"
                onClick={() => setTravOpen((v) => !v)}
                className="text-left bg-transparent border-none outline-none focus:outline-none focus-visible:outline-none p-0 w-full"
              >
                <div className="flex items-center gap-1">
                  <div className="flex items-baseline gap-1">
                    <h2 className="text-[11px] lg:text-[13px] xl:text-[15px] font-bold leading-tight text-black">
                      {adults + children}
                    </h2>
                    <span className="text-[10px] text-black/60">
                      Traveller{(adults + children > 1 ? "s" : "")}
                    </span>
                  </div>
                  <ChevronDown size={13} className="text-black/40 flex-shrink-0" />
                </div>
                <p className="text-[10px] text-black/60 mt-0.5">{cabin}</p>
              </button>
              {travOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setTravOpen(false)} />
                  <div className="absolute right-0 top-full z-50 mt-2 w-64 rounded-2xl border border-gray-100 bg-white p-4 shadow-2xl">
                    {[
                      { label: "Adults", sub: "12 yrs+", v: adults, set: setAdults, min: 1 },
                      { label: "Children", sub: "2 - 11 yrs", v: children, set: setChildren, min: 0 },
                    ].map((r) => (
                      <div key={r.label} className="mb-3 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-gray-800">{r.label}</p>
                          <p className="text-xs text-gray-500">{r.sub}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            aria-label={`Fewer ${r.label}`}
                            onClick={() => r.set(Math.max(r.min, r.v - 1))}
                            className="rounded-full border border-gray-200 p-1.5 hover:border-[#023341] hover:text-[#023341]"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-5 text-center text-sm font-bold">{r.v}</span>
                          <button
                            type="button"
                            aria-label={`More ${r.label}`}
                            onClick={() => r.set(Math.min(9, r.v + 1))}
                            className="rounded-full border border-gray-200 p-1.5 hover:border-[#023341] hover:text-[#023341]"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>
                    ))}
                    <select
                      value={cabin}
                      onChange={(e) => setCabin(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-[#023341]"
                    >
                      {["Economy", "Premium Economy", "Business", "First Class"].map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => setTravOpen(false)}
                      className="mt-3 w-full rounded-xl bg-[#023341] py-2 text-sm font-semibold text-white"
                    >
                      Done
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-center md:justify-end md:pl-1 lg:pl-2">
          <button
            type="button"
            aria-label="Search Flights"
            className="hidden md:flex lg:hidden items-center justify-center w-8 h-8 rounded-full text-white flex-shrink-0 shadow-lg active:scale-95 hover:opacity-90 transition-all duration-200 focus:outline-none focus-visible:outline-none"
            style={{ background: "rgb(2, 51, 65)" }}
            onClick={() =>
              onSearch({
                fromCity: from.city,
                fromCode: from.code,
                toCity: to.city,
                toCode: to.code,
                depart: depart ? depart.toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
                ret: ret ? ret.toISOString().slice(0, 10) : null,
                trip: mode === "oneway" ? "oneway" : "roundtrip",
                adults,
                children,
                cabin,
              })
            }
          >
            <ArrowUpRight size={17} />
          </button>
          <button
            type="button"
            className="md:hidden lg:flex items-center gap-1 text-white rounded-full px-2.5 lg:px-2.5 py-1.5 lg:py-2 font-semibold text-xs lg:text-sm w-full justify-center transition-all duration-200 shadow-lg active:scale-95 hover:opacity-90 focus:outline-none focus-visible:outline-none"
            style={{ background: "rgb(2, 51, 65)" }}
            onClick={() =>
              onSearch({
                fromCity: from.city,
                fromCode: from.code,
                toCity: to.city,
                toCode: to.code,
                depart: depart ? depart.toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
                ret: ret ? ret.toISOString().slice(0, 10) : null,
                trip: mode === "oneway" ? "oneway" : "roundtrip",
                adults,
                children,
                cabin,
              })
            }
          >
            Search Flights
            <ArrowUpRight size={15} />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto no-scrollbar -mx-3 sm:-mx-3 md:-mx-4 lg:-mx-5 px-3 md:px-4 lg:px-5 mt-3 -mb-[30px] flex md:justify-center">
        <fieldset className="border-0 p-0 bg-[#003b53] text-white rounded-full px-4 py-1.5 inline-flex gap-2 text-xs font-semibold shadow-lg shrink-0">
          <legend className="sr-only">homeDeal</legend>
          {[
            { v: "deals", label: "Best Deals" },
            { v: "trending", label: "Trending" },
            { v: "weekend", label: "Weekend Getaways" },
            { v: "lastmin", label: "Last Minute" },
          ].map((d) => (
            <label
              key={d.v}
              className={`flex items-center gap-1.5 cursor-pointer select-none px-2.5 py-1 rounded-full transition-all duration-200 ${
                deal === d.v
                  ? "bg-white/20 text-white"
                  : "text-white/65 hover:bg-white/10 hover:text-white"
              }`}
            >
              <input
                className="accent-white w-3 h-3 cursor-pointer"
                type="radio"
                value={d.v}
                checked={deal === d.v}
                onChange={() => setDeal(d.v)}
                name="homeDeal"
              />
              <span className="whitespace-nowrap leading-none">{d.label}</span>
            </label>
          ))}
        </fieldset>
      </div>
    </div>
  );
}

function SimplePanel({
  fields,
  cta,
  icon,
  href,
}: {
  fields: React.ReactNode;
  cta: string;
  icon?: React.ReactNode;
  href: string;
}) {
  return (
    <div>
      <div className="flex flex-col md:flex-row items-stretch gap-3 md:gap-0">{fields}</div>
      <div className="flex items-center justify-center md:justify-end md:pl-1 lg:pl-2 mt-3">
        <button
          type="button"
          className="hidden md:flex lg:hidden items-center justify-center w-8 h-8 rounded-full text-white flex-shrink-0 shadow-lg active:scale-95 hover:opacity-90 transition-all duration-200 focus:outline-none"
          style={{ background: "rgb(2, 51, 65)" }}
          aria-label={cta}
          onClick={() => (window.location.href = href)}
        >
          <ArrowUpRight size={17} />
        </button>
        <button
          type="button"
          className="md:hidden lg:flex items-center gap-1 text-white rounded-full px-2.5 py-1.5 lg:py-2 font-semibold text-xs lg:text-sm w-full justify-center transition-all duration-200 shadow-lg active:scale-95 hover:opacity-90 focus:outline-none"
          style={{ background: "rgb(2, 51, 65)" }}
          onClick={() => (window.location.href = href)}
        >
          {icon}
          {cta}
          <ArrowUpRight size={15} />
        </button>
      </div>
    </div>
  );
}

function Col({ children, last }: { children: React.ReactNode; last?: boolean }) {
  return (
    <div className="flex-1 min-w-0">
      <div
        className={`flex-1 ${last ? "md:pl-2 lg:px-4" : "md:border-r border-black/10 md:pl-2 md:pr-2 lg:pl-4 lg:pr-5"}`}
      >
        {children}
      </div>
    </div>
  );
}

function HotelPanel() {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  useEffect(() => {
    const a = new Date();
    a.setDate(a.getDate() + 7);
    const b = new Date();
    b.setDate(b.getDate() + 9);
    setCheckIn(a.toISOString().slice(0, 10));
    setCheckOut(b.toISOString().slice(0, 10));
  }, []);
  return (
    <SimplePanel
      cta="Search Hotels"
      href="/hotels"
      icon={<Search size={14} />}
      fields={
        <>
          <Col>
            <p className="text-[10px] text-black font-semibold mb-0.5">Destination</p>
            <div className="flex items-center gap-1">
              <MapPin size={13} className="text-black/40 flex-shrink-0" />
              <input
                placeholder="Where are you going?"
                className="flex-1 min-w-0 text-[11px] lg:text-[13px] xl:text-[15px] font-bold leading-tight text-black bg-transparent outline-none border-none placeholder:text-black/30 placeholder:font-normal"
              />
            </div>
            <p className="text-[10px] text-black/60 mt-0.5">India</p>
          </Col>
          <Col>
            <p className="text-[10px] text-black font-semibold mb-0.5">Check-in</p>
            <div className="flex items-center gap-1">
              <CalendarDays size={13} className="text-black/40 flex-shrink-0" />
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="flex-1 min-w-0 bg-transparent text-[11px] lg:text-[13px] font-bold text-black outline-none border-none"
              />
            </div>
          </Col>
          <Col last>
            <p className="text-[10px] text-black font-semibold mb-0.5">Check-out</p>
            <div className="flex items-center gap-1">
              <CalendarDays size={13} className="text-black/40 flex-shrink-0" />
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="flex-1 min-w-0 bg-transparent text-[11px] lg:text-[13px] font-bold text-black outline-none border-none"
              />
            </div>
            <p className="text-[10px] text-black/60 mt-0.5">2 Guests · 1 Room</p>
          </Col>
        </>
      }
    />
  );
}

function BusPanel() {
  const [from, setFrom] = useState<City>(CITIES[0]);
  const [to, setTo] = useState<City>(CITIES[2]);
  const [date, setDate] = useState("");
  useEffect(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    setDate(d.toISOString().slice(0, 10));
  }, []);
  return (
    <SimplePanel
      cta="Search Buses"
      href="/bus"
      icon={<Search size={14} />}
      fields={
        <>
          <Col>
            <CityInput label="From" placeholder="Departure city" value={from} onPick={setFrom} />
          </Col>
          <Col>
            <CityInput label="To" placeholder="Destination city" value={to} onPick={setTo} />
          </Col>
          <Col last>
            <p className="text-[10px] text-black font-semibold mb-0.5">Travel Date</p>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-transparent text-[11px] lg:text-[13px] font-bold text-black outline-none border-none"
            />
          </Col>
        </>
      }
    />
  );
}

function HolidaysPanel() {
  return (
    <SimplePanel
      cta="Search Holidays"
      href="/holidays"
      icon={<Search size={14} />}
      fields={
        <>
          <Col>
            <p className="text-[10px] text-black font-semibold mb-0.5">Destination</p>
            <div className="flex items-center gap-1">
              <MapPin size={13} className="text-black/40 flex-shrink-0" />
              <input
                placeholder="Where to?"
                className="flex-1 min-w-0 text-[11px] lg:text-[13px] xl:text-[15px] font-bold leading-tight text-black bg-transparent outline-none border-none placeholder:text-black/30 placeholder:font-normal"
              />
            </div>
            <p className="text-[10px] text-black/60 mt-0.5">Honeymoon · Family · Group</p>
          </Col>
          <Col>
            <p className="text-[10px] text-black font-semibold mb-0.5">Travel Month</p>
            <input
              type="month"
              className="w-full bg-transparent text-[11px] lg:text-[13px] font-bold text-black outline-none border-none"
            />
          </Col>
          <Col last>
            <p className="text-[10px] text-black font-semibold mb-0.5">Travellers</p>
            <div className="flex items-center gap-1">
              <Users size={13} className="text-black/40 flex-shrink-0" />
              <span className="text-[11px] lg:text-[13px] xl:text-[15px] font-bold text-black">
                2 Travellers
              </span>
            </div>
          </Col>
        </>
      }
    />
  );
}

const INACTIVE_TAB =
  "flex items-center gap-1 md:gap-1.5 rounded-full px-3 md:px-4 py-1 md:py-1.5 text-xs md:text-sm font-semibold shadow-md transition-all duration-200 bg-white/70 backdrop-blur-sm text-black hover:bg-white/90 hover:scale-[1.02] border border-white/50";
const ACTIVE_TAB =
  "flex items-center gap-1 md:gap-1.5 rounded-full px-3 md:px-4 py-1 md:py-1.5 text-xs md:text-sm font-semibold shadow-md transition-all duration-200 bg-[#023341] text-white border-[#023341] scale-[1.03]";

export default function Hero({
  onSearch,
  initFrom,
  initTo,
}: {
  onSearch?: (p: FlightSearchParams) => void;
  initFrom?: string;
  initTo?: string;
}) {
  const [tab, setTab] = useState<Tab>("flight");
  const go = (p: FlightSearchParams) => {
    if (onSearch) onSearch(p);
    else window.location.href = buildFlightSearchUrl(p);
  };

  return (
    <section
      aria-label="Search travel options"
      className="hidden lg:block w-full px-4 lg:px-8 pt-8 lg:pt-14 pb-[160px] lg:pb-[120px] mt-[30px]"
    >
      <div className="max-w-7xl mx-auto">
        <div className="relative">
          <img
            alt="Explore India"
            width={1200}
            height={360}
            fetchPriority="high"
            decoding="async"
            className="w-full h-[200px] md:h-[260px] lg:h-[360px] object-cover rounded-2xl lg:rounded-3xl"
            src="/images/Home-banner.jpg"
          />
          <div className="absolute left-1/2 -translate-x-1/2 bottom-[-40px] md:bottom-[-44px] lg:bottom-[-60px] w-[96%] z-20">
            <div
              className="flex justify-center gap-1 md:gap-1.5 mb-[-18px] relative z-30 flex-wrap"
              role="tablist"
              aria-label="Travel category"
            >
              {TABS.map((t) => (
                <button
                  key={t.key}
                  role="tab"
                  aria-selected={tab === t.key}
                  onClick={() => setTab(t.key)}
                  className={tab === t.key ? ACTIVE_TAB : INACTIVE_TAB}
                >
                  {t.icon}
                  {t.label}
                </button>
              ))}
            </div>
            <div
              role="tabpanel"
              className="animate-in fade-in slide-in-from-bottom-2 duration-300"
            >
              <div className="bg-white/25 backdrop-blur-2xl border border-white/40 rounded-[22px] shadow-2xl px-2 sm:px-3 md:px-4 lg:px-5 pt-3 md:pt-4 pb-4 md:pb-5 ring-1 ring-black/5 w-full">
                {tab === "flight" && <FlightPanel onSearch={go} initFrom={initFrom} initTo={initTo} />}
                {tab === "hotel" && <HotelPanel />}
                {tab === "bus" && <BusPanel />}
                {tab === "holidays" && <HolidaysPanel />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
