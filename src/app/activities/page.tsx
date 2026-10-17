"use client";

import { ArrowRight, Clock, MapPin, Star, Ticket } from "lucide-react";
import SiteChrome from "@/components/SiteChrome";
import PageHero from "@/components/PageHero";
import { demoActivities, inr } from "@/data/demo";

export default function ActivitiesPage() {
  return (
    <SiteChrome active="activities">
      <PageHero
        title="Things To Do"
        subtitle="Sightseeing, adventure & experiences"
        icon={<Ticket size={26} />}
      />
      <section className="w-full bg-[#efeeeb] section-pad pb-12">
        <div className="max-w-7xl mx-auto">
          <p className="mb-3 text-sm text-gray-600" role="status">
            {demoActivities.length} experiences found
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {demoActivities.map((a) => (
              <article
                key={a.id}
                className="group overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm hover:shadow-xl transition-shadow"
              >
                <div className="relative flex h-36 items-center justify-center bg-gradient-to-br from-[#7b2d00] to-[#c04a00]">
                  <Ticket size={40} className="text-white/70" />
                  <span className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-black/50 px-2.5 py-1 text-[11px] font-bold text-white">
                    <Star size={11} className="fill-amber-400 text-amber-400" />
                    {a.rating}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-display text-base font-bold text-[#003b53] leading-snug">
                    {a.name}
                  </h3>
                  <p className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                    <MapPin size={11} /> {a.city}
                  </p>
                  <p className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                    <Clock size={11} /> {a.duration}
                  </p>
                  <div className="mt-3 flex items-end justify-between">
                    <p className="font-display text-lg font-extrabold text-[#023341]">
                      {inr(a.price)}
                      <span className="text-[11px] font-medium text-gray-500"> /person</span>
                    </p>
                    <button
                      type="button"
                      aria-label={`Book ${a.name}`}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-[#023341] text-white hover:bg-[#034a5c] transition-colors"
                    >
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </SiteChrome>
  );
}
