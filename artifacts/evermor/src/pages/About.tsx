import { useEffect, useState, useRef } from "react";
import { Link } from "wouter";
import Nav from "../components/Nav";

// ─── Scroll-fade ──────────────────────────────────────────────────────────────
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

// ─── Copy ─────────────────────────────────────────────────────────────────────
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

      {/* Nav — absolute over the image */}
      <Nav
        theme="dark"
        mounted={mounted}
        position="fixed"
        links={[
          { href: "/", label: "Home" },
          { href: "/beginnings", label: "Beginnings" },
          { href: "/journal", label: "Journal" },
          { href: "/about", label: "About", active: true },
          { href: "/approach", label: "Approach" },
          { href: "/begin-your-story", label: "Begin Your Story" },
        ]}
      />

      {/* ── Split layout ────────────────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row min-h-screen">

        {/* ── LEFT: sticky image panel ──────────────────────────────────── */}
        <div className="lg:w-[48%] xl:w-[45%] lg:sticky lg:top-0 lg:h-screen flex-shrink-0 overflow-hidden bg-[#1A1612]">
          <div
            className="w-full h-[60vh] lg:h-full relative"
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
            {/* Gradient scrim — lifts caption without crushing photo */}
            <div className="absolute inset-x-0 bottom-0 h-[50%] bg-gradient-to-t from-black/55 to-transparent" />

            {/* Name + tagline — pinned to bottom-left */}
            <div
              className="absolute bottom-10 left-8 right-8 flex flex-col gap-3 z-10"
              style={{
                transition: "opacity 800ms ease-out 300ms, transform 800ms ease-out 300ms",
                opacity: mounted ? 1 : 0,
                transform: mounted ? "translateY(0)" : "translateY(16px)",
              }}
            >
              <h1
                className="font-serif font-light text-[#F5F0E8] leading-[1.1] tracking-[0.01em]"
                style={{ fontSize: "clamp(26px, 3.2vw, 46px)" }}
              >
                We are Shashikanth &amp; Deepika.
              </h1>
              <p
                className="font-sans font-light text-[#F5F0E8]/60 uppercase tracking-[0.14em]"
                style={{ fontSize: "clamp(9px, 0.9vw, 11px)", lineHeight: 2 }}
              >
                Partners in life.&nbsp;&nbsp;&nbsp;Partners in storytelling.
              </p>
            </div>
          </div>
        </div>

        {/* ── RIGHT: scrollable story ───────────────────────────────────── */}
        <div className="lg:w-[52%] xl:w-[55%] flex flex-col">

          {/* Story text */}
          <section
            aria-label="Our story"
            style={{
              paddingTop: "clamp(72px, 12vw, 160px)",
              paddingBottom: "clamp(56px, 8vw, 120px)",
              paddingLeft: "clamp(28px, 6vw, 96px)",
              paddingRight: "clamp(28px, 6vw, 96px)",
            }}
          >
            <div style={{ maxWidth: 600 }}>
              {paragraphs.map((line, i) =>
                line === null ? (
                  <div key={i} style={{ height: "clamp(20px, 3vw, 40px)" }} />
                ) : (
                  <Fade key={i}>
                    <p
                      className="font-serif font-light text-[#3A342C]"
                      style={{
                        fontSize: "clamp(17px, 1.5vw, 21px)",
                        lineHeight: 1.85,
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

          {/* Quiet invitation */}
          <section
            aria-label="Invitation"
            style={{
              paddingTop: "clamp(60px, 10vw, 140px)",
              paddingBottom: "clamp(80px, 14vw, 180px)",
              paddingLeft: "clamp(28px, 6vw, 96px)",
              paddingRight: "clamp(28px, 6vw, 96px)",
            }}
          >
            <div style={{ maxWidth: 600 }}>

              <Fade delay={0}>
                <p
                  className="font-serif font-light text-[#3A342C]"
                  style={{ fontSize: "clamp(17px, 1.5vw, 21px)", lineHeight: 1.85, margin: 0 }}
                >
                  If our story resonates with you,
                </p>
              </Fade>

              <Fade delay={80}>
                <p
                  className="font-serif font-light text-[#3A342C]"
                  style={{ fontSize: "clamp(17px, 1.5vw, 21px)", lineHeight: 1.85, margin: 0 }}
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
      </div>

    </div>
  );
}
