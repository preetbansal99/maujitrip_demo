import LegalPage from "@/components/LegalPage";

export default function AboutPage() {
  return (
    <LegalPage
      title="About Us"
      intro="India's favourite travel platform since 2012. From flights and hotels to full holiday packages — one platform, infinite destinations."
    >
      <p>
        <strong>MaujiTrip</strong> is a leading travel agent in the field of Travel &amp; Tourism.
        We are a Noida-based company founded in 2012, and have become India&apos;s best emerging
        online travel and tour platform.
      </p>
      <p>
        We initially had a small team of tour and travel experts. As a result of the
        public&apos;s support and enthusiasm, we have expanded into a sizable, dedicated
        workforce.
      </p>
      <h2>Why travel with us</h2>
      <ul>
        <li>The best emerging online travel site, mainly focused on customer satisfaction.</li>
        <li>Availability of cheap air tickets for both domestic and international flights.</li>
        <li>Grab the most profitable deals on flight bookings, travel packages, and much more.</li>
        <li>Proper travel guidance so you have basic knowledge about the places you visit.</li>
        <li>Traveling safety is a common concern. We take care of your safety throughout.</li>
        <li>Our team is available 24 hours a day for your smooth journey and related queries.</li>
        <li>Client satisfaction is our foremost motive, building trust from every corner of the world.</li>
        <li>We arrange everything from international flights to hotels, cars, and food for business.</li>
      </ul>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6">
        {[
          "/images/about-taj.jpg",
          "/images/about-goa.jpg",
          "/images/about-india.jpg",
        ].map((src) => (
          <img
            key={src}
            src={src}
            alt="India travel"
            loading="lazy"
            className="h-36 w-full object-cover rounded-2xl"
          />
        ))}
      </div>
    </LegalPage>
  );
}
