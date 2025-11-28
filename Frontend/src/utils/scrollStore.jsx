// src/utils/scrollStore.js (you already have)
const KEY = "scroll-positions-v1";

export function saveScrollFor(key) {
  try {
    const store = JSON.parse(sessionStorage.getItem(KEY) || "{}");
    store[key] = window.scrollY || 0;
    sessionStorage.setItem(KEY, JSON.stringify(store));
    console.debug("[scrollStore] SAVED", key, store[key]);
  } catch (e) {
    console.warn("[scrollStore] save error", e);
  }
}

export function readScrollFor(key) {
  try {
    const store = JSON.parse(sessionStorage.getItem(KEY) || "{}");
    return Number(store[key] || 0);
  } catch (e) {
    console.warn("[scrollStore] read error", e);
    return 0;
  }
}
