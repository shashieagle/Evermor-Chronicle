// Variant A — "The Breath": slow, cinematic. Every image breathes alone.
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
const bg = "#F5F0E8";
const ink = "#3A342C";

export function Breath() {
  return (
    <div style={{ background: bg, color: ink, minHeight: "100vh" }}>
      {/* Label */}
      <div style={{ ...sans, fontSize: 11, letterSpacing: "0.28em", textTransform: "uppercase", color: `${ink}55`, padding: "28px 40px 0", opacity: 0.7 }}>
        A — The Breath
      </div>

      {/* 1 — Full-bleed solo */}
      <div style={{ margin: "32px 0 0" }}>
        <img src={imgs[0]} alt="" style={{ width: "100%", height: 520, objectFit: "cover", display: "block" }} />
        <p style={{ ...sans, fontSize: 11, color: `${ink}50`, letterSpacing: "0.04em", fontStyle: "italic", textAlign: "center", marginTop: 10 }}>1</p>
      </div>

      {/* 2–3 — Paired verticals */}
      <div style={{ display: "flex", gap: 4, margin: "4px 0" }}>
        <div style={{ flex: 1 }}>
          <img src={imgs[1]} alt="" style={{ width: "100%", height: 440, objectFit: "cover", display: "block" }} />
          <p style={{ ...sans, fontSize: 11, color: `${ink}50`, letterSpacing: "0.04em", fontStyle: "italic", textAlign: "center", marginTop: 8 }}>2</p>
        </div>
        <div style={{ flex: 1 }}>
          <img src={imgs[2]} alt="" style={{ width: "100%", height: 440, objectFit: "cover", display: "block" }} />
          <p style={{ ...sans, fontSize: 11, color: `${ink}50`, letterSpacing: "0.04em", fontStyle: "italic", textAlign: "center", marginTop: 8 }}>3</p>
        </div>
      </div>

      {/* Pause */}
      <div style={{ padding: "72px 80px", textAlign: "center" }}>
        <p style={{ ...serif, fontSize: 22, fontStyle: "italic", color: `${ink}60`, lineHeight: 1.6, maxWidth: 480, margin: "0 auto" }}>
          Every image holds still for as long as it needs to.
        </p>
      </div>

      {/* 4 — Full-bleed, shorter */}
      <div>
        <img src={imgs[3]} alt="" style={{ width: "100%", height: 400, objectFit: "cover", display: "block" }} />
        <p style={{ ...sans, fontSize: 11, color: `${ink}50`, letterSpacing: "0.04em", fontStyle: "italic", textAlign: "center", marginTop: 10 }}>4</p>
      </div>

      {/* 5–6 — Paired with side margins */}
      <div style={{ display: "flex", gap: 4, margin: "4px 40px" }}>
        <div style={{ flex: 1 }}>
          <img src={imgs[4]} alt="" style={{ width: "100%", height: 380, objectFit: "cover", display: "block" }} />
          <p style={{ ...sans, fontSize: 11, color: `${ink}50`, letterSpacing: "0.04em", fontStyle: "italic", textAlign: "center", marginTop: 8 }}>5</p>
        </div>
        <div style={{ flex: 1 }}>
          <img src={imgs[5]} alt="" style={{ width: "100%", height: 380, objectFit: "cover", display: "block" }} />
          <p style={{ ...sans, fontSize: 11, color: `${ink}50`, letterSpacing: "0.04em", fontStyle: "italic", textAlign: "center", marginTop: 8 }}>6</p>
        </div>
      </div>

      {/* 7 — Centred portrait, narrow */}
      <div style={{ padding: "48px 160px 0" }}>
        <img src={imgs[6]} alt="" style={{ width: "100%", height: 480, objectFit: "cover", display: "block" }} />
        <p style={{ ...sans, fontSize: 11, color: `${ink}50`, letterSpacing: "0.04em", fontStyle: "italic", textAlign: "center", marginTop: 10 }}>7</p>
      </div>

      {/* Pause */}
      <div style={{ padding: "72px 80px", textAlign: "center" }}>
        <p style={{ ...serif, fontSize: 22, fontStyle: "italic", color: `${ink}60`, lineHeight: 1.6, maxWidth: 480, margin: "0 auto" }}>
          The quieter the image, the louder the memory.
        </p>
      </div>

      {/* 8–9–10 — Three columns */}
      <div style={{ display: "flex", gap: 4 }}>
        {[imgs[7], imgs[8], imgs[9]].map((src, i) => (
          <div key={i} style={{ flex: 1 }}>
            <img src={src} alt="" style={{ width: "100%", height: 300, objectFit: "cover", display: "block" }} />
            <p style={{ ...sans, fontSize: 11, color: `${ink}50`, letterSpacing: "0.04em", fontStyle: "italic", textAlign: "center", marginTop: 8 }}>{8 + i}</p>
          </div>
        ))}
      </div>

      {/* 11 — Full-bleed */}
      <div style={{ margin: "4px 0" }}>
        <img src={imgs[10]} alt="" style={{ width: "100%", height: 420, objectFit: "cover", display: "block" }} />
        <p style={{ ...sans, fontSize: 11, color: `${ink}50`, letterSpacing: "0.04em", fontStyle: "italic", textAlign: "center", marginTop: 10 }}>11</p>
      </div>

      {/* 12–13 — Paired */}
      <div style={{ display: "flex", gap: 4, margin: "4px 0" }}>
        {[imgs[11], imgs[12]].map((src, i) => (
          <div key={i} style={{ flex: 1 }}>
            <img src={src} alt="" style={{ width: "100%", height: 360, objectFit: "cover", display: "block" }} />
            <p style={{ ...sans, fontSize: 11, color: `${ink}50`, letterSpacing: "0.04em", fontStyle: "italic", textAlign: "center", marginTop: 8 }}>{12 + i}</p>
          </div>
        ))}
      </div>

      {/* 14 — Solo wide, padded */}
      <div style={{ padding: "48px 80px 0" }}>
        <img src={imgs[13]} alt="" style={{ width: "100%", height: 380, objectFit: "cover", display: "block" }} />
        <p style={{ ...sans, fontSize: 11, color: `${ink}50`, letterSpacing: "0.04em", fontStyle: "italic", textAlign: "center", marginTop: 10 }}>14</p>
      </div>

      {/* 15–16 — Paired */}
      <div style={{ display: "flex", gap: 4, margin: "48px 0 0" }}>
        {[imgs[14], imgs[15]].map((src, i) => (
          <div key={i} style={{ flex: 1 }}>
            <img src={src} alt="" style={{ width: "100%", height: 360, objectFit: "cover", display: "block" }} />
            <p style={{ ...sans, fontSize: 11, color: `${ink}50`, letterSpacing: "0.04em", fontStyle: "italic", textAlign: "center", marginTop: 8 }}>{15 + i}</p>
          </div>
        ))}
      </div>

      {/* 17 — Full-bleed */}
      <div style={{ margin: "4px 0" }}>
        <img src={imgs[16]} alt="" style={{ width: "100%", height: 440, objectFit: "cover", display: "block" }} />
        <p style={{ ...sans, fontSize: 11, color: `${ink}50`, letterSpacing: "0.04em", fontStyle: "italic", textAlign: "center", marginTop: 10 }}>17</p>
      </div>

      {/* 18–19–20 — Three columns */}
      <div style={{ display: "flex", gap: 4, margin: "4px 0" }}>
        {[imgs[17], imgs[18], imgs[19]].map((src, i) => (
          <div key={i} style={{ flex: 1 }}>
            <img src={src} alt="" style={{ width: "100%", height: 300, objectFit: "cover", display: "block" }} />
            <p style={{ ...sans, fontSize: 11, color: `${ink}50`, letterSpacing: "0.04em", fontStyle: "italic", textAlign: "center", marginTop: 8 }}>{18 + i}</p>
          </div>
        ))}
      </div>

      <div style={{ padding: "80px 0", textAlign: "center" }}>
        <p style={{ ...serif, fontSize: 18, fontStyle: "italic", color: `${ink}40` }}>— End —</p>
      </div>
    </div>
  );
}
