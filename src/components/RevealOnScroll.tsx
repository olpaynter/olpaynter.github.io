"use client";

import { usePathname } from "next/navigation";
import { useLayoutEffect } from "react";

const SELECTOR = ".timeline-dot, .timeline-bar, .timeline-reveal";

/** The part of the viewport an element must reach to count as in view: all but the bottom tenth. */
const ROOT_MARGIN = "0px 0px -10% 0px";

/**
 * Plays the timeline entrances in browsers without scroll-driven animations, where the script in
 * the root layout has set `data-reveal`. As with scroll-driven animations, elements already in view
 * when a page arrives appear in their final state, and the rest play as they scroll into view. It
 * must come after the page in the layout, so that its layout effect runs after the router has
 * scrolled the new page into place.
 */
export function RevealOnScroll() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    const root = document.documentElement;
    if (!("reveal" in root.dataset)) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("revealed");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: ROOT_MARGIN },
    );
    const fold = window.innerHeight * 0.9;
    root.dataset.revealInstant = "";
    for (const element of document.querySelectorAll(`:is(${SELECTOR}):not(.revealed)`)) {
      const box = element.getBoundingClientRect();
      if (box.top < fold && box.bottom > 0) element.classList.add("revealed");
      else observer.observe(element);
    }
    // Applies the in-view elements' final state while transitions are off, before turning them on.
    void root.offsetHeight;
    delete root.dataset.revealInstant;
    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
