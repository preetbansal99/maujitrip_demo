"use client";

import { Plane } from "lucide-react";
import { topRoutes } from "@/data/site";

export default function TopRoutes() {
  return (
    <section aria-labelledby="routes-heading" className="w-full bg-[#efeeeb] section-pad section-y">
      <div className="max-w-7xl mx-auto">
        <div className="relative rounded-2xl overflow-hidden -mx-3 sm:mx-0">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-30 pointer-events-none mix-blend-multiply"
            aria-hidden="true"
            style={{ backgroundImage: 'url("/images/world-all.png")' }}
          />
          <div className="relative z-10 px-3 sm:px-8 md:px-10 py-8 md:py-10">
            <div className="flex flex-col items-center mb-5 md:mb-7">
              <h2
                id="routes-heading"
                className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#023341] leading-none whitespace-nowrap text-center"
              >
                Top Flight Routes
              </h2>
              <div className="w-36 sm:w-48 md:w-56 -mt-0.5 self-center translate-x-[28%]" aria-hidden="true">
                <svg width="100%" viewBox="0 0 370 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="block overflow-visible">
                  <defs>
                    <linearGradient id="lineGrad" x1="289.394" y1="11.2679" x2="1.78086" y2="4.18463" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#023341" />
                      <stop offset="1" stopColor="#EBE9E4" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M1.85217 0.752643C42.5384 100.91 114.099 30.0597 291.779 16.3776"
                    stroke="url(#lineGrad)"
                    strokeWidth="4"
                    strokeDasharray="4 4"
                  />
                  <g transform="translate(288, -7) scale(0.72)">
                    <path
                      d="M27.1935 62.7343L32.0581 52.476L35.3989 52.102C35.5676 52.0831 35.6892 51.9312 35.6702 51.7622L35.2665 48.1562C35.2476 47.9875 35.0954 47.866 34.9267 47.8849L34.1967 47.9666L36.5566 42.9907L39.5245 42.6584C39.6932 42.6395 39.8148 42.4873 39.7959 42.3186L39.3921 38.7126C39.3733 38.5439 39.2211 38.4224 39.0524 38.4413L38.316 38.523L40.6761 33.5471L43.6439 33.2147C43.8126 33.1958 43.9342 33.0436 43.9153 32.8749L43.5115 29.2689C43.4927 29.1002 43.3405 28.9787 43.1718 28.9976L42.4354 29.0793L44.7955 24.1034L47.7634 23.771C47.9321 23.7521 48.0537 23.5999 48.0348 23.4312L47.631 19.8252C47.6122 19.6565 47.46 19.535 47.2913 19.5539L46.5549 19.6356L48.7037 15.1142C48.7881 14.9363 48.7084 14.7204 48.5281 14.6327L45.0595 12.9344C44.8792 12.8467 44.6627 12.9224 44.5734 13.1011L43.1417 16.0345L40.5457 17.4772L36.4303 19.8234L34.3073 20.089C34.1386 20.1079 34.017 20.2601 34.0359 20.4288L34.4397 24.0348C34.4585 24.2035 34.6107 24.325 34.7794 24.3061L35.5158 24.2244L33.1557 29.2003L30.1878 29.5327C30.0191 29.5516 29.8975 29.7038 29.9164 29.8725L30.3202 33.4785C30.339 33.6472 30.4912 33.7687 30.6599 33.7498L31.3963 33.6681L29.0362 38.644L26.0683 38.9764C25.8996 38.9953 25.778 39.1475 25.7969 39.3162L26.2007 42.9222C26.2195 43.0909 26.3717 43.2124 26.5404 43.1935L27.2768 43.1118L24.9167 48.0877L22.8137 48.326C22.645 48.3449 22.5234 48.4971 22.5423 48.6658L22.9461 52.2718C22.9649 52.4405 23.1171 52.562 23.2858 52.5431L24.0222 52.4614L27.1935 62.7343Z"
                      fill="#023341"
                    />
                  </g>
                </svg>
              </div>
            </div>

            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-5">
              {topRoutes.map((r) => (
                <li key={r.id}>
                  <a href="/flights" className="group flex items-center gap-3">
                    <span className="h-14 w-14 shrink-0 overflow-hidden rounded-2xl bg-white shadow-sm">
                      <img
                        src={r.image}
                        alt=""
                        loading="lazy"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/images/route-placeholder.png";
                        }}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    </span>
                    <span>
                      <span className="flex items-center gap-1.5 font-display text-lg font-extrabold text-[#023341]">
                        {r.fromCode}
                        <Plane size={15} className="text-[#023341]" />
                        {r.toCode}
                      </span>
                      <span className="block text-sm text-gray-600">
                        {r.from} – {r.to}
                      </span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
