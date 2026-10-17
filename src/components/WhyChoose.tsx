const FEATURES = [
  {
    icon: "/images/1.svg",
    title: "Accredited Agent",
    desc: "We offer easy and convenient flight bookings with attractive offers",
  },
  {
    icon: "/images/2.svg",
    title: "Lowest Price Deals",
    desc: "Easy Cancellation \u2022 Attractive Offers",
  },
  {
    icon: "/images/3.svg",
    title: "Discounted Deals",
    desc: "Worldwide Hotels \u2022 Holiday Package",
  },
  {
    icon: "/images/4.svg",
    title: "24/7 Customer Support",
    desc: "For all kind of travel related queries",
  },
];

export default function WhyChoose() {
  return (
    <section aria-labelledby="app-promo-heading" className="w-full bg-[#efeeeb] section-pad section-y">
      <div className="max-w-6xl mx-auto">
        <div className="w-full overflow-hidden rounded-[20px] md:rounded-[28px]">
          <img
            alt="Download MaujiTrip app — available on iOS and Android"
            className="w-full max-w-[1100px] mx-auto h-auto object-contain block"
            loading="lazy"
            src="/images/app-download.png"
          />
        </div>
        <h2 id="app-promo-heading" className="sr-only">
          Why choose MaujiTrip
        </h2>
        <ul className="mt-8 md:mt-10 grid grid-cols-2 gap-x-4 gap-y-6 md:grid-cols-4 md:gap-8 list-none p-0">
          {FEATURES.map((f) => (
            <li key={f.title} className="flex items-start gap-3">
              <img
                alt=""
                aria-hidden="true"
                className="w-[38px] h-[38px] md:w-[48px] md:h-[48px] object-contain shrink-0"
                loading="lazy"
                src={f.icon}
              />
              <div>
                <h3 className="text-[13px] md:text-[16px] font-semibold text-[#003b49] leading-tight">
                  {f.title}
                </h3>
                <p className="mt-1 text-[11px] md:text-[13px] leading-[1.4] text-[#4d4d4d]">
                  {f.desc}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
