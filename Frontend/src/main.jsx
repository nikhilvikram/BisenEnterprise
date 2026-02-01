import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

// === SCROLL-TO-TOP ON REFRESH/LOAD (runs before React) ===
if (typeof history !== "undefined" && "scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}
const scrollToTop = () => {
  window.scrollTo(0, 0);
  if (document.documentElement) document.documentElement.scrollTop = 0;
  if (document.body) document.body.scrollTop = 0;
  const root = document.getElementById("root");
  if (root && root.scrollTop !== undefined) root.scrollTop = 0;
};
scrollToTop();
// Aggressive retries - browser restoration often runs 50-400ms after load
requestAnimationFrame(scrollToTop);
[50, 100, 150, 250, 400, 600].forEach((ms) => setTimeout(scrollToTop, ms));

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
