"use client";

import { Bus, Hotel, Phone, Plane, Sparkles, Umbrella, X } from "lucide-react";

const LINKS = [
  { label: "Plan your trip with AI", href: "/planner", icon: <Sparkles size={15} />, highlight: true },
  { label: "Flight", href: "/flights", icon: <Plane size={15} /> },
  { label: "Hotel", href: "/hotels", icon: <Hotel size={15} /> },
  { label: "Bus", href: "/bus", icon: <Bus size={15} /> },
  { label: "Holidays", href: "/holidays", icon: <Umbrella size={15} /> },
];

export default function MobileMenu({
  open,
  onClose,
  onLogin,
}: {
  open: boolean;
  onClose: () => void;
  onLogin: () => void;
}) {
  if (!open) return null;
  return (
    <>
      <div
        className="backdrop-enter fixed inset-0 bg-black/40 z-[1000] lg:hidden"
        onClick={onClose}
      />
      <nav
        aria-label="Mobile navigation"
        className="drawer-enter fixed top-0 right-0 h-full w-[80vw] max-w-[360px] bg-white z-[1002] lg:hidden flex flex-col shadow-2xl {/* taste-skill-ignore: nav drawer floats above the page */}"
      >
        <div className="flex items-center justify-between px-4 h-16 bg-gray-50 shrink-0">
          <img
            alt="MaujiTrip"
            className="h-9 w-auto object-contain"
            src="/images/maujitrip-logo.png"
          />
          <button
            className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            aria-label="Close menu"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-3 py-3">
          {LINKS.map((l) => (
            <a
              key={l.label}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-colors mb-1 ${
                (l as any).highlight
                  ? "bg-[#f74800]/10 text-[#f74800] hover:bg-[#f74800] hover:text-white"
                  : "text-gray-700 hover:bg-gray-50 hover:text-[#023341]"
              }`}
              href={l.href}
              onClick={onClose}
            >
              <span className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${(l as any).highlight ? "bg-[#f74800]/15" : "bg-gray-100 text-gray-700"}`}>
                {l.icon}
              </span>
              <span className="flex-1">{l.label}</span>
            </a>
          ))}
        </div>
        <div className="px-4 py-4 bg-gray-50 shrink-0 space-y-3">
          <a
            href="tel:1800-270-0297"
            className="flex items-center gap-2 text-sm text-gray-700 hover:text-[#023341] transition-colors"
          >
            <Phone size={14} />
            <span>1800-270-0297</span>
          </a>
          <button
            onClick={() => {
              onClose();
              onLogin();
            }}
            className="w-full px-4 py-2.5 bg-[#023341] text-white text-sm font-semibold rounded-xl hover:bg-[#034a5c] transition-colors"
          >
            Login / Sign up
          </button>
        </div>
      </nav>
    </>
  );
}
