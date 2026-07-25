import { useEffect, useState } from "react";
import { Link, useParams } from "wouter";
import Nav from "../components/Nav";

const BASE = import.meta.env.BASE_URL?.replace(/\/$/, "") || "";
const API  = `${BASE}/api`;

interface Post {
  slug: string;
  title: string;
  category: string;
  excerpt: string | null;
  body: string | null;
  coverImage: string | null;
  publishedAt: string | null;
}

function formatDate(iso: string | null) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export default function JournalPost() {
  const { slug } = useParams<{ slug: string }>();
  const [mounted, setMounted] = useState(false);
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!slug) return;
    fetch(`${API}/journal/${slug}`)
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(d => setPost(d.post))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/beginnings", label: "Beginnings" },
    { href: "/journal", label: "Journal", active: true },
    { href: "/about", label: "About" },
    { href: "/begin-your-story", label: "Begin Your Story" },
  ];

  if (loading) {
    return (
      <div className="bg-[#FAFAFA] min-h-screen">
        <Nav theme="light" mounted={mounted} position="fixed" links={navLinks} />
        <div className="pt-48 text-center font-sans font-light text-[12px] text-[#3A342C]/35 tracking-[0.18em] uppercase">
          Loading…
        </div>
      </div>
    );
  }

  if (notFound || !post) {
    return (
      <div className="bg-[#FAFAFA] min-h-screen">
        <Nav theme="light" mounted={mounted} position="fixed" links={navLinks} />
        <div className="pt-48 text-center">
          <p className="font-serif font-light text-[22px] text-[#3A342C]/50 mb-6">This article isn't available.</p>
          <Link href="/journal" className="font-sans text-[12px] uppercase tracking-[0.18em] text-[#3A342C]/40 hover:text-[#3A342C]/80 transition-colors duration-300">
            ← Back to Journal
          </Link>
        </div>
      </div>
    );
  }

  const paragraphs = (post.body || "").split(/\n\n+/).filter(Boolean);

  return (
    <div className="bg-[#FAFAFA] text-[#3A342C] min-h-screen">

      <Nav theme="light" mounted={mounted} position="fixed" links={navLinks} />

      {/* Cover image */}
      {post.coverImage && (
        <div className="w-full h-[55vh] md:h-[70vh] overflow-hidden">
          <img
            src={post.coverImage}
            alt={post.title}
            className="w-full h-full object-cover object-center"
            style={{ filter: "sepia(0.04) contrast(1.04)" }}
          />
        </div>
      )}

      {/* Article */}
      <div className={`max-w-[680px] mx-auto px-6 md:px-0 ${post.coverImage ? "pt-16 md:pt-24" : "pt-32 md:pt-52"} pb-24 md:pb-48`}>

        {/* Back link */}
        <Link
          href="/journal"
          className="font-sans font-light text-[11px] uppercase tracking-[0.2em] text-[#3A342C]/35 hover:text-[#3A342C]/70 transition-colors duration-300 mb-10 block"
        >
          ← Journal
        </Link>

        {/* Meta */}
        <p className="font-sans font-light text-[10px] uppercase tracking-[0.28em] text-[#3A342C]/38 mb-5">
          {post.category}{post.publishedAt ? ` · ${formatDate(post.publishedAt)}` : ""}
        </p>

        {/* Title */}
        <h1 className="font-serif font-light text-[34px] md:text-[48px] lg:text-[56px] text-[#3A342C] leading-[1.1] tracking-[0.005em] mb-8 md:mb-10">
          {post.title}
        </h1>

        {/* Excerpt / lead */}
        {post.excerpt && (
          <>
            <p className="font-serif text-[17px] md:text-[19px] font-light text-[#3A342C]/70 leading-[1.75] tracking-[0.01em] mb-8">
              {post.excerpt}
            </p>
            <div className="w-10 h-px bg-[#3A342C]/18 mb-10" />
          </>
        )}

        {/* Body */}
        <div className="space-y-6">
          {paragraphs.map((p, i) => (
            <p key={i} className="font-sans font-light text-[15px] md:text-[16px] text-[#3A342C]/72 leading-[1.9] tracking-[0.01em]">
              {p}
            </p>
          ))}
        </div>

        {/* Footer rule */}
        <div className="mt-16 md:mt-24 pt-10 border-t border-[#3A342C]/10 flex items-center justify-between">
          <Link
            href="/journal"
            className="font-sans font-light text-[11px] uppercase tracking-[0.2em] text-[#3A342C]/38 hover:text-[#3A342C]/75 transition-colors duration-300"
          >
            ← All articles
          </Link>
          <span className="font-sans font-light text-[10px] uppercase tracking-[0.18em] text-[#3A342C]/25">
            Evermor Tales
          </span>
        </div>
      </div>
    </div>
  );
}
