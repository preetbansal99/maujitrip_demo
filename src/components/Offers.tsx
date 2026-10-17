"use client";

import { useState } from "react";
import { offers } from "@/data/site";

const TABS = [
  { key: "all", label: "All Offers" },
  { key: "flight", label: "Flight" },
  { key: "hotel", label: "Hotel" },
  { key: "bus", label: "Bus" },
  { key: "holiday", label: "Holiday" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

function OfferCard({ heading, subtext, image }: { heading: string; subtext: string; image: string }) {
  return (
    <article className="relative h-full group">
      <div className="absolute inset-0 rounded-3xl overflow-hidden">
        <img
          alt={heading}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          src={image}
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/images/offer-placeholder.png";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
      </div>
      <div className="absolute bottom-4 left-4 z-10 max-w-[65%]">
        <h3 className="text-white font-bold text-base md:text-lg leading-tight drop-shadow-md">
          {heading}
        </h3>
        <p className="text-white/90 text-[11px] md:text-xs font-medium leading-normal mt-0.5">
          {subtext}
        </p>
      </div>
      <div
        className="absolute bottom-0 right-0 z-20 w-[52px] h-[52px] rounded-tl-[26px] bg-[#efeeeb]"
        aria-hidden="true"
      />
      <a
        href="#"
        aria-label={`View offer: ${heading}`}
        onClick={(e) => e.preventDefault()}
        className="absolute bottom-1.5 right-1.5 z-30 w-10 h-10 flex items-center justify-center rounded-3xl bg-[#003b53] hover:bg-[#002d40] active:scale-95 text-white shadow-lg transition-all duration-200"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-arrow-up-right"
          aria-hidden="true"
        >
          <path d="M7 7h10v10" />
          <path d="M7 17 17 7" />
        </svg>
      </a>
</article>
  );
}

export default function Offers() {
  const [tab, setTab] = useState<TabKey>("all");
  const visible = tab === "all" ? offers.slice(0, 4) : offers.filter((o) => o.tab === tab);

  return (
    <section aria-labelledby="offers-heading" className="w-full bg-[#efeeeb] scroll-mt-20">
      <div className="max-w-7xl mx-auto section-pad section-y">
        <p id="offers-description" className="sr-only">
          Browse exclusive travel offers by category.
        </p>
        <h2
          id="offers-heading"
          className="text-2xl md:text-3xl font-bold text-[#003b53] text-center mb-5"
        >
          Our Exclusive Offers
        </h2>
        <div className="mb-7 border-b border-gray-200">
          <div
            role="tablist"
            aria-label="Offer categories"
            className="flex items-center w-full overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden [&>button:first-child]:ml-auto [&>button:last-child]:mr-auto"
          >
            {TABS.map((t) => {
              const active = tab === t.key;
              return (
                <button
                  key={t.key}
                  id={`tab-${t.key}`}
                  role="tab"
                  type="button"
                  aria-selected={active}
                  aria-controls={`tabpanel-${t.key}`}
                  tabIndex={active ? 0 : -1}
                  onClick={() => setTab(t.key)}
                  className="relative shrink-0 pb-2.5 pt-1 px-4 text-sm font-medium transition-colors whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-[#003b53] focus-visible:ring-offset-2 rounded"
                >
                  <span className={active ? "text-[#003b53]" : "text-gray-600 hover:text-gray-800"}>
                    {t.label}
                  </span>
                  {active && (
                    <span
                      className="absolute bottom-0 left-4 right-4 h-0.5 bg-[#003b53] rounded-full"
                      aria-hidden="true"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div role="tabpanel" id={`tabpanel-${tab}`} aria-labelledby={`tab-${tab}`}>
          {/* Desktop / tablet grid */}
          <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
            {visible.map((o) => (
              <div key={o.id} className="h-64 md:h-72">
                <OfferCard heading={o.heading} subtext={o.subtext} image={o.image} />
              </div>
            ))}
          </div>
          {/* Mobile sticky stacking deck */}
          <div className="sm:hidden sticky-deck">
            {visible.map((o) => (
              <div key={o.id} className="sticky-card">
                <OfferCard heading={o.heading} subtext={o.subtext} image={o.image} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
