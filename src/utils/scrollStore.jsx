// src/utils/scrollStore.js
const KEY = "scroll-positions-v1";

export function saveScrollFor(path) {
  try {
    const store = JSON.parse(sessionStorage.getItem(KEY) || "{}");
    store[path] = window.scrollY || 0;
    sessionStorage.setItem(KEY, JSON.stringify(store));
    // optional debug
    console.debug("[scrollStore] SAVED", path, store[path]);
  } catch (e) {
    /* ignore */
  }
}

export function readScrollFor(path) {
  try {
    const store = JSON.parse(sessionStorage.getItem(KEY) || "{}");
    return Number(store[path] || 0);
  } catch (e) {
    return 0;
  }
}
