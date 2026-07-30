import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import Nav from "../components/Nav";

// ─── Reuse site-wide scroll-fade ─────────────────────────────────────────────
function useInView(threshold = 0.06) {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setIsInView(true); obs.unobserve(el); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, isInView] as const;
}

function Fade({
  children,
  delay = 0,
  className = "",
  style = {},
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  const [ref, inView] = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        transition: `opacity 800ms ease-out ${delay}ms, transform 800ms ease-out ${delay}ms`,
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(14px)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ─── Auto-expanding textarea ──────────────────────────────────────────────────
function GrowingTextarea({
  id,
  placeholder,
}: {
  id: string;
  placeholder: string;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);
  function handleInput() {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }
  return (
    <textarea
      id={id}
      name={id}
      ref={ref}
      rows={3}
      placeholder={placeholder}
      onInput={handleInput}
      className="w-full resize-none bg-transparent font-serif font-light text-[#3A342C] placeholder-[#3A342C]/25 outline-none border-b border-[#3A342C]/10 focus:border-[#3A342C]/45 pb-3 leading-relaxed transition-colors duration-300"
      style={{ fontSize: "clamp(16px, 1.3vw, 18px)", minHeight: 90 }}
    />
  );
}

// ─── Underline text input ─────────────────────────────────────────────────────
function LineInput({
  id,
  type = "text",
  placeholder,
  required = false,
}: {
  id: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <input
      id={id}
      name={id}
      type={type}
      placeholder={placeholder}
      required={required}
      className="w-full bg-transparent font-serif font-light text-[#3A342C] placeholder-[#3A342C]/25 outline-none border-b border-[#3A342C]/10 focus:border-[#3A342C]/45 pb-2 transition-colors duration-300"
      style={{ fontSize: "clamp(16px, 1.3vw, 18px)" }}
    />
  );
}

// ─── Underline select ─────────────────────────────────────────────────────────
function LineSelect({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <select
        id={id}
        name={id}
        defaultValue=""
        className="w-full bg-transparent font-serif font-light text-[#3A342C] outline-none border-b border-[#3A342C]/10 focus:border-[#3A342C]/45 pb-2 pr-6 transition-colors duration-300 appearance-none cursor-pointer"
        style={{ fontSize: "clamp(16px, 1.3vw, 18px)" }}
      >
        {children}
      </select>
      {/* Visible dropdown indicator */}
      <span
        className="absolute right-1 bottom-[10px] pointer-events-none text-[#3A342C]/35"
        aria-hidden="true"
      >
        <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
          <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </span>
    </div>
  );
}

// ─── Field wrapper with label + spacing ──────────────────────────────────────
function Field({
  label,
  htmlFor,
  optional = false,
  children,
}: {
  label: string;
  htmlFor: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Fade>
      <div style={{ marginBottom: "clamp(48px, 6vw, 72px)" }}>
        <label
          htmlFor={htmlFor}
          className="block font-sans font-light tracking-[0.1em] uppercase text-[#3A342C]/55 mb-4"
          style={{ fontSize: "clamp(9px, 0.85vw, 11px)" }}
        >
          {label}
          {optional && (
            <span className="ml-2 normal-case tracking-normal opacity-60" style={{ fontSize: "0.9em" }}>
              — optional
            </span>
          )}
        </label>
        {children}
      </div>
    </Fade>
  );
}

// ─── Editorial section heading ────────────────────────────────────────────────
function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <Fade>
      <p
        className="font-serif font-light text-[#3A342C]/60 italic"
        style={{
          fontSize: "clamp(16px, 1.4vw, 20px)",
          marginBottom: "clamp(48px, 6vw, 72px)",
          marginTop: "clamp(72px, 9vw, 112px)",
        }}
      >
        {children}
      </p>
    </Fade>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function BeginYourStory() {
  const [mounted, setMounted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [service, setService] = useState("");

  useEffect(() => { setMounted(true); }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // ── Confirmation screen ────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="bg-[#FAFAF8] min-h-screen flex flex-col">
        <div className="relative">
          <Nav
            theme="light"
            mounted={mounted}
            position="absolute"
            links={[
              { href: "/", label: "Home" },
              { href: "/beginnings", label: "Beginnings" },
              { href: "/journal", label: "Journal" },
              { href: "/about", label: "About" },
              { href: "/approach", label: "Approach" },
              { href: "/begin-your-story", label: "Begin Your Story", active: true },
            ]}
          />
        </div>
        <div className="flex-1 flex flex-col items-center justify-center text-center px-6" style={{ paddingBottom: "15vh" }}>
          <p
            className="font-serif font-light text-[#3A342C] leading-[1.8]"
            style={{ fontSize: "clamp(22px, 2.8vw, 36px)", maxWidth: 560 }}
          >
            Thank you.
          </p>
          <p
            className="font-serif font-light text-[#3A342C]/65 leading-[1.8] mt-6"
            style={{ fontSize: "clamp(15px, 1.3vw, 18px)", maxWidth: 520 }}
          >
            We'll read every word you've shared and come back to you within two working days.
          </p>
        </div>
      </div>
    );
  }

  // ── Main page ──────────────────────────────────────────────────────────────
  return (
    <div className="bg-[#FAFAF8] text-[#3A342C]">

      {/* ── 1. Hero — no image, pure typography ───────────────────── */}
      <section
        className="relative flex flex-col items-center justify-center text-center md:min-h-[85vh]"
        style={{ padding: "clamp(110px, 18vh, 140px) clamp(24px, 8vw, 100px) clamp(40px, 8vh, 80px)" }}
      >
        {/* Nav */}
        <Nav
          theme="light"
          mounted={mounted}
          position="absolute"
          links={[
            { href: "/", label: "Home" },
            { href: "/beginnings", label: "Beginnings" },
            { href: "/about", label: "About" },
            { href: "/approach", label: "Approach" },
            { href: "/begin-your-story", label: "Begin Your Story", active: true },
          ]}
        />

        {/* Headline */}
        <h1
          className="font-serif font-light text-[#3A342C] tracking-[0.01em] leading-[1.1]"
          style={{
            fontSize: "clamp(38px, 5.5vw, 76px)",
            transition: "opacity 800ms ease-out 150ms, transform 800ms ease-out 150ms",
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(18px)",
          }}
        >
          Begin Your Story
        </h1>

        {/* Supporting copy */}
        <p
          className="font-serif font-light text-[#3A342C]/65 leading-[1.8] mt-6"
          style={{
            fontSize: "clamp(15px, 1.35vw, 19px)",
            maxWidth: 520,
            transition: "opacity 800ms ease-out 320ms, transform 800ms ease-out 320ms",
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(14px)",
          }}
        >
          Every story begins with a conversation.
          <br />
          We'd love to know a little about the two of you before we ever pick up a camera.
        </p>

        {/* Scroll indicator — hidden on mobile where section has no min-height */}
        <div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2"
          style={{
            transition: "opacity 800ms ease-out 600ms",
            opacity: mounted ? 1 : 0,
          }}
          aria-hidden="true"
        >
          <span
            className="font-sans tracking-[0.16em] uppercase text-[#3A342C]/35"
            style={{ fontSize: 9 }}
          >
            Scroll
          </span>
          <svg width="1" height="32" viewBox="0 0 1 32" fill="none">
            <line x1="0.5" y1="0" x2="0.5" y2="32" stroke="#3A342C" strokeOpacity="0.25" />
          </svg>
        </div>
      </section>

      {/* ── 2. Before We Begin — personal editorial note ────────────── */}
      <section
        style={{
          paddingTop: "clamp(56px, 12vw, 140px)",
          paddingBottom: "clamp(56px, 12vw, 140px)",
          paddingLeft: "clamp(24px, 8vw, 100px)",
          paddingRight: "clamp(24px, 8vw, 100px)",
        }}
      >
        <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>

          <Fade>
            <p
              className="font-sans font-light tracking-[0.1em] uppercase text-[#3A342C]/45 mb-8"
              style={{ fontSize: "clamp(9px, 0.85vw, 11px)" }}
            >
              Before We Begin
            </p>
          </Fade>

          {[
            "First, congratulations.",
            "If you've found your way here, you're probably in the middle of planning one of the most meaningful days of your lives together.",
            "Thank you for taking the time to explore our work.",
            "Before we talk about photographs or films, we'd simply love to get to know the two of you.",
            "The form below is just the beginning of that conversation.",
            "Share as much or as little as you'd like.",
            "We'll read every enquiry personally and, if it feels right, we'd love to meet you and hear your story.",
          ].map((line, i) => (
            <Fade key={i} delay={i * 40}>
              <p
                className="font-serif font-light text-[#3A342C] leading-[1.85]"
                style={{
                  fontSize: "clamp(18px, 1.6vw, 22px)",
                  marginBottom: "clamp(16px, 2.2vw, 28px)",
                }}
              >
                {line}
              </p>
            </Fade>
          ))}

        </div>
      </section>

      {/* ── 3. The Conversation ─────────────────────────────────────── */}
      <section
        aria-label="Begin your story"
        style={{
          paddingBottom: "clamp(80px, 10vw, 140px)",
          paddingLeft: "clamp(24px, 8vw, 100px)",
          paddingRight: "clamp(24px, 8vw, 100px)",
        }}
      >
        <form
          onSubmit={handleSubmit}
          style={{ maxWidth: 720, margin: "0 auto" }}
          noValidate
        >
          {/* — Basic details ——————————————————————————————— */}
          <Field label="Your name" htmlFor="your-name">
            <LineInput id="your-name" placeholder="Your first name" required />
          </Field>

          <Field label="Your partner's name" htmlFor="partner-name">
            <LineInput id="partner-name" placeholder="Their first name" required />
          </Field>

          <Field label="Email address" htmlFor="email">
            <LineInput id="email" type="email" placeholder="you@example.com" required />
          </Field>

          <Field label="Phone number" htmlFor="phone">
            <LineInput id="phone" type="tel" placeholder="+91 98765 43210" />
          </Field>

          <Field label="Where are you based?" htmlFor="location">
            <LineInput id="location" placeholder="Bangalore, India" />
          </Field>

          <Field label="Wedding date" htmlFor="wedding-date">
            <LineInput id="wedding-date" type="date" placeholder="We're still deciding." />
          </Field>

          {/* — Tell us about yourselves ———————————————————— */}
          <SectionHeading>Tell us a little about yourselves.</SectionHeading>

          <Field label="About you" htmlFor="about-you">
            <GrowingTextarea
              id="about-you"
              placeholder="We'd love to know anything you'd like to share before we meet—how you met, what you're dreaming of for your wedding, or simply what made you reach out to Evermor."
            />
          </Field>

          {/* — A few practical details ———————————————————— */}
          <SectionHeading>A few practical details.</SectionHeading>

          <Field label="Venue" htmlFor="venue" optional>
            <LineInput id="venue" placeholder="If you've chosen one already." />
          </Field>

          <Field label="Estimated guest count" htmlFor="guest-count">
            <LineSelect id="guest-count">
              <option value="" disabled className="text-[#3A342C]/40">Select an estimate</option>
              <option value="below-100">Below 100</option>
              <option value="100-200">100–200</option>
              <option value="200-400">200–400</option>
              <option value="400+">400+</option>
              <option value="not-sure">We're not sure yet</option>
            </LineSelect>
          </Field>

          <Field label="What are you looking for?" htmlFor="service">
            <div className="flex flex-col gap-5 pt-1" role="radiogroup" aria-label="Service type">
              {[
                { value: "photography", label: "Photography" },
                { value: "photography-film", label: "Photography + Film" },
                { value: "exploring", label: "We're still exploring" },
              ].map(({ value, label }) => (
                <label
                  key={value}
                  className="flex items-center gap-4 cursor-pointer group"
                >
                  <input
                    type="radio"
                    name="service"
                    value={value}
                    checked={service === value}
                    onChange={() => setService(value)}
                    className="sr-only"
                  />
                  {/* Custom radio */}
                  <span
                    className="shrink-0 w-[14px] h-[14px] rounded-full border transition-all duration-300"
                    style={{
                      borderColor: service === value ? "#3A342C" : "rgba(58,52,44,0.3)",
                      backgroundColor: service === value ? "#3A342C" : "transparent",
                      boxShadow: service === value ? "inset 0 0 0 3px #F5F0E8" : "none",
                    }}
                    aria-hidden="true"
                  />
                  <span
                    className="font-serif font-light text-[#3A342C] transition-opacity duration-200 group-hover:opacity-70"
                    style={{ fontSize: "clamp(15px, 1.3vw, 18px)" }}
                  >
                    {label}
                  </span>
                </label>
              ))}
            </div>
          </Field>

          <Field label="Budget range" htmlFor="budget">
            <LineSelect id="budget">
              <option value="" disabled className="text-[#3A342C]/40">Select a range</option>
              <option value="2-4">₹2–4 Lakhs</option>
              <option value="4-6">₹4–6 Lakhs</option>
              <option value="6-8">₹6–8 Lakhs</option>
              <option value="8+">₹8 Lakhs+</option>
              <option value="discuss">Let's discuss together</option>
            </LineSelect>
          </Field>

          {/* — Submission area ———————————————————————————— */}
          <Fade>
            <div
              style={{
                marginTop: "clamp(72px, 10vw, 112px)",
                textAlign: "center",
              }}
            >
              <p
                className="font-serif font-light text-[#3A342C]/55 leading-[1.9]"
                style={{ fontSize: "clamp(14px, 1.2vw, 16px)", maxWidth: 560, margin: "0 auto" }}
              >
                Thank you for taking the time to share a little of your story.
                <br />
                Every inquiry is read personally by us.
                <br />
                We'll usually get back to you within two working days.
              </p>

              <div style={{ marginTop: "clamp(36px, 4.5vw, 56px)" }}>
                <button
                  type="submit"
                  className="font-sans font-light tracking-[0.1em] uppercase text-[#3A342C]/75 hover:opacity-45 transition-opacity duration-300 cursor-pointer bg-transparent border-none outline-none focus-visible:underline"
                  style={{ fontSize: "clamp(11px, 1vw, 13px)" }}
                >
                  Let's begin over coffee&nbsp;&nbsp;→
                </button>
              </div>

              <p
                className="font-serif font-light text-[#3A342C]/40 leading-[1.9]"
                style={{ fontSize: "clamp(13px, 1.1vw, 15px)", marginTop: "clamp(24px, 3vw, 36px)" }}
              >
                From here, we'll read your enquiry personally and, if it feels like the right fit, we'll reach out to arrange a relaxed conversation.
              </p>
            </div>
          </Fade>
        </form>
      </section>

      {/* ── 4. Quiet Closing ────────────────────────────────────────── */}
      <section
        style={{
          paddingTop: "clamp(100px, 14vw, 160px)",
          paddingBottom: "clamp(100px, 14vw, 160px)",
          paddingLeft: "clamp(24px, 8vw, 100px)",
          paddingRight: "clamp(24px, 8vw, 100px)",
          textAlign: "center",
        }}
      >
        <Fade>
          <p
            className="font-serif font-light text-[#3A342C]/40 leading-[1.9]"
            style={{ fontSize: "clamp(13px, 1.1vw, 15px)", maxWidth: 480, margin: "0 auto" }}
          >
            Every family begins somewhere.
            <br />
            Thank you for letting us become a small part of yours.
          </p>
        </Fade>
      </section>

    </div>
  );
}
