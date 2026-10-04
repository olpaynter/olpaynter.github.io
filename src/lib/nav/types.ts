/**
 * What an entry does on one page: scroll to a section of that page, or link to a page. `current`
 * marks the entry for the page being viewed.
 */
export type EntryAction =
  { section: string; href?: never; current?: never } | { href: string; section?: never; current?: boolean };

/** An entry of the site-wide side nav, holding every entry any page shows. */
export type NavNode = { key: string; label: string; children: NavNode[] };

/**
 * Everything the side nav in the browser needs, built once at build time. `tree` is the merged nav of every page,
 * and `pages` gives, for each page address, the action of each entry that page shows. An entry not
 * listed for a page is folded away on it.
 */
export type SiteNavigation = { tree: NavNode[]; pages: Record<string, Record<string, EntryAction>> };

/** A section of a page that is not a tree root, such as a heading of a post. Used while building. */
export type PageSection = { key: string; label: string; section: string };

/** One entry of one page's nav, resolved to what it does on that page. Used while building. */
export type PageEntry = { key: string; label: string; children: PageEntry[] } & EntryAction;
