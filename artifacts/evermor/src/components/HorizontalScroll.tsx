import { useRef, useState, useEffect } from "react";

interface HorizontalScrollSectionProps {
  panels: React.ReactNode[];
  bg?: string;
}

export default function HorizontalScrollSection({ panels, bg = "bg-[#EAE3D3]" }: HorizontalScrollSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [hintVisible, setHintVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const scrolled = -rect.top;
      const totalScroll = rect.height - window.innerHeight;
      const p = Math.max(0, Math.min(1, scrolled / totalScroll));
      setProgress(p);
      if (p > 0.04) setHintVisible(false);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const translateX = progress * (panels.length - 1) * 100;
  const activeIndex = Math.round(progress * (panels.length - 1));

  return (
    <div ref={containerRef} style={{ height: `${panels.length * 100}vh` }}>
      <div className={`sticky top-0 h-screen overflow-hidden ${bg}`}>

        {/* Sliding panels */}
        <div
          className="flex h-full"
          style={{ transform: `translateX(-${translateX}vw)`, willChange: "transform" }}
        >
          {panels.map((panel, i) => (
            <div key={i} className="w-screen h-full shrink-0 flex items-center justify-center px-8">
              {panel}
            </div>
          ))}
        </div>

        {/* Progress dots */}
        <div className="absolute bottom-10 left-0 right-0 flex justify-center gap-3 pointer-events-none">
          {panels.map((_, i) => (
            <div
              key={i}
              className="rounded-full transition-all duration-500 ease-out"
              style={{
                width: activeIndex === i ? "20px" : "6px",
                height: "6px",
                backgroundColor: activeIndex === i ? "rgba(58,52,44,0.55)" : "rgba(58,52,44,0.18)",
              }}
            />
          ))}
        </div>

        {/* Scroll hint — fades out after interaction */}
        <div
          className="absolute right-8 bottom-10 flex items-center gap-2 transition-opacity duration-700 pointer-events-none"
          style={{ opacity: hintVisible ? 1 : 0 }}
        >
          <span className="font-sans font-light text-[10px] tracking-[0.18em] uppercase text-[#3A342C]/35">
            scroll
          </span>
          <span className="text-[#3A342C]/35 text-[12px]">→</span>
        </div>

      </div>
    </div>
  );
}
