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
    </div>
  );
}
