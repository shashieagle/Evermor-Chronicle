import { useEffect, useState, useRef } from "react";
import { Link } from "wouter";

function useInView() {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<any>(null);

  useEffect(() => {
    const currentRef = ref.current;
    if (!currentRef) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(currentRef);
        }
      },
      { threshold: 0.15 }
    );
    
    observer.observe(currentRef);
    return () => observer.disconnect();
  }, []);

  return [ref, isInView] as const;
}

function useScrollProgress(ref: any) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const sectionTop = window.scrollY + rect.top;
      const sectionHeight = ref.current.offsetHeight;
      const windowHeight = window.innerHeight;
      
      const scrollableHeight = sectionHeight - windowHeight;
      if (scrollableHeight <= 0) return;
      
      const p = (window.scrollY - sectionTop) / scrollableHeight;
      setProgress(Math.max(0, Math.min(1, p)));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    
    window.addEventListener('resize', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [ref]);

  return progress;
}

export default function Home() {
  const [mounted, setMounted] = useState(false);

  const [eyebrowRef, eyebrowInView] = useInView();
  const [copyRef, copyInView] = useInView();
  const [imageRef, imageInView] = useInView();
  const [transitionLineRef, transitionLineInView] = useInView();

  const chapter3Ref = useRef<HTMLElement>(null);
  const scrollProgress = useScrollProgress(chapter3Ref);

  const [c4LabelRef, c4LabelInView] = useInView();
  
  const [b1HeadlineRef, b1HeadlineInView] = useInView();
  const [b1CopyRef, b1CopyInView] = useInView();
  const [b1ImageRef, b1ImageInView] = useInView();

  const [b2HeadlineRef, b2HeadlineInView] = useInView();
  const [b2CopyRef, b2CopyInView] = useInView();
  const [b2ImageRef, b2ImageInView] = useInView();

  const [b3HeadlineRef, b3HeadlineInView] = useInView();
  const [b3CopyRef, b3CopyInView] = useInView();
  const [b3ImageRef, b3ImageInView] = useInView();

  const [b4HeadlineRef, b4HeadlineInView] = useInView();
  const [b4CopyRef, b4CopyInView] = useInView();
  const [b4ImageRef, b4ImageInView] = useInView();

  const [b5HeadlineRef, b5HeadlineInView] = useInView();
  const [b5CopyRef, b5CopyInView] = useInView();
  const [b5ImageRef, b5ImageInView] = useInView();

  const [c4ClosingRef, c4ClosingInView] = useInView();

  const [c5LabelRef, c5LabelInView] = useInView();
  const [c5TitleRef, c5TitleInView] = useInView();
  const [c5ParaRef, c5ParaInView] = useInView();

  const [s1NameRef, s1NameInView] = useInView();
  const [s1ParaRef, s1ParaInView] = useInView();
  const [s1ImageRef, s1ImageInView] = useInView();

  const [s2NameRef, s2NameInView] = useInView();
  const [s2ParaRef, s2ParaInView] = useInView();
  const [s2ImageRef, s2ImageInView] = useInView();

  const [s3NameRef, s3NameInView] = useInView();
  const [s3ParaRef, s3ParaInView] = useInView();
  const [s3ImageRef, s3ImageInView] = useInView();

  const [s4NameRef, s4NameInView] = useInView();
  const [s4ParaRef, s4ParaInView] = useInView();
  const [s4ImageRef, s4ImageInView] = useInView();

  const [s5NameRef, s5NameInView] = useInView();
  const [s5ParaRef, s5ParaInView] = useInView();
  const [s5ImageRef, s5ImageInView] = useInView();

  const [c5ClosingRef, c5ClosingInView] = useInView();
  const [c5CtaRef, c5CtaInView] = useInView();

  const getStatementStyle = (start: number, end: number) => {
    if (scrollProgress <= start || scrollProgress >= end) return { opacity: 0, transform: 'translateY(12px)', pointerEvents: 'none' as const };
    const clamped = (scrollProgress - start) / (end - start);
    return {
      opacity: Math.sin(clamped * Math.PI),
      transform: `translateY(${(1 - clamped * 2) * 12}px)`,
    };
  };

  const getImageStyle = (start: number, end: number) => {
    if (scrollProgress <= start) return { opacity: 0, pointerEvents: 'none' as const };
    const clamped = (scrollProgress - start) / (end - start);
    return {
      opacity: clamped >= 0.5 ? 1 : Math.sin(clamped * Math.PI),
    };
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="bg-[#EAE3D3] text-[#F5F0E8]">
      {/* Chapter 1 - Hero */}
      <section className="relative h-[100vh] w-full overflow-hidden bg-[#F5F0E8] text-[#F5F0E8]">
        {/* Hero Image Background */}
        <div 
          className={`absolute inset-0 z-0 transition-opacity duration-[1200ms] ease-in-out ${
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
            className={`mt-4 md:mt-6 text-[14px] md:text-[16px] font-sans font-light text-[#F5F0E8]/80 tracking-[0.03em] max-w-[480px] leading-relaxed transition-opacity duration-800 ease-in-out delay-[600ms] ${
              mounted ? "opacity-100" : "opacity-0"
            }`}
          >
            We work with families to create a single, enduring archive — a book of firsts, written in light, to be passed down.
          </p>

          <Link 
            href="/discover"
            className={`mt-6 md:mt-8 text-[13px] md:text-[15px] font-sans font-light text-[#F5F0E8]/70 hover:text-[#F5F0E8] transition-all duration-800 ease-in-out delay-[900ms] flex items-center gap-2 ${
              mounted ? "opacity-100" : "opacity-0"
            }`}
          >
            <span>Discover Your Story</span>
            <span className="block tracking-widest">──────────────→</span>
          </Link>
        </div>
      </section>

      {/* Chapter 2 - Why Evermor Exists */}
      <section className="bg-[#EAE3D3] py-32 md:py-48 flex flex-col items-center">
        <h2
          ref={eyebrowRef}
          className={`uppercase tracking-[0.3em] md:tracking-[0.4em] font-sans font-light text-[11px] md:text-[12px] text-[#3A342C]/60 text-center mb-12 md:mb-16 transition-all duration-[800ms] ease-out ${
            eyebrowInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          WHY EVERMOR EXISTS
        </h2>

        <div
          ref={copyRef}
          className={`max-w-[680px] mx-auto px-6 md:px-0 text-center transition-all duration-[800ms] ease-out delay-150 ${
            copyInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <p className="font-serif text-[22px] md:text-[28px] lg:text-[32px] font-light text-[#3A342C] leading-[1.75] md:leading-loose tracking-[0.01em]">
            Most photographs disappear. They live on phones that break, in albums that close, in folders that go unshared. We started Evermor because we believe the first chapter of a family's life — the first glance, the first held hand, the first breath — deserves more than a file. It deserves a home.
          </p>
        </div>

        <div
          ref={imageRef}
          className={`w-full mt-20 md:mt-28 transition-all duration-[800ms] ease-out delay-300 ${
            imageInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <img
            src="/chapter2.jpg"
            alt="Editorial photograph"
            className="w-full h-[480px] md:h-[640px] object-cover object-center"
          />
        </div>

        <p
          ref={transitionLineRef}
          className={`mt-20 md:mt-28 mb-0 text-center font-serif font-light italic text-[16px] md:text-[18px] text-[#3A342C]/60 tracking-[0.02em] transition-all duration-[800ms] ease-out ${
            transitionLineInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          Every family begins with a story.
        </p>
      </section>

      {/* Chapter 3 - Scroll Narrative */}
      <section ref={chapter3Ref} className="relative h-[400vh] w-full bg-[#EAE3D3]">
        <div className="sticky top-0 h-[100vh] overflow-hidden">
          {/* Statements */}
          <div 
            className="absolute inset-0 flex items-center justify-center font-serif text-[32px] md:text-[48px] lg:text-[56px] font-light text-[#3A342C] tracking-[0.01em] leading-[1.3] max-w-[760px] mx-auto text-center px-6"
            style={getStatementStyle(0.00, 0.25)}
          >
            A wedding marks a moment.
          </div>
          
          <div 
            className="absolute inset-0 flex items-center justify-center font-serif text-[32px] md:text-[48px] lg:text-[56px] font-light text-[#3A342C] tracking-[0.01em] leading-[1.3] max-w-[760px] mx-auto text-center px-6"
            style={getStatementStyle(0.25, 0.50)}
          >
            A marriage shapes a lifetime.
          </div>
          
          <div 
            className="absolute inset-0 flex items-center justify-center font-serif text-[32px] md:text-[48px] lg:text-[56px] font-light text-[#3A342C] tracking-[0.01em] leading-[1.3] max-w-[760px] mx-auto text-center px-6"
            style={getStatementStyle(0.50, 0.70)}
          >
            The beginning deserves to be remembered.
          </div>

          {/* Image Reveal */}
          <div 
            className="absolute inset-0"
            style={getImageStyle(0.70, 1.00)}
          >
            <img 
              src="/chapter3.jpg" 
              alt="Editorial wedding photography" 
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/30 to-transparent" />
            <p className="absolute bottom-12 md:bottom-16 left-0 right-0 text-center font-serif font-light italic text-[16px] md:text-[20px] text-[#F5F0E8]/85 tracking-[0.02em]">
              How we preserve that beginning matters.
            </p>
          </div>
        </div>
      </section>

      {/* Chapter 4 - Beliefs */}
      <section className="bg-[#F8F6F2] py-32 md:py-48">
        <h2
          ref={c4LabelRef}
          className={`mb-20 md:mb-28 text-center uppercase tracking-[0.35em] font-sans font-light text-[11px] md:text-[12px] text-[#3A342C]/55 transition-all duration-[800ms] ease-out ${
            c4LabelInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          WHAT WE BELIEVE.
        </h2>

        {/* Belief 1 */}
        <div className="mb-28 md:mb-40">
          <h3
            ref={b1HeadlineRef}
            className={`font-serif text-[36px] md:text-[48px] lg:text-[54px] font-light text-[#3A342C] tracking-[0.005em] leading-[1.15] text-center max-w-[760px] mx-auto px-6 md:px-0 transition-all duration-[800ms] ease-out ${
              b1HeadlineInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            People before pictures.
          </h3>
          <p
            ref={b1CopyRef}
            className={`mt-6 md:mt-8 font-sans font-light text-[15px] md:text-[17px] text-[#3A342C]/70 leading-[1.85] tracking-[0.02em] text-center max-w-[680px] mx-auto px-6 md:px-0 transition-all duration-[800ms] ease-out ${
              b1CopyInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: b1CopyInView ? '150ms' : '0ms' }}
          >
            Every wedding is remembered through the people who lived it. Before we create photographs, we take the time to understand the relationships, emotions, and moments that matter most.
          </p>
          <img
            ref={b1ImageRef}
            src="/belief1.jpg"
            alt="People before pictures"
            className={`mt-14 md:mt-20 w-full h-[420px] md:h-[580px] object-cover object-center transition-all duration-[800ms] ease-out ${
              b1ImageInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          />
        </div>

        {/* Belief 2 */}
        <div className="mb-28 md:mb-40">
          <h3
            ref={b2HeadlineRef}
            className={`font-serif text-[36px] md:text-[48px] lg:text-[54px] font-light text-[#3A342C] tracking-[0.005em] leading-[1.15] text-center max-w-[760px] mx-auto px-6 md:px-0 transition-all duration-[800ms] ease-out ${
              b2HeadlineInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            Stories before trends.
          </h3>
          <p
            ref={b2CopyRef}
            className={`mt-6 md:mt-8 font-sans font-light text-[15px] md:text-[17px] text-[#3A342C]/70 leading-[1.85] tracking-[0.02em] text-center max-w-[680px] mx-auto px-6 md:px-0 transition-all duration-[800ms] ease-out ${
              b2CopyInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: b2CopyInView ? '150ms' : '0ms' }}
          >
            Beautiful imagery may capture attention today, but meaningful stories continue to resonate for generations. We create work that remains timeless long after trends have faded.
          </p>
          <img
            ref={b2ImageRef}
            src="/belief2.jpg"
            alt="Stories before trends"
            className={`mt-14 md:mt-20 w-full h-[420px] md:h-[580px] object-cover object-center transition-all duration-[800ms] ease-out ${
              b2ImageInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          />
        </div>

        {/* Belief 3 */}
        <div className="mb-28 md:mb-40">
          <h3
            ref={b3HeadlineRef}
            className={`font-serif text-[36px] md:text-[48px] lg:text-[54px] font-light text-[#3A342C] tracking-[0.005em] leading-[1.15] text-center max-w-[760px] mx-auto px-6 md:px-0 transition-all duration-[800ms] ease-out ${
              b3HeadlineInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            Discovery before documentation.
          </h3>
          <p
            ref={b3CopyRef}
            className={`mt-6 md:mt-8 font-sans font-light text-[15px] md:text-[17px] text-[#3A342C]/70 leading-[1.85] tracking-[0.02em] text-center max-w-[680px] mx-auto px-6 md:px-0 transition-all duration-[800ms] ease-out ${
              b3CopyInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: b3CopyInView ? '150ms' : '0ms' }}
          >
            Every couple is different. Every family carries its own history. Before a single frame is created, we invest time in discovering what makes your story uniquely yours.
          </p>
          <img
            ref={b3ImageRef}
            src="/belief3.jpg"
            alt="Discovery before documentation"
            className={`mt-14 md:mt-20 w-full h-[420px] md:h-[580px] object-cover object-center transition-all duration-[800ms] ease-out ${
              b3ImageInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          />
        </div>

        {/* Belief 4 */}
        <div className="mb-28 md:mb-40">
          <h3
            ref={b4HeadlineRef}
            className={`font-serif text-[36px] md:text-[48px] lg:text-[54px] font-light text-[#3A342C] tracking-[0.005em] leading-[1.15] text-center max-w-[760px] mx-auto px-6 md:px-0 transition-all duration-[800ms] ease-out ${
              b4HeadlineInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            Craft with purpose.
          </h3>
          <p
            ref={b4CopyRef}
            className={`mt-6 md:mt-8 font-sans font-light text-[15px] md:text-[17px] text-[#3A342C]/70 leading-[1.85] tracking-[0.02em] text-center max-w-[680px] mx-auto px-6 md:px-0 transition-all duration-[800ms] ease-out ${
              b4CopyInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: b4CopyInView ? '150ms' : '0ms' }}
          >
            Every photograph, every film, every edit is made intentionally. We believe craftsmanship is measured not by complexity, but by emotional honesty.
          </p>
          <img
            ref={b4ImageRef}
            src="/belief4.jpg"
            alt="Craft with purpose"
            className={`mt-14 md:mt-20 w-full h-[420px] md:h-[580px] object-cover object-center transition-all duration-[800ms] ease-out ${
              b4ImageInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          />
        </div>

        {/* Belief 5 */}
        <div className="mb-28 md:mb-40">
          <h3
            ref={b5HeadlineRef}
            className={`font-serif text-[36px] md:text-[48px] lg:text-[54px] font-light text-[#3A342C] tracking-[0.005em] leading-[1.15] text-center max-w-[760px] mx-auto px-6 md:px-0 transition-all duration-[800ms] ease-out ${
              b5HeadlineInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            Trust before everything.
          </h3>
          <p
            ref={b5CopyRef}
            className={`mt-6 md:mt-8 font-sans font-light text-[15px] md:text-[17px] text-[#3A342C]/70 leading-[1.85] tracking-[0.02em] text-center max-w-[680px] mx-auto px-6 md:px-0 transition-all duration-[800ms] ease-out ${
              b5CopyInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: b5CopyInView ? '150ms' : '0ms' }}
          >
            Being invited into one of life's most meaningful moments is a privilege. We carry that responsibility with care, respect, and gratitude throughout the entire journey.
          </p>
          <img
            ref={b5ImageRef}
            src="/belief5.jpg"
            alt="Trust before everything"
            className={`mt-14 md:mt-20 w-full h-[420px] md:h-[580px] object-cover object-center transition-all duration-[800ms] ease-out ${
              b5ImageInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          />
        </div>

        <p
          ref={c4ClosingRef}
          className={`mt-20 md:mt-32 font-serif font-light italic text-[18px] md:text-[22px] text-[#3A342C]/60 tracking-[0.02em] text-center max-w-[760px] mx-auto px-6 md:px-0 transition-all duration-[800ms] ease-out ${
            c4ClosingInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          Every belief shapes the way we preserve your beginning.
        </p>
      </section>

      {/* Chapter 5 - The Experience */}
      <section className="bg-[#F5F0E8] py-32 md:py-48">
        <div className="max-w-[720px] mx-auto px-6 md:px-0 mb-20 md:mb-28 text-center">
          <h2
            ref={c5LabelRef}
            className={`uppercase tracking-[0.35em] font-sans font-light text-[11px] md:text-[12px] text-[#3A342C]/55 text-center mb-10 md:mb-14 transition-all duration-[800ms] ease-out ${
              c5LabelInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            THE EVERMOR EXPERIENCE
          </h2>
          <h3
            ref={c5TitleRef}
            className={`font-serif font-light text-[36px] md:text-[48px] lg:text-[54px] text-[#3A342C] leading-[1.2] tracking-[0.005em] text-center mb-8 md:mb-10 transition-all duration-[800ms] ease-out ${
              c5TitleInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            The Evermor Experience
          </h3>
          <p
            ref={c5ParaRef}
            className={`font-sans font-light text-[15px] md:text-[17px] text-[#3A342C]/65 leading-[1.9] tracking-[0.02em] text-center transition-all duration-[800ms] ease-out ${
              c5ParaInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: c5ParaInView ? '150ms' : '0ms' }}
          >
            Every meaningful story begins long before the wedding day. Our role is not simply to document your celebration, but to understand the people, relationships, and moments that make it uniquely yours.
          </p>
        </div>

        {/* Stage 1 */}
        <div className="pt-24 md:pt-36">
          <h4
            ref={s1NameRef}
            className={`max-w-[720px] mx-auto px-6 md:px-0 font-serif font-light text-[38px] md:text-[52px] lg:text-[60px] text-[#3A342C] leading-[1.15] tracking-[0.005em] text-center mb-6 md:mb-8 transition-all duration-[800ms] ease-out ${
              s1NameInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            Discover
          </h4>
          <p
            ref={s1ParaRef}
            className={`max-w-[640px] mx-auto px-6 md:px-0 font-sans font-light text-[15px] md:text-[17px] text-[#3A342C]/65 leading-[1.9] tracking-[0.02em] text-center mb-14 md:mb-20 transition-all duration-[800ms] ease-out ${
              s1ParaInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: s1ParaInView ? '150ms' : '0ms' }}
          >
            We begin every journey with a conversation — not about photographs, but about people. We listen to how you met, what matters to your families, and what you hope to feel when you look back on this day.
          </p>
          <img
            ref={s1ImageRef}
            src="/stage1.jpg"
            alt="Discover"
            className={`w-full h-[440px] md:h-[600px] object-cover object-center transition-all duration-[800ms] ease-out ${
              s1ImageInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          />
        </div>

        {/* Stage 2 */}
        <div className="pt-24 md:pt-36">
          <h4
            ref={s2NameRef}
            className={`max-w-[720px] mx-auto px-6 md:px-0 font-serif font-light text-[38px] md:text-[52px] lg:text-[60px] text-[#3A342C] leading-[1.15] tracking-[0.005em] text-center mb-6 md:mb-8 transition-all duration-[800ms] ease-out ${
              s2NameInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            Understand
          </h4>
          <p
            ref={s2ParaRef}
            className={`max-w-[640px] mx-auto px-6 md:px-0 font-sans font-light text-[15px] md:text-[17px] text-[#3A342C]/65 leading-[1.9] tracking-[0.02em] text-center mb-14 md:mb-20 transition-all duration-[800ms] ease-out ${
              s2ParaInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: s2ParaInView ? '150ms' : '0ms' }}
          >
            Every relationship has its own language. We spend time learning yours — the moments between moments, the gestures that speak volumes, the people whose presence changes everything.
          </p>
          <img
            ref={s2ImageRef}
            src="/stage2.jpg"
            alt="Understand"
            className={`w-full h-[440px] md:h-[600px] object-cover object-center transition-all duration-[800ms] ease-out ${
              s2ImageInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          />
        </div>

        {/* Stage 3 */}
        <div className="pt-24 md:pt-36">
          <h4
            ref={s3NameRef}
            className={`max-w-[720px] mx-auto px-6 md:px-0 font-serif font-light text-[38px] md:text-[52px] lg:text-[60px] text-[#3A342C] leading-[1.15] tracking-[0.005em] text-center mb-6 md:mb-8 transition-all duration-[800ms] ease-out ${
              s3NameInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            Prepare
          </h4>
          <p
            ref={s3ParaRef}
            className={`max-w-[640px] mx-auto px-6 md:px-0 font-sans font-light text-[15px] md:text-[17px] text-[#3A342C]/65 leading-[1.9] tracking-[0.02em] text-center mb-14 md:mb-20 transition-all duration-[800ms] ease-out ${
              s3ParaInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: s3ParaInView ? '150ms' : '0ms' }}
          >
            When the day arrives, nothing is left to chance. We are present, quiet, and unobtrusive — creating the conditions for genuine moments to emerge rather than manufacturing them.
          </p>
          <img
            ref={s3ImageRef}
            src="/stage3.jpg"
            alt="Prepare"
            className={`w-full h-[440px] md:h-[600px] object-cover object-center transition-all duration-[800ms] ease-out ${
              s3ImageInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          />
        </div>

        {/* Stage 4 */}
        <div className="pt-24 md:pt-36">
          <h4
            ref={s4NameRef}
            className={`max-w-[720px] mx-auto px-6 md:px-0 font-serif font-light text-[38px] md:text-[52px] lg:text-[60px] text-[#3A342C] leading-[1.15] tracking-[0.005em] text-center mb-6 md:mb-8 transition-all duration-[800ms] ease-out ${
              s4NameInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            Preserve
          </h4>
          <p
            ref={s4ParaRef}
            className={`max-w-[640px] mx-auto px-6 md:px-0 font-sans font-light text-[15px] md:text-[17px] text-[#3A342C]/65 leading-[1.9] tracking-[0.02em] text-center mb-14 md:mb-20 transition-all duration-[800ms] ease-out ${
              s4ParaInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: s4ParaInView ? '150ms' : '0ms' }}
          >
            What we create is not a collection of photographs. It is a record of the emotional truth of your beginning — crafted with the care and precision of work that is meant to last a lifetime.
          </p>
          <img
            ref={s4ImageRef}
            src="/stage4.jpg"
            alt="Preserve"
            className={`w-full h-[440px] md:h-[600px] object-cover object-center transition-all duration-[800ms] ease-out ${
              s4ImageInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          />
        </div>

        {/* Stage 5 */}
        <div className="pt-24 md:pt-36">
          <h4
            ref={s5NameRef}
            className={`max-w-[720px] mx-auto px-6 md:px-0 font-serif font-light text-[38px] md:text-[52px] lg:text-[60px] text-[#3A342C] leading-[1.15] tracking-[0.005em] text-center mb-6 md:mb-8 transition-all duration-[800ms] ease-out ${
              s5NameInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            Relive
          </h4>
          <p
            ref={s5ParaRef}
            className={`max-w-[640px] mx-auto px-6 md:px-0 font-sans font-light text-[15px] md:text-[17px] text-[#3A342C]/65 leading-[1.9] tracking-[0.02em] text-center mb-14 md:mb-20 transition-all duration-[800ms] ease-out ${
              s5ParaInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: s5ParaInView ? '150ms' : '0ms' }}
          >
            Years from now, when you return to what we created together, it will not simply remind you of a day. It will return you to a feeling — the beginning of everything.
          </p>
          <img
            ref={s5ImageRef}
            src="/stage5.jpg"
            alt="Relive"
            className={`w-full h-[440px] md:h-[600px] object-cover object-center transition-all duration-[800ms] ease-out ${
              s5ImageInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          />
        </div>

        {/* Closing Block */}
        <div className="pt-24 md:pt-36 text-center max-w-[720px] mx-auto px-6 md:px-0">
          <p
            ref={c5ClosingRef}
            className={`font-serif font-light italic text-[20px] md:text-[26px] text-[#3A342C]/65 tracking-[0.015em] leading-[1.5] mb-10 md:mb-14 transition-all duration-[800ms] ease-out ${
              c5ClosingInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            Your story deserves to be experienced, not simply documented.
          </p>
          <span
            ref={c5CtaRef}
            className={`inline-flex flex-col items-center gap-2 font-sans font-light text-[13px] md:text-[14px] text-[#3A342C]/55 tracking-[0.05em] text-center hover:text-[#3A342C]/90 transition-all duration-[800ms] ease-out ${
              c5CtaInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: c5CtaInView ? '150ms' : '0ms' }}
          >
            <span>Discover Your Story</span>
            <span>──────────────→</span>
          </span>
        </div>
      </section>
    </div>
  );
}
