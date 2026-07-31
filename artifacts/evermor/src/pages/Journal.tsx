import { useEffect, useState, useRef } from "react";
import { Link } from "wouter";
import Nav from "../components/Nav";

const BASE = import.meta.env.BASE_URL?.replace(/\/$/, "") || "";
const API  = `${BASE}/api`;

interface Post {
  slug: string;
  category: string;
  title: string;
  publishedAt: string | null;
  excerpt: string | null;
  coverImage: string | null;
}

function useInView(threshold = 0.1) {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<any>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsInView(true); observer.unobserve(el); } },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return [ref, isInView] as const;
}

function formatDate(iso: string | null) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-GB", { month: "long", year: "numeric" });
}

function PostCard({ post, index }: { post: Post; index: number }) {
  const [ref, inView] = useInView();
  return (
    <Link href={`/journal/${post.slug}`}>
      <div
        ref={ref}
        className="group cursor-pointer"
        style={{
          opacity: inView ? 1 : 0,
          transform: inView ? "translateY(0)" : "translateY(20px)",
          transition: `opacity 700ms ease-out ${index * 70}ms, transform 700ms ease-out ${index * 70}ms`,
        }}
      >
        {/* Cover image */}
        <div className="overflow-hidden aspect-[3/4] bg-[#E8E7E4] mb-5">
          {post.coverImage ? (
            <img
              src={post.coverImage}
              alt={post.title}
              loading="lazy"
              className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              style={{ filter: "sepia(0.04) contrast(1.04)" }}
            />
          ) : (
            <div className="w-full h-full bg-[#EEEEED]" />
          )}
        </div>

        {/* Meta */}
        <p className="font-sans font-light text-[10px] uppercase tracking-[0.28em] text-[#3A342C]/38 mb-3">
          {post.category}{post.publishedAt ? ` · ${formatDate(post.publishedAt)}` : ""}
        </p>
        <h2 className="font-serif font-light text-[18px] md:text-[20px] text-[#3A342C] leading-[1.3] tracking-[0.005em] mb-3 group-hover:opacity-60 transition-opacity duration-300">
          {post.title}
        </h2>
        {post.excerpt && (
          <p className="font-sans font-light text-[13px] text-[#3A342C]/50 leading-[1.8] tracking-[0.01em] mb-4">
            {post.excerpt}
          </p>
        )}
        <span className="font-sans font-light text-[11px] uppercase tracking-[0.18em] text-[#3A342C]/35 group-hover:text-[#3A342C]/70 transition-colors duration-300">
          Read →
        </span>
      </div>
    </Link>
  );
}

export default function Journal() {
  const [mounted, setMounted] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [headingRef, headingInView] = useInView();
  const [introRef, introInView] = useInView();

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    fetch(`${API}/journal`)
      .then(r => r.json())
      .then(d => setPosts(d.posts || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-[#FAFAFA] text-[#3A342C] min-h-screen">

      <Nav
        theme="light"
        mounted={mounted}
        position="fixed"
        links={[
          { href: "/", label: "Home" },
          { href: "/about", label: "About" },
          { href: "/beginnings", label: "Beginnings" },
          { href: "/approach", label: "Approach" },
          { href: "/journal", label: "Journal", active: true },
          { href: "/begin-your-story", label: "Begin Your Story" },
        ]}
      />

      {/* Header */}
      <div className="pt-28 md:pt-52 pb-14 md:pb-24 max-w-[760px] mx-auto px-6 md:px-0 text-center">
        <p className="font-sans uppercase tracking-[0.38em] text-[8px] md:text-[9px] text-[#3A342C]/30 mb-6">
          ✦ &nbsp; Evermor Tales &nbsp; ✦
        </p>
        <h1
          ref={headingRef}
          className={`font-serif font-light text-[52px] md:text-[80px] lg:text-[100px] text-[#3A342C] leading-[1.0] tracking-[0.005em] mb-8 md:mb-10 transition-all duration-[900ms] ease-out ${headingInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
        >
          Journal
        </h1>
        <p
          ref={introRef}
          className={`font-sans font-light text-[14px] md:text-[15px] text-[#3A342C]/50 leading-[1.9] tracking-[0.02em] max-w-[480px] mx-auto transition-all duration-[900ms] ease-out ${introInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          style={{ transitionDelay: introInView ? "150ms" : "0ms" }}
        >
          Thoughts on light, memory, and the quiet moments that make a family's story worth keeping.
        </p>
      </div>

      {/* Thin rule */}
      <div className="max-w-[1060px] mx-auto px-6 md:px-10">
        <div className="border-t border-[#3A342C]/10" />
      </div>

      {/* Grid */}
      <div className="max-w-[1060px] mx-auto px-6 md:px-10 pt-16 md:pt-24 pb-24 md:pb-48">
        {loading ? (
          <div className="py-20 text-center font-sans font-light text-[12px] text-[#3A342C]/35 tracking-[0.18em] uppercase">
            Loading…
          </div>
        ) : posts.length === 0 ? (
          <div className="py-20 text-center">
            <p className="font-serif font-light text-[22px] text-[#3A342C]/40 italic mb-4">Articles coming soon.</p>
            <p className="font-sans font-light text-[13px] text-[#3A342C]/30 tracking-[0.08em]">
              Check back shortly — or write the first one at{" "}
              <a href="/admin/journal" className="underline underline-offset-2 hover:opacity-70 transition-opacity">/admin/journal</a>.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 md:gap-x-12 gap-y-16 md:gap-y-20">
            {posts.map((post, i) => (
              <PostCard key={post.slug} post={post} index={i} />
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
