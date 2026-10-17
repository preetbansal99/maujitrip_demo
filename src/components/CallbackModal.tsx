"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

const DURATION = ["Less than 5 Nights", "Between 5 to 10 Nights", "More than 10 Nights"];
const PERSONS = ["Between 2 to 4", "Between 5 to 10", "10 and More"];
const RATINGS = [
  { v: "3-star", label: "3 Star" },
  { v: "4-star", label: "4 Star" },
  { v: "5-star", label: "5 Star" },
];

const inputCls =
  "w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500/40 focus:border-teal-500 transition";

export default function CallbackModal({
  open,
  onClose,
  autoOpen = true,
}: {
  open: boolean;
  onClose: () => void;
  autoOpen?: boolean;
}) {
  useEffect(() => {
    if (!autoOpen) return;
    const t = setTimeout(() => {
      const ev = new CustomEvent("maujitrip:open-callback");
      window.dispatchEvent(ev);
    }, 25000);
    return () => clearTimeout(t);
  }, [autoOpen]);

  const [agreed, setAgreed] = useState(false);
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const valid = agreed && name.trim() !== "" && mobile.replace(/\D/g, "").length >= 10 && email.includes("@");

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] overflow-y-auto bg-black/50 px-4 py-8 flex items-start justify-center"
      role="dialog"
      aria-modal="true"
      aria-label="Need Assistance"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl rounded-2xl shadow-2xl bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 bg-[#023341] rounded-t-2xl">
          <div>
            <p className="text-xs font-medium text-teal-300 uppercase tracking-widest mb-0.5">
              Get in touch with us
            </p>
            <h5 className="text-lg font-semibold text-white leading-tight">Need Assistance?</h5>
          </div>
          <button
            className="p-1.5 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>
        <div className="px-6 py-6">
          <form
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              onClose();
            }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-600">Name</label>
                <input
                  placeholder="Enter Name"
                  required
                  className={inputCls}
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  name="name"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-600">Contact Number</label>
                <input
                  placeholder="Enter Contact Number"
                  required
                  className={inputCls}
                  type="tel"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  name="mobile"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-600">Email Id</label>
                <input
                  placeholder="Enter Email Id"
                  required
                  className={inputCls}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  name="email"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-600">WhatsApp Number</label>
                <input
                  placeholder="Enter WhatsApp Number"
                  className={inputCls}
                  type="tel"
                  name="whatsapp_no"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-600">Departure City</label>
                <input
                  placeholder="Enter Departure City"
                  className={inputCls}
                  type="text"
                  name="departure_city"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-600">Travel Date</label>
                <input className={inputCls} type="date" name="travel_date" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-600">Duration</label>
                <select name="no_of_nights" className={inputCls} defaultValue={DURATION[0]}>
                  {DURATION.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-gray-600">Person</label>
                <select name="no_of_person" className={inputCls} defaultValue={PERSONS[0]}>
                  {PERSONS.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1 sm:col-span-2 sm:w-1/2">
                <label className="text-xs font-medium text-gray-600">Hotel Rating</label>
                <select name="hotel_rating" className={inputCls} defaultValue={RATINGS[0].v}>
                  {RATINGS.map((o) => (
                    <option key={o.v} value={o.v}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-5 flex items-start gap-2.5">
              <input
                id="lead_agree"
                required
                className="mt-0.5 h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500 cursor-pointer"
                type="checkbox"
                name="agreed"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
              />
              <label
                htmlFor="lead_agree"
                className="text-xs text-gray-700 leading-relaxed cursor-pointer"
              >
                I have read and agree to the{" "}
                <a
                  href="/user-agreement"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-600 font-medium hover:underline"
                >
                  User Agreement
                </a>{" "}
                &amp;{" "}
                <a
                  href="/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-teal-600 font-medium hover:underline"
                >
                  Privacy Policy
                </a>
              </label>
            </div>
            <div className="mt-5">
              <button
                type="submit"
                disabled={!valid}
                className="w-full sm:w-auto px-8 py-2.5 rounded-lg bg-[#023341] text-white text-sm font-semibold hover:bg-[#034a5e] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Get a Callback
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
