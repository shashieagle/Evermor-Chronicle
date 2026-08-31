import { useEffect, useState, useRef } from "react";
import { Link } from "wouter";
import Nav from "../components/Nav";

const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSfA-IctROACzhLKmq2Ghzdoep_Cm7EkaC0KQ43uTUxm4M83ow/viewform";
const GOOGLE_FORM_EMBED_URL = `${GOOGLE_FORM_URL}?embedded=true`;
const INQUIRY_DESTINATION = "/begin-your-story";

function useInView(threshold = 0.12) {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<any>(null);
  
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { 
        if (e.isIntersecting) { 
          setIsInView(true); 
          obs.unobserve(el); 
        } 
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  
  return [ref, isInView] as const;
}

export default function StoryDNA() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    document.title = "Discover Your Story DNA | Evermor Tales";

    const description = "An invitation to pause, reflect, and discover the story that makes your family yours.";
    let meta = document.querySelector('meta[name="description"]');
    const previousDescription = meta?.getAttribute("content");
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", description);

    return () => {
      document.title = "Evermor Tales";
      if (previousDescription) {
        meta?.setAttribute("content", previousDescription);
      } else {
        meta?.remove();
      }
    };
  }, []);

  const [collageRef, collageInView] = useInView();
  const [quoteRef, quoteInView] = useInView();
  const [closingRef, closingInView] = useInView();

  const navLinks = [
    { href: "/about", label: "About" },
    { href: "/beginnings", label: "Beginnings" },
    { href: "/approach", label: "Approach" },
    { href: "/journal", label: "Journal" },
    { href: "/begin-your-story", label: "Begin Your Story" },
  ];

  return (
    <div className="bg-[#EFEFED] text-[#3A342C] min-h-screen flex flex-col font-serif">
      <Nav theme="light" mounted={mounted} position="absolute" links={navLinks} />
      {/* 1. Hero: Literary & Slow */}
      <section className="pt-[25vh] md:pt-[30vh] pb-[10vh] px-6 md:px-16 lg:px-[100px] max-w-[1400px] mx-auto w-full">
        <p
          className="font-sans uppercase tracking-[0.28em] text-[#8C6D4F] mb-6 text-[10px] md:text-[12px]"
          style={{
            transition: "opacity 1000ms ease-out 200ms, transform 1000ms ease-out 200ms",
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(15px)",
          }}
        >A gift From evermor</p>
        <h1
          className="font-serif font-light leading-[1.05] tracking-[-0.02em] text-[#3A342C]"
          style={{
            fontSize: "clamp(48px, 9vw, 110px)",
            transition: "opacity 1000ms ease-out 400ms, transform 1000ms ease-out 400ms",
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(20px)",
          }}
        >
          Discover Your <br />
          <span className="italic text-[#8C6D4F]">Story DNA.</span>
        </h1>
        <div 
          className="mt-12 md:mt-20 max-w-[580px]"
          style={{
            transition: "opacity 1000ms ease-out 600ms, transform 1000ms ease-out 600ms",
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(20px)",
          }}
        >
          <p className="font-serif font-light text-[#3A342C]/70 text-[20px] md:text-[26px] leading-[1.6]">
            Before the planning takes over, before the details crowd the vision—take a moment to understand the two people at the heart of it all, and the story they are becoming together.
          </p>
          <a
            href="#story-dna-form"
            className="mt-8 inline-flex items-center gap-3 font-sans text-[#3A342C]/65 hover:text-[#8C6D4F] tracking-[0.16em] uppercase transition-colors duration-300 text-[10px] md:text-[11px]"
          >
            Begin the reflection <span aria-hidden="true">↓</span>
          </a>
        </div>
      </section>
      {/* 2. The gift */}
      <section className="px-6 md:px-16 lg:px-[100px] py-[12vh] md:py-[16vh] bg-[#3A342C] text-[#F5F0E8]">
        <div className="max-w-[1120px] mx-auto">
          <div className="max-w-[720px] mb-16 md:mb-20">
            <p className="font-sans uppercase tracking-[0.24em] text-[#C5A888] text-[10px] md:text-[11px] mb-6">an invitation to REFLECT</p>
            <h2 className="font-serif text-[38px] md:text-[62px] leading-[1.08] font-light mb-7">
              Two separate answers.<br />
              <span className="italic text-[#C5A888]">One deeper understanding.</span>
            </h2>
            <p className="font-serif text-[19px] md:text-[24px] leading-[1.65] text-[#F5F0E8]/70">
              You’ll each fill it out on your own. Then we’ll look at your answers together to understand what makes you each tick, what you value, and what makes your relationship uniquely yours.
            </p>
            <p className="font-sans font-light text-[12px] leading-[1.8] tracking-[0.04em] text-[#F5F0E8]/50 mt-5 max-w-[620px]">
              No score. No perfect match. No verdict. Just a private reading of your answers, created freely from everything we have learned from understanding hundreds of couples.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10 md:gap-12 border-t border-[#F5F0E8]/20 pt-10">
            <div>
              <p className="font-sans text-[#C5A888] text-[11px] tracking-[0.18em] mb-5">01</p>
              <h3 className="font-serif text-[26px] md:text-[30px] font-light mb-4">Your individual DNA</h3>
              <p className="font-sans font-light text-[13px] leading-[1.8] text-[#F5F0E8]/55">
                The person beneath the answers: your instincts, contradictions, needs, and the things you may not yet realise about yourself.
              </p>
            </div>
            <div>
              <p className="font-sans text-[#C5A888] text-[11px] tracking-[0.18em] mb-5">02</p>
              <h3 className="font-serif text-[26px] md:text-[30px] font-light mb-4">Your relationship DNA</h3>
              <p className="font-sans font-light text-[13px] leading-[1.8] text-[#F5F0E8]/55">
                Your essence, dynamics, archetype, and the beautiful tensions that make the two of you work.
              </p>
            </div>
            <div>
              <p className="font-sans text-[#C5A888] text-[11px] tracking-[0.18em] mb-5">03</p>
              <h3 className="font-serif text-[26px] md:text-[30px] font-light mb-4">Your memory DNA</h3>
              <p className="font-sans font-light text-[13px] leading-[1.8] text-[#F5F0E8]/55">
                The voices, people, rituals, ordinary moments, and memories that matter most to preserve.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* 3. The Visual Archive (Collage) */}
      <section className="py-[10vh] md:py-[15vh] bg-[#F5EDE0]">
        <div className="px-6 md:px-16 lg:px-[100px] max-w-[1400px] mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
          <div 
            ref={collageRef}
            className={`w-full lg:w-1/2 transition-all duration-[1200ms] ease-out ${collageInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
          >
            <div className="relative p-3 md:p-5 bg-[#EFEFED] shadow-[0_20px_60px_rgba(58,52,44,0.08)]">
              <div style={{ outline: "1px solid rgba(140,109,79,0.2)", outlineOffset: "-6px" }}>
                <img 
                  src="/memory-collage.jpg" 
                  alt="A collage of memories" 
                  className="w-full h-auto object-cover"
                  style={{ filter: "sepia(0.1) contrast(1.05)" }}
                />
              </div>
            </div>
          </div>
          <div className="w-full lg:w-1/2 max-w-[500px]">
            <h3 className="font-sans uppercase tracking-[0.2em] text-[#8C6D4F] text-[11px] mb-6">How it works</h3>
            <h2 className="font-serif text-[32px] md:text-[46px] leading-[1.2] text-[#3A342C] font-light mb-6">
              Not a questionnaire. <br />A mirror.
            </h2>
            <p className="font-sans font-light text-[#3A342C]/70 text-[14px] leading-[1.8] mb-8">
              Fill it in individually, without comparing answers. When we have both of your responses, we will read the shape of each person and the space you create together, then share your Evermor DNA reading back with you as a gift — a new language for the things you may feel but have never named.
            </p>
            <ul className="flex flex-col gap-6 font-serif text-[19px] text-[#3A342C]/80">
              <li className="flex gap-4">
                <span className="text-[#8C6D4F] italic">01.</span>
                <span>Answer independently, in your own words.</span>
              </li>
              <li className="flex gap-4">
                <span className="text-[#8C6D4F] italic">02.</span>
                <span>Receive a persona reading for each of you.</span>
              </li>
              <li className="flex gap-4">
                <span className="text-[#8C6D4F] italic">03.</span>
                <span>Discover your relationship and memory DNA together.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>
      {/* 4. Cinematic Image & Quote */}
      <section className="relative py-[20vh] bg-[#1A1612] text-[#F5F0E8] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/beginnings-shaun-sowmya.jpg" 
            alt="Cinematic memory" 
            className="w-full h-full object-cover opacity-[0.25] mix-blend-luminosity"
            style={{ objectPosition: "50% 30%" }}
          />
          <div className="absolute inset-0 bg-[#1A1612]/60" />
        </div>
        <div 
          ref={quoteRef}
          className={`relative z-10 px-6 md:px-16 max-w-[800px] mx-auto text-center transition-all duration-[1200ms] ease-out ${quoteInView ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
        >
          <p className="font-serif italic text-[24px] md:text-[40px] leading-[1.4] font-light mb-8">
            "When we know what you hold sacred, we know exactly where to point the lens."
          </p>
          <p className="font-sans uppercase tracking-[0.2em] text-[#8C6D4F] text-[11px]">
            — Evermor Tales
          </p>
        </div>
      </section>
      {/* 5. Story DNA form preview */}
      <section id="story-dna-form" className="px-6 md:px-16 lg:px-[100px] py-[12vh] md:py-[16vh] bg-[#F5EDE0]">
        <div className="max-w-[1160px] mx-auto grid lg:grid-cols-[0.72fr_1.28fr] gap-12 lg:gap-24 items-start">
          <div className="lg:sticky lg:top-28">
            <p className="font-sans uppercase tracking-[0.24em] text-[#8C6D4F] text-[10px] md:text-[11px] mb-6">
              Your Story DNA
            </p>
            <h2 className="font-serif text-[38px] md:text-[54px] leading-[1.08] text-[#3A342C] font-light mb-6">
              The questions<br />
              <span className="italic text-[#8C6D4F]">worth keeping.</span>
            </h2>
            <p className="font-serif italic text-[#3A342C]/65 text-[19px] md:text-[22px] leading-[1.6] max-w-[390px]">
              Complete it separately, then let us reflect the people you are—and the relationship you are becoming—back to you.
            </p>
            <a
              href={GOOGLE_FORM_URL}
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-flex items-center gap-3 font-sans text-[#3A342C] border-b border-[#3A342C]/30 pb-2 hover:border-[#8C6D4F] hover:text-[#8C6D4F] tracking-[0.14em] uppercase transition-colors duration-300 text-[10px] md:text-[11px]"
            >
              Open the full form <span aria-hidden="true">↗</span>
            </a>
          </div>

          <div className="bg-[#FAFAF8] p-3 md:p-5 shadow-[0_20px_60px_rgba(58,52,44,0.10)]">
            <div className="border border-[#3A342C]/10 overflow-hidden bg-white">
              <iframe
                src={GOOGLE_FORM_EMBED_URL}
                title="Discover Your Story DNA form"
                className="block w-full h-[560px] md:h-[620px]"
                loading="lazy"
              />
            </div>
            <p className="font-sans text-[#3A342C]/45 text-[10px] tracking-[0.08em] mt-4 text-center">
              Prefer a little more room? <a href={GOOGLE_FORM_URL} target="_blank" rel="noreferrer" className="underline underline-offset-4 hover:text-[#8C6D4F] transition-colors">Open the form in a new tab.</a>
            </p>
          </div>
        </div>
      </section>
      {/* 6. The Closing / CTA */}
      <section className="py-[15vh] px-6 md:px-16 bg-[#EFEFED] flex justify-center text-center">
        <div 
          ref={closingRef}
          className={`max-w-[600px] transition-all duration-[1200ms] ease-out ${closingInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <h2 className="font-serif text-[36px] md:text-[54px] text-[#3A342C] font-light mb-6">
            Keep the reflection.
          </h2>
          <p className="font-serif italic text-[#3A342C]/60 text-[20px] mb-10">
            A free Evermor DNA reading for the two of you, shaped with care from everything we have learned from hundreds of couples.
          </p>
          <Link 
            href={INQUIRY_DESTINATION}
            className="inline-flex items-center gap-4 font-sans text-[#F5F0E8] bg-[#3A342C] tracking-[0.16em] uppercase px-8 py-4 hover:bg-[#1A1612] transition-colors duration-500 text-[11px]"
          >
            <span>Begin Your Story</span>
            <span>→</span>
          </Link>
        </div>
      </section>
    </div>
  );
}