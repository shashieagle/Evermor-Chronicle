// Variant B — "The Sequence": editorial magazine rhythm. Pace builds as you scroll.
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
const bg = "#EAE3D3";
const ink = "#3A342C";

function Cap({ n }: { n: number }) {
  return <p style={{ ...sans, fontSize: 11, color: `${ink}50`, letterSpacing: "0.04em", fontStyle: "italic", textAlign: "center", marginTop: 8 }}>{n}</p>;
}

export function Sequence() {
  return (
    <div style={{ background: bg, color: ink, minHeight: "100vh" }}>
      {/* Label */}
      <div style={{ ...sans, fontSize: 11, letterSpacing: "0.28em", textTransform: "uppercase", color: `${ink}55`, padding: "28px 40px 0" }}>
        B — The Sequence
      </div>

      {/* 1 — Full-bleed hero */}
      <div style={{ margin: "32px 0 0" }}>
        <img src={imgs[0]} alt="" style={{ width: "100%", height: 500, objectFit: "cover", display: "block" }} />
        <Cap n={1} />
      </div>

      {/* 2–3–4 — Three columns, tighter */}
      <div style={{ display: "flex", gap: 3, margin: "3px 0" }}>
        {[1,2,3].map(i => (
          <div key={i} style={{ flex: 1 }}>
            <img src={imgs[i]} alt="" style={{ width: "100%", height: 280, objectFit: "cover", display: "block" }} />
            <Cap n={i + 1} />
          </div>
        ))}
      </div>

      {/* 5 wide + 6 portrait */}
      <div style={{ display: "flex", gap: 3, margin: "3px 0" }}>
        <div style={{ flex: 2 }}>
          <img src={imgs[4]} alt="" style={{ width: "100%", height: 360, objectFit: "cover", display: "block" }} />
          <Cap n={5} />
        </div>
        <div style={{ flex: 1 }}>
          <img src={imgs[5]} alt="" style={{ width: "100%", height: 360, objectFit: "cover", display: "block" }} />
          <Cap n={6} />
        </div>
      </div>

      {/* 7 — Full-bleed */}
      <div style={{ margin: "3px 0" }}>
        <img src={imgs[6]} alt="" style={{ width: "100%", height: 420, objectFit: "cover", display: "block" }} />
        <Cap n={7} />
      </div>

      {/* Pause */}
      <div style={{ padding: "56px 80px", background: "#F8F6F2", textAlign: "center" }}>
        <p style={{ ...serif, fontSize: 22, fontStyle: "italic", color: `${ink}60`, lineHeight: 1.6, maxWidth: 460, margin: "0 auto" }}>
          The pace changes when the story needs it to.
        </p>
      </div>

      {/* 8–9 — Equal pair */}
      <div style={{ display: "flex", gap: 3 }}>
        {[7,8].map(i => (
          <div key={i} style={{ flex: 1 }}>
            <img src={imgs[i]} alt="" style={{ width: "100%", height: 340, objectFit: "cover", display: "block" }} />
            <Cap n={i + 1} />
          </div>
        ))}
      </div>

      {/* 10–11–12 — Three columns */}
      <div style={{ display: "flex", gap: 3, margin: "3px 0" }}>
        {[9,10,11].map(i => (
          <div key={i} style={{ flex: 1 }}>
            <img src={imgs[i]} alt="" style={{ width: "100%", height: 260, objectFit: "cover", display: "block" }} />
            <Cap n={i + 1} />
          </div>
        ))}
      </div>

      {/* 13 — Centred portrait, narrow column */}
      <div style={{ padding: "32px 200px 0" }}>
        <img src={imgs[12]} alt="" style={{ width: "100%", height: 420, objectFit: "cover", display: "block" }} />
        <Cap n={13} />
      </div>

      {/* Pause */}
      <div style={{ padding: "56px 80px", background: "#F8F6F2", textAlign: "center" }}>
        <p style={{ ...serif, fontSize: 22, fontStyle: "italic", color: `${ink}60`, lineHeight: 1.6, maxWidth: 460, margin: "0 auto" }}>
          Some frames ask you to stop.
        </p>
      </div>

      {/* 14 wide + 15 square */}
      <div style={{ display: "flex", gap: 3 }}>
        <div style={{ flex: 3 }}>
          <img src={imgs[13]} alt="" style={{ width: "100%", height: 340, objectFit: "cover", display: "block" }} />
          <Cap n={14} />
        </div>
        <div style={{ flex: 2 }}>
          <img src={imgs[14]} alt="" style={{ width: "100%", height: 340, objectFit: "cover", display: "block" }} />
          <Cap n={15} />
        </div>
      </div>

      {/* 16 — Full-bleed */}
      <div style={{ margin: "3px 0" }}>
        <img src={imgs[15]} alt="" style={{ width: "100%", height: 400, objectFit: "cover", display: "block" }} />
        <Cap n={16} />
      </div>

      {/* 17–18 — Paired */}
      <div style={{ display: "flex", gap: 3, margin: "3px 0" }}>
        {[16,17].map(i => (
          <div key={i} style={{ flex: 1 }}>
            <img src={imgs[i]} alt="" style={{ width: "100%", height: 320, objectFit: "cover", display: "block" }} />
            <Cap n={i + 1} />
          </div>
        ))}
      </div>

      {/* 19–20 — Final pair with closing label */}
      <div style={{ display: "flex", gap: 3, margin: "3px 0" }}>
        {[18,19].map(i => (
          <div key={i} style={{ flex: 1 }}>
            <img src={imgs[i]} alt="" style={{ width: "100%", height: 320, objectFit: "cover", display: "block" }} />
            <Cap n={i + 1} />
          </div>
        ))}
      </div>

      <div style={{ padding: "80px 0", textAlign: "center" }}>
        <p style={{ ...serif, fontSize: 18, fontStyle: "italic", color: `${ink}40` }}>— End —</p>
      </div>
    </div>
  );
}
