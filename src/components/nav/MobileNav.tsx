"use client";

import Link from "next/link";
import { type MouseEvent, useEffect, useRef, useState } from "react";
import type { NavRowView } from "@/components/nav/view";
import { hashFor } from "@/lib/nav/hash";
import type { EntryAction } from "@/lib/nav/types";

/** Matches the side nav's folds, so the second row unrolls the same way. */
const FOLD_MS = 600;

type Click = (event: MouseEvent, action: EntryAction | undefined) => void;

/** The entries beside the highlighted one, under its parent, when the highlight is below the top level. */
type Level = { parent: NavRowView; items: NavRowView[]; activeKey: string };

const holdsHighlight = (row: NavRowView): boolean => row.highlighted || row.children.some(holdsHighlight);

function levelOf(rows: NavRowView[], parent?: NavRowView): Level | undefined {
  for (const row of rows) {
    if (row.highlighted)
      return parent && { parent, items: parent.children.filter((c) => c.present), activeKey: row.key };
    const below = levelOf(row.children, row);
    if (below) return below;
  }
}

function hrefOf(action: EntryAction | undefined) {
  return action?.href ?? (action?.section === undefined ? "#" : hashFor(action.section));
}

/** A row of entries that scrolls sideways, keeping the active entry in view. */
function Strip({
  items,
  isActive,
  onClick,
  lead,
  small,
}: {
  items: NavRowView[];
  isActive: (row: NavRowView) => boolean;
  onClick: Click;
  lead?: NavRowView;
  small?: boolean;
}) {
  const list = useRef<HTMLUListElement>(null);
  const activeKey = items.find(isActive)?.key;

  useEffect(() => {
    const strip = list.current;
    const item = strip?.querySelector<HTMLElement>(`[data-key="${activeKey}"]`);
    if (!strip || !item) return;
    const margin = 24;
    if (
      item.offsetLeft - margin < strip.scrollLeft ||
      item.offsetLeft + item.offsetWidth + margin > strip.scrollLeft + strip.clientWidth
    ) {
      const smooth = matchMedia("(prefers-reduced-motion: no-preference)").matches;
      strip.scrollTo({ left: item.offsetLeft - margin, behavior: smooth ? "smooth" : "auto" });
    }
  }, [activeKey]);

  return (
    <ul
      ref={list}
      className={`relative mx-auto flex max-w-3xl [scrollbar-width:none] items-baseline overflow-x-auto [mask-image:linear-gradient(to_right,transparent,black_1.5rem,black_calc(100%-1.5rem),transparent)] px-6 whitespace-nowrap ${
        small ? "gap-5 text-xs" : "gap-6 text-sm"
      }`}
    >
      {lead && (
        <li className="text-muted">
          <Link
            href={hrefOf(lead.action)}
            onClick={(event) => onClick(event, lead.action)}
            className="hover:text-foreground"
          >
            {lead.label}
          </Link>
          <span aria-hidden className="ml-2">
            ›
          </span>
        </li>
      )}
      {items.map((row) => {
        const active = isActive(row);
        return (
          <li key={row.key} data-key={row.key}>
            <Link
              href={hrefOf(row.action)}
              aria-current={row.action?.current ? "page" : active ? "location" : undefined}
              onClick={(event) => onClick(event, row.action)}
              className={`relative inline-block py-1 transition-colors duration-300 ${
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
  );
}

/**
 * Below the `nav` breakpoint, where the side nav is hidden, the nav is a bar across the top of the
 * screen. The first row holds the page's top-level entries. When the highlight is deeper, a second
 * row unrolls beneath with the highlighted entry and those beside it, led by their parent when the
 * parent is not already in the first row. Only these two levels show, however deep the nav goes.
 */
export function MobileNav({ rows, onClick }: { rows: NavRowView[]; onClick: Click }) {
  const top = rows.filter((row) => row.present);
  const level = levelOf(top);

  // While the second row rolls up, it keeps showing the entries it last had.
  const signature = level ? `${level.parent.key}:${level.items.map((item) => item.key).join(",")}` : "";
  const [last, setLast] = useState<{ signature: string; level?: Level }>({ signature, level });
  if (level && (last.signature !== signature || last.level?.activeKey !== level.activeKey)) {
    setLast({ signature, level });
  }
  const shown = level ?? last.level;
  const open = level !== undefined;

  return (
    <nav
      aria-label="Site"
      className="steady mobile-nav fixed inset-x-0 top-0 z-20 bg-linear-to-b from-background from-70% to-transparent pt-4 pb-5 nav:hidden"
    >
      <Strip items={top} isActive={holdsHighlight} onClick={onClick} />
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
          {shown && (
            <div className="pt-2">
              <Strip
                items={shown.items}
                isActive={(row) => row.key === shown.activeKey || holdsHighlight(row)}
                onClick={onClick}
                lead={shown.parent.depth > 0 ? shown.parent : undefined}
                small
              />
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
