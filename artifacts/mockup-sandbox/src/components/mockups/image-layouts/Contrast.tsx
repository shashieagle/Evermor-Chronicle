// C — The Contrast: dramatic size contrast, vertical vs horizontal
const imgs = [
  "/__mockup/images/img1.jpg","/__mockup/images/img2.jpg","/__mockup/images/img3.jpg",
  "/__mockup/images/img4.jpg","/__mockup/images/img5.jpg","/__mockup/images/img6.jpg",
  "/__mockup/images/img7.jpg","/__mockup/images/img8.jpg","/__mockup/images/img9.jpg",
  "/__mockup/images/img10.jpg","/__mockup/images/img11.jpg","/__mockup/images/img12.jpg",
  "/__mockup/images/img1.jpg","/__mockup/images/img2.jpg","/__mockup/images/img3.jpg",
  "/__mockup/images/img4.jpg","/__mockup/images/img5.jpg","/__mockup/images/img6.jpg",
  "/__mockup/images/img7.jpg","/__mockup/images/img8.jpg",
];
const serif = { fontFamily: "'Cormorant Garamond','Playfair Display',Georgia,serif" };
const sans  = { fontFamily: "'Inter',sans-serif" };
const bg = "#F8F6F2"; const ink = "#3A342C";
const pause = (text: string) => (
  <div style={{ padding:"72px 80px", background:"#EAE3D3", textAlign:"center" }}>
    <p style={{ ...serif, fontSize:24, fontStyle:"italic", color:`${ink}60`, lineHeight:1.6, maxWidth:440, margin:"0 auto" }}>{text}</p>
  </div>
);

export function Contrast() {
  return (
    <div style={{ background:bg, color:ink }}>
      <div style={{ ...sans, fontSize:11, letterSpacing:"0.28em", textTransform:"uppercase", color:`${ink}66`, padding:"28px 40px 0" }}>C — The Contrast</div>

      {/* 1 — Giant horizontal */}
      <div style={{ marginTop:32 }}>
        <img src={imgs[0]} alt="1" style={{ width:"100%", height:540, objectFit:"cover", display:"block" }} />
      </div>

      {/* 2–3–4 — Three verticals */}
      <div style={{ display:"flex", gap:4, marginTop:4 }}>
        <img src={imgs[1]} alt="2" style={{ flex:1, height:800, objectFit:"cover", objectPosition:"top", display:"block" }} />
        <img src={imgs[2]} alt="3" style={{ flex:1, height:800, objectFit:"cover", objectPosition:"top", display:"block" }} />
        <img src={imgs[3]} alt="4" style={{ flex:1, height:800, objectFit:"cover", objectPosition:"top", display:"block" }} />
      </div>

      {/* 5 — Giant horizontal */}
      <div style={{ marginTop:4 }}>
        <img src={imgs[4]} alt="5" style={{ width:"100%", height:520, objectFit:"cover", display:"block" }} />
      </div>

      {pause("Scale is a feeling. So is intimacy.")}

      {/* 6 — Giant horizontal */}
      <div>
        <img src={imgs[5]} alt="6" style={{ width:"100%", height:560, objectFit:"cover", display:"block" }} />
      </div>

      {/* 7–8 — Two verticals */}
      <div style={{ display:"flex", gap:4, marginTop:4 }}>
        <img src={imgs[6]} alt="7" style={{ flex:1, height:820, objectFit:"cover", objectPosition:"top", display:"block" }} />
        <img src={imgs[7]} alt="8" style={{ flex:1, height:820, objectFit:"cover", objectPosition:"top", display:"block" }} />
      </div>

      {/* 9 — Horizontal */}
      <div style={{ marginTop:4 }}>
        <img src={imgs[8]} alt="9" style={{ width:"100%", height:500, objectFit:"cover", display:"block" }} />
      </div>

      {/* 10 — Single vertical narrow left */}
      <div style={{ display:"flex", gap:4, marginTop:4 }}>
        <img src={imgs[9]} alt="10" style={{ width:"34%", height:860, objectFit:"cover", objectPosition:"top", display:"block" }} />
        <div style={{ flex:1, display:"flex", flexDirection:"column", gap:4 }}>
          <img src={imgs[10]} alt="11" style={{ width:"100%", height:426, objectFit:"cover", display:"block" }} />
          <img src={imgs[11]} alt="12" style={{ width:"100%", height:426, objectFit:"cover", display:"block" }} />
        </div>
      </div>

      {pause("What stays is not the day. It is the way the light fell.")}

      {/* 13 — Horizontal full-bleed */}
      <div>
        <img src={imgs[12]} alt="13" style={{ width:"100%", height:540, objectFit:"cover", display:"block" }} />
      </div>

      {/* 14–15 — Vertical pair */}
      <div style={{ display:"flex", gap:4, marginTop:4 }}>
        <img src={imgs[13]} alt="14" style={{ flex:1, height:800, objectFit:"cover", objectPosition:"top", display:"block" }} />
        <img src={imgs[14]} alt="15" style={{ flex:1, height:800, objectFit:"cover", objectPosition:"top", display:"block" }} />
      </div>

      {/* 16 — Horizontal */}
      <div style={{ marginTop:4 }}>
        <img src={imgs[15]} alt="16" style={{ width:"100%", height:520, objectFit:"cover", display:"block" }} />
      </div>

      {/* 17–18–19 — Three verticals */}
      <div style={{ display:"flex", gap:4, marginTop:4 }}>
        <img src={imgs[16]} alt="17" style={{ flex:1, height:780, objectFit:"cover", objectPosition:"top", display:"block" }} />
        <img src={imgs[17]} alt="18" style={{ flex:1, height:780, objectFit:"cover", objectPosition:"top", display:"block" }} />
        <img src={imgs[18]} alt="19" style={{ flex:1, height:780, objectFit:"cover", objectPosition:"top", display:"block" }} />
      </div>

      {/* 20 — Closing horizontal */}
      <div style={{ marginTop:4 }}>
        <img src={imgs[19]} alt="20" style={{ width:"100%", height:540, objectFit:"cover", display:"block" }} />
      </div>

      <div style={{ padding:"80px 0", textAlign:"center" }}>
        <p style={{ ...serif, fontSize:18, fontStyle:"italic", color:`${ink}40` }}>— End —</p>
      </div>
    </div>
  );
}
