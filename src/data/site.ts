export interface Offer {
  id: number;
  badge: string;
  heading: string;
  subtext: string;
  image: string;
  tab: "flight" | "hotel" | "bus" | "holiday";
}

export const offers: Offer[] = [
  {
    id: 1,
    badge: "Flight Offer",
    heading: "0 Convenience Fee",
    subtext: "On Online Flight Bookings",
    image:
      "/images/offers/b2f02765-2dd2-4b4e-b8c9-3b55c282bfd5.webp",
    tab: "flight",
  },
  {
    id: 2,
    badge: "Luxury Stay",
    heading: "Discounted Deals",
    subtext: "For Three Heavens Resort Corbett",
    image:
      "/images/offers/6ffd0cdb-5ad6-4b57-95bc-2471720cbe9a.webp",
    tab: "hotel",
  },
  {
    id: 3,
    badge: "Holiday Sale",
    heading: "Flat 25% OFF",
    subtext: "On Family Holiday Packages",
    image:
      "/images/offers/389cc51d-d1c0-4489-a7b7-3802277c255b.webp",
    tab: "holiday",
  },
  {
    id: 4,
    badge: "Hotel Deals",
    heading: "Save Up To \u20B9500",
    subtext: "On Hotel Bookings",
    image:
      "/images/offers/2c85333f-6f58-4154-ada1-d127d9dd8522.webp",
    tab: "hotel",
  },
  {
    id: 5,
    badge: "Domestic",
    heading: "Instant \u20B9750 Cashback",
    subtext: "On Domestic Flights",
    image:
      "/images/offers/78767834-27d1-4c6d-ba02-10e7c098f7bd.webp",
    tab: "flight",
  },
  {
    id: 6,
    badge: "Bus Offer",
    heading: "Flat 15% OFF",
    subtext: "On AC Sleeper & Volvo Buses",
    image:
      "/images/offers/b2f02765-2dd2-4b4e-b8c9-3b55c282bfd5.webp",
    tab: "bus",
  },
];

export interface Route {
  id: number;
  from: string;
  fromCode: string;
  to: string;
  toCode: string;
  price: number;
  image: string;
}

export const topRoutes: Route[] = [
  {
    id: 1,
    from: "Delhi",
    fromCode: "DEL",
    to: "Mumbai",
    toCode: "BOM",
    price: 4299,
    image:
      "/images/routes/40c4d31f-e0bb-47c9-b24d-18c5ac97d315.webp",
  },
  {
    id: 2,
    from: "Mumbai",
    fromCode: "BOM",
    to: "Delhi",
    toCode: "DEL",
    price: 4499,
    image:
      "/images/routes/b063577d-1ed6-428d-971e-57ca29567910.webp",
  },
  {
    id: 3,
    from: "Delhi",
    fromCode: "DEL",
    to: "Bengaluru",
    toCode: "BLR",
    price: 4899,
    image:
      "/images/routes/917f7ddf-e994-454f-8b13-8e0dda8ba326.webp",
  },
  {
    id: 4,
    from: "Delhi",
    fromCode: "DEL",
    to: "Goa",
    toCode: "GOI",
    price: 5299,
    image:
      "/images/routes/3f8a7e41-58a0-45fa-beb3-f36484e4c1db.webp",
  },
  {
    id: 6,
    from: "Delhi",
    fromCode: "DEL",
    to: "Dubai",
    toCode: "DXB",
    price: 14999,
    image:
      "/images/routes/0a6b62f0-13f0-4a0e-bd79-bb415f063c12.webp",
  },
  {
    id: 5,
    from: "Mumbai",
    fromCode: "BOM",
    to: "Goa",
    toCode: "GOI",
    price: 2999,
    image:
      "/images/routes/e3537004-b02d-4914-a984-e75ac2578f6a.webp",
  },
  {
    id: 7,
    from: "Bengaluru",
    fromCode: "BLR",
    to: "Delhi",
    toCode: "DEL",
    price: 4799,
    image:
      "/images/routes/6cea515d-29d1-4ae4-8a0c-417253e05fb7.webp",
  },
  {
    id: 10,
    from: "Hyderabad",
    fromCode: "HYD",
    to: "Mumbai",
    toCode: "BOM",
    price: 3799,
    image:
      "/images/routes/fbc866be-f9cc-44b5-8cfb-1f0259641584.webp",
  },
  {
    id: 9,
    from: "Kolkata",
    fromCode: "CCU",
    to: "Delhi",
    toCode: "DEL",
    price: 4999,
    image:
      "/images/routes/fef99ded-519f-4742-ad50-7ccf47e8de48.webp",
  },
];

export interface Category {
  id: number;
  title: string;
  theme: string;
  description: string;
  image: string;
  packagesCount: number;
  startingPrice: number | null;
  href: string;
}

export const categories: Category[] = [
  {
    id: 1,
    title: "Honeymoon",
    theme: "honeymoon",
    description: "Private transfers, candlelight dinners and rooms with a view.",
    image:
      "/images/categories/4ed0e1dd-f5b1-40e4-9076-00536b7c85b9.webp",
    packagesCount: 3,
    startingPrice: 12500,
    href: "/holidays/themes/honeymoon",
  },
  {
    id: 2,
    title: "Family",
    theme: "family",
    description: "Easy pace, kid-friendly stays and sightseeing everyone can manage.",
    image:
      "/images/categories/dbc0e793-052a-4f8b-af48-79495b1a2030.webp",
    packagesCount: 2,
    startingPrice: 14499,
    href: "/holidays/themes/family",
  },
  {
    id: 3,
    title: "Adventure",
    theme: "adventure",
    description: "Trekking, rafting, paragliding and everything in between.",
    image:
      "/images/categories/0a5695e1-a3f5-4dcd-a484-987b847e348b.webp",
    packagesCount: 3,
    startingPrice: 7500,
    href: "/holidays/themes/adventure",
  },
  {
    id: 4,
    title: "Beach",
    theme: "beach",
    description: "Sand, sea and very little else on the schedule.",
    image:
      "/images/categories/0b7d5614-921b-492a-8b73-093f83063980.webp",
    packagesCount: 0,
    startingPrice: null,
    href: "/holidays",
  },
  {
    id: 5,
    title: "Pilgrimage",
    theme: "pilgrimage",
    description: "Temple circuits and spiritual journeys.",
    image:
      "/images/categories/24cd983a-c746-4a7e-98ee-a8953ea66b33.webp",
    packagesCount: 0,
    startingPrice: null,
    href: "/holidays",
  },
  {
    id: 6,
    title: "Group Departure",
    theme: "group-departure",
    description: "Fixed dates, shared coach, better rates.",
    image:
      "/images/categories/07e6d603-0743-4a09-b5aa-5589bf6b2e86.webp",
    packagesCount: 1,
    startingPrice: 22500,
    href: "/holidays/themes/group-departure",
  },
];

export interface Destination {
  id: number;
  name: string;
  label: string;
  slug: string;
  image: string;
  domestic: boolean;
}

const IMG = "/images/destinations";

export const destinations: Destination[] = [
  { id: 28, name: "Himachal", label: "Himachal Tour Packages", slug: "himachal-tour-packages", image: `${IMG}/1714031220_himachal-tour-packages.jpeg`, domestic: true },
  { id: 27, name: "Uttarakhand", label: "Uttarakhand Tour Packages", slug: "uttarakhand-tour-packages", image: `${IMG}/1714031100_uttarakhand-tour-packages.jpeg`, domestic: true },
  { id: 29, name: "Leh Ladakh", label: "Leh Ladakh Tour Packages", slug: "leh-ladakh-tour-packages", image: `${IMG}/1714031400_leh-ladakh-tour-packages.jpeg`, domestic: true },
  { id: 15, name: "Varanasi", label: "Varanasi, Uttar Pradesh", slug: "varanasi-tour-package", image: `${IMG}/1733304300_varanasi_tour_package.png`, domestic: true },
  { id: 14, name: "Ayodhya", label: "Ayodhya Tour Packages", slug: "ayodhya-tour-packages", image: `${IMG}/1735815300_ayodhya_tour_packages.png`, domestic: true },
  { id: 30, name: "Odisha", label: "Odisha Tour Packages", slug: "odisha-tour-packages", image: `${IMG}/1720263480_book-for-odisha-golden-triangle-tour-packages-as-tourists.jpg`, domestic: true },
  { id: 24, name: "Gujarat", label: "Gujarat Tour Packages", slug: "gujarat-tour-packages", image: `${IMG}/1714029240_gujrattourpackages.jpg`, domestic: true },
  { id: 23, name: "North East", label: "North East Tour Packages", slug: "north-east-tour-packages", image: `${IMG}/1714028880_northeasttourpackage1.jpg`, domestic: true },
  { id: 3, name: "Kerala", label: "Kerala Tour Packages", slug: "kerala-tour-packages", image: `${IMG}/06a89050-0544-4755-805f-99fbaf9795a9.webp`, domestic: true },
  { id: 12, name: "Ooty", label: "Ooty Tour Packages", slug: "ooty-tour-packages", image: `${IMG}/1752216360_ooty_tour_packages_.png`, domestic: true },
  { id: 31, name: "Europe", label: "Europe Tour Packages, europe", slug: "europe-tour-packages", image: `${IMG}/1720851540_europe_tour_packages.png`, domestic: false },
  { id: 26, name: "Singapore", label: "Singapore Tour Packages, asia", slug: "singapore-tour-packages", image: `${IMG}/1714030380_singapore-1.jpg`, domestic: false },
  { id: 25, name: "Thailand", label: "Thailand Tour Packages, asia", slug: "thailand-tour-packages", image: `${IMG}/1714029660_bangkok.jpg`, domestic: false },
  { id: 22, name: "Malaysia", label: "Malaysia Tour Package, asia", slug: "malaysia-tour-package", image: `${IMG}/1714028400_malaysia-kuala-lumpur.jpg`, domestic: false },
  { id: 21, name: "Maldives", label: "Maldives Tour Packages", slug: "maldives-tour-packages", image: `${IMG}/1714028160_maldives.jpg`, domestic: false },
  { id: 20, name: "Turkey", label: "Turkey Tour Packages, europe", slug: "turkey-tour-packages", image: `${IMG}/1714027440_turkey-tour.jpeg`, domestic: false },
  { id: 17, name: "Vietnam", label: "Vietnam Tour Packages, asia", slug: "vietnam-tour-packages", image: `${IMG}/1727950920_vietnam_tour_packages.png`, domestic: false },
  { id: 13, name: "Japan", label: "Japan Tour Packages", slug: "japan-tour-packages", image: `${IMG}/1738568160_japan_tour_packages.png`, domestic: false },
  { id: 32, name: "Almaty", label: "Almaty Tour Packages, asia", slug: "almaty-tour-packages", image: `${IMG}/1781347080_kazakhstan-holiday-packages-from-india.jpg`, domestic: false },
  { id: 16, name: "Maharashtra", label: "Maharashtra Tour Packages", slug: "maharashtra-tour-packages", image: `${IMG}/1733299320_untitled_design.png`, domestic: true },
  { id: 1, name: "Manali", label: "Manali Tour Packages", slug: "manali-tour-packages", image: `${IMG}/3814591d-c71a-4397-8c0f-e68b13ece31f.webp`, domestic: true },
  { id: 2, name: "Goa", label: "Goa Tour Packages", slug: "goa-tour-packages", image: `${IMG}/8fdb1e3a-e3ec-4ab9-bbe4-cfa0e8ef85dd.webp`, domestic: true },
  { id: 4, name: "Andaman", label: "Andaman Tour Packages", slug: "andaman-tour-packages", image: `${IMG}/andaman.jpg`, domestic: true },
  { id: 5, name: "Dubai", label: "Dubai Tour Packages", slug: "dubai-tour-packages", image: `${IMG}/b1d16144-a3f8-4ffe-af4f-793103dc334d.webp`, domestic: false },
  { id: 6, name: "Bali", label: "Bali Tour Packages", slug: "bali-tour-packages", image: `${IMG}/9287267d-3903-4900-8ed7-acc6b864c1da.webp`, domestic: false },
  { id: 8, name: "Kashmir", label: "Kashmir Tour Packages", slug: "kashmir-tour-packages", image: `${IMG}/42344c41-b88c-4686-84f7-ef9925fca958.webp`, domestic: true },
  { id: 9, name: "Rajasthan", label: "Rajasthan Tour Packages", slug: "rajasthan-tour-packages", image: `${IMG}/409fda80-5808-4a45-99d4-da1229248ba1.webp`, domestic: true },
  { id: 10, name: "Chardham Yatra", label: "Chardham Yatra Tour Packages", slug: "chardham-yatra-tour-packages", image: `${IMG}/1773127500_1200_x_628.jpg.jpeg`, domestic: true },
  { id: 11, name: "Sri Lanka", label: "Sri Lanka Tour Packages", slug: "sri-lanka-tour-packages", image: `${IMG}/1752223140_sri_lanka_tour_packages_.png`, domestic: false },
];

export interface Faq {
  question: string;
  answer: string;
}

export const faqs: Faq[] = [
  {
    question: "What services does MaujiTrip offer?",
    answer:
      "MaujiTrip provides multiple travel services, including online flight booking, hotel booking, bus booking and holiday or tour packages. MaujiTrip also provides corporate travel and MICE solutions for businesses.",
  },
  {
    question: "Can I book domestic flights through MaujiTrip?",
    answer:
      "Yes. Travelers can search and book available domestic flight options for travel between destinations across India.",
  },
  {
    question: "Can I book international flights with MaujiTrip?",
    answer:
      "Yes. MaujiTrip provides options for travelers looking for international flight bookings and travel to destinations outside India.",
  },
  {
    question: "Does MaujiTrip offer holiday packages?",
    answer:
      "Yes. MaujiTrip offers holiday and tour packages for popular destinations in India and abroad, including family, honeymoon, group and seasonal travel options.",
  },
  {
    question: "Does MaujiTrip provide hotel booking?",
    answer:
      "Yes. MaujiTrip provides hotel booking options for travelers looking for accommodation for holidays, business trips, family travel and other journeys.",
  },
  {
    question: "Can I book buses through MaujiTrip?",
    answer:
      "Yes. MaujiTrip provides online bus booking options for travelers planning journeys by road.",
  },
  {
    question: "Does MaujiTrip offer corporate travel services?",
    answer:
      "Yes. MaujiTrip offers corporate travel and MICE services, including support for business travel, meetings, incentives, conferences and events.",
  },
  {
    question: "How can I find travel offers on MaujiTrip?",
    answer:
      "Available offers and promotional deals can be found through relevant offer sections on the MaujiTrip website. Offers may vary depending on the travel service, destination, booking conditions and campaign period.",
  },
  {
    question: "Is MaujiTrip a travel agency in India?",
    answer:
      "MaujiTrip is a best travel company offering online travel booking services and travel solutions, including flights, hotels, buses, holiday packages and corporate travel.",
  },
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

export const footerLinks: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Terms & Conditions", href: "/terms" },
      { label: "User Agreement", href: "/user-agreement" },
    ],
  },
  {
    title: "Policies",
    links: [
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Declaration", href: "/declaration" },
      { label: "Cancellation & Refund Policy", href: "/cancellation-refund" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Contact Us", href: "/contact" },
      { label: "Blogs", href: "/blog" },
    ],
  },
];
