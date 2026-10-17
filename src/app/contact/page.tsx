"use client";

import { useState } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import LegalPage from "@/components/LegalPage";

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  return (
    <LegalPage
      title="Contact Us"
      intro="Get in touch with MaujiTrip — available 24×7 for sales, bookings and support. Quick question or complex itinerary — we're just a message away."
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl bg-gray-50 p-4">
          <p className="flex items-start gap-2 text-sm text-gray-700">
            <MapPin size={15} className="mt-0.5 shrink-0 text-[#023341]" />
            G - 227, Sector 63, Noida, Uttar Pradesh 201301, India
          </p>
          <a
            href="https://www.google.com/maps/search/?api=1&query=MaujiTrip.Com+Sector+63+Noida"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block text-sm font-semibold text-[#023341] underline underline-offset-2"
          >
            View on Google Maps
          </a>
          <iframe
            title="MaujiTrip office map"
            loading="lazy"
            className="mt-3 h-48 w-full rounded-xl border border-gray-200"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.5214595023263!2d77.38706967607519!3d28.61412957567485!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfb3662c03901%3A0xd7700b5b45120381!2sMaujiTrip.Com!5"
          />
          <p className="mt-3 flex items-center gap-2 text-sm text-gray-700">
            <Phone size={15} className="shrink-0 text-[#023341]" />
            <a href="tel:1800-270-0297" className="hover:underline">1800-270-0297 (Toll Free)</a>
          </p>
          <p className="mt-2 flex items-center gap-2 text-sm text-gray-700">
            <Mail size={15} className="shrink-0 text-[#023341]" />
            <a href="mailto:info@maujitrip.com" className="hover:underline">info@maujitrip.com</a>
          </p>
        </div>
        <div className="rounded-2xl bg-gray-50 p-4">
          {sent ? (
            <p className="text-sm font-semibold text-green-700" role="status">
              Thanks! Our sales team will get back to you within 24 hours.
            </p>
          ) : (
            <form
              className="space-y-2.5"
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
            >
              <input
                required
                placeholder="Your name"
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#023341]"
              />
              <input
                required
                type="email"
                placeholder="Email address"
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#023341]"
              />
              <textarea
                required
                placeholder="How can we help?"
                rows={4}
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#023341]"
              />
              <button
                type="submit"
                className="w-full rounded-xl bg-[#023341] py-2.5 text-sm font-bold text-white hover:bg-[#034a5c]"
              >
                Send Message
              </button>
            </form>
          )}
          <p className="mt-3 text-xs text-gray-500">
            Sales queries: response within 24 hours. Support queries: response within 2–4 hours.
          </p>
        </div>
      </div>
    </LegalPage>
  );
}
