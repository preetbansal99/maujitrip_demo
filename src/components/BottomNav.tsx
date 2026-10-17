"use client";

import { useState } from "react";

function HomeIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="25"
      height="25"
      viewBox="0 0 24 24"
      className={`transition-colors duration-200 ${active ? "text-[#003b53]" : "text-[#003b53]/55"}`}
    >
      <path
        d="M12 2.8 L3.5 9.6 V19 a2.2 2.2 0 0 0 2.2 2.2 h12.6 A2.2 2.2 0 0 0 20.5 19 V9.6 Z"
        fill="currentColor"
        stroke="#fff"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="10.2" r="1.5" fill="#fff" />
      <path d="M9.8 21.2 v-4.4 a2.2 2.2 0 0 1 4.4 0 v4.4 Z" fill="#fff" />
    </svg>
  );
}

function TagIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="25"
      height="25"
      viewBox="0 0 24 24"
      className={`transition-colors duration-200 ${active ? "text-[#003b53]" : "text-[#003b53]/55"}`}
    >
      <g transform="rotate(-14 12 12)">
        <path
          d="M4 6.8 A2.3 2.3 0 0 1 6.3 4.5 h5.4 a2.3 2.3 0 0 1 1.63.68 l6.6 6.6 a2.3 2.3 0 0 1 0 3.25 l-5 5 a2.3 2.3 0 0 1 -3.25 0 l-6.6 -6.6 A2.3 2.3 0 0 1 4 11.8 Z"
          fill="currentColor"
          stroke="#fff"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        <circle cx="9.4" cy="9.4" r="1.35" fill="#fff" />
        <circle cx="14.6" cy="14.6" r="1.35" fill="#fff" />
        <line x1="15.1" y1="8.9" x2="8.9" y2="15.1" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
      </g>
    </svg>
  );
}

function ChatIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="25"
      height="25"
      viewBox="0 0 24 24"
      className={`transition-colors duration-200 ${active ? "text-[#003b53]" : "text-[#003b53]/55"}`}
    >
      <line x1="12" y1="4" x2="12" y2="6.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="3" r="1.5" fill="currentColor" stroke="#fff" strokeWidth="1" />
      <path
        d="M4.6 11 a4.4 4.4 0 0 1 4.4 -4.4 h6 A4.4 4.4 0 0 1 19.4 11 v3.4 a4.4 4.4 0 0 1 -4.4 4.4 h-4.2 l-3 2.6 a0.7 0.7 0 0 1 -1.16 -0.53 Z"
        fill="currentColor"
        stroke="#fff"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <circle cx="9.3" cy="11.6" r="1.45" fill="#fff" />
      <circle cx="14.7" cy="11.6" r="1.45" fill="#fff" />
      <path d="M9.6 15 q2.4 1.9 4.8 0" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function BagIcon({ active }: { active: boolean }) {
  return (
    <svg
      width="25"
      height="25"
      viewBox="0 0 24 24"
      className={`transition-colors duration-200 ${active ? "text-[#003b53]" : "text-[#003b53]/55"}`}
    >
      <path
        d="M9.2 7 V5.4 a2.2 2.2 0 0 1 2.2 -2.2 h1.2 a2.2 2.2 0 0 1 2.2 2.2 V7"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <rect x="3.8" y="6.8" width="16.4" height="14" rx="3.2" fill="currentColor" stroke="#fff" strokeWidth="1.4" />
      <line x1="8.6" y1="9.6" x2="8.6" y2="18" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="15.4" y1="9.6" x2="15.4" y2="18" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export default function BottomNav({ onAccount }: { onAccount: () => void }) {
  const [active, setActive] = useState("Home");

  const items = [
    {
      label: "Home",
      icon: (on: boolean) => <HomeIcon active={on} />,
      action: () => (window.location.href = "/"),
    },
    {
      label: "Offers",
      icon: (on: boolean) => <TagIcon active={on} />,
      action: () => {
        const el = document.getElementById("offers-heading");
        if (el) el.scrollIntoView({ behavior: "smooth" });
        else window.location.href = "/#offers-heading";
      },
    },
    { label: "Chatbot", icon: (on: boolean) => <ChatIcon active={on} />, action: () => (window.location.href = "/planner") },
    { label: "MyTrip", icon: (on: boolean) => <BagIcon active={on} />, action: onAccount },
  ];

  return (
    <nav
      aria-label="Bottom navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-2xl shadow-[0_-6px_24px_rgba(0,0,0,.10)] {/* taste-skill-ignore: fixed bottom bar floats above content */} pb-[env(safe-area-inset-bottom)]"
    >
      <div className="flex items-stretch justify-around px-2">
        {items.map((it) => {
          const on = active === it.label;
          return (
            <button
              key={it.label}
              type="button"
              aria-current={on ? "page" : undefined}
              onClick={() => {
                setActive(it.label);
                it.action();
              }}
              className="group flex-1 flex flex-col items-center gap-1 pt-2 pb-2.5 active:scale-95 transition-transform focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#003b53] rounded-xl"
            >
              <span
                className={`flex items-center justify-center w-14 h-8 rounded-full transition-colors duration-300 ${
                  on ? "bg-[#003b53]/12" : "bg-transparent group-active:bg-[#003b53]/5"
                }`}
              >
                {it.icon(on)}
              </span>
              <span
                className={`text-[13px] leading-none transition-colors duration-200 ${
                  on ? "text-[#003b53] font-bold" : "text-gray-600 font-medium"
                }`}
              >
                {it.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
