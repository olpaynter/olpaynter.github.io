"use client";

import { useId, useState } from "react";
import type { Reminder } from "@/data/reminders";

/** Matches the side nav's folds, so every unroll on the site moves the same way. */
const FOLD_MS = 600;

function Source({ reminder }: { reminder: Reminder }) {
  return (
    <>
      {reminder.href ? (
        <a href={reminder.href} className="text-(--link) underline-offset-4 hover:underline">
          {reminder.source}
        </a>
      ) : (
        reminder.source
      )}
      {reminder.archiveHref && (
        <>
          {" · "}
          <a href={reminder.archiveHref} className="underline-offset-4 hover:underline">
            saved copy
          </a>
        </>
      )}
    </>
  );
}

/** A pull quote whose reason unrolls beneath it on request. */
export function Quote({ reminder }: { reminder: Reminder }) {
  const [open, setOpen] = useState(false);
  const reasonId = useId();
  return (
    <div className="relative pl-10 sm:pl-0">
      {/* Below sm the page padding is too narrow to hang the mark outside, so it sits in an indent. */}
      <span
        aria-hidden
        className="t-serif absolute -top-2 left-0 text-6xl leading-none text-(--mark) select-none sm:-left-12 sm:text-7xl"
      >
        &ldquo;
      </span>
      <div className="border-l-2 border-(--mark) pl-5">
        <blockquote className="t-serif text-base leading-relaxed italic">{reminder.text}</blockquote>
        {reminder.source && (
          <p className="mt-2 text-sm text-muted">
            <Source reminder={reminder} />
          </p>
        )}
        <button
          type="button"
          aria-expanded={open}
          aria-controls={reasonId}
          onClick={() => setOpen((was) => !was)}
          className="mt-3 text-sm font-medium text-muted transition-colors duration-300 hover:text-foreground"
        >
          <span
            aria-hidden
            style={{ transitionDuration: `${FOLD_MS}ms` }}
            className={`mr-1.5 inline-block transition-transform ease-(--ease-settle) motion-reduce:transition-none ${open ? "rotate-90" : ""}`}
          >
            ▸
          </span>
          Why this stays with me
        </button>
        {/* Opening fades the reason in as it unrolls; closing keeps it visible until it is clipped. */}
        <div
          id={reasonId}
          inert={!open}
          style={{ transitionDuration: `${FOLD_MS}ms` }}
          className={`grid transition-[grid-template-rows,opacity] motion-reduce:transition-none ${
            open
              ? "grid-rows-[1fr] opacity-100 ease-out"
              : "grid-rows-[0fr] opacity-0 [transition-timing-function:var(--ease-settle),cubic-bezier(0.7,0,0.84,0)]"
          }`}
        >
          <div className="overflow-hidden">
            <p className="pt-3 leading-relaxed text-foreground/90">{reminder.why}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
