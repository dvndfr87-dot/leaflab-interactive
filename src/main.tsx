import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);

// PWA Service Worker registration — only on real deployments, never in iframes or Lovable preview hosts
if ("serviceWorker" in navigator) {
  const isInIframe = (() => {
    try {
      return window.self !== window.top;
    } catch {
      return true;
    }
  })();

  const isPreviewHost =
    window.location.hostname.includes("id-preview--") ||
    window.location.hostname.includes("lovableproject.com") ||
    window.location.hostname.includes("lovable.app");

  if (isPreviewHost || isInIframe) {
    // Make sure no stale SW from a previous build keeps serving cached pages in preview
    navigator.serviceWorker.getRegistrations().then((regs) => {
      regs.forEach((r) => r.unregister());
    });
    // Also wipe any cached responses from older custom SWs
    if ("caches" in window) {
      caches.keys().then((keys) => keys.forEach((k) => caches.delete(k)));
    }
  } else {
    window.addEventListener("load", async () => {
      try {
        // Unregister legacy /sw.js (custom one) if it's still registered from a previous deploy
        const existing = await navigator.serviceWorker.getRegistrations();
        for (const reg of existing) {
          const url = reg.active?.scriptURL || reg.installing?.scriptURL || reg.waiting?.scriptURL || "";
          if (url.endsWith("/sw.js")) {
            await reg.unregister();
          }
        }
        // Register the Workbox-generated SW from vite-plugin-pwa
        const { Workbox } = await import("workbox-window");
        const wb = new Workbox("/sw.js");
        wb.addEventListener("waiting", () => {
          // Activate new SW immediately so users get fresh assets
          wb.messageSkipWaiting();
        });
        wb.addEventListener("controlling", () => {
          window.location.reload();
        });
        await wb.register();
      } catch {
        // ignore registration errors
      }
    });
  }
}
