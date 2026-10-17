export interface DemoFlight {
  id: string;
  airline: string;
  code: string;
  from: string;
  fromCode: string;
  to: string;
  toCode: string;
  depart: string;
  arrive: string;
  duration: string;
  stops: string;
  price: number;
}

export const demoFlights: DemoFlight[] = [
  { id: "F1", airline: "IndiGo", code: "6E", from: "Delhi", fromCode: "DEL", to: "Mumbai", toCode: "BOM", depart: "06:10", arrive: "08:25", duration: "2h 15m", stops: "Non-stop", price: 4299 },
  { id: "F2", airline: "Air India", code: "AI", from: "Delhi", fromCode: "DEL", to: "Mumbai", toCode: "BOM", depart: "09:45", arrive: "12:00", duration: "2h 15m", stops: "Non-stop", price: 4899 },
  { id: "F3", airline: "SpiceJet", code: "SG", from: "Delhi", fromCode: "DEL", to: "Mumbai", toCode: "BOM", depart: "18:30", arrive: "21:05", duration: "2h 35m", stops: "1 stop", price: 3999 },
  { id: "F4", airline: "IndiGo", code: "6E", from: "Mumbai", fromCode: "BOM", to: "Delhi", toCode: "DEL", depart: "07:20", arrive: "09:35", duration: "2h 15m", stops: "Non-stop", price: 4499 },
  { id: "F5", airline: "Air India", code: "AI", from: "Delhi", fromCode: "DEL", to: "Bengaluru", toCode: "BLR", depart: "06:55", arrive: "09:40", duration: "2h 45m", stops: "Non-stop", price: 4899 },
  { id: "F6", airline: "IndiGo", code: "6E", from: "Bengaluru", fromCode: "BLR", to: "Delhi", toCode: "DEL", depart: "20:15", arrive: "23:00", duration: "2h 45m", stops: "Non-stop", price: 4799 },
  { id: "F7", airline: "SpiceJet", code: "SG", from: "Delhi", fromCode: "DEL", to: "Goa", toCode: "GOI", depart: "10:30", arrive: "13:00", duration: "2h 30m", stops: "Non-stop", price: 5299 },
  { id: "F8", airline: "IndiGo", code: "6E", from: "Mumbai", fromCode: "BOM", to: "Goa", toCode: "GOI", depart: "08:00", arrive: "09:15", duration: "1h 15m", stops: "Non-stop", price: 2999 },
  { id: "F9", airline: "Air India Express", code: "IX", from: "Delhi", fromCode: "DEL", to: "Dubai", toCode: "DXB", depart: "04:50", arrive: "07:10", duration: "3h 50m", stops: "Non-stop", price: 14999 },
  { id: "F10", airline: "SpiceJet", code: "SG", from: "Hyderabad", fromCode: "HYD", to: "Mumbai", toCode: "BOM", depart: "12:40", arrive: "14:05", duration: "1h 25m", stops: "Non-stop", price: 3799 },
  { id: "F11", airline: "IndiGo", code: "6E", from: "Kolkata", fromCode: "CCU", to: "Delhi", toCode: "DEL", depart: "16:25", arrive: "18:50", duration: "2h 25m", stops: "Non-stop", price: 4999 },
  { id: "F12", airline: "Air India", code: "AI", from: "Mumbai", fromCode: "BOM", to: "Goa", toCode: "GOI", depart: "19:10", arrive: "20:30", duration: "1h 20m", stops: "Non-stop", price: 3299 },
];

export interface DemoHotel {
  id: string;
  name: string;
  city: string;
  stars: number;
  rating: number;
  reviews: number;
  price: number;
  mrp: number;
  tag?: string;
}

export const demoHotels: DemoHotel[] = [
  { id: "H1", name: "The Coastal Grand", city: "Goa", stars: 5, rating: 4.7, reviews: 2314, price: 7499, mrp: 9999, tag: "Luxury Stay" },
  { id: "H2", name: "Three Heavens Resort", city: "Corbett", stars: 4, rating: 4.5, reviews: 1876, price: 5999, mrp: 7999, tag: "Discounted Deal" },
  { id: "H3", name: "Pink City Palace Hotel", city: "Jaipur", stars: 4, rating: 4.4, reviews: 1204, price: 4299, mrp: 5499 },
  { id: "H4", name: "Marine Drive Residency", city: "Mumbai", stars: 3, rating: 4.2, reviews: 3421, price: 3499, mrp: 4299 },
  { id: "H5", name: "Himalayan View Retreat", city: "Manali", stars: 4, rating: 4.6, reviews: 987, price: 4999, mrp: 6499, tag: "Honeymoon Pick" },
  { id: "H6", name: "Backwater Heritage Villa", city: "Kerala", stars: 5, rating: 4.8, reviews: 764, price: 8999, mrp: 11999 },
  { id: "H7", name: "Capital Business Inn", city: "Delhi", stars: 3, rating: 4.1, reviews: 2874, price: 2799, mrp: 3499 },
  { id: "H8", name: "Royal Desert Camp", city: "Jaisalmer", stars: 3, rating: 4.3, reviews: 654, price: 3299, mrp: 4199 },
];

export interface DemoBus {
  id: string;
  operator: string;
  type: string;
  from: string;
  to: string;
  depart: string;
  arrive: string;
  duration: string;
  price: number;
  seatsLeft: number;
}

export const demoBuses: DemoBus[] = [
  { id: "B1", operator: "Mauji Express", type: "Volvo A/C Sleeper", from: "Delhi", to: "Manali", depart: "21:30", arrive: "07:00", duration: "9h 30m", price: 999, seatsLeft: 12 },
  { id: "B2", operator: "Highway King", type: "A/C Sleeper", from: "Mumbai", to: "Goa", depart: "22:00", arrive: "08:30", duration: "10h 30m", price: 899, seatsLeft: 8 },
  { id: "B3", operator: "City Rider", type: "A/C Seater", from: "Delhi", to: "Jaipur", depart: "06:30", arrive: "11:30", duration: "5h 00m", price: 499, seatsLeft: 21 },
  { id: "B4", operator: "Mauji Express", type: "Volvo A/C Seater", from: "Bengaluru", to: "Chennai", depart: "23:15", arrive: "05:45", duration: "6h 30m", price: 749, seatsLeft: 15 },
  { id: "B5", operator: "Desert Star", type: "Non-A/C Sleeper", from: "Jaipur", to: "Udaipur", depart: "22:45", arrive: "06:15", duration: "7h 30m", price: 549, seatsLeft: 18 },
  { id: "B6", operator: "Coastal Line", type: "A/C Sleeper", from: "Hyderabad", to: "Bangalore", depart: "21:00", arrive: "05:30", duration: "8h 30m", price: 799, seatsLeft: 6 },
  { id: "B7", operator: "Highway King", type: "Multi-Axle A/C Sleeper", from: "Delhi", to: "Shimla", depart: "22:30", arrive: "06:00", duration: "7h 30m", price: 699, seatsLeft: 10 },
  { id: "B8", operator: "City Rider", type: "A/C Seater", from: "Pune", to: "Mumbai", depart: "07:00", arrive: "10:00", duration: "3h 00m", price: 349, seatsLeft: 26 },
];

export interface DemoActivity {
  id: string;
  name: string;
  city: string;
  duration: string;
  rating: number;
  price: number;
}

export const demoActivities: DemoActivity[] = [
  { id: "A1", name: "Desert Safari with Dinner", city: "Jaisalmer", duration: "5 hrs", rating: 4.7, price: 1499 },
  { id: "A2", name: "Alleppey Houseboat Day Cruise", city: "Kerala", duration: "6 hrs", rating: 4.8, price: 2999 },
  { id: "A3", name: "Paragliding Tandem Flight", city: "Bir Billing", duration: "2 hrs", rating: 4.9, price: 2499 },
  { id: "A4", name: "Burj Khalifa At The Top", city: "Dubai", duration: "3 hrs", rating: 4.8, price: 3499 },
  { id: "A5", name: "Old Delhi Food Walk", city: "Delhi", duration: "4 hrs", rating: 4.6, price: 999 },
  { id: "A6", name: "Scuba Dive with Training", city: "Goa", duration: "5 hrs", rating: 4.5, price: 3999 },
  { id: "A7", name: "Sunset Dhow Cruise", city: "Goa", duration: "2 hrs", rating: 4.4, price: 1299 },
  { id: "A8", name: "Ranthambore Tiger Safari", city: "Sawai Madhopur", duration: "3.5 hrs", rating: 4.7, price: 1799 },
];

export interface DemoPackage {
  id: number;
  dest: string;
  title: string;
  slug: string;
  type: string;
  nights: number;
  days: number;
  route: string;
  price: number;
  mrp: number | null;
  image: string | null;
}

export const demoPackages: DemoPackage[] = [
  { id: 1, title: "Manali Honeymoon Special", slug: "manali-honeymoon-special", dest: "Manali", type: "domestic", nights: 4, days: 5, route: "Manali · Solang Valley · Rohtang", price: 24999, mrp: 32000, image: null },
  { id: 2, title: "Goa Family Getaway", slug: "goa-family-getaway", dest: "Goa", type: "domestic", nights: 3, days: 4, route: "Calangute · Panjim · Old Goa", price: 14499, mrp: 18500, image: "/images/packages/0a4ba2d3-8a46-43da-bb40-5202931e0801.webp" },
  { id: 17, title: "Royal Rajasthan: Pink City to Golden Sands", slug: "royal-rajasthan-pink-city-to-golden-sands", dest: "Rajasthan", type: "domestic", nights: 5, days: 6, route: "Jaipur · Jodhpur · Jaisalmer", price: 16800, mrp: null, image: null },
  { id: 16, title: "Golden Jaisalmer: Desert Nights & Royal Heritage", slug: "golden-jaisalmer-desert-nights-royal-heritage", dest: "Rajasthan", type: "domestic", nights: 2, days: 3, route: "Jaisalmer • Sam Sand Dunes • Kuldhara", price: 6500, mrp: null, image: null },
  { id: 15, title: "Royal Rajasthan: Forts, Desert Sands & Timeless Heritage", slug: "royal-rajasthan-forts-desert-sands-timeless-heritage", dest: "Rajasthan", type: "domestic", nights: 11, days: 12, route: "Jaipur • Bikaner • Jaisalmer • Jodhpur • Mount Abu • Udaipur • Chittorgarh • Ajmer • Pushkar", price: 35500, mrp: null, image: "/images/packages/88076bdc-dd27-4b16-b427-e5f6571df73b.webp" },
  { id: 14, title: "Royal Rajasthan: Forts, Desert & Lakes", slug: "royal-rajasthan-forts-desert-lakes", dest: "Rajasthan", type: "domestic", nights: 9, days: 10, route: "Jaipur · Bikaner · Jaisalmer · Jodhpur · Mount Abu · Udaipur · Ajmer · Pushkar", price: 28500, mrp: null, image: null },
  { id: 13, title: "Royal Rajasthan: Heritage, Wildlife & Sacred Trails", slug: "royal-rajasthan-heritage-wildlife-sacred-trails", dest: "Rajasthan", type: "domestic", nights: 4, days: 5, route: "Jaipur • Ranthambore • Ajmer • Pushkar", price: 14500, mrp: null, image: "/images/packages/f4a33449-6cd1-4dec-a828-8d92964ef958.webp" },
  { id: 12, title: "Ranthambore Wildlife Adventure: Into the Tiger's Territory", slug: "ranthambore-wildlife-adventure-into-the-tigers-territory", dest: "Rajasthan", type: "domestic", nights: 2, days: 3, route: "Sawai Madhopur • Ranthambore", price: 7500, mrp: null, image: "/images/packages/5cb32e58-788c-4a67-8a12-eee27316ff9e.webp" },
  { id: 4, title: "Dubai City Break", slug: "dubai-city-break", dest: "Dubai", type: "international", nights: 4, days: 5, route: "Dubai · Abu Dhabi", price: 58999, mrp: 69999, image: null },
  { id: 20, title: "7 Nights 8 Days Rajasthan Tour Package", slug: "7-nights-8-days-rajasthan-tour-package", dest: "Rajasthan", type: "domestic", nights: 7, days: 8, route: "Jaipur · Ajmer · Pushkar · Jodhpur · Jaisalmer", price: 22500, mrp: null, image: "/images/packages/95481b0f-02e7-446a-958a-a6e85ec55639.webp" },
  { id: 21, title: "Rajasthan Tour Package 5 Nights 6 Days", slug: "rajasthan-tour-package-5-nights-6-days", dest: "Rajasthan", type: "domestic", nights: 5, days: 6, route: "Jaipur · Jodhpur · Jaisalmer", price: 15500, mrp: null, image: "/images/packages/b54891f1-eee3-410f-8209-735fcfa1cf63.webp" },
  { id: 22, title: "Kerala in 7 Days: Nature at Every Turn", slug: "kerala-in-7-days-nature-at-every-turn", dest: "Kerala", type: "domestic", nights: 6, days: 7, route: "Munnar · Thekkady · Alleppey", price: 19000, mrp: null, image: "/images/packages/1eff666a-c058-4a99-b34b-1ea275837759.webp" },
  { id: 23, title: "Kerala Escape: From Misty Hills to Coastal Bliss", slug: "kerala-escape-from-misty-hills-to-coastal-bliss", dest: "Kerala", type: "domestic", nights: 5, days: 6, route: "Munnar · Thekkady · Alleppey", price: 16500, mrp: null, image: "/images/packages/1911ac4b-201e-4bfc-81f9-921115b8f3a4.webp" },
  { id: 24, title: "Kerala Tour: Misty Hills to Serene Backwaters", slug: "kerala-tour-misty-hills-to-serene-backwaters", dest: "Kerala", type: "domestic", nights: 4, days: 5, route: "Munnar · Thekkady · Alleppey", price: 12500, mrp: null, image: "/images/packages/62514fbe-8e3c-4eaf-8f0a-398a7b090e64.webp" },
];

export function inr(n: number) {
  return "₹" + n.toLocaleString("en-IN");
}

export interface FlightOffer {
  img: string;
  alt: string;
}

export const flightOffers: FlightOffer[] = [
  { img: "/images/flight/1.png", alt: "offer-1" },
  { img: "/images/flight/2.png", alt: "offer-2" },
  { img: "/images/flight/3.png", alt: "offer-3" },
  { img: "/images/flight/4.png", alt: "offer-4" },
];

export interface Qa {
  question: string;
  answer: string;
}

export const flightFaqs: Qa[] = [
  {
    question: "How do I cancel a booking?",
    answer:
      "Open My Bookings, pick the booking and press Cancel. Cancellation charges depend on the airline or hotel policy, and the refund reaches your original payment method in 5 to 7 working days.",
  },
  {
    question: "When is the best time to book a flight?",
    answer:
      "Fares are usually lowest three to six weeks before departure. Tuesday and Wednesday departures tend to cost less than Friday and Sunday ones.",
  },
  {
    question: "Which payment methods can I use?",
    answer:
      "UPI, credit and debit cards, net banking and wallets. Registered travel agents can also pay from their MaujiTrip wallet balance.",
  },
  {
    question: "Can I change the date after booking?",
    answer:
      "Yes, if the fare allows it. Open My Bookings and press Change Date. The airline charges a change fee plus any difference in fare.",
  },
  {
    question: "How much baggage is included?",
    answer:
      "Most domestic economy fares include 15 kg check-in and 7 kg cabin baggage. The exact allowance is shown on each fare before you pay.",
  },
];

export const busFaqs: Qa[] = [
  {
    question: "How can I book bus tickets online through MaujiTrip?",
    answer:
      "Enter your departure and destination cities along with your travel date on the bus search bar, choose from the list of available operators, pick your seat, and complete payment for instant ticket confirmation.",
  },
  {
    question: "Is online bus ticket booking on MaujiTrip safe?",
    answer:
      "Yes, all online bus ticket bookings on MaujiTrip use encrypted payment gateways. Your personal and payment details are fully protected throughout the booking process.",
  },
  {
    question: "What types of buses can I book?",
    answer:
      "You can choose from AC and Non-AC, Seater and Sleeper, Volvo, and Multi-Axle buses depending on the route and operator availability.",
  },
  {
    question: "Can I select my seat while booking a bus ticket?",
    answer:
      "Yes, MaujiTrip shows a live seat layout for each bus so you can pick window or aisle, upper or lower berth, before confirming your booking.",
  },
  {
    question: "What is the boarding point and how do I find mine?",
    answer:
      "The boarding point is where the bus picks you up. Available boarding points for your chosen route are shown during booking — pick the one closest to you.",
  },
  {
    question: "Can I cancel or reschedule my bus ticket?",
    answer:
      "Yes, cancellations and rescheduling are subject to the bus operator's policy. Cancellation charges vary depending on how close to departure you cancel — this is shown clearly before you confirm your booking.",
  },
  {
    question: "Are there any offers on bus ticket booking?",
    answer:
      "Yes, MaujiTrip regularly offers discounts on bus bookings, especially on AC Sleeper and Volvo buses on popular routes. Check the offers section on the bus page for current deals.",
  },
  {
    question: "What if my bus is delayed or cancelled by the operator?",
    answer:
      "If an operator delays or cancels a trip, MaujiTrip's support team will assist you with rebooking or a refund as per the operator's policy. Our 24/7 customer support is available via phone, chat, and email.",
  },
  {
    question: "Can I book bus tickets for an overnight or interstate journey?",
    answer:
      "Yes, MaujiTrip supports both short intercity routes and long overnight interstate journeys, with AC Sleeper options available on most popular long-distance routes.",
  },
  {
    question: "How early should I reach the boarding point?",
    answer:
      "It's best to reach your boarding point at least 15–20 minutes before the scheduled departure time, as buses generally do not wait long for late passengers.",
  },
];

export interface BusOffer {
  badge: string;
  badgeColor: string;
  titleTop: string;
  titleMain: string;
  desc: string;
  valid: string;
  code: string;
  image: string;
}

export const busOffers: BusOffer[] = [
  {
    badge: "FirstRide",
    badgeColor: "rgb(2, 51, 65)",
    titleTop: "Enjoy Flat 25% OFF* On",
    titleMain: "Your First Booking",
    desc: "Book your first bus ticket on MaujiTrip and enjoy flat 25% OFF* (up to ₹150*).",
    valid: "31st Dec, 2026",
    code: "FIRST25",
    image: "/images/bus/hero.jpg",
  },
  {
    badge: "AC Sleeper",
    badgeColor: "rgb(14, 165, 233)",
    titleTop: "Get Flat 10% OFF* On",
    titleMain: "AC Sleeper Bookings",
    desc: "Grab flat 10% OFF* on all AC Sleeper bus bookings across India.",
    valid: "31st Dec, 2026",
    code: "SLEEP10",
    image: "/images/bus/1570125909232-eb263c188f7e.jpg",
  },
  {
    badge: "HillRide",
    badgeColor: "rgb(2, 51, 65)",
    titleTop: "Enjoy Flat 20% OFF*",
    titleMain: "On Hill Station Routes",
    desc: "Travel to Manali, Shimla & Rishikesh with flat 20% OFF* (up to ₹200*).",
    valid: "15th Jan, 2027",
    code: "HILL20",
    image: "/images/bus/1464219789935-c2d9d9aba644.jpg",
  },
  {
    badge: "Volvo+",
    badgeColor: "rgb(194, 65, 12)",
    titleTop: "Flat ₹150 OFF* On",
    titleMain: "Volvo Multi-Axle Buses",
    desc: "Travel in comfort with flat ₹150 OFF* on premium Volvo Multi-Axle buses.",
    valid: "28th Feb, 2027",
    code: "VOLVO150",
    image: "/images/bus/1494515843206-f3117d3f51b7.jpg",
  },
  {
    badge: "Weekend",
    badgeColor: "rgb(2, 51, 65)",
    titleTop: "Enjoy Flat 15% OFF*",
    titleMain: "On Weekend Getaways",
    desc: "Plan a quick weekend trip and save flat 15% OFF* on select routes.",
    valid: "31st Dec, 2026",
    code: "WEEKEND15",
    image: "/images/bus/1561361513-2d000a50f0dc.jpg",
  },
];

export interface BusRoute {
  city: string;
  to: string[];
  image: string;
}

export const busRoutes: BusRoute[] = [
  { city: "Bengaluru", to: ["Hyderabad", "Mumbai", "Goa", "Chennai", "Pune"], image: "/images/bus-routes/1596176530529-78163a4f7af2.jpg" },
  { city: "Hyderabad", to: ["Bengaluru", "Mumbai", "Goa", "Chennai", "Pune"], image: "/images/bus-routes/1572445271230-a78b5944a659.jpg" },
  { city: "Pune", to: ["Bengaluru", "Goa", "Indore", "Nagpur", "Hyderabad"], image: "/images/bus-routes/1601758228041-f3b2795255f1.jpg" },
  { city: "Chennai", to: ["Bengaluru", "Coimbatore", "Hyderabad", "Madurai", "Tirunelveli"], image: "/images/bus-routes/1582510003544-4d00b7f74220.jpg" },
  { city: "Delhi", to: ["Manali", "Jaipur", "Amritsar", "Lucknow", "Shimla"], image: "/images/bus-routes/1587474260584-136574528ed5.jpg" },
  { city: "Mumbai", to: ["Bengaluru", "Hyderabad", "Indore", "Goa", "Pune"], image: "/images/bus-routes/1529253355930-ddbe423a2ac7.jpg" },
  { city: "Indore", to: ["Mumbai", "Pune", "Ahmedabad", "Ahmednagar", "Nagpur"], image: "/images/bus-routes/1602216056096-3b40cc0c9944.jpg" },
  { city: "Ahmedabad", to: ["Porbandar", "Jamnagar", "Udaipur", "Indore", "Rajkot"], image: "/images/bus-routes/ahmedabad.jpg" },
  { city: "Goa", to: ["Hyderabad", "Bengaluru", "Pune", "Mumbai", "Kolhapur"], image: "/images/bus-routes/1512343879784-a960bf40e7f2.jpg" },
];

export interface HotelOffer {
  tag: string;
  title: string;
  desc: string;
  valid: string;
  code: string;
  image: string;
  href: string;
}

export const hotelOffers: HotelOffer[] = [
  {
    tag: "Get 45% OFF on",
    title: "Spree Hotels",
    desc: "Grab Amazing Offer On Hotel Like Never Before",
    valid: "30th Jun, 2026",
    code: "HOTELSPREE",
    image: "/images/Hotel/hotel-exclusive.jpg",
    href: "/hotels?offer=HOTELSPREE",
  },
  {
    tag: "Enjoy Up to 60% OFF*",
    title: "Hotels Bookings",
    desc: "Enjoy Up to 60% OFF* on Hotel Bookings",
    valid: "30th Jun, 2026",
    code: "MOUJIHOTELS",
    image: "/images/Hotel/hotel-booking.jpg",
    href: "/hotels?offer=MOUJIHOTELS",
  },
  {
    tag: "Get Flat 30% OFF*",
    title: "Homes & Villas",
    desc: "Flat 30% OFF on Homes & Villas booking.",
    valid: "30th Jun, 2026",
    code: "MAUJIVILLA30",
    image: "/images/Hotel/villa-exclusive.jpg",
    href: "/hotels?offer=MAUJIVILLA30",
  },
  {
    tag: "Discover India's Finest",
    title: "Luxury Stay",
    desc: "Explore Mauji Luxe with Signature Amenities.",
    valid: "30th Jun, 2026",
    code: "LUXURYSTAY",
    image: "/images/Hotel/luxury-stay.jpg",
    href: "/hotels?offer=LUXURYSTAY",
  },
];

export interface DiscoverHotel {
  name: string;
  stars: number;
  city: string;
  rating: number;
  reviews: string;
  amenities: string;
  price: number;
  mrp: number;
  off: string;
  freeCancel: boolean;
  image: string;
}

export const discoverHotels: DiscoverHotel[] = [
  { name: "Taj Resort & Spa, Goa", city: "Goa", rating: 4.5, reviews: "2,323", amenities: "Pool · Spa · Restaurant", price: 3949, mrp: 7000, off: "44% off", freeCancel: true, image: "/images/hotels-disc/1566073771259-6a8506099945.jpg", stars: 5 },
  { name: "JW Marriott Mumbai Juhu", city: "Mumbai", rating: 4.6, reviews: "1,872", amenities: "Beach · Pool · Gym", price: 9800, mrp: 14000, off: "30% off", freeCancel: false, image: "/images/hotels-disc/1551882547-ff40c63fe5fa.jpg", stars: 5 },
  { name: "Trident Nariman Point", city: "Mumbai", rating: 4.5, reviews: "1,234", amenities: "Sea View · Spa · Restaurant", price: 8200, mrp: 11500, off: "29% off", freeCancel: true, image: "/images/hotels-disc/1455587734955-081b22074882.jpg", stars: 5 },
  { name: "ITC Grand Central", city: "Mumbai", rating: 4.4, reviews: "987", amenities: "Pool · Gym · Restaurant", price: 6500, mrp: 9000, off: "28% off", freeCancel: true, image: "/images/hotels-disc/1590490360182-c33d57733427.jpg" , stars: 4 },
  { name: "The Leela Palace Bengaluru", city: "Bengaluru", rating: 4.8, reviews: "3,120", amenities: "Pool · Spa · Gym", price: 14000, mrp: 20000, off: "30% off", freeCancel: false, image: "/images/hotels-disc/1571896349842-33c89424de2d.jpg", stars: 5 },
  { name: "Oberoi Udaivilas", city: "Udaipur", rating: 4.9, reviews: "4,502", amenities: "Pool · Spa · Restaurant", price: 22000, mrp: 30000, off: "27% off", freeCancel: true, image: "/images/hotels-disc/1582719508461-905c673771fd.jpg", stars: 5 },
  { name: "Rambagh Palace", city: "Jaipur", rating: 4.7, reviews: "2,874", amenities: "Pool · Spa · Restaurant", price: 18000, mrp: 25000, off: "28% off", freeCancel: true, image: "/images/hotels-disc/1520250497591-112f2f40a3f4.jpg", stars: 5 },
  { name: "Wildflower Hall Shimla", city: "Shimla", rating: 4.7, reviews: "2,100", amenities: "Spa · Restaurant · Free WiFi", price: 12000, mrp: 18000, off: "33% off", freeCancel: true, image: "/images/hotels-disc/1476514525535-07fb3b4ae5f1.jpg", stars: 4 },
];

export const hotelFaqs: Qa[] = [
  {
    question: "How do I cancel a booking?",
    answer:
      "Open My Bookings, pick the booking and press Cancel. Cancellation charges depend on the airline or hotel policy, and the refund reaches your original payment method in 5 to 7 working days.",
  },
  {
    question: "Which payment methods can I use?",
    answer:
      "UPI, credit and debit cards, net banking and wallets. Registered travel agents can also pay from their MaujiTrip wallet balance.",
  },
];

export const holidayFaqs: Qa[] = [
  {
    question: "How do I cancel a booking?",
    answer:
      "Open My Bookings, pick the booking and press Cancel. Cancellation charges depend on the airline or hotel policy, and the refund reaches your original payment method in 5 to 7 working days.",
  },
  {
    question: "Which payment methods can I use?",
    answer:
      "UPI, credit and debit cards, net banking and wallets. Registered travel agents can also pay from their MaujiTrip wallet balance.",
  },
];
