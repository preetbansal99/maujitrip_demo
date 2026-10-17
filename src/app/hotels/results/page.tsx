"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Search, ShieldCheck, SlidersHorizontal, Star } from "lucide-react";
import SiteChrome from "@/components/SiteChrome";
import HotelMap from "@/components/HotelMap";
import { discoverHotels, inr } from "@/data/demo";
import { slugify } from "@/lib/slug";

function matchCity(query: string, hotelCity: string) {
  const q = query.toLowerCase().split(/[(,]/)[0].trim();
  const h = hotelCity.toLowerCase();
  return q.length >= 3 && (h.includes(q) || q.includes(h));
}

function useQuery() {
  const [q, setQ] = useState<URLSearchParams | null>(null);
  useEffect(() => {
    setQ(new URLSearchParams(window.location.search));
  }, []);
  return q;
}

function FiltersPanel({
  onClose,
  maxP,
  setMaxP,
  stars,
  setStars,
}: {
  onClose: () => void;
  maxP: number;
  setMaxP: (v: number) => void;
  stars: number[];
  setStars: React.Dispatch<React.SetStateAction<number[]>>;
}) {
  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-bold text-gray-900">Filters</p>
        <button
          type="button"
          onClick={() => {
            setMaxP(25000);
            setStars([]);
          }}
          className="text-xs font-medium text-gray-500 hover:text-[#023341] hover:underline"
        >
          Reset All
        </button>
      </div>
      <p className="text-[11px] font-semibold text-gray-800 mb-2">Price per night</p>
      <div className="flex justify-between text-[10px] text-gray-700 mb-1.5">
        <span>₹1,000</span>
        <span>₹25,000</span>
      </div>
      <input
        min={1000}
        max={25000}
        step={500}
        type="range"
        value={maxP}
        onChange={(e) => setMaxP(Number(e.target.value))}
        className="w-full accent-[#023341]"
      />
      <p className="text-[11px] font-semibold text-gray-800 mt-4 mb-2">Star rating</p>
      <div className="flex gap-2">
        {[3, 4, 5].map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setStars((v) => (v.includes(s) ? v.filter((x) => x !== s) : [...v, s]))}
            className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-semibold border ${
              stars.includes(s)
                ? "bg-[#023341] text-white border-[#023341]"
                : "bg-white text-gray-700 border-gray-200"
            }`}
          >
            <Star size={11} className={stars.includes(s) ? "fill-amber-400 text-amber-400" : "text-gray-400"} />
            {s}+
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={onClose}
        className="mt-4 w-full rounded-xl bg-[#023341] py-2.5 text-sm font-bold text-white"
      >
        Show Stays
      </button>
    </div>
  );
}

function Results({ params }: { params: URLSearchParams }) {
  const city = params.get("city") || "Mumbai";
  const chkIn = params.get("chk_in") || "14/10/2026";
  const chkOut = params.get("chk_out") || "15/10/2026";
  const rooms = params.get("num_rooms") || "1";
  const adults = params.get("adults") || "2";
  const [q, setQ] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [maxP, setMaxP] = useState(25000);
  const [stars, setStars] = useState<number[]>([]);
  const prettyCity = city.charAt(0) + city.slice(1).toLowerCase();
  const meta = `${chkIn} · ${rooms} room${rooms === "1" ? "" : "s"} · ${adults} guest${adults === "1" ? "" : "s"} · 1 night`;

  const stays = discoverHotels.filter((h) => {
    if (!matchCity(city, h.city)) return false;
    if (h.price > maxP) return false;
    if (stars.length > 0 && !stars.some((s) => h.stars >= s)) return false;
    return true;
  });

  const stayCard = (h: (typeof discoverHotels)[number]) => (
    <article
      key={h.name}
      className="flex flex-row overflow-hidden rounded-2xl border border-gray-200 bg-white transition-shadow hover:shadow-md"
    >
      <div className="relative min-h-[150px] w-[34%] shrink-0 bg-gray-100">
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
      <div className="flex min-w-0 flex-1 flex-col p-3">
        <h3 className="text-[15px] font-bold leading-snug text-gray-900 truncate" title={h.name}>
          {h.name}
        </h3>
        <p className="mt-0.5 truncate text-[12px] text-gray-500">{h.city}</p>
        <div className="mt-1.5 flex items-center gap-1.5">
          <span className="flex" aria-label={`${h.rating} out of 5`}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} size={12} className="fill-amber-400 text-amber-400" />
            ))}
          </span>
          <span className="text-[12px] font-medium text-gray-700">{h.rating}</span>
          <span className="text-[11px] text-gray-400">({h.reviews})</span>
        </div>
        <p className="mt-1.5 truncate text-[12px] text-gray-600">{h.amenities}</p>
        <div className="mt-auto flex items-end justify-between gap-2 border-t border-gray-100 pt-2.5">
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
            className="shrink-0 rounded-xl bg-[#F26522] px-3.5 py-2 text-xs font-bold text-white transition-opacity hover:opacity-90 active:scale-95"
          >
            View details
          </button>
        </div>
      </div>
    </article>
  );

  return (
    <div className="h-screen flex flex-col bg-[#F5F5F0] pt-16 overflow-hidden">
      <div className="bg-white border-b border-gray-200 shrink-0 z-30 relative">
        <div className="flex items-center gap-3 px-4 py-3">
          <button
            type="button"
            aria-label="Back to hotels"
            onClick={() => (window.location.href = "/hotels")}
            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft size={16} className="text-gray-700" />
          </button>
          <div className="flex items-center gap-1.5 flex-1 min-w-0">
            <span className="text-[14px] font-bold text-gray-900 truncate">{prettyCity}</span>
            <span className="text-[12px] text-gray-400 truncate hidden sm:inline">· {meta}</span>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden md:block" />
            <span className="hidden sm:flex items-center gap-1.5 text-[12px] text-gray-700 whitespace-nowrap">
              {stays.length} stays
            </span>
            <button
              type="button"
              onClick={() => setFiltersOpen((v) => !v)}
              className="flex items-center gap-1.5 border border-gray-300 rounded-full px-3 py-1.5 text-[12px] font-semibold text-gray-700 hover:border-[#023341] hover:text-[#023341]"
            >
              <SlidersHorizontal size={13} /> Filters
            </button>
          </div>
        </div>
        <div className="md:hidden px-4 pb-3 space-y-2">
          <p className="sm:hidden text-[12px] text-gray-400 truncate">{meta}</p>
          <div className="relative w-full md:w-64">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && q.trim()) {
                  window.location.href = `/hotels/results?city=${encodeURIComponent(q.trim())}&chk_in=${chkIn}&chk_out=${chkOut}&adults=${adults}&childs=0&num_rooms=${rooms}&customer_type=B2C`;
                }
              }}
              placeholder="Search stays…"
              className="w-full pl-9 pr-8 py-2 text-[13px] bg-white border border-gray-200 rounded-full focus:outline-none focus:border-[#023341]"
            />
          </div>
        </div>
        {filtersOpen && (
          <div className="absolute right-4 top-full mt-1 w-72 rounded-2xl border border-gray-100 bg-white shadow-2xl z-40">
            <FiltersPanel
              onClose={() => setFiltersOpen(false)}
              maxP={maxP}
              setMaxP={setMaxP}
              stars={stars}
              setStars={setStars}
            />
          </div>
        )}
      </div>

      <div className="hidden md:flex flex-1 min-h-0 overflow-hidden">
        <div className="w-[52%] overflow-y-auto px-4 py-4 shrink-0">
          <div className="mb-3">
            <p className="flex items-center gap-1.5 text-[13px] font-semibold text-gray-600">
              {stays.length} stays in {prettyCity}
            </p>
          </div>
          {stays.length > 0 ? (
            <div className="space-y-3">
              {stays.map((h) => stayCard(h))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
              <p className="text-[14px] text-gray-400">No stays found for this search.</p>
            </div>
          )}
        </div>
        <div className="flex-1 p-3 min-h-0">
          <div className="relative h-full w-full rounded-2xl overflow-hidden border-2 border-[#FF511C]">
            <HotelMap city={city} />
          </div>
        </div>
      </div>

      <div className="md:hidden flex-1 relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="relative h-full w-full rounded-2xl overflow-hidden border-2 border-[#FF511C]">
            <HotelMap city={city} />
          </div>
        </div>
        <div
          className="absolute left-0 right-0 bottom-0 z-40 bg-white rounded-t-2xl shadow-2xl transition-transform"
        >
          <div className="flex flex-col items-center pt-2.5 pb-1 cursor-pointer shrink-0">
            <div className="w-10 h-1 bg-gray-300 rounded-full mb-2" />
            <div className="flex items-center justify-between w-full px-4">
              <p className="text-[13px] font-semibold text-gray-600">
                {stays.length} stays in {prettyCity}
              </p>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto px-3 pb-8 max-h-[45vh]">
            <div className="pt-2 space-y-3">
              {stays.length > 0 ? (
                stays.map((h) => stayCard(h))
              ) : (
                <p className="text-center text-[14px] text-gray-400">
                  No stays found for this search.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HotelResultsPage() {
  return (
    <SiteChrome active="hotels">
      <HotelResultsLoader />
    </SiteChrome>
  );
}

function HotelResultsLoader() {
  const q = useQuery();
  if (!q) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#F5F5F0]">
        <p className="text-sm text-gray-500">Loading stays…</p>
      </div>
    );
  }
  return <Results params={q} />;
}
