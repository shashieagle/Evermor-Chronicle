// Variant A — "The Breath": slow, cinematic. All images are large.
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
const sans  = { fontFamily: "'Inter', sans-serif" };
const bg    = "#F5F0E8";
const ink   = "#3A342C";

export function Breath() {
  return (
    <div style={{ background: bg, color: ink }}>
      <div style={{ ...sans, fontSize: 11, letterSpacing: "0.28em", textTransform: "uppercase", color: `${ink}66`, padding: "28px 40px 0" }}>A — The Breath</div>

      {/* 1 — Full-bleed, very tall */}
      <div style={{ marginTop: 32 }}>
        <img src={imgs[0]} alt="1" style={{ width: "100%", height: 780, objectFit: "cover", display: "block" }} />
      </div>

      {/* Pause */}
      <div style={{ padding: "80px 80px", textAlign: "center" }}>
        <p style={{ ...serif, fontSize: 24, fontStyle: "italic", color: `${ink}60`, lineHeight: 1.6, maxWidth: 480, margin: "0 auto" }}>Every image holds still for as long as it needs to.</p>
      </div>

      {/* 2–3 — Paired tall verticals, edge to edge */}
      <div style={{ display: "flex", gap: 4 }}>
        <img src={imgs[1]} alt="2" style={{ flex: 1, height: 680, objectFit: "cover", display: "block" }} />
        <img src={imgs[2]} alt="3" style={{ flex: 1, height: 680, objectFit: "cover", display: "block" }} />
      </div>

      {/* 4 — Full-bleed */}
      <div style={{ marginTop: 4 }}>
        <img src={imgs[3]} alt="4" style={{ width: "100%", height: 700, objectFit: "cover", display: "block" }} />
      </div>

      {/* Pause */}
      <div style={{ padding: "80px 80px", textAlign: "center" }}>
        <p style={{ ...serif, fontSize: 24, fontStyle: "italic", color: `${ink}60`, lineHeight: 1.6, maxWidth: 480, margin: "0 auto" }}>The quieter the image, the louder the memory.</p>
      </div>

      {/* 5 — Wide landscape, padded sides */}
      <div style={{ padding: "0 60px" }}>
        <img src={imgs[4]} alt="5" style={{ width: "100%", height: 580, objectFit: "cover", display: "block" }} />
      </div>

      {/* 6–7 — Paired tall */}
      <div style={{ display: "flex", gap: 4, marginTop: 4 }}>
        <img src={imgs[5]} alt="6" style={{ flex: 1, height: 660, objectFit: "cover", display: "block" }} />
        <img src={imgs[6]} alt="7" style={{ flex: 1, height: 660, objectFit: "cover", display: "block" }} />
      </div>

      {/* 8 — Full-bleed */}
      <div style={{ marginTop: 4 }}>
        <img src={imgs[7]} alt="8" style={{ width: "100%", height: 720, objectFit: "cover", display: "block" }} />
      </div>

      {/* 9 — Portrait, narrow centred */}
      <div style={{ padding: "48px 180px 0" }}>
        <img src={imgs[8]} alt="9" style={{ width: "100%", height: 640, objectFit: "cover", display: "block" }} />
      </div>

      {/* Pause */}
      <div style={{ padding: "80px 80px", textAlign: "center" }}>
        <p style={{ ...serif, fontSize: 24, fontStyle: "italic", color: `${ink}60`, lineHeight: 1.6, maxWidth: 480, margin: "0 auto" }}>Some frames ask you to be still with them.</p>
      </div>

      {/* 10–11 — Paired tall */}
      <div style={{ display: "flex", gap: 4 }}>
        <img src={imgs[9]}  alt="10" style={{ flex: 1, height: 660, objectFit: "cover", display: "block" }} />
        <img src={imgs[10]} alt="11" style={{ flex: 1, height: 660, objectFit: "cover", display: "block" }} />
      </div>

      {/* 12 — Full-bleed */}
      <div style={{ marginTop: 4 }}>
        <img src={imgs[11]} alt="12" style={{ width: "100%", height: 700, objectFit: "cover", display: "block" }} />
      </div>

      {/* 13–14 — Paired */}
      <div style={{ display: "flex", gap: 4, marginTop: 4 }}>
        <img src={imgs[12]} alt="13" style={{ flex: 1, height: 620, objectFit: "cover", display: "block" }} />
        <img src={imgs[13]} alt="14" style={{ flex: 1, height: 620, objectFit: "cover", display: "block" }} />
      </div>

      {/* 15 — Full-bleed tall */}
      <div style={{ marginTop: 4 }}>
        <img src={imgs[14]} alt="15" style={{ width: "100%", height: 740, objectFit: "cover", display: "block" }} />
      </div>

      {/* 16–17 — Paired */}
      <div style={{ display: "flex", gap: 4, marginTop: 4 }}>
        <img src={imgs[15]} alt="16" style={{ flex: 1, height: 640, objectFit: "cover", display: "block" }} />
        <img src={imgs[16]} alt="17" style={{ flex: 1, height: 640, objectFit: "cover", display: "block" }} />
      </div>

      {/* 18 — Wide, padded */}
      <div style={{ padding: "48px 60px 0" }}>
        <img src={imgs[17]} alt="18" style={{ width: "100%", height: 580, objectFit: "cover", display: "block" }} />
      </div>

      {/* 19–20 — Paired closing */}
      <div style={{ display: "flex", gap: 4, marginTop: 4 }}>
        <img src={imgs[18]} alt="19" style={{ flex: 1, height: 660, objectFit: "cover", display: "block" }} />
        <img src={imgs[19]} alt="20" style={{ flex: 1, height: 660, objectFit: "cover", display: "block" }} />
      </div>

      <div style={{ padding: "80px 0", textAlign: "center" }}>
        <p style={{ ...serif, fontSize: 18, fontStyle: "italic", color: `${ink}40` }}>— End —</p>
      </div>
    </div>
  );
}
