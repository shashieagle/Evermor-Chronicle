import { useState, useRef, useEffect, useCallback } from "react";

const BELIEFS = [
  {
    numeral: "I",
    heading: "Connection over composition.",
    body: "Every wedding is remembered through the people who lived it. Before we create photographs, we take time to understand the relationships and emotions that matter most.",
    img: "/belief1.jpg",
  },
  {
    numeral: "II",
    heading: "Stories before trends.",
    body: "Beautiful imagery may capture attention today, but meaningful stories resonate for generations. We create work that remains timeless long after trends have faded.",
    img: "/belief2.jpg",
  },
  {
    numeral: "III",
    heading: "Discovery before documentation.",
    body: "Every couple is different. Every family carries its own history. Before a single frame is created, we invest time discovering what makes your story uniquely yours.",
    img: "/belief3.jpg",
  },
  {
    numeral: "IV",
    heading: "Craft with purpose.",
    body: "Every photograph, every film, every edit is made intentionally. Craftsmanship is measured not by complexity, but by emotional honesty.",
    img: "/belief4.jpg",
  },
  {
    numeral: "V",
    heading: "Trust before everything.",
    body: "Being invited into one of life's most meaningful moments is a privilege. We carry that responsibility with care, respect, and gratitude throughout the entire journey.",
    img: "/belief5.jpg",
  },
];

// Cube rotation (applied to the cube wrapper) to bring each face forward
const FACE_VIEWS = [
  { x: 0,  y: 0   }, // Front   — Belief I
  { x: 0,  y: -90 }, // Right   — Belief II
  { x: 0,  y: -180}, // Back    — Belief III
  { x: 0,  y: -270}, // Left    — Belief IV
  { x: 90, y: -270}, // Top     — Belief V  (keep Y, add X tilt)
];

// Face placement on the cube
function faceStyle(size: number, transform: string): React.CSSProperties {
  return {
    position: "absolute",
    width: size,
    height: size,
    backfaceVisibility: "hidden",
    WebkitBackfaceVisibility: "hidden",
    transform,
    overflow: "hidden",
  };
}

interface FaceProps {
  belief: typeof BELIEFS[0];
  size: number;
  transform: string;
  contentFlip?: boolean;
  xFlip?: boolean;
}

function BeliefFace({ belief, size, transform, contentFlip, xFlip }: FaceProps) {
  const contentStyle: React.CSSProperties = {
    transform: contentFlip
      ? "rotateY(180deg)"
      : xFlip
      ? "rotateX(180deg)"
      : undefined,
    height: "100%",
    display: "flex",
    flexDirection: "column",
  };

  return (
    <div style={faceStyle(size, transform)}>
      {/* Background image with overlay */}
      <div style={{ position: "absolute", inset: 0 }}>
        <img
          src={belief.img}
          alt=""
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }}
        />
        <div style={{ position: "absolute", inset: 0, background: "rgba(234, 227, 211, 0.88)" }} />
      </div>
      {/* Content */}
      <div style={{ position: "relative", zIndex: 1, ...contentStyle }}>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: `${size * 0.1}px ${size * 0.12}px`,
          }}
        >
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 300,
              fontSize: size * 0.025,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "rgba(58,52,44,0.4)",
              marginBottom: size * 0.05,
            }}
          >
            {belief.numeral}
          </p>
          <h3
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 300,
              fontSize: size * 0.085,
              lineHeight: 1.15,
              letterSpacing: "0.005em",
              color: "#3A342C",
              marginBottom: size * 0.05,
            }}
          >
            {belief.heading}
          </h3>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontWeight: 300,
              fontSize: size * 0.033,
              lineHeight: 1.85,
              letterSpacing: "0.02em",
              color: "rgba(58,52,44,0.6)",
            }}
          >
            {belief.body}
          </p>
        </div>
        {/* Bottom accent line */}
        <div
          style={{
            height: 1,
            margin: `0 ${size * 0.12}px ${size * 0.08}px`,
            background: "rgba(58,52,44,0.15)",
          }}
        />
      </div>
    </div>
  );
}

export default function BeliefCube() {
  const [current, setCurrent] = useState(0);
  const [hovered, setHovered] = useState(false);
  const autoRef = useRef<ReturnType<typeof setInterval>>();
  const [size, setSize] = useState(460);

  // Responsive size
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      setSize(w < 480 ? 300 : w < 768 ? 380 : 460);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const half = size / 2;

  // Auto-rotate
  useEffect(() => {
    if (hovered) return;
    autoRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % BELIEFS.length);
    }, 3200);
    return () => clearInterval(autoRef.current);
  }, [hovered]);

  const go = useCallback((dir: 1 | -1) => {
    setCurrent((c) => (c + dir + BELIEFS.length) % BELIEFS.length);
  }, []);

  const { x, y } = FACE_VIEWS[current];
  const cubeTransform = `rotateX(${x}deg) rotateY(${y}deg)`;

  return (
    <div
      className="flex flex-col items-center"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Perspective wrapper */}
      <div
        style={{
          perspective: `${size * 2.6}px`,
          perspectiveOrigin: "50% 45%",
          width: size,
          height: size,
        }}
      >
        {/* Cube */}
        <div
          style={{
            width: size,
            height: size,
            position: "relative",
            transformStyle: "preserve-3d",
            transform: cubeTransform,
            transition: "transform 1s cubic-bezier(0.4, 0.1, 0.2, 1)",
          }}
        >
          {/* Front — Belief I */}
          <BeliefFace
            belief={BELIEFS[0]}
            size={size}
            transform={`translateZ(${half}px)`}
          />
          {/* Right — Belief II */}
          <BeliefFace
            belief={BELIEFS[1]}
            size={size}
            transform={`rotateY(90deg) translateZ(${half}px)`}
          />
          {/* Back — Belief III (content mirrored by rotateY(180deg), corrected inside) */}
          <BeliefFace
            belief={BELIEFS[2]}
            size={size}
            transform={`rotateY(180deg) translateZ(${half}px)`}
            contentFlip
          />
          {/* Left — Belief IV */}
          <BeliefFace
            belief={BELIEFS[3]}
            size={size}
            transform={`rotateY(-90deg) translateZ(${half}px)`}
          />
          {/* Top — Belief V */}
          <BeliefFace
            belief={BELIEFS[4]}
            size={size}
            transform={`rotateX(-90deg) translateZ(${half}px)`}
            xFlip
          />
          {/* Bottom — brand closing */}
          <div style={faceStyle(size, `rotateX(90deg) translateZ(${half}px)`)}>
            <div
              style={{
                height: "100%",
                background: "#EAE3D3",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <p
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontWeight: 300,
                  fontSize: size * 0.07,
                  color: "rgba(58,52,44,0.25)",
                  letterSpacing: "0.05em",
                }}
              >
                Evermor Tales
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-5 mt-10">
        <button
          onClick={() => go(-1)}
          className="w-9 h-9 flex items-center justify-center text-[#3A342C]/40 hover:text-[#3A342C]/80 transition-colors duration-300 text-lg"
          aria-label="Previous belief"
        >
          ←
        </button>

        {BELIEFS.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className="transition-all duration-400"
            style={{
              width: i === current ? 20 : 6,
              height: 6,
              borderRadius: 3,
              background: i === current ? "#3A342C" : "rgba(58,52,44,0.2)",
              border: "none",
              cursor: "pointer",
              padding: 0,
              transition: "all 0.4s ease",
            }}
            aria-label={`Belief ${i + 1}`}
          />
        ))}

        <button
          onClick={() => go(1)}
          className="w-9 h-9 flex items-center justify-center text-[#3A342C]/40 hover:text-[#3A342C]/80 transition-colors duration-300 text-lg"
          aria-label="Next belief"
        >
          →
        </button>
      </div>

      {/* Current belief label */}
      <p
        className="mt-4 font-sans font-light text-[11px] uppercase tracking-[0.2em] text-[#3A342C]/35 transition-all duration-300"
      >
        {BELIEFS[current].numeral} of V
      </p>
    </div>
  );
}
