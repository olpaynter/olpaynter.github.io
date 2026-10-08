"use client";

import { useEffect } from "react";
import { documentFiles } from "@/lib/routes";

type NetworkInformation = { saveData?: boolean };

/**
 * Downloads a document page's PDF as soon as the reader points at, focuses or touches a link to
 * that page, so its preview opens from the browser cache. Next.js prefetches the page itself but
 * not the PDF its iframe loads.
 */
export function DocumentPrefetch() {
  useEffect(() => {
    const started = new Set<string>();
    const prefetch = (event: Event) => {
      const link = event.target instanceof Element ? event.target.closest("a[href]") : null;
      if (!(link instanceof HTMLAnchorElement) || link.origin !== location.origin) return;
      const file = documentFiles[link.pathname];
      if (!file || started.has(file)) return;
      if ((navigator as Navigator & { connection?: NetworkInformation }).connection?.saveData) return;
      started.add(file);
      // A fetch fills the HTTP cache in every browser, whereas Safari ignores <link rel="prefetch">.
      // The body must be read in full for the response to be cached.
      fetch(file, { priority: "low" })
        .then((response) => response.blob())
        .catch(() => started.delete(file));
    };
    const events = ["pointerover", "focusin", "touchstart"] as const;
    for (const type of events) document.addEventListener(type, prefetch, { passive: true });
    return () => {
      for (const type of events) document.removeEventListener(type, prefetch);
    };
  }, []);
  return null;
}
