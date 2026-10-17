"use client";

import { useState } from "react";

const PROSE =
  "text-[14px] md:text-[15px] leading-[1.75] text-gray-700 [&_h2]:text-lg [&_h2]:md:text-xl [&_h2]:font-bold [&_h2]:text-[#003b53] [&_h2]:mt-7 [&_h2]:mb-2.5 [&_h3]:text-base [&_h3]:md:text-lg [&_h3]:font-semibold [&_h3]:text-[#003b53] [&_h3]:mt-6 [&_h3]:mb-2 [&_h4]:text-[15px] [&_h4]:font-semibold [&_h4]:text-gray-900 [&_h4]:mt-5 [&_h4]:mb-1.5 [&_h6]:text-[15px] [&_h6]:font-semibold [&_h6]:text-[#003b53] [&_h6]:mt-5 [&_h6]:mb-1.5 [&>*:first-child]:mt-0 [&_p]:mb-3.5 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_ul]:space-y-1.5 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-4 [&_ol]:space-y-1.5 [&_li]:leading-relaxed [&_a]:text-[#003b53] [&_a]:underline [&_a]:underline-offset-2 [&_a:hover]:text-[#002d40] [&_strong]:font-semibold [&_strong]:text-gray-900 [&_em]:italic";

export default function SeoContent() {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <div
        id="seo-clamp"
        style={{
          position: "relative",
          overflow: "hidden",
          maxHeight: open ? undefined : 220,
        }}
      >
        <div>
          <section className="w-full bg-[#efeeeb] py-10 md:py-12 section-pad">
            <div className="max-w-7xl mx-auto">
              <h1 className="text-2xl md:text-3xl font-bold text-[#003b53] leading-snug mb-2">
                Book Flights, Hotels, Buses &amp; Tour Packages with MaujiTrip
              </h1>
              <div className={PROSE}>
                <p>
                  Plan your next journey with <strong>MaujiTrip</strong>, a trusted travel
                  platform helping travelers book{" "}
                  <strong>flights, hotels, buses and holiday packages</strong> in one place.
                  Whether you are planning a quick domestic trip, a family holiday, a honeymoon,
                  a group tour or an international vacation, MaujiTrip makes travel planning
                  simple, convenient and easy to manage.
                </p>
                <p>
                  From finding the right <strong>flight ticket booking</strong> option to choosing
                  a comfortable hotel or exploring a curated holiday package, our platform brings
                  different travel needs together so you can spend less time planning and more
                  time enjoying your journey.
                </p>
                <p>
                  <strong>Search. Book. Travel. Make Every Journey a MaujiTrip.</strong>
                </p>
                <p>
                  <strong>[Book Flights] [Book Hotels] [Book Bus] [Explore Tour Packages]</strong>
                </p>
                <h2>Your Complete Travel Partner for Every Journey</h2>
                <p>
                  Travel planning should not feel complicated. MaujiTrip brings essential travel
                  services together on one platform, giving you an easier way to plan and book
                  your trip.
                </p>
                <h3>Online Flight Booking</h3>
                <p>
                  Find and book domestic and international flights through MaujiTrip. Search
                  different flight options, compare available fares and choose a journey that fits
                  your travel plans and budget.
                </p>
                <p>
                  Whether you are travelling for business, visiting family or planning a holiday,
                  our <strong>online flight booking</strong> platform makes{" "}
                  <strong>flight ticket booking</strong> simple and convenient.
                </p>
                <h3>Hotel Booking</h3>
                <p>
                  Your stay is an important part of every trip. With MaujiTrip, you can explore
                  hotel options for different destinations, travel styles and budgets.
                </p>
                <p>
                  From comfortable stays for family holidays to hotels for business trips and
                  romantic getaways, find accommodation that complements your travel plans.
                </p>
                <h3>Bus Booking</h3>
                <p>
                  Travelling by road? Use MaujiTrip for convenient <strong>bus booking</strong>{" "}
                  across popular routes. Choose from available travel options based on your
                  destination, journey schedule and preferences.
                </p>
                <h3>Holiday &amp; Tour Packages</h3>
                <p>
                  Don&apos;t want to plan every part of your trip yourself? Explore thoughtfully
                  designed <strong>tour packages</strong> and <strong>holiday packages</strong>{" "}
                  covering popular destinations in India and abroad.
                </p>
                <p>
                  Choose from family holidays, honeymoon trips, group tours, seasonal holidays and
                  destination-specific packages designed to make trip planning easier.
                </p>
                <h3>Corporate Travel &amp; MICE</h3>
                <p>
                  MaujiTrip also helps businesses manage travel requirements through{" "}
                  <strong>corporate travel and MICE solutions</strong>. From business trips and
                  employee travel to meetings, incentives, conferences and events, our team can
                  help organizations plan travel more efficiently.
                </p>
                <h2>Discover Holiday Destinations with MaujiTrip</h2>
                <p>
                  Every destination has a different story to tell. Explore places that match the
                  way you want to travel—from heritage cities and mountain escapes to beaches,
                  international destinations and unforgettable cultural experiences.
                </p>
                <h3>Rajasthan Tour Packages</h3>
                <p>
                  Experience royal palaces, historic forts, colourful markets and the landscapes
                  of the Thar Desert with our <strong>Rajasthan tour packages</strong>.
                </p>
                <p>
                  Explore destinations such as Jaipur, Udaipur, Jodhpur, Jaisalmer and Pushkar
                  while enjoying an itinerary designed around your travel style.
                </p>
                <h3>Kashmir Tour Packages</h3>
                <p>
                  Discover snow-covered mountains, beautiful valleys, peaceful lakes and memorable
                  experiences with <strong>Kashmir tour packages</strong>.
                </p>
                <p>
                  Choose from family holidays, honeymoon packages, group tours and seasonal
                  Kashmir experiences.
                </p>
                <h3>Goa Tour Packages</h3>
                <p>
                  Looking for beaches, relaxed days and vibrant experiences? Explore{" "}
                  <strong>Goa tour packages</strong> designed for couples, families, friends and
                  groups.
                </p>
                <h3>Kerala Tour Packages</h3>
                <p>
                  From the hills of Munnar to the backwaters of Alleppey, experience Kerala
                  through carefully planned <strong>Kerala tour packages</strong>.
                </p>
                <h3>Dubai Holiday Packages</h3>
                <p>
                  Explore modern architecture, shopping, desert experiences and iconic attractions
                  with our <strong>Dubai holiday packages</strong>.
                </p>
                <h3>Europe Tour Packages</h3>
                <p>
                  Planning your first European holiday? Explore multi-destination{" "}
                  <strong>Europe tour packages</strong> designed to help you experience some of
                  the continent&apos;s most popular cities and attractions.
                </p>
                <p>
                  <strong>Explore All Destinations →</strong>
                </p>
                <h2>Find Flights That Fit Your Journey</h2>
                <p>
                  Whether you are travelling within India or planning an international trip,
                  MaujiTrip makes it easier to search for available flight options according to
                  your travel requirements.
                </p>
                <h3>Domestic Flight Booking</h3>
                <p>
                  Book domestic flights between popular Indian cities and destinations. Whether
                  you are travelling from Delhi to Mumbai, Bangalore to Delhi, Mumbai to
                  Bangalore or another major route, search available options and select a flight
                  that works for your schedule.
                </p>
                <h3>International Flight Booking</h3>
                <p>
                  Planning a trip outside India? Search{" "}
                  <strong>international flight booking</strong> options for popular destinations
                  around the world and plan your journey from one convenient platform.
                </p>
                <h3>Looking for Cheap Flight Tickets?</h3>
                <p>
                  Everyone wants to travel at a better price. Instead of focusing only on the
                  lowest displayed fare, compare available flight options, check different travel
                  dates when possible and look for applicable offers before completing your
                  booking.
                </p>
                <p>
                  MaujiTrip regularly provides travel offers and promotional deals that can help
                  eligible travelers save on their bookings.
                </p>
                <p>
                  <strong>Search Flights with MaujiTrip →</strong>
                </p>
                <h2>Why Choose MaujiTrip?</h2>
                <p>
                  Choosing the right travel platform can make your trip planning much easier.
                  MaujiTrip focuses on giving travelers a simple booking experience along with
                  travel options for different needs and budgets.
                </p>
                <h3>One Platform for Multiple Travel Needs</h3>
                <p>
                  Book flights, hotels, buses and holiday packages without having to manage every
                  travel requirement separately.
                </p>
                <h3>Travel Options for Different Budgets</h3>
                <p>
                  Whether you are planning a budget-friendly getaway, a family vacation or a
                  premium holiday, explore options according to your preferences.
                </p>
                <h3>Easy Online Booking</h3>
                <p>
                  Our website and mobile experience are designed to make searching and booking
                  travel services straightforward.
                </p>
                <h3>Curated Holiday Experiences</h3>
                <p>
                  Our destination and tour packages are created around different travel
                  interests, including family holidays, honeymoon trips, group tours and seasonal
                  vacations.
                </p>
                <h3>Travel Support</h3>
                <p>
                  Need help with your travel plans? Our team is available to assist with
                  travel-related queries and booking requirements.
                </p>
                <h3>Offers &amp; Travel Deals</h3>
                <p>
                  Look out for available offers and promotional deals across eligible travel
                  bookings and destinations.
                </p>
                <h2>Why MaujiTrip?</h2>
                <p>
                  Founded in 2012, MaujiTrip has been built with the goal of making travel
                  easier, more accessible and more enjoyable for travelers.
                </p>
                <p>
                  We bring together{" "}
                  <strong>
                    online flight booking, hotel booking, bus booking and tour packages
                  </strong>{" "}
                  so travelers can discover and plan more of their journey from one platform.
                </p>
                <p>
                  Whether you already know where you want to go or are still deciding your next
                  destination, MaujiTrip helps you move from travel inspiration to booking with a
                  simple and convenient experience.
                </p>
                <p>
                  Your destination may change. Your journey may be different every time. But your
                  travel experience should always be easy.
                </p>
                <h2>Plan Your Trip Your Way</h2>
                <p>
                  Not every traveler travels the same way. Some prefer carefully planned
                  itineraries, while others want flexibility. Some travel with family, while
                  others travel as couples, friends, groups or for business.
                </p>
                <p>That&apos;s why MaujiTrip offers different ways to plan your journey.</p>
                <h3>Family Holidays</h3>
                <p>
                  Create memorable family experiences with destinations and family holiday
                  packages designed for comfortable and enjoyable travel.
                </p>
                <h3>Honeymoon Packages</h3>
                <p>
                  Celebrate your special journey with carefully planned honeymoon packages
                  featuring romantic destinations and memorable experiences.
                </p>
                <h3>Group Tours</h3>
                <p>
                  Travelling with friends, colleagues or a larger group? Explore group tour
                  packages designed around shared travel experiences.
                </p>
                <h3>Seasonal Holidays</h3>
                <p>
                  Discover destinations that are best experienced during particular seasons, from
                  winter escapes to summer holidays and festive getaways.
                </p>
                <h3>Corporate Travel</h3>
                <p>
                  Make business travel easier with corporate booking and travel management
                  solutions for organizations and teams.
                </p>
                <h2>How to Plan Your Trip with MaujiTrip</h2>
                <p>Planning your next holiday doesn&apos;t have to be complicated.</p>
                <ol>
                  <li>
                    <strong>Choose Your Travel Service</strong> — Select flights, hotels, buses or
                    tour packages according to what you need.
                  </li>
                  <li>
                    <strong>Enter Your Travel Details</strong> — Add your destination, travel
                    dates and other required information.
                  </li>
                  <li>
                    <strong>Explore Available Options</strong> — Compare available options and
                    select the one that best matches your requirements.
                  </li>
                  <li>
                    <strong>Complete Your Booking</strong> — Follow the booking process and make
                    your payment securely.
                  </li>
                  <li>
                    <strong>Get Ready to Travel</strong> — Once your booking is confirmed, prepare
                    for your journey and enjoy the experience.
                  </li>
                </ol>
                <h2>Travel Inspiration for Your Next Trip</h2>
                <p>
                  Not sure where to travel next? Explore travel guides, destination ideas and
                  practical travel tips from the MaujiTrip blog.
                </p>
                <p>
                  Discover information about destinations, travel planning, flight booking,
                  holiday ideas and things to know before your journey.
                </p>
                <p>
                  <strong>Explore Travel Guides →</strong>
                </p>
                <h2>Start Planning Your Next Journey</h2>
                <p>
                  Whether you need a flight ticket, hotel, bus or complete holiday package,
                  MaujiTrip brings your travel options together in one place.
                </p>
              </div>
            </div>
          </section>
        </div>
        {!open && (
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              height: 64,
              pointerEvents: "none",
              background: "linear-gradient(to bottom, transparent, #efeeeb)",
            }}
          />
        )}
      </div>
      <div className="max-w-7xl mx-auto section-pad">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="seo-clamp"
          className="mt-3 font-semibold underline underline-offset-2 hover:text-[#f26522] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 rounded text-sm text-[#003b53]"
        >
          {open ? "Read Less" : "Read More"}
        </button>
      </div>
    </div>
  );
}
