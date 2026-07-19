import { useEffect, useState } from "react";
import { Link } from "wouter";

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <main className="relative h-[100vh] w-[100vw] overflow-hidden bg-[#F5F0E8] text-[#F5F0E8]">
      {/* Hero Image Background */}
      <div 
        className={`absolute inset-0 z-0 transition-opacity duration-1200 ease-in-out ${
          mounted ? "opacity-100" : "opacity-0"
        }`}
      >
        <img
          src="/hero.jpg"
          alt="Evermor - Preserving the beginning of your family"
          className="w-full h-full object-cover"
        />
        {/* Warm Overlay */}
        <div className="absolute inset-0 bg-[#F5F0E8]/15 mix-blend-overlay" />
        {/* Subtle gradient for text legibility at bottom */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/40 to-transparent" />
      </div>

      {/* Navigation */}
      <nav 
        className={`absolute top-0 left-0 right-0 z-10 px-6 py-6 md:px-16 md:py-10 flex justify-between items-start transition-opacity duration-800 ease-in-out ${
          mounted ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="font-serif text-2xl tracking-[0.02em] font-light text-[#F5F0E8]">
          Evermor
        </div>
        <div className="flex gap-8 font-sans text-[13px] tracking-wide font-light">
          <Link href="/our-work" className="text-[#F5F0E8]/75 hover:text-[#F5F0E8] transition-colors duration-300">
            Our Work
          </Link>
          <Link href="/begin" className="text-[#F5F0E8]/75 hover:text-[#F5F0E8] transition-colors duration-300">
            Begin
          </Link>
        </div>
      </nav>

      {/* Hero Content */}
      <div className="absolute bottom-[15%] md:bottom-[22%] left-6 md:left-16 max-w-[640px] z-10 flex flex-col items-start">
        <h1 
          className={`font-serif text-[36px] md:text-[64px] lg:text-[80px] leading-[1.2] font-light text-[#F5F0E8] tracking-[0.01em] transition-opacity duration-1000 ease-in-out delay-300 ${
            mounted ? "opacity-100" : "opacity-0"
          }`}
        >
          Preserving the beginning of your family.
        </h1>
        
        <p 
          className={`mt-4 md:mt-6 text-[14px] md:text-[16px] font-sans font-light text-[#F5F0E8]/80 tracking-[0.03em] max-w-[480px] leading-relaxed transition-opacity duration-800 ease-in-out delay-600 ${
            mounted ? "opacity-100" : "opacity-0"
          }`}
        >
          We work with families to create a single, enduring archive — a book of firsts, written in light, to be passed down.
        </p>

        <Link 
          href="/discover"
          className={`mt-6 md:mt-8 text-[13px] md:text-[15px] font-sans font-light text-[#F5F0E8]/70 hover:text-[#F5F0E8] transition-all duration-800 ease-in-out delay-900 flex items-center gap-2 ${
            mounted ? "opacity-100" : "opacity-0"
          }`}
        >
          <span>Discover Your Story</span>
          <span className="block tracking-widest">──────────────→</span>
        </Link>
      </div>
    </main>
  );
}
