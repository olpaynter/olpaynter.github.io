"use client";

import Link from "next/link";
import { type MouseEvent, type ReactNode, useEffect, useRef, useState } from "react";
import type { NavRowView } from "@/components/nav/view";
import { hashFor } from "@/lib/nav/hash";
import type { EntryAction } from "@/lib/nav/types";

/** Matches the side nav's folds, so every entry in the bar moves the same way. */
const FOLD_MS = 600;

type Click = (event: MouseEvent, action: EntryAction | undefined) => void;

/**
 * What the second row shows: the entries under `parent`, one of which holds the highlight. Keys
 * only, so a row that is rolling up can keep showing them after the page has moved on.
 */
type Level = { parent: string; parentDepth: number; items: string[]; active: string };

const holdsHighlight = (row: NavRowView): boolean => row.highlighted || row.children.some(holdsHighlight);

function levelOf(rows: NavRowView[], parent?: NavRowView): Level | undefined {
  for (const row of rows) {
    if (row.highlighted) {
      if (!parent) return undefined;
      const items = parent.children.filter((child) => child.present).map((child) => child.key);
      return { parent: parent.key, parentDepth: parent.depth, items, active: row.key };
    }
    const below = levelOf(row.children, row);
    if (below) return below;
  }
}

const below = (rows: NavRowView[]): NavRowView[] => rows.flatMap((row) => [row, ...below(row.children)]);

function hrefOf(action: EntryAction | undefined) {
  return action?.href ?? (action?.section === undefined ? "#" : hashFor(action.section));
}

/**
 * Folds sideways, the way the side nav's folds roll up and down: every entry stays mounted on every
 * page, and one the page does not show closes to no width. Opening fades it in as it widens;
 * closing keeps it visible while it narrows.
 */
function SideFold({ open, children, className = "" }: { open: boolean; children: ReactNode; className?: string }) {
  return (
    <li
      inert={!open}
      style={{ transitionDuration: `${FOLD_MS}ms` }}
      className={`grid shrink-0 transition-[grid-template-columns,opacity] motion-reduce:transition-none ${
        open
          ? "grid-cols-[1fr] opacity-100 ease-out"
          : "grid-cols-[0fr] opacity-0 [transition-timing-function:var(--ease-settle),cubic-bezier(0.7,0,0.84,0)]"
      } ${className}`}
    >
      <div className="min-w-0 overflow-hidden">{children}</div>
    </li>
  );
}

function Entry({ row, active, onClick }: { row: NavRowView; active: boolean; onClick: Click }) {
  return (
    <Link
      href={hrefOf(row.action)}
      aria-current={row.action?.current ? "page" : active ? "location" : undefined}
      onClick={(event) => onClick(event, row.action)}
      data-active={active || undefined}
      className={`relative mr-6 inline-block py-1 transition-colors duration-300 ${
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
  );
}

/** A row that scrolls sideways, keeping its active entry in view, including after entries fold. */
function Scroller({ children, watch }: { children: ReactNode; watch: string }) {
  const list = useRef<HTMLUListElement>(null);
  useEffect(() => {
    const reveal = () => {
      const strip = list.current;
      const item = strip?.querySelector<HTMLElement>("[data-active]")?.closest("li");
      if (!strip || !item) return;
      const margin = 24;
      const left = item.offsetLeft - margin;
      if (
        left < strip.scrollLeft ||
        item.offsetLeft + item.offsetWidth + margin > strip.scrollLeft + strip.clientWidth
      ) {
        const smooth = matchMedia("(prefers-reduced-motion: no-preference)").matches;
        strip.scrollTo({ left, behavior: smooth ? "smooth" : "auto" });
      }
    };
    reveal();
    // Entries that are folding change width for FOLD_MS, so check again once they have settled.
    const settled = setTimeout(reveal, FOLD_MS);
    return () => clearTimeout(settled);
  }, [watch]);
  return (
    <ul
      ref={list}
      className="relative flex min-w-0 flex-1 [scrollbar-width:none] items-baseline overflow-x-auto [mask-image:linear-gradient(to_right,transparent,black_1.5rem,black_calc(100%-1.5rem),transparent)] px-6 whitespace-nowrap"
    >
      {children}
    </ul>
  );
}

/**
 * Below the `nav` breakpoint, where the side nav is hidden, the nav is a bar across the top of the
 * screen. The first row holds the top-level entries. When the highlight is deeper, a second row
 * unrolls beneath with the highlighted entry and those beside it. When their parent is not in the
 * first row, it is pinned at the start of the second row and the entries scroll beside it, so only
 * two levels show however deep the nav goes. Like the side nav, every entry is the same element on
 * every page, and showing or hiding one is a fold rather than a new element.
 */
export function MobileNav({ rows, onClick }: { rows: NavRowView[]; onClick: Click }) {
  const level = levelOf(rows);

  // While the second row rolls up, it keeps showing the entries it last had.
  const [last, setLast] = useState(level);
  const sameLevel =
    last?.parent === level?.parent && last?.active === level?.active && last?.items.join() === level?.items.join();
  if (level && !sameLevel) setLast(level);
  const shown = level ?? last;
  const open = level !== undefined;

  const deeper = below(rows.flatMap((row) => row.children));
  const items = new Set(shown?.items);
  const pinned = shown && shown.parentDepth > 0 ? shown.parent : undefined;
  const topActive = rows.find((row) => row.present && holdsHighlight(row))?.key ?? "";

  return (
    <nav
      aria-label="Site"
      className="steady mobile-nav fixed inset-x-0 top-0 z-20 bg-linear-to-b from-background from-70% to-transparent pt-4 pb-5 nav:hidden"
    >
      <div className="mx-auto max-w-3xl text-sm">
        <Scroller watch={topActive}>
          {rows.map((row) => (
            <SideFold key={row.key} open={row.present}>
              <Entry row={row} active={row.key === topActive} onClick={onClick} />
            </SideFold>
          ))}
        </Scroller>
      </div>
      <div
        inert={!open}
        style={{ transitionDuration: `${FOLD_MS}ms` }}
        className={`grid transition-[grid-template-rows,opacity] motion-reduce:transition-none ${
          open
            ? "grid-rows-[1fr] opacity-100 ease-out"
            : "grid-rows-[0fr] opacity-0 [transition-timing-function:var(--ease-settle),cubic-bezier(0.7,0,0.84,0)]"
        }`}
      >
        <div className="overflow-hidden">
          <div className="mx-auto flex max-w-3xl items-baseline pt-2 text-xs">
            <ul className="flex shrink-0 items-baseline">
              {deeper
                .filter((row) => row.children.length > 0)
                .map((row) => (
                  <SideFold key={row.key} open={row.key === pinned}>
                    <span className="ml-6 inline-flex items-baseline gap-2 text-muted">
                      <Link
                        href={hrefOf(row.action)}
                        onClick={(event) => onClick(event, row.action)}
                        className="max-w-[9rem] truncate py-1 transition-colors duration-300 hover:text-foreground"
                      >
                        {row.label}
                      </Link>
                      <span aria-hidden>›</span>
                    </span>
                  </SideFold>
                ))}
            </ul>
            <Scroller watch={`${shown?.parent}:${shown?.active}`}>
              {deeper.map((row) => (
                <SideFold key={row.key} open={items.has(row.key)}>
                  <Entry
                    row={row}
                    active={row.key === shown?.active || (items.has(row.key) && holdsHighlight(row))}
                    onClick={onClick}
                  />
                </SideFold>
              ))}
            </Scroller>
          </div>
        </div>
      </div>
    </nav>
  );
}
