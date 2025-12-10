import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { readScrollFor } from "../utils/scrollStore";

/**
 * Smart Scroll Restoration
 * 1. SareeList & KurtaList -> Restores previous scroll position.
 * 2. ProductDetail & Others -> Always scrolls to TOP (0,0).
 */
export default function ScrollRestoration() {
  const loc = useLocation();
  const routeKey = `${loc.pathname}${loc.hash || ""}`;

  useEffect(() => {
    // 1. DEFINE PAGES THAT SHOULD RESTORE SCROLL
    // Add any other list pages here in the future
    const restoreWhitelist = ["/SareeList", "/KurtaList"];

    // Check if current page is in the whitelist
    const shouldRestore = restoreWhitelist.some((path) =>
      loc.pathname.toLowerCase().includes(path.toLowerCase())
    );

    console.debug(
      `➡️ Route: ${loc.pathname} | Should Restore? ${shouldRestore}`
    );

    // Disable smooth scrolling temporarily for instant jump
    document.documentElement.style.scrollBehavior = "auto";
    document.body.style.scrollBehavior = "auto";

    // 2. LOGIC: IF NOT IN WHITELIST -> FORCE TOP
    if (!shouldRestore) {
      console.debug("   🚀 Not a list page -> Forcing Scroll to Top");
      window.scrollTo(0, 0);
      return;
    }

    // 3. LOGIC: IF IN WHITELIST -> ATTEMPT RESTORE
    const savedY = Number(readScrollFor(routeKey) || 0);
    console.debug("   📦 Found saved position:", savedY);

    if (!savedY) {
      window.scrollTo(0, 0);
      return;
    }

    // 4. RETRY LOGIC (For images/content loading)
    let tries = 0;
    const tryRestore = () => {
      tries++;
      const pageHeight =
        document.documentElement.scrollHeight || document.body.scrollHeight;
      const viewport =
        window.innerHeight || document.documentElement.clientHeight;
      const maxScroll = Math.max(0, pageHeight - viewport);

      // Page not tall enough yet? Wait a frame.
      if (pageHeight < savedY + viewport && tries < 20) {
        requestAnimationFrame(tryRestore);
        return;
      }

      // Clamp value to max scrollable area
      const finalY = Math.min(savedY, maxScroll);
      window.scrollTo({ top: finalY, behavior: "auto" });
    };

    // Small delay to allow React layout to settle
    const timer = setTimeout(() => requestAnimationFrame(tryRestore), 0);

    return () => clearTimeout(timer);
  }, [routeKey]); // Re-run this effect whenever the route changes

  return null;
}
