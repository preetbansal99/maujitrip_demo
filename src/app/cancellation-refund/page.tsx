import LegalPage from "@/components/LegalPage";

export default function CancellationPage() {
  return (
    <LegalPage
      title="Cancellation & Refund Policy"
      intro="Clear policies for flight, hotel, and holiday cancellations — so you always know where you stand."
    >
      <h2>Flight cancellations</h2>
      <ul>
        <li>
          Every booking is subject to cancellation charges imposed by the airline, which vary
          based on flight and booking class.
        </li>
        <li>
          MaujiTrip applies a nominal fee of ₹300 per passenger per sector for domestic flights
          and ₹500 per sector for international flights.
        </li>
        <li>The MaujiTrip insurance fee is non-refundable.</li>
        <li>The premium paid for Zero Cancellation-Fee product at booking is non-refundable.</li>
        <li>Convenience fees and Payment Gateway charges are non-refundable in all cases.</li>
        <li>Some bookings may have a non-refundable policy as per the specific airline&apos;s terms.</li>
        <li>Partial cancellations may not be allowed for certain bookings.</li>
      </ul>
      <h2>How to cancel</h2>
      <ul>
        <li>
          Cancellations can be made online through your user account or by sending an email to
          MaujiTrip. Email us directly for the fastest resolution.
        </li>
        <li>
          For cancellations within 24 hours of journey, contact the airline directly first,
          then submit a cancellation request on MaujiTrip.
        </li>
        <li>
          MaujiTrip is not responsible for flight delays, cancellations, or amendments made by
          the airline.
        </li>
        <li>
          No-show or unutilized booking refunds must be requested within 90 days from the
          travel date — unclaimed amounts will be forfeited.
        </li>
        <li>
          Tickets issued by MaujiTrip are valid for one year from issuance or as per the
          airline&apos;s policy.
        </li>
      </ul>
      <h2>Holiday bookings</h2>
      <ul>
        <li>The following charges apply to holiday bookings made with MaujiTrip.</li>
        <li>
          Cancellation charges may vary depending on specific terms and conditions of the
          booking.
        </li>
      </ul>
    </LegalPage>
  );
}
