"use client";

import { useEffect, useState } from "react";
import SiteChrome from "@/components/SiteChrome";

interface Post {
  slug: string;
  title: string;
  excerpt: string;
  image: string | null;
  image_alt: string | null;
  category: { name: string; slug: string } | null;
  author: string | null;
  read_minutes: number | null;
  published_at: string | null;
}

function fmtDate(s: string | null) {
  if (!s) return "";
  return new Date(s.slice(0, 10) + "T00:00:00").toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [cats, setCats] = useState<{ name: string; slug: string }[]>([]);
  const [cat, setCat] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [p, c] = await Promise.all([
          fetch("/api/live/blog/posts").then((x) => x.json()),
          fetch("/api/live/blog/categories").then((x) => x.json()).catch(() => null),
        ]);
        if (!cancelled) {
          const list = Array.isArray(p?.data) ? p.data : [];
          setPosts(list);
          const cl = c?.data;
          if (Array.isArray(cl)) setCats(cl);
        }
      } catch {
        if (!cancelled) setPosts([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const featured = posts?.find((p) => (p as any).is_featured) || posts?.[0];
  const rest = (posts || []).filter((p) => p.slug !== featured?.slug);
  const shown = cat ? rest.filter((p) => p.category?.slug === cat) : rest;

  return (
    <SiteChrome>
      <div className="min-h-screen bg-white pb-16 md:pb-0 pt-20">
        <div className="max-w-7xl mx-auto section-pad">
          <h1 className="font-display text-2xl md:text-3xl font-bold text-[#003b53]">Blogs</h1>
          <p className="mt-1 text-sm md:text-[15px] text-[#5B6770]">
            Read travel tips, destination guides, and travel inspiration on the MaujiTrip blog.
          </p>

          {!posts && (
            <div className="mt-6 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 animate-pulse">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div key={i}>
                  <div className="aspect-[4/3] rounded-lg bg-[#EEF3F5]" />
                  <div className="mt-4 h-4 w-1/3 rounded bg-[#EEF3F5]" />
                  <div className="mt-3 h-6 w-4/5 rounded bg-[#EEF3F5]" />
                </div>
              ))}
            </div>
          )}

          {featured && (
            <a href={`/blog/${featured.slug}`} className="group mt-6 block focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0E6E6B] rounded-lg">
              <div className="relative aspect-[16/10] md:aspect-[21/9] bg-[#13293D] rounded-lg overflow-hidden">
                {featured.image ? (
                  <img
                    src={featured.image}
                    alt={featured.image_alt || featured.title}
                    loading="lazy"
                    className="h-full w-full object-cover opacity-90"
                  />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-[#0E6E6B] to-[#13293D]" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#13293D] via-[#13293D]/40 to-transparent" />
                <div className="absolute bottom-0 left-0 max-w-3xl p-6 md:p-10">
                  {featured.category && (
                    <span className="inline-block rounded-full bg-[#E3A21A] px-3 py-1 text-sm font-semibold text-[#13293D]">
                      {featured.category.name}
                    </span>
                  )}
                  <p className="mt-4 text-2xl font-bold leading-tight text-white md:text-4xl">
                    {featured.title}
                  </p>
                  <p className="mt-3 hidden text-white/80 md:block md:text-lg line-clamp-2">
                    {featured.excerpt}
                  </p>
                </div>
              </div>
            </a>
          )}

          {cats.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setCat(null)}
                className={`rounded-full px-4 py-1.5 text-xs font-semibold ${cat === null ? "bg-[#003b53] text-white" : "bg-gray-100 text-gray-700"}`}
              >
                All
              </button>
              {cats.map((c) => (
                <button
                  key={c.slug}
                  type="button"
                  onClick={() => setCat(cat === c.slug ? null : c.slug)}
                  className={`rounded-full px-4 py-1.5 text-xs font-semibold ${cat === c.slug ? "bg-[#003b53] text-white" : "bg-gray-100 text-gray-700"}`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          )}

          <div className="mt-6 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 pb-12">
            {shown.map((p) => (
              <a
                key={p.slug}
                href={`/blog/${p.slug}`}
                className="group flex flex-col focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0E6E6B] rounded-lg"
              >
                <div className="aspect-[4/3] overflow-hidden rounded-lg bg-[#EEF3F5]">
                  {p.image ? (
                    <img
                      src={p.image}
                      alt={p.image_alt || p.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-[#0E6E6B] to-[#13293D]" />
                  )}
                </div>
                <p className="text-sm font-medium text-[#0E6E6B] mt-2">
                  {p.category ? ` in ${p.category.name}` : ""}
                  {p.read_minutes ? ` · ${p.read_minutes} min read` : ""}
                </p>
                <p className="mt-2 line-clamp-2 text-[15px] leading-relaxed text-[#5B6770]">
                  {p.excerpt}
                </p>
                <p className="mt-3 text-sm text-[#5B6770]">
                  {p.author && <span className="font-semibold text-gray-800">{p.author}</span>}
                  {p.published_at && <span> · {fmtDate(p.published_at)}</span>}
                </p>
              </a>
            ))}
          </div>
          {posts && shown.length === 0 && (
            <p className="pb-12 text-sm text-gray-500">No posts found.</p>
          )}
        </div>
      </div>
    </SiteChrome>
  );
}
