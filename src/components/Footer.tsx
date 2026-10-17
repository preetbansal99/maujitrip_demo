"use client";

import { useEffect, useState } from "react";
import { Apple, Play } from "lucide-react";
import { footerLinks } from "@/data/site";

export default function Footer() {
  const [mobile, setMobile] = useState("");
  const [sent, setSent] = useState(false);
  const [year, setYear] = useState(2026);
  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer role="contentinfo" className="bg-[#0a2e3e] text-white">
      <div className="max-w-7xl mx-auto section-pad pt-12 pb-6">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
          <div>
            <img
              alt="MaujiTrip"
              src="/images/footer-logo.png"
              className="h-12 w-auto object-contain"
            />
            <p className="mt-4 max-w-md text-[15px] leading-relaxed text-white/70">
              Travel more, worry less. MaujiTrip brings you the best deals on flights, hotels
              &amp; holidays, so you can focus on the moments that matter.
            </p>
          </div>
          <div>
            <h2 className="text-lg font-semibold">Download MaujiTrip App Now</h2>
            <form
              className="mt-3"
              onSubmit={(e) => {
                e.preventDefault();
                if (mobile.replace(/\D/g, "").length >= 10) setSent(true);
              }}
            >
              <div className="flex rounded-md overflow-hidden border border-white/20">
                <label htmlFor="footer-mobile" className="sr-only">
                  Mobile number for app link
                </label>
                <input
                  id="footer-mobile"
                  type="tel"
                  placeholder="Mobile number"
                  value={mobile}
                  onChange={(e) => {
                    setMobile(e.target.value);
                    setSent(false);
                  }}
                  className="flex-1 min-w-0 bg-white text-gray-800 placeholder:text-gray-400 px-4 py-2.5 text-sm outline-none"
                />
                <button
                  type="submit"
                  className="shrink-0 px-5 text-sm font-bold text-white transition-colors"
                  style={{ backgroundColor: "#c2410c" }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#9a3412")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#c2410c")}
                >
                  Get Link
                </button>
              </div>
              {sent && (
                <p className="mt-2 text-xs text-emerald-300" role="status">
                  App link sent to +91 {mobile.replace(/\D/g, "")}!
                </p>
              )}
            </form>
            <div className="mt-4 flex gap-3 flex-wrap">
              <a
                href="#"
                aria-label="Download on Google Play"
                className="flex items-center gap-2.5 rounded-xl bg-black border border-white/25 px-4 py-2 hover:border-white/60 transition-colors"
              >
                <Play size={26} className="fill-white text-white" />
                <span className="leading-tight">
                  <span className="block text-[13px] uppercase text-white/70">
                    Get it on
                  </span>
                  <span className="block text-base font-semibold">Google Play</span>
                </span>
              </a>
              <a
                href="#"
                aria-label="Download on the App Store"
                className="flex items-center gap-2.5 rounded-xl bg-black border border-white/25 px-4 py-2 hover:border-white/60 transition-colors"
              >
                <Apple size={28} className="fill-white text-white" />
                <span className="leading-tight">
                  <span className="block text-[13px] text-white/70">
                    Download on the
                  </span>
                  <span className="block text-base font-semibold">App Store</span>
                </span>
              </a>
            </div>
            <div className="mt-4 inline-flex max-w-full flex-wrap items-center gap-2 rounded-xl bg-white px-4 py-2.5">
              <span className="text-xs font-bold text-[#0a2e3e]">We Accept:</span>
              {["visa", "mastercard", "amex", "paypal"].map((p) => (
                <img
                  key={p}
                  src={`/images/${p}.svg`}
                  alt={p}
                  className="h-6 w-auto max-w-[64px] object-contain"
                  loading="lazy"
                />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="text-[15px] leading-relaxed text-white/70">
            <p>
              <span className="font-semibold text-white">Location:</span> G - 227, Sector 63
              Noida, 201301 Uttar Pradesh, India
            </p>
            <p className="mt-2">
              <span className="font-semibold text-white">Email:</span>{" "}
              <a href="mailto:info@maujitrip.com" className="hover:text-white">
                info@maujitrip.com
              </a>
            </p>
            <p className="mt-2">
              <span className="font-semibold text-white">Toll Free No:</span>{" "}
              <a href="tel:1800-270-0297" className="hover:text-white">
                1800-270-0297
              </a>
            </p>
            <p className="mt-2">
              <span className="font-semibold text-white">24*7 Service:</span>{" "}
              <a href="tel:8470009000" className="hover:text-white">
                8470009000
              </a>
            </p>
          </div>
          {footerLinks.map((col) => (
            <nav key={col.title} aria-label={`${col.title} links`}>
              <h3 className="text-base font-semibold text-white">{col.title}</h3>
              <ul className="mt-3 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      className="text-[15px] text-white/70 hover:text-white transition-colors"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="my-6" aria-hidden="true" />
        <p className="text-sm text-white/70">
          All Rights Reserved | Copyright © {year} | Mauj Trip Limited.
        </p>
      </div>
    </footer>
  );
}
