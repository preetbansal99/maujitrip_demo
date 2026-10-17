import Link from "next/link";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#efeeeb] px-4 text-center">
      <img alt="MaujiTrip" className="h-12 w-auto object-contain" src="/images/maujitrip-logo.png" />
      <h1 className="mt-6 font-display text-4xl font-extrabold text-[#023341]">Page not found</h1>
      <p className="mt-2 max-w-md text-sm text-gray-600">
        This demo page hasn&apos;t taken off yet. Head back home to continue exploring flights,
        hotels, buses &amp; holidays.
      </p>
      <Link
        href="/"
        className="mt-6 flex items-center gap-2 rounded-full bg-[#023341] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#034a5c] transition-colors"
      >
        <Home size={16} /> Back to Home
      </Link>
    </main>
  );
}
