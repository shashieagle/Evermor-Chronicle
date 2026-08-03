import { useState } from "react";
import { Link } from "wouter";

export interface NavLink {
  href: string;
  label: string;
  active?: boolean;
}

interface NavProps {
  theme: "dark" | "light";
  mounted?: boolean;
  position?: "absolute" | "fixed";
  brandName?: string;
  links: NavLink[];
}

export default function Nav({
  theme,
  mounted = true,
  position = "absolute",
  brandName = "Evermor Tales",
  links,
}: NavProps) {
  const [open, setOpen] = useState(false);

  const fg      = theme === "dark" ? "#F5F0E8" : "#3A342C";
  const fgMuted = theme === "dark" ? "rgba(245,240,232,0.70)" : "rgba(58,52,44,0.55)";

  return (
    <>
      <nav
        className={`${position} top-0 left-0 right-0 z-20 px-6 py-6 md:px-[100px] md:py-10 flex justify-between items-start`}
        style={{ transition: "opacity 800ms ease-in-out", opacity: mounted ? 1 : 0 }}
      >
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 hover:opacity-70 transition-opacity duration-300"
        >
          <img
            src="/logo-icon.png"
            alt="Evermor Tales"
            className="h-9 w-auto"
            style={{ filter: theme === "dark" ? "brightness(0) invert(1) sepia(1) saturate(2) hue-rotate(5deg)" : "none" }}
          />
          <span
            className="font-serif text-xl tracking-[0.02em] font-light"
            style={{ color: fg }}
          >
            {brandName}
          </span>
        </Link>

        {/* Desktop links — hidden on mobile */}
        <div className="hidden md:flex gap-8 font-sans text-[13px] tracking-wide font-light">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors duration-300"
              style={{ color: link.active ? fg : fgMuted }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Mobile hamburger — 44×44px touch target */}
        <button
          className="md:hidden flex flex-col gap-[6px] items-end justify-center w-11 h-11 -mr-2 shrink-0"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
        >
          <span className="block h-px w-6" style={{ backgroundColor: fg }} />
          <span className="block h-px w-4" style={{ backgroundColor: fg }} />
        </button>
      </nav>

      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-50 bg-[#1A1612] flex flex-col px-8 pt-8 pb-12 transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Top row */}
        <div className="flex justify-between items-start mb-auto">
          <div className="flex items-center gap-2.5">
            <img src="/logo-icon.png" alt="Evermor Tales" className="h-8 w-auto" style={{ filter: "brightness(0) invert(1) sepia(1) saturate(2) hue-rotate(5deg)" }} />
            <span className="font-serif text-2xl tracking-[0.02em] font-light text-[#F5F0E8]/90">{brandName}</span>
          </div>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="text-[#F5F0E8]/50 hover:text-[#F5F0E8] transition-colors duration-200 mt-1"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <line x1="2" y1="2" x2="18" y2="18" stroke="currentColor" strokeWidth="1.2" />
              <line x1="18" y1="2" x2="2" y2="18" stroke="currentColor" strokeWidth="1.2" />
            </svg>
          </button>
        </div>

        {/* Links */}
        <div className="flex flex-col gap-7 my-auto">
          {links.map((link, i) => (
            <div
              key={link.href}
              style={{
                transition: `opacity 350ms ease-out ${i * 55}ms, transform 350ms ease-out ${i * 55}ms`,
                opacity: open ? 1 : 0,
                transform: open ? "translateY(0)" : "translateY(10px)",
              }}
            >
              <Link
                href={link.href}
                onClick={() => setOpen(false)}
                className="font-serif font-light tracking-[0.01em] leading-[1.1] transition-opacity duration-200 hover:opacity-50"
                style={{
                  fontSize: "clamp(28px, 9vw, 42px)",
                  color: link.active ? "#F5F0E8" : "rgba(245,240,232,0.45)",
                }}
              >
                {link.label}
              </Link>
            </div>
          ))}
        </div>

        {/* Tagline */}
        <p
          className="font-sans font-light text-[#F5F0E8]/18 tracking-[0.14em] uppercase"
          style={{ fontSize: 9 }}
        >
          Preserving the beginning of your family.
        </p>
      </div>
    </>
  );
}
