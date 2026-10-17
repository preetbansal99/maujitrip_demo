"use client";

import { useCallback, useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CallbackModal from "@/components/CallbackModal";
import LoginModal from "@/components/LoginModal";
import BottomNav from "@/components/BottomNav";

export default function SiteChrome({
  children,
  active,
  hideFooter = false,
}: {
  children: React.ReactNode;
  active?: string;
  hideFooter?: boolean;
}) {
  const [callbackOpen, setCallbackOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  const openLogin = useCallback(() => setLoginOpen(true), []);

  useEffect(() => {
    const handler = () => setCallbackOpen(true);
    const loginHandler = () => setLoginOpen(true);
    window.addEventListener("maujitrip:open-callback", handler);
    window.addEventListener("maujitrip:open-login", loginHandler);
    return () => {
      window.removeEventListener("maujitrip:open-callback", handler);
      window.removeEventListener("maujitrip:open-login", loginHandler);
    };
  }, []);

  return (
    <>
      <Header onLogin={openLogin} active={active} />
      <main>
        <div className="min-h-dvh pb-16 md:pb-0">{children}</div>
      </main>
      {!hideFooter && <Footer />}
      <CallbackModal open={callbackOpen} onClose={() => setCallbackOpen(false)} autoOpen={false} />
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
      <BottomNav onAccount={openLogin} />
    </>
  );
}
