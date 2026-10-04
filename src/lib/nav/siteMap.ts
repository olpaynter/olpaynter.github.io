import { publishedPosts } from "@/data/blog";
import { chapterAnchor, journey } from "@/data/journey";
import { homeSections, routes } from "@/lib/routes";

/**
 * One entry of a nav tree. Where the entry leads depends on the page being viewed, and `build.ts`
 * works it out:
 * - on the tree's root page, an entry with a `section` scrolls to that section;
 * - elsewhere, an entry with a `page` links to it, and an entry with only a `section` links to that
 *   section of the root page;
 * - on the entry's own `page`, the entry is current, and clicking it returns to the top.
 */
export type Entry = {
  /**
   * The entry's identity. Every tree's entries are merged into one side nav, so entries with the
   * same key in two trees are one element: they need the same label, parent and order among their
   * siblings. Lowercase words joined by hyphens.
   */
  key: string;
  label: string;
  /** A section id on the tree's root page. */
  section?: string;
  /** A page address from `routes`. */
  page?: string;
  /** Shown only while the reader is on this page or a page beneath it (rule 3 in the README). */
  unrolls?: boolean;
  children?: Entry[];
};

/** A nav of its own (rule 2 in the README), used by its root page and every page in its entries. */
export type NavTree = { root: string; entries: Entry[] };

/**
 * Pages that unroll beneath an entry generated from content data, such as a journey chapter or a
 * post, by the key of that entry. Pages beneath a hand-written entry go in its `children` instead.
 */
const unrolledPages: Record<string, Entry[]> = {
  "chapter-university-of-bath": [
    { key: "page-dissertation", label: "My dissertation", page: routes.dissertation, unrolls: true },
  ],
};

export const navTrees: NavTree[] = [
  {
    root: routes.home,
    entries: [
      {
        key: "home",
        label: "Home",
        section: homeSections.about,
        page: routes.home,
        children: [{ key: "page-resume", label: "My resume", page: routes.resume, unrolls: true }],
      },
      {
        key: "journey",
        label: "Journey and Experiences",
        section: homeSections.journey,
        children: journey.map((chapter) => ({
          key: `chapter-${chapter.id}`,
          label: chapter.navLabel,
          section: chapterAnchor(chapter),
        })),
      },
      { key: "blog", label: "Blog", section: homeSections.blog },
    ],
  },
  {
    root: routes.blog,
    entries: [
      { key: "home", label: "Home", page: routes.home },
      {
        key: "blog",
        label: "Blog",
        page: routes.blog,
        children: publishedPosts.map((post) => ({
          key: `post-${post.slug}`,
          label: post.navLabel,
          section: post.slug,
          page: routes.post(post.slug),
        })),
      },
    ],
  },
];

/** Every entry of a list and its descendants, in reading order. */
export function walk(entries: Entry[]): Entry[] {
  return entries.flatMap((entry) => [entry, ...walk(entry.children ?? [])]);
}

for (const [parent, pages] of Object.entries(unrolledPages)) {
  const entries = navTrees.flatMap((tree) => walk(tree.entries)).filter((entry) => entry.key === parent);
  if (entries.length === 0) throw new Error(`Site map: unrolledPages lists "${parent}", which is not an entry key`);
  for (const entry of entries) entry.children = [...(entry.children ?? []), ...pages];
}

/** Every page on the site: each tree's root and every page an entry stands for. */
export function knownPaths(): string[] {
  const paths = navTrees.flatMap((tree) => [tree.root, ...walk(tree.entries).flatMap((entry) => entry.page ?? [])]);
  return [...new Set(paths)];
}

/** The section ids a root page renders, or undefined for a page whose sections are not declared. */
export function sectionsOf(path: string): string[] | undefined {
  const tree = navTrees.find((candidate) => candidate.root === path);
  return tree && walk(tree.entries).flatMap((entry) => entry.section ?? []);
}

/** The tree a page's nav is built from: the one it is root of, or else the one listing it. */
export function treeFor(path: string): NavTree {
  const root = navTrees.find((tree) => tree.root === path);
  if (root) return root;
  const listing = navTrees.filter((tree) => walk(tree.entries).some((entry) => entry.page === path));
  if (listing.length === 1) return listing[0];
  throw new Error(
    listing.length === 0
      ? `Site map: ${path} is not in any nav tree in src/lib/nav/siteMap.ts`
      : `Site map: ${path} is listed in ${listing.length} nav trees; a page that is not a root belongs to one`,
  );
}

/** Why an internal link is broken, or undefined if it leads to a page and section that exist. */
export function linkProblem(href: string): string | undefined {
  const url = new URL(href, "https://site.invalid");
  if (url.origin !== "https://site.invalid") return undefined;
  if (!knownPaths().includes(url.pathname)) return `${url.pathname} is not in the site map`;
  const anchor = decodeURIComponent(url.hash.slice(1));
  const sections = sectionsOf(url.pathname);
  if (anchor && sections && !sections.includes(anchor)) return `#${anchor} is not a section of ${url.pathname}`;
}

/**
 * Returns an internal link unchanged, or fails the build if it points at a page that does not exist,
 * or at a section a root page does not declare. Use it for links written into content data.
 */
export function checkedLink(href: string): string {
  const problem = linkProblem(href);
  if (problem) throw new Error(`Link to ${href}: ${problem}`);
  return href;
}
