import Image from "next/image";
import Link from "next/link";
import { type Chapter, chapterAnchor, type Photo, type Role } from "@/data/journey";
import { monthYear } from "@/lib/dates";
import { checkedLink } from "@/lib/nav/siteMap";

// The line's centre is 0.5rem + 0.5px from the chapter's left edge below sm, and 0.5px from sm up.
// Chapter content is indented 2rem. Dots are 0.6875rem (11px at the default size) and the bar is
// 0.1875rem, so each sits half its width left of the centre. Sizes are in rem so they scale with the
// root font size on large screens; only the 1px line stays in px.
const line = {
  bar: "left-[calc(0.5rem+0.5px-0.09375rem)] sm:left-[calc(0.5px-0.09375rem)]",
  thin: "left-2 sm:left-0",
  chapterDot: "left-[calc(0.5rem+0.5px-0.34375rem)] sm:left-[calc(0.5px-0.34375rem)]",
  roleDot: "left-[calc(0.5px-1.5rem-0.34375rem)] sm:left-[calc(0.5px-2rem-0.34375rem)]",
};

// Margin labels only exist from lg up; narrower screens have no margin, so the dates go inline,
// in the timeline's colour so they read as part of it.
const inlineDate = "text-xs font-medium tracking-wide text-(--mark) lg:hidden";
const chapterLabel = "hidden lg:block absolute right-[calc(100%+1.25rem)] whitespace-nowrap text-sm text-muted";
const roleLabel = "hidden lg:block absolute right-[calc(100%+3.25rem)] whitespace-nowrap text-sm text-muted";

function Dot({ className, live }: { className: string; live?: boolean }) {
  return (
    <span aria-hidden className={`timeline-dot absolute z-10 h-[0.6875rem] w-[0.6875rem] ${className}`}>
      {live && <span className="absolute inset-0 rounded-full bg-(--mark)/70 motion-safe:animate-ping" />}
      <span className="absolute inset-0 rounded-full bg-(--mark) ring-[0.25rem] ring-background" />
    </span>
  );
}

function Highlights({ items, className }: { items: string[]; className: string }) {
  return (
    <ul className={`list-disc pl-5 leading-relaxed marker:text-muted ${className}`}>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

function Photos({ images }: { images: Photo[] }) {
  const single = images.length === 1;
  return (
    <div className={`mt-6 grid gap-3 ${single ? "max-w-md" : "sm:grid-cols-2"}`}>
      {images.map((image, i) => (
        <figure key={`${image.src}-${i}`}>
          <Image
            src={image.src}
            alt={image.alt}
            width={640}
            height={480}
            className={`w-full rounded-xl object-cover ${single ? "aspect-video" : "aspect-[4/3]"}`}
          />
          {image.caption && <figcaption className="mt-2 text-sm text-muted">{image.caption}</figcaption>}
        </figure>
      ))}
    </div>
  );
}

function RoleBlock({ role, showInlineStart }: { role: Role; showInlineStart: boolean }) {
  return (
    <div className={`relative pb-7 ${role.title ? "pt-7" : "pt-3"}`}>
      <div className="timeline-reveal">
        {role.title && <h4 className="t-title text-base font-medium text-(--title) sm:text-lg">{role.title}</h4>}
        {showInlineStart && role.start && (
          <p className={`mt-1 ${inlineDate}`}>
            {monthYear(role.start)} – {role.end ? monthYear(role.end) : "Present"}
          </p>
        )}
        {role.summary && <p className="mt-2 text-base leading-relaxed text-foreground/90 sm:text-lg">{role.summary}</p>}
        {role.highlights && (
          <Highlights items={role.highlights} className="mt-3 space-y-1.5 text-base text-foreground/80" />
        )}
        {role.projects && (
          <ul className="mt-7 space-y-8">
            {role.projects.map((project) => (
              <li key={project.name}>
                <h5 className="text-base font-semibold">{project.name}</h5>
                <p className="mt-1 text-base leading-relaxed text-foreground/80">{project.description}</p>
                {project.highlights && (
                  <Highlights items={project.highlights} className="mt-2 space-y-1 text-sm text-foreground/70" />
                )}
                {project.link && (
                  <Link
                    href={checkedLink(project.link.href)}
                    className="mt-2 inline-block text-sm font-medium text-(--link) underline-offset-4 hover:underline"
                  >
                    {project.link.label} →
                  </Link>
                )}
              </li>
            ))}
          </ul>
        )}
        {role.story && (
          <div className="mt-7 space-y-4 text-base leading-relaxed text-foreground/90 sm:text-lg">
            {role.story.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        )}
        {role.images && <Photos images={role.images} />}
      </div>

      {role.start && (
        <>
          <Dot className={`-bottom-[0.34375rem] ${line.roleDot}`} />
          <time dateTime={role.start} className={`-bottom-2.5 ${roleLabel}`}>
            {monthYear(role.start)}
          </time>
        </>
      )}
    </div>
  );
}

function ChapterEntry({ chapter }: { chapter: Chapter }) {
  const latest = chapter.roles[0];
  const earliest = chapter.roles.at(-1)!;
  // An undated chapter, such as home, has no start or end markers and fades out at the bottom.
  const dated = Boolean(earliest.start);
  const current = dated && !latest.end;

  return (
    <li id={chapterAnchor(chapter)} className="relative pl-8">
      <span
        aria-hidden
        className={`timeline-bar absolute top-[0.6875rem] bottom-0 w-[0.1875rem] rounded-full bg-(--mark) ${line.bar} ${
          current ? "" : "opacity-60"
        } ${dated ? "" : "mask-b-from-40%"}`}
      />
      <Dot className={`top-[0.34375rem] ${line.chapterDot}`} live={current} />
      {dated && (
        <time dateTime={latest.end} className={`top-0.5 ${chapterLabel}`}>
          {latest.end ? monthYear(latest.end) : "Present"}
        </time>
      )}

      {earliest.start && (
        <p className={`mb-1 ${inlineDate}`}>
          {monthYear(earliest.start)} – {latest.end ? monthYear(latest.end) : "Present"}
        </p>
      )}
      <h3 className="t-serif text-lg font-semibold sm:text-xl">{chapter.name}</h3>
      <p className="text-sm text-muted">{chapter.location}</p>

      {chapter.roles.map((role, i) => (
        <RoleBlock key={role.start ?? i} role={role} showInlineStart={chapter.roles.length > 1} />
      ))}
    </li>
  );
}

function Connector() {
  return (
    <li aria-hidden className="relative h-10">
      {/* Runs on under the next chapter's dot, whose background ring then leaves the same gap as elsewhere. */}
      <span className={`absolute top-0 -bottom-[0.6875rem] w-px bg-white/15 ${line.thin}`} />
    </li>
  );
}

/** Each chapter is a solid bar from its start (bottom) to its end or "Present" (top), with a dot where each role began. */
export function JourneyTimeline({ chapters }: { chapters: Chapter[] }) {
  return (
    <ol>
      {chapters.flatMap((chapter, i) => {
        const key = `${chapter.name}-${chapter.roles.at(-1)!.start ?? "undated"}`;
        const entry = <ChapterEntry key={key} chapter={chapter} />;
        return i < chapters.length - 1 ? [entry, <Connector key={`after-${key}`} />] : [entry];
      })}
    </ol>
  );
}
