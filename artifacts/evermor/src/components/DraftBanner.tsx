import { useEffect, useState } from "react";
import { isDraftPreviewEnvironment } from "@/lib/environment";

/**
 * Small, unobtrusive badge shown only when the app is being viewed through a
 * non-production preview (the Replit workspace dev server, or localhost).
 * It never renders on the published production domain — see
 * `isDraftPreviewEnvironment` for how that's determined.
 */
export default function DraftBanner() {
  const [isDraft, setIsDraft] = useState(false);

  useEffect(() => {
    setIsDraft(isDraftPreviewEnvironment());
  }, []);

  if (!isDraft) return null;

  return (
    <div
      role="status"
      aria-label="Draft preview, not the live site"
      className="fixed bottom-6 left-6 z-[100] flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-medium tracking-wide uppercase text-amber-950 bg-amber-300/95 backdrop-blur-sm shadow-[0_2px_10px_rgba(0,0,0,0.18)] select-none pointer-events-none"
    >
      <span className="h-1.5 w-1.5 rounded-full bg-amber-950/70" />
      Draft preview — not live
    </div>
  );
}
