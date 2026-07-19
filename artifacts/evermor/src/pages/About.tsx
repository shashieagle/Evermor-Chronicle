import { useEffect, useState, useRef } from "react";
import { Link } from "wouter";
import Nav from "../components/Nav";

// ─── Scroll-fade — identical to the rest of the site ─────────────────────────
function useInView(threshold = 0.08) {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLElement | HTMLDivElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) { setIsInView(true); obs.unobserve(el); }
      },
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
  style = {},
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const [ref, inView] = useInView();
  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={className}
      style={{
        transition: `opacity 800ms ease-out ${delay}ms, transform 800ms ease-out ${delay}ms`,
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(14px)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ─── Copy — each entry is a line of prose; null = breathing gap ───────────────
const paragraphs: (string | null)[] = [
  "We didn't begin this journey because we wanted to become wedding photographers.",
  "We began because we were fascinated by people.",
  null,
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
    <div className="bg-[#FAFAF8] text-[#3A342C]">

      {/* ── 1. Hero ──────────────────────────────────────────────────── */}
      <section className="relative h-[85vh] w-full overflow-hidden bg-[#1A1612]">

        {/* Image */}
        <div
          className="absolute inset-0 z-0"
          style={{
            transition: "opacity 1200ms ease-in-out",
            opacity: mounted ? 1 : 0,
          }}
        >
          <img
            src="/about-hero.jpg"
            alt="Shashikanth and Deepika"
            className="w-full h-full object-cover object-center"
            loading="eager"
          />
          {/* Subtle scrim — keeps image dominant, lifts text without crushing the photo */}
          <div className="absolute inset-0 bg-[#1A1612]/18" />
          <div className="absolute inset-x-0 bottom-0 h-[45%] bg-gradient-to-t from-black/45 to-transparent" />
        </div>

        {/* Nav */}
        <Nav
          theme="dark"
          mounted={mounted}
          position="absolute"
          links={[
            { href: "/", label: "Home" },
            { href: "/beginnings", label: "Beginnings" },
            { href: "/about", label: "About", active: true },
            { href: "/begin-your-story", label: "Begin Your Story" },
          ]}
        />

        {/* Headline — bottom-left, same anchor as story hero pages */}
        <div className="absolute bottom-[80px] left-6 md:left-[100px] z-10 flex flex-col items-start gap-[14px]">
          <h1
            className="font-serif font-light text-[#F5F0E8] tracking-[0.01em] leading-[1.1]"
            style={{
              fontSize: "clamp(34px, 5vw, 68px)",
              transition: "opacity 800ms ease-out 200ms, transform 800ms ease-out 200ms",
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateY(0)" : "translateY(18px)",
            }}
          >
            We are Shashikanth &amp; Deepika.
          </h1>
          <p
            className="font-sans font-light text-[#F5F0E8]/65 tracking-[0.14em] uppercase"
            style={{
              fontSize: "clamp(10px, 1vw, 12px)",
              lineHeight: 2,
              transition: "opacity 800ms ease-out 400ms, transform 800ms ease-out 400ms",
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateY(0)" : "translateY(12px)",
            }}
          >
            Partners in life.&nbsp;&nbsp;&nbsp;Partners in storytelling.
          </p>
        </div>
      </section>

      {/* ── 2. Editorial Story ───────────────────────────────────────── */}
      {/*
        Container is centred on the page (mx-auto), max 760px.
        Text is left-aligned — editorial essays read left, not centred.
        Whitespace between thought-clusters acts as the rhythm.
      */}
      <section
        aria-label="Our story"
        style={{
          paddingTop: "clamp(88px, 13vw, 168px)",
          paddingBottom: "clamp(80px, 10vw, 140px)",
          paddingLeft: "clamp(24px, 8vw, 100px)",
          paddingRight: "clamp(24px, 8vw, 100px)",
        }}
      >
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          {paragraphs.map((line, i) =>
            line === null ? (
              // Breathing gap — whitespace as rhythm
              <div key={i} style={{ height: "clamp(22px, 3.5vw, 44px)" }} />
            ) : (
              <Fade key={i}>
                <p
                  className="font-serif font-light text-[#3A342C]"
                  style={{
                    fontSize: "clamp(17px, 1.55vw, 21px)",
                    lineHeight: 1.8,
                    margin: 0,
                  }}
                >
                  {line}
                </p>
              </Fade>
            )
          )}
        </div>
      </section>

      {/* ── 3. Quiet Invitation ──────────────────────────────────────── */}
      {/*
        180–220px of vertical whitespace separates this from the editorial,
        then one final statement — no heading, no divider — followed by
        a bare text link. Nothing more.
      */}
      <section
        aria-label="Invitation"
        style={{
          paddingTop: "clamp(180px, 18vw, 220px)",
          paddingBottom: "clamp(120px, 14vw, 180px)",
          paddingLeft: "clamp(24px, 8vw, 100px)",
          paddingRight: "clamp(24px, 8vw, 100px)",
        }}
      >
        <div style={{ maxWidth: 760, margin: "0 auto" }}>

          <Fade delay={0}>
            <p
              className="font-serif font-light text-[#3A342C]"
              style={{ fontSize: "clamp(17px, 1.55vw, 21px)", lineHeight: 1.8, margin: 0 }}
            >
              If our story resonates with you,
            </p>
          </Fade>

          <Fade delay={80}>
            <p
              className="font-serif font-light text-[#3A342C]"
              style={{ fontSize: "clamp(17px, 1.55vw, 21px)", lineHeight: 1.8, margin: 0 }}
            >
              perhaps it's time to begin yours.
            </p>
          </Fade>

          <Fade delay={240}>
            <div style={{ marginTop: "clamp(36px, 4vw, 56px)" }}>
              <Link
                href="/begin-your-story"
                className="font-sans font-light text-[#3A342C]/80 tracking-[0.1em] uppercase transition-opacity duration-400 hover:opacity-50"
                style={{ fontSize: "clamp(11px, 1vw, 13px)" }}
              >
                Begin Your Story&nbsp;&nbsp;→
              </Link>
            </div>
          </Fade>

        </div>
      </section>

    </div>
  );
}
