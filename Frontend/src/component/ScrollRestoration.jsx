import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { readScrollFor } from "../utils/scrollStore";

/**
 * Smart Scroll Restoration
 * - REFRESH: Always scroll to top so products are visible from top
 * - IN-APP NAV: Restore scroll for list pages (SareeList, KurtaList, HomePage, category lists)
 * - OTHER PAGES: Always scroll to top (ProductDetail, Cart, etc.)
 */
export default function ScrollRestoration() {
  const loc = useLocation();
  const routeKey = `${loc.pathname}${loc.hash || ""}`;
  const hasHandledInitialLoad = useRef(false);

  useEffect(() => {
    // Prevent browser's default scroll restoration (causes footer jump on refresh)
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    // On FIRST load (page load or refresh): ALWAYS scroll to top for all sections
    const isFirstLoad = !hasHandledInitialLoad.current;
    hasHandledInitialLoad.current = true;

    if (isFirstLoad) {
      const scrollToTop = () => {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
        ["root", "scrollArea"].forEach((id) => {
          const el = document.getElementById(id);
          if (el && el.scrollTop !== undefined) el.scrollTop = 0;
        });
      };
      document.documentElement.style.scrollBehavior = "auto";
      document.body.style.scrollBehavior = "auto";
      scrollToTop();
      const timers = [0, 50, 100, 200, 350, 500].map((ms) =>
        setTimeout(scrollToTop, ms)
      );
      return () => timers.forEach(clearTimeout);
    }

    // 1. PAGES THAT RESTORE SCROLL (list pages with products) - only on in-app nav
    const restoreWhitelist = [
      "/SareeList",
      "/KurtaList",
      "/HomePage",
      "/category/",
      "/Categories",
    ];
    const shouldRestore = restoreWhitelist.some((path) =>
      loc.pathname.toLowerCase().includes(path.toLowerCase())
    );

    // 2. NOT A LIST PAGE -> FORCE TOP
    document.documentElement.style.scrollBehavior = "auto";
    document.body.style.scrollBehavior = "auto";

    if (!shouldRestore) {
      window.scrollTo(0, 0);
      return;
    }

    // 3. LIST PAGE + IN-APP NAV -> RESTORE SAVED POSITION
    const savedY = Number(readScrollFor(routeKey) || 0);
    if (!savedY) {
      window.scrollTo(0, 0);
      return;
    }

    // 4. RETRY LOGIC: Wait for products/content to load before restoring
    let tries = 0;
    const tryRestore = () => {
      tries++;
      const pageHeight =
        document.documentElement.scrollHeight || document.body.scrollHeight;
      const viewport =
        window.innerHeight || document.documentElement.clientHeight;
      const maxScroll = Math.max(0, pageHeight - viewport);

      if (pageHeight < savedY + viewport && tries < 25) {
        requestAnimationFrame(tryRestore);
        return;
      }

      const finalY = Math.min(savedY, maxScroll);
      window.scrollTo({ top: finalY, behavior: "auto" });
    };

    const timer = setTimeout(() => requestAnimationFrame(tryRestore), 50);

    return () => clearTimeout(timer);
  }, [routeKey]);

  return null;
}
