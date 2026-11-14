import Link from "next/link";
import { HiOutlinePencil } from "react-icons/hi2";
import type { Post } from "@/data/stories";
import { AccentLink } from "@/components/AccentLink";
import { PostTitle } from "@/components/PageTransition";
import { monthYear } from "@/lib/dates";
import { routes } from "@/lib/routes";

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

export function StoriesIntro() {
  return (
    <p className="mb-10 max-w-2xl text-base leading-relaxed text-foreground/80 sm:mb-12 sm:text-lg">
      Longer pieces about things I&apos;ve built, places I&apos;ve been, and what I took away from them. Some are
      write-ups of projects and some are closer to stories.
    </p>
  );
}

/**
 * A plain list of posts, with each date hanging in the left margin from lg up, like the timeline.
 * `anchored` gives each post an id, its slug, so the side nav on the stories index can track and
 * scroll to it.
 */
export function StoryList({
  posts,
  anchored = false,
  Heading = "h3",
}: {
  posts: Post[];
  anchored?: boolean;
  /** The level of each post title, one below the heading the list sits under. */
  Heading?: "h2" | "h3";
}) {
  return (
    <ul className="space-y-10 sm:space-y-12">
      {posts.map((post) => {
        return (
          <li key={post.slug} id={anchored ? post.slug : undefined} className="timeline-reveal relative">
            <time
              dateTime={post.date}
              className="block text-sm text-muted lg:absolute lg:top-1 lg:right-[calc(100%+1.25rem)] lg:whitespace-nowrap"
            >
              {monthYear(post.date)}
            </time>
            <PostTitle slug={post.slug}>
              <Heading className="t-serif w-fit text-lg font-semibold sm:text-xl">
                <Link href={routes.post(post.slug)} className="transition-colors duration-300 hover:text-(--link)">
                  {post.title}
                </Link>
              </Heading>
            </PostTitle>
            <p className="mt-2 text-base leading-relaxed text-foreground/80 sm:text-lg">{post.summary}</p>
            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted">
              <span>{post.tags.join(" · ")}</span>
              <AiLabel madeWithAI={post.madeWithAI} />
            </div>
            <AccentLink href={routes.post(post.slug)} className="mt-4">
              Read the post
            </AccentLink>
          </li>
        );
      })}
    </ul>
  );
}
