"use client";

import { useCallback, useEffect, useState } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import PromoStrip from "@/components/PromoStrip";
import Offers from "@/components/Offers";
import TopRoutes from "@/components/TopRoutes";
import Categories from "@/components/Categories";
import WhyChoose from "@/components/WhyChoose";
import Destinations from "@/components/Destinations";
import SeoContent from "@/components/SeoContent";
import FlightRoutesLinks from "@/components/FlightRoutesLinks";
import Faq from "@/components/Faq";
import Footer from "@/components/Footer";
import CallbackModal from "@/components/CallbackModal";
import LoginModal from "@/components/LoginModal";
import BottomNav from "@/components/BottomNav";

export default function Home() {
  const [callbackOpen, setCallbackOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  const openLogin = useCallback(() => setLoginOpen(true), []);

  useEffect(() => {
    const handler = () => setCallbackOpen(true);
    window.addEventListener("maujitrip:open-callback", handler);
    return () => window.removeEventListener("maujitrip:open-callback", handler);
  }, []);

  return (
    <>
      <Header onLogin={openLogin} />
      <main>
        <div className="min-h-screen pb-16 md:pb-0">
          <PromoStrip />
          <Hero />
          <Offers />
          <TopRoutes />
          <Categories />
          <WhyChoose />
          <Destinations />
          <SeoContent />
          <FlightRoutesLinks />
          <Faq />
        </div>
      </main>
      <Footer />
      <CallbackModal
        open={callbackOpen}
        onClose={() => setCallbackOpen(false)}
        autoOpen
      />
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
      <BottomNav onAccount={openLogin} />
    </>
  );
}
