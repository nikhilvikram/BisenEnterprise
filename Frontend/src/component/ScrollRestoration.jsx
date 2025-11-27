// src/component/ScrollRestoration.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { readScrollFor } from "../utils/scrollStore";

export default function ScrollRestoration() {
  const { pathname } = useLocation();

  useEffect(() => {
    const tryRestore = () => {
      const targetY = readScrollFor(pathname) || 0;
      if (!targetY) {
        window.scrollTo({ top: 0, behavior: "auto" });
        console.debug("[Scroll] RESTORE none => top 0", pathname);
        return;
      }
      // Try to restore. If page small, clamp; images might still load so allow small delay.
      const pageHeight =
        document.documentElement.scrollHeight || document.body.scrollHeight;
      const viewportH = window.innerHeight;
      const maxScroll = Math.max(0, pageHeight - viewportH);
      const finalY = Math.min(targetY, maxScroll);
      // Wait a frame (let images start loading), then jump
      requestAnimationFrame(() => {
        window.scrollTo({ top: finalY, behavior: "auto" });
        console.debug("[Scroll] RESTORED", pathname, finalY, {
          targetY,
          pageHeight,
          viewportH,
        });
      });
    };

    // small timeout to let render/layout start; increase to 80ms if images are slow
    const t = setTimeout(tryRestore, 60);

    return () => clearTimeout(t);
  }, [pathname]);

  return null;
}
