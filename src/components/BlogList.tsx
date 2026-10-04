import Link from "next/link";
import { HiOutlinePencil } from "react-icons/hi2";
import type { Post } from "@/data/blog";
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

/** Explains the "Made without AI" label. */
export function BlogIntro() {
  return (
    <p className="mb-12 max-w-2xl text-lg leading-relaxed text-foreground/80">
      Posts marked &ldquo;Made without AI&rdquo; were thought through, written and built by me alone. I think the effort
      and thinking behind a piece of work is part of its value, so it is worth saying when it is entirely mine.
    </p>
  );
}

/** A plain list of posts, with each date hanging in the left margin from lg up, like the timeline. */
/**
 * `anchored` gives each post an id, its slug, so the side nav on the blog index can track and
 * scroll to it.
 */
export function BlogList({ posts, anchored = false }: { posts: Post[]; anchored?: boolean }) {
  return (
    <ul className="space-y-12">
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
              <h3 className="t-serif w-fit text-xl font-semibold">
                <Link href={routes.post(post.slug)} className="transition-colors duration-300 hover:text-(--link)">
                  {post.title}
                </Link>
              </h3>
            </PostTitle>
            <p className="mt-2 text-lg leading-relaxed text-foreground/80">{post.summary}</p>
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
