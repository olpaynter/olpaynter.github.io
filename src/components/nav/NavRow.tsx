import Link from "next/link";
import { createContext, type MouseEvent, type ReactNode, useContext, useEffect, useState } from "react";
import type { NavRowView } from "@/components/nav/view";
import { hashFor } from "@/lib/nav/hash";
import type { EntryAction } from "@/lib/nav/types";

/** How long a fold takes to unroll or roll up. It sets both the CSS transition and the settle timer. */
const FOLD_MS = 600;

/** Whether a fold around this point is opening or closing, if one is. */
const EnclosingFold = createContext<"opening" | "closing" | undefined>(undefined);

/**
 * Content that unrolls when `open` and rolls up when not. Only the outermost fold that changes
 * animates, so a branch moves as one block and nested folds never multiply their motion:
 * - while a fold around this one opens, this one takes its new state at once, before it is seen;
 * - while a fold around this one closes, this one keeps its look until it is out of sight, so the
 *   branch rolls up with its contents still in it.
 */
function Fold({ open, children }: { open: boolean; children: ReactNode }) {
  const enclosing = useContext(EnclosingFold);
  const [held, setHeld] = useState(open);
  const shown = enclosing === "closing" ? held : open;
  const [settled, setSettled] = useState(shown);

  useEffect(() => {
    if (enclosing === "closing" || held === open) return;
    const frame = requestAnimationFrame(() => setHeld(open));
    return () => cancelAnimationFrame(frame);
  }, [enclosing, held, open]);

  useEffect(() => {
    if (settled === shown) return;
    const timer = window.setTimeout(() => setSettled(shown), enclosing ? 0 : FOLD_MS);
    return () => window.clearTimeout(timer);
  }, [enclosing, settled, shown]);

  const changing = settled !== shown ? (shown ? "opening" : "closing") : undefined;

  // Opening fades the content in as it unrolls. Closing keeps it visible while it is clipped, and
  // fades it only at the end, so the reader sees it roll up rather than an empty space closing.
  const motion = enclosing
    ? "transition-none"
    : `transition-[grid-template-rows,opacity] motion-reduce:transition-none ${
        shown ? "ease-out" : "[transition-timing-function:var(--ease-settle),cubic-bezier(0.7,0,0.84,0)]"
      }`;
  return (
    <div
      inert={!shown}
      style={{ transitionDuration: enclosing ? undefined : `${FOLD_MS}ms` }}
      className={`grid ${motion} ${shown ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
    >
      <div className="overflow-hidden">
        <EnclosingFold.Provider value={changing ?? enclosing}>{children}</EnclosingFold.Provider>
      </div>
    </div>
  );
}

/**
 * One entry of the side nav, with the entries beneath it. It is the same element on every page,
 * whether the entry scrolls to a section, links to a page or is folded away, so React updates it in
 * place and every change of look is a CSS transition.
 */
export function NavRow({
  row,
  onClick,
}: {
  row: NavRowView;
  onClick: (event: MouseEvent, action: EntryAction | undefined) => void;
}) {
  const nested = row.depth > 0;
  const { action, highlighted } = row;

  return (
    <li>
      <Fold open={row.present}>
        <Link
          href={action?.href ?? (action?.section === undefined ? "#" : hashFor(action.section))}
          aria-current={action?.current ? "page" : highlighted ? "location" : undefined}
          onClick={(event) => onClick(event, action)}
          className={`group flex items-start ${nested ? "py-1.5 text-xs" : "py-2 text-sm"}`}
        >
          {/* The line is drawn at full length and scaled to half when not highlighted, and the
              label is shifted back by the same amount. Tailwind's scale and translate utilities set
              the CSS `scale` and `translate` properties, so those are what the transitions name.
              Neither touches layout, and the label slides along as the line grows. */}
          <span
            aria-hidden
            className={`mr-4 h-px shrink-0 origin-left transition-[scale,background-color] duration-300 ease-out motion-reduce:transition-none ${
              nested ? "mt-2 w-10" : "mt-2.5 w-16"
            } ${highlighted ? "bg-(--mark)" : "scale-x-50 bg-white/25 group-hover:scale-x-100 group-hover:bg-white/60"}`}
          />
          {/* A fixed width, leaving room for the full line, so the label never re-wraps. */}
          <span
            className={`shrink-0 transition-[translate,color] duration-300 ease-out motion-reduce:transition-none ${
              nested ? "w-[calc(100%-3.5rem)]" : "w-[calc(100%-5rem)]"
            } ${
              highlighted
                ? "text-foreground"
                : `text-muted group-hover:translate-x-0 group-hover:text-foreground ${nested ? "-translate-x-5" : "-translate-x-8"}`
            }`}
          >
            {row.label}
          </span>
        </Link>
        {row.children.length > 0 && (
          <Fold open={row.unrolled}>
            <ul className="mt-1 pl-4">
              {row.children.map((child) => (
                <NavRow key={child.key} row={child} onClick={onClick} />
              ))}
            </ul>
          </Fold>
        )}
      </Fold>
    </li>
  );
}
