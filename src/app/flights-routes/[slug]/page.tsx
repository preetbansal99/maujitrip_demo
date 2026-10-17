"use client";

import { useEffect, useState } from "react";
import SiteChrome from "@/components/SiteChrome";
import Hero from "@/components/Hero";
import PageFaq from "@/components/PageFaq";
import { FlightsMobileHero } from "../../flights/page";
import { flightFaqs } from "@/data/demo";
import { buildFlightSearchUrl, type FlightSearchParams } from "@/lib/searchUrl";

const CITY_MAP: Record<string, { city: string; code: string }> = {
  delhi: { city: "Delhi", code: "DEL" },
  mumbai: { city: "Mumbai", code: "BOM" },
  bangalore: { city: "Bengaluru", code: "BLR" },
  bengaluru: { city: "Bengaluru", code: "BLR" },
  goa: { city: "Goa", code: "GOI" },
  dubai: { city: "Dubai", code: "DXB" },
  hyderabad: { city: "Hyderabad", code: "HYD" },
  kolkata: { city: "Kolkata", code: "CCU" },
  chennai: { city: "Chennai", code: "MAA" },
  jaipur: { city: "Jaipur", code: "JAI" },
  singapore: { city: "Singapore", code: "SIN" },
  bangkok: { city: "Bangkok", code: "BKK" },
  london: { city: "London", code: "LHR" },
};

function pretty(s: string) {
  return s.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function RouteBody({ slug }: { slug: string }) {
  const [a, b] = slug.split("-to-");
  const from = CITY_MAP[a] || { city: pretty(a || "Delhi"), code: "DEL" };
  const to = CITY_MAP[b] || { city: pretty(b || "Mumbai"), code: "BOM" };
  const title = `${from.city} to ${to.city} Flights`;

  const go = (p: FlightSearchParams) => {
    window.location.href = buildFlightSearchUrl(p);
  };

  return (
    <div className="min-h-screen bg-[#eef4f8] pb-16 md:pb-0">
      <div className="lg:hidden w-full px-4 pt-20 pb-10">
        <p className="text-center text-sm font-semibold text-gray-500 mb-3">{title}</p>
        <FlightsMobileHero onSearch={go} initFrom={from.code} initTo={to.code} />
      </div>
      <div className="hidden lg:block">
        <Hero onSearch={go} initFrom={from.code} initTo={to.code} />
      </div>
      <section
        aria-label="About this route"
        className="w-full bg-[#efeeeb] py-10 md:py-12 section-pad"
      >
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-[#003b53] leading-snug mb-2">
            {title}
          </h1>
          <div className="text-[14px] md:text-[15px] leading-[1.75] text-gray-700 [&_p]:mb-3.5 [&_strong]:font-semibold [&_strong]:text-gray-900">
            <p>
              Looking for <strong>{title.toLowerCase()}</strong>? Compare fares across airlines
              on MaujiTrip and pick a journey that fits your schedule and budget — with instant
              confirmation and zero convenience fee.
            </p>
            <p>
              Whether you are travelling for business, visiting family, or planning a holiday,
              our <strong>online flight booking</strong> platform makes{" "}
              <strong>flight ticket booking</strong> from {from.city} to {to.city} simple and
              convenient.
            </p>
            <p>
              Book one-way or round-trip fares, unlock student, senior-citizen and armed-forces
              specials, and travel with free cancellation options on eligible fares.
            </p>
          </div>
        </div>
      </section>
      <PageFaq title="Flight Booking FAQs" items={flightFaqs} />
    </div>
  );
}

export default function FlightRoutePage({ params }: { params: Promise<{ slug: string }> }) {
  const [slug, setSlug] = useState<string | null>(null);
  useEffect(() => {
    params.then((p) => setSlug(p.slug));
  }, [params]);

  return (
    <SiteChrome active="flights">
      {slug ? (
        <RouteBody slug={slug} />
      ) : (
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-sm text-gray-500">Loading route…</p>
        </div>
      )}
    </SiteChrome>
  );
}
