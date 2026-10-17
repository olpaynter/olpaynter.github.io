"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { isPlainClick } from "@/lib/clicks";
import { expectNavigation, navigationCommitted } from "@/lib/nav/intent";

const SCROLL_POSITIONS = "scroll-positions";
const KEPT_POSITIONS = 50;

/** The Navigation API's key for the current history entry, where the browser has the API. */
function entryKey(): string | undefined {
  return (window as Window & { navigation?: { currentEntry: { key: string } | null } }).navigation?.currentEntry?.key;
}

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
 * Coordinates navigation between pages; see "Page transitions" in docs/development.md. Next.js applies back
 * and forward as an immediate render, so by the time a view transition could capture the old page it
 * has already gone. Popstate is therefore intercepted before the router sees it and replayed to the
 * router once the old page is captured.
 */
export function NavigationTransitions() {
  const pathname = usePathname();
  const lastPath = useRef(pathname);
  const finish = useRef<(() => void) | null>(null);
  const latestTransition = useRef<ViewTransition | null>(null);
  const positions = useRef<Map<string, number> | null>(null);
  const restoreTo = useRef<number | undefined>(undefined);

  // The browser restores the scroll position of a back or forward while the old page is still showing,
  // which caps it at that page's height. Positions are therefore kept per history entry here and
  // applied once the page they belong to has rendered. Without the Navigation API there is no key for
  // an entry, and the browser's own restoration is left in place.
  useEffect(() => {
    const key = entryKey();
    if (key === undefined) return;
    history.scrollRestoration = "manual";
    let stored: Record<string, number> = {};
    try {
      stored = JSON.parse(sessionStorage.getItem(SCROLL_POSITIONS) ?? "{}");
    } catch {
      // Blocked or corrupt storage only loses the positions from before a reload.
    }
    const saved = new Map(Object.entries(stored));
    positions.current = saved;
    const reloaded = saved.get(key);
    if (reloaded !== undefined) window.scrollTo({ top: reloaded, behavior: "instant" });

    let frame: number | undefined;
    const onScroll = () => {
      if (frame !== undefined) return;
      frame = requestAnimationFrame(() => {
        frame = undefined;
        const current = entryKey();
        if (current === undefined) return;
        // Re-inserting keeps the map in order of use, so the oldest entries are the ones dropped.
        saved.delete(current);
        saved.set(current, window.scrollY);
      });
    };
    const store = () => {
      try {
        sessionStorage.setItem(SCROLL_POSITIONS, JSON.stringify(Object.fromEntries([...saved].slice(-KEPT_POSITIONS))));
      } catch {
        // As above, a refused write only loses the positions across a reload.
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pagehide", store);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pagehide", store);
      if (frame !== undefined) cancelAnimationFrame(frame);
      history.scrollRestoration = "auto";
    };
  }, []);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const url = navigationTarget(event);
      if (!url) return;
      expectNavigation(url);
      restoreTo.current = undefined;
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
      const key = entryKey();
      restoreTo.current = key === undefined ? undefined : positions.current?.get(key);
      // A popstate that only changes the hash stays on the same page, so there is nothing to animate.
      if (location.pathname === lastPath.current) {
        if (restoreTo.current !== undefined) window.scrollTo({ top: restoreTo.current, behavior: "instant" });
        restoreTo.current = undefined;
        return;
      }
      expectNavigation(new URL(location.href));
      // Safari animates a swipe back or forward itself, and a second transition would replay it.
      if (
        !document.startViewTransition ||
        event.hasUAVisualTransition ||
        matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        return;
      }

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
    // Scrolled before the transition is released, so its new snapshot already shows the restored position.
    if (restoreTo.current !== undefined) window.scrollTo({ top: restoreTo.current, behavior: "instant" });
    restoreTo.current = undefined;
    finish.current?.();
    finish.current = null;
  }, [pathname]);

  return null;
}
