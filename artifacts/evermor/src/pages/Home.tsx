import { useEffect, useState, useRef } from "react";
import { Link } from "wouter";
import Nav from "../components/Nav";

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

  const chapter6Ref = useRef<HTMLElement>(null);
  const chapter6Progress = useScrollProgress(chapter6Ref);

  const [ch6ClosingRef, ch6ClosingInView] = useInView();
  const [ch6CtaRef, ch6CtaInView] = useInView();

  const [c4LabelRef, c4LabelInView] = useInView();
  
  const [b1HeadlineRef, b1HeadlineInView] = useInView();
  const [b1CopyRef, b1CopyInView] = useInView();

  const [b2HeadlineRef, b2HeadlineInView] = useInView();
  const [b2CopyRef, b2CopyInView] = useInView();

  const [b3HeadlineRef, b3HeadlineInView] = useInView();
  const [b3CopyRef, b3CopyInView] = useInView();

  const [b4HeadlineRef, b4HeadlineInView] = useInView();
  const [b4CopyRef, b4CopyInView] = useInView();

  const [b5HeadlineRef, b5HeadlineInView] = useInView();
  const [b5CopyRef, b5CopyInView] = useInView();

  const [c4ClosingRef, c4ClosingInView] = useInView();

  const [headingRef, headingInView] = useInView();
  const [introRef, introInView] = useInView();
  const [s1ImgRef, s1ImgInView] = useInView();
  const [s1CapRef, s1CapInView] = useInView();
  const [s2ImgRef, s2ImgInView] = useInView();
  const [s3ImgRef, s3ImgInView] = useInView();
  const [pair1CapRef, pair1CapInView] = useInView();
  const [s4ImgRef, s4ImgInView] = useInView();
  const [s4CapRef, s4CapInView] = useInView();
  const [s5ImgRef, s5ImgInView] = useInView();
  const [s5CapRef, s5CapInView] = useInView();
  const [s6ImgRef, s6ImgInView] = useInView();
  const [s7ImgRef, s7ImgInView] = useInView();
  const [pair2CapRef, pair2CapInView] = useInView();
  const [closingRef, closingInView] = useInView();
  const [ctaRef, ctaInView] = useInView();

  const [ch7HeadlineRef, ch7HeadlineInView] = useInView();
  const [ch7CopyRef, ch7CopyInView] = useInView();
  const [ch7BtnRef, ch7BtnInView] = useInView();
  const [ch7NoteRef, ch7NoteInView] = useInView();

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

  const getCh6Stmt = (start: number, end: number, linger = false): React.CSSProperties => {
    if (chapter6Progress <= start) return { opacity: 0, transform: 'translateY(10px)', pointerEvents: 'none' };
    if (chapter6Progress >= end) {
      if (linger) return { opacity: 1, transform: 'translateY(0px)' };
      return { opacity: 0, transform: 'translateY(-8px)', pointerEvents: 'none' };
    }
    const p = (chapter6Progress - start) / (end - start);
    return {
      opacity: Math.sin(p * Math.PI),
      transform: `translateY(${(1 - p * 2) * 10}px)`,
    };
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="bg-[#EAE3D3] text-[#F5F0E8]">
      {/* Chapter 1 - Hero */}
      <section className="relative h-[100vh] w-full overflow-hidden bg-[#FAFAF8] text-[#F5F0E8]">
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
          <div className="absolute inset-0 bg-[#FAFAF8]/15 mix-blend-overlay" />
          {/* Subtle gradient for text legibility at bottom */}
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/40 to-transparent" />
        </div>

        {/* Navigation */}
        <Nav
          theme="dark"
          mounted={mounted}
          position="absolute"
          brandName="Evermor Tales"
          links={[
            { href: "/beginnings", label: "Beginnings" },
            { href: "/about", label: "About" },
            { href: "/begin-your-story", label: "Begin Your Story" },
          ]}
        />

        {/* Hero Content */}
        <div className="absolute bottom-[15%] md:bottom-[22%] left-6 md:left-16 max-w-[640px] z-10 flex flex-col items-start">
          <h1 
            className={`font-serif text-[36px] md:text-[64px] lg:text-[80px] leading-[1.2] font-light text-[#F5F0E8] tracking-[0.01em] transition-opacity duration-1000 ease-in-out delay-300 ${
              mounted ? "opacity-100" : "opacity-0"
            }`}
          >Preserving
          the beginning
          of your family.</h1>
          
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
            <span className="block tracking-widest">→</span>
          </Link>
        </div>
      </section>
      {/* Chapter 2 - Why Evermor Exists */}
      <section className="bg-[#EAE3D3] py-32 md:py-48 flex flex-col items-center">
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

        {/* Belief 1 */}
        <div className="max-w-[680px] mx-auto px-6 md:px-0 text-center mb-0">
          <p
            ref={b1HeadlineRef}
            className={`font-sans font-light uppercase tracking-[0.2em] text-[10px] md:text-[11px] text-[#3A342C]/35 mb-6 transition-all duration-[800ms] ease-out ${
              b1HeadlineInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            I
          </p>
          <h3
            className={`font-serif font-light text-[38px] md:text-[52px] lg:text-[58px] text-[#3A342C] leading-[1.12] tracking-[0.005em] mb-7 md:mb-9 transition-all duration-[800ms] ease-out ${
              b1HeadlineInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: b1HeadlineInView ? '80ms' : '0ms' }}
          >
            People before pictures.
          </h3>
          <p
            ref={b1CopyRef}
            className={`font-sans font-light text-[15px] md:text-[16px] text-[#3A342C]/60 leading-[1.9] tracking-[0.02em] transition-all duration-[800ms] ease-out ${
              b1CopyInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: b1CopyInView ? '100ms' : '0ms' }}
          >
            Every wedding is remembered through the people who lived it. Before we create photographs, we take the time to understand the relationships, emotions, and moments that matter most.
          </p>
        </div>

        {/* Divider */}
        <div className="w-px h-16 md:h-20 bg-[#3A342C]/15 mx-auto my-16 md:my-24" />

        {/* Belief 2 */}
        <div className="max-w-[680px] mx-auto px-6 md:px-0 text-center">
          <p
            ref={b2HeadlineRef}
            className={`font-sans font-light uppercase tracking-[0.2em] text-[10px] md:text-[11px] text-[#3A342C]/35 mb-6 transition-all duration-[800ms] ease-out ${
              b2HeadlineInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            II
          </p>
          <h3
            className={`font-serif font-light text-[38px] md:text-[52px] lg:text-[58px] text-[#3A342C] leading-[1.12] tracking-[0.005em] mb-7 md:mb-9 transition-all duration-[800ms] ease-out ${
              b2HeadlineInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: b2HeadlineInView ? '80ms' : '0ms' }}
          >
            Stories before trends.
          </h3>
          <p
            ref={b2CopyRef}
            className={`font-sans font-light text-[15px] md:text-[16px] text-[#3A342C]/60 leading-[1.9] tracking-[0.02em] transition-all duration-[800ms] ease-out ${
              b2CopyInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: b2CopyInView ? '100ms' : '0ms' }}
          >
            Beautiful imagery may capture attention today, but meaningful stories continue to resonate for generations. We create work that remains timeless long after trends have faded.
          </p>
        </div>

        {/* Divider */}
        <div className="w-px h-16 md:h-20 bg-[#3A342C]/15 mx-auto my-16 md:my-24" />

        {/* Belief 3 */}
        <div className="max-w-[680px] mx-auto px-6 md:px-0 text-center">
          <p
            ref={b3HeadlineRef}
            className={`font-sans font-light uppercase tracking-[0.2em] text-[10px] md:text-[11px] text-[#3A342C]/35 mb-6 transition-all duration-[800ms] ease-out ${
              b3HeadlineInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            III
          </p>
          <h3
            className={`font-serif font-light text-[38px] md:text-[52px] lg:text-[58px] text-[#3A342C] leading-[1.12] tracking-[0.005em] mb-7 md:mb-9 transition-all duration-[800ms] ease-out ${
              b3HeadlineInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: b3HeadlineInView ? '80ms' : '0ms' }}
          >
            Discovery before documentation.
          </h3>
          <p
            ref={b3CopyRef}
            className={`font-sans font-light text-[15px] md:text-[16px] text-[#3A342C]/60 leading-[1.9] tracking-[0.02em] transition-all duration-[800ms] ease-out ${
              b3CopyInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: b3CopyInView ? '100ms' : '0ms' }}
          >
            Every couple is different. Every family carries its own history. Before a single frame is created, we invest time in discovering what makes your story uniquely yours.
          </p>
        </div>

        {/* Divider */}
        <div className="w-px h-16 md:h-20 bg-[#3A342C]/15 mx-auto my-16 md:my-24" />

        {/* Belief 4 */}
        <div className="max-w-[680px] mx-auto px-6 md:px-0 text-center">
          <p
            ref={b4HeadlineRef}
            className={`font-sans font-light uppercase tracking-[0.2em] text-[10px] md:text-[11px] text-[#3A342C]/35 mb-6 transition-all duration-[800ms] ease-out ${
              b4HeadlineInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            IV
          </p>
          <h3
            className={`font-serif font-light text-[38px] md:text-[52px] lg:text-[58px] text-[#3A342C] leading-[1.12] tracking-[0.005em] mb-7 md:mb-9 transition-all duration-[800ms] ease-out ${
              b4HeadlineInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: b4HeadlineInView ? '80ms' : '0ms' }}
          >
            Craft with purpose.
          </h3>
          <p
            ref={b4CopyRef}
            className={`font-sans font-light text-[15px] md:text-[16px] text-[#3A342C]/60 leading-[1.9] tracking-[0.02em] transition-all duration-[800ms] ease-out ${
              b4CopyInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: b4CopyInView ? '100ms' : '0ms' }}
          >
            Every photograph, every film, every edit is made intentionally. We believe craftsmanship is measured not by complexity, but by emotional honesty.
          </p>
        </div>

        {/* Divider */}
        <div className="w-px h-16 md:h-20 bg-[#3A342C]/15 mx-auto my-16 md:my-24" />

        {/* Belief 5 */}
        <div className="max-w-[680px] mx-auto px-6 md:px-0 text-center">
          <p
            ref={b5HeadlineRef}
            className={`font-sans font-light uppercase tracking-[0.2em] text-[10px] md:text-[11px] text-[#3A342C]/35 mb-6 transition-all duration-[800ms] ease-out ${
              b5HeadlineInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            V
          </p>
          <h3
            className={`font-serif font-light text-[38px] md:text-[52px] lg:text-[58px] text-[#3A342C] leading-[1.12] tracking-[0.005em] mb-7 md:mb-9 transition-all duration-[800ms] ease-out ${
              b5HeadlineInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: b5HeadlineInView ? '80ms' : '0ms' }}
          >
            Trust before everything.
          </h3>
          <p
            ref={b5CopyRef}
            className={`font-sans font-light text-[15px] md:text-[16px] text-[#3A342C]/60 leading-[1.9] tracking-[0.02em] transition-all duration-[800ms] ease-out ${
              b5CopyInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: b5CopyInView ? '100ms' : '0ms' }}
          >
            Being invited into one of life's most meaningful moments is a privilege. We carry that responsibility with care, respect, and gratitude throughout the entire journey.
          </p>
        </div>

        {/* Closing */}
        <p
          ref={c4ClosingRef}
          className={`mt-24 md:mt-36 font-serif font-light italic text-[18px] md:text-[22px] text-[#3A342C]/50 tracking-[0.02em] text-center max-w-[600px] mx-auto px-6 md:px-0 transition-all duration-[800ms] ease-out ${
            c4ClosingInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          Every belief shapes the way we preserve your beginning.
        </p>
      </section>
      {/* Chapter 5 - Stories */}
      <section className="bg-[#FAFAF8] pt-32 md:pt-48 pb-32 md:pb-48">
        {/* Header */}
        <div className="max-w-[680px] mx-auto px-6 md:px-0 mb-20 md:mb-32">
          <h2
            ref={headingRef}
            className={`font-serif font-light text-[52px] md:text-[72px] lg:text-[84px] text-[#3A342C] leading-[1.1] tracking-[0.005em] text-center mb-8 md:mb-10 transition-all duration-[800ms] ease-out ${
              headingInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >Beginnings</h2>
          <p
            ref={introRef}
            className={`font-sans font-light text-[15px] md:text-[17px] text-[#3A342C]/60 leading-[1.9] tracking-[0.02em] text-center transition-all duration-[800ms] ease-out ${
              introInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: introInView ? '150ms' : '0ms' }}
          >
            Every beginning is different. Every emotion is real. Every story deserves to be remembered.
          </p>
        </div>

        {/* Layout Block 1 */}
        <Link href="/beginnings/shaun-sowmya" className="block w-full group cursor-pointer">
          <img
            ref={s1ImgRef}
            src="/s1.jpg"
            alt="The beginning of Aditi & Karthik"
            className={`h-[520px] md:h-[700px] lg:h-[820px] w-full object-cover object-center transition-all duration-[1000ms] ease-out group-hover:opacity-90 ${
              s1ImgInView ? "opacity-100" : "opacity-0"
            }`}
          />
          <p
            ref={s1CapRef}
            className={`font-sans font-light italic text-[11px] md:text-[12px] text-[#3A342C]/45 tracking-[0.04em] text-center mt-4 md:mt-5 transition-all duration-[800ms] ease-out ${
              s1CapInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: s1CapInView ? '100ms' : '0ms' }}
          >
            The beginning of Aditi & Karthik.
          </p>
        </Link>

        {/* Layout Block 2 */}
        <Link href="/beginnings/shaun-sowmya" className="block mt-12 md:mt-20 group cursor-pointer">
          <div className="flex flex-col md:flex-row gap-3 md:gap-5 px-4 md:px-8 lg:px-16">
            <img
              ref={s2ImgRef}
              src="/s2.jpg"
              alt="Vertical portrait left"
              className={`w-full flex-1 h-[320px] md:h-[640px] lg:h-[740px] object-cover object-center transition-all duration-[1000ms] ease-out group-hover:opacity-90 ${
                s2ImgInView ? "opacity-100" : "opacity-0"
              }`}
            />
            <img
              ref={s3ImgRef}
              src="/s3.jpg"
              alt="Vertical portrait right"
              className={`w-full flex-1 h-[320px] md:h-[640px] lg:h-[740px] object-cover object-center transition-all duration-[1000ms] ease-out group-hover:opacity-90 ${
                s3ImgInView ? "opacity-100" : "opacity-0"
              }`}
              style={{ transitionDelay: s3ImgInView ? '100ms' : '0ms' }}
            />
          </div>
          <p
            ref={pair1CapRef}
            className={`font-sans font-light italic text-[11px] md:text-[12px] text-[#3A342C]/45 tracking-[0.04em] text-center mt-4 md:mt-5 px-4 md:px-8 lg:px-16 transition-all duration-[800ms] ease-out ${
              pair1CapInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: pair1CapInView ? '100ms' : '0ms' }}
          >
            Before promises became memories.
          </p>
        </Link>

        {/* Layout Block 3 */}
        <Link href="/beginnings/shaun-sowmya" className="block mt-12 md:mt-20 group cursor-pointer">
          <img
            ref={s4ImgRef}
            src="/s4.jpg"
            alt="Cinematic landscape"
            className={`h-[340px] md:h-[460px] lg:h-[520px] w-full object-cover object-center transition-all duration-[1000ms] ease-out group-hover:opacity-90 ${
              s4ImgInView ? "opacity-100" : "opacity-0"
            }`}
          />
          <p
            ref={s4CapRef}
            className={`font-sans font-light italic text-[11px] md:text-[12px] text-[#3A342C]/45 tracking-[0.04em] text-center mt-4 md:mt-5 transition-all duration-[800ms] ease-out ${
              s4CapInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: s4CapInView ? '100ms' : '0ms' }}
          >
            Where the evening held still.
          </p>
        </Link>

        {/* Layout Block 4 */}
        <Link href="/beginnings/shaun-sowmya" className="block mt-12 md:mt-20 group cursor-pointer">
          <div className="max-w-[560px] md:max-w-[680px] mx-auto px-6 md:px-0">
            <img
              ref={s5ImgRef}
              src="/s5.jpg"
              alt="Intimate close-up"
              className={`w-full h-[420px] md:h-[520px] object-cover object-center transition-all duration-[1000ms] ease-out group-hover:opacity-90 ${
                s5ImgInView ? "opacity-100" : "opacity-0"
              }`}
            />
            <p
              ref={s5CapRef}
              className={`font-sans font-light italic text-[11px] md:text-[12px] text-[#3A342C]/45 tracking-[0.04em] text-center mt-4 md:mt-5 transition-all duration-[800ms] ease-out ${
                s5CapInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: s5CapInView ? '100ms' : '0ms' }}
            >
              The people who made this day unforgettable.
            </p>
          </div>
        </Link>

        {/* Layout Block 5 */}
        <Link href="/beginnings/shaun-sowmya" className="block mt-12 md:mt-20 group cursor-pointer">
          <div className="flex flex-col md:flex-row gap-3 md:gap-5 px-4 md:px-8 lg:px-16">
            <img
              ref={s6ImgRef}
              src="/s6.jpg"
              alt="Vertical portrait left"
              className={`w-full flex-1 h-[320px] md:h-[640px] lg:h-[740px] object-cover object-center transition-all duration-[1000ms] ease-out group-hover:opacity-90 ${
                s6ImgInView ? "opacity-100" : "opacity-0"
              }`}
            />
            <img
              ref={s7ImgRef}
              src="/s7.jpg"
              alt="Vertical portrait right"
              className={`w-full flex-1 h-[320px] md:h-[640px] lg:h-[740px] object-cover object-center transition-all duration-[1000ms] ease-out group-hover:opacity-90 ${
                s7ImgInView ? "opacity-100" : "opacity-0"
              }`}
              style={{ transitionDelay: s7ImgInView ? '100ms' : '0ms' }}
            />
          </div>
          <p
            ref={pair2CapRef}
            className={`font-sans font-light italic text-[11px] md:text-[12px] text-[#3A342C]/45 tracking-[0.04em] text-center mt-4 md:mt-5 px-4 md:px-8 lg:px-16 transition-all duration-[800ms] ease-out ${
              pair2CapInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: pair2CapInView ? '100ms' : '0ms' }}
          >
            Every family begins with a moment like this.
          </p>
        </Link>

        {/* Closing Block */}
        <div className="mt-24 md:mt-36 text-center max-w-[680px] mx-auto px-6 md:px-0">
          <p
            ref={closingRef}
            className={`font-serif font-light italic text-[22px] md:text-[28px] text-[#3A342C]/60 tracking-[0.015em] leading-[1.5] mb-10 md:mb-14 transition-all duration-[800ms] ease-out ${
              closingInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            No two beginnings are ever the same.
          </p>
          <span
            ref={ctaRef}
            className={`flex flex-col items-center gap-2 font-sans font-light text-[13px] md:text-[14px] text-[#3A342C]/50 tracking-[0.05em] hover:text-[#3A342C]/85 transition-all duration-[800ms] ease-out cursor-pointer ${
              ctaInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: ctaInView ? '150ms' : '0ms' }}
          >
            <span>Discover Your Story</span>
            <span>→</span>
          </span>
        </div>
      </section>
      {/* Chapter 6 — Memory */}
      {/* Sticky scroll sequence */}
      <section ref={chapter6Ref} className="relative h-[600vh] w-full bg-[#F8F6F2]">
        <div className="sticky top-0 h-[100vh] overflow-hidden flex items-center justify-center">

          {/* Statement 1 */}
          <div
            className="absolute inset-0 flex items-center justify-center px-6"
            style={getCh6Stmt(0.00, 0.17)}
          >
            <p className="font-serif font-light text-[32px] md:text-[50px] lg:text-[58px] text-[#3A342C] leading-[1.2] tracking-[0.005em] text-center max-w-[720px]">
              Every family remembers differently.
            </p>
          </div>

          {/* Statement 2 — four lines */}
          <div
            className="absolute inset-0 flex items-center justify-center px-6"
            style={getCh6Stmt(0.20, 0.42)}
          >
            <div className="text-center max-w-[600px]">
              <p className="font-serif font-light text-[22px] md:text-[34px] lg:text-[40px] text-[#3A342C] leading-[1.7] tracking-[0.01em]">
                Some remember voices.<br />
                Some remember photographs.<br />
                Some remember places.<br />
                Some remember silence.
              </p>
            </div>
          </div>

          {/* Statement 3 */}
          <div
            className="absolute inset-0 flex items-center justify-center px-6"
            style={getCh6Stmt(0.44, 0.62)}
          >
            <p className="font-serif font-light text-[28px] md:text-[44px] lg:text-[52px] text-[#3A342C] leading-[1.25] tracking-[0.005em] text-center max-w-[700px]">
              But every family deserves something that brings them back.
            </p>
          </div>

          {/* Statement 4 */}
          <div
            className="absolute inset-0 flex items-center justify-center px-6"
            style={getCh6Stmt(0.64, 0.79)}
          >
            <p className="font-serif font-light text-[30px] md:text-[48px] lg:text-[56px] text-[#3A342C] leading-[1.2] tracking-[0.005em] text-center max-w-[680px]">
              We don't simply preserve what happened.
            </p>
          </div>

          {/* Statement 5 — lingers */}
          <div
            className="absolute inset-0 flex items-center justify-center px-6"
            style={{ ...getCh6Stmt(0.81, 1.00, true), transition: 'opacity 1.2s ease, transform 1.2s ease' }}
          >
            <p className="font-serif font-light text-[40px] md:text-[62px] lg:text-[72px] text-[#3A342C] leading-[1.1] tracking-[0.005em] text-center max-w-[680px]">
              We preserve what it meant.
            </p>
          </div>

        </div>
      </section>
      {/* Chapter 6 — Closing (below sticky scroll) */}
      <section className="bg-[#F8F6F2] pt-32 md:pt-48 pb-40 md:pb-60">
        <div className="max-w-[640px] mx-auto px-6 md:px-0 text-center">
          <p
            ref={ch6ClosingRef}
            className={`font-serif font-light text-[18px] md:text-[22px] lg:text-[24px] text-[#3A342C]/65 leading-[1.7] tracking-[0.015em] mb-14 md:mb-20 transition-all duration-[1000ms] ease-out ${
              ch6ClosingInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            Every Evermor story begins with understanding what is worth remembering.
          </p>
        </div>
      </section>
      {/* Chapter 7 — Final Invitation */}
      <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">

        {/* Full-screen photograph */}
        <img
          src="/chapter7.jpg"
          alt="A couple walking away at golden hour"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-[#1A1612]/55" />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-[640px] mx-auto">

          <h2
            ref={ch7HeadlineRef}
            className={`font-serif font-light text-[36px] md:text-[52px] lg:text-[60px] text-[#F5F0E8] leading-[1.15] tracking-[0.01em] mb-10 md:mb-14 transition-all duration-[1200ms] ease-out ${
              ch7HeadlineInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            Every family has a beginning.
          </h2>

          <p
            ref={ch7CopyRef}
            className={`font-serif font-light text-[16px] md:text-[19px] text-[#F5F0E8]/70 leading-[1.75] tracking-[0.01em] mb-14 md:mb-20 transition-all duration-[1200ms] ease-out ${
              ch7CopyInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: ch7CopyInView ? '200ms' : '0ms' }}
          >
            Some beginnings last a day. The memories they create can last forever. If our way of seeing the world feels like yours, we'd be honoured to preserve the beginning of your family's story.
          </p>

          <div
            ref={ch7BtnRef}
            className={`transition-all duration-[1200ms] ease-out ${
              ch7BtnInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
            style={{ transitionDelay: ch7BtnInView ? '400ms' : '0ms' }}
          >
            <button className="font-sans font-light text-[12px] md:text-[13px] text-[#F5F0E8]/80 tracking-[0.2em] uppercase border border-[#F5F0E8]/35 px-12 py-4 hover:border-[#F5F0E8]/80 hover:text-[#F5F0E8] transition-all duration-500 ease-out">
              Begin Your Story
            </button>
          </div>

          <p
            ref={ch7NoteRef}
            className={`mt-10 font-sans font-light text-[10px] md:text-[11px] text-[#F5F0E8]/38 tracking-[0.12em] leading-[1.8] transition-all duration-[1200ms] ease-out ${
              ch7NoteInView ? "opacity-100" : "opacity-0"
            }`}
            style={{ transitionDelay: ch7NoteInView ? '650ms' : '0ms' }}
          >
            Accepting a limited number of weddings each year so every story receives the care it deserves.
          </p>

        </div>
      </section>
    </div>
  );
}
