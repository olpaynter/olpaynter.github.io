"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { sectionOnArrival } from "@/lib/nav/intent";

/**
 * The shortest time the highlight stays on one section while scrolling. However fast the scroll,
 * the highlight steps through every section in order, holding each for at least this long.
 */
const MIN_DWELL_MS = 75;

/** A scroll counts as finished once no scroll event has arrived for this long. */
const SCROLL_QUIET_MS = 150;

/** The longest a clicked section keeps the highlight while its scroll is still running. */
const HOLD_LIMIT_MS = 3000;

/**
 * How long the highlight must rest before the address follows it. Browsers refuse a page that
 * replaces its history entry many times a second, and nobody copies an address mid-scroll.
 */
const ADDRESS_DELAY_MS = 200;

const READER_INPUT = ["wheel", "touchmove", "keydown", "pointerdown"] as const;

/**
 * Returns the section in view and a function that scrolls to a section and highlights it. `ids`
 * are the page's section ids in page order; a new array, as on moving to another page, starts over.
 *
 * Scrolling sets a target, the section crossing a band just above the middle of the viewport, and
 * the highlight walks towards it one section at a time so that none is skipped. A click instead
 * jumps straight to the clicked section and holds there until the scroll it starts has finished.
 */
export function useScrollSpy(ids: string[]) {
  const pathname = usePathname();
  // The nav stays mounted across pages, so a new page's sections replace the old page's while
  // rendering. The first highlighted section is the one the navigation is heading for, if any.
  const initial = () => {
    const arriving = sectionOnArrival(pathname);
    return arriving && ids.includes(arriving) ? arriving : ids[0];
  };
  const [state, setState] = useState(() => ({ ids, active: initial() }));
  let active = state.active;
  if (state.ids !== ids) {
    active = initial();
    setState({ ids, active });
  }
  // Only a section of the current page can be highlighted. A handler of the previous page can still
  // fire once while the next page arrives, such as its scroll listener when the router scrolls the
  // new page to the top, and its update is dropped here.
  const setActive = useCallback(
    (id: string) => setState((before) => (before.ids.includes(id) ? { ...before, active: id } : before)),
    [],
  );
  const activeNow = useRef(active);
  const shown = useRef(active);
  const target = useRef(active);
  const held = useRef(false);
  const cancelHold = useRef<(() => void) | null>(null);
  const retarget = useRef<() => void>(() => {});
  const stepTimer = useRef<number | undefined>(undefined);
  const addressTimer = useRef<number | undefined>(undefined);
  const lastStep = useRef(0);

  useEffect(() => {
    activeNow.current = active;
  }, [active]);

  const writeAddress = useCallback(
    (id: string) => {
      window.clearTimeout(addressTimer.current);
      addressTimer.current = undefined;
      // A write scheduled before navigating away must not land on the next page's address.
      if (location.pathname !== pathname) return;
      const hash = id === ids[0] ? "" : `#${id}`;
      if (location.hash === hash) return;
      try {
        history.replaceState(history.state, "", `${location.pathname}${location.search}${hash}`);
      } catch {
        // Browsers throw once a page replaces its history entry too often. The address is a
        // convenience, so a refused write is dropped and the next one catches up.
      }
    },
    [ids, pathname],
  );

  const show = useCallback(
    (id: string) => {
      shown.current = id;
      lastStep.current = performance.now();
      setActive(id);
      // The address follows the highlight, so a copied or bookmarked link opens where the reader
      // was. Replacing the entry keeps scrolling out of the back button's history.
      window.clearTimeout(addressTimer.current);
      addressTimer.current = window.setTimeout(() => writeAddress(id), ADDRESS_DELAY_MS);
    },
    [setActive, writeAddress],
  );

  useEffect(() => {
    shown.current = target.current = activeNow.current;
    const visible = new Set<string>();

    const step = () => {
      stepTimer.current = undefined;
      if (held.current || !target.current || shown.current === target.current) return;
      const from = shown.current ? ids.indexOf(shown.current) : -1;
      const to = ids.indexOf(target.current);
      show(from === -1 ? target.current : ids[from + Math.sign(to - from)]);
      stepTimer.current = window.setTimeout(step, MIN_DWELL_MS);
    };

    let band: string | undefined;

    // A page too short for its last sections to reach the band highlights its first entry at the
    // very top and its last entry at the very bottom.
    const edge = () => {
      if (window.scrollY <= 1) return ids[0];
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) return ids.at(-1);
    };

    retarget.current = () => {
      const next = edge() ?? band;
      if (!next) return;
      target.current = next;
      if (held.current || stepTimer.current !== undefined) return;
      const wait = lastStep.current + MIN_DWELL_MS - performance.now();
      if (wait <= 0) step();
      else stepTimer.current = window.setTimeout(step, wait);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        // Chapters sit inside the journey section, so prefer the most specific visible id.
        band = [...ids].reverse().find((id) => visible.has(id)) ?? band;
        retarget.current();
      },
      { rootMargin: "-35% 0px -60% 0px" },
    );
    let previous: Element | undefined;
    for (const id of ids) {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
      if (process.env.NODE_ENV === "development") {
        if (!element) console.error(`Side nav: no element has id "${id}"`);
        else if (previous && !(previous.compareDocumentPosition(element) & Node.DOCUMENT_POSITION_FOLLOWING)) {
          console.error(`Side nav: "${id}" comes before the entry above it on the page; list entries in page order`);
        }
      }
      previous = element ?? previous;
    }

    // The band only reports changes in what crosses it, so reaching either end of the page is
    // picked up from scrolling, at most once a frame.
    let frame: number | undefined;
    const onScroll = () => {
      if (frame !== undefined) return;
      frame = requestAnimationFrame(() => {
        frame = undefined;
        retarget.current();
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      if (frame !== undefined) cancelAnimationFrame(frame);
      window.clearTimeout(stepTimer.current);
      stepTimer.current = undefined;
      retarget.current = () => {};
      cancelHold.current?.();
      held.current = false;
      window.clearTimeout(addressTimer.current);
    };
  }, [ids, show]);

  /** Highlights a section straight away and keeps it highlighted while the scroll to it runs. */
  const select = useCallback(
    (id: string) => {
      // A second click during the first one's scroll replaces its hold, so the first scroll's end
      // cannot release the second.
      cancelHold.current?.();
      window.clearTimeout(stepTimer.current);
      stepTimer.current = undefined;
      target.current = id;
      show(id);
      writeAddress(id);
      held.current = true;

      // The hold ends when the scroll goes quiet, which also covers browsers without `scrollend`.
      // If the reader scrolled during it, the highlight then catches up with where they are;
      // otherwise it stays on the clicked section, even one too short to reach the band.
      let interrupted = false;
      const listener = new AbortController();
      const options = { passive: true, signal: listener.signal };
      let quiet = window.setTimeout(() => release(), SCROLL_QUIET_MS * 2);
      const limit = window.setTimeout(() => release(), HOLD_LIMIT_MS);
      const cancel = () => {
        window.clearTimeout(quiet);
        window.clearTimeout(limit);
        listener.abort();
        cancelHold.current = null;
      };
      const release = () => {
        cancel();
        held.current = false;
        if (interrupted) retarget.current();
      };
      window.addEventListener(
        "scroll",
        () => {
          window.clearTimeout(quiet);
          quiet = window.setTimeout(release, SCROLL_QUIET_MS);
        },
        options,
      );
      window.addEventListener("scrollend", release, options);
      for (const type of READER_INPUT) window.addEventListener(type, () => (interrupted = true), options);
      cancelHold.current = cancel;
    },
    [show, writeAddress],
  );

  /** Scrolls to a section, or to the top for the first one, and highlights it. */
  const goTo = useCallback(
    (id: string | undefined) => {
      if (id === undefined || id === ids[0]) window.scrollTo({ top: 0 });
      else document.getElementById(id)?.scrollIntoView();
      if (ids.length > 0) select(id ?? ids[0]);
    },
    [ids, select],
  );

  // Arriving with a section in the address, by a link or a reload, holds the highlight on it while
  // the browser scrolls there, even if the section is too short to reach the highlight band.
  useEffect(() => {
    const id = decodeURIComponent(location.hash.slice(1));
    if (!ids.includes(id)) return;
    const frame = requestAnimationFrame(() => select(id));
    return () => cancelAnimationFrame(frame);
  }, [ids, select]);

  return [active, goTo] as const;
}
