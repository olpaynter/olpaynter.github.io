"use client";

import Link from "next/link";
import { type CSSProperties, useCallback, useEffect, useMemo, useRef, useState } from "react";

/**
 * A nav entry is either a section on the current page (`id`, highlighted while it is in view) or
 * another page (`href`, highlighted when `current` is set because the reader is on that page).
 */
export type NavItem = {
  label: string;
  id?: string;
  href?: string;
  current?: boolean;
  children?: NavItem[];
};

/**
 * Returns the id of the section crossing a band just above the middle of the viewport, and a
 * function that selects a section directly. A direct selection holds until the scroll it starts
 * has finished, so the highlight does not flick through every section passed on the way.
 */
function useActiveSection(ids: string[]) {
  const [active, setActive] = useState<string | undefined>(ids[0]);
  const held = useRef(false);

  useEffect(() => {
    const visible = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        if (held.current) return;
        // Chapters sit inside the journey section, so prefer the most specific visible id.
        const match = [...ids].reverse().find((id) => visible.has(id));
        if (match) setActive(match);
      },
      { rootMargin: "-35% 0px -60% 0px" },
    );
    for (const id of ids) {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    }
    return () => observer.disconnect();
  }, [ids]);

  const select = useCallback((id: string) => {
    setActive(id);
    held.current = true;
    const release = () => {
      held.current = false;
    };
    window.addEventListener("scrollend", release, { once: true });
    // Browsers without scrollend, or a click that causes no scroll, release after a short wait.
    window.setTimeout(release, 1200);
  }, []);

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

/**
 * Items are matched across pages by label, so an entry present on both pages (Home, Blog, each
 * post) glides to its new place during a page transition while the others fade.
 */
function transitionStyle({ label }: NavItem): CSSProperties {
  const name = `nav-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`;
  return { viewTransitionName: name, viewTransitionClass: "nav-item" } as CSSProperties;
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
        const key = item.href ?? item.id ?? item.label;
        const open = inBranch(item, active);
        // A parent of the current page stays highlighted, so it looks the same on both sides of a
        // page transition and glides rather than crossfading.
        const isActive =
          Boolean(item.current) ||
          (item.id !== undefined && item.id === active) ||
          (item.children ?? []).some((child) => child.current);
        const className = `group flex items-start ${nested ? "py-1.5 text-xs" : "py-2 text-sm"}`;
        const content = (
          <>
            <span
              aria-hidden
              className={`mr-4 h-px shrink-0 ${nested ? "mt-2" : "mt-2.5"} transition-all duration-300 ease-out motion-reduce:transition-none ${
                isActive
                  ? `bg-(--mark) ${nested ? "w-10" : "w-16"}`
                  : `bg-white/25 group-hover:bg-white/60 ${nested ? "w-5 group-hover:w-10" : "w-8 group-hover:w-16"}`
              }`}
            />
            {/* A fixed width, leaving room for the longest line, so a growing line slides the label
                along without changing where it wraps. */}
            <span
              className={`shrink-0 transition-colors duration-300 ease-out ${nested ? "w-[calc(100%-3.5rem)]" : "w-[calc(100%-5rem)]"} ${
                isActive ? "text-foreground" : "text-muted group-hover:text-foreground"
              }`}
            >
              {item.label}
            </span>
          </>
        );
        return (
          <li key={key}>
            {/* Items inside a closed fold take no part in page transitions; otherwise the snapshot
                shows them at full height, outside the fold, before it closes and unrolls. */}
            <div style={shown ? transitionStyle(item) : undefined}>
            {item.href ? (
              <Link href={item.href} aria-current={item.current ? "page" : undefined} className={className}>
                {content}
              </Link>
            ) : (
              <a
                href={`#${item.id}`}
                onClick={() => onSelect(item.id!)}
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

/** A section list fixed in the left margin, anchored at the top so folding sections do not shift it. Hidden below 1360px, where it would collide with the timeline dates. */
export function SiteNav({ items }: { items: NavItem[] }) {
  const ids = useMemo(() => sectionIds(items), [items]);
  const [active, select] = useActiveSection(ids);
  return (
    <nav aria-label="Site" className="fixed top-[30vh] left-6 z-20 hidden w-48 min-[1360px]:block">
      <NavList items={items} active={active} onSelect={select} />
    </nav>
  );
}

/** A plain back link for screens too narrow to show the side nav. */
export function BackLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="text-sm text-muted transition-colors duration-300 hover:text-foreground min-[1360px]:hidden"
    >
      ← {label}
    </Link>
  );
}
