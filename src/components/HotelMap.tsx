"use client";

import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";

const COORDS: Record<string, [number, number]> = {
  GOA: [15.2993, 74.124],
  MUMBAI: [19.076, 72.8777],
  DELHI: [28.6139, 77.209],
  "NEW DELHI": [28.6139, 77.209],
  JAIPUR: [26.9124, 75.7873],
  UDAIPUR: [24.5854, 73.7125],
  BENGALURU: [12.9716, 77.5946],
  BANGALORE: [12.9716, 77.5946],
  CHENNAI: [13.0827, 80.2707],
  SHIMLA: [31.1048, 77.1734],
  MANALI: [32.2396, 77.1887],
  KERALA: [9.4981, 76.3388],
  HYDERABAD: [17.385, 78.4867],
  KOLKATA: [22.5726, 88.3639],
  CALANGUTE: [15.54, 73.753],
  BAGA: [15.555, 73.751],
};

export function cityCoords(city: string): [number, number] {
  const key = (city || "").toUpperCase();
  return COORDS[key] || [22.0, 79.0];
}

export default function HotelMap({ city }: { city: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const L = await import("leaflet");
      if (cancelled || !ref.current) return;
      if (mapRef.current) {
        mapRef.current.setView(cityCoords(city), 11);
        return;
      }
      const map = L.map(ref.current, { zoomControl: true }).setView(cityCoords(city), 11);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(map);
      mapRef.current = map;
    })();
    return () => {
      cancelled = true;
    };
  }, [city]);

  useEffect(() => {
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  return <div ref={ref} className="w-full h-full leaflet-container" style={{ minHeight: 200 }} />;
}
