"use client";

import { useState } from "react";
import { ArrowLeftRight, Bus, Copy, Search } from "lucide-react";
import SiteChrome from "@/components/SiteChrome";
import WhyChoose from "@/components/WhyChoose";
import PageFaq from "@/components/PageFaq";
import { busFaqs, busOffers, busRoutes } from "@/data/demo";

function DesktopHero() {
  return (
    <div className="hidden md:block w-full px-4 md:px-8 pt-10 md:pt-14 mt-[30px] relative z-30">
      <div className="max-w-7xl mx-auto">
        <div className="relative w-full h-[380px]">
          <div className="absolute inset-0 overflow-hidden rounded-3xl">
            <img
              alt="Book bus tickets"
              className="w-full h-full object-cover"
              loading="eager"
              src="/images/bus/hero.jpg"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/10 pointer-events-none" />
          </div>
          <div className="relative z-10 h-full flex flex-col items-center justify-center px-10 gap-5 text-center">
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-white text-[11px] font-bold uppercase tracking-wider"
              style={{ background: "rgba(0, 59, 83, 0.8)", backdropFilter: "blur(6px)" }}
            >
              <Bus size={12} />
              2000+ Bus Operators
            </div>
            <div>
              <h1
                className="text-white font-extrabold text-[36px] leading-[1.12] m-0"
                style={{ textShadow: "rgba(0, 0, 0, 0.5) 0px 2px 20px" }}
              >
                Travel smarter. Arrive happy.
              </h1>
              <p
                className="text-white/75 text-[15px] font-medium mt-2"
                style={{ textShadow: "rgba(0, 0, 0, 0.4) 0px 1px 8px" }}
              >
                Book AC Sleeper, Volvo &amp; more across India
              </p>
            </div>
            <div className="flex items-center bg-white rounded-2xl pl-2 pr-2 py-2 gap-0 shadow-[0_8px_32px_rgba(0,0,0,0.28)] max-w-[920px] w-full">
              <div className="relative flex-[1.3] min-w-0">
                <div className="w-full flex flex-col items-start px-4 py-1 text-left cursor-text">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    From
                  </span>
                  <input
                    id="bus-from-lg"
                    placeholder="Departure city"
                    className="text-[14px] font-semibold whitespace-nowrap w-full bg-transparent outline-none text-gray-900 placeholder:text-gray-400"
                    type="text"
                    defaultValue="Delhi (ISBT Kashmere Gate)"
                  />
                </div>
              </div>
              <button
                type="button"
                aria-label="Swap origin and destination"
                className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center flex-shrink-0 hover:bg-gray-50 transition-colors mx-1"
              >
                <ArrowLeftRight size={14} className="text-gray-700" />
              </button>
              <div className="relative flex-[1.3] min-w-0">
                <div className="w-full flex flex-col items-start px-4 py-1 text-left cursor-text">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    To
                  </span>
                  <input
                    id="bus-to-lg"
                    placeholder="Destination city"
                    className="text-[14px] font-semibold whitespace-nowrap w-full bg-transparent outline-none text-gray-900 placeholder:text-gray-400"
                    type="text"
                    defaultValue="Lucknow (Alambagh)"
                  />
                </div>
              </div>
              <div className="w-px h-8 bg-gray-200 flex-shrink-0" />
              <div className="flex-1 min-w-0 px-4">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                  Travel Date
                </p>
                <input
                  id="bus-date-lg"
                  min="2026-10-14"
                  className="text-[14px] font-semibold text-gray-800 bg-transparent outline-none w-full cursor-pointer"
                  type="date"
                  defaultValue="2026-10-14"
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  const f = (document.getElementById("bus-from-lg") as HTMLInputElement)?.value || "Delhi (ISBT Kashmere Gate)";
                  const t = (document.getElementById("bus-to-lg") as HTMLInputElement)?.value || "Lucknow (Alambagh)";
                  const d = (document.getElementById("bus-date-lg") as HTMLInputElement)?.value || "2026-10-14";
                  window.location.href = `/search/bus?from=${encodeURIComponent(f)}&to=${encodeURIComponent(t)}&depart=${d}`;
                }}
                className="flex items-center gap-2 text-white font-semibold text-sm rounded-xl px-7 py-3 flex-shrink-0 whitespace-nowrap hover:opacity-90 transition-opacity"
                style={{ background: "rgb(0, 59, 83)" }}
              >
                <Search size={15} />
                Search Buses
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileHero({ onSearch }: { onSearch: () => void }) {
  return (
    <div className="md:hidden pt-16">
      <div className="w-full flex flex-col items-center px-5 py-8 gap-5 text-center">
        <div
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-white text-[10px] font-bold uppercase tracking-wider"
          style={{ background: "rgb(0, 59, 83)" }}
        >
          <Bus size={10} />
          2000+ Operators
        </div>
        <div>
          <h1 className="font-extrabold text-[22px] leading-[1.15] m-0" style={{ color: "rgb(0, 59, 83)" }}>
            Travel smarter. Arrive happy.
          </h1>
          <p className="text-gray-500 text-[12px] font-medium mt-1.5">
            AC Sleeper, Volvo &amp; more across India
          </p>
        </div>
        <div className="w-full bg-white rounded-2xl shadow-[0_6px_28px_rgba(0,0,0,0.14)] border border-gray-100 p-4 flex flex-col gap-3 text-left">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
              From
            </span>
            <input
              id="bus-from-sm"
              placeholder="Departure city"
              className="text-sm font-semibold text-gray-800 bg-gray-50 rounded-xl px-3 py-2.5 outline-none placeholder:text-gray-400 border border-gray-100"
              type="text"
              defaultValue="Delhi (ISBT Kashmere Gate)"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
              To
            </span>
            <input
              id="bus-to-sm"
              placeholder="Destination city"
              className="text-sm font-semibold text-gray-800 bg-gray-50 rounded-xl px-3 py-2.5 outline-none placeholder:text-gray-400 border border-gray-100"
              type="text"
              defaultValue="Lucknow (Alambagh)"
            />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
              Travel Date
            </span>
            <input
              id="bus-date-sm"
              min="2026-10-14"
              className="text-sm font-semibold text-gray-800 bg-gray-50 rounded-xl px-3 py-2.5 outline-none border border-gray-100 cursor-pointer"
              type="date"
              defaultValue="2026-10-14"
            />
          </div>
          <button
            type="button"
            onClick={onSearch}
            className="w-full flex items-center justify-center gap-2 text-white font-semibold text-sm rounded-xl py-3 hover:opacity-90 transition-opacity"
            style={{ background: "rgb(0, 59, 83)" }}
          >
            <Search size={15} />
            Search Buses
          </button>
        </div>
      </div>
    </div>
  );
}

function TopBusRoutes() {
  return (
    <section aria-label="Top bus routes" className="w-full bg-[#efeeeb] section-pad section-y">
      <div className="max-w-7xl mx-auto">
        <div className="relative rounded-2xl overflow-hidden bg-[#efeeeb]">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30 pointer-events-none mix-blend-multiply"
            aria-hidden="true"
            style={{ backgroundImage: 'url("/images/world-all.png")' }}
          />
          <div className="relative z-10 px-3 sm:px-6 md:px-8 py-7 md:py-9">
            <h2
              id="bus-routes-heading"
              className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#023341] text-center mb-6 md:mb-8"
            >
              Top Bus Routes
            </h2>
            <div className="flex flex-col">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 rounded-xl">
                {busRoutes.map((r) => (
                  <div key={r.city} className="flex items-start gap-3 px-3 sm:px-4 py-4">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gray-200 shadow-sm">
                      <img
                        alt={r.city}
                        loading="lazy"
                        className="w-full h-full object-cover"
                        src={r.image}
                      />
                    </div>
                    <div className="min-w-0 pt-0.5">
                      <p className="font-extrabold text-gray-900 text-[15px] sm:text-base leading-tight">
                        {r.city}
                      </p>
                      <p className="text-[12.5px] sm:text-[13px] text-gray-600 leading-snug mt-1">
                        To:{" "}
                        {r.to.map((c, i) => (
                          <span key={c}>
                            {i > 0 ? ", " : ""}
                            <button
                              type="button"
                              className="hover:underline transition-colors text-gray-600"
                            >
                              {c}
                            </button>
                          </span>
                        ))}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function BusOffers() {
  const [copied, setCopied] = useState<string | null>(null);
  const copy = (code: string) => {
    try {
      navigator.clipboard?.writeText(code);
    } catch {
      /* noop */
    }
    setCopied(code);
    setTimeout(() => setCopied((c) => (c === code ? null : c)), 1500);
  };

  return (
    <section aria-label="Bus offers" className="w-full bg-[#efeeeb] py-8 lg:py-10 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-center text-2xl md:text-3xl font-bold text-[#003b53] px-4 mb-6">
          Exclusive Offers
        </h2>
      </div>
      <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory px-4 sm:px-10 lg:px-14 pb-2 no-scrollbar">
        {busOffers.map((o) => (
          <div
            key={o.code}
            className="flex-shrink-0 snap-center w-[78vw] sm:w-[360px] lg:w-[320px] bg-white rounded-2xl border border-gray-100 overflow-hidden select-none"
          >
            <div className="relative h-[150px] sm:h-[170px]">
              <img
                alt={o.titleMain}
                className="w-full h-full object-cover"
                loading="lazy"
                draggable={false}
                src={o.image}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10" />
              <span
                className="absolute top-3 right-3 bg-white rounded-lg px-2.5 py-1 text-[11px] font-extrabold shadow-sm"
                style={{ color: o.badgeColor }}
              >
                {o.badge}
              </span>
              <div className="absolute bottom-3 left-4 right-4">
                <p className="text-white text-[12px] font-medium leading-tight">{o.titleTop}</p>
                <p className="text-white text-[17px] font-extrabold leading-tight mt-0.5">
                  {o.titleMain}
                </p>
              </div>
            </div>
            <div className="px-4 pt-3.5 pb-4">
              <p className="text-[13px] text-gray-600 leading-relaxed min-h-[40px]">{o.desc}</p>
              <div className="flex items-center justify-between mt-3 gap-2">
                <span className="text-[11px] text-gray-400 flex-shrink-0">Valid Till: {o.valid}</span>
                <button
                  type="button"
                  onClick={() => copy(o.code)}
                  className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[12px] font-bold border transition-colors flex-shrink-0"
                  style={{
                    backgroundColor: "rgb(243, 244, 246)",
                    borderColor: "rgb(229, 231, 235)",
                    color: "rgb(17, 24, 39)",
                  }}
                >
                  {copied === o.code ? "Copied!" : o.code}
                  <Copy size={13} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function BusPage() {
  const go = () => {
    const sm = document.getElementById("bus-from-sm") as HTMLInputElement | null;
    const wide = window.innerWidth >= 768;
    const f = wide
      ? (document.getElementById("bus-from-lg") as HTMLInputElement)?.value || "Delhi"
      : sm?.value || "Delhi";
    const t = wide
      ? (document.getElementById("bus-to-lg") as HTMLInputElement)?.value || "Lucknow"
      : (document.getElementById("bus-to-sm") as HTMLInputElement)?.value || "Lucknow";
    const d = wide
      ? (document.getElementById("bus-date-lg") as HTMLInputElement)?.value || "2026-10-14"
      : (document.getElementById("bus-date-sm") as HTMLInputElement)?.value || "2026-10-14";
    window.location.href = `/search/bus?from=${encodeURIComponent(f)}&to=${encodeURIComponent(t)}&depart=${d}`;
  };

  return (
    <SiteChrome active="bus">
      <div className="min-h-screen pb-16 md:pb-0">
        <DesktopHero />
        <MobileHero onSearch={go} />
        <TopBusRoutes />
        <BusOffers />
        <WhyChoose />
        <PageFaq title="Bus Ticket Booking FAQs" items={busFaqs} />
      </div>
    </SiteChrome>
  );
}
