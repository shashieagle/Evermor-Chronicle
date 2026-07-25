import { useEffect, useState, useRef } from "react";
import { Link, useParams } from "wouter";
import Nav from "../components/Nav";
import { storiesBySlug, stories } from "../data/stories";

const BASE = import.meta.env.BASE_URL?.replace(/\/$/, "") || "";

function embedUrl(raw: string): string | null {
  try {
    const u = new URL(raw);
    const ytId = u.searchParams.get("v") ||
      (u.hostname === "youtu.be" ? u.pathname.slice(1) : null);
    if (ytId) return `https://www.youtube.com/embed/${ytId}`;
    if (u.hostname.includes("vimeo.com")) {
      const id = u.pathname.split("/").filter(Boolean)[0];
      if (id) return `https://player.vimeo.com/video/${id}`;
    }
    return raw;
  } catch { return null; }
}

function useInView(threshold = 0.08) {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<any>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setIsInView(true); obs.unobserve(el); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, isInView] as const;
}

// Fade wrapper for scroll-in
function Fade({ children, delay = 0, className = "", style: extraStyle = {} }: {
  children: React.ReactNode; delay?: number; className?: string; style?: React.CSSProperties;
}) {
  const [ref, inView] = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        transition: `opacity 900ms ease-out ${delay}ms, transform 900ms ease-out ${delay}ms`,
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(18px)",
        ...extraStyle,
      }}
    >
      {children}
    </div>
  );
}

// ── Masonry gallery — photos at their natural aspect ratio ────────────────────
const GAP = 4;

function MasonryGallery({ photos, alt }: { photos: string[]; alt: string }) {
  if (!photos.length) return null;
  return (
    <div style={{
      columns: photos.length === 1 ? "1" : "2",
      columnGap: GAP,
      padding: GAP,
    }}>
      {photos.map((src, i) => (
        <Fade
          key={i}
          delay={i * 50}
          style={{ breakInside: "avoid", marginBottom: GAP, display: "block" }}
        >
          <img
            src={src}
            alt={alt}
            loading="lazy"
            style={{ width: "100%", height: "auto", display: "block" }}
          />
        </Fade>
      ))}
    </div>
  );
}

interface DbPhoto { id: number; url: string; position: number; }

export default function Beginnings() {
  const { slug } = useParams<{ slug: string }>();
  const [mounted, setMounted] = useState(false);

  const staticStory = slug ? storiesBySlug[slug] : undefined;
  const currentIndex = stories.findIndex((s) => s.slug === slug);
  const nextStory = stories[(currentIndex + 1) % stories.length];

  // DB overlay — fetched after mount, silent fallback on error
  const [dbOverlay, setDbOverlay] = useState<Record<string, any>>({});
  const [dbPhotos, setDbPhotos] = useState<DbPhoto[]>([]);

  const [narrativeRef, narrativeInView] = useInView();
  const [pauseRef, pauseInView] = useInView();
  const [filmRef, filmInView] = useInView(0.05);
  const [reflectionRef, reflectionInView] = useInView();
  const [inviteRef, inviteInView] = useInView();
  const [nextRef, nextInView] = useInView(0.05);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!slug) return;
    fetch(`${BASE}/api/stories/${slug}`)
      .then(r => r.ok ? r.json() : null)
      .then(d => {
        if (!d) return;
        if (d.story) setDbOverlay(d.story);
        if (d.photos?.length > 0) setDbPhotos(d.photos);
      })
      .catch(() => {});
  }, [slug]);

  if (!staticStory) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center">
        <p className="font-serif font-light text-[#3A342C]/50 text-[20px]">This beginning hasn't been found.</p>
      </div>
    );
  }

  // Merge static + DB — DB fields win when present
  const story = { ...staticStory, ...dbOverlay };

  // Build photo pool — DB uploaded photos take priority, else use hero + photo2
  const base = [staticStory.heroImage, staticStory.photo2].filter(Boolean) as string[];
  const pool = dbPhotos.length > 0 ? dbPhotos.map(p => p.url) : base;
  const alt = story.couple;

  // Split pool across two gallery sections
  const split = Math.ceil(pool.length / 2);
  const gallery1 = pool.slice(0, split).length ? pool.slice(0, split) : pool;
  const gallery2 = pool.slice(split).length ? pool.slice(split) : pool;
  const videoEmbed = story.videoUrl ? embedUrl(story.videoUrl) : null;

  return (
    <div className="bg-[#FAFAF8] text-[#3A342C]">

      {/* ── 1. Hero ───────────────────────────────────────────────── */}
      <section className="relative h-[100vh] w-full overflow-hidden bg-[#1A1612]">
        <div className={`absolute inset-0 z-0 transition-opacity duration-[1200ms] ease-in-out ${mounted ? "opacity-100" : "opacity-0"}`}>
          <img
            src={story.heroImage}
            alt={`${story.couple} — ${story.location}`}
            className="w-full h-full object-cover object-center"
            loading="eager"
          />
          <div className="absolute inset-0 bg-[#1A1612]/25" />
          <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/45 to-transparent" />
        </div>

        {/* Nav */}
        <Nav
          theme="dark"
          mounted={mounted}
          position="absolute"
          links={[
            { href: "/", label: "Home" },
            { href: "/beginnings", label: "Beginnings", active: true },
            { href: "/journal", label: "Journal" },
            { href: "/about", label: "About" },
            { href: "/begin-your-story", label: "Begin Your Story" },
          ]}
        />

        {/* Hero content */}
        <div className="absolute bottom-[80px] left-6 right-6 md:left-[100px] md:right-auto z-10 flex flex-col items-start">
          <h1 className={`font-serif text-[42px] md:text-[64px] lg:text-[76px] leading-[1.1] font-light text-[#F5F0E8] tracking-[0.01em] transition-all duration-[800ms] ease-out delay-[200ms] ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}>
            {story.title}
          </h1>
          <p className={`mt-4 md:mt-5 font-sans text-[16px] md:text-[18px] font-light text-[#F5F0E8]/90 tracking-[0.06em] transition-all duration-[800ms] ease-out delay-[400ms] ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}>
            {story.couple}
          </p>
          <p className={`mt-2 md:mt-3 font-sans text-[11px] md:text-[12px] font-light text-[#F5F0E8]/50 uppercase tracking-[0.28em] transition-all duration-[800ms] ease-out delay-[600ms] ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}>
            {story.location}
          </p>
          <div
            className={`mt-10 md:mt-14 transition-all duration-[800ms] ease-out delay-[900ms] ${mounted ? "opacity-100" : "opacity-0"}`}
            style={{ animation: "evermor-breathe 3s ease-in-out infinite" }}
            aria-hidden="true"
          >
            <svg width="18" height="28" viewBox="0 0 18 28" fill="none">
              <line x1="9" y1="0" x2="9" y2="20" stroke="rgba(245,240,232,0.45)" strokeWidth="1"/>
              <path d="M2 14 L9 22 L16 14" stroke="rgba(245,240,232,0.45)" strokeWidth="1" fill="none"/>
            </svg>
          </div>
        </div>
      </section>

      {/* ── 2. Narrative ─────────────────────────────────────────── */}
      <section className="bg-[#FAFAF8] py-20 md:py-32 lg:py-48">
        <div
          ref={narrativeRef}
          className={`max-w-[620px] mx-auto px-6 md:px-0 transition-all duration-[1000ms] ease-out ${narrativeInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <p className="font-sans font-light text-[11px] uppercase tracking-[0.3em] text-[#3A342C]/40 mb-10">
            {story.location}
          </p>
          <p className="font-serif font-light text-[20px] md:text-[24px] lg:text-[26px] text-[#3A342C] leading-[1.75] tracking-[0.01em]">
            {story.narrative}
          </p>
        </div>
      </section>

      {/* ── 3. Gallery — part one ─────────────────────────────────── */}
      <section className="bg-[#EAE3D3] py-1">
        <MasonryGallery photos={gallery1} alt={alt} />
      </section>

      {/* ── 4. Pause ─────────────────────────────────────────────── */}
      <section className="bg-[#F8F6F2] py-20 md:py-40 lg:py-64">
        <div
          ref={pauseRef}
          className={`max-w-[560px] mx-auto px-6 md:px-0 text-center transition-all duration-[1100ms] ease-out ${pauseInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          <p className="font-serif font-light italic text-[22px] md:text-[28px] lg:text-[32px] text-[#3A342C]/65 leading-[1.6] tracking-[0.01em]">
            {story.pause}
          </p>
        </div>
      </section>

      {/* ── 5. Gallery — part two ─────────────────────────────────── */}
      <section className="bg-[#EAE3D3] py-1">
        <MasonryGallery photos={gallery2} alt={alt} />
      </section>

      {/* ── 6. Film (conditional) ────────────────────────────────── */}
      {story.hasFilm && (
        <section
          ref={filmRef}
          className={`bg-[#1A1612] transition-opacity duration-[1200ms] ease-out ${filmInView ? "opacity-100" : "opacity-0"}`}
        >
          {videoEmbed ? (
            /* Embedded player */
            <div style={{ padding: "clamp(40px,8vw,80px) clamp(24px,8vw,15%) clamp(56px,10vw,112px)" }}>
              <p className="font-sans font-light text-[10px] uppercase tracking-[0.35em] text-[#F5F0E8]/35 mb-8 text-center">Film</p>
              <p className="font-serif font-light text-[22px] md:text-[28px] text-[#F5F0E8] leading-[1.3] tracking-[0.01em] mb-2 text-center">{story.couple}</p>
              <p className="font-sans font-light text-[12px] text-[#F5F0E8]/40 tracking-[0.06em] uppercase mb-10 text-center">{story.location}</p>
              <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                <iframe
                  src={videoEmbed}
                  title={`${story.couple} — Film`}
                  className="absolute inset-0 w-full h-full"
                  style={{ border: "none" }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          ) : (
            /* Coming soon placeholder */
            <div className="py-20 md:py-40 lg:py-56 flex flex-col items-center justify-center text-center px-6">
              <p className="font-sans font-light text-[10px] uppercase tracking-[0.35em] text-[#F5F0E8]/35 mb-10">Film</p>
              <p className="font-serif font-light text-[28px] md:text-[40px] text-[#F5F0E8] leading-[1.3] tracking-[0.01em] mb-6 max-w-[480px]">{story.couple}</p>
              <p className="font-sans font-light text-[13px] text-[#F5F0E8]/40 tracking-[0.06em] uppercase mb-16">{story.location}</p>
              <div className="w-[72px] h-[72px] rounded-full border border-[#F5F0E8]/25 flex items-center justify-center hover:border-[#F5F0E8]/60 transition-colors duration-500 cursor-pointer">
                <svg width="16" height="20" viewBox="0 0 16 20" fill="none">
                  <path d="M1 1.5L15 10L1 18.5V1.5Z" fill="rgba(245,240,232,0.6)" />
                </svg>
              </div>
              <p className="mt-8 font-sans font-light text-[11px] text-[#F5F0E8]/25 tracking-[0.1em] uppercase">Film available soon</p>
            </div>
          )}
        </section>
      )}


      {/* ── 8. Reflection ────────────────────────────────────────── */}
      <section className="bg-[#FAFAF8] py-20 md:py-40 lg:py-64">
        <div
          ref={reflectionRef}
          className={`max-w-[580px] mx-auto px-6 md:px-0 transition-all duration-[1000ms] ease-out ${reflectionInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <div className="w-[32px] border-t border-[#3A342C]/20 mb-12" />
          <p className="font-serif font-light text-[18px] md:text-[22px] text-[#3A342C]/70 leading-[1.8] tracking-[0.01em]">
            {story.reflection}
          </p>
        </div>
      </section>

      {/* ── 9. Invitation ────────────────────────────────────────── */}
      <section className="bg-[#EAE3D3] py-20 md:py-32 lg:py-48">
        <div
          ref={inviteRef}
          className={`max-w-[640px] mx-auto px-6 md:px-0 text-center transition-all duration-[1000ms] ease-out ${inviteInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          <p className="font-sans font-light text-[11px] uppercase tracking-[0.3em] text-[#3A342C]/40 mb-10">Begin Your Story</p>
          <p className="font-serif font-light text-[26px] md:text-[34px] text-[#3A342C] leading-[1.4] tracking-[0.01em] mb-14">
            If you feel something when you look at these photographs, we would be honoured to make yours.
          </p>
          <Link
            href="/begin-your-story"
            className="inline-block font-sans font-light text-[12px] md:text-[13px] text-[#3A342C]/70 tracking-[0.2em] uppercase border border-[#3A342C]/30 px-12 py-4 hover:border-[#3A342C]/70 hover:text-[#3A342C] transition-all duration-500 ease-out"
          >
            Begin Your Story
          </Link>
        </div>

        {/* Next beginning */}
        {nextStory && nextStory.slug !== story.slug && (
          <Link href={`/beginnings/${nextStory.slug}`}>
            <div
              ref={nextRef}
              className={`mt-20 md:mt-32 lg:mt-48 max-w-[900px] mx-auto px-6 md:px-0 group cursor-pointer transition-all duration-[1000ms] ease-out ${nextInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
            >
              <div className="border-t border-[#3A342C]/15 pt-12 flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-12">
                <p className="font-sans font-light text-[11px] uppercase tracking-[0.28em] text-[#3A342C]/35 shrink-0">Next beginning</p>
                <div className="flex items-center gap-8 flex-1">
                  <img
                    src={nextStory.heroImage}
                    alt={nextStory.couple}
                    className="w-[80px] h-[56px] object-cover object-center opacity-75 group-hover:opacity-100 transition-opacity duration-500"
                  />
                  <div>
                    <p className="font-serif font-light text-[20px] md:text-[24px] text-[#3A342C] tracking-[0.01em] group-hover:opacity-60 transition-opacity duration-300">
                      {nextStory.title}
                    </p>
                    <p className="font-sans font-light text-[12px] text-[#3A342C]/45 tracking-[0.08em] mt-1">
                      {nextStory.couple} — {nextStory.location}
                    </p>
                  </div>
                  <span className="ml-auto font-sans font-light text-[12px] tracking-[0.1em] text-[#3A342C]/35 group-hover:text-[#3A342C]/70 transition-colors duration-300 uppercase">View →</span>
                </div>
              </div>
            </div>
          </Link>
        )}
      </section>

    </div>
  );
}
