import { useEffect, useState, useRef } from "react";
import { Link } from "wouter";
import Nav from "../components/Nav";

function useInView() {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<any>(null);

  useEffect(() => {
    const currentRef = ref.current;
    if (!currentRef) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(currentRef);
        }
      },
      { threshold: 0.15 }
    );
    
    observer.observe(currentRef);
    return () => observer.disconnect();
  }, []);

  return [ref, isInView] as const;
}


export default function Home() {
  const [mounted, setMounted] = useState(false);

  const [eyebrowRef, eyebrowInView] = useInView();
  const [copyRef, copyInView] = useInView();
  const [imageRef, imageInView] = useInView();
  const [transitionLineRef, transitionLineInView] = useInView();


  // Chapter 3 panels
  const [ch3s1Ref, ch3s1InView] = useInView();
  const [ch3s2Ref, ch3s2InView] = useInView();
  const [ch3s3Ref, ch3s3InView] = useInView();
  const [ch3imgRef, ch3imgInView] = useInView();

  // Chapter 6 panels
  const [ch6s1Ref, ch6s1InView] = useInView();
  const [ch6s2Ref, ch6s2InView] = useInView();
  const [ch6s3Ref, ch6s3InView] = useInView();
  const [ch6s4Ref, ch6s4InView] = useInView();
  const [ch6s5Ref, ch6s5InView] = useInView();

  const [ch6ClosingRef, ch6ClosingInView] = useInView();
  const [ch6CtaRef, ch6CtaInView] = useInView();

  const [c4LabelRef, c4LabelInView] = useInView();
  
  const [b1HeadlineRef, b1HeadlineInView] = useInView();
  const [b1CopyRef, b1CopyInView] = useInView();

  const [b2HeadlineRef, b2HeadlineInView] = useInView();
  const [b2CopyRef, b2CopyInView] = useInView();

  const [b3HeadlineRef, b3HeadlineInView] = useInView();
  const [b3CopyRef, b3CopyInView] = useInView();

  const [b4HeadlineRef, b4HeadlineInView] = useInView();
  const [b4CopyRef, b4CopyInView] = useInView();

  const [b5HeadlineRef, b5HeadlineInView] = useInView();
  const [b5CopyRef, b5CopyInView] = useInView();

  const [c4ClosingRef, c4ClosingInView] = useInView();

  const [headingRef, headingInView] = useInView();
  const [introRef, introInView] = useInView();
  const [s1ImgRef, s1ImgInView] = useInView();
  const [s1CapRef, s1CapInView] = useInView();
  const [s2ImgRef, s2ImgInView] = useInView();
  const [s3ImgRef, s3ImgInView] = useInView();
  const [pair1CapRef, pair1CapInView] = useInView();
  const [s4ImgRef, s4ImgInView] = useInView();
  const [s4CapRef, s4CapInView] = useInView();
  const [s5ImgRef, s5ImgInView] = useInView();
  const [s5CapRef, s5CapInView] = useInView();
  const [s6ImgRef, s6ImgInView] = useInView();
  const [s7ImgRef, s7ImgInView] = useInView();
  const [pair2CapRef, pair2CapInView] = useInView();
  const [closingRef, closingInView] = useInView();
  const [ctaRef, ctaInView] = useInView();

  const [ch7HeadlineRef, ch7HeadlineInView] = useInView();
  const [ch7CopyRef, ch7CopyInView] = useInView();
  const [ch7BtnRef, ch7BtnInView] = useInView();
  const [ch7NoteRef, ch7NoteInView] = useInView();

  // About section (inline on home)
  const [aboutImgRef, aboutImgInView] = useInView();
  const [aboutT1Ref, aboutT1InView] = useInView();
  const [aboutT2Ref, aboutT2InView] = useInView();
  const [aboutT3Ref, aboutT3InView] = useInView();
  const [aboutT4Ref, aboutT4InView] = useInView();
  const [aboutLinkRef, aboutLinkInView] = useInView();


  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="bg-[#EFEFED] text-[#F5F0E8]">
      {/* Chapter 1 - Hero */}
      <section className="relative h-[100vh] w-full overflow-hidden bg-[#FAFAFA] text-[#F5F0E8]">
        {/* Hero Image Background */}
        <div 
          className={`absolute inset-0 z-0 transition-opacity duration-[1200ms] ease-in-out ${
            mounted ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src="/hero.jpg"
            alt="Evermor - Preserving the beginning of your family"
            className="w-full h-full object-cover"
          />
          {/* Warm Overlay */}
          <div className="absolute inset-0 bg-[#FAFAFA]/15 mix-blend-overlay" />
          {/* Top gradient for nav legibility */}
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/45 to-transparent" />
          {/* Bottom gradient for hero text legibility */}
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/40 to-transparent" />
        </div>

        {/* Navigation */}
        <Nav
          theme="dark"
          mounted={mounted}
          position="absolute"
          brandName="Evermor Tales"
          links={[
            { href: "/beginnings", label: "Beginnings" },
            { href: "/journal", label: "Journal" },
            { href: "/about", label: "About" },
            { href: "/begin-your-story", label: "Begin Your Story" },
          ]}
        />

        {/* Hero Content */}
        <div className="absolute bottom-[15%] md:bottom-[22%] left-6 right-6 md:left-16 md:right-auto max-w-[640px] z-10 flex flex-col items-start">
          <h1 
            className={`font-serif text-[36px] md:text-[64px] lg:text-[80px] leading-[1.2] font-light text-[#F5F0E8] tracking-[0.01em] transition-opacity duration-1000 ease-in-out delay-300 ${
              mounted ? "opacity-100" : "opacity-0"
            }`}
          >Preserving
          the beginning
          of your family.</h1>
          

          <Link 
            href="/discover"
            className={`mt-6 md:mt-8 text-[13px] md:text-[15px] font-sans font-light text-[#F5F0E8]/70 hover:text-[#F5F0E8] transition-all duration-800 ease-in-out delay-[900ms] flex items-center gap-2 ${
              mounted ? "opacity-100" : "opacity-0"
            }`}
          >
            <span>Discover Your Story</span>
            <span className="block tracking-widest">→</span>
          </Link>
        </div>
      </section>
      {/* Chapter 2 - Why Evermor Exists */}
      <section className="bg-[#EFEFED] py-20 md:py-32 lg:py-48 flex flex-col items-center">
        <div
          ref={copyRef}
          className={`max-w-[680px] mx-auto px-6 md:px-0 text-center transition-all duration-[800ms] ease-out delay-150 ${
            copyInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <p className="font-serif font-light text-[30px] md:text-[44px] lg:text-[52px] text-[#3A342C] leading-[1.2] tracking-[0.01em] mb-8 md:mb-10">
            "Long after the flowers fade and the music ends, what remains are the moments we return to."
          </p>
          <div className="w-10 h-px bg-[#3A342C]/20 mx-auto mb-8 md:mb-10" />
          <p className="font-serif text-[15px] md:text-[16px] font-light text-[#3A342C]/65 leading-[1.9] tracking-[0.01em]">We created Evermor to hold that beginning the way it deserves to be held — carefully, honestly, and with the full weight of what it meant. Not just preserved, but kept alive.</p>
        </div>

        {/* Vintage framed photograph */}
        <div
          ref={imageRef}
          className={`mt-20 md:mt-28 mx-auto transition-all duration-[800ms] ease-out delay-300 ${
            imageInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ maxWidth: "min(720px, 94vw)" }}
        >
          {/* Outer frame shadow + body */}
          <div style={{ boxShadow: "0 24px 64px rgba(20,14,8,0.5), 0 6px 20px rgba(20,14,8,0.35), inset 0 1px 0 rgba(255,255,255,0.06)" }}>
            <div className="bg-[#261E14] p-[18px] md:p-[26px]">

              {/* Outer gold bead */}
              <div style={{ outline: "1px solid #7A5C38", outlineOffset: "-1px" }}>
                <div className="bg-[#261E14] p-[7px] md:p-[9px]">

                  {/* Inner gold bead */}
                  <div style={{ outline: "1px solid #8C6D4F", outlineOffset: "-1px" }}>

                    {/* Cream mat board */}
                    <div className="bg-[#EAEAE8] p-[22px] md:p-[32px] relative">

                      {/* Corner ornaments — L-brackets in gold */}
                      {[
                        "top-[8px] left-[8px] border-t border-l",
                        "top-[8px] right-[8px] border-t border-r",
                        "bottom-[8px] left-[8px] border-b border-l",
                        "bottom-[8px] right-[8px] border-b border-r",
                      ].map((cls, i) => (
                        <div
                          key={i}
                          className={`absolute ${cls} w-5 h-5 md:w-6 md:h-6 border-[#8C6D4F]/70`}
                        />
                      ))}

                      {/* Inner rule around photo */}
                      <div style={{ outline: "1px solid rgba(140,109,79,0.35)", outlineOffset: "-1px" }}>
                        <img
                          src="/chapter2.jpg"
                          alt="Editorial photograph"
                          className="w-full h-[240px] md:h-[380px] lg:h-[500px] object-cover object-center block"
                          style={{ filter: "sepia(0.18) contrast(1.04) saturate(0.88) brightness(0.97)" }}
                        />
                      </div>

                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Frame base shadow line */}
          <div className="h-[3px] mx-3 bg-[#1A1208]/30 blur-sm" />
        </div>

        <p
          ref={transitionLineRef}
          className={`mt-20 md:mt-28 mb-0 text-center font-serif font-light italic text-[16px] md:text-[18px] text-[#3A342C]/60 tracking-[0.02em] transition-all duration-[800ms] ease-out ${
            transitionLineInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          Every family begins with a story.
        </p>
      </section>
      {/* Chapter 3 - Narrative */}
      <div className="w-full bg-[#EFEFED] py-28 md:py-40 flex flex-col items-center justify-center gap-16 md:gap-20 px-8">
        <p ref={ch3s1Ref} className={`font-serif font-light text-[28px] md:text-[44px] lg:text-[52px] text-[#3A342C] tracking-[0.01em] leading-[1.3] text-center max-w-[680px] transition-all duration-[900ms] ease-out ${ch3s1InView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          A wedding marks a moment.
        </p>
        <div className="w-px h-10 bg-[#3A342C]/15" />
        <p ref={ch3s2Ref} className={`font-serif font-light text-[28px] md:text-[44px] lg:text-[52px] text-[#3A342C] tracking-[0.01em] leading-[1.3] text-center max-w-[680px] transition-all duration-[900ms] ease-out ${ch3s2InView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          A marriage shapes a lifetime.
        </p>
        <div className="w-px h-10 bg-[#3A342C]/15" />
        <p ref={ch3s3Ref} className={`font-serif font-light text-[28px] md:text-[44px] lg:text-[52px] text-[#3A342C] tracking-[0.01em] leading-[1.3] text-center max-w-[680px] transition-all duration-[900ms] ease-out ${ch3s3InView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          The beginning deserves to be remembered.
        </p>
      </div>
      {/* Chapter 3 — Film strip */}
      <div
        ref={ch3imgRef}
        className={`relative overflow-hidden transition-opacity duration-[1200ms] ease-out ${ch3imgInView ? 'opacity-100' : 'opacity-0'}`}
        style={{ background: "#0C0906" }}
      >
        {/* ── Top sprocket strip ── */}
        <div className="relative z-20 flex items-center justify-around px-2 bg-[#0C0906]" style={{ height: "32px" }}>
          {Array.from({ length: 28 }).map((_, i) => (
            <div
              key={i}
              style={{
                width: "14px", height: "9px",
                borderRadius: "1.5px",
                background: "rgba(234,227,211,0.07)",
                boxShadow: "inset 0 1px 2px rgba(0,0,0,0.9), 0 0 0 0.5px rgba(234,227,211,0.06)",
              }}
            />
          ))}
        </div>

        {/* ── Image frame ── */}
        <div className="relative" style={{ height: "calc(70vh - 64px)" }}>
          {/* Photo */}
          <img
            src="/chapter3.jpg"
            alt="Editorial wedding photography"
            className="w-full h-full object-cover object-center"
            style={{  }}
            loading="lazy"
          />

          {/* Grain */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256' height='256'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.78' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='256' height='256' filter='url(%23n)'/%3E%3C/svg%3E\")",
              opacity: 0.18,
              mixBlendMode: "overlay" as const,
            }}
          />

          {/* Left / right film-edge darkening */}
          <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(to right, rgba(12,9,6,0.55) 0%, transparent 12%, transparent 88%, rgba(12,9,6,0.55) 100%)" }} />

          {/* Top / bottom fade into sprocket strips */}
          <div className="absolute inset-x-0 top-0 h-8 pointer-events-none" style={{ background: "linear-gradient(to bottom, rgba(12,9,6,0.7), transparent)" }} />
          <div className="absolute inset-x-0 bottom-0 h-24 pointer-events-none" style={{ background: "linear-gradient(to top, rgba(12,9,6,0.55), transparent)" }} />

          {/* Caption */}
          <p className="absolute bottom-8 md:bottom-10 left-0 right-0 text-center font-serif font-light italic text-[15px] md:text-[18px] text-[#F5F0E8]/75 tracking-[0.02em] z-10">
            How we preserve that beginning matters.
          </p>
        </div>

        {/* ── Bottom sprocket strip + frame numbers ── */}
        <div className="relative z-20 bg-[#0C0906]" style={{ height: "32px" }}>
          {/* Frame numbers */}
          <div className="absolute inset-x-0 top-0 flex justify-around items-center px-6" style={{ height: "14px" }}>
            {["04", "05", "06", "07", "08", "09", "10", "11", "12"].map((n) => (
              <span key={n} className="font-mono text-[7px] md:text-[8px] tracking-[0.08em]" style={{ color: "rgba(234,227,211,0.18)" }}>{n}▲</span>
            ))}
          </div>
          {/* Holes */}
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-around px-2" style={{ height: "18px" }}>
            {Array.from({ length: 28 }).map((_, i) => (
              <div
                key={i}
                style={{
                  width: "14px", height: "9px",
                  borderRadius: "1.5px",
                  background: "rgba(234,227,211,0.07)",
                  boxShadow: "inset 0 1px 2px rgba(0,0,0,0.9), 0 0 0 0.5px rgba(234,227,211,0.06)",
                }}
              />
            ))}
          </div>
        </div>
      </div>
      {/* Chapter 4 - Beliefs — Magazine on Surface */}
      <div className="px-3 md:px-6 py-12 md:py-24" style={{ background: '#CBC7C0' }}>

        {/* Hidden SVG — deckled paper edge filter */}
        <svg aria-hidden="true" style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}>
          <defs>
            <filter id="deckle-beliefs" x="-4%" y="-4%" width="108%" height="108%">
              <feTurbulence type="fractalNoise" baseFrequency="0.038" numOctaves="4" seed="9" result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="2.5" xChannelSelector="R" yChannelSelector="G" />
            </filter>
          </defs>
        </svg>

      <section
        className="bg-[#F3F2F0] overflow-hidden mx-auto"
        style={{
          maxWidth: '1000px',
          filter: 'url(#deckle-beliefs)',
          boxShadow: [
            '-3px 3px 8px rgba(0,0,0,0.07)',
            '-5px 12px 28px rgba(0,0,0,0.11)',
            '-7px 28px 65px rgba(0,0,0,0.12)',
            '-8px 50px 100px rgba(0,0,0,0.08)',
          ].join(', '),
        }}
      >

        {/* ── Section header ── */}
        <div
          ref={b1HeadlineRef}
          className={`px-[8%] md:px-[15%] pt-12 md:pt-36 pb-12 md:pb-28 text-center transition-all duration-[1000ms] ease-out ${
            b1HeadlineInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <p className="font-sans uppercase tracking-[0.38em] text-[8px] md:text-[9px] text-[#3A342C]/35 mb-5">
            ✦ &nbsp; What We Believe &nbsp; ✦
          </p>
          <h2 className="font-serif font-bold text-[46px] md:text-[96px] lg:text-[118px] text-[#3A342C] leading-[0.88] tracking-[-0.02em]">
            The Beliefs
          </h2>
          <div className="w-10 h-px bg-[#3A342C]/20 mx-auto mt-7 md:mt-9" />
        </div>

        {/* ── Belief I — photo left, text right ── */}
        <div className="px-[8%] md:px-[15%] flex flex-col md:flex-row items-center gap-8 md:gap-16 lg:gap-20 mb-14 md:mb-32">
          <div className="w-full md:w-[54%] shrink-0 overflow-hidden">
            <img
              src="/belief1-new.jpg"
              alt="Connection"
              className="w-full object-cover object-center"
              style={{ aspectRatio: "4/5", filter: "sepia(0.06) contrast(1.06) brightness(0.97)" }}
              loading="lazy"
            />
          </div>
          <div className="flex-1">
            <p className="font-serif font-bold text-[60px] md:text-[120px] text-[#3A342C]/[0.055] leading-none select-none -mb-2 md:-mb-4 -ml-1">I</p>
            <h3 className="font-serif font-bold text-[24px] md:text-[32px] lg:text-[38px] text-[#3A342C] leading-[1.05] tracking-[-0.01em] mb-4 md:mb-5">
              Connection over composition.
            </h3>
            <div className="w-10 h-px bg-[#3A342C]/22 mb-4 md:mb-5" />
            <p className="font-sans text-[13px] md:text-[14px] text-[#3A342C]/58 leading-[1.9] tracking-[0.01em]">
              Every wedding is remembered through the people who lived it. Before we create photographs, we take the time to understand the relationships, emotions, and moments that matter most to each family.
            </p>
          </div>
        </div>

        {/* ── Belief II — text left, photo right ── */}
        <div className="px-[8%] md:px-[15%] flex flex-col-reverse md:flex-row items-center gap-8 md:gap-16 lg:gap-20 mb-14 md:mb-32">
          <div className="flex-1">
            <p className="font-serif font-bold text-[60px] md:text-[120px] text-[#3A342C]/[0.055] leading-none select-none -mb-2 md:-mb-4 -ml-1">II</p>
            <h3 className="font-serif font-bold text-[24px] md:text-[32px] lg:text-[38px] text-[#3A342C] leading-[1.05] tracking-[-0.01em] mb-4 md:mb-5">
              Stories before trends.
            </h3>
            <div className="w-10 h-px bg-[#3A342C]/22 mb-4 md:mb-5" />
            <p className="font-sans text-[13px] md:text-[14px] text-[#3A342C]/58 leading-[1.9] tracking-[0.01em]">
              Beautiful imagery may capture attention today, but meaningful stories continue to resonate for generations. We create work that remains timeless long after trends have faded.
            </p>
          </div>
          <div className="w-full md:w-[54%] shrink-0 overflow-hidden">
            <img
              src="/belief2-new.jpg"
              alt="Stories"
              className="w-full object-cover object-center"
              style={{ aspectRatio: "4/5", filter: "sepia(0.06) contrast(1.06) brightness(0.97)" }}
              loading="lazy"
            />
          </div>
        </div>

        {/* ── Pull quote ── */}
        <div className="px-[8%] md:px-[15%] mb-14 md:mb-32 flex items-center gap-4 md:gap-10">
          <div className="hidden md:block flex-1 h-px bg-[#3A342C]/12" />
          <p className="font-serif italic text-[13px] md:text-[17px] text-[#3A342C]/42 tracking-[0.01em] text-center md:shrink-0 md:max-w-[420px]">
            "Before a single frame is created, we discover what makes your story uniquely yours."
          </p>
          <div className="hidden md:block flex-1 h-px bg-[#3A342C]/12" />
        </div>

        {/* ── Beliefs III + IV — two text columns ── */}
        <div className="px-[8%] md:px-[15%] grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 lg:gap-20 mb-14 md:mb-32">
          <div>
            <p className="font-serif font-bold text-[60px] md:text-[120px] text-[#3A342C]/[0.055] leading-none select-none -mb-2 md:-mb-4 -ml-1">III</p>
            <h3 className="font-serif font-bold text-[24px] md:text-[32px] lg:text-[38px] text-[#3A342C] leading-[1.05] tracking-[-0.01em] mb-4 md:mb-5">
              Discovery before documentation.
            </h3>
            <div className="w-10 h-px bg-[#3A342C]/22 mb-4 md:mb-5" />
            <p className="font-sans text-[13px] md:text-[14px] text-[#3A342C]/58 leading-[1.9] tracking-[0.01em]">
              Every couple is different. Every family carries its own history. We invest time in discovering what makes your story uniquely yours before a single frame is created.
            </p>
          </div>
          <div>
            <p className="font-serif font-bold text-[60px] md:text-[120px] text-[#3A342C]/[0.055] leading-none select-none -mb-2 md:-mb-4 -ml-1">IV</p>
            <h3 className="font-serif font-bold text-[24px] md:text-[32px] lg:text-[38px] text-[#3A342C] leading-[1.05] tracking-[-0.01em] mb-4 md:mb-5">
              Craft with purpose.
            </h3>
            <div className="w-10 h-px bg-[#3A342C]/22 mb-4 md:mb-5" />
            <p className="font-sans text-[13px] md:text-[14px] text-[#3A342C]/58 leading-[1.9] tracking-[0.01em]">
              Every photograph, every film, every edit is made intentionally. Craftsmanship is measured not by complexity, but by emotional honesty.
            </p>
          </div>
        </div>

        {/* ── Belief V — cinematic photo, portrait on mobile / wide on desktop ── */}
        <div className="px-[8%] md:px-[15%] mb-12 md:mb-20">
          <div className="relative overflow-hidden aspect-[3/4] md:aspect-[16/7]">
            <img
              src="/belief3-new.jpg"
              alt="Trust"
              className="w-full h-full object-cover object-center"
              style={{ filter: "sepia(0.18) contrast(1.1) brightness(0.68)" }}
              loading="lazy"
            />
            {/* Mobile: gradient from bottom */}
            <div className="absolute inset-0 md:hidden" style={{ background: "linear-gradient(to top, rgba(20,14,8,0.92) 0%, rgba(20,14,8,0.55) 45%, transparent 70%)" }} />
            {/* Desktop: gradient from left */}
            <div className="absolute inset-0 hidden md:block" style={{ background: "linear-gradient(to right, rgba(20,14,8,0.88) 0%, rgba(20,14,8,0.52) 42%, transparent 72%)" }} />
            <div
              ref={b5HeadlineRef}
              className={`absolute inset-0 flex transition-all duration-[1000ms] ease-out ${b5HeadlineInView ? "opacity-100" : "opacity-0"}
                items-end md:items-center`}
            >
              {/* Mobile: text at bottom */}
              <div className="w-full px-6 pb-8 md:hidden">
                <p className="font-serif font-bold text-[48px] text-[#F5F0E8]/[0.07] leading-none select-none -mb-1">V</p>
                <h3 className="font-serif font-bold text-[22px] text-[#F5F0E8] leading-[1.05] tracking-[-0.01em] mb-3">
                  Trust before everything.
                </h3>
                <div className="w-8 h-px bg-[#F5F0E8]/28 mb-3" />
                <p className="font-sans text-[12px] text-[#F5F0E8]/58 leading-[1.8] tracking-[0.01em]">
                  Being invited into one of life's most meaningful moments is a privilege. We carry that with care throughout the entire journey.
                </p>
              </div>
              {/* Desktop: text on left */}
              <div className="hidden md:block pl-14 lg:pl-18 max-w-[500px]">
                <p className="font-serif font-bold text-[100px] text-[#F5F0E8]/[0.06] leading-none select-none -mb-3">V</p>
                <h3 className="font-serif font-bold text-[32px] lg:text-[40px] text-[#F5F0E8] leading-[1.05] tracking-[-0.01em] mb-4">
                  Trust before everything.
                </h3>
                <div className="w-10 h-px bg-[#F5F0E8]/28 mb-4" />
                <p className="font-sans text-[13px] text-[#F5F0E8]/58 leading-[1.9] tracking-[0.01em]">
                  Being invited into one of life's most meaningful moments is a privilege. We carry that responsibility with care, respect, and gratitude throughout the entire journey.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Closing editorial line ── */}
        <div
          ref={c4ClosingRef}
          className={`px-[8%] md:px-[15%] pb-14 md:pb-36 flex items-center justify-between transition-all duration-[800ms] ease-out ${
            c4ClosingInView ? "opacity-100" : "opacity-0"
          }`}
        >
          <span className="font-sans text-[8px] uppercase tracking-[0.22em] text-[#3A342C]/30">Evermor Tales</span>
          <span className="hidden md:block font-serif italic text-[11px] md:text-[12px] text-[#3A342C]/30">Five principles that guide every story we preserve.</span>
          <span className="font-sans text-[8px] uppercase tracking-[0.22em] text-[#3A342C]/30">Vol. I</span>
        </div>

      </section>
      </div>{/* end beliefs surface wrapper */}
      {/* About — inline landing section */}
      <section className="bg-[#FAFAFA] py-24 md:py-40 lg:py-56">
        <div className="max-w-[1100px] mx-auto px-6 md:px-12 lg:px-16 flex flex-col md:flex-row gap-14 md:gap-20 lg:gap-28 items-start">

          {/* Portrait — Polaroid */}
          <div
            ref={aboutImgRef}
            className={`shrink-0 transition-all duration-[1200ms] ease-out ${
              aboutImgInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
            style={{ width: "min(300px, 88vw)" }}
          >
            {/* Polaroid card */}
            <div
              className="bg-[#F3F2F0] relative"
              style={{
                padding: "12px 12px 56px 12px",
                boxShadow: "0 8px 30px rgba(20,14,8,0.28), 0 2px 8px rgba(20,14,8,0.18), 2px 4px 0 rgba(20,14,8,0.06)",
                transform: "rotate(-2.5deg)",
              }}
            >
              {/* Photo */}
              <div className="overflow-hidden" style={{ aspectRatio: "1/1.08" }}>
                <img
                  src="/about-hero.jpg"
                  alt="Shashikanth and Deepika"
                  loading="lazy"
                  className="w-full h-full object-cover object-center"
                  style={{  }}
                />
                {/* grain overlay */}
                <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256' height='256'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='256' height='256' filter='url(%23n)'/%3E%3C/svg%3E\")", opacity: 0.1, mixBlendMode: "overlay" as const }} />
              </div>

              {/* Caption area */}
              <div className="absolute bottom-0 left-0 right-0 h-[56px] flex items-center justify-center">
                <p className="font-serif italic text-[12px] text-[#3A342C]/35 tracking-[0.03em]">Shashikanth &amp; Deepika</p>
              </div>
            </div>

            {/* Faint base shadow strip */}
            <div className="h-[4px] mx-4 mt-0.5 bg-[#1A1208]/12 blur-sm" style={{ transform: "rotate(-2.5deg)" }} />
          </div>

          {/* Text */}
          <div className="flex-1 flex flex-col justify-center pt-2 md:pt-10">

            <p
              ref={aboutT1Ref}
              className={`font-sans font-light uppercase tracking-[0.22em] text-[10px] text-[#3A342C]/35 mb-8 transition-all duration-[800ms] ease-out ${
                aboutT1InView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              Who we are
            </p>

            <div
              ref={aboutT2Ref}
              className={`transition-all duration-[1000ms] ease-out ${
                aboutT2InView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            >
              <p className="font-serif font-light text-[#3A342C] leading-[1.85] mb-6" style={{ fontSize: 'clamp(17px, 1.4vw, 20px)' }}>
                We are Shashikanth &amp; Deepika — not photographers first, but people
                deeply fascinated by people.
              </p>
              <p className="font-serif font-light text-[#3A342C] leading-[1.85]" style={{ fontSize: 'clamp(17px, 1.4vw, 20px)' }}>
                Our own wedding taught us something. The memories we returned to most
                weren't the perfectly posed frames. They were the quiet ones.
                The unguarded ones. The ones we almost forgot.
              </p>
            </div>

            <div
              ref={aboutT4Ref}
              className={`mt-8 transition-all duration-[1000ms] ease-out ${
                aboutT4InView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            >
              <p className="font-serif font-light italic text-[#3A342C]/50 leading-[1.85]" style={{ fontSize: 'clamp(16px, 1.3vw, 19px)' }}>
                We don't arrive to document a celebration.
                We arrive to preserve the beginning of a family.
              </p>
            </div>

            <div
              ref={aboutLinkRef}
              className={`mt-10 md:mt-14 transition-all duration-[800ms] ease-out ${
                aboutLinkInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <Link
                href="/about"
                className="font-sans font-light text-[#3A342C]/60 tracking-[0.14em] uppercase text-[11px] hover:text-[#3A342C] transition-colors duration-300"
              >
                Read our full story&nbsp;&nbsp;→
              </Link>
            </div>

          </div>
        </div>
      </section>
      {/* Chapter 5 - Beginnings — Postcard Collection */}
      <section className="bg-[#EFEFED] pt-20 md:pt-32 pb-24 md:pb-36 overflow-hidden">

        {/* Section header */}
        <div className="text-center mb-14 md:mb-20 px-6">
          <p className="font-sans uppercase tracking-[0.3em] text-[9px] text-[#3A342C]/35 mb-4">✦ &nbsp; A Collection of Stories &nbsp; ✦</p>
          <h2
            ref={headingRef}
            className={`font-serif font-bold text-[56px] md:text-[88px] lg:text-[108px] text-[#3A342C] leading-[0.9] tracking-[-0.01em] transition-all duration-[800ms] ease-out ${
              headingInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            Beginnings
          </h2>
          <p
            ref={introRef}
            className={`font-sans font-light text-[13px] md:text-[14px] text-[#3A342C]/50 leading-[1.85] tracking-[0.02em] mt-5 transition-all duration-[800ms] ease-out ${
              introInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: introInView ? '150ms' : '0ms' }}
          >
            Every beginning is different. Every emotion is real.
          </p>
        </div>

        {/* ── Featured postcard spread — front + back ── */}
        <div className="px-[15%] mb-6 md:mb-8">
          <div className="flex flex-col md:flex-row gap-4 md:gap-5 items-stretch">

            {/* Postcard FRONT */}
            <Link
              href="/beginnings/shaun-sowmya"
              ref={s1ImgRef}
              className={`flex-1 block group cursor-pointer bg-[#EFE4D0] shadow-[0_6px_36px_rgba(58,52,44,0.18)] transition-all duration-[1000ms] ease-out md:-rotate-[0.6deg] hover:rotate-0 hover:shadow-[0_12px_48px_rgba(58,52,44,0.25)] ${
                s1ImgInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
            >
              {/* aged mat border */}
              <div className="p-[10px] md:p-[13px]">
                <div className="relative overflow-hidden" style={{ aspectRatio: "3/2" }}>
                  <img
                    src="/beginnings-shaun-sowmya.jpg"
                    alt="Shaun & Sowmya"
                    className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.02]"
                    loading="lazy"
                  />
                  {/* grain overlay */}
                  <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256' height='256'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='256' height='256' filter='url(%23n)'/%3E%3C/svg%3E\")", opacity: 0.13, mixBlendMode: "overlay" as const }} />
                  {/* Gradient base for text */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/25" />
                  {/* Couple name — top left */}
                  <div className="absolute top-3 md:top-4 left-3 md:left-4">
                    <p className="font-sans font-bold text-[14px] md:text-[18px] lg:text-[20px] text-white tracking-[0.05em] uppercase drop-shadow-sm leading-tight">
                      Shaun &<br />Sowmya
                    </p>
                  </div>
                  {/* Location — top right */}
                  <div className="absolute top-4 md:top-5 right-3 md:right-4 flex items-center gap-1.5">
                    <span className="font-sans text-[7px] md:text-[8px] text-white/75 uppercase tracking-[0.12em]">Chennai</span>
                    <div className="w-4 md:w-5 h-px bg-white/50" />
                    <span className="font-sans text-[7px] md:text-[8px] text-white/75 uppercase tracking-[0.12em]">India</span>
                  </div>
                  {/* Brand — bottom right */}
                  <div className="absolute bottom-3 right-3 md:bottom-4 md:right-4">
                    <p className="font-serif italic text-[9px] md:text-[10px] text-white/60 tracking-[0.06em]">Evermor Tales</p>
                  </div>
                </div>
              </div>
            </Link>

            {/* Postcard BACK */}
            <div
              ref={s2ImgRef}
              className={`flex-1 bg-[#F5EDE0] shadow-[0_6px_36px_rgba(58,52,44,0.15)] transition-all duration-[1000ms] ease-out md:rotate-[0.6deg] hover:rotate-0 ${
                s2ImgInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
              style={{ transitionDelay: s2ImgInView ? '180ms' : '0ms' }}
            >
              <div className="p-5 md:p-7 h-full flex flex-col" style={{ minHeight: "280px" }}>
                {/* Card header */}
                <div className="flex items-start justify-between pb-3 border-b border-[#3A342C]/10 mb-3">
                  <div className="flex-1 text-center pr-2">
                    <p className="font-serif font-bold text-[11px] md:text-[13px] text-[#3A342C] tracking-[0.14em] uppercase">Evermor Tales</p>
                    <p className="font-sans text-[7px] md:text-[8px] text-[#3A342C]/35 tracking-[0.18em] uppercase mt-0.5">Wedding Photography</p>
                  </div>
                  {/* Perforated stamp box */}
                  <div
                    className="shrink-0 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center"
                    style={{ border: "1.5px dashed rgba(58,52,44,0.22)" }}
                  >
                    <div className="font-sans text-[5px] text-[#3A342C]/22 tracking-[0.08em] text-center uppercase leading-[1.5]">Post<br/>age</div>
                  </div>
                </div>

                {/* Main body — split with vertical rule */}
                <div className="flex-1 flex gap-0 min-h-0">
                  {/* Left column */}
                  <div className="flex-[5] pr-4 border-r border-[#3A342C]/10 flex flex-col justify-between">
                    <div>
                      <p className="font-sans uppercase text-[7px] md:text-[8px] tracking-[0.22em] text-[#8C6D4F] mb-2">Photography & Film</p>
                      <p className="font-serif font-bold text-[15px] md:text-[18px] text-[#3A342C] leading-[1.15] mb-2.5">Shaun &amp; Sowmya</p>
                      <div className="w-7 h-px bg-[#3A342C]/15 mb-2.5" />
                      <p className="font-sans text-[10px] md:text-[11px] text-[#3A342C]/52 leading-[1.75] tracking-[0.005em]">
                        Held in the golden light of Chennai across two days of ceremony, laughter, and the quiet moments only families share.
                      </p>
                    </div>
                    <p className="font-sans text-[7px] md:text-[8px] text-[#3A342C]/30 tracking-[0.1em] uppercase mt-4">
                      For enquiries · evermortales.com
                    </p>
                  </div>

                  {/* Right column */}
                  <div className="flex-[4] pl-4 flex flex-col justify-center relative overflow-hidden">
                    <p className="font-serif italic text-[11px] md:text-[13px] text-[#3A342C]/60 leading-[1.85] tracking-[0.01em]">
                      "There is always a moment when the world falls quiet and they see only each other."
                    </p>
                    {/* Circular postmark */}
                    <div
                      className="absolute bottom-0 right-0 w-14 h-14 md:w-[60px] md:h-[60px] rounded-full flex items-center justify-center text-center"
                      style={{ border: "1px solid rgba(58,52,44,0.18)" }}
                    >
                      <p className="font-sans text-[5px] md:text-[6px] text-[#3A342C]/28 tracking-[0.06em] uppercase leading-[1.6]">
                        Evermor<br/>Tales<br/>Made with<br/>Love
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Postcard grid — one front ── */}
        <div className="px-[15%] mb-16 md:mb-24">
          <div className="flex justify-center">

            {/* Card 1 */}
            <Link
              href="/beginnings/sakshi-rajat"
              ref={s4ImgRef}
              className={`block group cursor-pointer bg-[#EFE4D0] shadow-[0_4px_24px_rgba(58,52,44,0.13)] hover:shadow-[0_8px_36px_rgba(58,52,44,0.2)] transition-all duration-[900ms] ease-out md:rotate-[0.4deg] hover:rotate-0 ${
                s4ImgInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
            >
              <div className="p-[8px] md:p-[10px]">
                <div className="relative overflow-hidden" style={{ aspectRatio: "3/2" }}>
                  <img src="/beginnings-sakshi-rajat.jpg" alt="Sakshi & Rajat" className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.03]" loading="lazy" />
                  <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256' height='256'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='256' height='256' filter='url(%23n)'/%3E%3C/svg%3E\")", opacity: 0.13, mixBlendMode: "overlay" as const }} />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/38 via-transparent to-black/22" />
                  <div className="absolute top-2.5 left-2.5 md:top-3 md:left-3">
                    <p className="font-sans font-bold text-[11px] md:text-[13px] text-white tracking-[0.05em] uppercase drop-shadow-sm leading-tight">Sakshi<br />&amp; Rajat</p>
                  </div>
                  <div className="absolute top-2.5 right-2.5 md:top-3 md:right-3 flex items-center gap-1">
                    <span className="font-sans text-[6px] text-white/70 uppercase tracking-[0.1em]">Mumbai</span>
                    <div className="w-3 h-px bg-white/45" />
                    <span className="font-sans text-[6px] text-white/70 uppercase tracking-[0.1em]">India</span>
                  </div>
                  <div className="absolute bottom-2 right-2.5 md:bottom-3 md:right-3">
                    <p className="font-serif italic text-[8px] text-white/55">Evermor Tales</p>
                  </div>
                </div>
              </div>
            </Link>

          </div>
        </div>

        {/* Closing CTA */}
        <div className="text-center px-6">
          <p
            ref={closingRef}
            className={`font-serif font-light italic text-[20px] md:text-[26px] text-[#3A342C]/55 tracking-[0.01em] leading-[1.5] mb-8 md:mb-10 transition-all duration-[800ms] ease-out ${
              closingInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            No two beginnings are ever the same.
          </p>
          <Link
            href="/beginnings"
            ref={ctaRef}
            className={`inline-flex items-center gap-3 font-sans font-light text-[12px] md:text-[13px] text-[#3A342C]/50 tracking-[0.12em] uppercase hover:text-[#3A342C]/80 transition-all duration-[800ms] ease-out ${
              ctaInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: ctaInView ? '150ms' : '0ms' }}
          >
            <span>View All Beginnings</span>
            <span>→</span>
          </Link>
        </div>
      </section>
      {/* Chapter 6 — Memory */}
      <section className="bg-[#EFEFED] overflow-hidden">

        {/* ── Top label rule ── */}
        <div className="border-b border-[#3A342C]/12 px-5 md:px-10 py-3 flex items-center justify-between">
          <span className="font-sans uppercase tracking-[0.22em] text-[8px] md:text-[9px] text-[#3A342C]/35">Chapter VI</span>
          <span className="font-sans uppercase tracking-[0.22em] text-[8px] md:text-[9px] text-[#3A342C]/35">Memory</span>
        </div>

        {/* ── Opening line — large ── */}
        <div className="px-5 md:px-10 lg:px-16 pt-14 md:pt-20 pb-10 md:pb-14">
          <p
            ref={ch6s1Ref}
            className={`font-serif font-light text-[36px] md:text-[58px] lg:text-[72px] text-[#3A342C] leading-[1.05] tracking-[-0.005em] max-w-[700px] transition-all duration-[1000ms] ease-out ${
              ch6s1InView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            Every family<br />remembers<br />differently.
          </p>
        </div>

        {/* ── Collage centrepiece + scattered notes ── */}
        <div className="relative px-5 md:px-10 lg:px-16 pb-14 md:pb-20">

          {/* Desktop: image in center, notes scattered around */}
          <div className="hidden md:grid grid-cols-[1fr_auto_1fr] gap-x-8 lg:gap-x-12 items-center">

            {/* Left column — voices + photographs + moments */}
            <div
              ref={ch6s2Ref}
              className={`flex flex-col gap-8 transition-all duration-[900ms] ease-out ${
                ch6s2InView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-6'
              }`}
            >
              <div>
                <p className="font-serif font-light text-[20px] lg:text-[26px] text-[#3A342C] leading-[1.2] tracking-[0.005em]">voices.</p>
              </div>
              <div>
                <p className="font-serif font-light text-[20px] lg:text-[26px] text-[#3A342C] leading-[1.2] tracking-[0.005em]">photographs.</p>
              </div>
              <div>
                <p className="font-serif font-light text-[20px] lg:text-[26px] text-[#3A342C] leading-[1.2] tracking-[0.005em]">moments.</p>
              </div>
            </div>

            {/* Centre — the collage */}
            <div
              ref={ch6s3Ref}
              className={`relative transition-all duration-[1100ms] ease-out ${
                ch6s3InView ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
              }`}
            >
              <div
                className="shadow-[0_12px_60px_rgba(58,52,44,0.22)]"
                style={{ transform: "rotate(-1.5deg)", width: "min(420px, 38vw)" }}
              >
                <img
                  src="/memory-collage.jpg"
                  alt="A collage of memory objects — a gramophone, vintage camera, wedding rings, an open book, an oval frame, postcards"
                  className="w-full h-auto block"
                  loading="lazy"
                />
              </div>
              {/* Small pin dot at top */}
              <div
                className="absolute top-[-8px] left-1/2 w-3 h-3 rounded-full bg-[#8C6D4F]/50 shadow-sm"
                style={{ transform: "translateX(-50%) rotate(-1.5deg)" }}
              />
            </div>

            {/* Right column — places + silence */}
            <div
              className={`flex flex-col gap-8 items-end text-right justify-center transition-all duration-[900ms] ease-out ${
                ch6s2InView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-6'
              }`}
            >
              <div>
                <p className="font-serif font-light text-[20px] lg:text-[26px] text-[#3A342C] leading-[1.2] tracking-[0.005em]">places.</p>
              </div>
              <div>
                <p className="font-serif font-light text-[20px] lg:text-[26px] text-[#3A342C] leading-[1.2] tracking-[0.005em]">silence.</p>
              </div>
              <div>
                <p className="font-serif font-light text-[20px] lg:text-[26px] text-[#3A342C] leading-[1.2] tracking-[0.005em]">story.</p>
              </div>
            </div>
          </div>

          {/* Mobile: stacked */}
          <div className="md:hidden flex flex-col items-center gap-10">
            <div
              ref={b2CopyRef}
              className={`shadow-[0_8px_40px_rgba(58,52,44,0.2)] transition-all duration-[1000ms] ease-out ${
                b2CopyInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
              style={{ transform: "rotate(-1deg)", width: "min(340px, 85vw)" }}
            >
              <img src="/memory-collage.jpg" alt="Memory objects" className="w-full h-auto block" loading="lazy" />
            </div>
            <div
              ref={b3CopyRef}
              className={`grid grid-cols-2 gap-x-8 gap-y-7 text-center transition-all duration-[900ms] ease-out ${
                b3CopyInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            >
              {["voices.", "photographs.", "moments.", "places.", "silence.", "story."].map((text, i) => (
                <div key={i}>
                  <p className="font-serif font-light text-[17px] text-[#3A342C] leading-[1.3]">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Divider ── */}
        <div className="mx-5 md:mx-10 lg:mx-16 border-t border-[#3A342C]/12" />

        {/* ── "But every family deserves..." ── */}
        <div className="px-5 md:px-10 lg:px-16 py-12 md:py-16 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <p
            ref={ch6s4Ref}
            className={`font-serif font-light text-[24px] md:text-[38px] lg:text-[48px] text-[#3A342C] leading-[1.15] tracking-[0.005em] max-w-[560px] transition-all duration-[1000ms] ease-out ${
              ch6s4InView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            But every family deserves something<br className="hidden md:block" /> that brings them back.
          </p>
        </div>

        {/* ── Final statement — full-width dark bar ── */}
        <div className="bg-[#3A342C] px-5 md:px-10 lg:px-16 py-16 md:py-24 flex flex-col md:flex-row md:items-end md:justify-between gap-8">
          <div>
            <p
              ref={ch6s5Ref}
              className={`font-sans uppercase tracking-[0.18em] text-[8px] text-[#F5F0E8]/35 mb-5 transition-all duration-[800ms] ease-out ${
                ch6s5InView ? 'opacity-100' : 'opacity-0'
              }`}
            >
              We don't simply preserve what happened.
            </p>
            <p
              ref={ch6ClosingRef}
              className={`font-serif font-light text-[42px] md:text-[68px] lg:text-[84px] text-[#F5F0E8] leading-[1.0] tracking-[-0.01em] transition-all duration-[1100ms] ease-out ${
                ch6ClosingInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              We preserve<br />what it meant.
            </p>
          </div>
          <p className="font-sans font-light text-[11px] md:text-[12px] text-[#F5F0E8]/38 tracking-[0.04em] leading-[1.8] md:text-right max-w-[260px] shrink-0">
            Every Evermor story begins with<br />understanding what is worth remembering.
          </p>
        </div>

      </section>
      {/* Chapter 7 — Final Invitation */}
      <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">

        {/* Full-screen photograph */}
        <img
          src="/chapter7-new.jpg"
          alt="A couple walking away at golden hour"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-[#1A1612]/55" />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-[640px] mx-auto">

          <h2
            ref={ch7HeadlineRef}
            className={`font-serif font-light text-[36px] md:text-[52px] lg:text-[60px] text-[#F5F0E8] leading-[1.15] tracking-[0.01em] mb-10 md:mb-14 transition-all duration-[1200ms] ease-out ${
              ch7HeadlineInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            Every family has a beginning.
          </h2>

          <p
            ref={ch7CopyRef}
            className={`font-serif font-light text-[16px] md:text-[19px] text-[#F5F0E8]/70 leading-[1.75] tracking-[0.01em] mb-14 md:mb-20 transition-all duration-[1200ms] ease-out ${
              ch7CopyInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: ch7CopyInView ? '200ms' : '0ms' }}
          >
            Some beginnings last a day. The memories they create can last forever. If our way of seeing the world feels like yours, we'd be honoured to preserve the beginning of your family's story.
          </p>

          <div
            ref={ch7BtnRef}
            className={`transition-all duration-[1200ms] ease-out ${
              ch7BtnInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: ch7BtnInView ? '400ms' : '0ms' }}
          >
            <button className="font-sans font-light text-[12px] md:text-[13px] text-[#F5F0E8]/80 tracking-[0.2em] uppercase border border-[#F5F0E8]/35 px-12 py-4 hover:border-[#F5F0E8]/80 hover:text-[#F5F0E8] transition-all duration-500 ease-out">
              Begin Your Story
            </button>
          </div>

          <p
            ref={ch7NoteRef}
            className={`mt-10 font-sans font-light text-[10px] md:text-[11px] text-[#F5F0E8]/38 tracking-[0.12em] leading-[1.8] transition-all duration-[1200ms] ease-out ${
              ch7NoteInView ? "opacity-100" : "opacity-0"
            }`}
            style={{ transitionDelay: ch7NoteInView ? '650ms' : '0ms' }}
          >
            Accepting a limited number of weddings each year so every story receives the care it deserves.
          </p>

        </div>
      </section>

      {/* Faint admin lock — bottom centre */}
      <div className="flex justify-center py-8" style={{ background: "#0c0906" }}>
        <a
          href="/admin"
          aria-label="Admin"
          className="opacity-[0.12] hover:opacity-30 transition-opacity duration-500"
        >
          <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="1" y="7" width="12" height="9" rx="1" stroke="#F5F0E8" strokeWidth="1"/>
            <path d="M4 7V4.5a3 3 0 0 1 6 0V7" stroke="#F5F0E8" strokeWidth="1" fill="none"/>
          </svg>
        </a>
      </div>
    </div>
  );
}
