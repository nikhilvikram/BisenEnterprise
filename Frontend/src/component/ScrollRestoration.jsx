// src/component/ScrollRestoration.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { readScrollFor } from "../utils/scrollStore";

/**
 * Restore-only. Assumes callers save positions BEFORE navigation
 * (e.g. SaveNavLink, Go Back handler). Uses pathname+hash as the route key.
 */
export default function ScrollRestoration() {
  const loc = useLocation();
  const routeKey = `${loc.pathname}${loc.hash || ""}`;

  useEffect(() => {
    console.debug("➡️ ScrollRestoration: restoring for key:", routeKey);

    const savedY = Number(readScrollFor(routeKey) || 0);
    console.debug("   📦 savedY =", savedY);

    // remove smooth behavior so jump is instant
    document.documentElement.style.scrollBehavior = "auto";
    document.body.style.scrollBehavior = "auto";

    if (!savedY) {
      console.debug("   ↪️ no saved position → jump top");
      window.scrollTo(0, 0);
      return;
    }

    let tries = 0;
    const tryRestore = () => {
      tries++;
      const pageHeight =
        document.documentElement.scrollHeight || document.body.scrollHeight;
      const viewport =
        window.innerHeight || document.documentElement.clientHeight;
      const maxScroll = Math.max(0, pageHeight - viewport);

      console.debug(
        `   Try ${tries}: pageHeight=${pageHeight}, viewport=${viewport}, maxScroll=${maxScroll}, savedY=${savedY}`
      );

      // page not tall enough yet → wait a frame (images/async content)
      if (pageHeight < savedY + viewport && tries < 20) {
        requestAnimationFrame(tryRestore);
        return;
      }

      const finalY = Math.min(savedY, maxScroll);
      console.debug("   ✔ Restoring to", finalY, "(clamped from", savedY, ")");
      window.scrollTo({ top: finalY, behavior: "auto" });
    };

    // small delay for layout, then try (stable across devices)
    const timer = setTimeout(() => requestAnimationFrame(tryRestore), 30);

    return () => clearTimeout(timer);
  }, [routeKey]);

  return null;
}
