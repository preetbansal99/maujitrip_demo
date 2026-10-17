import type { Metadata, Viewport } from "next";
import { Dancing_Script, Inter, Poppins } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const dancing = Dancing_Script({
  variable: "--font-dancing",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const viewport: Viewport = {
  themeColor: "#003b53",
};

export const metadata: Metadata = {
  title: "MaujiTrip | Book Flights, Hotels, Buses & Tour Packages",
  description:
    "Travel more, worry less. MaujiTrip brings you the best deals on flights, hotels, buses & holidays.",
  icons: {
    icon: "/images/favicon.jpg",
    apple: "/images/apple-touch-icon.png",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${inter.variable} ${poppins.variable} ${dancing.variable} min-h-full flex flex-col font-sans`}
      >
        {children}
      </body>
    </html>
  );
}
