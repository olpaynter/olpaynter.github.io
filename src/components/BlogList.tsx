import Link from "next/link";
import type { CSSProperties } from "react";
import { HiOutlinePencil } from "react-icons/hi2";
import type { Post } from "@/data/blog";
import { GradientLink } from "@/components/GradientLink";
import { PostTitle } from "@/components/PageTransition";
import { monthYear } from "@/lib/dates";

// Posts cycle through the same close colour pairs as the timeline.
const HUES: [string, string][] = [
  ["#8b7cf8", "#d08bfa"],
  ["#4f8fff", "#8f9cff"],
  ["#2dd4bf", "#86efac"],
];

/** Marks work made without AI. Work made with AI carries no label. */
export function AiLabel({ madeWithAI }: { madeWithAI: boolean }) {
  if (madeWithAI) return null;
  return (
    <span className="inline-flex items-center gap-1.5">
      <HiOutlinePencil aria-hidden className="h-3.5 w-3.5" />
      Made without AI
    </span>
  );
}

/** Explains the "Made without AI" label. */
export function BlogIntro() {
  return (
    <p className="mb-12 max-w-2xl text-lg leading-relaxed text-foreground/80">
      Posts marked &ldquo;Made without AI&rdquo; were thought through, written and built by me alone. I
      think the effort and thinking behind a piece of work is part of its value, so it is worth saying
      when it is entirely mine.
    </p>
  );
}

/** A plain list of posts, with each date hanging in the left margin from lg up, like the timeline. */
export function BlogList({ posts }: { posts: Post[] }) {
  return (
    <ul className="space-y-12">
      {posts.map((post, i) => {
        const [from, to] = HUES[i % HUES.length];
        return (
          <li
            key={post.slug}
            className="timeline-reveal relative"
            style={{ "--hue-from": from, "--hue-to": to } as CSSProperties}
          >
            <time
              dateTime={post.date}
              className="block text-sm text-muted lg:absolute lg:top-1 lg:right-[calc(100%+1.25rem)] lg:whitespace-nowrap"
            >
              {monthYear(post.date)}
            </time>
            <PostTitle slug={post.slug}>
              <h3 className="w-fit text-xl font-semibold">
                <Link href={`/blog/${post.slug}`} className="transition-colors duration-300 hover:text-(--hue-to)">
                  {post.title}
                </Link>
              </h3>
            </PostTitle>
            <p className="mt-2 text-lg leading-relaxed text-foreground/80">{post.summary}</p>
            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted">
              <span>{post.tags.join(" · ")}</span>
              <AiLabel madeWithAI={post.madeWithAI} />
            </div>
            <GradientLink href={`/blog/${post.slug}`} from={from} to={to} className="mt-4">
              Read the post
            </GradientLink>
          </li>
        );
      })}
    </ul>
  );
}
