import { useEffect, useState } from "react";
import { Link, useParams } from "wouter";

// Story data — add new beginnings here
const stories: Record<string, {
  slug: string;
  title: string;
  couple: string;
  location: string;
  heroImage: string;
  hasFilm: boolean;
}> = {
  "shaun-sowmya": {
    slug: "shaun-sowmya",
    title: "A Second Beginning",
    couple: "Shaun & Sowmya",
    location: "Bangalore, India",
    heroImage: "/beginnings-shaun-sowmya.jpg",
    hasFilm: true,
  },
};

export default function Beginnings() {
  const { slug } = useParams<{ slug: string }>();
  const [mounted, setMounted] = useState(false);

  const story = slug ? stories[slug] : undefined;

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="bg-[#EAE3D3] text-[#F5F0E8]">

      {/* Chapter 1 — Hero */}
      <section className="relative h-[100vh] w-full overflow-hidden bg-[#1A1612]">

        {/* Hero image */}
        <div
          className={`absolute inset-0 z-0 transition-opacity duration-[1200ms] ease-in-out ${
            mounted ? "opacity-100" : "opacity-0"
          }`}
        >
          {story && (
            <img
              src={story.heroImage}
              alt={`${story.couple} — ${story.location}`}
              className="w-full h-full object-cover object-center"
              loading="eager"
            />
          )}
          {/* Subtle readability overlay — light touch only */}
          <div className="absolute inset-0 bg-[#1A1612]/25" />
          {/* Soft bottom gradient for text legibility */}
          <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/45 to-transparent" />
        </div>

        {/* Navigation — identical to Homepage */}
        <nav
          className={`absolute top-0 left-0 right-0 z-10 px-6 py-6 md:px-[100px] md:py-10 flex justify-between items-start transition-opacity duration-[800ms] ease-in-out ${
            mounted ? "opacity-100" : "opacity-0"
          }`}
        >
          <Link href="/" className="font-serif text-2xl tracking-[0.02em] font-light text-[#F5F0E8] hover:opacity-80 transition-opacity duration-300">
            Evermor
          </Link>
          <div className="flex gap-8 font-sans text-[13px] tracking-wide font-light">
            <Link href="/" className="text-[#F5F0E8]/75 hover:text-[#F5F0E8] transition-colors duration-300">
              Home
            </Link>
            <Link href="/beginnings" className="text-[#F5F0E8] transition-colors duration-300">
              Beginnings
            </Link>
            <Link href="/about" className="text-[#F5F0E8]/75 hover:text-[#F5F0E8] transition-colors duration-300">
              About
            </Link>
            <Link href="/begin-your-story" className="text-[#F5F0E8]/75 hover:text-[#F5F0E8] transition-colors duration-300">
              Begin Your Story
            </Link>
          </div>
        </nav>

        {/* Hero content — bottom-left */}
        <div className="absolute bottom-[80px] left-6 md:left-[100px] z-10 flex flex-col items-start">

          {/* Title */}
          <h1
            className={`font-serif text-[42px] md:text-[64px] lg:text-[76px] leading-[1.1] font-light text-[#F5F0E8] tracking-[0.01em] transition-all duration-[800ms] ease-out delay-[200ms] ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
            }`}
          >
            {story?.title ?? ""}
          </h1>

          {/* Couple names */}
          <p
            className={`mt-4 md:mt-5 font-sans text-[16px] md:text-[18px] font-light text-[#F5F0E8]/90 tracking-[0.06em] transition-all duration-[800ms] ease-out delay-[400ms] ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
            }`}
          >
            {story?.couple ?? ""}
          </p>

          {/* Location */}
          <p
            className={`mt-2 md:mt-3 font-sans text-[11px] md:text-[12px] font-light text-[#F5F0E8]/50 uppercase tracking-[0.28em] transition-all duration-[800ms] ease-out delay-[600ms] ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
            }`}
          >
            {story?.location ?? ""}
          </p>

          {/* Down indicator — gentle pulse, no bounce */}
          <div
            className={`mt-10 md:mt-14 transition-all duration-[800ms] ease-out delay-[900ms] ${
              mounted ? "opacity-100" : "opacity-0"
            }`}
            style={{ animation: "evermor-breathe 3s ease-in-out infinite" }}
            aria-hidden="true"
          >
            <svg
              width="18"
              height="28"
              viewBox="0 0 18 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <line x1="9" y1="0" x2="9" y2="20" stroke="rgba(245,240,232,0.45)" strokeWidth="1"/>
              <path d="M2 14 L9 22 L16 14" stroke="rgba(245,240,232,0.45)" strokeWidth="1" fill="none"/>
            </svg>
          </div>
        </div>

      </section>

      {/* Future sections — placeholders only */}
      <section id="beginning-introduction"></section>
      <section id="story-gallery"></section>
      <section id="story-film"></section>
      <section id="quiet-moments"></section>
      <section id="reflection"></section>
      <section id="next-beginning"></section>

    </div>
  );
}
