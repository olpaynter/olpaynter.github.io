"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { expectNavigation, navigationCommitted } from "@/lib/nav/intent";

/** Whether a click on this link starts a client-side navigation to another page. */
function navigatesAway(event: MouseEvent): URL | undefined {
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  const link = event.target instanceof Element ? event.target.closest("a[href]") : null;
  if (
    !(link instanceof HTMLAnchorElement) ||
    (link.target && link.target !== "_self") ||
    link.hasAttribute("download")
  ) {
    return;
  }
  const url = new URL(link.href);
  if (url.origin === location.origin && url.pathname !== location.pathname) return url;
}

/**
 * Coordinates navigation between pages; see "Page transitions" in the README. Next.js applies back
 * and forward as an immediate render, so by the time a view transition could capture the old page it
 * has already gone. Popstate is therefore intercepted before the router sees it and replayed to the
 * router once the old page is captured.
 */
export function NavigationTransitions() {
  const pathname = usePathname();
  const lastPath = useRef(pathname);
  const finish = useRef<(() => void) | null>(null);
  const current = useRef<ViewTransition | null>(null);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const url = navigatesAway(event);
      if (url) expectNavigation(url);
    };
    // Capture listeners on window run before React's and the router's handlers.
    window.addEventListener("click", onClick, { capture: true });
    return () => window.removeEventListener("click", onClick, { capture: true });
  }, []);

  useEffect(() => {
    let replaying = false;
    const root = document.documentElement;

    const onPopState = (event: PopStateEvent) => {
      if (replaying) return;
      // A popstate that only changes the hash stays on the same page, so there is nothing to animate.
      if (location.pathname === lastPath.current) return;
      expectNavigation(new URL(location.href));
      if (!document.startViewTransition || matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      event.stopImmediatePropagation();
      root.dataset.historyNav = "old";
      const transition = document.startViewTransition(async () => {
        let timer: number | undefined;
        const rendered = new Promise<void>((resolve) => {
          finish.current = resolve;
          // If the route never renders, release the frozen frame rather than hold it indefinitely.
          timer = window.setTimeout(resolve, 1000);
        });
        // A later back or forward may have moved the history on since this event, so the router is
        // given the entry it is on now.
        replaying = true;
        window.dispatchEvent(new PopStateEvent("popstate", { state: history.state }));
        replaying = false;
        // No render is coming if an earlier replay already reached this page, or if the router
        // ignores the entry because it holds none of its state.
        if (location.pathname !== lastPath.current && history.state?.__NA) await rendered;
        window.clearTimeout(timer);
        root.dataset.historyNav = "new";
      });
      current.current = transition;
      // Only the newest transition may remove the attribute, or a newer one would lose its motion.
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
    navigationCommitted();
    finish.current?.();
    finish.current = null;
  }, [pathname]);

  return null;
}
