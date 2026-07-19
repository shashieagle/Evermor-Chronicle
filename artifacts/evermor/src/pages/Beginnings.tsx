import { useEffect, useState, useRef } from "react";
import { Link, useParams } from "wouter";
import { storiesBySlug, stories } from "../data/stories";

function useInView(threshold = 0.12) {
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

export default function Beginnings() {
  const { slug } = useParams<{ slug: string }>();
  const [mounted, setMounted] = useState(false);

  const story = slug ? storiesBySlug[slug] : undefined;

  // Find next story for invitation section
  const currentIndex = stories.findIndex((s) => s.slug === slug);
  const nextStory = stories[(currentIndex + 1) % stories.length];

  // Section refs
  const [narrativeRef, narrativeInView] = useInView();
  const [img1Ref, img1InView] = useInView(0.05);
  const [pauseRef, pauseInView] = useInView();
  const [img2Ref, img2InView] = useInView(0.05);
  const [filmRef, filmInView] = useInView(0.05);
  const [img3Ref, img3InView] = useInView(0.05);
  const [reflectionRef, reflectionInView] = useInView();
  const [inviteRef, inviteInView] = useInView();
  const [nextRef, nextInView] = useInView(0.05);

  useEffect(() => { setMounted(true); }, []);

  if (!story) {
    return (
      <div className="min-h-screen bg-[#F5F0E8] flex items-center justify-center">
        <p className="font-serif font-light text-[#3A342C]/50 text-[20px]">This beginning hasn't been found.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#F5F0E8] text-[#3A342C]">

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
        <nav className={`absolute top-0 left-0 right-0 z-10 px-6 py-6 md:px-[100px] md:py-10 flex justify-between items-start transition-opacity duration-[800ms] ease-in-out ${mounted ? "opacity-100" : "opacity-0"}`}>
          <Link href="/" className="font-serif text-2xl tracking-[0.02em] font-light text-[#F5F0E8] hover:opacity-80 transition-opacity duration-300">
            Evermor
          </Link>
          <div className="flex gap-8 font-sans text-[13px] tracking-wide font-light">
            <Link href="/" className="text-[#F5F0E8]/75 hover:text-[#F5F0E8] transition-colors duration-300">Home</Link>
            <Link href="/beginnings" className="text-[#F5F0E8] transition-colors duration-300">Beginnings</Link>
            <Link href="/about" className="text-[#F5F0E8]/75 hover:text-[#F5F0E8] transition-colors duration-300">About</Link>
            <Link href="/begin-your-story" className="text-[#F5F0E8]/75 hover:text-[#F5F0E8] transition-colors duration-300">Begin Your Story</Link>
          </div>
        </nav>

        {/* Hero content */}
        <div className="absolute bottom-[80px] left-6 md:left-[100px] z-10 flex flex-col items-start">
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
      <section className="bg-[#F5F0E8] py-32 md:py-48">
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

      {/* ── 3. Images ────────────────────────────────────────────── */}
      <section className="bg-[#EAE3D3]">
        <img
          ref={img1Ref}
          src={story.heroImage}
          alt={story.couple}
          className={`w-full h-[60vh] md:h-[75vh] object-cover object-center transition-opacity duration-[1200ms] ease-out ${img1InView ? "opacity-100" : "opacity-0"}`}
        />
      </section>

      {/* ── 4. Pause ─────────────────────────────────────────────── */}
      <section className="bg-[#F8F6F2] py-40 md:py-64">
        <div
          ref={pauseRef}
          className={`max-w-[560px] mx-auto px-6 md:px-0 text-center transition-all duration-[1100ms] ease-out ${pauseInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          <p className="font-serif font-light italic text-[22px] md:text-[28px] lg:text-[32px] text-[#3A342C]/65 leading-[1.6] tracking-[0.01em]">
            {story.pause}
          </p>
        </div>
      </section>

      {/* ── 5. Images ────────────────────────────────────────────── */}
      <section className="bg-[#EAE3D3]">
        <img
          ref={img2Ref}
          src={story.photo2}
          alt={`${story.couple} — a moment`}
          className={`w-full h-[60vh] md:h-[75vh] object-cover object-center transition-opacity duration-[1200ms] ease-out ${img2InView ? "opacity-100" : "opacity-0"}`}
        />
      </section>

      {/* ── 6. Film (conditional) ────────────────────────────────── */}
      {story.hasFilm && (
        <section
          ref={filmRef}
          className={`bg-[#1A1612] py-40 md:py-56 flex flex-col items-center justify-center text-center px-6 transition-opacity duration-[1200ms] ease-out ${filmInView ? "opacity-100" : "opacity-0"}`}
        >
          <p className="font-sans font-light text-[10px] uppercase tracking-[0.35em] text-[#F5F0E8]/35 mb-10">
            Film
          </p>
          <p className="font-serif font-light text-[28px] md:text-[40px] text-[#F5F0E8] leading-[1.3] tracking-[0.01em] mb-6 max-w-[480px]">
            {story.couple}
          </p>
          <p className="font-sans font-light text-[13px] text-[#F5F0E8]/40 tracking-[0.06em] uppercase mb-16">
            {story.location}
          </p>
          {/* Play indicator */}
          <div className="w-[72px] h-[72px] rounded-full border border-[#F5F0E8]/25 flex items-center justify-center hover:border-[#F5F0E8]/60 transition-colors duration-500 cursor-pointer">
            <svg width="16" height="20" viewBox="0 0 16 20" fill="none">
              <path d="M1 1.5L15 10L1 18.5V1.5Z" fill="rgba(245,240,232,0.6)" />
            </svg>
          </div>
          <p className="mt-8 font-sans font-light text-[11px] text-[#F5F0E8]/25 tracking-[0.1em] uppercase">
            Film available soon
          </p>
        </section>
      )}

      {/* ── 7. Images ────────────────────────────────────────────── */}
      <section className="bg-[#EAE3D3] flex gap-[3px] md:gap-1">
        <img
          ref={img3Ref}
          src={story.photo2}
          alt={`${story.couple} — detail`}
          className={`w-1/2 h-[50vh] md:h-[65vh] object-cover object-center transition-opacity duration-[1200ms] ease-out ${img3InView ? "opacity-100" : "opacity-0"}`}
        />
        <img
          src={story.heroImage}
          alt={`${story.couple} — portrait`}
          className={`w-1/2 h-[50vh] md:h-[65vh] object-cover object-center transition-opacity duration-[1200ms] ease-out delay-[150ms] ${img3InView ? "opacity-100" : "opacity-0"}`}
        />
      </section>

      {/* ── 8. Reflection ────────────────────────────────────────── */}
      <section className="bg-[#F5F0E8] py-40 md:py-64">
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
      <section className="bg-[#EAE3D3] py-32 md:py-48">
        <div
          ref={inviteRef}
          className={`max-w-[640px] mx-auto px-6 md:px-0 text-center transition-all duration-[1000ms] ease-out ${inviteInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          <p className="font-sans font-light text-[11px] uppercase tracking-[0.3em] text-[#3A342C]/40 mb-10">
            Begin Your Story
          </p>
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
              className={`mt-32 md:mt-48 max-w-[900px] mx-auto px-6 md:px-0 group cursor-pointer transition-all duration-[1000ms] ease-out ${nextRef ? (nextInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6") : "opacity-0"}`}
            >
              <div className="border-t border-[#3A342C]/15 pt-12 flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-12">
                <p className="font-sans font-light text-[11px] uppercase tracking-[0.28em] text-[#3A342C]/35 shrink-0">
                  Next beginning
                </p>
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
                  <span className="ml-auto font-sans font-light text-[12px] tracking-[0.1em] text-[#3A342C]/35 group-hover:text-[#3A342C]/70 transition-colors duration-300 uppercase">
                    View →
                  </span>
                </div>
              </div>
            </div>
          </Link>
        )}
      </section>

    </div>
  );
}
