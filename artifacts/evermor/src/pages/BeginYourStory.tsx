import { useEffect, useState } from "react";
import { Link } from "wouter";
import Nav from "../components/Nav";

const BASE = import.meta.env.BASE_URL?.replace(/\/$/, "") || "";
const API  = `${BASE}/api`;

export default function BeginYourStory() {
  const [mounted, setMounted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { setMounted(true); }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!e.currentTarget.checkValidity()) {
      e.currentTarget.reportValidity();
      return;
    }
    setError(null);
    setSending(true);
    const fd = new FormData(e.currentTarget);
    const body = {
      names:       fd.get("your-names") as string,
      email:       fd.get("email") as string,
      phone:       fd.get("phone") as string,
      location:    fd.get("location") as string,
      weddingDate: fd.get("wedding-date") as string,
      venue:       fd.get("venue") as string,
    };
    try {
      const res = await fetch(`${API}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({})) as { error?: string };
        throw new Error(d.error || "Something went wrong. Please try again.");
      }
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSending(false);
    }
  }

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/beginnings", label: "Beginnings" },
    { href: "/approach", label: "Approach" },
    { href: "/journal", label: "Journal" },
    { href: "/begin-your-story", label: "Begin Your Story", active: true },
  ];

  // ── Confirmation ────────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="bg-[#FAFAF8] min-h-screen flex flex-col">
        <Nav theme="light" mounted={mounted} position="absolute" links={navLinks} />
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

  // ── Main page ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#FAFAF8]">

      {/* ── LEFT: sticky photo ──────────────────────────────────────────────── */}
      <div className="lg:w-[45%] lg:sticky lg:top-0 lg:h-screen flex-shrink-0 overflow-hidden bg-[#1A1612]">
        <div
          className="w-full h-[50vh] lg:h-full relative"
          style={{ transition: "opacity 1200ms ease-in-out", opacity: mounted ? 1 : 0 }}
        >
          <img
             src="/begin-your-story-dsc-6413.jpg"
            alt="Begin your story"
            className="w-full h-full object-cover object-center"
            loading="eager"
          />
          <div className="absolute inset-0 bg-[#1A1612]/20" />
          <div className="absolute inset-x-0 bottom-0 h-[40%] bg-gradient-to-t from-black/50 to-transparent" />

          {/* Caption */}
          <div
            className="absolute bottom-10 left-8 right-8 z-10"
            style={{
              transition: "opacity 800ms ease-out 400ms, transform 800ms ease-out 400ms",
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateY(0)" : "translateY(14px)",
            }}
          >
            <p
              className="font-serif font-light text-[#F5F0E8] leading-[1.3] tracking-[0.01em]"
              style={{ fontSize: "clamp(24px, 3vw, 42px)" }}
            >
              We would love to hear all about your celebration.
            </p>
            <p
              className="font-sans font-light text-[#F5F0E8]/55 mt-4 leading-[1.75]"
              style={{ fontSize: "clamp(11px, 1vw, 13px)" }}
            >
              Share the details below and we'll be in touch to learn more about your plans.
            </p>
          </div>
        </div>
      </div>

      {/* ── RIGHT: form ─────────────────────────────────────────────────────── */}
      <div className="lg:w-[55%] flex flex-col justify-center">

        {/* Nav — only visible on desktop over the form side */}
        <div className="hidden lg:block">
          <Nav theme="light" mounted={mounted} position="absolute" links={navLinks} />
        </div>
        {/* Nav for mobile */}
        <div className="lg:hidden">
          <Nav theme="dark" mounted={mounted} position="relative" links={navLinks} />
        </div>

        <div
          style={{
            paddingTop: "clamp(56px, 10vw, 120px)",
            paddingBottom: "clamp(56px, 10vw, 120px)",
            paddingLeft: "clamp(28px, 7vw, 100px)",
            paddingRight: "clamp(28px, 7vw, 100px)",
          }}
        >
          {/* Eyebrow */}
          <p
            className="font-sans uppercase tracking-[0.28em] text-[#8C6D4F] mb-6"
            style={{
              fontSize: "clamp(9px, 0.85vw, 11px)",
              transition: "opacity 700ms ease-out 200ms",
              opacity: mounted ? 1 : 0,
            }}
          >
            Get in Touch
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate>

            {/* Row 1 — Names | Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-10 mb-10">
              <FormField label="Your Names" htmlFor="your-names">
                <LineInput id="your-names" placeholder="e.g. Arjun & Priya" required />
              </FormField>
              <FormField label="Email" htmlFor="email">
                <LineInput id="email" type="email" placeholder="you@example.com" required />
              </FormField>
            </div>

            {/* Row 2 — Phone | Wedding Location */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-10 mb-10">
              <FormField label="Phone Number" htmlFor="phone">
                <LineInput id="phone" type="tel" placeholder="+91 98765 43210" required />
              </FormField>
              <FormField label="Wedding Location" htmlFor="location">
                <LineInput id="location" placeholder="City, Country" required />
              </FormField>
            </div>

            {/* Row 3 — Wedding Dates | Venue */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-10 mb-14">
              <FormField label="Wedding Dates" htmlFor="wedding-date">
                <LineInput id="wedding-date" type="text" placeholder="DD / MM / YYYY" required />
              </FormField>
              <FormField label="Wedding Venue" htmlFor="venue">
                <LineInput id="venue" placeholder="Venue name and city" required />
              </FormField>
            </div>

            {/* Error */}
            {error && (
              <p className="mb-6 font-sans font-light text-[13px] text-red-500">
                {error}
              </p>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-7">
              <button
                type="submit"
                disabled={sending}
                aria-disabled={sending}
                className="font-sans font-light tracking-[0.18em] uppercase transition-all duration-300 outline-none text-[#F5F0E8] bg-[#3A342C] hover:bg-[#2A2520] cursor-pointer disabled:opacity-60 disabled:cursor-wait"
                style={{ fontSize: "clamp(10px, 0.95vw, 12px)", padding: "15px 24px" }}
              >
                {sending ? "Sending…" : "Submit Enquiry"}
              </button>
              <Link
                href="/story-dna"
                className="inline-flex items-center gap-3 self-start font-sans font-light text-[#3A342C]/65 hover:text-[#8C6D4F] tracking-[0.14em] uppercase transition-colors duration-300 border-b border-[#3A342C]/25 hover:border-[#8C6D4F] pb-2"
                style={{ fontSize: "clamp(10px, 0.95vw, 12px)" }}
              >
                Discover Your Story DNA <span aria-hidden="true">→</span>
              </Link>
            </div>

          </form>
        </div>
      </div>

    </div>
  );
}

// ── Shared field components ───────────────────────────────────────────────────
function FormField({
  label,
  htmlFor,
  children,
}: {
  label: React.ReactNode;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={htmlFor}
        className="block font-sans font-light tracking-[0.18em] uppercase text-[#3A342C]/50 mb-3"
        style={{ fontSize: "clamp(8px, 0.8vw, 10px)" }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

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
      className="w-full bg-transparent font-serif font-light text-[#3A342C] placeholder-[#3A342C]/25 outline-none border-b border-[#3A342C]/15 focus:border-[#3A342C]/50 pb-2 transition-colors duration-300"
      style={{ fontSize: "clamp(15px, 1.2vw, 17px)" }}
    />
  );
}
