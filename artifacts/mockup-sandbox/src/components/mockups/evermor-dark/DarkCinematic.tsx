import React from 'react';

export function DarkCinematic() {
  return (
    <div className="bg-[#0A0806] min-h-screen text-[#EDE4D6] font-['Inter'] antialiased">
      {/* 1. Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[#C4974A]/25 backdrop-blur-sm bg-[#0A0806]/50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="font-['Cormorant_Garamond'] text-2xl tracking-wide text-[#EDE4D6]">
            Evermor Tales
          </div>
          <div className="hidden md:flex items-center space-x-10 text-[11px] font-light uppercase tracking-[0.25em] text-[#EDE4D6]">
            <a href="#" className="hover:text-[#C4974A] transition-colors">Beginnings</a>
            <a href="#" className="hover:text-[#C4974A] transition-colors">About</a>
            <a href="#" className="hover:text-[#C4974A] transition-colors">Begin Your Story</a>
          </div>
        </div>
      </nav>

      {/* 2. Hero */}
      <section className="relative h-[100vh] w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/__mockup/images/chapter2.jpg" 
            alt="Hero Wedding Photography" 
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
        
        <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl mx-auto mt-20">
          <div className="w-[60px] h-[1px] bg-[#C4974A] mb-8"></div>
          <h1 className="font-['Cormorant_Garamond'] text-[clamp(48px,6vw,96px)] leading-[1.1] mb-8 text-[#EDE4D6] font-normal">
            Preserving the beginning<br/>of your family.
          </h1>
          <p className="text-[11px] font-light uppercase tracking-[0.25em] text-[#C4974A]/60 mb-12">
            Hyderabad · India · Est. 2018
          </p>
          <a href="#" className="inline-flex items-center justify-center px-8 py-4 border border-[#EDE4D6] text-[#EDE4D6] text-sm uppercase tracking-[0.15em] hover:bg-[#EDE4D6] hover:text-[#0A0806] transition-colors duration-300">
            Discover our stories &rarr;
          </a>
        </div>
      </section>

      {/* 3. Statement strip */}
      <section className="min-h-[60vh] bg-[#141210] flex items-center justify-center px-6 py-24">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
          <h2 className="font-['Cormorant_Garamond'] text-[clamp(32px,4vw,64px)] leading-tight text-[#EDE4D6] mb-10 font-normal">
            "A wedding marks a moment.<br/>A marriage shapes a lifetime."
          </h2>
          <div className="w-[80px] h-[1px] bg-[#C4974A]"></div>
        </div>
      </section>

      {/* 4. About section */}
      <section className="py-32 bg-[#0A0806] px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div className="relative aspect-[3/4] w-full max-w-md mx-auto md:max-w-none md:ml-auto group overflow-hidden">
            <img 
              src="/__mockup/images/about-hero.jpg" 
              alt="Shashikanth & Deepika" 
              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 ring-1 ring-inset ring-[#C4974A]/20 pointer-events-none"></div>
          </div>
          <div className="flex flex-col items-start max-w-lg">
            <p className="text-[#C4974A] text-[11px] font-light uppercase tracking-[0.25em] mb-6">
              Who We Are
            </p>
            <h3 className="font-['Cormorant_Garamond'] text-4xl lg:text-5xl text-[#EDE4D6] leading-tight mb-8">
              We are Shashikanth &amp; Deepika.
            </h3>
            <p className="text-[#7A6E64] text-lg leading-relaxed mb-8 font-light">
              We believe in creating quiet, powerful images that honor the gravity of your commitment. Our approach blends editorial edge with documentary truth—capturing light, emotion, and the profound beauty of two families merging into one.
            </p>
            <a href="#" className="text-[#C4974A] text-[11px] font-light uppercase tracking-[0.25em] hover:text-[#EDE4D6] transition-colors border-b border-transparent hover:border-[#EDE4D6] pb-1">
              Read our full story &rarr;
            </a>
          </div>
        </div>
      </section>

      {/* 5. Full-bleed story image */}
      <section className="relative h-[70vh] w-full flex items-end">
        <div className="absolute inset-0 z-0">
          <img 
            src="/__mockup/images/s1.jpg" 
            alt="A Quiet Promise" 
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
        </div>
        
        <div className="relative z-10 w-full p-8 md:p-16 max-w-7xl mx-auto">
          <p className="text-[#C4974A] text-[11px] font-light uppercase tracking-[0.25em] mb-4">
            Lake Como, Italy
          </p>
          <h2 className="font-['Cormorant_Garamond'] text-[clamp(40px,5vw,72px)] leading-none text-[#EDE4D6] mb-3">
            A Quiet Promise
          </h2>
          <div className="flex items-center gap-6">
            <p className="text-[#7A6E64] text-lg font-['Cormorant_Garamond'] italic">
              Elena &amp; Marco
            </p>
            <div className="w-8 h-[1px] bg-[#7A6E64]/50"></div>
            <a href="#" className="text-[#EDE4D6] text-[11px] font-light uppercase tracking-[0.25em] hover:text-[#C4974A] transition-colors">
              View Story &rarr;
            </a>
          </div>
        </div>
      </section>

      {/* 6. Memory strip */}
      <section className="min-h-[80vh] bg-[#141210] flex items-center justify-center px-6 py-24 relative overflow-hidden">
        <div className="max-w-5xl mx-auto text-center flex flex-col items-center relative z-10">
          <div className="w-[1px] h-[80px] bg-[#C4974A] mb-12 opacity-50"></div>
          <h2 className="font-['Cormorant_Garamond'] text-[clamp(48px,7vw,108px)] leading-[1.1] text-[#EDE4D6]/80 font-normal">
            We preserve what it meant.
          </h2>
        </div>
      </section>

      {/* 7. CTA footer */}
      <footer className="py-32 bg-[#0A0806] border-t border-[#C4974A]/20 px-6">
        <div className="max-w-3xl mx-auto text-center flex flex-col items-center">
          <h2 className="font-['Cormorant_Garamond'] text-[clamp(32px,4vw,56px)] leading-tight text-[#EDE4D6] mb-6">
            Begin Your Story
          </h2>
          <p className="text-[#7A6E64] text-lg font-light mb-12 max-w-md">
            We take on a limited number of commissions each year to ensure the highest level of artistic dedication.
          </p>
          <a href="#" className="inline-block border border-[#C4974A] text-[#C4974A] px-10 py-4 text-[11px] font-light uppercase tracking-[0.25em] hover:bg-[#C4974A] hover:text-[#0A0806] transition-colors duration-300">
            Begin Your Story &rarr;
          </a>
        </div>
      </footer>
    </div>
  );
}
