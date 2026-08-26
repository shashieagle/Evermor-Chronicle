/**
 * Detects whether the app is currently running in a non-production preview
 * (the Replit workspace dev server, or an ad-hoc local/preview host) as
 * opposed to the actual published production domain.
 *
 * This is intentionally a *runtime* hostname check rather than a build-time
 * flag: the production bundle is a plain static build, so any compile-time
 * "is this dev" constant would be baked in at build time and could end up
 * wrong (or get flipped by accident) without ever being re-checked once
 * deployed. Checking the real hostname the page is being served from means
 * the banner can only ever appear on hosts that are demonstrably not the
 * published site, no matter how the bundle was built.
 */
export function isDraftPreviewEnvironment(): boolean {
  if (typeof window === "undefined") return false;

  const hostname = window.location.hostname;

  // Local development (e.g. running vite directly outside the workspace).
  if (hostname === "localhost" || hostname === "127.0.0.1") return true;

  // Replit workspace dev preview domains, e.g. *.replit.dev, *.repl.co,
  // *.replit.app is intentionally EXCLUDED because published deployments
  // are also served from a *.replit.app domain.
  if (hostname.endsWith(".replit.dev") || hostname.endsWith(".repl.co")) {
    return true;
  }

  return false;
}
