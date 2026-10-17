export interface SearchFlight {
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
  stops: string;
  duration: string;
  brand: string;
  refundable: boolean;
  price: number;
}

export const searchRoute = { from: "Delhi", fromCode: "DEL", to: "Mumbai", toCode: "BOM" };

export const fareStrip: { day: string; date: string; fare: number }[] = [
  { day: "Wed, Oct 14", date: "2026-10-14", fare: 6846 },
  { day: "Thu, Oct 15", date: "2026-10-15", fare: 6350 },
  { day: "Fri, Oct 16", date: "2026-10-16", fare: 6584 },
  { day: "Sat, Oct 17", date: "2026-10-17", fare: 6568 },
  { day: "Sun, Oct 18", date: "2026-10-18", fare: 6483 },
  { day: "Mon, Oct 19", date: "2026-10-19", fare: 5957 },
  { day: "Tue, Oct 20", date: "2026-10-20", fare: 6028 },
  { day: "Wed, Oct 21", date: "2026-10-21", fare: 6316 },
  { day: "Thu, Oct 22", date: "2026-10-22", fare: 6584 },
  { day: "Fri, Oct 23", date: "2026-10-23", fare: 6338 },
  { day: "Sat, Oct 24", date: "2026-10-24", fare: 6119 },
  { day: "Sun, Oct 25", date: "2026-10-25", fare: 6453 },
  { day: "Mon, Oct 26", date: "2026-10-26", fare: 6611 },
  { day: "Tue, Oct 27", date: "2026-10-27", fare: 6061 },
  { day: "Wed, Oct 28", date: "2026-10-28", fare: 5961 },
  { day: "Thu, Oct 29", date: "2026-10-29", fare: 6061 },
  { day: "Fri, Oct 30", date: "2026-10-30", fare: 5961 },
  { day: "Sat, Oct 31", date: "2026-10-31", fare: 6061 },
  { day: "Sun, Nov 01", date: "2026-11-01", fare: 6338 },
  { day: "Mon, Nov 02", date: "2026-11-02", fare: 6338 },
  { day: "Tue, Nov 03", date: "2026-11-03", fare: 6483 },
  { day: "Wed, Nov 04", date: "2026-11-04", fare: 6256 },
  { day: "Thu, Nov 05", date: "2026-11-05", fare: 6256 },
  { day: "Fri, Nov 06", date: "2026-11-06", fare: 6338 },
  { day: "Sat, Nov 07", date: "2026-11-07", fare: 6338 },
  { day: "Sun, Nov 08", date: "2026-11-08", fare: 6338 },
  { day: "Mon, Nov 09", date: "2026-11-09", fare: 6374 },
  { day: "Tue, Nov 10", date: "2026-11-10", fare: 6256 },
  { day: "Wed, Nov 11", date: "2026-11-11", fare: 7467 },
  { day: "Thu, Nov 12", date: "2026-11-12", fare: 7116 },
  { day: "Fri, Nov 13", date: "2026-11-13", fare: 7116 },
];

export const searchFlights: SearchFlight[] = [
  { id: "S1", airline: "Ai Express", code: "IX", nos: "IX-1165, IX-1027", fromCode: "DEL", depart: "06:00", departDate: "19 Oct", toCode: "BOM", arrive: "11:05", arriveDate: "19 Oct", stops: "1 Stop", duration: "5h 5m", brand: "VALUE", refundable: true, price: 5956.8 },
  { id: "S2", airline: "Ai Express", code: "IX", nos: "IX-1038", fromCode: "DEL", depart: "17:35", departDate: "19 Oct", toCode: "NMI", arrive: "19:45", arriveDate: "19 Oct", stops: "Non Stop", duration: "2h 10m", brand: "Corporate Value", refundable: true, price: 6349.8 },
  { id: "S3", airline: "Ai Express", code: "IX", nos: "IX-1392, IX-1027", fromCode: "DEL", depart: "23:25", departDate: "19 Oct", toCode: "BOM", arrive: "11:05", arriveDate: "20 Oct", stops: "1 Stop", duration: "11h 40m", brand: "VALUE", refundable: true, price: 6417.8 },
  { id: "S4", airline: "Akasa Air", code: "QP", nos: "QP-1128", fromCode: "DEL", depart: "16:00", departDate: "19 Oct", toCode: "BOM", arrive: "18:20", arriveDate: "19 Oct", stops: "Non Stop", duration: "2h 20m", brand: "PUBLISHED", refundable: true, price: 6579.8 },
  { id: "S5", airline: "Akasa Air", code: "QP", nos: "QP-1833", fromCode: "DEL", depart: "06:50", departDate: "19 Oct", toCode: "BOM", arrive: "09:05", arriveDate: "19 Oct", stops: "Non Stop", duration: "2h 15m", brand: "PUBLISHED", refundable: true, price: 6682.8 },
  { id: "S6", airline: "Akasa Air", code: "QP", nos: "QP-1820", fromCode: "DEL", depart: "17:30", departDate: "19 Oct", toCode: "BOM", arrive: "19:50", arriveDate: "19 Oct", stops: "Non Stop", duration: "2h 20m", brand: "PUBLISHED", refundable: true, price: 6682.8 },
  { id: "S7", airline: "Akasa Air", code: "QP", nos: "QP-1110", fromCode: "DEL", depart: "10:00", departDate: "19 Oct", toCode: "BOM", arrive: "12:20", arriveDate: "19 Oct", stops: "Non Stop", duration: "2h 20m", brand: "PUBLISHED", refundable: true, price: 6786.8 },
  { id: "S8", airline: "Akasa Air", code: "QP", nos: "QP-1826", fromCode: "DEL", depart: "19:55", departDate: "19 Oct", toCode: "BOM", arrive: "22:20", arriveDate: "19 Oct", stops: "Non Stop", duration: "2h 25m", brand: "PUBLISHED", refundable: true, price: 6786.8 },
  { id: "S9", airline: "Indigo", code: "6E", nos: "6E-955", fromCode: "DEL", depart: "20:20", departDate: "19 Oct", toCode: "NMI", arrive: "22:20", arriveDate: "19 Oct", stops: "Non Stop", duration: "2h 0m", brand: "CORPORATE FARE", refundable: true, price: 6855.8 },
  { id: "S10", airline: "Indigo", code: "6E", nos: "6E-6470", fromCode: "DEL", depart: "06:50", departDate: "19 Oct", toCode: "NMI", arrive: "08:40", arriveDate: "19 Oct", stops: "Non Stop", duration: "1h 50m", brand: "CORPORATE FARE", refundable: true, price: 6855.8 },
  { id: "S11", airline: "Ai Express", code: "IX", nos: "IX-1056", fromCode: "DEL", depart: "17:50", departDate: "19 Oct", toCode: "BOM", arrive: "20:10", arriveDate: "19 Oct", stops: "Non Stop", duration: "2h 20m", brand: "VALUE", refundable: true, price: 6856.8 },
  { id: "S12", airline: "Ai Express", code: "IX", nos: "IX-1235", fromCode: "DEL", depart: "23:25", departDate: "19 Oct", toCode: "BOM", arrive: "01:50", arriveDate: "20 Oct", stops: "Non Stop", duration: "2h 25m", brand: "VALUE", refundable: true, price: 6856.8 },
  { id: "S13", airline: "Indigo", code: "6E", nos: "6E-353", fromCode: "DEL", depart: "03:00", departDate: "19 Oct", toCode: "BOM", arrive: "05:20", arriveDate: "19 Oct", stops: "Non Stop", duration: "2h 20m", brand: "CORPORATE FARE", refundable: true, price: 6856.8 },
  { id: "S14", airline: "Indigo", code: "6E", nos: "6E-322", fromCode: "DEL", depart: "23:30", departDate: "19 Oct", toCode: "BOM", arrive: "01:45", arriveDate: "20 Oct", stops: "Non Stop", duration: "2h 15m", brand: "CORPORATE FARE", refundable: true, price: 6856.8 },
  { id: "S15", airline: "Indigo", code: "6E", nos: "6E-6114", fromCode: "DEL", depart: "22:45", departDate: "19 Oct", toCode: "BOM", arrive: "01:05", arriveDate: "20 Oct", stops: "Non Stop", duration: "2h 20m", brand: "CORPORATE FARE", refundable: true, price: 6856.8 },
  { id: "S16", airline: "Indigo", code: "6E", nos: "6E-853", fromCode: "DEL", depart: "20:45", departDate: "19 Oct", toCode: "BOM", arrive: "23:00", arriveDate: "19 Oct", stops: "Non Stop", duration: "2h 15m", brand: "CORPORATE FARE", refundable: true, price: 6856.8 },
  { id: "S17", airline: "Indigo", code: "6E", nos: "6E-303", fromCode: "DEL", depart: "20:00", departDate: "19 Oct", toCode: "BOM", arrive: "22:10", arriveDate: "19 Oct", stops: "Non Stop", duration: "2h 10m", brand: "CORPORATE FARE", refundable: true, price: 6856.8 },
  { id: "S18", airline: "Indigo", code: "6E", nos: "6E-354", fromCode: "DEL", depart: "19:00", departDate: "19 Oct", toCode: "BOM", arrive: "21:25", arriveDate: "19 Oct", stops: "Non Stop", duration: "2h 15m", brand: "CORPORATE FARE", refundable: true, price: 6856.8 },
  { id: "S19", airline: "Indigo", code: "6E", nos: "6E-329", fromCode: "DEL", depart: "18:00", departDate: "19 Oct", toCode: "BOM", arrive: "20:15", arriveDate: "19 Oct", stops: "Non Stop", duration: "2h 15m", brand: "CORPORATE FARE", refundable: true, price: 6856.8 },
  { id: "S20", airline: "Indigo", code: "6E", nos: "6E-6706", fromCode: "DEL", depart: "17:00", departDate: "19 Oct", toCode: "BOM", arrive: "19:15", arriveDate: "19 Oct", stops: "Non Stop", duration: "2h 15m", brand: "CORPORATE FARE", refundable: true, price: 6856.8 },
  { id: "S21", airline: "Indigo", code: "6E", nos: "6E-327", fromCode: "DEL", depart: "16:15", departDate: "19 Oct", toCode: "BOM", arrive: "18:35", arriveDate: "19 Oct", stops: "Non Stop", duration: "2h 20m", brand: "CORPORATE FARE", refundable: true, price: 6856.8 },
  { id: "S22", airline: "Indigo", code: "6E", nos: "6E-864", fromCode: "DEL", depart: "15:30", departDate: "19 Oct", toCode: "BOM", arrive: "17:45", arriveDate: "19 Oct", stops: "Non Stop", duration: "2h 15m", brand: "CORPORATE FARE", refundable: true, price: 6856.8 },
  { id: "S23", airline: "Indigo", code: "6E", nos: "6E-6022", fromCode: "DEL", depart: "14:00", departDate: "19 Oct", toCode: "BOM", arrive: "16:25", arriveDate: "19 Oct", stops: "Non Stop", duration: "2h 25m", brand: "CORPORATE FARE", refundable: true, price: 6856.8 },
  { id: "S24", airline: "Indigo", code: "6E", nos: "6E-6318", fromCode: "DEL", depart: "14:45", departDate: "19 Oct", toCode: "BOM", arrive: "17:00", arriveDate: "19 Oct", stops: "Non Stop", duration: "2h 15m", brand: "CORPORATE FARE", refundable: true, price: 6856.8 },
  { id: "S25", airline: "Indigo", code: "6E", nos: "6E-6676", fromCode: "DEL", depart: "12:00", departDate: "19 Oct", toCode: "BOM", arrive: "14:10", arriveDate: "19 Oct", stops: "Non Stop", duration: "2h 10m", brand: "CORPORATE FARE", refundable: true, price: 6856.8 },
  { id: "S26", airline: "Indigo", code: "6E", nos: "6E-6047", fromCode: "DEL", depart: "11:00", departDate: "19 Oct", toCode: "BOM", arrive: "13:15", arriveDate: "19 Oct", stops: "Non Stop", duration: "2h 15m", brand: "CORPORATE FARE", refundable: true, price: 6856.8 },
  { id: "S27", airline: "Indigo", code: "6E", nos: "6E-6328", fromCode: "DEL", depart: "10:15", departDate: "19 Oct", toCode: "BOM", arrive: "12:40", arriveDate: "19 Oct", stops: "Non Stop", duration: "2h 25m", brand: "CORPORATE FARE", refundable: true, price: 6856.8 },
  { id: "S28", airline: "Indigo", code: "6E", nos: "6E-6107", fromCode: "DEL", depart: "09:30", departDate: "19 Oct", toCode: "BOM", arrive: "11:55", arriveDate: "19 Oct", stops: "Non Stop", duration: "2h 25m", brand: "CORPORATE FARE", refundable: true, price: 6856.8 },
  { id: "S29", airline: "Indigo", code: "6E", nos: "6E-675", fromCode: "DEL", depart: "08:45", departDate: "19 Oct", toCode: "BOM", arrive: "11:00", arriveDate: "19 Oct", stops: "Non Stop", duration: "2h 15m", brand: "CORPORATE FARE", refundable: true, price: 6856.8 },
  { id: "S30", airline: "Indigo", code: "6E", nos: "6E-320", fromCode: "DEL", depart: "08:00", departDate: "19 Oct", toCode: "BOM", arrive: "10:20", arriveDate: "19 Oct", stops: "Non Stop", duration: "2h 20m", brand: "CORPORATE FARE", refundable: true, price: 6856.8 },
  { id: "S31", airline: "Indigo", code: "6E", nos: "6E-6814", fromCode: "DEL", depart: "07:15", departDate: "19 Oct", toCode: "BOM", arrive: "09:30", arriveDate: "19 Oct", stops: "Non Stop", duration: "2h 15m", brand: "CORPORATE FARE", refundable: true, price: 6856.8 },
  { id: "S32", airline: "Indigo", code: "6E", nos: "6E-6218", fromCode: "DEL", depart: "06:00", departDate: "19 Oct", toCode: "BOM", arrive: "08:20", arriveDate: "19 Oct", stops: "Non Stop", duration: "2h 20m", brand: "CORPORATE FARE", refundable: true, price: 6856.8 },
  { id: "S33", airline: "Indigo", code: "6E", nos: "6E-449", fromCode: "DEL", depart: "05:00", departDate: "19 Oct", toCode: "BOM", arrive: "07:15", arriveDate: "19 Oct", stops: "Non Stop", duration: "2h 15m", brand: "CORPORATE FARE", refundable: true, price: 6856.8 },
  { id: "S34", airline: "Indigo", code: "6E", nos: "6E-324", fromCode: "DEL", depart: "13:00", departDate: "19 Oct", toCode: "BOM", arrive: "15:10", arriveDate: "19 Oct", stops: "Non Stop", duration: "2h 10m", brand: "CORPORATE FARE", refundable: true, price: 6856.8 },
  { id: "S35", airline: "Akasa Air", code: "QP", nos: "QP-1119", fromCode: "DEL", depart: "08:40", departDate: "19 Oct", toCode: "BOM", arrive: "11:05", arriveDate: "19 Oct", stops: "Non Stop", duration: "2h 25m", brand: "PUBLISHED", refundable: true, price: 6893.8 },
  { id: "S36", airline: "Indigo", code: "6E", nos: "6E-5198", fromCode: "DXN", depart: "15:00", departDate: "19 Oct", toCode: "BOM", arrive: "16:50", arriveDate: "19 Oct", stops: "Non Stop", duration: "1h 50m", brand: "PUBLISHED", refundable: true, price: 6944.8 },
  { id: "S37", airline: "Air India", code: "AI", nos: "AI-1780, AI-1780", fromCode: "DEL", depart: "14:30", departDate: "19 Oct", toCode: "BOM", arrive: "18:20", arriveDate: "19 Oct", stops: "1 Stop", duration: "3h 50m", brand: "Eco Value", refundable: true, price: 7172.8 },
  { id: "S38", airline: "Air India", code: "AI", nos: "AI-2951", fromCode: "DEL", depart: "13:30", departDate: "19 Oct", toCode: "BOM", arrive: "15:50", arriveDate: "19 Oct", stops: "Non Stop", duration: "2h 20m", brand: "Eco Value", refundable: true, price: 7172.8 },
  { id: "S39", airline: "Air India", code: "AI", nos: "AI-2981", fromCode: "DEL", depart: "21:00", departDate: "19 Oct", toCode: "BOM", arrive: "23:20", arriveDate: "19 Oct", stops: "Non Stop", duration: "2h 20m", brand: "Eco Value", refundable: true, price: 7172.8 },
  { id: "S40", airline: "Air India", code: "AI", nos: "AI-1745", fromCode: "DEL", depart: "05:00", departDate: "19 Oct", toCode: "BOM", arrive: "07:25", arriveDate: "19 Oct", stops: "Non Stop", duration: "2h 25m", brand: "Eco Value", refundable: true, price: 7172.8 },
  { id: "S41", airline: "Air India", code: "AI", nos: "AI-2995", fromCode: "DEL", depart: "10:00", departDate: "19 Oct", toCode: "BOM", arrive: "12:25", arriveDate: "19 Oct", stops: "Non Stop", duration: "2h 25m", brand: "Eco Value", refundable: true, price: 7172.8 },
  { id: "S42", airline: "Air India", code: "AI", nos: "AI-2945", fromCode: "DEL", depart: "11:00", departDate: "19 Oct", toCode: "BOM", arrive: "13:25", arriveDate: "19 Oct", stops: "Non Stop", duration: "2h 25m", brand: "Eco Value", refundable: true, price: 7172.8 },
  { id: "S43", airline: "Air India", code: "AI", nos: "AI-2441", fromCode: "DEL", depart: "14:10", departDate: "19 Oct", toCode: "BOM", arrive: "16:35", arriveDate: "19 Oct", stops: "Non Stop", duration: "2h 25m", brand: "Eco Value", refundable: true, price: 7172.8 },
  { id: "S44", airline: "Air India", code: "AI", nos: "AI-441", fromCode: "DEL", depart: "17:00", departDate: "19 Oct", toCode: "BOM", arrive: "19:25", arriveDate: "19 Oct", stops: "Non Stop", duration: "2h 25m", brand: "Eco Value", refundable: true, price: 7172.8 },
  { id: "S45", airline: "Air India", code: "AI", nos: "AI-2999", fromCode: "DEL", depart: "21:55", departDate: "19 Oct", toCode: "BOM", arrive: "00:20", arriveDate: "20 Oct", stops: "Non Stop", duration: "2h 25m", brand: "Eco Value", refundable: true, price: 7172.8 },
  { id: "S46", airline: "Air India", code: "AI", nos: "AI-2805", fromCode: "DEL", depart: "20:00", departDate: "19 Oct", toCode: "BOM", arrive: "22:30", arriveDate: "19 Oct", stops: "Non Stop", duration: "2h 30m", brand: "Eco Value", refundable: true, price: 7172.8 },
  { id: "S47", airline: "Air India", code: "AI", nos: "AI-2957", fromCode: "DEL", depart: "20:30", departDate: "19 Oct", toCode: "BOM", arrive: "23:05", arriveDate: "19 Oct", stops: "Non Stop", duration: "2h 35m", brand: "Eco Value", refundable: true, price: 7172.8 },
  { id: "S48", airline: "Air India", code: "AI", nos: "AI-2985", fromCode: "DEL", depart: "19:30", departDate: "19 Oct", toCode: "BOM", arrive: "21:55", arriveDate: "19 Oct", stops: "Non Stop", duration: "2h 25m", brand: "Eco Value", refundable: true, price: 7172.8 },
  { id: "S49", airline: "Air India", code: "AI", nos: "AI-1777", fromCode: "DEL", depart: "16:00", departDate: "19 Oct", toCode: "BOM", arrive: "18:25", arriveDate: "19 Oct", stops: "Non Stop", duration: "2h 25m", brand: "Eco Value", refundable: true, price: 7172.8 },
  { id: "S50", airline: "Air India", code: "AI", nos: "AI-2439", fromCode: "DEL", depart: "22:55", departDate: "19 Oct", toCode: "BOM", arrive: "01:25", arriveDate: "20 Oct", stops: "Non Stop", duration: "2h 30m", brand: "Eco Value", refundable: true, price: 7172.8 },
];
