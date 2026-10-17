"use client";

import { useState } from "react";
import { ChevronDown, Menu, Phone, Sparkles } from "lucide-react";
import MobileMenu from "./MobileMenu";

const NAV = [
  { key: "flights", label: "Flight", href: "/flights" },
  { key: "hotels", label: "Hotel", href: "/hotels" },
  { key: "bus", label: "Bus", href: "/bus" },
  { key: "activities", label: "Activities", href: "/activities" },
  { key: "holidays", label: "Holiday", href: "/holidays" },
];

export default function Header({ onLogin, active }: { onLogin: () => void; active?: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [tourOpen, setTourOpen] = useState(false);

  const linkCls = (key: string) =>
    `flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200 ${
      active === key
        ? "bg-[#d63f00] text-white"
        : "text-[#0D0D0D] hover:text-[#023341] hover:bg-[#f74800]/10"
    }`;

  return (
    <>
      <header
        role="banner"
        className="fixed top-0 left-0 right-0 z-[1001] bg-white transition-shadow duration-300"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <a href="/" aria-label="MaujiTrip home" className="flex-shrink-0">
              <img
                alt="MaujiTrip"
                className="h-11 w-auto object-contain"
                src="/images/maujitrip-logo.png"
              />
            </a>
            <nav aria-label="Main navigation" className="hidden lg:flex items-center gap-0">
              {NAV.map((item, i) => (
                <span key={item.label} className="flex items-center">
                  {i > 0 && (
                    <span className="text-black text-sm select-none mx-0.5" aria-hidden="true">
                      |
                    </span>
                  )}
                  <a
                    href={item.href}
                    className={linkCls(item.key)}
                  >
                    {item.label}
                  </a>
                </span>
              ))}
              <span className="text-black text-sm select-none mx-0.5" aria-hidden="true">
                |
              </span>
              <div className="relative">
                <button
                  type="button"
                  aria-expanded={tourOpen}
                  onClick={() => setTourOpen((v) => !v)}
                  className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200 bg-transparent border-none cursor-pointer text-[#0D0D0D] hover:text-[#023341] hover:bg-[#f74800]/10"
                >
                  Tour Packages
                  <ChevronDown
                    size={17}
                    className={`text-black transition-transform duration-200 ${tourOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {tourOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 rounded-xl bg-white p-2 shadow-xl"> {/* taste-skill-ignore: dropdown menu floats above the page */}
                    {[
                      { t: "Domestic Packages", href: "/holidays" },
                      { t: "International Packages", href: "/holidays?tab=international" },
                      { t: "Honeymoon Packages", href: "/holidays/themes/honeymoon" },
                      { t: "Group Departures", href: "/holidays/themes/group-departure" },
                    ].map((l) => (
                      <a
                        key={l.t}
                        href={l.href}
                        className="block rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-[#f74800]/10 hover:text-[#023341]"
                      >
                        {l.t}
                      </a>
                    ))}
                  </div>
                )}
              </div>
              <span className="mx-3" aria-hidden="true" />
              <a
                href="tel:1800-270-0297"
                className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-black hover:text-[#023341] hover:bg-[#023341]/5 transition-colors text-sm"
              >
                <Phone size={14} />
                <span className="hidden lg:flex flex-col text-[13px] leading-tight">
                  <span className="font-medium text-gray-900">Need Help?</span>
                  <span className="text-gray-600">1800-270-0297</span>
                </span>
              </a>
              <div className="relative ml-1">
                <a
                  href="/planner"
                  className={`flex items-center gap-1.5 px-4 py-1.5 text-sm font-semibold rounded-lg transition-colors duration-200 ${
                    active === "planner"
                      ? "bg-[#d63f00] text-white"
                      : "bg-[#f74800]/10 text-[#a83200] hover:bg-[#d63f00] hover:text-white"
                  }`}
                >
                  <Sparkles size={14} />
                  Plan your trip
                </a>
              </div>
              <div className="relative ml-1">
                <button
                  type="button"
                  onClick={onLogin}
                  className="flex items-center gap-1.5 px-4 py-1.5 bg-[#023341] text-white text-sm font-semibold rounded-lg hover:bg-[#034a5c] transition-colors duration-200"
                >
                  Login / Sign up
                  <ChevronDown size={13} />
                </button>
              </div>
            </nav>
            <button
              type="button"
              className="lg:hidden p-2 text-gray-600 hover:text-[#023341] transition-colors"
              aria-label="Open menu"
              onClick={() => setMenuOpen(true)}
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} onLogin={onLogin} />
    </>
  );
}
