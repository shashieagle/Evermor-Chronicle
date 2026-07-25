import { useEffect, useState, useRef } from "react";
import { Link } from "wouter";
import Nav from "../components/Nav";

function useInView(threshold = 0.1) {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<any>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsInView(true); observer.unobserve(el); } },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return [ref, isInView] as const;
}

const posts = [
  {
    slug: "on-the-art-of-presence",
    category: "Reflection",
    title: "On the art of presence — being there without being seen",
    date: "July 2025",
    image: "/belief1-new.jpg",
    excerpt: "The best wedding photographs are made by photographers who have learned to disappear.",
  },
  {
    slug: "the-light-in-udaipur",
    category: "Field Notes",
    title: "The light in Udaipur — a wedding through monsoon haze",
    date: "June 2025",
    image: "/belief2-new.jpg",
    excerpt: "Monsoon weddings carry a particular kind of beauty — soft, diffused, almost accidental.",
  },
  {
    slug: "what-a-first-look-really-is",
    category: "Reflection",
    title: "What a first look really is",
    date: "May 2025",
    image: "/belief3-new.jpg",
    excerpt: "It has nothing to do with choreography. It is the moment a person realises this is real.",
  },
  {
    slug: "choosing-your-photographer",
    category: "For Couples",
    title: "Eight questions worth asking before you book a wedding photographer",
    date: "April 2025",
    image: "/belief1-new.jpg",
    excerpt: "Not about price, packages, or albums. The questions that actually matter.",
  },
  {
    slug: "coorg-in-november",
    category: "Field Notes",
    title: "Coorg in November — why destination weddings change everything",
    date: "March 2025",
    image: "/belief2-new.jpg",
    excerpt: "When the setting is unfamiliar, everyone relaxes into themselves a little more.",
  },
  {
    slug: "why-we-stopped-editing-like-films",
    category: "Behind the Work",
    title: "Why we stopped editing weddings like they were films",
    date: "February 2025",
    image: "/belief3-new.jpg",
    excerpt: "Heavy grades age badly. The light that was actually there is almost always enough.",
  },
];

function PostCard({ post, index }: { post: typeof posts[0]; index: number }) {
  const [ref, inView] = useInView();
  return (
    <Link href={`/journal/${post.slug}`}>
      <div
        ref={ref}
        className="group cursor-pointer"
        style={{
          opacity: inView ? 1 : 0,
          transform: inView ? "translateY(0)" : "translateY(20px)",
          transition: `opacity 700ms ease-out ${index * 70}ms, transform 700ms ease-out ${index * 70}ms`,
        }}
      >
        {/* Cover image */}
        <div className="overflow-hidden aspect-[3/4] bg-[#E8E7E4] mb-5">
          <img
            src={post.image}
            alt={post.title}
            loading="lazy"
            className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            style={{ filter: "sepia(0.04) contrast(1.04)" }}
          />
        </div>

        {/* Meta */}
        <p className="font-sans font-light text-[10px] uppercase tracking-[0.28em] text-[#3A342C]/38 mb-3">
          {post.category} &nbsp;·&nbsp; {post.date}
        </p>
        <h2 className="font-serif font-light text-[18px] md:text-[20px] text-[#3A342C] leading-[1.3] tracking-[0.005em] mb-3 group-hover:opacity-60 transition-opacity duration-300">
          {post.title}
        </h2>
        <p className="font-sans font-light text-[13px] text-[#3A342C]/50 leading-[1.8] tracking-[0.01em] mb-4">
          {post.excerpt}
        </p>
        <span className="font-sans font-light text-[11px] uppercase tracking-[0.18em] text-[#3A342C]/35 group-hover:text-[#3A342C]/70 transition-colors duration-300">
          Read →
        </span>
      </div>
    </Link>
  );
}

export default function Journal() {
  const [mounted, setMounted] = useState(false);
  const [headingRef, headingInView] = useInView();
  const [introRef, introInView] = useInView();

  useEffect(() => { setMounted(true); }, []);

  return (
    <div className="bg-[#FAFAFA] text-[#3A342C] min-h-screen">

      <Nav
        theme="light"
        mounted={mounted}
        position="fixed"
        links={[
          { href: "/", label: "Home" },
          { href: "/beginnings", label: "Beginnings" },
          { href: "/journal", label: "Journal", active: true },
          { href: "/about", label: "About" },
          { href: "/begin-your-story", label: "Begin Your Story" },
        ]}
      />

      {/* Header */}
      <div className="pt-28 md:pt-52 pb-14 md:pb-24 max-w-[760px] mx-auto px-6 md:px-0 text-center">
        <p className="font-sans uppercase tracking-[0.38em] text-[8px] md:text-[9px] text-[#3A342C]/30 mb-6">
          ✦ &nbsp; Evermor Tales &nbsp; ✦
        </p>
        <h1
          ref={headingRef}
          className={`font-serif font-light text-[52px] md:text-[80px] lg:text-[100px] text-[#3A342C] leading-[1.0] tracking-[0.005em] mb-8 md:mb-10 transition-all duration-[900ms] ease-out ${headingInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}`}
        >
          Journal
        </h1>
        <p
          ref={introRef}
          className={`font-sans font-light text-[14px] md:text-[15px] text-[#3A342C]/50 leading-[1.9] tracking-[0.02em] max-w-[480px] mx-auto transition-all duration-[900ms] ease-out ${introInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          style={{ transitionDelay: introInView ? "150ms" : "0ms" }}
        >
          Thoughts on light, memory, and the quiet moments that make a family's story worth keeping.
        </p>
      </div>

      {/* Thin rule */}
      <div className="max-w-[1060px] mx-auto px-6 md:px-10">
        <div className="border-t border-[#3A342C]/10" />
      </div>

      {/* Grid */}
      <div className="max-w-[1060px] mx-auto px-6 md:px-10 pt-16 md:pt-24 pb-24 md:pb-48">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 md:gap-x-12 gap-y-16 md:gap-y-20">
          {posts.map((post, i) => (
            <PostCard key={post.slug} post={post} index={i} />
          ))}
        </div>
      </div>

    </div>
  );
}
