"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * Next.js applies browser back and forward as an immediate render, so by the time a view transition
 * could capture the old page it has already been replaced. This intercepts popstate before the
 * router sees it, starts a view transition, and replays the event to the router inside the
 * transition's update, once the old page has been captured. The `data-history-nav` attribute lets
 * the CSS give it the same lift-and-settle motion as link navigation.
 */
export function HistoryTransitions() {
  const pathname = usePathname();
  const lastPath = useRef(pathname);
  const finish = useRef<(() => void) | null>(null);
  const current = useRef<ViewTransition | null>(null);

  useEffect(() => {
    let replaying = false;

    const onPopState = (event: PopStateEvent) => {
      if (replaying) return;
      // A popstate that only changes the hash stays on the same page, so there is nothing to animate.
      if (location.pathname === lastPath.current) return;
      if (!document.startViewTransition || matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      event.stopImmediatePropagation();
      const root = document.documentElement;
      root.dataset.historyNav = "";
      const transition = document.startViewTransition(async () => {
        let timer: number | undefined;
        const rendered = new Promise<void>((resolve) => {
          finish.current = resolve;
          // If the route never renders, release the frozen frame rather than hold it indefinitely.
          timer = window.setTimeout(resolve, 1000);
        });
        replaying = true;
        window.dispatchEvent(new PopStateEvent("popstate", { state: event.state }));
        replaying = false;
        await rendered;
        window.clearTimeout(timer);
      });
      current.current = transition;
      // A second back or forward during this one starts a newer transition; only the newest may
      // remove the attribute, or the newer one would lose its motion part-way through.
      transition.finished.finally(() => {
        if (current.current === transition) delete root.dataset.historyNav;
      });
    };

    // Capture listeners on window run before the router's own popstate listener.
    window.addEventListener("popstate", onPopState, { capture: true });
    return () => window.removeEventListener("popstate", onPopState, { capture: true });
  }, []);

  useEffect(() => {
    lastPath.current = pathname;
    finish.current?.();
    finish.current = null;
  }, [pathname]);

  return null;
}
