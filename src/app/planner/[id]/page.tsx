"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Copy, Send, Compass, Sparkles } from "lucide-react";
import SiteChrome from "@/components/SiteChrome";
import { inr } from "@/data/demo";
import type { TripPlan, TripProfile } from "@/lib/planner/engine";

interface SavedPlanData {
  id: string;
  createdAt: string;
  plan: TripPlan;
  profile: TripProfile;
}

export default function PlannerViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [id, setId] = useState<string | null>(null);
  const [data, setData] = useState<SavedPlanData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    params.then((p) => setId(p.id));
  }, [params]);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/plans/${encodeURIComponent(id)}`);
        if (!res.ok) {
          if (!cancelled) setNotFound(true);
          return;
        }
        const json = await res.json();
        if (!cancelled) {
          if (json && json.plan) {
            setData(json);
          } else {
            setNotFound(true);
          }
        }
      } catch {
        if (!cancelled) setNotFound(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleCopy = async () => {
    if (typeof window !== "undefined" && navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      } catch {
        /* ignore copy error */
      }
    }
  };

  if (!loading && notFound) {
    return (
      <SiteChrome active="planner">
        <div className="flex min-h-dvh items-center justify-center bg-[#efeeeb] pb-16 md:pb-12">
          <div className="section-pad mx-auto max-w-md py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white text-[#023341]">
              <Compass size={28} />
            </div>
            <h1 className="mt-5 font-display text-2xl font-extrabold text-[#023341] md:text-3xl">
              Trip plan not found
            </h1>
            <p className="mt-2 text-base leading-relaxed text-gray-700">
              This trip plan link may have expired or does not exist. You can create a new personalized itinerary in minutes with Mauji.
            </p>
            <div className="mt-6 flex justify-center">
              <Link
                href="/planner"
                className="inline-flex items-center gap-2 rounded-full bg-[#d63f00] px-6 py-2.5 text-base font-bold text-white transition-colors hover:bg-[#b53a00]"
              >
                <Sparkles size={16} /> Open trip planner
              </Link>
            </div>
          </div>
        </div>
      </SiteChrome>
    );
  }

  if (loading || !data) {
    return (
      <SiteChrome active="planner">
        <div className="min-h-dvh bg-[#efeeeb] pb-16 md:pb-12">
          <div className="section-pad mx-auto max-w-2xl pt-20 pb-8 md:pt-24">
            <div className="rounded-2xl bg-white p-8 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#efeeeb] text-[#023341]">
                <Sparkles size={22} />
              </div>
              <p className="mt-3 text-base font-medium text-gray-700">Loading saved plan…</p>
            </div>
          </div>
        </div>
      </SiteChrome>
    );
  }

  const { plan, profile } = data;
  const meta = [
    profile.destination || "Flexible destination",
    profile.days ? `${profile.days} days` : `${plan.days.length} days`,
    `${profile.travellers} travellers`,
    profile.budget ? inr(profile.budget) : "Flexible budget",
  ].join(" · ");

  return (
    <SiteChrome active="planner">
      <div className="min-h-dvh bg-[#efeeeb] pb-16 md:pb-12">
        <div className="section-pad pt-20 pb-8 md:pt-24">
          <div className="mx-auto max-w-2xl">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <Link
                href="/planner"
                className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-[#023341] hover:text-white"
              >
                <ArrowLeft size={16} /> Back to planner
              </Link>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-[#023341] transition-colors hover:bg-[#023341] hover:text-white"
                >
                  {copied ? (
                    <>
                      <CheckCircle2 size={16} className="text-green-700" /> Share link copied
                    </>
                  ) : (
                    <>
                      <Copy size={16} /> Copy share link
                    </>
                  )}
                </button>
                <Link
                  href={`/planner?planId=${encodeURIComponent(data.id)}`}
                  className="inline-flex items-center gap-2 rounded-full bg-[#d63f00] px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-[#b53a00]"
                >
                  <Send size={15} /> Continue in planner chat
                </Link>
              </div>
            </div>

            <div className="mt-6">
              <h1 className="font-display text-3xl font-bold tracking-tight text-[#003b53] md:text-4xl">
                Saved trip plan
              </h1>
              <p className="mt-1 text-base leading-relaxed text-gray-700">
                Shared itinerary created with MaujiTrip AI travel planner.
              </p>
            </div>

            <div className="mt-6 overflow-hidden rounded-2xl bg-white">
              <div className="bg-[#023341] px-5 py-5 md:px-6 md:py-6">
                <h2 className="font-display text-xl font-bold leading-snug text-white md:text-2xl">
                  {plan.title}
                </h2>
                <p className="mt-1 text-sm text-teal-100">{meta}</p>
              </div>

              <div className="bg-white px-5 py-5 md:px-6 md:py-6">
                <p className="text-base leading-relaxed text-gray-900">{plan.summary}</p>

                <p className="mt-6 text-base font-bold text-gray-900">Day by day itinerary</p>
                <ol className="mt-3 space-y-3">
                  {plan.days.map((d) => (
                    <li key={d.day} className="flex gap-3">
                      <span className="w-14 shrink-0 pt-0.5 text-sm font-bold tabular-nums text-[#023341]">
                        Day {d.day}
                      </span>
                      <div className="min-w-0">
                        <p className="text-base font-bold text-gray-900">{d.title}</p>
                        <p className="mt-0.5 text-sm leading-relaxed text-gray-600">{d.detail}</p>
                      </div>
                    </li>
                  ))}
                </ol>

                <div className="mt-6 space-y-2">
                  <p className="text-base font-bold text-gray-900">Trip components</p>

                  {plan.packageSlug && (
                    <a
                      href={`/holidays/packages/${plan.packageSlug}`}
                      className="flex items-baseline justify-between gap-3 rounded-xl bg-[#efeeeb] px-4 py-3 transition-colors hover:bg-[#e3e0d8]"
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-bold text-gray-900">
                          {plan.packageTitle}
                        </span>
                        <span className="block text-sm text-gray-600">
                          Package · {plan.packagePrice ? inr(plan.packagePrice) : "price on page"}
                        </span>
                      </span>
                      <span className="shrink-0 text-sm font-bold tabular-nums text-[#a83200]">
                        View package
                      </span>
                    </a>
                  )}

                  {plan.stay && (
                    <a
                      href={plan.stay.href}
                      className="flex items-baseline justify-between gap-3 rounded-xl bg-[#efeeeb] px-4 py-3 transition-colors hover:bg-[#e3e0d8]"
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-bold text-gray-900">
                          {plan.stay.name}
                        </span>
                        <span className="block text-sm text-gray-600">
                          {plan.stay.city} · <span className="tabular-nums">{inr(plan.stay.price)} a night</span>
                        </span>
                      </span>
                      <span className="shrink-0 text-sm font-bold text-[#a83200]">
                        View stay
                      </span>
                    </a>
                  )}

                  {plan.flightHref && (
                    <a
                      href={plan.flightHref}
                      className="flex items-baseline justify-between gap-3 rounded-xl bg-[#efeeeb] px-4 py-3 transition-colors hover:bg-[#e3e0d8]"
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-bold text-gray-900">
                          {plan.flightNote}
                        </span>
                        <span className="block text-sm text-gray-600">Live fares · one way</span>
                      </span>
                      <span className="shrink-0 text-sm font-bold text-[#a83200]">
                        Search flights
                      </span>
                    </a>
                  )}
                </div>

                <div className="mt-4 flex items-baseline justify-between rounded-xl bg-[#efeeeb] px-4 py-3">
                  <span className="text-sm font-medium text-gray-700">Estimated total</span>
                  <span className="font-display text-2xl font-extrabold tabular-nums text-[#023341]">
                    {inr(plan.estimate)}
                  </span>
                </div>

                <Link
                  href={`/planner?planId=${encodeURIComponent(data.id)}`}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[#d63f00] py-3 text-base font-bold text-white transition-colors hover:bg-[#b53a00]"
                >
                  <Send size={16} /> Continue in planner chat
                </Link>

                <p className="mt-3 text-sm leading-relaxed text-gray-600">
                  Built from MaujiTrip verified inventory. Fares and availability are subject to real-time updates upon booking.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SiteChrome>
  );
}
