export interface FlightSearchParams {
  fromCity: string;
  fromCode: string;
  toCity: string;
  toCode: string;
  depart: string; // YYYY-MM-DD
  ret?: string | null;
  trip?: string;
  adults?: number;
  children?: number;
  cabin?: string;
}

export function fmtSrchDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return `${String(d).padStart(2, "0")}/${String(m).padStart(2, "0")}/${y}`;
}

export function buildFlightSearchUrl(p: FlightSearchParams) {
  const depart = fmtSrchDate(p.depart);
  const srch = `${p.fromCode}-${p.fromCity}-India|${p.toCode}-${p.toCity}-India|${depart}`;
  const q = new URLSearchParams({
    srch,
    from: `${p.fromCity} (${p.fromCode})`,
    to: `${p.toCity} (${p.toCode})`,
    depart: p.depart,
    trip: p.trip ?? "oneway",
    px: `${p.adults ?? 1}-${p.children ?? 0}-0`,
    adults: String(p.adults ?? 1),
    children: String(p.children ?? 0),
    infants: "0",
    class: p.cabin ?? "Economy",
  });
  return `/search/flight?${q.toString()}`;
}
