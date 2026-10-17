"use client";

import { useEffect, useMemo, useState } from "react";
import { Car, ChevronDown, Hotel, MapPin, TrainFront, Zap } from "lucide-react";
import SiteChrome from "@/components/SiteChrome";
import PageFaq from "@/components/PageFaq";
import { categories } from "@/data/site";
import { demoPackages, holidayFaqs, inr } from "@/data/demo";

interface DestMeta {
  name: string;
  slug: string;
  country: string;
  state: string | null;
  type: string;
  best_time: string | null;
  description: string;
  image: string | null;
}

const GOA_SEO = [
  "Discover Paradise with Our All-Inclusive Goa Tour Packages",
  "Looking for sun-kissed beaches, vibrant nightlife, Portuguese heritage, and mouthwatering seafood? Look no further! Our Goa Tour Packages are the perfect blend of adventure, relaxation, and culture—crafted for couples, families, solo travelers, and groups alike.",
  "Whether you're flying in from Delhi or any part of India, MaujiTrip offers affordable Goa tour packages with flights, accommodation, and exciting itineraries. Whether it's a romantic escape or a fun-filled family vacation, we've got you covered with tailor-made packages that promise comfort, convenience, and unforgettable memories.",
  "Why Choose MaujiTrip Goa Tour Packages?",
  "Custom itineraries for couples, families, and solo travelers. Inclusive of flights, hotel stays, sightseeing & meals. 24x7 support and guided tours available. Choose from North Goa, South Goa, or combo packages. Trusted by thousands of happy travelers.",
  "From serene beaches to exciting water sports, Goa has something for everyone. Our Goa tour packages help you experience the best of this tropical haven—without the hassle of planning every detail.",
];

export function DestinationPackageCard({ p, destName }: { p: (typeof demoPackages)[number]; destName: string }) {
  const off = p.mrp ? Math.round((1 - p.price / p.mrp) * 100) : 0;
  const enquire = () => window.dispatchEvent(new CustomEvent("maujitrip:open-callback"));
  const openPkg = () => (window.location.href = `/holidays/packages/${p.slug}`);
  return (
    <div
      role="link"
      tabIndex={0}
      onClick={openPkg}
      onKeyDown={(e) => e.key === "Enter" && openPkg()}
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
        <span className="absolute bottom-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/90 text-[#003b53] text-[10px] font-semibold shadow-sm">
          <MapPin size={9} className="text-orange-500" />
          {destName}
        </span>
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
        <div className="mt-auto pt-2 border-t border-gray-100">
          <div className="flex items-center justify-between gap-2">
            <div className="flex-shrink-0">
              {off > 0 && (
                <div className="flex items-center gap-0.5 mb-0.5">
                  <Zap size={8} className="text-orange-500 fill-orange-500" />
                  <span className="text-[8px] font-bold text-orange-500 uppercase tracking-wide">
                    {off}% OFF
                  </span>
                </div>
              )}
              <div className="flex items-baseline gap-0.5">
                <span className="text-base font-extrabold text-[#003b53]">{inr(p.price)}</span>
                <span className="text-[9px] text-gray-400">/person</span>
              </div>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                enquire();
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

function DestinationBody({ slug }: { slug: string }) {
  const [meta, setMeta] = useState<DestMeta | null>(null);
  const [sort, setSort] = useState("Recommended");
  const [sortOpen, setSortOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const r = await fetch(`/api/live/holidays/destinations/${slug}`).then((x) => x.json());
        if (!cancelled && r?.data) setMeta(r.data);
      } catch {
        /* offline fallback below */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  const name = meta?.name || slug.replace(/-tour-packages?$/, "").replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const pkgs = useMemo(() => {
    const n = name.toLowerCase();
    const list = demoPackages.filter(
      (p) =>
        p.dest.toLowerCase() === n ||
        p.title.toLowerCase().includes(n) ||
        p.route.toLowerCase().includes(n) ||
        p.slug.includes(slug.replace(/-tour-packages?$/, ""))
    );
    const sorted = [...list];
    if (sort === "Price: Low → High") sorted.sort((a, b) => a.price - b.price);
    if (sort === "Price: High → Low") sorted.sort((a, b) => b.price - a.price);
    return sorted;
  }, [name, slug, sort]);

  const sorts = ["Recommended", "Price: Low → High", "Price: High → Low", "Top Rated"];

  return (
    <div className="min-h-screen pb-16 md:pb-0 bg-[#efeeeb]">
      <div className="section-pad pt-20 md:pt-24 pb-4">
        <div className="max-w-7xl mx-auto">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-gray-500">
            <a href="/" className="hover:text-[#023341]">Home</a>
            <span>/</span>
            <a href="/holidays" className="hover:text-[#023341]">Holidays</a>
            <span>/</span>
            <span className="text-gray-800 font-medium">{name}</span>
          </nav>
          <h1 className="mt-2 font-display text-2xl md:text-3xl font-bold text-[#003b53]">
            {name} Holiday Packages
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            {name}, {meta?.country || "India"}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => (window.location.href = `/holidays/themes/${c.theme}`)}
                className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-semibold text-gray-700 hover:border-[#023341] hover:text-[#023341] transition-colors"
              >
                {c.title}
              </button>
            ))}
          </div>
          {meta?.best_time && (
            <p className="mt-3 text-sm text-gray-700">
              <span className="font-semibold">Best time to visit:</span> {meta.best_time}
            </p>
          )}
          {meta?.description && (
            <p className="mt-2 max-w-3xl text-sm text-gray-600">{meta.description}</p>
          )}
        </div>
      </div>

      <div className="section-pad pb-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-600" role="status">
              {pkgs.length} packages found
            </p>
            <div className="relative">
              <button
                type="button"
                onClick={() => setSortOpen((v) => !v)}
                className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-gray-700"
              >
                {sort} <ChevronDown size={13} />
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
          {pkgs.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {pkgs.map((p) => (
                <DestinationPackageCard key={p.id} p={p} destName={name} />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl bg-white p-10 text-center">
              <p className="text-sm text-gray-500">No packages found for this destination yet.</p>
            </div>
          )}

          {slug === "goa-tour-packages" && (
            <div className="mt-10 text-[14px] md:text-[15px] leading-[1.75] text-gray-700 [&_h2]:text-lg [&_h2]:md:text-xl [&_h2]:font-bold [&_h2]:text-[#003b53] [&_h2]:mt-7 [&_h2]:mb-2.5 [&_p]:mb-3.5 [&_strong]:font-semibold [&_strong]:text-gray-900 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ul]:space-y-1.5">
              {GOA_SEO.map((para, i) =>
                para.endsWith("?") ? (
                  <h2 key={i}>{para}</h2>
                ) : (
                  <p key={i}>{para}</p>
                )
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function DestinationPage({ params }: { params: Promise<{ slug: string }> }) {
  const [slug, setSlug] = useState<string | null>(null);
  useEffect(() => {
    params.then((p) => setSlug(p.slug));
  }, [params]);

  return (
    <SiteChrome active="holidays">
      {slug ? (
        <>
          <DestinationBody slug={slug} />
          <div className="bg-[#efeeeb] section-pad pb-12">
            <div className="max-w-7xl mx-auto">
              <PageFaq title="Holiday Tour Package FAQs" items={holidayFaqs} />
            </div>
          </div>
        </>
      ) : (
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-sm text-gray-500">Loading destination…</p>
        </div>
      )}
    </SiteChrome>
  );
}
