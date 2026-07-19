// Variant D — HOTC Reference: contained images, warm frame, alternating singles and pairs.
// Key observation: images never go full-bleed. The background shows as a consistent
// warm margin/frame around every image. Singles at ~80% width, pairs at ~47% each.
const imgs = [
  "/__mockup/images/img1.jpg","/__mockup/images/img2.jpg","/__mockup/images/img3.jpg",
  "/__mockup/images/img4.jpg","/__mockup/images/img5.jpg","/__mockup/images/img6.jpg",
  "/__mockup/images/img7.jpg","/__mockup/images/img8.jpg","/__mockup/images/img9.jpg",
  "/__mockup/images/img10.jpg","/__mockup/images/img11.jpg","/__mockup/images/img12.jpg",
  "/__mockup/images/img1.jpg","/__mockup/images/img2.jpg","/__mockup/images/img3.jpg",
  "/__mockup/images/img4.jpg","/__mockup/images/img5.jpg","/__mockup/images/img6.jpg",
  "/__mockup/images/img7.jpg","/__mockup/images/img8.jpg",
];

const serif = { fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif" };
const sans = { fontFamily: "'Inter', sans-serif" };
const bg = "#EDE8E0";   // warm cream — the constant frame
const ink = "#2E2820";
const px = 80;          // consistent horizontal margin — the "frame"
const gap = 6;          // gap between paired images

function Single({ src, n, tall }: { src: string; n: number; tall?: boolean }) {
  return (
    <div style={{ padding: `0 ${px}px`, marginBottom: gap }}>
      <img src={src} alt="" style={{ width: "100%", height: tall ? 600 : 480, objectFit: "cover", display: "block" }} />
    </div>
  );
}

function Pair({ a, b, na, nb }: { a: string; b: string; na: number; nb: number }) {
  return (
    <div style={{ display: "flex", gap, padding: `0 ${px}px`, marginBottom: gap }}>
      <img src={a} alt="" style={{ flex: 1, height: 340, objectFit: "cover", display: "block" }} />
      <img src={b} alt="" style={{ flex: 1, height: 340, objectFit: "cover", display: "block" }} />
    </div>
  );
}

function Trio({ a, b, c }: { a: string; b: string; c: string }) {
  return (
    <div style={{ display: "flex", gap, padding: `0 ${px}px`, marginBottom: gap }}>
      {[a, b, c].map((src, i) => (
        <img key={i} src={src} alt="" style={{ flex: 1, height: 260, objectFit: "cover", display: "block" }} />
      ))}
    </div>
  );
}

function Portrait({ src, n }: { src: string; n: number }) {
  // narrow centred portrait — the most intimate moment in the sequence
  return (
    <div style={{ padding: `0 ${px * 2.5}px`, marginBottom: gap }}>
      <img src={src} alt="" style={{ width: "100%", height: 520, objectFit: "cover", objectPosition: "top", display: "block" }} />
    </div>
  );
}

export function Hotc() {
  return (
    <div style={{ background: bg, color: ink, minHeight: "100vh", paddingTop: 40 }}>

      {/* Label */}
      <div style={{ ...sans, fontSize: 11, letterSpacing: "0.28em", textTransform: "uppercase", color: `${ink}88`, padding: `0 ${px}px 32px` }}>
        D — HOTC Reference
      </div>

      {/* Intro text block */}
      <div style={{ textAlign: "center", padding: `0 ${px * 2}px`, marginBottom: 40 }}>
        <h1 style={{ ...serif, fontSize: 42, fontWeight: 300, color: ink, margin: "0 0 20px", letterSpacing: "0.01em" }}>
          Couple Name.
        </h1>
        <p style={{ ...sans, fontSize: 13, color: `${ink}88`, lineHeight: 1.8, margin: "0 0 16px", maxWidth: 560, marginLeft: "auto", marginRight: "auto" }}>
          Editorial opening copy sits here — two or three sentences. Warm, personal, setting the scene before the first image arrives.
        </p>
        <p style={{ ...sans, fontSize: 12, color: `${ink}55`, lineHeight: 2, letterSpacing: "0.02em" }}>
          Wedding Planned by : Studio Name &nbsp;·&nbsp; Outfits : Designer Name &nbsp;·&nbsp; Venue : Location
        </p>
      </div>

      {/* 1 — Single wide opening image */}
      <Single src={imgs[0]} n={1} tall />

      {/* 2–3 — First pair */}
      <Pair a={imgs[1]} b={imgs[2]} na={2} nb={3} />

      {/* 4 — Single */}
      <Single src={imgs[3]} n={4} />

      {/* 5–6 — Pair */}
      <Pair a={imgs[4]} b={imgs[5]} na={5} nb={6} />

      {/* 7 — Portrait (narrow, centred) */}
      <Portrait src={imgs[6]} n={7} />

      {/* 8–9–10 — Trio */}
      <Trio a={imgs[7]} b={imgs[8]} c={imgs[9]} />

      {/* 11 — Single */}
      <Single src={imgs[10]} n={11} />

      {/* 12–13 — Pair */}
      <Pair a={imgs[11]} b={imgs[12]} na={12} nb={13} />

      {/* 14 — Single tall */}
      <Single src={imgs[13]} n={14} tall />

      {/* 15–16 — Pair */}
      <Pair a={imgs[14]} b={imgs[15]} na={15} nb={16} />

      {/* 17–18–19 — Trio */}
      <Trio a={imgs[16]} b={imgs[17]} c={imgs[18]} />

      {/* 20 — Closing single */}
      <Single src={imgs[19]} n={20} />

      {/* Closing line */}
      <div style={{ textAlign: "center", padding: "60px 0 80px" }}>
        <p style={{ ...serif, fontSize: 18, fontStyle: "italic", color: `${ink}45`, letterSpacing: "0.02em" }}>
          — End —
        </p>
      </div>

    </div>
  );
}
