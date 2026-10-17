"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Plane,
  SlidersHorizontal,
  X,
} from "lucide-react";
import SiteChrome from "@/components/SiteChrome";
import { fareStrip } from "@/data/search";
import { inr } from "@/data/demo";
import { buildFlightSearchUrl } from "@/lib/searchUrl";

interface Fare {
  type: string;
  refundable: boolean;
  price: number;
  baggage: { sector: string; checkIn: string; cabin: string }[];
}

interface Segment {
  code: string;
  no: string;
  craft: string;
  fromCode: string;
  fromCity: string;
  fromTerminal: string;
  depart: string;
  departDate: string;
  toCode: string;
  toCity: string;
  toTerminal: string;
  arrive: string;
  arriveDate: string;
}

interface LiveFlight {
  id: string;
  airline: string;
  code: string;
  nos: string;
  fromCode: string;
  depart: string;
  departDate: string;
  toCode: string;
  arrive: string;
  arriveDate: string;
  stopCount: number;
  stops: string;
  duration: string;
  brand: string;
  refundable: boolean;
  price: number;
  segments: Segment[];
  fares: Fare[];
}

function fmtTime(iso: string) {
  return iso.slice(11, 16);
}

function fmtDate(iso: string) {
  return new Date(iso.slice(0, 10) + "T00:00:00").toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
  });
}

function fmtDur(dep: string, arr: string) {
  const ms = new Date(arr).getTime() - new Date(dep).getTime();
  const m = Math.max(0, Math.round(ms / 60000));
  return `${Math.floor(m / 60)}h ${m % 60}m`;
}

function fmtBrand(t: string) {
  if (!t) return "";
  if (t === t.toUpperCase()) return t.replace(/_/g, " ");
  return t
    .split(/[_ ]+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

function mapFlight(item: any, idx: number): LiveFlight | null {
  try {
    const raw: any[] = Array.isArray(item.segments) ? item.segments.flat() : [];
    const segs: Segment[] = raw.map((s: any) => ({
      code: s?.Airline?.AirlineCode || item.airline,
      no: s?.Airline?.FlightNumber || "",
      craft: s?.Craft || "",
      fromCode: s?.Origin?.AirportCode || "",
      fromCity: s?.Origin?.CityName || "",
      fromTerminal: s?.Origin?.Terminal || "",
      depart: fmtTime(s?.Origin?.DepTime || s?.Origin?.DepartTime || ""),
      departDate: fmtDate(s?.Origin?.DepTime || s?.Origin?.DepartTime || ""),
      toCode: s?.Destination?.AirportCode || "",
      toCity: s?.Destination?.CityName || "",
      toTerminal: s?.Destination?.Terminal || "",
      arrive: fmtTime(s?.Destination?.ArrTime || s?.Destination?.ArrivalTime || ""),
      arriveDate: fmtDate(s?.Destination?.ArrTime || s?.Destination?.ArrivalTime || ""),
    }));
    const fares: Fare[] = (item.FareList || []).map((f: any) => ({
      type: f?.FareType || "",
      refundable: !!f?.IsRefundable,
      price: Number(f?.DisplayedPrice ?? f?.OfferedPrice ?? 0),
      baggage: (f?.SeatBaggage || []).map((b: any) => ({
        sector: b?.Sector || "",
        checkIn: b?.CheckIn || "",
        cabin: b?.Cabin || "",
      })),
    }));
    if (fares.length === 0) return null;
    const cheapest = fares.reduce((a, b) => (a.price <= b.price ? a : b));
    const first = segs[0];
    const last = segs[segs.length - 1];
    const stopCount = Number(item.stops ?? Math.max(0, segs.length - 1));
    return {
      id: `${item.airline}-${first?.no || idx}`,
      airline: first?.code ? segName(item) : item.airline,
      code: item.airline,
      nos: segs.map((s) => `${s.code}-${s.no}`).join(", "),
      fromCode: item.from || first?.fromCode || "",
      depart: fmtTime(item.depart_time || ""),
      departDate: fmtDate(item.depart_time || ""),
      toCode: item.to || last?.toCode || "",
      arrive: fmtTime(item.arrival_time || ""),
      arriveDate: fmtDate(item.arrival_time || ""),
      stopCount,
      stops: stopCount === 0 ? "Non Stop" : `${stopCount} Stop`,
      duration: fmtDur(item.depart_time, item.arrival_time),
      brand: fmtBrand(cheapest.type),
      refundable: cheapest.refundable,
      price: cheapest.price,
      segments: segs,
      fares,
    };
  } catch {
    return null;
  }
}

function segName(item: any) {
  try {
    const raw: any[] = Array.isArray(item.segments) ? item.segments.flat() : [];
    return raw[0]?.Airline?.AirlineName || item.airline;
  } catch {
    return item.airline;
  }
}

function AirlineLogo({ code, size }: { code: string; size: number }) {
  const [err, setErr] = useState(false);
  if (err) {
    return (
      <span
        className="flex items-center justify-center rounded-full bg-[#023341] text-white font-extrabold"
        style={{ width: size, height: size, fontSize: size * 0.4 }}
      >
        {code.slice(0, 1)}
      </span>
    );
  }
  return (
    <img
      alt={code}
      width={size}
      height={size}
      className="object-contain"
      src={`/images/airlines/${code}.png`}
      onError={() => setErr(true)}
    />
  );
}

function slotOf(t: string) {
  const h = Number(t.split(":")[0]);
  if (h < 6) return "12AM - 6AM";
  if (h < 12) return "6AM - 12PM";
  if (h < 18) return "12PM - 6PM";
  return "6PM - 12AM";
}

function FlightCard({ f, onDetails }: { f: LiveFlight; onDetails: (f: LiveFlight) => void }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      <div className="hidden sm:flex items-center px-4 py-3 gap-3 overflow-hidden">
        <div className="flex flex-col items-center shrink-0" style={{ width: 56 }}>
          <AirlineLogo code={f.code} size={32} />
          <p className="text-[10px] font-bold text-gray-800 mt-0.5 text-center leading-tight w-full">
            {f.airline}
          </p>
          <p className="text-[8px] text-gray-400 text-center leading-tight">{f.nos}</p>
        </div>
        <div className="w-px self-stretch bg-gray-100 shrink-0" />
        <div className="flex items-center gap-2 flex-1 min-w-0 overflow-hidden">
          <div className="shrink-0">
            <p className="text-[10px] text-gray-400 mt-0.5">{f.fromCode}</p>
            <p className="text-xl font-extrabold text-gray-900 leading-none">{f.depart}</p>
            <p className="text-[9px] text-gray-400">{f.departDate}</p>
          </div>
          <div className="flex-1 flex flex-col items-center gap-0.5 min-w-0 px-1">
            <p className="text-[9px] font-semibold text-gray-400 truncate w-full text-center">
              {f.stops}
            </p>
            <div className="w-full flex items-center gap-1">
              <div className="flex-1 border-t border-dashed border-gray-300" />
              <img className="shrink-0 object-contain" alt="" src="/images/2.svg" style={{ width: 16, height: 11 }} />
              <div className="flex-1 border-t border-dashed border-gray-300" />
            </div>
            <p className="text-[9px] text-gray-400">{f.duration}</p>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-[10px] text-gray-400 mt-0.5">{f.toCode}</p>
            <p className="text-xl font-extrabold text-gray-900 leading-none">{f.arrive}</p>
            <p className="text-[9px] text-gray-400">{f.arriveDate}</p>
          </div>
        </div>
        <div className="w-px self-stretch bg-gray-100 shrink-0" />
        <div className="flex flex-col items-end shrink-0" style={{ minWidth: 90 }}>
          <span className="text-[9px] text-gray-400 text-right leading-tight">{f.brand}</span>
          {f.refundable ? (
            <span className="text-[9px] font-semibold leading-tight mb-0.5 text-green-600">
              ✓ Refundable
            </span>
          ) : (
            <span className="text-[9px] leading-tight mb-0.5 text-gray-400">Non Refundable</span>
          )}
          <p className="text-lg font-extrabold text-gray-900 leading-none">{inr(f.price)}</p>
        </div>
        <button
          type="button"
          onClick={() => onDetails(f)}
          className="shrink-0 flex items-center justify-center gap-1.5 bg-[#023341] hover:bg-[#034a5c] active:scale-95 text-white text-xs font-bold px-4 py-2.5 rounded-full transition-all whitespace-nowrap"
        >
          View Details
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="sm:hidden px-3.5 pt-3 pb-2.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <AirlineLogo code={f.code} size={22} />
            <p className="text-[11px] text-gray-700 truncate">
              <span className="font-semibold">{f.airline}</span>
              <span className="text-gray-400"> · {f.nos}</span>
            </p>
          </div>
          <span className="shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-600">
            Economy
          </span>
        </div>
        <div className="mt-3 flex items-center gap-3">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="shrink-0">
              <p className="text-lg font-extrabold text-gray-900 leading-none">{f.depart}</p>
              <p className="text-[11px] font-medium text-gray-500 mt-1">{f.fromCode}</p>
            </div>
            <div className="flex-1 min-w-0 flex flex-col items-center gap-0.5">
              <p className="text-[10px] font-semibold text-gray-500 whitespace-nowrap">{f.stops}</p>
              <div className="w-full flex items-center gap-0.5">
                <div className="flex-1 border-t border-dashed border-gray-300" />
                <img className="shrink-0 object-contain" alt="" src="/images/2.svg" style={{ width: 14, height: 10 }} />
                <div className="flex-1 border-t border-dashed border-gray-300" />
              </div>
              <p className="text-[10px] text-gray-400 whitespace-nowrap">{f.duration}</p>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-lg font-extrabold text-gray-900 leading-none">{f.arrive}</p>
              <p className="text-[11px] font-medium text-gray-500 mt-1">{f.toCode}</p>
            </div>
          </div>
          <div className="shrink-0 flex flex-col items-end gap-1">
            <p className="text-lg font-extrabold text-gray-900 leading-none">{inr(f.price)}</p>
            <button
              type="button"
              onClick={() => window.dispatchEvent(new CustomEvent("maujitrip:open-login"))}
              className="mt-0.5 flex items-center justify-center gap-1 bg-[#023341] hover:bg-[#034a5c] active:scale-95 text-white text-xs font-bold px-3.5 py-2 rounded-full transition-all"
            >
              Book Now
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-2">
          <button
            type="button"
            onClick={() => onDetails(f)}
            className="flex items-center gap-1 text-[11px] font-semibold text-sky-600"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4M12 16h.01" />
            </svg>
            Flight Info
          </button>
          {f.refundable ? (
            <span className="text-[11px] font-semibold text-green-600">✓ Refundable</span>
          ) : (
            <span className="text-[11px] text-gray-400">Non Refundable</span>
          )}
        </div>
      </div>
    </div>
  );
}

function DetailsModal({ f, onClose }: { f: LiveFlight | null; onClose: () => void }) {
  if (!f) return null;
  const fare = f.fares.reduce((a, b) => (a.price <= b.price ? a : b), f.fares[0]);
  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div className="flex min-h-full items-center justify-center p-6 py-10">
        <div
          className="relative w-full max-w-5xl pt-10"
          style={{ animation: "0.22s cubic-bezier(0.34, 1.56, 0.64, 1) 0s 1 normal both running modalIn" }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-full max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[88vh]">
            <div className="bg-white px-4 sm:px-8 pt-4 pb-0 shrink-0">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-gray-900 font-bold text-base sm:text-lg tracking-tight">
                  Flight Details and Fare Options available for you!
                </h2>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 transition-colors shrink-0"
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
            <div className="overflow-y-auto flex-1 bg-gray-50">
              <div className="bg-[#F5F7F8] px-4 sm:px-6 py-3 border-b border-gray-100">
                <p className="text-[12px] text-gray-700">
                  <span className="font-bold">{f.airline}</span>
                  <span className="mx-1.5 text-gray-300">·</span>
                  <span className="font-semibold">{f.code}</span>
                  <span className="mx-1.5 text-gray-300">·</span>
                  {f.departDate}, 2026
                  <span className="mx-1.5 text-gray-300">·</span>
                  Departure at {f.depart} - Arrival at {f.arrive}
                  <span className="mx-1.5 text-gray-300">·</span>
                  {f.duration}
                </p>
              </div>
              <div className="px-4 sm:px-6 pt-3">
                <label className="flex items-center gap-2.5 bg-white border border-gray-200 rounded-xl px-4 py-3 cursor-pointer">
                  <input className="w-4 h-4 accent-[#023341]" type="checkbox" />
                  <span className="text-[12px] text-gray-700">
                    <span className="font-bold">Add Price Drop Protection</span>
                    <span className="text-gray-400 ml-1.5">See a fare drop? We refund the difference.</span>
                  </span>
                </label>
              </div>
              <div className="px-4 sm:px-6 pt-3 pb-5">
                <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
                  <div className="px-4 py-4">
                    <div className="flex items-center gap-2 mb-4">
                      <AirlineLogo code={f.code} size={20} />
                      <div>
                        <p className="text-[12px] font-bold text-gray-800 leading-none">{f.airline}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">{f.nos}</p>
                      </div>
                      <div className="ml-auto">
                        <span className="text-[10px] font-semibold px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full">
                          {f.stops}
                        </span>
                      </div>
                    </div>
                    {f.segments.map((s, i) => (
                      <div key={i} className={i > 0 ? "mt-4 pt-4 border-t border-dashed border-gray-200" : ""}>
                        <div className="flex items-start gap-3 sm:gap-6">
                          <div className="shrink-0 min-w-[70px]">
                            <p className="text-xl sm:text-2xl font-extrabold text-gray-900 leading-none tabular-nums">
                              {s.depart}
                            </p>
                            <p className="text-[11px] font-bold text-gray-700 mt-1">{s.fromCode}</p>
                            <p className="text-[10px] text-gray-400 leading-tight">{s.fromCity}</p>
                            {s.fromTerminal && (
                              <p className="text-[9px] text-gray-400 mt-0.5 bg-gray-100 px-1.5 py-0.5 rounded inline-block">
                                Terminal {s.fromTerminal}
                              </p>
                            )}
                            <p className="text-[9px] text-gray-400 mt-0.5">{s.departDate}, 2026</p>
                          </div>
                          <div className="flex-1 flex flex-col items-center pt-1">
                            <p className="text-[10px] text-gray-400">{f.duration}</p>
                            <div className="w-full flex items-center gap-1">
                              <div className="flex-1 border-t border-dashed border-gray-300" />
                              <Plane size={13} className="text-gray-400" />
                              <div className="flex-1 border-t border-dashed border-gray-300" />
                            </div>
                            {s.craft && <p className="text-[9px] text-gray-400 mt-0.5">{s.craft}</p>}
                          </div>
                          <div className="shrink-0 min-w-[70px] text-right">
                            <p className="text-xl sm:text-2xl font-extrabold text-gray-900 leading-none tabular-nums">
                              {s.arrive}
                            </p>
                            <p className="text-[11px] font-bold text-gray-700 mt-1">{s.toCode}</p>
                            <p className="text-[10px] text-gray-400 leading-tight">{s.toCity}</p>
                            {s.toTerminal && (
                              <p className="text-[9px] text-gray-400 mt-0.5 bg-gray-100 px-1.5 py-0.5 rounded inline-block">
                                Terminal {s.toTerminal}
                              </p>
                            )}
                            <p className="text-[9px] text-gray-400 mt-0.5">{s.arriveDate}, 2026</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-3 divide-x divide-gray-100 border-t border-gray-100">
                    <div className="px-4 py-4">
                      <p className="text-[10px] font-bold text-gray-700 mb-2">Baggage</p>
                      {(fare?.baggage?.length ? fare.baggage : [{ sector: "", checkIn: "15 Kg Check-in", cabin: "7 Kg Cabin" }]).map((b, i) => (
                        <div key={i} className="mb-2">
                          {b.sector && <p className="text-[9px] text-gray-400 font-semibold mb-0.5">{b.sector}</p>}
                          <p className="flex items-start gap-1 text-[10px] text-gray-600 mb-0.5">
                            <span className="w-3.5 h-3.5 rounded-full bg-[#C1F1DD] flex items-center justify-center shrink-0 mt-0.5">
                              <Check size={6} className="text-[#03807F]" strokeWidth={3} />
                            </span>
                            {b.checkIn} Check-in
                          </p>
                          <p className="flex items-start gap-1 text-[10px] text-gray-600">
                            <span className="w-3.5 h-3.5 rounded-full bg-[#C1F1DD] flex items-center justify-center shrink-0 mt-0.5">
                              <Check size={6} className="text-[#03807F]" strokeWidth={3} />
                            </span>
                            {b.cabin} Cabin
                          </p>
                        </div>
                      ))}
                    </div>
                    <div className="px-4 py-4">
                      <p className="text-[10px] font-bold text-gray-700 mb-2">Fare</p>
                      <p className="text-[10px] font-semibold text-gray-800">{f.brand}</p>
                      <p className="text-[10px] font-semibold text-gray-800">ECONOMY</p>
                      {f.refundable ? (
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full mt-2 inline-block w-fit bg-green-100 text-green-700">
                          ✓ Refundable
                        </span>
                      ) : (
                        <span className="text-[9px] px-2 py-0.5 rounded-full mt-2 inline-block w-fit bg-gray-100 text-gray-500">
                          Non Refundable
                        </span>
                      )}
                    </div>
                    <div className="px-4 py-4 flex flex-col justify-between">
                      <div>
                        <p className="text-[10px] text-gray-400">Total</p>
                        <p className="text-lg font-extrabold text-gray-900 leading-none">{inr(f.price)}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => window.dispatchEvent(new CustomEvent("maujitrip:open-login"))}
                        className="mt-2 rounded-full bg-[#023341] py-2 text-xs font-bold text-white hover:bg-[#034a5c]"
                      >
                        Book Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function useQuery() {
  const [q, setQ] = useState<URLSearchParams | null>(null);
  useEffect(() => {
    setQ(new URLSearchParams(window.location.search));
  }, []);
  return q;
}

function fmtDay(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
}

function fmtSrch(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function Results({ params }: { params: URLSearchParams }) {
  const depart = params.get("depart") || "2026-10-19";
  const fromCode = params.get("from")?.match(/\(([A-Z]{3})\)/)?.[1] || "DEL";
  const toCode = params.get("to")?.match(/\(([A-Z]{3})\)/)?.[1] || "BOM";
  const trip = params.get("trip") || "oneway";
  const adults = Number(params.get("adults") || 1);
  const children = Number(params.get("children") || 0);
  const cabin = params.get("class") || "Economy";
  const fromCity = params.get("from")?.replace(/\s*\([A-Z]{3}\)\s*$/, "") || "Delhi";
  const toCity = params.get("to")?.replace(/\s*\([A-Z]{3}\)\s*$/, "") || "Mumbai";

  const [flights, setFlights] = useState<LiveFlight[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [refundOnly, setRefundOnly] = useState(false);
  const [nonRefund, setNonRefund] = useState(false);
  const [stops, setStops] = useState<string[]>([]);
  const [depSlots, setDepSlots] = useState<string[]>([]);
  const [arrSlots, setArrSlots] = useState<string[]>([]);
  const [airlines, setAirlines] = useState<string[]>([]);
  const [detail, setDetail] = useState<LiveFlight | null>(null);

  useEffect(() => {
    let cancelled = false;
    setFlights(null);
    setFailed(false);
    (async () => {
      try {
        const s = await fetch("/api/live/flights/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            from: fromCode,
            to: toCode,
            depart_date: depart,
            return_date: null,
            trip_type: trip === "roundtrip" ? "ROUND" : "ONEWAY",
            adults,
            children,
            infants: 0,
            cabin_class: cabin.toUpperCase(),
            customer_type: "B2C",
          }),
        }).then((r) => r.json());
        const key = s?.cacheKey;
        if (!key) throw new Error("no key");
        for (let i = 0; i < 20; i++) {
          const j = await fetch("/api/live/flights/results", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ cacheKey: key }),
          }).then((r) => r.json());
          const list = j?.Result?.onward;
          if (Array.isArray(list) && j?.Result?.loading === false) {
            if (!cancelled)
              setFlights(
                list.map((x: any, idx: number) => mapFlight(x, idx)).filter(Boolean) as LiveFlight[]
              );
            return;
          }
          await new Promise((res) => setTimeout(res, 1500));
        }
        if (!cancelled) setFailed(true);
      } catch {
        if (!cancelled) setFailed(true);
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [depart, fromCode, toCode]);

  const allAirlines = useMemo(() => [...new Set((flights || []).map((f) => f.code))], [flights]);
  const minP = flights && flights.length ? Math.floor(Math.min(...flights.map((f) => f.price))) : 0;
  const maxP = flights && flights.length ? Math.ceil(Math.max(...flights.map((f) => f.price))) : 0;
  const cap = maxPrice ?? maxP;

  const results = useMemo(() => {
    if (!flights) return [];
    return flights.filter((f) => {
      if (f.price > cap) return false;
      if (refundOnly && !f.refundable) return false;
      if (nonRefund && f.refundable) return false;
      if (stops.length > 0) {
        const s = f.stopCount === 0 ? "Non Stop" : "01 Stop";
        if (!stops.includes(s)) return false;
      }
      if (depSlots.length > 0 && !depSlots.includes(slotOf(f.depart))) return false;
      if (arrSlots.length > 0 && !arrSlots.includes(slotOf(f.arrive))) return false;
      if (airlines.length > 0 && !airlines.includes(f.code)) return false;
      return true;
    });
  }, [flights, cap, refundOnly, nonRefund, stops, depSlots, arrSlots, airlines]);

  const toggle = (list: string[], v: string, set: (x: string[]) => void) =>
    set(list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);

  const reset = () => {
    setMaxPrice(null);
    setRefundOnly(false);
    setNonRefund(false);
    setStops([]);
    setDepSlots([]);
    setArrSlots([]);
    setAirlines([]);
  };

  const goDate = (iso: string) => {
    window.location.href = buildFlightSearchUrl({
      fromCity,
      fromCode,
      toCity,
      toCode,
      depart: iso,
      trip,
      adults,
      children,
      cabin,
    });
  };

  const checkCls = "w-3 h-3 accent-[#023341] rounded shrink-0";
  const fromLabel = fromCode === "DEL" ? "New Delhi" : fromCity;

  return (
    <div className="min-h-screen bg-[#eef4f8] pb-16 md:pb-0">
      <div className="bg-white border-b border-gray-100 pt-20 md:pt-24 pb-3 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-2">
            {(["oneway", "roundtrip"] as const).map((t) => (
              <span
                key={t}
                className={`rounded-full px-3 py-1 text-[11px] font-bold ${
                  trip === t ? "bg-[#023341] text-white" : "bg-gray-100 text-gray-500"
                }`}
              >
                {t === "oneway" ? "One Way" : "Round Trip"}
              </span>
            ))}
            <span className="ml-auto text-[11px] text-gray-500">
              {adults + children} traveller{(adults + children > 1 ? "s" : "")} · {cabin}
            </span>
          </div>
          <div className="flex items-center gap-2 font-display text-lg font-extrabold text-[#023341]">
            <span>{fromCode}</span>
            <Plane size={15} />
            <span>{toCode}</span>
            <span className="ml-2 text-xs font-medium text-gray-500">
              Depart {fmtDay(depart)} · {fmtSrch(depart)}
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-4 flex gap-4 items-start">
        <aside className="hidden md:block w-52 lg:w-60 shrink-0">
          <div className="sticky top-16">
            <div className="bg-[#F2F3F5] rounded-xl border border-gray-200 shadow-sm">
              <div className="sticky top-0 z-10 flex items-center justify-between gap-2 px-3 py-3 border-b border-gray-200 bg-[#F2F3F5] rounded-t-xl">
                <div className="flex items-center gap-1.5 min-w-0">
                  <SlidersHorizontal size={13} className="text-gray-700 shrink-0" />
                  <span className="text-[12px] font-bold text-gray-900 truncate">
                    Apply Filter Results
                  </span>
                </div>
                <button
                  type="button"
                  onClick={reset}
                  className="text-[11px] text-gray-700 font-medium whitespace-nowrap hover:text-[#023341] hover:underline transition-colors"
                >
                  Reset All
                </button>
              </div>
              <div className="py-3 px-3 border-b border-gray-200 last:border-0">
                <p className="text-[11px] font-semibold text-gray-800 mb-2">Price</p>
                {flights && flights.length > 0 ? (
                  <>
                    <div className="flex justify-between text-[10px] text-gray-700 mb-1.5">
                      <span>{inr(minP)}</span>
                      <span>{inr(maxP)}</span>
                    </div>
                    <input
                      min={minP}
                      max={maxP}
                      step={150}
                      className="w-full accent-[#023341]"
                      type="range"
                      value={cap}
                      onChange={(e) => setMaxPrice(Number(e.target.value))}
                    />
                    <p className="text-[10px] text-gray-500 mt-1">Up to {inr(cap)}</p>
                  </>
                ) : (
                  <p className="text-[10px] text-gray-400">—</p>
                )}
              </div>
              <div className="py-3 px-3 border-b border-gray-200 last:border-0">
                <p className="text-[11px] font-semibold text-gray-800 mb-2">Fare Type</p>
                <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                  <label className="flex items-center gap-1.5 cursor-pointer py-0.5">
                    <input
                      className={checkCls}
                      type="checkbox"
                      checked={refundOnly}
                      onChange={(e) => {
                        setRefundOnly(e.target.checked);
                        if (e.target.checked) setNonRefund(false);
                      }}
                    />
                    <span className="text-[11px] text-gray-700 select-none whitespace-nowrap">
                      Refundable
                    </span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer py-0.5">
                    <input
                      className={checkCls}
                      type="checkbox"
                      checked={nonRefund}
                      onChange={(e) => {
                        setNonRefund(e.target.checked);
                        if (e.target.checked) setRefundOnly(false);
                      }}
                    />
                    <span className="text-[11px] text-gray-700 select-none whitespace-nowrap">
                      Non Refundable
                    </span>
                  </label>
                </div>
              </div>
              <div className="py-3 px-3 border-b border-gray-200 last:border-0">
                <p className="text-[11px] font-semibold text-gray-800 mb-2">Stops From {fromLabel}</p>
                <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                  {["Non Stop", "01 Stop"].map((s) => (
                    <label key={s} className="flex items-center gap-1.5 cursor-pointer py-0.5">
                      <input
                        className={checkCls}
                        type="checkbox"
                        checked={stops.includes(s)}
                        onChange={() => toggle(stops, s, setStops)}
                      />
                      <span className="text-[11px] text-gray-700 select-none whitespace-nowrap">
                        {s}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              {[
                { title: "Departure Time", v: depSlots, set: setDepSlots },
                { title: "Arrival Time", v: arrSlots, set: setArrSlots },
              ].map((g) => (
                <div key={g.title} className="py-3 px-3 border-b border-gray-200 last:border-0">
                  <p className="text-[11px] font-semibold text-gray-800 mb-2">{g.title}</p>
                  <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                    {["12AM - 6AM", "6AM - 12PM", "12PM - 6PM", "6PM - 12AM"].map((s) => (
                      <label key={s} className="flex items-center gap-1.5 cursor-pointer py-0.5">
                        <input
                          className={checkCls}
                          type="checkbox"
                          checked={g.v.includes(s)}
                          onChange={() => toggle(g.v, s, g.set)}
                        />
                        <span className="text-[11px] text-gray-700 select-none whitespace-nowrap">
                          {s}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
              <div className="py-3 px-3 border-b border-gray-200 last:border-0">
                <p className="text-[11px] font-semibold text-gray-800 mb-2">Airlines</p>
                <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                  {allAirlines.map((a) => (
                    <label key={a} className="flex items-center gap-1.5 cursor-pointer py-0.5">
                      <input
                        className={checkCls}
                        type="checkbox"
                        checked={airlines.includes(a)}
                        onChange={() => toggle(airlines, a, setAirlines)}
                      />
                      <span className="text-[11px] text-gray-700 select-none whitespace-nowrap">
                        {a}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </aside>

        <div className="flex-1 min-w-0">
          <div className="bg-[#EAECEF] border border-gray-200 rounded-xl flex items-center relative overflow-hidden shadow-sm mb-3">
            <button
              type="button"
              aria-label="Previous dates"
              onClick={() =>
                document.getElementById("fare-row")?.scrollBy({ left: -300, behavior: "smooth" })
              }
              className="absolute left-0 z-10 bg-[#EAECEF] shadow rounded-full p-1 m-1 hover:bg-gray-200 border border-gray-200"
            >
              <ChevronLeft size={14} className="text-gray-600" />
            </button>
            <div id="fare-row" className="flex overflow-x-auto no-scrollbar px-8 py-1.5">
              {fareStrip.map((d) => {
                const sel = d.date === depart;
                return (
                  <button
                    key={d.date}
                    type="button"
                    title="Lowest fare for 1 adult (approx.)"
                    onClick={() => !sel && goDate(d.date)}
                    className={`relative flex flex-col items-center px-4 py-2.5 min-w-[90px] shrink-0 transition-all duration-200 rounded-lg mx-1 ${
                      sel
                        ? "bg-[#023341] text-white shadow"
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-800"
                    }`}
                  >
                    <span
                      className={`text-[11px] font-semibold whitespace-nowrap ${sel ? "text-white" : "text-gray-600"}`}
                    >
                      {d.day}
                    </span>
                    <span
                      className={`text-[10px] mt-0.5 font-medium ${sel ? "text-white/80" : "text-gray-400"}`}
                    >
                      {inr(d.fare)}
                    </span>
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              aria-label="Next dates"
              onClick={() =>
                document.getElementById("fare-row")?.scrollBy({ left: 300, behavior: "smooth" })
              }
              className="absolute right-0 z-10 bg-[#EAECEF] shadow rounded-full p-1 m-1 hover:bg-gray-200 border border-gray-200"
            >
              <ChevronRight size={14} className="text-gray-600" />
            </button>
          </div>

          {flights === null && !failed && (
            <div className="space-y-3" aria-label="Loading flights">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm animate-pulse">
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 rounded-2xl bg-gray-100" />
                    <div className="flex-1">
                      <div className="h-4 w-2/3 rounded bg-gray-100" />
                      <div className="mt-2 h-3 w-1/3 rounded bg-gray-100" />
                    </div>
                    <div className="h-8 w-20 rounded-full bg-gray-100" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {flights !== null && flights.length > 0 && (
            <>
              <p className="text-sm font-semibold text-gray-800 mb-3" role="status">
                {results.length} flights found
              </p>
              <div className="space-y-3">
                {results.map((f) => (
                  <FlightCard key={f.id} f={f} onDetails={setDetail} />
                ))}
              </div>
            </>
          )}

          {(failed || (flights !== null && flights.length === 0)) && (
            <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
              <Plane size={36} className="mx-auto text-gray-300" />
              <p className="mt-3 text-sm font-semibold text-gray-800">
                No flights found for this route and date. Try changing your search.
              </p>
              <button
                type="button"
                onClick={() => (window.location.href = "/flights")}
                className="mt-4 rounded-full bg-[#023341] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#034a5c]"
              >
                Modify Search
              </button>
            </div>
          )}
        </div>
      </div>

      <DetailsModal f={detail} onClose={() => setDetail(null)} />
    </div>
  );
}

export default function SearchFlightPage() {
  return (
    <SiteChrome active="flights">
      <Loader />
    </SiteChrome>
  );
}

function Loader() {
  const [q, setQ] = useState<URLSearchParams | null>(null);
  useEffect(() => {
    setQ(new URLSearchParams(window.location.search));
  }, []);
  if (!q) {
    return (
      <div className="min-h-screen bg-[#eef4f8] flex items-center justify-center">
        <p className="text-sm text-gray-500">Loading flights…</p>
      </div>
    );
  }
  return <Results params={q} />;
}
