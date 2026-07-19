import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";

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
      className="w-full resize-none bg-transparent font-serif font-light text-[#3A342C] placeholder-[#3A342C]/30 outline-none border-b border-[#3A342C]/20 focus:border-[#3A342C]/60 pb-3 leading-relaxed transition-colors duration-300"
      style={{ fontSize: "clamp(15px, 1.3vw, 18px)", minHeight: 90 }}
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
      className="w-full bg-transparent font-serif font-light text-[#3A342C] placeholder-[#3A342C]/30 outline-none border-b border-[#3A342C]/20 focus:border-[#3A342C]/60 pb-2 transition-colors duration-300"
      style={{ fontSize: "clamp(15px, 1.3vw, 18px)" }}
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
    <select
      id={id}
      name={id}
      defaultValue=""
      className="w-full bg-transparent font-serif font-light text-[#3A342C] outline-none border-b border-[#3A342C]/20 focus:border-[#3A342C]/60 pb-2 transition-colors duration-300 appearance-none cursor-pointer"
      style={{ fontSize: "clamp(15px, 1.3vw, 18px)" }}
    >
      {children}
    </select>
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
      <div className="bg-[#F5F0E8] min-h-screen flex flex-col">
        <nav
          className="px-6 py-6 md:px-[100px] md:py-10 flex justify-between items-start"
          style={{ opacity: mounted ? 1 : 0, transition: "opacity 800ms ease-in-out" }}
        >
          <Link href="/" className="font-serif text-2xl tracking-[0.02em] font-light text-[#3A342C] hover:opacity-70 transition-opacity duration-300">
            Evermor
          </Link>
          <div className="flex gap-8 font-sans text-[13px] tracking-wide font-light">
            <Link href="/" className="text-[#3A342C]/55 hover:text-[#3A342C] transition-colors duration-300">Home</Link>
            <Link href="/beginnings" className="text-[#3A342C]/55 hover:text-[#3A342C] transition-colors duration-300">Beginnings</Link>
            <Link href="/about" className="text-[#3A342C]/55 hover:text-[#3A342C] transition-colors duration-300">About</Link>
            <Link href="/begin-your-story" className="text-[#3A342C] transition-colors duration-300">Begin Your Story</Link>
          </div>
        </nav>
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
    <div className="bg-[#F5F0E8] text-[#3A342C]">

      {/* ── 1. Hero — no image, pure typography ───────────────────── */}
      <section
        className="relative flex flex-col items-center justify-center text-center"
        style={{ minHeight: "85vh", padding: "120px clamp(24px, 8vw, 100px) 80px" }}
      >
        {/* Nav */}
        <nav
          className="absolute top-0 left-0 right-0 px-6 py-6 md:px-[100px] md:py-10 flex justify-between items-start"
          style={{ opacity: mounted ? 1 : 0, transition: "opacity 800ms ease-in-out" }}
        >
          <Link href="/" className="font-serif text-2xl tracking-[0.02em] font-light text-[#3A342C] hover:opacity-70 transition-opacity duration-300">
            Evermor
          </Link>
          <div className="flex gap-8 font-sans text-[13px] tracking-wide font-light">
            <Link href="/" className="text-[#3A342C]/55 hover:text-[#3A342C] transition-colors duration-300">Home</Link>
            <Link href="/beginnings" className="text-[#3A342C]/55 hover:text-[#3A342C] transition-colors duration-300">Beginnings</Link>
            <Link href="/about" className="text-[#3A342C]/55 hover:text-[#3A342C] transition-colors duration-300">About</Link>
            <Link href="/begin-your-story" className="text-[#3A342C] transition-colors duration-300">Begin Your Story</Link>
          </div>
        </nav>

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

        {/* Scroll indicator */}
        <div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
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

      {/* ── 2. Gentle Introduction ──────────────────────────────────── */}
      <section
        style={{
          paddingTop: "clamp(80px, 10vw, 128px)",
          paddingBottom: "clamp(80px, 10vw, 120px)",
          paddingLeft: "clamp(24px, 8vw, 100px)",
          paddingRight: "clamp(24px, 8vw, 100px)",
        }}
      >
        <Fade>
          <div style={{ maxWidth: 560, margin: "0 auto", textAlign: "center" }}>
            <p
              className="font-serif font-light text-[#3A342C]/50 leading-[1.9]"
              style={{ fontSize: "clamp(14px, 1.2vw, 16px)" }}
            >
              There are no right or wrong answers.
              <br />
              Write as much or as little as you'd like.
              <br />
              The more we understand your story,
              <br />
              the more honestly we can preserve it.
            </p>
          </div>
        </Fade>
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
          <Field label="Your Name" htmlFor="your-name">
            <LineInput id="your-name" placeholder="Your first name" required />
          </Field>

          <Field label="Your Partner's Name" htmlFor="partner-name">
            <LineInput id="partner-name" placeholder="Their first name" required />
          </Field>

          <Field label="Email Address" htmlFor="email">
            <LineInput id="email" type="email" placeholder="you@example.com" required />
          </Field>

          <Field label="Phone Number" htmlFor="phone">
            <LineInput id="phone" type="tel" placeholder="+91 98765 43210" />
          </Field>

          <Field label="Where Are You Based?" htmlFor="location">
            <LineInput id="location" placeholder="Bangalore, India" />
          </Field>

          <Field label="Wedding Date" htmlFor="wedding-date">
            <LineInput id="wedding-date" type="date" placeholder="We're still deciding." />
          </Field>

          {/* — Tell us about yourselves ———————————————————— */}
          <SectionHeading>Tell us about yourselves.</SectionHeading>

          <Field label="How Did Your Story Begin?" htmlFor="story-begin">
            <GrowingTextarea
              id="story-begin"
              placeholder="Tell us how you met, what brought you together, or anything you'd like us to know about your journey."
            />
          </Field>

          <Field label="What Are You Most Excited About?" htmlFor="excited">
            <GrowingTextarea
              id="excited"
              placeholder={"Maybe it's seeing each other for the first time...\n\nA family tradition...\n\nA quiet moment together...\n\nOr simply having everyone you love in one place."}
            />
          </Field>

          <Field label="Anything Especially Important to Your Family?" htmlFor="family">
            <GrowingTextarea
              id="family"
              placeholder="Every family has traditions, relationships and stories that deserve to be remembered."
            />
          </Field>

          <Field label="What Drew You to Evermor?" htmlFor="drew-you">
            <GrowingTextarea
              id="drew-you"
              placeholder="We'd love to know what resonated with you."
            />
          </Field>

          {/* — A few practical details ———————————————————— */}
          <SectionHeading>A few practical details.</SectionHeading>

          <Field label="Venue" htmlFor="venue" optional>
            <LineInput id="venue" placeholder="If you've chosen one already." />
          </Field>

          <Field label="Estimated Guest Count" htmlFor="guest-count">
            <LineSelect id="guest-count">
              <option value="" disabled className="text-[#3A342C]/40">Select an estimate</option>
              <option value="below-100">Below 100</option>
              <option value="100-200">100–200</option>
              <option value="200-400">200–400</option>
              <option value="400+">400+</option>
              <option value="not-sure">We're not sure yet</option>
            </LineSelect>
          </Field>

          <Field label="What Are You Looking For?" htmlFor="service">
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

          <Field label="Budget Range" htmlFor="budget">
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
                  Share Your Story&nbsp;&nbsp;→
                </button>
              </div>
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
