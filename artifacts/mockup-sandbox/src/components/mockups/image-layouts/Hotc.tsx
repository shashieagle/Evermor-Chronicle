// D — HOTC Reference: framed, vertical + horizontal, consistent side margin
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
const bg = "#EDE8E0"; const ink = "#2E2820";
const px = 60; const gap = 5;

export function Hotc() {
  return (
    <div style={{ background:bg, color:ink, paddingTop:28 }}>
      <div style={{ ...sans, fontSize:11, letterSpacing:"0.28em", textTransform:"uppercase", color:`${ink}88`, padding:`0 ${px}px 32px` }}>D — HOTC Reference</div>

      {/* Intro */}
      <div style={{ textAlign:"center", padding:`0 ${px * 2}px 40px` }}>
        <h1 style={{ ...serif, fontSize:42, fontWeight:300, color:ink, margin:"0 0 20px", letterSpacing:"0.01em" }}>Couple Name.</h1>
        <p style={{ ...sans, fontSize:13, color:`${ink}88`, lineHeight:1.9, maxWidth:560, margin:"0 auto 14px" }}>Editorial opening copy — warm, personal, setting the scene before the first image.</p>
        <p style={{ ...sans, fontSize:12, color:`${ink}55`, lineHeight:2, letterSpacing:"0.02em" }}>Wedding Planned by : Studio &nbsp;·&nbsp; Outfits : Designer &nbsp;·&nbsp; Venue : City</p>
      </div>

      {/* 1 — Horizontal landscape, framed */}
      <div style={{ padding:`0 ${px}px`, marginBottom:gap }}>
        <img src={imgs[0]} alt="1" style={{ width:"100%", height:480, objectFit:"cover", display:"block" }} />
      </div>

      {/* 2–3 — Vertical pair, framed */}
      <div style={{ display:"flex", gap, padding:`0 ${px}px`, marginBottom:gap }}>
        <img src={imgs[1]} alt="2" style={{ flex:1, height:720, objectFit:"cover", objectPosition:"top", display:"block" }} />
        <img src={imgs[2]} alt="3" style={{ flex:1, height:720, objectFit:"cover", objectPosition:"top", display:"block" }} />
      </div>

      {/* 4 — Horizontal landscape, framed */}
      <div style={{ padding:`0 ${px}px`, marginBottom:gap }}>
        <img src={imgs[3]} alt="4" style={{ width:"100%", height:460, objectFit:"cover", display:"block" }} />
      </div>

      {/* 5 — Vertical portrait, very narrow framed */}
      <div style={{ padding:`0 ${px * 3.5}px`, marginBottom:gap }}>
        <img src={imgs[4]} alt="5" style={{ width:"100%", height:760, objectFit:"cover", objectPosition:"top", display:"block" }} />
      </div>

      {/* 6 — Horizontal, framed */}
      <div style={{ padding:`0 ${px}px`, marginBottom:gap }}>
        <img src={imgs[5]} alt="6" style={{ width:"100%", height:460, objectFit:"cover", display:"block" }} />
      </div>

      {/* 7 vertical left + stacked horizontals right, framed */}
      <div style={{ display:"flex", gap, padding:`0 ${px}px`, marginBottom:gap }}>
        <img src={imgs[6]} alt="7" style={{ width:"40%", height:740, objectFit:"cover", objectPosition:"top", display:"block" }} />
        <div style={{ flex:1, display:"flex", flexDirection:"column", gap }}>
          <img src={imgs[7]} alt="8" style={{ width:"100%", height:366, objectFit:"cover", display:"block" }} />
          <img src={imgs[8]} alt="9" style={{ width:"100%", height:366, objectFit:"cover", display:"block" }} />
        </div>
      </div>

      {/* Pause */}
      <div style={{ padding:"72px 80px", textAlign:"center" }}>
        <p style={{ ...serif, fontSize:24, fontStyle:"italic", color:`${ink}55`, lineHeight:1.6, maxWidth:480, margin:"0 auto" }}>Some moments ask only to be witnessed.</p>
      </div>

      {/* 10 — Horizontal, framed */}
      <div style={{ padding:`0 ${px}px`, marginBottom:gap }}>
        <img src={imgs[9]} alt="10" style={{ width:"100%", height:460, objectFit:"cover", display:"block" }} />
      </div>

      {/* 11–12 — Vertical pair, framed */}
      <div style={{ display:"flex", gap, padding:`0 ${px}px`, marginBottom:gap }}>
        <img src={imgs[10]} alt="11" style={{ flex:1, height:720, objectFit:"cover", objectPosition:"top", display:"block" }} />
        <img src={imgs[11]} alt="12" style={{ flex:1, height:720, objectFit:"cover", objectPosition:"top", display:"block" }} />
      </div>

      {/* 13 — Horizontal, framed */}
      <div style={{ padding:`0 ${px}px`, marginBottom:gap }}>
        <img src={imgs[12]} alt="13" style={{ width:"100%", height:440, objectFit:"cover", display:"block" }} />
      </div>

      {/* Stacked horizontals left + vertical right, framed */}
      <div style={{ display:"flex", gap, padding:`0 ${px}px`, marginBottom:gap }}>
        <div style={{ flex:1, display:"flex", flexDirection:"column", gap }}>
          <img src={imgs[13]} alt="14" style={{ width:"100%", height:356, objectFit:"cover", display:"block" }} />
          <img src={imgs[14]} alt="15" style={{ width:"100%", height:356, objectFit:"cover", display:"block" }} />
        </div>
        <img src={imgs[15]} alt="16" style={{ width:"40%", height:716, objectFit:"cover", objectPosition:"top", display:"block" }} />
      </div>

      {/* 17 — Horizontal, framed */}
      <div style={{ padding:`0 ${px}px`, marginBottom:gap }}>
        <img src={imgs[16]} alt="17" style={{ width:"100%", height:460, objectFit:"cover", display:"block" }} />
      </div>

      {/* 18–19 — Vertical pair, framed */}
      <div style={{ display:"flex", gap, padding:`0 ${px}px`, marginBottom:gap }}>
        <img src={imgs[17]} alt="18" style={{ flex:1, height:700, objectFit:"cover", objectPosition:"top", display:"block" }} />
        <img src={imgs[18]} alt="19" style={{ flex:1, height:700, objectFit:"cover", objectPosition:"top", display:"block" }} />
      </div>

      {/* 20 — Closing horizontal, framed */}
      <div style={{ padding:`0 ${px}px`, marginBottom:80 }}>
        <img src={imgs[19]} alt="20" style={{ width:"100%", height:460, objectFit:"cover", display:"block" }} />
      </div>

      <div style={{ textAlign:"center", paddingBottom:80 }}>
        <p style={{ ...serif, fontSize:18, fontStyle:"italic", color:`${ink}40` }}>— End —</p>
      </div>
    </div>
  );
}
