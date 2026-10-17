export interface DemoBusResult {
  id: string;
  operator: string;
  type: string;
  date: string;
  depart: string;
  from: string;
  duration: string;
  arriveDate: string;
  arrive: string;
  to: string;
  price: number;
  seats: number;
  fromKey: string;
  toKey: string;
}

export const busResults: DemoBusResult[] = [
  { id: "R1", operator: "RedBus Express", type: "A/C Sleeper (2+1)", date: "23 Jun", depart: "18:00", from: "Delhi, India", duration: "5h 30m", arriveDate: "23 Jun", arrive: "23:30", to: "Lucknow, India", price: 499, seats: 5, fromKey: "delhi", toKey: "lucknow" },
  { id: "R2", operator: "Orange Travels", type: "Non A/C Seater", date: "23 Jun", depart: "19:00", from: "Delhi, India", duration: "5h 30m", arriveDate: "24 Jun", arrive: "24:30", to: "Lucknow, India", price: 599, seats: 7, fromKey: "delhi", toKey: "lucknow" },
  { id: "R3", operator: "VRL Travels", type: "Volvo Multi-Axle A/C Sleeper (2+1)", date: "23 Jun", depart: "20:00", from: "Delhi, India", duration: "5h 30m", arriveDate: "24 Jun", arrive: "25:30", to: "Lucknow, India", price: 699, seats: 9, fromKey: "delhi", toKey: "lucknow" },
  { id: "R4", operator: "SRS Travels", type: "A/C Seater / Sleeper (2+1)", date: "23 Jun", depart: "21:00", from: "Delhi, India", duration: "5h 30m", arriveDate: "24 Jun", arrive: "26:30", to: "Lucknow, India", price: 799, seats: 11, fromKey: "delhi", toKey: "lucknow" },
  { id: "R5", operator: "KSRTC", type: "Non A/C Sleeper (2+1)", date: "23 Jun", depart: "22:00", from: "Delhi, India", duration: "5h 30m", arriveDate: "24 Jun", arrive: "27:30", to: "Lucknow, India", price: 899, seats: 13, fromKey: "delhi", toKey: "lucknow" },
  { id: "R6", operator: "Parveen Travels", type: "Bharat Benz A/C Sleeper (2+1)", date: "23 Jun", depart: "23:00", from: "Delhi, India", duration: "5h 30m", arriveDate: "24 Jun", arrive: "28:30", to: "Lucknow, India", price: 999, seats: 15, fromKey: "delhi", toKey: "lucknow" },
  { id: "R7", operator: "IntrCity SmartBus", type: "Volvo Multi-Axle A/C Sleeper (2+1)", date: "23 Jun", depart: "20:30", from: "Delhi, India", duration: "12h 00m", arriveDate: "24 Jun", arrive: "08:30", to: "Manali, India", price: 1099, seats: 14, fromKey: "delhi", toKey: "manali" },
  { id: "R8", operator: "zingbus", type: "A/C Sleeper (2+1)", date: "23 Jun", depart: "21:15", from: "Delhi, India", duration: "12h 15m", arriveDate: "24 Jun", arrive: "09:30", to: "Manali, India", price: 949, seats: 9, fromKey: "delhi", toKey: "manali" },
  { id: "R9", operator: "Kallada Travels", type: "Scania Multi-Axle A/C Sleeper (2+1)", date: "23 Jun", depart: "19:45", from: "Delhi, India", duration: "12h 30m", arriveDate: "24 Jun", arrive: "08:15", to: "Manali, India", price: 1249, seats: 6, fromKey: "delhi", toKey: "manali" },
  { id: "R10", operator: "Mauji Express", type: "Bharat Benz A/C Sleeper (2+1)", date: "23 Jun", depart: "22:00", from: "Delhi, India", duration: "12h 00m", arriveDate: "24 Jun", arrive: "10:00", to: "Manali, India", price: 899, seats: 18, fromKey: "delhi", toKey: "manali" },
  { id: "R11", operator: "Orange Travels", type: "Volvo Multi-Axle A/C Sleeper (2+1)", date: "23 Jun", depart: "22:30", from: "Mumbai, India", duration: "11h 00m", arriveDate: "24 Jun", arrive: "09:30", to: "Goa, India", price: 1199, seats: 11, fromKey: "mumbai", toKey: "goa" },
  { id: "R12", operator: "VRL Travels", type: "A/C Sleeper (2+1)", date: "23 Jun", depart: "21:00", from: "Mumbai, India", duration: "11h 30m", arriveDate: "24 Jun", arrive: "08:30", to: "Goa, India", price: 999, seats: 8, fromKey: "mumbai", toKey: "goa" },
  { id: "R13", operator: "Sri Krishna Travels", type: "Non A/C Sleeper (2+1)", date: "23 Jun", depart: "20:00", from: "Mumbai, India", duration: "12h 00m", arriveDate: "24 Jun", arrive: "08:00", to: "Goa, India", price: 749, seats: 16, fromKey: "mumbai", toKey: "goa" },
  { id: "R14", operator: "Rajdhani Travels", type: "A/C Seater", date: "23 Jun", depart: "06:30", from: "Delhi, India", duration: "5h 00m", arriveDate: "23 Jun", arrive: "11:30", to: "Jaipur, India", price: 499, seats: 22, fromKey: "delhi", toKey: "jaipur" },
  { id: "R15", operator: "National Travels", type: "Volvo Multi-Axle A/C Seater", date: "23 Jun", depart: "08:00", from: "Delhi, India", duration: "4h 45m", arriveDate: "23 Jun", arrive: "12:45", to: "Jaipur, India", price: 649, seats: 13, fromKey: "delhi", toKey: "jaipur" },
  { id: "R16", operator: "SRS Travels", type: "A/C Seater / Sleeper (2+1)", date: "23 Jun", depart: "23:15", from: "Bengaluru, India", duration: "6h 30m", arriveDate: "24 Jun", arrive: "05:45", to: "Chennai, India", price: 749, seats: 15, fromKey: "bengaluru", toKey: "chennai" },
  { id: "R17", operator: "Kallada Travels", type: "Non A/C Seater", date: "23 Jun", depart: "22:00", from: "Bengaluru, India", duration: "7h 00m", arriveDate: "24 Jun", arrive: "05:00", to: "Chennai, India", price: 549, seats: 20, fromKey: "bengaluru", toKey: "chennai" },
];

export const busOperators = [
  "VRL Travels", "SRS Travels", "Orange Travels", "RedBus Express", "KSRTC",
  "Parveen Travels", "IntrCity SmartBus", "zingbus", "Kallada Travels",
  "Sri Krishna Travels", "National Travels", "Rajdhani Travels",
];

export const busTypes = [
  "Non A/C Seater",
  "Non A/C Sleeper (2+1)",
  "A/C Seater",
  "A/C Sleeper (2+1)",
  "A/C Seater / Sleeper (2+1)",
  "Volvo Multi-Axle A/C Sleeper (2+1)",
  "Bharat Benz A/C Sleeper (2+1)",
  "Scania Multi-Axle A/C Sleeper (2+1)",
];

export const busBoarding = [
  { name: "Delhi, India Main Bus Stand", time: "16:30" },
  { name: "Delhi, India Pickup Point 2", time: "16:45" },
  { name: "Delhi, India Pickup Point 3", time: "17:00" },
  { name: "Delhi, India Pickup Point 4", time: "17:15" },
  { name: "Delhi, India Pickup Point 5", time: "17:30" },
  { name: "Delhi, India Pickup Point 6", time: "17:45" },
];

export const busDropping = [
  { name: "Lucknow, India Main Bus Stand", time: "23:30" },
  { name: "Lucknow, India Drop Point 2", time: "23:45" },
  { name: "Lucknow, India Drop Point 3", time: "00:00" },
  { name: "Lucknow, India Drop Point 4", time: "00:15" },
  { name: "Lucknow, India Drop Point 5", time: "00:30" },
];
