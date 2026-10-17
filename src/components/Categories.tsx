"use client";

import { ArrowUpRight } from "lucide-react";
import { categories } from "@/data/site";

export default function Categories() {
  return (
    <section aria-labelledby="category-heading" className="w-full bg-[#efeeeb] section-pad section-y">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h2 id="category-heading" className="font-display text-2xl md:text-3xl font-bold text-[#003b53]">
            Holiday Category
          </h2>
          <p className="text-sm md:text-base text-gray-700 mt-2">
            Find the perfect holiday experience crafted just for you
          </p>
        </div>

        {/* Mobile sticky stacking deck */}
        <div className="sm:hidden sticky-deck sticky-deck--6">
          {categories.map((c) => (
            <div key={c.id} className="sticky-card">
              <CategoryCard title={c.title} theme={c.theme} image={c.image} count={c.packagesCount} />
            </div>
          ))}
        </div>

        {/* Desktop / tablet grid */}
        <div className="hidden sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-5 lg:gap-3 xl:gap-4">
          {categories.map((c) => (
            <div key={c.id} className="h-64 md:h-72 lg:h-56 xl:h-60">
              <CategoryCard title={c.title} theme={c.theme} image={c.image} count={c.packagesCount} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CategoryCard({
  title,
  theme,
  image,
  count,
}: {
  title: string;
  theme: string;
  image: string;
  count: number;
}) {
  return (
    <article
      className="relative h-full group cursor-pointer"
      onClick={() => (window.location.href = `/holidays/themes/${theme}`)}
    >
      <div className="absolute inset-0 rounded-3xl overflow-hidden">
        <img
          alt={title}
          loading="lazy"
          src={image}
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
      </div>
      {count > 0 && (
        <div className="absolute top-4 left-4 z-10">
          <span className="px-3 py-1 rounded-full bg-white/90 text-[#003b53] text-xs font-semibold shadow-sm">
            {count} Trips
          </span>
        </div>
      )}
      <div className="absolute bottom-4 left-4 z-20 max-w-[65%] lg:max-w-none lg:right-3">
        <h3 className="text-white font-bold text-lg lg:text-[11px] xl:text-sm leading-snug lg:whitespace-nowrap">
          {title}
        </h3>
      </div>
      <div
        className="absolute bottom-0 right-0 z-20 w-[52px] h-[52px] lg:w-[42px] lg:h-[42px] rounded-tl-[26px] lg:rounded-tl-[21px] bg-[#efeeeb]"
        aria-hidden="true"
      />
      <button
        type="button"
        aria-label={`Explore ${title}`}
        tabIndex={-1}
        className="absolute bottom-1.5 right-1.5 z-30 flex h-9 w-9 lg:h-7 lg:w-7 items-center justify-center rounded-full bg-[#023341] text-white transition-transform group-hover:scale-110"
      >
        <ArrowUpRight size={16} />
      </button>
    </article>
  );
}
