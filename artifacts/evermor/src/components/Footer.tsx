import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-[#2A2420] text-[#F5F0E8]">
      <div
        className="max-w-[1200px] mx-auto px-8 md:px-14 lg:px-20"
        style={{ paddingTop: "clamp(48px, 7vw, 80px)", paddingBottom: "clamp(40px, 6vw, 64px)" }}
      >

        {/* ── Top row ──────────────────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-12 md:gap-8 pb-10 border-b border-[#F5F0E8]/10">

          {/* Brand */}
          <div className="flex flex-col gap-5">
            <Link href="/" className="font-serif font-light text-[#F5F0E8] tracking-[0.04em] hover:opacity-70 transition-opacity duration-300" style={{ fontSize: "clamp(18px, 1.6vw, 22px)" }}>
              Evermor Tales
            </Link>
            <p className="font-sans font-light text-[#F5F0E8]/40 tracking-[0.08em] uppercase" style={{ fontSize: "clamp(8px, 0.75vw, 10px)" }}>
              Wedding Photography &amp; Film
            </p>
          </div>

          {/* Social icons — centre */}
          <div className="flex items-center gap-7">
            {/* Instagram */}
            <a
              href="https://instagram.com/evermor_tales"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="text-[#F5F0E8]/55 hover:text-[#F5F0E8] transition-colors duration-300"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <circle cx="12" cy="12" r="4"/>
                <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none"/>
              </svg>
            </a>

            {/* YouTube */}
            <a
              href="https://www.youtube.com/playlist?list=PLg1RfvTh2j26ZlUYPxfsylQZyzlr6nzZm"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="text-[#F5F0E8]/55 hover:text-[#F5F0E8] transition-colors duration-300"
            >
              <svg width="22" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
                <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" stroke="none"/>
              </svg>
            </a>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-3 md:text-right">
            <a
              href="mailto:hello.evermortales@gmail.com"
              className="font-sans font-light text-[#F5F0E8]/60 hover:text-[#F5F0E8] transition-colors duration-300 tracking-[0.04em]"
              style={{ fontSize: "clamp(11px, 1vw, 13px)" }}
            >
              hello.evermortales@gmail.com
            </a>
            <a
              href="tel:+918073257679"
              className="font-sans font-light text-[#F5F0E8]/60 hover:text-[#F5F0E8] transition-colors duration-300 tracking-[0.04em]"
              style={{ fontSize: "clamp(11px, 1vw, 13px)" }}
            >
              +91 80732 57679
            </a>
          </div>
        </div>

        {/* ── Bottom row ───────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-7">
          <p
            className="font-sans font-light text-[#F5F0E8]/25 tracking-[0.06em]"
            style={{ fontSize: "clamp(9px, 0.8vw, 11px)" }}
          >
            © {new Date().getFullYear()} Evermor Tales. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {[
              { href: "/beginnings", label: "Beginnings" },
              { href: "/about", label: "About" },
              { href: "/approach", label: "Approach" },
              { href: "/begin-your-story", label: "Begin Your Story" },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="font-sans font-light text-[#F5F0E8]/30 hover:text-[#F5F0E8]/70 transition-colors duration-300 tracking-[0.06em] uppercase"
                style={{ fontSize: "clamp(8px, 0.75vw, 10px)" }}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}
