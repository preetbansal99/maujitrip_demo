"use client";

import { useState } from "react";
import type { Qa } from "@/data/demo";

function MinusIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      className="w-3 h-3"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      className="w-3 h-3"
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

export default function PageFaq({ title, items }: { title: string; items: Qa[] }) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section aria-label={title} className="w-full bg-[#efeeeb] py-10 section-pad">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">{title}</h2>
        <div className="space-y-2">
          {items.map((f, i) => {
            const open = openIdx === i;
            return (
              <div
                key={f.question}
                className={`rounded-2xl transition-colors duration-300 px-5 md:px-6 ${
                  open ? "bg-white py-1" : ""
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(open ? null : i)}
                  className="w-full flex items-center justify-between gap-4 py-4 text-left"
                >
                  <span
                    className={`text-sm font-semibold leading-snug transition-colors duration-200 ${
                      open ? "text-orange-600" : "text-gray-900"
                    }`}
                  >
                    {f.question}
                  </span>
                  <span
                    className={`flex-shrink-0 w-5 h-5 rounded-full border flex items-center justify-center transition-colors duration-200 ${
                      open
                        ? "border-orange-500 bg-orange-50 text-orange-500"
                        : "border-gray-400 text-gray-400"
                    }`}
                  >
                    {open ? <MinusIcon /> : <PlusIcon />}
                  </span>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    open ? "max-h-96 opacity-100 pb-4" : "max-h-0 opacity-0"
                  }`}
                >
                  <p className="text-sm text-gray-600 leading-relaxed">{f.answer}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
