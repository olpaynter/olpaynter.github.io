"use client";

import { usePathname } from "next/navigation";
import { type MouseEvent, useMemo } from "react";
import { NavRow } from "@/components/nav/NavRow";
import { useScrollSpy } from "@/components/nav/useScrollSpy";
import { navRows, sectionEntries } from "@/components/nav/view";
import type { EntryAction, SiteNavigation } from "@/lib/nav/types";

const NO_ACTIONS: Record<string, EntryAction> = {};

function isPlainClick(event: MouseEvent) {
  return event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;
}

/**
 * The side nav, fixed in the left margin from the `nav` breakpoint, below which it would collide
 * with the timeline dates. It is mounted once, in the root layout, and never replaced: moving to
 * another page changes only which rows are shown, where they lead and which is highlighted, so every
 * change is a CSS transition on the same elements. See "Side nav structure" in the README.
 */
export function SiteNav({ navigation }: { navigation: SiteNavigation }) {
  const pathname = usePathname();
  const actions = navigation.pages[pathname] ?? navigation.pages[pathname.replace(/\/$/, "")] ?? NO_ACTIONS;
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
    const url = new URL(action.href, location.href);
    if (url.pathname !== location.pathname) return;
    // A link to the page already open, such as the current post, returns to its top, or to the
    // section it names.
    event.preventDefault();
    const section = decodeURIComponent(url.hash.slice(1));
    goTo(ids.includes(section) ? section : undefined);
  };

  return (
    // A fixed height, to the bottom of the screen, so the nav's box never changes size: a page
    // transition draws the nav in a box sized when it starts, and would squash an unrolling entry
    // into it. Only the list takes clicks, so the empty part of the box does not cover the page.
    // The `steady` class keeps the nav out of page transitions; see globals.css.
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
  );
}
