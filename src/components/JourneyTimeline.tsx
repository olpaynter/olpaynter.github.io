import Image from "next/image";
import type { CSSProperties } from "react";
import type { Chapter, ChapterKind, Photo, Role } from "@/data/journey";
import { monthYear } from "@/lib/dates";

// The line's centre is 0.5rem + 0.5px from the chapter's left edge below sm, and 0.5px from sm up.
// Chapter content is indented 2rem. Dots are 11px, so their left edge sits 5.5px left of the centre.
const line = {
  bar: "left-[calc(0.5rem-1px)] sm:-left-px",
  thin: "left-2 sm:left-0",
  chapterDot: "left-[calc(0.5rem-5px)] sm:-left-[5px]",
  roleDot: "-left-[calc(1.5rem+5px)] sm:-left-[calc(2rem+5px)]",
};

type Hue = [string, string];

// Jobs alternate between two blues so neighbouring jobs differ; other kinds get their own colour.
const WORK_HUES: Hue[] = [
  ["#4f8fff", "#8f9cff"],
  ["#38bdf8", "#5f9bff"],
];
const KIND_HUES: Record<Exclude<ChapterKind, "work">, Hue> = {
  education: ["#8b7cf8", "#d08bfa"],
  travel: ["#2dd4bf", "#86efac"],
  home: ["#7dd3fc", "#a5b4fc"],
};

// Margin labels only exist from lg up; narrower screens have no margin, so the dates go inline.
const chapterLabel =
  "hidden lg:block absolute right-[calc(100%+1.25rem)] whitespace-nowrap text-sm text-muted";
const roleLabel =
  "hidden lg:block absolute right-[calc(100%+3.25rem)] whitespace-nowrap text-sm text-muted";

function Dot({ className, live }: { className: string; live?: boolean }) {
  return (
    <span
      aria-hidden
      className={`timeline-dot absolute z-10 h-[11px] w-[11px] ${className}`}
    >
      {live && (
        <span className="absolute inset-0 rounded-full bg-(--hue-from)/70 motion-safe:animate-ping" />
      )}
      <span className="absolute inset-0 rounded-full bg-(--hue-from) ring-4 ring-background" />
    </span>
  );
}

function Highlights({
  items,
  className,
}: {
  items: string[];
  className: string;
}) {
  return (
    <ul
      className={`list-disc pl-5 leading-relaxed marker:text-muted ${className}`}
    >
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
        <Image
          key={`${image.src}-${i}`}
          src={image.src}
          alt={image.alt}
          width={640}
          height={480}
          className={`w-full rounded-xl object-cover ${single ? "aspect-video" : "aspect-[4/3]"}`}
        />
      ))}
    </div>
  );
}

function RoleBlock({
  role,
  showInlineStart,
}: {
  role: Role;
  showInlineStart: boolean;
}) {
  return (
    <div className={`relative pb-7 ${role.title ? "pt-7" : "pt-3"}`}>
      <div className="timeline-reveal">
        {role.title && (
          <h4 className="w-fit bg-linear-to-r from-(--hue-from) to-(--hue-to) bg-clip-text text-lg font-medium text-transparent">
            {role.title}
          </h4>
        )}
        {showInlineStart && role.start && (
          <p className="text-sm text-muted lg:hidden">
            From {monthYear(role.start)}
          </p>
        )}
        {role.summary && (
          <p className="mt-2 text-lg leading-relaxed text-foreground/90">
            {role.summary}
          </p>
        )}
        {role.highlights && (
          <Highlights
            items={role.highlights}
            className="mt-3 space-y-1.5 text-base text-foreground/80"
          />
        )}
        {role.projects && (
          <ul className="mt-7 space-y-8">
            {role.projects.map((project) => (
              <li key={project.name}>
                <h5 className="text-base font-semibold">{project.name}</h5>
                <p className="mt-1 text-base leading-relaxed text-foreground/80">
                  {project.description}
                </p>
                {project.highlights && (
                  <Highlights
                    items={project.highlights}
                    className="mt-2 space-y-1 text-sm text-foreground/70"
                  />
                )}
                {project.link && (
                  <a
                    href={project.link.href}
                    className="mt-2 inline-block text-sm font-medium text-(--hue-to) underline-offset-4 hover:underline"
                  >
                    {project.link.label} →
                  </a>
                )}
              </li>
            ))}
          </ul>
        )}
        {role.story && (
          <div className="mt-7 space-y-4 text-lg leading-relaxed text-foreground/90">
            {role.story.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        )}
        {role.images && <Photos images={role.images} />}
      </div>

      {role.start && (
        <>
          <Dot className={`-bottom-[5.5px] ${line.roleDot}`} />
          <time dateTime={role.start} className={`-bottom-2.5 ${roleLabel}`}>
            {monthYear(role.start)}
          </time>
        </>
      )}
    </div>
  );
}

function ChapterEntry({ chapter, hue }: { chapter: Chapter; hue: Hue }) {
  const latest = chapter.roles[0];
  const earliest = chapter.roles.at(-1)!;
  // An undated chapter, such as home, has no start or end markers and fades out at the bottom.
  const dated = Boolean(earliest.start);
  const current = dated && !latest.end;

  return (
    <li
      id={chapter.id}
      className="relative pl-8"
      style={{ "--hue-from": hue[0], "--hue-to": hue[1] } as CSSProperties}
    >
      <span
        aria-hidden
        className={`timeline-bar absolute top-[11px] bottom-0 w-[3px] overflow-hidden rounded-full ${line.bar} ${
          current ? "" : "opacity-60"
        } ${dated ? "" : "mask-b-from-40%"}`}
      >
        <span className="timeline-shimmer absolute inset-0 bg-linear-to-b from-(--hue-from) via-(--hue-to) to-(--hue-from)" />
      </span>
      <Dot className={`top-[5.5px] ${line.chapterDot}`} live={current} />
      {dated && (
        <time dateTime={latest.end} className={`top-0.5 ${chapterLabel}`}>
          {latest.end ? monthYear(latest.end) : "Present"}
        </time>
      )}

      <h3 className="text-xl font-semibold">{chapter.name}</h3>
      <p className="text-sm text-muted">
        {chapter.location}
        {earliest.start && (
          <span className="lg:hidden">
            {" · "}
            {monthYear(earliest.start)} –{" "}
            {latest.end ? monthYear(latest.end) : "Present"}
          </span>
        )}
      </p>

      {chapter.roles.map((role, i) => (
        <RoleBlock
          key={role.start ?? i}
          role={role}
          showInlineStart={chapter.roles.length > 1}
        />
      ))}
    </li>
  );
}

function Connector() {
  return (
    <li aria-hidden className="relative h-10">
      {/* Runs on under the next chapter's dot, whose background ring then leaves the same gap as elsewhere. */}
      <span className={`absolute top-0 -bottom-[11px] w-px bg-white/15 ${line.thin}`} />
    </li>
  );
}

function huesFor(chapters: Chapter[]): Hue[] {
  let work = 0;
  return chapters.map((chapter) =>
    chapter.kind === "work" ? WORK_HUES[work++ % WORK_HUES.length] : KIND_HUES[chapter.kind],
  );
}

/** Each chapter is a solid bar from its start (bottom) to its end or "Present" (top), with a dot where each role began. */
export function JourneyTimeline({ chapters }: { chapters: Chapter[] }) {
  const hues = huesFor(chapters);
  return (
    <ol>
      {chapters.flatMap((chapter, i) => {
        const key = `${chapter.name}-${chapter.roles.at(-1)!.start ?? "undated"}`;
        const entry = <ChapterEntry key={key} chapter={chapter} hue={hues[i]} />;
        return i < chapters.length - 1 ? [entry, <Connector key={`after-${key}`} />] : [entry];
      })}
    </ol>
  );
}
