"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { isPlainClick } from "@/lib/clicks";
import { expectNavigation, navigationCommitted } from "@/lib/nav/intent";

/** The page a click is navigating to, if it is a plain click on a link to another page of the site. */
function navigationTarget(event: MouseEvent): URL | undefined {
  if (!isPlainClick(event)) return;
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
  const latestTransition = useRef<ViewTransition | null>(null);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const url = navigationTarget(event);
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
        // An earlier back or forward still waiting for its page is superseded by this one.
        finish.current?.();
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
        // Only the newest transition may set or remove the attribute, or a newer one would lose
        // its motion.
        if (latestTransition.current === transition) root.dataset.historyNav = "new";
      });
      latestTransition.current = transition;
      transition.finished.finally(() => {
        if (latestTransition.current === transition) delete root.dataset.historyNav;
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
