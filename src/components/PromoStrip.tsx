const TILES = [
  { label: "Flights", icon: "/images/assets/flight.svg", href: "/flights" },
  { label: "Hotels", icon: "/images/assets/hotel.svg", href: "/hotels" },
  { label: "Buses", icon: "/images/assets/Bus.svg", href: "/bus" },
  { label: "Holiday", icon: "/images/assets/holiday.svg", href: "/holidays" },
];

export default function PromoStrip() {
  return (
    <section aria-label="Promo and categories" className="lg:hidden w-full">
      <div className="px-4 pt-16 pb-6">
        <div className="flex items-center gap-3 rounded-2xl px-3.5 py-2.5 mt-3 mb-3 bg-gradient-to-br from-[#fff5f3] to-[#ffe8e2] border border-[#f5c6bb]">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-[#C0392B]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-tag text-white"
              aria-hidden="true"
            >
              <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z" />
              <circle cx="7.5" cy="7.5" r=".5" fill="currentColor" />
            </svg>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[15px] font-extrabold text-gray-900 leading-tight">
              Get 25% Off*
            </p>
            <p className="text-xs text-gray-700 mt-0.5">
              Use code <span className="font-bold tracking-wide text-[#C0392B]">MAUJIFIRST</span>
            </p>
          </div>
          <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-white/80 border border-[#f5c6bb] px-2.5 py-1 text-xs font-bold text-gray-800">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-star fill-amber-400 text-amber-400"
              aria-hidden="true"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            4.7
            <span className="sr-only"> rated by happy travellers</span>
          </span>
        </div>

        <div className="grid grid-cols-4 gap-2.5">
          {TILES.map((t) => (
            <button
              key={t.label}
              type="button"
              onClick={() => (window.location.href = t.href)}
              className="flex flex-col items-center justify-center gap-1.5 rounded-2xl py-3 px-1 bg-white border border-gray-200 shadow-[0_1px_4px_rgba(0,0,0,0.05)] transition-all duration-200 active:scale-95 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#023341]"
            >
              <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-[#FFF1EE]">
                <img alt="" aria-hidden="true" className="w-6 h-6 object-contain" src={t.icon} />
              </div>
              <span className="text-xs font-semibold text-gray-800 leading-none">{t.label}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
