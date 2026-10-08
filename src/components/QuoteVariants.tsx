import type { Reminder } from "@/data/reminders";

function OptionLabel({ n, name }: { n: number; name: string }) {
  return (
    <p className="mb-3 text-xs font-semibold tracking-widest text-muted uppercase">
      Option {n} · {name}
    </p>
  );
}

function Source({ reminder }: { reminder: Reminder }) {
  if (!reminder.source) return null;
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

/** Below `sm` the page padding is too narrow to hang the mark outside, so it sits inside an indent instead. */
function HangingMark({ className }: { className: string }) {
  return (
    <span aria-hidden className={`t-serif absolute top-0 left-0 leading-none text-(--mark) select-none ${className}`}>
      &ldquo;
    </span>
  );
}

export function PullQuote({ reminder }: { reminder: Reminder }) {
  return (
    <div>
      <OptionLabel n={1} name="Pull quote, folded text" />
      <figure className="relative pl-10 sm:pl-0">
        <HangingMark className="-top-2 text-6xl sm:-left-12 sm:text-7xl" />
        <div className="border-l-2 border-(--mark) pl-5">
          <blockquote className="t-serif text-base leading-relaxed italic">{reminder.text}</blockquote>
          <figcaption className="mt-2 text-sm text-muted">
            <Source reminder={reminder} />
          </figcaption>
        </div>
      </figure>
      <details className="group mt-3 pl-15 sm:pl-5">
        <summary className="cursor-pointer list-none text-sm font-medium text-muted transition-colors hover:text-foreground">
          <span
            aria-hidden
            className="mr-1.5 inline-block transition-transform duration-300 group-open:rotate-90 motion-reduce:transition-none"
          >
            ▸
          </span>
          Why this stays with me
        </summary>
        <p className="mt-3 leading-relaxed text-foreground/90">{reminder.why}</p>
      </details>
    </div>
  );
}

/**
 * The reason reads in the column and the quote sits beside it in the right margin. Below the nav
 * breakpoint the margin is too narrow, so the quote falls back to sitting above the reason.
 */
export function MarginNote({ reminder }: { reminder: Reminder }) {
  return (
    <div className="relative">
      <OptionLabel n={3} name="Margin note" />
      <aside className="relative mb-5 pl-10 nav:absolute nav:top-0 nav:left-[calc(100%+4rem)] nav:mb-0 nav:w-56 nav:pl-0">
        <HangingMark className="-top-1 text-5xl nav:-left-9" />
        <blockquote className="t-serif border-l border-(--mark) pl-4 text-sm leading-relaxed italic">
          {reminder.text}
        </blockquote>
        <p className="mt-2 pl-4 text-xs text-muted">
          <Source reminder={reminder} />
        </p>
      </aside>
      <p className="leading-relaxed text-foreground/90">{reminder.why}</p>
    </div>
  );
}
