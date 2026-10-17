"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import SiteChrome from "@/components/SiteChrome";
import PageFaq from "@/components/PageFaq";
import { DestinationPackageCard } from "@/app/holidays/destinations/[slug]/page";
import { demoPackages, holidayFaqs } from "@/data/demo";

const THEMES: Record<string, { title: string; desc: string; packages: string[] }> = {
  honeymoon: {
    title: "Honeymoon",
    desc: "Private transfers, candlelight dinners and rooms with a view.",
    packages: ["manali-honeymoon-special"],
  },
  family: {
    title: "Family",
    desc: "Easy pace, kid-friendly stays and sightseeing everyone can manage.",
    packages: ["goa-family-getaway", "royal-rajasthan-pink-city-to-golden-sands"],
  },
  adventure: {
    title: "Adventure",
    desc: "Trekking, rafting, paragliding and everything in between.",
    packages: [
      "ranthambore-wildlife-adventure-into-the-tigers-territory",
      "golden-jaisalmer-desert-nights-royal-heritage",
      "royal-rajasthan-heritage-wildlife-sacred-trails",
    ],
  },
  beach: {
    title: "Beach",
    desc: "Sand, sea and very little else on the schedule.",
    packages: ["goa-family-getaway"],
  },
  pilgrimage: {
    title: "Pilgrimage",
    desc: "Temple circuits and spiritual journeys.",
    packages: [],
  },
  "group-departure": {
    title: "Group Departure",
    desc: "Fixed dates, shared coach, better rates.",
    packages: [],
  },
};

function ThemeBody({ slug }: { slug: string }) {
  const theme = THEMES[slug];
  const [sort, setSort] = useState("Recommended");
  const [sortOpen, setSortOpen] = useState(false);

  const pkgs = useMemo(() => {
    const list = demoPackages.filter((p) => theme.packages.includes(p.slug));
    const sorted = [...list];
    if (sort === "Price: Low → High") sorted.sort((a, b) => a.price - b.price);
    if (sort === "Price: High → Low") sorted.sort((a, b) => b.price - a.price);
    return sorted;
  }, [theme, sort]);

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
            <span className="text-gray-800 font-medium">{theme.title}</span>
          </nav>
          <h1 className="mt-2 font-display text-2xl md:text-3xl font-bold text-[#003b53]">
            {theme.title} Holiday Packages
          </h1>
          <p className="mt-1 text-sm text-gray-600">{theme.desc}</p>
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
                <DestinationPackageCard key={p.id} p={p} destName={theme.title} />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl bg-white p-10 text-center">
              <p className="text-sm text-gray-500">No packages found for this theme yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ThemePage({ params }: { params: Promise<{ slug: string }> }) {
  const [slug, setSlug] = useState<string | null>(null);
  useEffect(() => {
    params.then((p) => setSlug(p.slug));
  }, [params]);

  if (!slug || !THEMES[slug]) {
    return (
      <SiteChrome active="holidays">
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-sm text-gray-500">Loading theme…</p>
        </div>
      </SiteChrome>
    );
  }

  return (
    <SiteChrome active="holidays">
      <ThemeBody slug={slug} />
      <div className="bg-[#efeeeb] section-pad pb-12">
        <div className="max-w-7xl mx-auto">
          <PageFaq title="Holiday Tour Package FAQs" items={holidayFaqs} />
        </div>
      </div>
    </SiteChrome>
  );
}
