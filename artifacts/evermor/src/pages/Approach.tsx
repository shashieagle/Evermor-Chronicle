import { useEffect, useState } from "react";
import { Link } from "wouter";
import Nav from "../components/Nav";

export default function Approach() {
  const [mounted, setMounted] = useState(false);
  const [letterVisible, setLetterVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
    const t = setTimeout(() => setLetterVisible(true), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen" style={{ background: "#E8E2D9" }}>
      <Nav
        theme="dark"
        mounted={mounted}
        position="absolute"
        links={[
          { href: "/", label: "Home" },
          { href: "/beginnings", label: "Beginnings" },
          { href: "/journal", label: "Journal" },
          { href: "/about", label: "About" },
          { href: "/approach", label: "Approach", active: true },
          { href: "/begin-your-story", label: "Begin Your Story" },
        ]}
      />

      {/* Hidden SVG filters */}
      <svg aria-hidden="true" style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}>
        <defs>
          <filter id="deckle-letter" x="-3%" y="-3%" width="106%" height="106%">
            <feTurbulence type="fractalNoise" baseFrequency="0.032" numOctaves="4" seed="12" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      {/* Page wrapper */}
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-32 md:py-40">

        {/* Eyebrow */}
        <div
          style={{
            transition: "opacity 700ms ease-out 200ms, transform 700ms ease-out 200ms",
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(10px)",
          }}
          className="mb-10 text-center"
        >
          <p className="font-sans uppercase tracking-[0.36em] text-[8px] md:text-[9px] text-[#3A342C]/40">
            ✦ &nbsp; How We Work &nbsp; ✦
          </p>
        </div>

        {/* Letter card */}
        <div
          style={{
            filter: "url(#deckle-letter)",
            transition: "opacity 1000ms ease-out 400ms, transform 1000ms ease-out 400ms",
            opacity: letterVisible ? 1 : 0,
            transform: letterVisible ? "translateY(0) rotate(-0.6deg)" : "translateY(24px) rotate(-0.6deg)",
            maxWidth: "680px",
            width: "100%",
            boxShadow: [
              "0 4px 12px rgba(30,22,12,0.10)",
              "0 12px 40px rgba(30,22,12,0.13)",
              "0 32px 80px rgba(30,22,12,0.10)",
            ].join(", "),
          }}
        >
          <div
            className="relative overflow-hidden"
            style={{
              background: "#FAF6EE",
              padding: "clamp(36px, 8vw, 64px) clamp(32px, 7vw, 72px)",
            }}
          >

            {/* Paper grain overlay */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)'/%3E%3C/svg%3E")`,
                opacity: 0.055,
                mixBlendMode: "multiply",
              }}
            />

            {/* Ruled lines */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: "repeating-linear-gradient(to bottom, transparent, transparent 31px, rgba(58,52,44,0.07) 31px, rgba(58,52,44,0.07) 32px)",
                backgroundPositionY: "72px",
              }}
            />

            {/* Red margin line */}
            <div
              className="absolute top-0 bottom-0 pointer-events-none hidden md:block"
              style={{ left: "clamp(32px, 7vw, 72px)", width: "1px", background: "rgba(180,80,80,0.13)" }}
            />

            {/* Letter content */}
            <div className="relative z-10" style={{ fontFamily: "'Caveat', cursive" }}>

              {/* Date + location */}
              <p
                className="text-right mb-8 md:mb-10"
                style={{ fontSize: "clamp(15px, 3vw, 18px)", color: "rgba(58,52,44,0.45)", lineHeight: 1.4 }}
              >
                Hyderabad, India
              </p>

              {/* Salutation */}
              <p
                className="mb-6 md:mb-8"
                style={{ fontSize: "clamp(19px, 4vw, 24px)", color: "#3A342C", lineHeight: 1.5 }}
              >
                Dear friend,
              </p>

              {/* Body */}
              <div
                style={{
                  fontSize: "clamp(17px, 3.5vw, 21px)",
                  color: "rgba(58,52,44,0.82)",
                  lineHeight: 1.85,
                  display: "flex",
                  flexDirection: "column",
                  gap: "clamp(18px, 4vw, 28px)",
                }}
              >
                <p>
                  Before your wedding, we want to be your friends — not your vendors. We'll learn your
                  family, figure out who the loud uncle is, and quietly plan around him.
                </p>

                <p>
                  On the day itself, you won't always know where we are.
                  <br />
                  <span style={{ color: "rgba(58,52,44,0.5)", fontStyle: "italic" }}>That's intentional.</span>
                </p>

                <p>
                  We'll probably be in the corner catching your grandmother watching you from across
                  the mandap. Or near the entrance, the moment your partner sees you for the very first time.
                </p>

                <p>
                  We won't ask you to pose if you hate it. We <em>will</em> ask you weird questions mid-ritual
                  just to make you laugh when the nerves spiral. And yes — we will absolutely sneak you away
                  from your loudest relatives for five quiet minutes alone.
                </p>

                <p>
                  We might cry a little. We'll probably laugh a lot.
                  We might even end up on the dance floor — not because we planned to,
                  but because sometimes that's what it takes for you to forget we're there at all.
                </p>

                <p>
                  And somewhere in all of that, quietly and without any fuss, we'll become that
                  irreplaceable thing you didn't know you needed — the people who saw your day
                  the way you couldn't, and gave it back to you in a way that feels like magic.
                </p>
              </div>

              {/* Closing */}
              <div className="mt-10 md:mt-14">
                <p style={{ fontSize: "clamp(17px, 3.5vw, 21px)", color: "rgba(58,52,44,0.7)", lineHeight: 1.6 }}>
                  With love,
                </p>
                <p
                  className="mt-1"
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontStyle: "italic",
                    fontSize: "clamp(22px, 5vw, 32px)",
                    color: "#3A342C",
                    letterSpacing: "0.02em",
                  }}
                >
                  Evermor Tales
                </p>
              </div>

              {/* Postmark stamp — decorative */}
              <div
                className="absolute top-6 right-6 md:top-10 md:right-10 flex flex-col items-center justify-center"
                style={{
                  width: 52,
                  height: 52,
                  border: "1.5px dashed rgba(58,52,44,0.2)",
                  borderRadius: 2,
                }}
              >
                <p style={{ fontFamily: "'Caveat', cursive", fontSize: 7, color: "rgba(58,52,44,0.25)", textAlign: "center", lineHeight: 1.4, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Evermor<br />Tales
                </p>
              </div>

            </div>
          </div>
        </div>

        {/* CTA below letter */}
        <div
          style={{
            transition: "opacity 800ms ease-out 900ms, transform 800ms ease-out 900ms",
            opacity: letterVisible ? 1 : 0,
            transform: letterVisible ? "translateY(0)" : "translateY(12px)",
          }}
          className="mt-12 text-center"
        >
          <p
            className="font-sans text-[12px] md:text-[13px] text-[#3A342C]/45 tracking-[0.08em] mb-5"
          >
            If this feels like you —
          </p>
          <Link
            href="/begin-your-story"
            className="font-sans text-[11px] uppercase tracking-[0.28em] text-[#3A342C]/70 border-b border-[#3A342C]/25 pb-0.5 hover:text-[#3A342C] hover:border-[#3A342C]/50 transition-colors duration-300"
          >
            Begin Your Story
          </Link>
        </div>

      </div>
    </div>
  );
}
