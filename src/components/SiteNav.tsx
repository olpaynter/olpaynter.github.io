"use client";

import Link from "next/link";
import { type CSSProperties, useCallback, useEffect, useMemo, useRef, useState } from "react";

type NavBase = {
  label: string;
  children?: NavItem[];
  /**
   * Names the item for page transitions. Defaults to the label, so an entry with the same label on
   * both pages glides between them. Section entries pass their own key so a heading that happens to
   * share a page label cannot produce two equal names, which would abort the transition.
   */
  transitionKey?: string;
};

/** A section on the current page, highlighted while it is in view. */
type NavSection = NavBase & { id: string; href?: never; current?: never };

/** Another page, highlighted when `current` is set because the reader is on it. */
type NavPage = NavBase & { href: string; id?: never; current?: boolean };

export type NavItem = NavSection | NavPage;

/** How long a clicked section keeps the highlight if the browser never reports the end of the scroll. */
const HOLD_FALLBACK_MS = 1200;

/**
 * The shortest time the highlight stays on one section while scrolling. However fast the scroll,
 * the highlight steps through every section in order, holding each for at least this long.
 */
const MIN_DWELL_MS = 75;

/**
 * Returns the highlighted section id and a function that selects a section directly.
 *
 * Scrolling sets a target, the section crossing a band just above the middle of the viewport, and
 * the highlight walks towards it one section at a time so that none is skipped. A click instead
 * jumps straight to the clicked section and holds there until the scroll it starts has finished.
 */
function useActiveSection(ids: string[]) {
  const [active, setActive] = useState<string | undefined>(ids[0]);
  const shown = useRef(active);
  const target = useRef(active);
  const held = useRef(false);
  const cancelHold = useRef<(() => void) | null>(null);
  const stepTimer = useRef<number | undefined>(undefined);
  const lastStep = useRef(0);

  const show = useCallback((id: string) => {
    shown.current = id;
    lastStep.current = performance.now();
    setActive(id);
  }, []);

  useEffect(() => {
    const visible = new Set<string>();

    const step = () => {
      stepTimer.current = undefined;
      if (held.current || !target.current || shown.current === target.current) return;
      const from = shown.current ? ids.indexOf(shown.current) : -1;
      const to = ids.indexOf(target.current);
      show(from === -1 ? target.current : ids[from + Math.sign(to - from)]);
      stepTimer.current = window.setTimeout(step, MIN_DWELL_MS);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        // Chapters sit inside the journey section, so prefer the most specific visible id.
        const match = [...ids].reverse().find((id) => visible.has(id));
        if (!match) return;
        target.current = match;
        if (held.current || stepTimer.current !== undefined) return;
        const wait = lastStep.current + MIN_DWELL_MS - performance.now();
        if (wait <= 0) step();
        else stepTimer.current = window.setTimeout(step, wait);
      },
      { rootMargin: "-35% 0px -60% 0px" },
    );
    for (const id of ids) {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    }
    return () => {
      observer.disconnect();
      window.clearTimeout(stepTimer.current);
      stepTimer.current = undefined;
    };
  }, [ids, show]);

  const select = useCallback(
    (id: string) => {
      // A second click during the first one's scroll replaces its hold, so the first scroll's end
      // cannot release the second.
      cancelHold.current?.();
      window.clearTimeout(stepTimer.current);
      stepTimer.current = undefined;
      target.current = id;
      show(id);
      held.current = true;

      const listener = new AbortController();
      const release = () => {
        held.current = false;
        cancel();
      };
      const timer = window.setTimeout(release, HOLD_FALLBACK_MS);
      const cancel = () => {
        window.clearTimeout(timer);
        listener.abort();
        cancelHold.current = null;
      };
      window.addEventListener("scrollend", release, { once: true, signal: listener.signal });
      cancelHold.current = cancel;
    },
    [show],
  );

  useEffect(() => () => cancelHold.current?.(), []);

  // Arriving from another page with a section in the URL, such as /#icrtouch, highlights that
  // section even when it is too short to reach the highlight band.
  useEffect(() => {
    const id = decodeURIComponent(location.hash.slice(1));
    if (!ids.includes(id)) return;
    const frame = requestAnimationFrame(() => select(id));
    return () => cancelAnimationFrame(frame);
  }, [ids, select]);

  return [active, select] as const;
}

function transitionStyle(item: NavItem): CSSProperties {
  const key =
    item.transitionKey ??
    item.label
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  return { viewTransitionName: `nav-${key}`, viewTransitionClass: "nav-item" } as CSSProperties;
}

/** Whether the reader is on this item, or in a section or page beneath it. */
function inBranch(item: NavItem, active?: string): boolean {
  if (item.current || (item.id !== undefined && item.id === active)) return true;
  return (item.children ?? []).some((child) => inBranch(child, active));
}

function sectionIds(items: NavItem[]): string[] {
  return items.flatMap((item) => [...(item.id ? [item.id] : []), ...sectionIds(item.children ?? [])]);
}

function NavList({
  items,
  active,
  onSelect,
  nested = false,
  shown = true,
}: {
  items: NavItem[];
  active?: string;
  onSelect: (id: string) => void;
  nested?: boolean;
  /** False while an enclosing fold is closed. */
  shown?: boolean;
}) {
  return (
    <ul className={nested ? "mt-1 pl-4" : ""}>
      {items.map((item) => {
        const open = inBranch(item, active);
        // A parent of the current page stays highlighted, so it looks the same on both sides of a
        // page transition and glides rather than crossfading.
        const isActive =
          Boolean(item.current) ||
          (item.id !== undefined && item.id === active) ||
          (item.children ?? []).some((child) => child.current);
        const className = `group flex items-start ${nested ? "py-1.5 text-xs" : "py-2 text-sm"}`;

        // The line is drawn at full length and scaled to half when inactive, and the label is
        // shifted back by the same amount. Tailwind's scale and translate utilities set the CSS
        // `scale` and `translate` properties, so those are what the transitions name. Neither
        // touches layout, and the label still slides along as the line grows.
        const content = (
          <>
            <span
              aria-hidden
              className={`mr-4 h-px shrink-0 origin-left transition-[scale,background-color] duration-300 ease-out motion-reduce:transition-none ${
                nested ? "mt-2 w-10" : "mt-2.5 w-16"
              } ${isActive ? "bg-(--mark)" : "scale-x-50 bg-white/25 group-hover:scale-x-100 group-hover:bg-white/60"}`}
            />
            {/* A fixed width, leaving room for the full line, so the label never re-wraps. */}
            <span
              className={`shrink-0 transition-[translate,color] duration-300 ease-out motion-reduce:transition-none ${
                nested ? "w-[calc(100%-3.5rem)]" : "w-[calc(100%-5rem)]"
              } ${
                isActive
                  ? "text-foreground"
                  : `text-muted group-hover:translate-x-0 group-hover:text-foreground ${nested ? "-translate-x-5" : "-translate-x-8"}`
              }`}
            >
              {item.label}
            </span>
          </>
        );

        return (
          <li key={item.href ?? item.id}>
            {/* Items inside a closed fold take no part in page transitions; otherwise the snapshot
                shows them at full height, outside the fold, before it closes and unrolls. */}
            <div style={shown ? transitionStyle(item) : undefined}>
              {item.href !== undefined ? (
                <Link href={item.href} aria-current={item.current ? "page" : undefined} className={className}>
                  {content}
                </Link>
              ) : (
                <a
                  href={`#${item.id}`}
                  onClick={() => onSelect(item.id)}
                  aria-current={isActive ? "location" : undefined}
                  className={className}
                >
                  {content}
                </a>
              )}
            </div>
            {item.children && (
              // Children stay folded away until the reader reaches this part of the site, so the
              // nav stays short however long the journey grows.
              <div
                inert={!open}
                className={`grid transition-[grid-template-rows,opacity] duration-500 ease-out motion-reduce:transition-none ${
                  open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <NavList items={item.children} active={active} onSelect={onSelect} nested shown={shown && open} />
                </div>
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}

/**
 * The section list fixed in the left margin, anchored at the top so folding sections do not shift
 * it. It appears from the `nav` breakpoint, below which it would collide with the timeline dates.
 */
export function SiteNav({ items }: { items: NavItem[] }) {
  const ids = useMemo(() => sectionIds(items), [items]);
  const [active, select] = useActiveSection(ids);
  return (
    <nav aria-label="Site" className="fixed top-[30vh] left-6 z-20 hidden w-48 nav:block">
      <NavList items={items} active={active} onSelect={select} />
    </nav>
  );
}

/** A plain back link for screens too narrow to show the side nav. */
export function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="text-sm text-muted transition-colors duration-300 hover:text-foreground nav:hidden">
      ← {label}
    </Link>
  );
}
