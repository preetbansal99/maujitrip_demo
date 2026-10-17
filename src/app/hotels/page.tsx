"use client";

import { useEffect, useState } from "react";
import { CalendarDays, ChevronDown, Copy, Minus, Plus, Search, ShieldCheck, Star, Users } from "lucide-react";
import SiteChrome from "@/components/SiteChrome";
import PageFaq from "@/components/PageFaq";
import HotelWherePicker, { type HotelSuggestion } from "@/components/HotelWherePicker";
import { discoverHotels, hotelFaqs, hotelOffers, inr } from "@/data/demo";
import { slugify } from "@/lib/slug";

function MobileHero() {
  const [tab, setTab] = useState(0);
  const [ci, setCi] = useState("");
  const [co, setCo] = useState("");
  const [dest, setDest] = useState<HotelSuggestion | null>(null);
  const [q, setQ] = useState("");
  const [sugs, setSugs] = useState<HotelSuggestion[]>([]);
  const [whereOpen, setWhereOpen] = useState(false);
  const [whoOpen, setWhoOpen] = useState(false);
  const [rooms, setRooms] = useState(1);
  const [adults, setAdults] = useState(2);
  useEffect(() => {
    setCi(new Date(Date.now() + 7 * 864e5).toISOString().slice(0, 10));
    setCo(new Date(Date.now() + 8 * 864e5).toISOString().slice(0, 10));
  }, []);
  useEffect(() => {
    if (!whereOpen || q.trim().length < 2) {
      setSugs([]);
      return;
    }
    const t = setTimeout(async () => {
      try {
        const r = await fetch(`/api/live/hotel/search?q=${encodeURIComponent(q.trim())}`).then((x) => x.json());
        setSugs(Array.isArray(r?.data) ? r.data : []);
      } catch {
        setSugs([]);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [q, whereOpen]);
  const fmt = (iso: string) =>
    iso
      ? new Date(iso + "T00:00:00").toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "";
  const go = () => {
    const city = dest?.city || "Goa";
    const state = dest?.state || "";
    const country = dest?.country || "INDIA";
    const f = (iso: string) => {
      if (!iso) return "";
      const [y, m, d] = iso.split("-");
      return `${d}/${m}/${y}`;
    };
    window.location.href = `/hotels/results?city=${encodeURIComponent(city)}&state=${encodeURIComponent(state)}&country=${country}&chk_in=${f(ci)}&chk_out=${f(co)}&adults=${adults}&childs=0&num_rooms=${rooms}&customer_type=B2C`;
  };
  const tabs = [
    { label: "Hotels", icon: "/images/Hotel/hotel.svg" },
    { label: "Homes & Villas", icon: "/images/Hotel/home.svg" },
    { label: "Resorts", icon: "/images/Hotel/resorts.svg" },
    { label: "Apartments", icon: "/images/Hotel/apartment.svg" },
  ];
  return (
    <div className="md:hidden w-full">
      <div className="relative overflow-hidden h-60">
        <img
          alt="Find your perfect stay"
          className="absolute inset-0 w-full h-full object-cover"
          src="/images/Hotel/hotel-hero-background.png"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/15 to-black/55" />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 pt-16 pb-6 gap-2">
          <h1 className="text-[26px] font-black text-white text-center leading-tight drop-shadow-lg">
            Find Your Perfect Stay
          </h1>
          <p className="text-white/80 text-[13px] font-medium text-center">
            Best prices · 1M+ hotels · 24x7 support
          </p>
        </div>
      </div>
      <div className="px-4 -mt-5 relative z-10 pb-6">
        <div className="flex gap-2 overflow-x-auto no-scrollbar mb-3 pt-1">
          {tabs.map((t, i) => (
            <button
              key={t.label}
              type="button"
              onClick={() => setTab(i)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-semibold transition-all shadow-sm ${
                tab === i ? "bg-[#f74800] text-white" : "bg-white text-gray-600 border border-gray-200"
              }`}
            >
              <img
                alt=""
                className={`w-4 h-4 object-contain ${tab === i ? "brightness-0 invert" : "opacity-50"}`}
                src={t.icon}
              />
              {t.label}
            </button>
          ))}
        </div>
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <button
            type="button"
            onClick={() => setWhereOpen((v) => !v)}
            className="w-full flex items-center gap-3 px-4 py-4 text-left active:bg-gray-50 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
              <Search size={15} className="text-gray-700" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Where</p>
              <p className={`text-[15px] font-semibold truncate mt-0.5 ${dest ? "text-gray-900" : "text-gray-400"}`}>
                {dest ? dest.city : "Search city or destination"}
              </p>
            </div>
            <ChevronDown size={16} className={`text-gray-400 flex-shrink-0 transition-transform ${whereOpen ? "rotate-180" : ""}`} />
          </button>
          {whereOpen && (
            <div className="px-4 pb-3">
              <input
                autoFocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="City, hotel or area..."
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-800 outline-none placeholder:text-gray-400 focus:border-[#023341]"
              />
              <div className="mt-1 max-h-52 overflow-y-auto">
                {sugs.map((s, i) => (
                  <button
                    key={`${s.city}-${i}`}
                    type="button"
                    onClick={() => {
                      setDest(s);
                      setWhereOpen(false);
                      setQ("");
                    }}
                    className="block w-full rounded-xl px-3 py-2 text-left hover:bg-gray-50"
                  >
                    <span className="block text-[13px] font-bold text-gray-900">{s.city}</span>
                    <span className="block text-[11px] text-gray-500">
                      {s.country} · {s.type.replace(/_/g, " ")}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
          <div className="h-px bg-gray-100 mx-4" />
          <button
            type="button"
            onClick={() => (document.getElementById("m-ci") as HTMLInputElement | null)?.showPicker?.()}
            className="w-full flex items-center gap-3 px-4 py-4 text-left active:bg-gray-50 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
              <CalendarDays size={15} className="text-gray-700" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Check-in</p>
              <p className="text-[15px] font-semibold mt-0.5 text-gray-900">{fmt(ci)}</p>
            </div>
            <ChevronDown size={16} className="text-gray-400 flex-shrink-0 transition-transform" />
          </button>
          <input
            id="m-ci"
            type="date"
            className="sr-only"
            value={ci}
            onChange={(e) => setCi(e.target.value)}
          />
          <div className="h-px bg-gray-100 mx-4" />
          <button
            type="button"
            onClick={() => (document.getElementById("m-co") as HTMLInputElement | null)?.showPicker?.()}
            className="w-full flex items-center gap-3 px-4 py-4 text-left active:bg-gray-50 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
              <CalendarDays size={15} className="text-gray-700" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Check-out</p>
              <p className="text-[15px] font-semibold mt-0.5 text-gray-900">{fmt(co)}</p>
            </div>
            <ChevronDown size={16} className="text-gray-400 flex-shrink-0 transition-transform" />
          </button>
          <input
            id="m-co"
            type="date"
            className="sr-only"
            value={co}
            onChange={(e) => setCo(e.target.value)}
          />
          <div className="h-px bg-gray-100 mx-4" />
          <button
            type="button"
            onClick={() => setWhoOpen((v) => !v)}
            className="w-full flex items-center gap-3 px-4 py-4 text-left active:bg-gray-50 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
              <Users size={15} className="text-gray-700" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Who</p>
              <p className="text-[15px] font-semibold text-gray-900 mt-0.5 truncate">
                {rooms} Room, {adults} Adults
              </p>
            </div>
            <ChevronDown size={16} className={`text-gray-400 flex-shrink-0 transition-transform ${whoOpen ? "rotate-180" : ""}`} />
          </button>
          {whoOpen && (
            <div className="px-4 pb-3 space-y-2">
              {[
                { label: "Rooms", v: rooms, set: setRooms, min: 1 },
                { label: "Adults", v: adults, set: setAdults, min: 1 },
              ].map((r) => (
                <div key={r.label} className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-700">{r.label}</span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      aria-label={`Fewer ${r.label}`}
                      onClick={() => r.set(Math.max(r.min, r.v - 1))}
                      className="rounded-full border border-gray-200 p-1.5"
                    >
                      <Minus size={13} />
                    </button>
                    <span className="w-5 text-center text-sm font-bold">{r.v}</span>
                    <button
                      type="button"
                      aria-label={`More ${r.label}`}
                      onClick={() => r.set(Math.min(9, r.v + 1))}
                      className="rounded-full border border-gray-200 p-1.5"
                    >
                      <Plus size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="px-4 py-4">
            <button
              type="button"
              onClick={go}
              className="w-full flex items-center justify-center gap-2 bg-[#f74800] hover:bg-[#d93f00] text-white font-black text-[15px] py-4 rounded-full shadow-lg transition-all duration-200 active:scale-[0.98]"
            >
              <Search size={18} />
              Search
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DesktopHero() {
  const [tab, setTab] = useState(0);
  const [dest, setDest] = useState<HotelSuggestion | null>(null);
  const go = () => {
    const city = dest?.city || "Goa";
    const state = dest?.state || "";
    const country = dest?.country || "INDIA";
    window.location.href = `/hotels/results?city=${encodeURIComponent(city)}&state=${encodeURIComponent(state)}&country=${country}&chk_in=14/10/2026&chk_out=15/10/2026&adults=2&childs=0&num_rooms=1&customer_type=B2C`;
  };
  const tabs = [
    { label: "Hotels", icon: "/images/Hotel/hotel.svg" },
    { label: "Homes & Villas", icon: "/images/Hotel/home.svg" },
    { label: "Resorts", icon: "/images/Hotel/resorts.svg" },
    { label: "Apartments", icon: "/images/Hotel/apartment.svg" },
  ];
  return (
    <div className="hidden md:block relative w-full h-[500px]">
      <img
        alt="Find your perfect stay"
        className="absolute inset-0 w-full h-full object-cover"
        src="/images/Hotel/hotel-hero-background.png"
      />
      <div className="absolute inset-0" />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 px-6">
        <h1 className="text-4xl lg:text-[56px] font-black text-white text-center leading-tight drop-shadow-lg">
          Find Your Perfect Stay
        </h1>
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2">
          {[
            { t: "Best Price Guarantee", icon: "/images/Hotel/hotel-1.svg" },
            { t: "1M+ Hotels Worldwide", icon: "/images/Hotel/hotel-2.svg" },
            { t: "24x7 Customer Support", icon: "/images/Hotel/hotel-3.svg" },
          ].map((b) => (
            <div key={b.t} className="flex items-center gap-1 text-white/90">
              <img alt="" className="w-5 h-5 object-contain brightness-0 invert opacity-80" src={b.icon} />
              <span className="text-[14px] font-medium">{b.t}</span>
            </div>
          ))}
        </div>
        <div className="flex flex-col items-center w-full max-w-3xl">
          <div className="flex justify-center">
            <div className="inline-flex items-center bg-[#EDEDED] rounded-t-2xl px-2 pt-2 pb-0 gap-0.5 shadow-[0_-2px_8px_rgba(0,0,0,0.08)]">
              {tabs.map((t, i) => (
                <button
                  key={t.label}
                  type="button"
                  onClick={() => setTab(i)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-[13px] font-semibold whitespace-nowrap transition-all duration-200 ${
                    tab === i
                      ? "bg-[#a8a7a6] text-black shadow-sm"
                      : "text-black hover:text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <img
                    alt=""
                    className={`w-4 h-5 object-contain ${tab === i ? "brightness-0" : "opacity-50"}`}
                    src={t.icon}
                  />
                  {t.label}
                </button>
              ))}
            </div>
          </div>
          <div className="w-full">
            <div className="flex items-center bg-white rounded-full shadow-2xl border border-white/10">
              <div className="relative flex-[2] min-w-0">
                <div className="w-full px-3 lg:px-6 py-4 hover:bg-gray-50/80 transition-colors rounded-l-full">
                  <HotelWherePicker value={dest?.city || ""} onPick={setDest} />
                </div>
              </div>
              <div className="w-px h-10 bg-gray-200 flex-shrink-0" />
              <div className="relative flex-1 min-w-0">
                <button className="w-full flex flex-col items-start px-3 lg:px-5 py-4 hover:bg-gray-50/80 transition-colors text-left">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                    Check-in
                  </span>
                  <span className="text-[13px] font-semibold text-gray-900">14 Oct 2026</span>
                </button>
              </div>
              <div className="w-px h-10 bg-gray-200 flex-shrink-0" />
              <div className="relative flex-1 min-w-0">
                <button className="w-full flex flex-col items-start px-3 lg:px-5 py-4 hover:bg-gray-50/80 transition-colors text-left">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                    Check-out
                  </span>
                  <span className="text-[13px] font-semibold text-gray-900">15 Oct 2026</span>
                </button>
              </div>
              <div className="w-px h-10 bg-gray-200 flex-shrink-0" />
              <div className="relative flex-1 min-w-0">
                <button className="w-full flex flex-col items-start px-3 lg:px-5 py-4 hover:bg-gray-50/80 transition-colors text-left">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                    Who
                  </span>
                  <span className="text-[13px] font-semibold text-gray-900 truncate max-w-[140px]">
                    1 Room, 2 Adults
                  </span>
                </button>
              </div>
              <div className="flex-shrink-0 p-2">
                <button
                  type="button"
                  onClick={go}
                  className="flex items-center gap-2 bg-[#f74800] hover:bg-[#d93f00] text-white font-black text-[15px] px-5 lg:px-7 py-3.5 rounded-full shadow-lg transition-all duration-200 active:scale-95 whitespace-nowrap"
                >
                  <Search size={18} />
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ExclusiveOffers() {
  const [copied, setCopied] = useState<string | null>(null);
  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(null), 1500);
    return () => clearTimeout(t);
  }, [copied]);

  const copy = (code: string) => {
    try {
      navigator.clipboard?.writeText(code);
    } catch {
      /* clipboard unavailable */
    }
    setCopied(code);
  };

  return (
    <section aria-label="Hotel exclusive offers" className="w-full bg-[#efeeeb] section-pad max-sm:!px-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-10 py-7 md:py-9">
        <div className="flex items-end justify-between mb-5">
          <div>
            <h2 id="hotel-offers-heading" className="text-xl md:text-2xl font-bold text-gray-900 leading-tight">
              Exclusive Offers
            </h2>
            <p className="text-sm text-gray-700 mt-0.5">Get upto 45% Off on Hotel booking</p>
          </div>
        </div>
        <div className="sm:hidden">
          <div
            className="relative flex gap-3 overflow-x-auto snap-x snap-mandatory scroll-pl-4 scroll-smooth px-4 pb-1"
            style={{ scrollbarWidth: "none" }}
          >
            {hotelOffers.map((o) => (
              <div key={o.code} className="shrink-0 snap-start w-[86%]">
                <OfferCard offer={o} copied={copied} onCopy={copy} />
              </div>
            ))}
          </div>
        </div>
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {hotelOffers.map((o) => (
            <OfferCard key={o.code} offer={o} copied={copied} onCopy={copy} />
          ))}
        </div>
      </div>
    </section>
  );
}

function OfferCard({
  offer: o,
  copied,
  onCopy,
}: {
  offer: (typeof hotelOffers)[number];
  copied: string | null;
  onCopy: (code: string) => void;
}) {
  return (
    <article className="group flex flex-col rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300 h-full">
      <a href={o.href} className="relative block overflow-hidden" style={{ aspectRatio: "4 / 3" }}>
        <img
          alt={o.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          src={o.image}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />
        <div className="absolute bottom-0 left-0 p-4">
          <p className="text-white/85 text-[12px] font-medium leading-none mb-1.5">{o.tag}</p>
          <h3 className="text-white text-[22px] font-bold leading-tight">{o.title}</h3>
        </div>
      </a>
      <div className="flex flex-col px-3.5 pt-2.5 pb-3 gap-1.5">
        <p className="text-[11px] font-semibold text-gray-800 leading-snug">{o.desc}</p>
        <p className="text-[10px] text-gray-400 leading-none">Valid till : {o.valid}</p>
        <div className="flex justify-end">
          <button
            title={`Copy ${o.code}`}
            onClick={() => onCopy(o.code)}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-dashed text-[11px] font-bold tracking-wide transition-all duration-200 shrink-0 whitespace-nowrap border-gray-400 text-gray-700 hover:border-[#023341] hover:text-[#023341] active:scale-95"
          >
            {copied === o.code ? "Copied!" : o.code}
            <Copy size={11} />
          </button>
        </div>
      </div>
    </article>
  );
}

function Discover() {
  return (
    <section aria-label="Discover best hotels" className="w-full bg-[#efeeeb] section-pad max-sm:!px-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-10 py-7 md:py-9">
        <div className="mb-5 md:mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">Discover Best Hotels</h2>
          <p className="text-sm text-gray-700 mt-0.5">8 properties found</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-4 sm:gap-y-6">
          {discoverHotels.map((h) => (
            <article
              key={h.name}
              className="flex flex-row overflow-hidden rounded-2xl border border-gray-200 bg-white transition-shadow hover:shadow-md sm:flex-col"
            >
              <div className="relative min-h-[150px] w-[34%] shrink-0 bg-gray-100 sm:min-h-0 sm:w-full sm:aspect-[4/3]">
                <img
                  alt={h.name}
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover"
                  src={h.image}
                />
                {h.freeCancel && (
                  <span className="absolute left-2 top-2 hidden items-center gap-1 rounded-full bg-green-600 px-2 py-1 text-[10px] font-semibold text-white sm:flex">
                    <ShieldCheck size={11} aria-hidden="true" />
                    Free cancellation
                  </span>
                )}
              </div>
              <div className="flex min-w-0 flex-1 flex-col p-3 sm:p-3.5">
                <h3 className="text-[15px] font-bold leading-snug text-gray-900 sm:truncate" title={h.name}>
                  {h.name}
                </h3>
                <p className="mt-0.5 truncate text-[12px] text-gray-500">{h.city}</p>
                <div className="mt-1.5 flex items-center gap-1.5 sm:mt-2">
                  <span className="flex" aria-label={`${h.rating} out of 5`}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={12} className="fill-amber-400 text-amber-400" />
                    ))}
                  </span>
                  <span className="text-[12px] font-medium text-gray-700">{h.rating}</span>
                  <span className="text-[11px] text-gray-400">({h.reviews})</span>
                </div>
                <p className="mt-1.5 truncate text-[12px] text-gray-600 sm:mt-2">{h.amenities}</p>
                {h.freeCancel && (
                  <p className="mt-1.5 flex items-center gap-1 text-[11px] font-semibold text-green-600 sm:hidden">
                    <ShieldCheck size={12} aria-hidden="true" />
                    Free cancellation
                  </p>
                )}
                <div className="mt-auto flex items-end justify-between gap-2 border-t border-gray-100 pt-2.5 sm:mt-3 sm:block sm:pt-3">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0">
                      <span className="text-[18px] font-extrabold leading-tight text-gray-900">
                        {inr(h.price)}
                      </span>
                      <span className="text-[12px] text-gray-400 line-through">{inr(h.mrp)}</span>
                      <span className="text-[11px] font-semibold text-green-600">{h.off}</span>
                    </div>
                    <p className="mt-0.5 text-[11px] text-gray-500">per night, incl. taxes</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => (window.location.href = `/hotels/details/${slugify(h.name)}`)}
                    className="shrink-0 rounded-xl bg-[#F26522] px-3.5 py-2 text-xs font-bold text-white transition-opacity hover:opacity-90 active:scale-95 sm:mt-3 sm:w-full sm:py-2.5 sm:text-[13px]"
                  >
                    View details
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function HotelSeo() {
  return (
    <section aria-label="About hotel booking" className="w-full bg-[#efeeeb] py-10 md:py-12 section-pad">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-[#003b53] leading-snug mb-2">
          Online Hotel Booking – Find Your Perfect Stay Anywhere, Anytime
        </h1>
        <div className="text-[14px] md:text-[15px] leading-[1.75] text-gray-700 [&_h2]:text-lg [&_h2]:md:text-xl [&_h2]:font-bold [&_h2]:text-[#003b53] [&_h2]:mt-7 [&_h2]:mb-2.5 [&_p]:mb-3.5 [&_strong]:font-semibold [&_strong]:text-gray-900">
          <p>
            From luxury resorts to budget-friendly stays, MaujiTrip helps you compare and book
            verified hotels across India and the world — with transparent pricing, free
            cancellation options, and round-the-clock support.
          </p>
          <h2>Hotels, Villas, Resorts & Apartments</h2>
          <p>
            Whether you need a family room in Goa, a business stay in Mumbai, a romantic villa
            in Udaipur or a serviced apartment for longer trips, explore options for every
            travel style and budget.
          </p>
          <h2>Best Price Guarantee</h2>
          <p>
            With access to 1M+ properties worldwide and exclusive member deals, you always get
            a great price — plus promotional offers across eligible bookings through the year.
          </p>
        </div>
      </div>
    </section>
  );
}

export default function HotelsPage() {
  return (
    <SiteChrome active="hotels">
      <div className="min-h-screen pb-16 md:pb-0" style={{ backgroundColor: "rgb(237, 241, 247)" }}>
        <div className="relative w-full bg-[#efeeeb]">
          <MobileHero />
          <DesktopHero />
        </div>
        <ExclusiveOffers />
        <Discover />
        <HotelSeo />
        <PageFaq title="Hotel Booking FAQs" items={hotelFaqs} />
      </div>
    </SiteChrome>
  );
}
