"use client";

import { useEffect, useState } from "react";
import { MapPin, ShieldCheck, Star } from "lucide-react";
import SiteChrome from "@/components/SiteChrome";
import PageFaq from "@/components/PageFaq";
import { slugify } from "@/lib/slug";
import { discoverHotels, hotelFaqs, inr } from "@/data/demo";

export default function HotelDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const [slug, setSlug] = useState<string | null>(null);
  useEffect(() => {
    params.then((p) => setSlug(p.slug));
  }, []);

  const hotel =
    discoverHotels.find((h) => slugify(h.name) === slug) || null;

  return (
    <SiteChrome active="hotels">
      {!hotel ? (
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-sm text-gray-500">Loading hotel…</p>
        </div>
      ) : (
        <HotelBody hotel={hotel} />
      )}
    </SiteChrome>
  );
}

function HotelBody({ hotel: h }: { hotel: (typeof discoverHotels)[number] }) {
  return (
    <div className="min-h-screen pb-16 md:pb-0 bg-[#efeeeb]">
      <div className="section-pad pt-20 md:pt-24 pb-10">
        <div className="max-w-6xl mx-auto">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-gray-500 mb-4">
            <a href="/" className="hover:text-[#023341]">Home</a>
            <span>/</span>
            <a href="/hotels" className="hover:text-[#023341]">Hotels</a>
            <span>/</span>
            <span className="text-gray-800 font-medium truncate">{h.name}</span>
          </nav>
          <div className="grid gap-6 lg:grid-cols-[1fr_340px] items-start">
            <div>
              <div className="relative rounded-3xl overflow-hidden h-56 md:h-80 bg-gradient-to-br from-[#023341] to-[#045a6e]">
                <img
                  alt={h.name}
                  src={h.image}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                {h.freeCancel && (
                  <span className="absolute left-4 top-4 flex items-center gap-1 rounded-full bg-green-600 px-2.5 py-1 text-[11px] font-semibold text-white">
                    <ShieldCheck size={12} />
                    Free cancellation
                  </span>
                )}
              </div>
              <h1 className="mt-4 font-display text-2xl md:text-3xl font-bold text-[#003b53]">
                {h.name}
              </h1>
              <p className="mt-1 flex items-center gap-1 text-sm text-gray-600">
                <MapPin size={13} /> {h.city}
              </p>
              <div className="mt-2 flex items-center gap-1.5">
                <span className="flex" aria-label={`${h.rating} out of 5`}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={13} className="fill-amber-400 text-amber-400" />
                  ))}
                </span>
                <span className="text-[13px] font-medium text-gray-700">{h.rating}</span>
                <span className="text-[12px] text-gray-400">({h.reviews} reviews)</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {h.amenities.split("·").map((a) => (
                  <span
                    key={a}
                    className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-semibold text-gray-700"
                  >
                    {a.trim()}
                  </span>
                ))}
              </div>
              <div className="mt-5 rounded-2xl border border-gray-200 bg-white p-4 md:p-5">
                <h2 className="text-base font-extrabold text-gray-900">About this stay</h2>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                  {h.name} in {h.city} offers comfortable rooms, {h.amenities.toLowerCase()} and
                  warm hospitality for holidays, business trips and family travel. Rated{" "}
                  {h.rating} by {h.reviews} verified guests.
                </p>
              </div>
            </div>
            <div className="w-full lg:sticky lg:top-24">
              <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-lg">
                <p className="text-[15px] font-extrabold text-gray-900">Booking Summary</p>
                <div className="mt-3 flex items-baseline gap-1.5">
                  <span className="text-[22px] font-black text-gray-900 leading-none">
                    {inr(h.price)}
                  </span>
                  <span className="text-[12px] text-gray-400 line-through">{inr(h.mrp)}</span>
                  <span className="text-[11px] font-semibold text-green-600">{h.off}</span>
                </div>
                <p className="mt-0.5 text-[11px] text-gray-500">per night, incl. taxes</p>
                <button
                  type="button"
                  onClick={() => window.dispatchEvent(new CustomEvent("maujitrip:open-login"))}
                  className="mt-4 w-full rounded-xl bg-[#f74800] py-3 text-sm font-bold text-white hover:bg-[#d63f00] transition-colors"
                >
                  Book Now
                </button>
                <p className="mt-2 flex items-center justify-center gap-1.5 text-[11px] text-gray-500">
                  <ShieldCheck size={13} className="text-green-600" />
                  Secure Booking Guarantee
                </p>
              </div>
            </div>
          </div>
          <div className="mt-8">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">You may also like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {discoverHotels
                .filter((x) => x.name !== h.name)
                .slice(0, 4)
                .map((x) => (
                  <a
                    key={x.name}
                    href={`/hotels/details/${slugify(x.name)}`}
                    className="group overflow-hidden rounded-2xl border border-gray-200 bg-white"
                  >
                    <div className="h-32 overflow-hidden bg-gray-100">
                      <img
                        alt={x.name}
                        src={x.image}
                        loading="lazy"
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-3">
                      <p className="text-sm font-bold text-gray-900 truncate">{x.name}</p>
                      <p className="text-xs text-gray-500">{x.city}</p>
                      <p className="mt-1 text-sm font-extrabold text-[#023341]">
                        {inr(x.price)}
                        <span className="text-[11px] font-medium text-gray-500"> /night</span>
                      </p>
                    </div>
                  </a>
                ))}
            </div>
          </div>
        </div>
      </div>
      <div className="section-pad pb-12">
        <div className="max-w-6xl mx-auto">
          <PageFaq title="Hotel Booking FAQs" items={hotelFaqs} />
        </div>
      </div>
    </div>
  );
}
