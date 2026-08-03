import { useEffect, useState, useRef } from "react";
import { Link } from "wouter";
import Nav from "../components/Nav";

const BASE = import.meta.env.BASE_URL?.replace(/\/$/, "") || "";
const API  = `${BASE}/api`;

interface ApiStory {
  slug: string;
  title: string;
  couple: string;
  location: string;
  heroImage: string | null;
  hasFilm: boolean;
}

function useInView(threshold = 0.15) {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<any>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // If element is already above the viewport (page loaded mid-scroll), show it immediately
    const rect = el.getBoundingClientRect();
    if (rect.bottom < window.innerHeight * 0.5) {
      setIsInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsInView(true); observer.unobserve(el); } },
      { threshold, rootMargin: "9999px 0px 0px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return [ref, isInView] as const;
}

export default function BeginningsIndex() {
  const [mounted, setMounted] = useState(false);
  const [stories, setStories] = useState<ApiStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [headingRef, headingInView] = useInView();
  const [introRef, introInView] = useInView();

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    fetch(`${API}/stories`)
      .then(r => r.json())
      .then(d => { setStories(d.stories || []); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-[#FAFAF8] text-[#3A342C] min-h-screen">

      {/* Navigation */}
      <Nav
        theme="light"
        mounted={mounted}
        position="fixed"
        links={[
          { href: "/", label: "Home" },
          { href: "/about", label: "About" },
          { href: "/beginnings", label: "Beginnings", active: true },
          { href: "/approach", label: "Approach" },
          { href: "/journal", label: "Journal" },
          { href: "/begin-your-story", label: "Begin Your Story" },
        ]}
      />

      {/* Header */}
      <div className="pt-24 md:pt-56 pb-12 md:pb-28 max-w-[680px] mx-auto px-6 md:px-0 text-center">
        <h1
          ref={headingRef}
          className={`font-serif font-light text-[38px] md:text-[52px] lg:text-[84px] text-[#3A342C] leading-[1.1] tracking-[0.005em] mb-8 md:mb-10 transition-all duration-[900ms] ease-out ${headingInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
        >
          Beginnings
        </h1>
        <p
          ref={introRef}
          className={`font-sans font-light text-[15px] md:text-[17px] text-[#3A342C]/55 leading-[1.9] tracking-[0.02em] transition-all duration-[900ms] ease-out ${introInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
          style={{ transitionDelay: introInView ? "150ms" : "0ms" }}
        >
          Every family has a beginning. These are the ones we've had the honour of preserving.
        </p>
      </div>

      {/* Thin rule */}
      <div className="max-w-[900px] mx-auto px-6 md:px-0">
        <div className="border-t border-[#3A342C]/12" />
      </div>

      {/* Stories */}
      <div className="max-w-[900px] mx-auto px-6 md:px-0">
        {loading ? (
          <div className="py-20 text-center font-sans font-light text-[13px] text-[#3A342C]/35 tracking-[0.12em] uppercase">
            Loading…
          </div>
        ) : stories.length === 0 ? (
          <div className="py-20 text-center font-serif font-light text-[20px] text-[#3A342C]/40 italic">
            Stories coming soon.
          </div>
        ) : (
          stories.map((story, i) => (
            <StoryRow key={story.slug} story={story} index={i} />
          ))
        )}
      </div>

      {/* Footer space */}
      <div className="pb-20 md:pb-40" />
    </div>
  );
}

function StoryRow({ story, index }: { story: ApiStory; index: number }) {
  const [ref, inView] = useInView();
  const [imgRef, imgInView] = useInView(0.05);

  return (
    <Link href={`/beginnings/${story.slug}`}>
      <div
        ref={ref}
        className={`group flex flex-col md:flex-row gap-8 md:gap-14 py-16 md:py-20 border-b border-[#3A342C]/12 cursor-pointer transition-all duration-[800ms] ease-out ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
        style={{ transitionDelay: inView ? `${index * 80}ms` : "0ms" }}
      >
        {/* Image */}
        <div className="w-full md:w-[380px] lg:w-[440px] shrink-0 overflow-hidden bg-[#EAE3D3] aspect-[3/2]">
          {story.heroImage ? (
            <img
              ref={imgRef}
              src={story.heroImage}
              alt={`${story.couple} — ${story.location}`}
              loading="lazy"
              className={`w-full h-full object-cover object-center transition-all duration-[700ms] ease-out group-hover:scale-[1.03] ${imgInView ? "opacity-100" : "opacity-0"}`}
            />
          ) : (
            <div className="w-full h-full" />
          )}
        </div>

        {/* Meta */}
        <div className="flex flex-col justify-center">
          <p className="font-sans font-light text-[11px] uppercase tracking-[0.28em] text-[#3A342C]/40 mb-4">
            {story.location}
          </p>
          <h2 className="font-serif font-light text-[28px] md:text-[36px] text-[#3A342C] leading-[1.2] tracking-[0.01em] mb-3 group-hover:opacity-70 transition-opacity duration-300">
            {story.title}
          </h2>
          <p className="font-sans font-light text-[14px] text-[#3A342C]/55 tracking-[0.05em] mb-6">
            {story.couple}
          </p>
          {story.hasFilm && (
            <p className="font-sans font-light text-[11px] uppercase tracking-[0.2em] text-[#3A342C]/35">
              Film included
            </p>
          )}
          <span className="mt-8 font-sans font-light text-[12px] tracking-[0.12em] text-[#3A342C]/40 group-hover:text-[#3A342C]/80 transition-colors duration-300 uppercase">
            View story →
          </span>
        </div>
      </div>
    </Link>
  );
}
