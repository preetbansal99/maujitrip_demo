"use client";

import { useEffect, useMemo, useState } from "react";
import { Car, ChevronDown, Hotel, MapPin, TrainFront } from "lucide-react";
import SiteChrome from "@/components/SiteChrome";
import { categories } from "@/data/site";
import { inr } from "@/data/demo";

interface Pkg {
  slug: string;
  title: string;
  nights: number;
  days: number;
  route: string;
  short_description: string;
  base_price: number;
  mrp_price: number | null;
  image: string | null;
  destination: any;
}

function Card({ p }: { p: Pkg }) {
  const dest =
    typeof p.destination === "object" && p.destination !== null
      ? p.destination.name
      : p.destination || "";
  const off = p.mrp_price ? Math.round((1 - p.base_price / p.mrp_price) * 100) : 0;
  return (
    <div
      role="link"
      tabIndex={0}
      onClick={() => (window.location.href = `/holidays/packages/${p.slug}`)}
      onKeyDown={(e) => e.key === "Enter" && (window.location.href = `/holidays/packages/${p.slug}`)}
      className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden flex flex-col group cursor-pointer"
    >
      <div className="relative h-40 flex-shrink-0 overflow-hidden">
        {p.image ? (
          <img
            alt={p.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            src={p.image}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#003b53] to-[#1d6b8a]" />
        )}
        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-[#003b53]/90 text-white text-[10px] font-bold backdrop-blur-sm">
          {p.nights}N/{p.days}D
        </span>
        {dest && (
          <span className="absolute bottom-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/90 text-[#003b53] text-[10px] font-semibold shadow-sm">
            <MapPin size={9} className="text-orange-500" />
            {dest}
          </span>
        )}
      </div>
      <div className="flex flex-col flex-1 p-3 gap-2">
        <div>
          <h3 className="text-sm font-extrabold text-[#003b53] leading-snug line-clamp-2">
            {p.title}
          </h3>
          <p className="text-[10px] text-gray-400 mt-0.5">
            {p.nights}N / {p.days}D
          </p>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {[
            { t: "Train", icon: <TrainFront size={11} /> },
            { t: "Hotel", icon: <Hotel size={11} /> },
            { t: "Transfer", icon: <Car size={11} /> },
          ].map((x) => (
            <span
              key={x.t}
              title={x.t}
              className="flex items-center justify-center w-6 h-6 rounded-full bg-[#003b53] text-white flex-shrink-0"
            >
              {x.icon}
            </span>
          ))}
        </div>
        {p.route && (
          <div className="flex items-center gap-1 flex-wrap">
            {p.route.split(/[·•]/).map((s, i, arr) => (
              <span key={i} className="flex items-center gap-1">
                <span className="text-[9px] text-gray-500 font-medium">{s.trim()}</span>
                {i < arr.length - 1 && <span className="text-gray-300 text-[9px]">›</span>}
              </span>
            ))}
          </div>
        )}
        <p className="hidden sm:block text-[10px] text-gray-500 leading-relaxed line-clamp-2">
          {p.short_description}
        </p>
        <div className="mt-auto pt-2 border-t border-gray-100">
          <div className="flex items-center justify-between gap-2">
            <div className="flex-shrink-0">
              {off > 0 && (
                <p className="text-[8px] font-bold text-orange-500 uppercase tracking-wide">
                  {off}% OFF
                </p>
              )}
              <div className="flex items-baseline gap-0.5">
                <span className="text-base font-extrabold text-[#003b53]">{inr(p.base_price)}</span>
                <span className="text-[9px] text-gray-400">/person</span>
              </div>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                window.dispatchEvent(new CustomEvent("maujitrip:open-callback"));
              }}
              className="px-3 py-1.5 rounded-lg border border-[#003b53] text-[#003b53] text-[10px] font-bold hover:bg-[#003b53] hover:text-white transition-colors flex-shrink-0"
            >
              Enquire Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HolidaysSearchPage() {
  const [pkgs, setPkgs] = useState<Pkg[] | null>(null);
  const [total, setTotal] = useState(0);
  const [sort, setSort] = useState("Recommended");
  const [sortOpen, setSortOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const all: Pkg[] = [];
        for (let page = 1; page <= 2; page++) {
          const r = await fetch(`/api/live/holidays/packages?page=${page}`).then((x) => x.json());
          const list = Array.isArray(r?.data) ? r.data : [];
          all.push(...list);
          if (!r?.meta || r.meta.current_page >= r.meta.last_page) break;
        }
        if (!cancelled) {
          setPkgs(all);
          setTotal(all.length >= 14 ? 14 : all.length);
        }
      } catch {
        if (!cancelled) setPkgs([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const sorted = useMemo(() => {
    const list = [...(pkgs || [])];
    if (sort === "Price: Low → High") list.sort((a, b) => a.base_price - b.base_price);
    if (sort === "Price: High → Low") list.sort((a, b) => b.base_price - a.base_price);
    return list;
  }, [pkgs, sort]);
  const sorts = ["Recommended", "Price: Low → High", "Price: High → Low", "Top Rated"];

  return (
    <SiteChrome active="holidays">
      <div className="min-h-screen pb-16 md:pb-0 bg-[#efeeeb]">
        <div className="section-pad pt-20 md:pt-24 pb-4">
          <div className="max-w-7xl mx-auto">
            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-gray-500">
              <a href="/" className="hover:text-[#023341]">Home</a>
              <span>/</span>
              <a href="/holidays" className="hover:text-[#023341]">Holidays</a>
            </nav>
            <h1 className="mt-2 font-display text-2xl md:text-3xl font-bold text-[#003b53]">
              Holiday Packages
            </h1>
            <p className="mt-1 text-sm text-gray-600">Explore our curated collection.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {categories.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => (window.location.href = `/holidays/themes/${c.theme}`)}
                  className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-semibold text-gray-700 hover:border-[#023341] hover:text-[#023341]"
                >
                  {c.title}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="section-pad pb-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-600" role="status">
                {pkgs === null ? "Loading…" : `${total || pkgs.length} packages found`}
              </p>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setSortOpen((v) => !v)}
                  className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-gray-700"
                >
                  {sort}
                  <ChevronDown size={13} />
                </button>
                {sortOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setSortOpen(false)} />
                    <div className="absolute right-0 top-full z-50 mt-1 w-48 rounded-xl border border-gray-100 bg-white p-1.5 shadow-xl">
                      {sorts.map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => {
                            setSort(s);
                            setSortOpen(false);
                          }}
                          className={`block w-full rounded-lg px-3 py-2 text-left text-xs font-medium ${
                            sort === s ? "bg-[#023341] text-white" : "text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {sorted.map((p) => (
                <Card key={p.slug} p={p} />
              ))}
            </div>
            {pkgs !== null && pkgs.length === 0 && (
              <p className="text-sm text-gray-500">No packages found.</p>
            )}
          </div>
        </div>
      </div>
    </SiteChrome>
  );
}
