"use client";

import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";

export interface HotelSuggestion {
  city: string;
  state: string | null;
  country: string;
  type: string;
  hotels: number;
  label: string;
}

export default function HotelWherePicker({
  value,
  onPick,
  dark = false,
}: {
  value: string;
  onPick: (s: HotelSuggestion) => void;
  dark?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [items, setItems] = useState<HotelSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  useEffect(() => {
    if (!open || q.trim().length < 2) {
      setItems([]);
      return;
    }
    setLoading(true);
    const t = setTimeout(async () => {
      try {
        const r = await fetch(`/api/live/hotel/search?q=${encodeURIComponent(q.trim())}`).then(
          (x) => x.json()
        );
        setItems(Array.isArray(r?.data) ? r.data : []);
      } catch {
        setItems([]);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [q, open]);

  return (
    <div ref={boxRef} className="relative min-w-0">
      <button
        type="button"
        onClick={() => {
          setOpen((v) => !v);
          setQ("");
        }}
        className="w-full flex flex-col items-start text-left"
      >
        <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
          Where
        </span>
        <span
          className={`text-[13px] font-semibold truncate w-full ${
            value ? (dark ? "text-gray-900" : "text-gray-900") : "text-gray-400"
          }`}
        >
          {value || "Search city or destination"}
        </span>
      </button>
      {open && (
        <div className="absolute left-0 top-full z-50 mt-2 w-72 rounded-2xl border border-gray-100 bg-white p-2 shadow-2xl">
          <div className="flex items-center gap-2 rounded-xl border border-gray-200 px-3 py-2">
            <Search size={14} className="text-gray-400 shrink-0" />
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="City, hotel or area..."
              className="w-full bg-transparent text-sm text-gray-800 outline-none placeholder:text-gray-400"
            />
          </div>
          <div className="mt-1 max-h-64 overflow-y-auto">
            {loading && <p className="px-3 py-3 text-xs text-gray-400">Searching…</p>}
            {!loading &&
              items.map((s, i) => (
                <button
                  key={`${s.city}-${i}`}
                  type="button"
                  onClick={() => {
                    onPick(s);
                    setOpen(false);
                  }}
                  className="block w-full rounded-xl px-3 py-2 text-left hover:bg-gray-50"
                >
                  <span className="block text-[13px] font-bold text-gray-900">{s.city}</span>
                  <span className="block text-[11px] text-gray-500">
                    {s.country} · {s.type.replace(/_/g, " ")} · {s.hotels} stays
                  </span>
                </button>
              ))}
            {!loading && q.trim().length >= 2 && items.length === 0 && (
              <p className="px-3 py-3 text-xs text-gray-400">No destinations found</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
