"use client";

import { destinations, type Destination } from "@/data/site";

function Flame() {
  return (
    <svg
      width="57"
      height="57"
      viewBox="0 0 57 57"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-9 h-9 md:w-11 md:h-11"
      aria-hidden="true"
    >
      <path
        d="M28.5 2.96094C40.755 2.96094 51.6562 18.5647 51.6562 30.8672C51.6512 36.2859 49.7474 41.5314 46.2764 45.6924C42.8053 49.8534 37.9862 52.6669 32.6562 53.6436C34.2587 52.8689 35.6104 51.6576 36.5557 50.1494C37.5008 48.6413 38.0014 46.897 38 45.1172C38 39.8684 28.5 28.4922 28.5 28.4922C28.4958 28.4972 19 39.8696 19 45.1172C18.9986 46.897 19.4992 48.6413 20.4443 50.1494C21.3896 51.6576 22.7413 52.8689 24.3438 53.6436C19.0138 52.6669 14.1947 49.8534 10.7236 45.6924C7.25256 41.5314 5.34884 36.2859 5.34375 30.8672C5.45146 26.2868 6.65663 21.7991 8.8584 17.7812C9.01913 17.4724 9.26764 17.2175 9.57227 17.0488C9.87703 16.8802 10.2251 16.8051 10.5723 16.833C10.9193 16.8609 11.2505 16.9901 11.5244 17.2051C11.7983 17.4201 12.0029 17.7115 12.1123 18.042C13.3948 21.8657 16.1025 24.3359 19 24.3359C23.2512 24.3359 26.7188 19.2772 26.7188 13.0547C26.7516 10.5295 26.1207 8.04002 24.8896 5.83496C24.7497 5.58237 24.6706 5.30024 24.6582 5.01172C24.6459 4.72327 24.7005 4.43545 24.8184 4.17188C24.9388 3.91219 25.1211 3.68546 25.3486 3.51172C25.5762 3.33803 25.8428 3.2226 26.125 3.1748C26.9094 3.03819 27.7038 2.96658 28.5 2.96094Z"
        fill="#FC3A3A"
      />
    </svg>
  );
}

function Pin() {
  return (
    <svg
      className="w-3 h-3 shrink-0 opacity-90"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z" />
    </svg>
  );
}

function Card({ d }: { d: Destination }) {
  return (
    <a
      className="relative min-w-[250px] md:min-w-[300px] h-[120px] md:h-[140px] rounded-2xl overflow-hidden shrink-0 block group cursor-pointer"
      aria-label={`Explore ${d.label}`}
      href={`/holidays/destinations/${d.slug}`}
    >
      <img
        alt={d.label}
        loading="lazy"
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        src={d.image}
        onError={(e) => {
          (e.target as HTMLImageElement).src = "/images/offer-placeholder.png";
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
      <span className="absolute bottom-2.5 left-3 flex items-center gap-1 text-white text-[11px] md:text-xs font-semibold leading-none drop-shadow-sm">
        <Pin />
        {d.label}
      </span>
    </a>
  );
}

function Carousel({ items }: { items: Destination[] }) {
  return (
    <div className="flex gap-3 md:gap-4 overflow-x-auto no-scrollbar px-4 sm:px-6 pb-1">
      {items.map((d) => (
        <Card key={d.id} d={d} />
      ))}
    </div>
  );
}

export default function Destinations() {
  const indian = destinations.filter((d) => d.domestic);
  const intl = destinations.filter((d) => !d.domestic);

  return (
    <section aria-label="Trending destinations" className="w-full bg-[#efeeeb] py-8 overflow-hidden">
      <div className="space-y-12">
        <div>
          <div className="flex items-center justify-center gap-2 mb-8">
            <Flame />
            <div className="leading-none flex flex-col gap-[2px]">
              <h2
                id="indian-destinations"
                className="text-3xl font-bold text-[#0e3a4c] leading-none"
              >
                Indian Holidays
              </h2>
              <p className="text-sm text-[#0e3a4c] font-medium">Destinations</p>
            </div>
          </div>
          <Carousel items={indian} />
        </div>
        <div>
          <div className="flex items-center justify-center gap-2 mb-8">
            <Flame />
            <div className="leading-none flex flex-col gap-[2px]">
              <h2
                id="intl-destinations"
                className="text-3xl font-bold text-[#0e3a4c] leading-none"
              >
                International Holidays
              </h2>
              <p className="text-sm text-[#0e3a4c] font-medium">Destinations</p>
            </div>
          </div>
          <Carousel items={intl} />
        </div>
      </div>
    </section>
  );
}
