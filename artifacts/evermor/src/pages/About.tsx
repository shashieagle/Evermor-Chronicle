import { useEffect, useState, useRef } from "react";
import { Link } from "wouter";

// ── Reuse the same scroll-fade system as the rest of the site ─────────────────
function useInView(threshold = 0.08) {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLElement | HTMLDivElement | null>(null);
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

function Fade({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}) {
  const [ref, inView] = useInView();
  return (
    <Tag
      ref={ref as any}
      className={className}
      style={{
        transition: `opacity 900ms ease-out ${delay}ms, transform 900ms ease-out ${delay}ms`,
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(16px)",
      }}
    >
      {children}
    </Tag>
  );
}

// ── Editorial copy — each line/thought is its own node ───────────────────────
const editorialLines = [
  "We didn't begin this journey because we wanted to become wedding photographers.",
  "We began because we were fascinated by people.",
  null, // breathing gap
  "The relationships they build.",
  "The families they belong to.",
  "The stories they carry.",
  null,
  "When we got married ourselves, something changed.",
  null,
  "We realised the memories we treasured most weren't the perfectly posed photographs.",
  "They were the moments we almost forgot.",
  null,
  "A quiet glance.",
  "Parents trying to hide their emotions.",
  "Friends laughing between ceremonies.",
  "Small conversations that no one planned.",
  null,
  "That experience changed the way we approached every wedding that followed.",
  null,
  "Today, we don't arrive with the intention of simply documenting a celebration.",
  "We arrive with the responsibility of preserving the beginning of a family's story.",
  null,
  "For us, this has never been just about photography.",
  "It has always been about people.",
];

export default function About() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <div className="bg-[#F5F0E8] text-[#3A342C]">

      {/* ── Hero — 85vh ───────────────────────────────────────────── */}
      <section className="relative h-[85vh] w-full overflow-hidden bg-[#1A1612]">

        {/* Photograph */}
        <div className={`absolute inset-0 z-0 transition-opacity duration-[1400ms] ease-in-out ${mounted ? "opacity-100" : "opacity-0"}`}>
          <img
            src="/about-hero.jpg"
            alt="Shashikanth and Deepika"
            className="w-full h-full object-cover object-center"
            loading="eager"
          />
          {/* Subtle darkening — keep the image warm, not oppressive */}
          <div className="absolute inset-0 bg-[#1A1612]/20" />
          {/* Bottom fade to lift text out of the image */}
          <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/50 to-transparent" />
        </div>

        {/* Nav — identical to every other page */}
        <nav className={`absolute top-0 left-0 right-0 z-10 px-6 py-6 md:px-[100px] md:py-10 flex justify-between items-start transition-opacity duration-[800ms] ease-in-out ${mounted ? "opacity-100" : "opacity-0"}`}>
          <Link href="/" className="font-serif text-2xl tracking-[0.02em] font-light text-[#F5F0E8] hover:opacity-80 transition-opacity duration-300">
            Evermor
          </Link>
          <div className="flex gap-8 font-sans text-[13px] tracking-wide font-light">
            <Link href="/" className="text-[#F5F0E8]/75 hover:text-[#F5F0E8] transition-colors duration-300">Home</Link>
            <Link href="/beginnings" className="text-[#F5F0E8]/75 hover:text-[#F5F0E8] transition-colors duration-300">Beginnings</Link>
            <Link href="/about" className="text-[#F5F0E8] transition-colors duration-300">About</Link>
            <Link href="/begin-your-story" className="text-[#F5F0E8]/75 hover:text-[#F5F0E8] transition-colors duration-300">Begin Your Story</Link>
          </div>
        </nav>

        {/* Headline — bottom-left, same anchor as story pages */}
        <div className="absolute bottom-[80px] left-6 md:left-[100px] z-10 flex flex-col items-start gap-3">
          <h1
            className="font-serif font-light text-[#F5F0E8] tracking-[0.01em] leading-[1.1]"
            style={{
              fontSize: "clamp(36px, 5.5vw, 72px)",
              transition: "opacity 800ms ease-out 200ms, transform 800ms ease-out 200ms",
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateY(0)" : "translateY(20px)",
            }}
          >
            We are Shashikanth &amp; Deepika.
          </h1>
          <p
            className="font-sans font-light text-[#F5F0E8]/70 tracking-[0.12em] uppercase"
            style={{
              fontSize: "clamp(11px, 1.1vw, 13px)",
              lineHeight: 1.8,
              transition: "opacity 800ms ease-out 420ms, transform 800ms ease-out 420ms",
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateY(0)" : "translateY(14px)",
            }}
          >
            Partners in life.&nbsp;&nbsp;Partners in storytelling.
          </p>
        </div>
      </section>

      {/* ── Editorial story ───────────────────────────────────────── */}
      {/*
        Generous top whitespace acts as the transition — no divider, no heading.
        760px max-width as specified. Left-aligned for reading comfort.
      */}
      <section
        aria-label="Our story"
        className="px-6 md:px-[100px]"
        style={{ paddingTop: "clamp(80px, 12vw, 160px)", paddingBottom: "clamp(80px, 12vw, 160px)" }}
      >
        <div style={{ maxWidth: 760 }}>
          {editorialLines.map((line, i) =>
            line === null ? (
              // Breathing gap between thoughts
              <div key={i} style={{ height: "clamp(20px, 3vw, 36px)" }} />
            ) : (
              <Fade key={i} delay={0}>
                <p
                  className="font-serif font-light text-[#3A342C] leading-[1.75]"
                  style={{ fontSize: "clamp(17px, 1.6vw, 22px)", margin: 0 }}
                >
                  {line}
                </p>
              </Fade>
            )
          )}
        </div>
      </section>

      {/* ── Placeholder — next section ────────────────────────────── */}
      <section id="our-approach" />

    </div>
  );
}
