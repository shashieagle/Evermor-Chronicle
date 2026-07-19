// Variant C — "The Contrast": alternating giant/small for dramatic visual pacing.
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
const bg = "#F8F6F2";
const ink = "#3A342C";

function Cap({ n }: { n: number }) {
  return <p style={{ ...sans, fontSize: 11, color: `${ink}50`, letterSpacing: "0.04em", fontStyle: "italic", textAlign: "center", marginTop: 6 }}>{n}</p>;
}

function Strip({ start, offset }: { start: number; offset: number }) {
  return (
    <div style={{ display: "flex", gap: 3, margin: "3px 0" }}>
      {[0,1,2,3].map(i => (
        <div key={i} style={{ flex: 1 }}>
          <img src={imgs[(start + i) % imgs.length]} alt="" style={{ width: "100%", height: 200, objectFit: "cover", display: "block" }} />
          <Cap n={offset + i} />
        </div>
      ))}
    </div>
  );
}

export function Contrast() {
  return (
    <div style={{ background: bg, color: ink, minHeight: "100vh" }}>
      {/* Label */}
      <div style={{ ...sans, fontSize: 11, letterSpacing: "0.28em", textTransform: "uppercase", color: `${ink}55`, padding: "28px 40px 0" }}>
        C — The Contrast
      </div>

      {/* 1 — Giant full-bleed */}
      <div style={{ margin: "32px 0 0" }}>
        <img src={imgs[0]} alt="" style={{ width: "100%", height: 560, objectFit: "cover", display: "block" }} />
        <Cap n={1} />
      </div>

      {/* 2–3–4–5 — Four small */}
      <Strip start={1} offset={2} />

      {/* 6 — Giant full-bleed */}
      <div style={{ margin: "3px 0" }}>
        <img src={imgs[5]} alt="" style={{ width: "100%", height: 520, objectFit: "cover", display: "block" }} />
        <Cap n={6} />
      </div>

      {/* 7–8–9–10 — Four small */}
      <Strip start={6} offset={7} />

      {/* Pause */}
      <div style={{ padding: "60px 80px", background: "#EAE3D3", textAlign: "center" }}>
        <p style={{ ...serif, fontSize: 22, fontStyle: "italic", color: `${ink}60`, lineHeight: 1.6, maxWidth: 440, margin: "0 auto" }}>
          Scale is a feeling. So is intimacy.
        </p>
      </div>

      {/* 11 — Giant centred portrait */}
      <div style={{ padding: "0 120px" }}>
        <img src={imgs[10]} alt="" style={{ width: "100%", height: 520, objectFit: "cover", display: "block" }} />
        <Cap n={11} />
      </div>

      {/* 12–13–14–15 — Four small */}
      <Strip start={11} offset={12} />

      {/* 16 — Giant full-bleed */}
      <div style={{ margin: "3px 0" }}>
        <img src={imgs[15]} alt="" style={{ width: "100%", height: 500, objectFit: "cover", display: "block" }} />
        <Cap n={16} />
      </div>

      {/* 17–18–19–20 — Four small closing */}
      <Strip start={16} offset={17} />

      <div style={{ padding: "80px 0", textAlign: "center" }}>
        <p style={{ ...serif, fontSize: 18, fontStyle: "italic", color: `${ink}40` }}>— End —</p>
      </div>
    </div>
  );
}
