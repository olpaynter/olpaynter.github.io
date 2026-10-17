"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type MouseEvent, useLayoutEffect, useRef, useState } from "react";
import type { NavRowView } from "@/components/nav/view";
import { hashFor } from "@/lib/nav/hash";
import type { EntryAction } from "@/lib/nav/types";
import { homeSections, routes } from "@/lib/routes";

type Click = (event: MouseEvent, action: EntryAction | undefined) => void;

/** The bar always holds the same three entries; the keys match the side nav's top-level entries. */
const ENTRIES = [
  { key: "home", label: "Home", href: routes.home },
  { key: "journey", label: "Journey", href: `${routes.home}${hashFor(homeSections.journey)}` },
  { key: "blog", label: "Blog", href: routes.blog },
];

const holdsHighlight = (row: NavRowView): boolean => row.highlighted || row.children.some(holdsHighlight);

/**
 * The nav below the `nav` breakpoint: a slim bar with the three top-level entries and one underline
 * that slides to the entry holding the side nav's highlight, so Journey takes it while the journey
 * section is in view, Blog on a post, and Home on the resume. On a post, a line along the bar's foot
 * fills as the post is read.
 */
export function MobileBar({ rows, onClick }: { rows: NavRowView[]; onClick: Click }) {
  const pathname = usePathname();
  const active = rows.find((row) => row.present && holdsHighlight(row))?.key ?? "home";
  const labels = useRef<Record<string, HTMLSpanElement | null>>({});
  const [line, setLine] = useState<{ x: number; width: number; placed: boolean }>();

  useLayoutEffect(() => {
    const measure = () => {
      const label = labels.current[active];
      // The first placement jumps into position; only later moves slide.
      if (label) setLine((was) => ({ x: label.offsetLeft, width: label.offsetWidth, placed: was !== undefined }));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [active]);

  return (
    <nav aria-label="Site" className="steady mobile-nav pointer-events-none fixed inset-x-0 top-0 z-20 nav:hidden">
      <div className="pointer-events-auto relative bg-background px-6 pt-1">
        <div className="relative mx-auto flex max-w-3xl gap-4 text-sm">
          {ENTRIES.map((entry) => {
            const action = rows.find((row) => row.key === entry.key && row.present)?.action;
            const href = action?.href ?? (action?.section === undefined ? entry.href : hashFor(action.section));
            const current = entry.key === active;
            return (
              <Link
                key={entry.key}
                href={href}
                aria-current={current ? (action?.current ? "page" : "location") : undefined}
                onClick={(event) => onClick(event, action)}
                className={`-mx-2 px-2 py-3 transition-colors duration-300 ${
                  current ? "text-foreground" : "text-muted hover:text-foreground"
                }`}
              >
                <span
                  ref={(element) => {
                    labels.current[entry.key] = element;
                  }}
                >
                  {entry.label}
                </span>
              </Link>
            );
          })}
          {line && (
            <span
              aria-hidden
              style={{ transform: `translateX(${line.x}px) scaleX(${line.width})` }}
              className={`absolute bottom-2.5 left-0 h-px w-px origin-left bg-(--mark) ${
                line.placed
                  ? "transition-transform duration-500 ease-(--ease-settle) motion-reduce:transition-none"
                  : ""
              }`}
            />
          )}
        </div>
        {pathname.startsWith(`${routes.blog}/`) && (
          <span aria-hidden className="reading-progress absolute inset-x-0 bottom-0 h-px origin-left bg-(--mark)/60" />
        )}
      </div>
      <div aria-hidden className="h-6 bg-linear-to-b from-background to-transparent" />
    </nav>
  );
}
