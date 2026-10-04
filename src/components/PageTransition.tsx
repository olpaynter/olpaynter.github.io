import { type ReactNode, ViewTransition } from "react";

/**
 * Fades the outgoing page up and away and lets the incoming one settle in from just below. It sits
 * in each page rather than the layout, because layouts persist across navigations and never enter
 * or exit.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <ViewTransition enter="page-in" exit="page-out" default="none">
      {children}
    </ViewTransition>
  );
}

/** Gives a post title the same identity in the list and on the post, so it glides between them. */
export function PostTitle({ slug, children }: { slug: string; children: ReactNode }) {
  return (
    <ViewTransition name={`post-title-${slug}`} share="morph" default="none">
      {children}
    </ViewTransition>
  );
}
