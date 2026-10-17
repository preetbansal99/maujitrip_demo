"use client";

import { useEffect, useState } from "react";
import SiteChrome from "@/components/SiteChrome";

function fmtDate(s: string | null) {
  if (!s) return "";
  return new Date(s.slice(0, 10) + "T00:00:00").toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const [slug, setSlug] = useState<string | null>(null);
  const [post, setPost] = useState<any | null>(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    params.then((p) => setSlug(p.slug));
  }, [params]);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    (async () => {
      try {
        const r = await fetch(`/api/live/blog/posts/${encodeURIComponent(slug)}`).then((x) => x.json());
        if (!cancelled) {
          if (r?.data) setPost(r.data);
          else setMissing(true);
        }
      } catch {
        if (!cancelled) setMissing(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  return (
    <SiteChrome>
      <div className="min-h-screen bg-white pb-16 md:pb-0 pt-20">
        <div className="max-w-4xl mx-auto section-pad pb-12">
          {!post && !missing && (
            <div className="animate-pulse">
              <div className="aspect-[21/9] rounded-lg bg-[#EEF3F5]" />
              <div className="mt-4 h-6 w-4/5 rounded bg-[#EEF3F5]" />
              <div className="mt-3 h-4 w-full rounded bg-[#EEF3F5]" />
              <div className="mt-2 h-4 w-2/3 rounded bg-[#EEF3F5]" />
            </div>
          )}
          {missing && <p className="text-sm text-gray-500">Post not found.</p>}
          {post && (
            <>
              <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-gray-500 mb-4">
                <a href="/" className="hover:text-[#023341]">Home</a>
                <span>/</span>
                <a href="/blog" className="hover:text-[#023341]">Blogs</a>
                <span>/</span>
                <span className="text-gray-800 font-medium truncate">{post.title}</span>
              </nav>
              {post.category && (
                <span className="inline-block rounded-full bg-[#E3A21A] px-3 py-1 text-sm font-semibold text-[#13293D]">
                  {post.category.name}
                </span>
              )}
              <h1 className="mt-3 font-display text-2xl md:text-4xl font-bold leading-tight text-gray-900">
                {post.title}
              </h1>
              <p className="mt-3 text-sm text-[#5B6770]">
                {post.author && <span className="font-semibold text-gray-800">{post.author}</span>}
                {post.published_at && <span> · {fmtDate(post.published_at)}</span>}
                {post.read_minutes && <span> · {post.read_minutes} min read</span>}
              </p>
              {post.image && (
                <img
                  src={post.image}
                  alt={post.image_alt || post.title}
                  className="mt-6 w-full rounded-lg object-cover aspect-[21/9]"
                />
              )}
              {post.content ? (
                <div
                  className="mt-6 text-[15px] leading-[1.8] text-gray-700 [&_p]:mb-4 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-gray-900 [&_h2]:mt-6 [&_h2]:mb-2 [&_img]:rounded-lg [&_img]:my-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_a]:text-[#0E6E6B] [&_a]:underline"
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              ) : (
                post.excerpt && <p className="mt-6 text-[15px] leading-[1.8] text-gray-700">{post.excerpt}</p>
              )}
            </>
          )}
        </div>
      </div>
    </SiteChrome>
  );
}
