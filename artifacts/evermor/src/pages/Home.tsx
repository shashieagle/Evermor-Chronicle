import { useEffect, useState, useRef, useCallback } from "react";
import { Link } from "wouter";
import Nav from "../components/Nav";

const BASE = import.meta.env.BASE_URL?.replace(/\/$/, "") || "";
const API  = `${BASE}/api`;
const SLIDE_DURATION = 5000;

function useInView(threshold = 0.12) {
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

export default function Home() {
  const [mounted, setMounted] = useState(false);

  const [copyRef, copyInView] = useInView();
  const [imageRef, imageInView] = useInView();
  const [ch3imgRef, ch3imgInView] = useInView();
  const [fitRef, fitInView] = useInView();

  // Chapter 5
  const [headingRef, headingInView] = useInView();
  const [introRef, introInView] = useInView();
  const [s1ImgRef, s1ImgInView] = useInView();
  const [s2ImgRef, s2ImgInView] = useInView();
  const [s4ImgRef, s4ImgInView] = useInView();
  const [closingRef, closingInView] = useInView();
  const [ctaRef, ctaInView] = useInView();

  // Chapter 6
  const [ch6LabelRef, ch6LabelInView] = useInView();
  const [ch6HeadRef, ch6HeadInView] = useInView();
  const [ch6ImgRef, ch6ImgInView] = useInView();
  const [ch6ProseRef, ch6ProseInView] = useInView();
  const [ch6NoteRef, ch6NoteInView] = useInView();
  const [ch6BtnRef, ch6BtnInView] = useInView();

  // Slideshow
  const [slideshowImages, setSlideshowImages] = useState<string[]>([]);
  const [slideIndex, setSlideIndex] = useState(0);
  const [progressKey, setProgressKey] = useState(0);
  const slideTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const touchStartX = useRef(0);

  useEffect(() => {
    fetch(`${API}/slideshow`)
      .then(r => r.json())
      .then(d => { if (d.photos?.length) setSlideshowImages(d.photos.map((p: any) => p.url)); })
      .catch(() => {});
  }, []);

  const advanceTo = useCallback((idx: number) => {
    setSlideIndex(idx);
    setProgressKey(k => k + 1);
  }, []);

  const startTimer = useCallback((total: number) => {
    if (slideTimerRef.current) clearInterval(slideTimerRef.current);
    if (total < 2) return;
    slideTimerRef.current = setInterval(() => {
      setSlideIndex(prev => {
        setProgressKey(k => k + 1);
        return (prev + 1) % total;
      });
    }, SLIDE_DURATION);
  }, []);

  useEffect(() => {
    if (slideshowImages.length < 2) return;
    startTimer(slideshowImages.length);
    return () => { if (slideTimerRef.current) clearInterval(slideTimerRef.current); };
  }, [slideshowImages.length, startTimer]);

  const goNext = useCallback(() => { advanceTo((slideIndex + 1) % slideshowImages.length); startTimer(slideshowImages.length); }, [slideIndex, slideshowImages.length, advanceTo, startTimer]);
  const goPrev = useCallback(() => { advanceTo((slideIndex - 1 + slideshowImages.length) % slideshowImages.length); startTimer(slideshowImages.length); }, [slideIndex, slideshowImages.length, advanceTo, startTimer]);
  const selectSlide = useCallback((idx: number) => {
    advanceTo(idx);
    startTimer(slideshowImages.length);
  }, [advanceTo, slideshowImages.length, startTimer]);

  useEffect(() => { setMounted(true); }, []);

  return (
    <div className="bg-[#EFEFED] text-[#F5F0E8]">
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative h-[100vh] w-full overflow-hidden bg-[#1A1612]">
        <div
          className="absolute inset-0 z-0"
          style={{ transition: "opacity 1400ms ease-in-out", opacity: mounted ? 1 : 0 }}
        >
          <img
            src="/hero.jpg"
            alt="Evermor Tales — Preserving the beginning of your family"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#1A1612]/10" />
          <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-black/50 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-black/50 to-transparent" />
        </div>

        <Nav
          theme="dark"
          mounted={mounted}
          position="absolute"
          brandName="Evermor Tales"
          links={[
            { href: "/about", label: "About" },
            { href: "/beginnings", label: "Beginnings" },
            { href: "/approach", label: "Approach" },
            { href: "/journal", label: "Journal" },
            { href: "/begin-your-story", label: "Begin Your Story" },
          ]}
        />

        <div className="absolute bottom-[18%] md:bottom-[22%] left-6 md:left-16 right-6 md:right-auto max-w-[680px] z-10">
          <h1
            className="font-serif font-light text-[#F5F0E8] leading-[1.08] tracking-[-0.01em]"
            style={{
              fontSize: "clamp(38px, 6vw, 84px)",
              transition: "opacity 1000ms ease-out 300ms, transform 1000ms ease-out 300ms",
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateY(0)" : "translateY(20px)",
            }}
          >
            Preserving the beginning<br />of your family.
          </h1>
          <Link
            href="/begin-your-story"
            className="mt-7 md:mt-9 inline-flex items-center gap-3 font-sans font-light text-[#F5F0E8]/60 hover:text-[#F5F0E8] tracking-[0.14em] uppercase transition-all duration-500"
            style={{
              fontSize: "clamp(10px, 0.95vw, 12px)",
              transition: "opacity 800ms ease-out 700ms, transform 800ms ease-out 700ms",
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateY(0)" : "translateY(10px)",
            }}
          >
            <span>Discover Your Story DNA</span>
            <span>→</span>
          </Link>
        </div>
      </section>
      {/* ── Chapter 2 — Why Evermor Exists ──────────────────────────────── */}
      <section
        className="bg-[#EFEFED] flex flex-col items-center"
        style={{ paddingTop: "clamp(72px, 13vw, 160px)", paddingBottom: "clamp(64px, 11vw, 140px)", paddingLeft: "clamp(24px, 8vw, 100px)", paddingRight: "clamp(24px, 8vw, 100px)" }}
      >
        <div
          ref={copyRef}
          className={`max-w-[700px] w-full text-center transition-all duration-[900ms] ease-out ${copyInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          <p
            className="font-serif font-light text-[#3A342C] leading-[1.25] tracking-[-0.005em]"
            style={{ fontSize: "clamp(26px, 3.8vw, 54px)", marginBottom: "clamp(28px, 4vw, 44px)" }}
          >
            "Long after the flowers fade and the music ends, what remains are the moments we return to."
          </p>
          <div className="w-8 h-px bg-[#3A342C]/20 mx-auto" style={{ marginBottom: "clamp(24px, 3.5vw, 40px)" }} />
          <p
            className="font-serif font-light italic text-[#3A342C]/60 text-[19px]"
            style={{ fontSize: "clamp(14px, 1.2vw, 17px)" }}
          >
            We created Evermor to hold that beginning the way it deserves to be held — carefully, honestly, and with the full weight of what it meant. Not just preserved, but kept alive.
          </p>
        </div>

        {/* Framed photograph */}
        <div
          ref={imageRef}
          className={`mx-auto transition-all duration-[1000ms] ease-out ${imageInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          style={{ maxWidth: "min(760px, 94vw)", width: "100%", marginTop: "clamp(52px, 9vw, 112px)" }}
        >
          <div style={{ boxShadow: "0 28px 72px rgba(20,14,8,0.48), 0 6px 20px rgba(20,14,8,0.32)" }}>
            <div className="bg-[#261E14] p-[18px] md:p-[28px]">
              <div style={{ outline: "1px solid #7A5C38", outlineOffset: "-1px" }}>
                <div className="bg-[#261E14] p-[7px] md:p-[10px]">
                  <div style={{ outline: "1px solid #8C6D4F", outlineOffset: "-1px" }}>
                    <div className="bg-[#EAEAE8] p-[20px] md:p-[32px] relative">
                      {[
                        "top-[8px] left-[8px] border-t border-l",
                        "top-[8px] right-[8px] border-t border-r",
                        "bottom-[8px] left-[8px] border-b border-l",
                        "bottom-[8px] right-[8px] border-b border-r",
                      ].map((cls, i) => (
                        <div key={i} className={`absolute ${cls} w-5 h-5 md:w-6 md:h-6 border-[#8C6D4F]/60`} />
                      ))}
                      <div style={{ outline: "1px solid rgba(140,109,79,0.28)", outlineOffset: "-1px" }}>
                        <img
                          src="/chapter2.jpg"
                          alt="Editorial photograph"
                          className="w-full object-cover object-center block"
                          style={{ height: "clamp(200px, 35vw, 520px)", filter: "sepia(0.18) contrast(1.04) saturate(0.88) brightness(0.97)" }}
                          loading="lazy"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="h-[3px] mx-3 mt-0 bg-[#1A1208]/28 blur-sm" />
        </div>
      </section>
      {/* ── Good Fit ─────────────────────────────────────────────────────── */}
      <section
        className="bg-[#EFEFED] flex flex-col items-center text-center"
        style={{ paddingTop: "clamp(56px, 8vw, 100px)", paddingBottom: "clamp(56px, 8vw, 100px)", paddingLeft: "clamp(24px, 8vw, 100px)", paddingRight: "clamp(24px, 8vw, 100px)" }}
      >
        <div
          ref={fitRef}
          className={`max-w-[740px] w-full transition-all duration-[900ms] ease-out ${fitInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        >
          <p
            className="font-sans uppercase tracking-[0.18em] text-[#8C6D4F]"
            style={{ fontSize: "clamp(12px, 1.1vw, 14px)", marginBottom: "clamp(16px, 2.5vw, 24px)" }}
          >
            You'll love working with us if
          </p>
          <p
            className="font-serif font-light italic text-[#3A342C] leading-[1.7]"
            style={{ fontSize: "clamp(19px, 2.15vw, 30px)", color: "#3A342C", opacity: 1 }}
          >Let us move through your wedding like family — quietly, without announcement. Let us sneak a laugh in between rituals, because joy is always the best light. Let us disappear from the stage now and then; we promise we're somewhere better. And let us gently guide you — not into a pose, but into discovering how you actually look when you forget we're there.</p>
        </div>
      </section>
      {/* ── Image Slideshow ─────────────────────────────────────────────── */}
      {slideshowImages.length > 0 && (
      <>
      <section
        className="relative overflow-hidden bg-[#0C0906]"
        style={{ height: "90vh" }}
        onTouchStart={e => { touchStartX.current = e.touches[0].clientX; }}
        onTouchEnd={e => {
          const delta = touchStartX.current - e.changedTouches[0].clientX;
          if (Math.abs(delta) > 48) delta > 0 ? goNext() : goPrev();
        }}
      >
        <style>{`@keyframes slideProgress { from { transform: scaleX(0); } to { transform: scaleX(1); } }`}</style>

        {/* Stacked images — crossfade */}
        {slideshowImages.map((src, i) => (
          <div
            key={src}
            className="absolute inset-y-0 left-[5%] right-[5%] transition-opacity duration-[1400ms] ease-in-out"
            style={{ opacity: i === slideIndex ? 1 : 0, zIndex: i === slideIndex ? 2 : 1 }}
          >
            <img
              src={src}
              alt={`Gallery ${i + 1}`}
              className="w-full h-full object-cover object-center"
              loading="lazy"
              style={{ filter: "sepia(0.05) contrast(1.04) saturate(0.92) brightness(0.94)" }}
            />
          </div>
        ))}

        {/* Grain */}
        <div className="absolute inset-0 pointer-events-none z-10" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256' height='256'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.78' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='256' height='256' filter='url(%23n)'/%3E%3C/svg%3E\")", opacity: 0.12, mixBlendMode: "overlay" as const }} />

        {/* Top + bottom fade */}
        <div className="absolute inset-x-0 top-0 h-20 pointer-events-none z-10" style={{ background: "linear-gradient(to bottom, rgba(12,9,6,0.6), transparent)" }} />
        <div className="absolute inset-x-0 bottom-0 h-24 pointer-events-none z-10" style={{ background: "linear-gradient(to top, rgba(12,9,6,0.55), transparent)" }} />

        {/* Prev / Next arrows */}
        <button
          onClick={goPrev}
          aria-label="Previous"
          className="absolute left-5 md:left-8 top-1/2 -translate-y-1/2 z-20 w-9 h-9 flex items-center justify-center opacity-0 hover:opacity-100 focus:opacity-100 transition-opacity duration-300 group"
          style={{ border: "1px solid rgba(245,240,232,0.25)", borderRadius: "50%" }}
        >
          <span className="text-[#F5F0E8]/70 group-hover:text-[#F5F0E8] text-[14px] transition-colors duration-200">←</span>
        </button>
        <button
          onClick={goNext}
          aria-label="Next"
          className="absolute right-5 md:right-8 top-1/2 -translate-y-1/2 z-20 w-9 h-9 flex items-center justify-center opacity-0 hover:opacity-100 focus:opacity-100 transition-opacity duration-300 group"
          style={{ border: "1px solid rgba(245,240,232,0.25)", borderRadius: "50%" }}
        >
          <span className="text-[#F5F0E8]/70 group-hover:text-[#F5F0E8] text-[14px] transition-colors duration-200">→</span>
        </button>

        {/* Counter */}
        <div className="absolute top-7 right-7 md:right-10 z-20">
          <p className="font-sans text-[10px] tracking-[0.18em] text-[#F5F0E8]/35">
            {String(slideIndex + 1).padStart(2, "0")} / {String(slideshowImages.length).padStart(2, "0")}
          </p>
        </div>

        {/* Progress bar */}
        <div className="absolute bottom-0 inset-x-0 z-20 h-[2px] bg-[#F5F0E8]/8">
          <div
            key={progressKey}
            style={{
              height: "100%",
              background: "rgba(245,240,232,0.45)",
              transformOrigin: "left center",
              animation: `slideProgress ${SLIDE_DURATION}ms linear forwards`,
            }}
          />
        </div>
      </section>
      {/* Preview rail — entirely on the light space below the slideshow */}
      <div
        className="relative bg-[#EFEFED]"
        style={{ height: "clamp(64px, 8vw, 96px)" }}
      >
        <div
          className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-center gap-2 overflow-x-auto px-5 md:gap-3 md:px-16"
          style={{
            scrollbarWidth: "none",
            maskImage: "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)",
          }}
          aria-label="Slideshow previews"
        >
          {[-2, -1, 0, 1, 2, 3]
            .map(offset => (slideIndex + offset + slideshowImages.length) % slideshowImages.length)
            .filter((idx, position, indices) => indices.indexOf(idx) === position)
            .map((idx, position) => {
              const isCurrent = idx === slideIndex;
              const isPast = position < 2 && !isCurrent;
              return (
                <button
                  key={`${idx}-${position}`}
                  type="button"
                  data-slide-index={idx}
                  onClick={() => selectSlide(idx)}
                  aria-label={`${isCurrent ? "Current" : isPast ? "Previous" : "Next"} image, ${idx + 1} of ${slideshowImages.length}`}
                  aria-current={isCurrent ? "true" : undefined}
                  className="group relative shrink-0 overflow-hidden transition-all duration-500 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#3A342C]/70"
                  style={{
                    width: "clamp(48px, 7vw, 98px)",
                    aspectRatio: "1.45",
                    opacity: isCurrent ? 1 : isPast ? 0.48 : 0.72,
                    border: isCurrent
                      ? "1px solid rgba(58,52,44,0.85)"
                      : "1px solid rgba(58,52,44,0.22)",
                    boxShadow: isCurrent ? "0 0 0 3px rgba(239,239,237,0.92), 0 5px 18px rgba(58,52,44,0.16)" : "none",
                  }}
                >
                  <img
                    src={slideshowImages[idx]}
                    alt={`Preview ${idx + 1}`}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                    style={{ filter: isCurrent ? "none" : "sepia(0.08) brightness(0.78) saturate(0.82)" }}
                  />
                </button>
              );
            })}
        </div>
      </div>
      </>
      )}
      {/* ── Chapter 5 — Beginnings ───────────────────────────────────────── */}
      <section
        className="bg-[#EFEFED] overflow-hidden"
        style={{ paddingTop: "clamp(64px, 10vw, 120px)", paddingBottom: "clamp(64px, 10vw, 120px)" }}
      >
        {/* Header */}
        <div className="text-center px-6" style={{ marginBottom: "clamp(40px, 6vw, 72px)" }}>
          <p
            className="font-sans uppercase tracking-[0.28em] text-[#8C6D4F]"
            style={{ fontSize: "clamp(8px, 0.8vw, 10px)", marginBottom: "clamp(14px, 2vw, 22px)" }}
          >
            A Collection of Stories
          </p>
          <h2
            ref={headingRef}
            className={`font-serif font-light text-[#3A342C] leading-[0.95] tracking-[-0.02em] transition-all duration-[900ms] ease-out ${headingInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
            style={{ fontSize: "clamp(52px, 9vw, 120px)" }}
          >
            Beginnings
          </h2>
          <p
            ref={introRef}
            className={`font-serif font-light italic text-[#3A342C]/45 leading-[1.8] transition-all duration-[800ms] ease-out ${introInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            style={{ fontSize: "clamp(13px, 1.1vw, 16px)", marginTop: "clamp(12px, 1.5vw, 20px)", transitionDelay: introInView ? "120ms" : "0ms" }}
          >
            Every beginning is different. Every emotion is real.
          </p>
        </div>

        {/* Featured spread */}
        <div style={{ paddingLeft: "clamp(24px, 8vw, 120px)", paddingRight: "clamp(24px, 8vw, 120px)", marginBottom: "clamp(16px, 2vw, 24px)" }}>
          <div className="flex flex-col md:flex-row gap-4 md:gap-5 items-stretch">

            {/* Postcard FRONT */}
            <Link
              href="/beginnings"
              ref={s1ImgRef}
              className={`flex-1 block group cursor-pointer bg-[#EFE4D0] shadow-[0_8px_40px_rgba(58,52,44,0.16)] transition-all duration-[1000ms] ease-out md:-rotate-[0.5deg] hover:rotate-0 hover:shadow-[0_16px_56px_rgba(58,52,44,0.22)] ${s1ImgInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
            >
              <div className="p-[10px] md:p-[12px] pb-0">
                <div className="relative overflow-hidden" style={{ aspectRatio: "3/2" }}>
                  <img src="/beginnings-shaun-sowmya.jpg" alt="Shaun & Sowmya" className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.02]" loading="lazy" />
                  <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256' height='256'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='256' height='256' filter='url(%23n)'/%3E%3C/svg%3E\")", opacity: 0.12, mixBlendMode: "overlay" as const }} />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/38 via-transparent to-black/22" />
                  <div className="absolute top-3 md:top-4 right-3 md:right-4 flex items-center gap-1.5">
                    <span className="font-sans text-[7px] text-white/70 uppercase tracking-[0.12em]">Bangalore</span>
                    <div className="w-3.5 h-px bg-white/45" />
                    <span className="font-sans text-[7px] text-white/70 uppercase tracking-[0.12em]">India</span>
                  </div>
                  <div className="absolute bottom-3 right-3 md:bottom-4 md:right-4">
                    <p className="font-serif italic text-[9px] text-white/55">Evermor Tales</p>
                  </div>
                </div>
                <div className="px-3 pt-4 pb-5">
                  <p className="font-serif italic text-[11px] md:text-[13px] text-[#3A342C]/60 leading-[1.8]">
                    "What we're most grateful for isn't just the photographs. It's that you noticed the moments we didn't even realise were happening. Years later, those are the memories we return to most."
                  </p>
                  <p className="font-sans text-[7px] md:text-[8px] text-[#3A342C]/30 tracking-[0.12em] uppercase mt-2.5">— Shaun &amp; Sowmya</p>
                </div>
              </div>
            </Link>

            {/* Postcard BACK */}
            <div
              ref={s2ImgRef}
              className={`flex-1 bg-[#F5EDE0] shadow-[0_8px_40px_rgba(58,52,44,0.13)] transition-all duration-[1000ms] ease-out md:rotate-[0.5deg] hover:rotate-0 ${s2ImgInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
              style={{ transitionDelay: s2ImgInView ? "160ms" : "0ms" }}
            >
              <div className="p-5 md:p-7 h-full flex flex-col" style={{ minHeight: "280px" }}>
                <div className="flex items-start justify-between pb-3 border-b border-[#3A342C]/8 mb-4">
                  <div className="flex-1 text-center pr-2">
                    <p className="font-serif font-semibold text-[11px] md:text-[12px] text-[#3A342C] tracking-[0.18em] uppercase">Evermor Tales</p>
                    <p className="font-sans text-[7px] text-[#3A342C]/30 tracking-[0.18em] uppercase mt-1">Wedding Photography</p>
                  </div>
                  <div className="shrink-0 w-10 h-10 md:w-11 md:h-11 flex items-center justify-center" style={{ border: "1.5px dashed rgba(58,52,44,0.18)" }}>
                    <div className="font-sans text-[5px] text-[#3A342C]/20 tracking-[0.08em] text-center uppercase leading-[1.5]">Post<br />age</div>
                  </div>
                </div>
                <div className="flex-1 flex gap-0 min-h-0">
                  <div className="flex-[5] pr-4 border-r border-[#3A342C]/8 flex flex-col justify-between">
                    <div>
                      <p className="font-sans uppercase text-[7px] tracking-[0.22em] text-[#8C6D4F] mb-2">Photography & Film</p>
                      <p className="font-serif font-semibold text-[14px] md:text-[17px] text-[#3A342C] leading-[1.15] mb-2.5">Shaun &amp; Sowmya</p>
                      <div className="w-6 h-px bg-[#3A342C]/12 mb-2.5" />
                      <p className="font-sans text-[10px] md:text-[11px] text-[#3A342C]/48 leading-[1.75]">
                        Held in the golden light of Bangalore across two days of ceremony, laughter, and the quiet moments only families share.
                      </p>
                    </div>
                    <p className="font-sans text-[7px] text-[#3A342C]/25 tracking-[0.1em] uppercase mt-4">evermortales.com</p>
                  </div>
                  <div className="flex-[4] pl-4 flex flex-col justify-center relative overflow-hidden">
                    <p className="font-serif italic text-[11px] md:text-[12px] text-[#3A342C]/55 leading-[1.9]">
                      "There is always a moment when the world falls quiet and they see only each other."
                    </p>
                    <div className="absolute bottom-0 right-0 w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center text-center" style={{ border: "1px solid rgba(58,52,44,0.14)" }}>
                      <p className="font-sans text-[5px] text-[#3A342C]/22 tracking-[0.06em] uppercase leading-[1.6]">Evermor<br />Tales<br />Made with<br />Love</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Closing CTA */}
        <div className="text-center px-6">
          <p
            ref={closingRef}
            className={`font-serif font-light italic text-[#3A342C]/45 leading-[1.5] transition-all duration-[800ms] ease-out ${closingInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            style={{ fontSize: "clamp(18px, 2vw, 26px)", marginBottom: "clamp(20px, 3vw, 32px)" }}
          >
            No two beginnings are ever the same.
          </p>
          <Link
            href="/beginnings"
            ref={ctaRef}
            className={`inline-flex items-center gap-3 font-sans text-[#F5F0E8] bg-[#3A342C] tracking-[0.16em] uppercase px-7 py-3 hover:bg-[#2a261f] transition-all duration-500 ease-out ${ctaInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            style={{ fontSize: "clamp(10px, 0.95vw, 12px)", transitionDelay: ctaInView ? "120ms" : "0ms" }}
          >
            <span>View All Beginnings</span>
            <span>→</span>
          </Link>
        </div>
      </section>
      {/* ── Chapter 6 — Memory ──────────────────────────────────────────── */}
      <section className="bg-[#EFEFED] overflow-hidden" style={{ borderTop: "1px solid rgba(58,52,44,0.08)" }}>

        {/* Headline */}
        <div
          className="flex flex-col items-center text-center"
          style={{ paddingTop: "clamp(72px, 12vw, 140px)", paddingBottom: "clamp(48px, 7vw, 88px)", paddingLeft: "clamp(24px, 8vw, 100px)", paddingRight: "clamp(24px, 8vw, 100px)" }}
        >
          <h2
            ref={ch6HeadRef}
            className={`font-serif font-light text-[#3A342C] leading-[1.08] tracking-[-0.01em] transition-all duration-[1000ms] ease-out ${ch6HeadInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
            style={{ fontSize: "clamp(34px, 5.5vw, 78px)" }}
          >
            Every family<br />remembers differently.
          </h2>
        </div>

        {/* Collage */}
        <div
          ref={ch6ImgRef}
          className={`flex justify-center transition-all duration-[1200ms] ease-out ${ch6ImgInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          style={{ paddingLeft: "clamp(24px, 6vw, 80px)", paddingRight: "clamp(24px, 6vw, 80px)" }}
        >
          <div
            className="relative w-full overflow-hidden"
            style={{ maxWidth: "920px", aspectRatio: "16/9", boxShadow: "0 24px 80px rgba(58,52,44,0.16)" }}
          >
            <img src="/memory-collage.jpg" alt="A collage of memory objects" className="w-full h-full object-cover object-center" loading="lazy" />
          </div>
        </div>

        {/* Prose + CTA */}
        <div
          className="flex flex-col items-center text-center"
          style={{ paddingTop: "clamp(52px, 8vw, 104px)", paddingBottom: "clamp(72px, 12vw, 144px)", paddingLeft: "clamp(24px, 8vw, 100px)", paddingRight: "clamp(24px, 8vw, 100px)" }}
        >
          <div
            ref={ch6ProseRef}
            className={`w-8 h-px bg-[#3A342C]/18 transition-all duration-[800ms] ease-out ${ch6ProseInView ? "opacity-100" : "opacity-0"}`}
            style={{ marginBottom: "clamp(28px, 4vw, 44px)" }}
          />
          <p
            className={`font-serif font-light text-[#3A342C]/65 leading-[1.82] max-w-[580px] transition-all duration-[1000ms] ease-out ${ch6ProseInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
            style={{ fontSize: "clamp(16px, 1.45vw, 21px)" }}
          >
            Some beginnings last a day. The memories they create can last forever. If our way of seeing the world feels like yours, we'd be honoured to preserve the beginning of your family's story.
          </p>
          <p
            ref={ch6NoteRef}
            className={`font-sans font-light text-[#3A342C]/30 tracking-[0.1em] transition-all duration-[800ms] ease-out ${ch6NoteInView ? "opacity-100" : "opacity-0"}`}
            style={{ fontSize: "clamp(9px, 0.85vw, 11px)", marginTop: "clamp(20px, 2.5vw, 32px)" }}
          >
            Accepting a limited number of weddings each year so every story receives the care it deserves.
          </p>
          <div
            ref={ch6BtnRef}
            className={`transition-all duration-[1000ms] ease-out ${ch6BtnInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            style={{ marginTop: "clamp(32px, 4.5vw, 52px)" }}
          >
            <Link
              href="/begin-your-story"
              className="font-sans font-light tracking-[0.22em] uppercase text-[#F5F0E8] bg-[#3A342C] hover:bg-[#2A2520] transition-all duration-500 ease-out inline-block"
              style={{ fontSize: "clamp(10px, 0.95vw, 12px)", padding: "15px 52px" }}
            >
              Begin Your Story
            </Link>
          </div>
        </div>

      </section>
      {/* Admin lock */}
      <div className="flex justify-center py-8" style={{ background: "#0c0906" }}>
        <a href="/admin" aria-label="Admin" className="opacity-[0.1] hover:opacity-25 transition-opacity duration-500">
          <svg width="14" height="16" viewBox="0 0 14 16" fill="none">
            <rect x="1" y="7" width="12" height="9" rx="1" stroke="#F5F0E8" strokeWidth="1" />
            <path d="M4 7V4.5a3 3 0 0 1 6 0V7" stroke="#F5F0E8" strokeWidth="1" fill="none" />
          </svg>
        </a>
      </div>
    </div>
  );
}
