export default function FlightRoutesLinks() {
  return (
    <section aria-label="Flight routes links" className="w-full bg-[#efeeeb]">
      <div className="mx-auto w-full px-4 xl:px-0 py-8 md:py-10" style={{ maxWidth: 1280 }}>
        <div className="space-y-8">
          <div>
            <h2 className="font-semibold mb-3" style={{ fontSize: 15, color: "rgb(26, 26, 26)" }}>
              Flight Routes
            </h2>
            <p style={{ fontSize: 16, lineHeight: "26px", color: "rgb(0, 59, 83)" }}>
              <span>
                <a
                  className="underline underline-offset-2 text-[#003b53] hover:text-[#f26522] transition-colors duration-200"
                  href="/flights-routes/bangalore-to-delhi"
                >
                  Bangalore to Delhi Flights
                </a>
              </span>
              <span>
                {" , "}
                <a
                  className="underline underline-offset-2 text-[#003b53] hover:text-[#f26522] transition-colors duration-200"
                  href="/flights-routes/bangalore-to-goa"
                >
                  Bangalore to Goa Flights
                </a>
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
