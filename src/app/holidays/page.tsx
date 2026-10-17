"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, Check, ChevronLeft, ChevronRight, Flame, Moon, Search } from "lucide-react";
import SiteChrome from "@/components/SiteChrome";
import Categories from "@/components/Categories";
import Destinations from "@/components/Destinations";
import PageFaq from "@/components/PageFaq";
import { categories } from "@/data/site";
import { demoPackages, holidayFaqs, inr } from "@/data/demo";

const BANNERS = [
  { alt: "Rajasthan Tour Packages", src: "/images/holiday-banners/rajasthan.avif" },
  { alt: "Europe Tour Packages", src: "/images/holiday-banners/europe.webp" },
  { alt: "Dubai Tour Packages", src: "/images/holiday-banners/dubai.avif" },
];

function Hero() {
  const [idx, setIdx] = useState(1);
  const [q, setQ] = useState("");
  const [sugs, setSugs] = useState<{ name: string; slug: string; country: string; state: string | null }[]>([]);
  const [sel, setSel] = useState<string | null>(null);
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % BANNERS.length), 4000);
    return () => clearInterval(t);
  }, []);
  useEffect(() => {
    if (q.trim().length < 2) {
      setSugs([]);
      return;
    }
    const t = setTimeout(async () => {
      try {
        const r = await fetch(`/api/live/holidays/destinations/search?q=${encodeURIComponent(q.trim())}`).then((x) => x.json());
        const d = r?.data ?? [];
        setSugs(Array.isArray(d) ? d : []);
      } catch {
        setSugs([]);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [q]);
  const go = () => {
    if (sel) window.location.href = `/holidays/destinations/${sel}`;
  };

  return (
    <section
      aria-label="Holiday packages"
      className="w-full px-4 sm:px-6 lg:px-8 pt-20 md:pt-24 lg:pt-28 pb-8 lg:pb-12 bg-gradient-to-b from-[#f0f6f7] to-white"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.05fr] lg:items-stretch gap-8 lg:gap-10 xl:gap-14">
        <div className="relative z-20 flex flex-col items-center text-center lg:items-start lg:text-left gap-4 sm:gap-5 lg:justify-center">
          <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.16em] border rounded-full px-3 py-1 text-[#023341] bg-[#023341]/[.06] border-[#023341]/10">
            Holiday Packages
          </span>
          <h1 className="text-gray-900 font-extrabold tracking-tight leading-[1.08] text-[26px] sm:text-[32px] md:text-4xl xl:text-5xl m-0">
            Plan your next{" "}
            <span
              className="text-[#023341] font-bold text-[34px] sm:text-[42px] md:text-5xl xl:text-6xl"
              style={{ fontFamily: "var(--font-dancing), cursive" }}
            >
              getaway
            </span>
          </h1>
          <p className="hidden lg:block text-gray-700 text-sm xl:text-[15px] leading-relaxed m-0 whitespace-nowrap">
            Handpicked holidays across India and the world — where every experience counts.
          </p>
          <div className="w-full max-w-xl mx-auto lg:mx-0 lg:max-w-none">
            <div className="relative w-full z-[60]">
              <div className="flex items-center bg-white rounded-2xl border border-gray-200 shadow-[0_10px_30px_rgba(0,0,0,0.08)] pl-3 sm:pl-4 pr-1.5 py-1.5 sm:py-2 gap-2 focus-within:border-[#023341]/40 transition-shadow">
                <Search size={16} className="text-gray-400 flex-shrink-0" />
                <input
                  value={q}
                  onChange={(e) => {
                    setQ(e.target.value);
                    setSel(null);
                  }}
                  onKeyDown={(e) => e.key === "Enter" && go()}
                  placeholder="Where do you want to go?"
                  className="flex-1 text-gray-800 bg-transparent outline-none text-sm placeholder:text-gray-400 min-w-0 py-1"
                  autoComplete="off"
                  type="text"
                />
                <button
                  type="button"
                  onClick={go}
                  className="text-white font-semibold text-xs sm:text-sm rounded-xl px-5 sm:px-7 py-2 sm:py-2.5 flex-shrink-0 whitespace-nowrap bg-[#023341] hover:bg-[#03485c] shadow-[0_4px_14px_rgba(2,51,65,0.35)] active:scale-[0.98] transition-all"
                >
                  Search
                </button>
              </div>
              {sugs.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-2 rounded-2xl border border-gray-100 bg-white p-2 shadow-2xl text-left">
                  <p className="px-3 pt-1.5 pb-1 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    Matching Destinations
                  </p>
                  {sugs.slice(0, 6).map((s) => (
                    <button
                      key={s.slug}
                      type="button"
                      onClick={() => (window.location.href = `/holidays/destinations/${s.slug}`)}
                      className="block w-full rounded-xl px-3 py-2 text-left hover:bg-gray-50"
                    >
                      <span className="block text-sm font-bold text-gray-900">{s.name}</span>
                      <span className="block text-[11px] text-gray-500">
                        {s.name}, {s.country}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="w-full flex flex-col items-center lg:items-start gap-2.5">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-gray-400">
              Browse by theme
            </span>
            <div className="flex lg:hidden flex-nowrap items-start justify-center gap-2.5 sm:gap-6 md:gap-8 overflow-x-auto no-scrollbar w-full">
              {categories.map((c) => (
                <button key={c.id} type="button" onClick={() => (window.location.href = `/holidays/themes/${c.theme}`)} className="group flex flex-col items-center gap-1.5 flex-shrink min-w-0">
                  <div className="w-11 h-11 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full overflow-hidden border-2 border-white shadow-[0_3px_10px_rgba(0,0,0,0.14)] transition-transform group-active:scale-95">
                    <img alt={c.title} className="w-full h-full object-cover" loading="lazy" src={c.image} />
                  </div>
                  <span className="text-[10px] sm:text-[11px] md:text-xs font-semibold text-gray-700 group-hover:text-[#023341] whitespace-nowrap transition-colors">
                    {c.title}
                  </span>
                </button>
              ))}
            </div>
            <div className="hidden lg:flex flex-wrap items-center gap-3">
              {categories.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => (window.location.href = `/holidays/themes/${c.theme}`)}
                  className="group flex items-center gap-2 rounded-full border border-gray-200 bg-white pl-1 pr-4 py-1 shadow-sm hover:border-[#023341]/40 transition-colors"
                >
                  <span className="w-8 h-8 rounded-full overflow-hidden">
                    <img alt={c.title} className="w-full h-full object-cover" loading="lazy" src={c.image} />
                  </span>
                  <span className="text-xs font-semibold text-gray-700 group-hover:text-[#023341]">
                    {c.title}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="hidden lg:block">
          <div className="relative w-full h-full min-h-[400px] rounded-3xl overflow-hidden shadow-[0_18px_45px_rgba(0,0,0,0.16)]">
            {BANNERS.map((b, i) => (
              <div
                key={b.src}
                className={`absolute inset-0 transition-opacity duration-[900ms] ease-in-out ${i === idx ? "opacity-100 z-[1]" : "opacity-0 z-0"}`}
              >
                <img
                  alt={b.alt}
                  className="w-full h-full object-cover"
                  loading={i === 0 ? "eager" : "lazy"}
                  src={b.src}
                />
              </div>
            ))}
            <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-t from-black/60 via-black/10 to-black/10" />
            <div className="absolute bottom-5 left-5 z-20">
              <p className="text-white font-extrabold text-xl drop-shadow-md">{BANNERS[idx].alt}</p>
              <p className="text-white/80 text-xs mt-0.5">Handpicked itineraries with stays & sights</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const DEALS = [
  { tag: "Up to 22% Off", title: "Manali Honeymoon Special", slug: "manali-honeymoon-special", desc: "4N/5D · Snow, candlelight dinner and a private cab throughout", price: 24999 },
  { tag: "Up to 16% Off", title: "Dubai City Break", slug: "dubai-city-break", desc: "4N/5D · Desert safari, Burj Khalifa and a dhow cruise", price: 58999 },
  { tag: "Up to 22% Off", title: "Goa Family Getaway", slug: "goa-family-getaway", desc: "3N/4D · North and South Goa with a river cruise", price: 14499 },
  { tag: "Special Deal", title: "Golden Jaisalmer: Desert Nights & Royal Heritage", slug: "golden-jaisalmer-desert-nights-royal-heritage", desc: "2N/3D · A 2 Nights 3 Days Journey Through Golden Forts, Desert Dunes & Rajasthani Culture", price: 6500 },
];

function Deals() {
  return (
    <section aria-label="Holiday deals" className="w-full bg-white py-12 section-pad">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-7">
          <h2 className="text-2xl md:text-3xl font-bold text-[#003b53]">Offers Worth Packing For</h2>
          <p className="text-sm text-gray-700 mt-1.5">Hand-picked holiday deals — gone before the season is.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {DEALS.map((d) => (
            <a
              key={d.title}
              href={`/holidays/packages/${d.slug}`}
              className="group relative rounded-3xl overflow-hidden shadow-sm block h-[220px]"
            >
              <div className="absolute inset-0 w-full h-full object-cover group-active:scale-105 transition-transform duration-500 bg-gradient-to-br from-[#003b53] to-[#1d6b8a]" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/10" />
              <span className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-500 text-white text-[11px] font-bold shadow-lg">
                <Flame size={11} />
                {d.tag}
              </span>
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-white font-extrabold text-lg">{d.title}</h3>
                <p className="text-white/75 text-xs mt-0.5">{d.desc}</p>
                <p className="mt-2 inline-flex items-baseline gap-1 px-3 py-1 rounded-full bg-white/95 shadow">
                  <span className="text-[10px] text-gray-700">From</span>
                  <span className="text-sm font-extrabold text-[#003b53]">{inr(d.price)}</span>
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

function Tribe() {
  const [tab, setTab] = useState<"domestic" | "international">("domestic");
  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get("tab");
    if (t === "international" || t === "domestic") setTab(t);
  }, []);
  const pkgs = useMemo(() => demoPackages.filter((p) => p.type === tab), [tab]);

  const scroll = (dir: number) => {
    document.getElementById("tribe-row")?.scrollBy({ left: dir * 500, behavior: "smooth" });
  };

  return (
    <section aria-label="Trips by tribe" className="w-full bg-[#efeeeb] py-12 section-pad overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-7">
          <h2 className="text-2xl md:text-3xl font-bold text-[#003b53]">Trips Tailored To Your Tribe</h2>
          <p className="text-sm text-gray-700 mt-1.5">
            Ready-made itineraries with stays, sights and surprises stitched in.
          </p>
          <div className="inline-flex bg-white rounded-full p-1 mt-5 shadow-sm">
            {(["domestic", "international"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={`px-6 py-2 rounded-full text-sm font-semibold capitalize transition-all ${
                  tab === t ? "bg-[#003b53] text-white shadow-md" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        <div className="relative group/carousel">
          <button
            aria-label="Scroll left"
            onClick={() => scroll(-1)}
            className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 -translate-x-2 w-9 h-9 items-center justify-center rounded-full bg-white shadow-md opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-200 hover:bg-[#003b53] hover:text-white text-[#003b53]"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            aria-label="Scroll right"
            onClick={() => scroll(1)}
            className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 translate-x-2 w-9 h-9 items-center justify-center rounded-full bg-white shadow-md opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-200 hover:bg-[#003b53] hover:text-white text-[#003b53]"
          >
            <ChevronRight size={18} />
          </button>
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 z-10 bg-gradient-to-r from-[#efeeeb] to-transparent hidden sm:block" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 z-10 bg-gradient-to-l from-[#efeeeb] to-transparent hidden sm:block" />
          <div
            id="tribe-row"
            className="flex gap-4 overflow-x-auto scroll-smooth no-scrollbar sm:snap-none snap-x snap-mandatory px-4 sm:px-2 pb-3"
          >
            {pkgs.map((p) => (
              <a
                key={p.id}
                href={`/holidays/packages/${p.slug}`}
                className="group relative rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 flex-shrink-0 w-[82vw] snap-center sm:w-[240px] lg:w-[calc((100%-3*1rem)/4)] h-[380px]"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#003b53] to-[#1d6b8a]" />
                {p.image && (
                  <img
                    src={p.image}
                    alt={p.title}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                <span className="absolute top-4 left-4 flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/90 text-gray-800 text-[11px] font-bold">
                  <Moon size={11} className="text-[#003b53]" />
                  {p.nights}N/{p.days}D
                </span>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white font-extrabold text-base leading-tight">{p.title}</h3>
                  {p.route && <p className="text-white/75 text-[11px] mt-1">{p.route}</p>}
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/20">
                    <p>
                      <span className="text-[10px] text-white/60">From </span>
                      <span className="text-base font-extrabold text-white">{inr(p.price)}</span>
                      <span className="text-[10px] text-white/60"> /person</span>
                    </p>
                    <span className="text-[11px] font-bold text-orange-400 uppercase tracking-wide">
                      View →
                    </span>
                  </div>
                </div>
              </a>
            ))}
            {pkgs.length === 0 && (
              <p className="text-sm text-gray-500 py-8">More international packages coming soon.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function HolidaySeo() {
  return (
    <section aria-label="About holiday packages" className="w-full bg-[#efeeeb] py-10 md:py-12 section-pad">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-[#003b53] leading-snug mb-2">
          Holiday Packages — Handpicked Getaways for Every Tribe
        </h1>
        <div className="text-[14px] md:text-[15px] leading-[1.75] text-gray-700 [&_h2]:text-lg [&_h2]:md:text-xl [&_h2]:font-bold [&_h2]:text-[#003b53] [&_h2]:mt-7 [&_h2]:mb-2.5 [&_p]:mb-3.5 [&_strong]:font-semibold [&_strong]:text-gray-900">
          <p>
            From family holidays and honeymoon escapes to group tours and seasonal getaways,
            explore <strong>tour packages</strong> covering popular destinations in India and
            abroad — with stays, sights and transfers stitched into one simple booking.
          </p>
          <h2>Trips Tailored To Your Tribe</h2>
          <p>
            Choose <strong>domestic</strong> escapes across Rajasthan, Goa, Kerala and Himachal,
            or go <strong>international</strong> with Dubai, Europe, Singapore and Thailand —
            every itinerary includes handpicked stays and curated experiences.
          </p>
        </div>
      </div>
    </section>
  );
}

export default function HolidaysPage() {
  return (
    <SiteChrome active="holidays">
      <div className="min-h-screen pb-16 md:pb-0">
        <Hero />
        <Categories />
        <Deals />
        <Tribe />
        <Destinations />
        <HolidaySeo />
        <PageFaq title="Holiday Tour Package FAQs" items={holidayFaqs} />
      </div>
    </SiteChrome>
  );
}
