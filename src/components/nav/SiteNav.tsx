"use client";

import { usePathname } from "next/navigation";
import { type MouseEvent, useMemo } from "react";
import { NavRow } from "@/components/nav/NavRow";
import { useScrollSpy } from "@/components/nav/useScrollSpy";
import { type NavRowView, navRows, sectionEntries } from "@/components/nav/view";
import Link from "next/link";
import { hashFor } from "@/lib/nav/hash";
import { isPlainClick } from "@/lib/clicks";
import type { EntryAction, SiteNavigation } from "@/lib/nav/types";

const NO_ACTIONS: Record<string, EntryAction> = {};

const holdsHighlight = (row: NavRowView): boolean => row.highlighted || row.children.some(holdsHighlight);

/**
 * The side nav, fixed in the left margin from the `nav` breakpoint, below which it would collide
 * with the timeline dates. It is mounted once, in the root layout, and never replaced: moving to
 * another page changes only which rows are shown, where they lead and which is highlighted, so every
 * change is a CSS transition on the same elements. See "Side nav structure" in docs/development.md.
 */
export function SiteNav({ navigation }: { navigation: SiteNavigation }) {
  const pathname = usePathname();
  const actions = navigation.pages[pathname] ?? NO_ACTIONS;
  const sections = useMemo(() => sectionEntries(navigation.tree, actions), [navigation.tree, actions]);
  const ids = useMemo(() => sections.map(({ section }) => section), [sections]);
  const [active, goTo] = useScrollSpy(ids);
  const rows = navRows(navigation.tree, actions, sections, active);

  // The nav does its own scrolling for entries on this page. Left to the browser, a section link
  // would add a history entry and leave `history.state` without the router's data. Modified clicks,
  // such as opening in a new tab, keep their default.
  const onClick = (event: MouseEvent, action: EntryAction | undefined) => {
    if (!action || !isPlainClick(event)) return;
    if (action.section !== undefined) {
      event.preventDefault();
      goTo(action.section);
      return;
    }
    if (new URL(action.href, location.href).pathname !== location.pathname) return;
    // A link to the page already open, such as the current post, returns to its top.
    event.preventDefault();
    goTo(undefined);
  };

  return (
    <>
      <MobileNav rows={rows.filter((row) => row.present)} onClick={onClick} />
      {/* A fixed height, to the bottom of the screen, so the nav's box never changes size: a page
          transition draws the nav in a box sized when it starts, and would squash an unrolling entry
          into it. Only the list takes clicks, so the empty part of the box does not cover the page.
          The `steady` class keeps the nav out of page transitions; see globals.css. */}
      <nav
        aria-label="Site"
        className="steady site-nav pointer-events-none fixed top-[30vh] left-6 z-20 hidden h-[70vh] w-48 nav:block"
      >
        <ul className="pointer-events-auto">
          {rows.map((row) => (
            <NavRow key={row.key} row={row} onClick={onClick} />
          ))}
        </ul>
      </nav>
    </>
  );
}

/**
 * Below the `nav` breakpoint, where the side nav is hidden, the page's top-level entries sit in a
 * bar across the top of the screen. An entry is highlighted while the reader is anywhere beneath it.
 */
function MobileNav({
  rows,
  onClick,
}: {
  rows: NavRowView[];
  onClick: (event: MouseEvent, action: EntryAction | undefined) => void;
}) {
  return (
    <nav
      aria-label="Site"
      className="steady mobile-nav fixed inset-x-0 top-0 z-20 bg-linear-to-b from-background from-60% to-transparent nav:hidden"
    >
      <ul className="mx-auto flex max-w-3xl [scrollbar-width:none] gap-6 overflow-x-auto px-6 pt-4 pb-5 text-sm whitespace-nowrap">
        {rows.map((row) => {
          const { action } = row;
          const active = holdsHighlight(row);
          return (
            <li key={row.key}>
              <Link
                href={action?.href ?? (action?.section === undefined ? "#" : hashFor(action.section))}
                aria-current={action?.current ? "page" : active ? "location" : undefined}
                onClick={(event) => onClick(event, action)}
                className={`group relative inline-block py-1 transition-colors duration-300 ${
                  active ? "text-foreground" : "text-muted hover:text-foreground"
                }`}
              >
                {row.label}
                <span
                  aria-hidden
                  className={`absolute inset-x-0 -bottom-0.5 h-px origin-left bg-(--mark) transition-transform duration-300 ease-out motion-reduce:transition-none ${
                    active ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
