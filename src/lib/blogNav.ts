import type { NavItem } from "@/components/SiteNav";
import { publishedPosts } from "@/data/blog";

/**
 * Side nav for the blog pages: a way home, then every post, with the current post marked and its
 * sections listed beneath it.
 */
export function blogNav(currentSlug?: string, sections: NavItem[] = []): NavItem[] {
  return [
    { label: "Home", href: "/" },
    {
      label: "Blog",
      href: "/blog",
      current: currentSlug === undefined,
      children: publishedPosts.map((post) => ({
        label: post.navLabel,
        href: `/blog/${post.slug}`,
        current: post.slug === currentSlug,
        children: post.slug === currentSlug && sections.length > 0 ? sections : undefined,
      })),
    },
  ];
}
