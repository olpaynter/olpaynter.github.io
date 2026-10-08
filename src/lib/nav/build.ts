import { checkPage, checkParents, checkSiteMap } from "@/lib/nav/checks";
import { hashFor } from "@/lib/nav/hash";
import { type Entry, knownPaths, treeFor } from "@/lib/nav/siteMap";
import type { EntryAction, NavNode, PageEntry, PageSection, SiteNavigation } from "@/lib/nav/types";

/**
 * Resolves the site map to the nav of the page at `path`. `sections` are the page's own sections,
 * such as a post's headings, which appear beneath its entry; a root page's sections are declared in
 * its tree.
 */
function resolvePage(path: string, sections: PageSection[] = []): PageEntry[] {
  const tree = treeFor(path);
  const onRoot = path === tree.root;
  if (onRoot && sections.length > 0) {
    throw new Error(`Side nav on ${path}: a root page declares its sections in its tree in siteMap.ts`);
  }
  const leadsHere = (entry: Entry): boolean => entry.page === path || (entry.children ?? []).some(leadsHere);

  const resolve = (entry: Entry): PageEntry[] => {
    if (entry.unrolls && !leadsHere(entry)) return [];
    const isCurrent = entry.page === path;
    const children = [
      ...(entry.children ?? []).flatMap(resolve),
      ...(isCurrent ? sections.map((section) => ({ ...section, children: [] })) : []),
    ];
    const base = { key: entry.key, label: entry.label, children };
    if (onRoot && entry.section) return [{ ...base, section: entry.section }];
    if (entry.page) return [{ ...base, href: entry.page, current: isCurrent || undefined }];
    if (entry.section) return [{ ...base, href: `${tree.root}${hashFor(entry.section)}` }];
    throw new Error(`Site map: "${entry.key}" needs a section or a page`);
  };

  return tree.entries.flatMap(resolve);
}

/**
 * The link one step up the nav from the page at `path`: the entry above the current one, or Home
 * for a page at the top of its tree. Undefined on a page with nowhere to go back to.
 */
export function backLinkFor(path: string): { href: string; label: string } | undefined {
  const entries = resolvePage(path);
  const trail = (list: PageEntry[]): PageEntry[] | undefined => {
    for (const entry of list) {
      if (entry.current) return [entry];
      const below = trail(entry.children);
      if (below) return [entry, ...below];
    }
  };
  const found = trail(entries);
  if (!found) return undefined;
  const parent = found.length > 1 ? found.at(-2)! : found[0] === entries[0] ? undefined : entries[0];
  return parent && { href: parent.href ?? hashFor(parent.section), label: parent.label };
}

/**
 * Merges one page's nav into the site-wide nav. An entry shared by two pages is one element of the
 * side nav, so it must have the same label and the same order among its siblings on both.
 */
function mergeInto(merged: NavNode[], entries: PageEntry[], path: string) {
  let previous = -1;
  for (const entry of entries) {
    let index = merged.findIndex((node) => node.key === entry.key);
    if (index === -1) {
      index = previous + 1;
      merged.splice(index, 0, { key: entry.key, label: entry.label, children: [] });
    } else if (index < previous) {
      throw new Error(`Side nav on ${path}: "${entry.key}" is in a different order among its siblings than elsewhere`);
    } else if (merged[index].label !== entry.label) {
      throw new Error(
        `Side nav on ${path}: "${entry.key}" is "${entry.label}" here but "${merged[index].label}" elsewhere`,
      );
    }
    mergeInto(merged[index].children, entry.children, path);
    previous = index;
  }
}

function actionsOf(entries: PageEntry[]): Record<string, EntryAction> {
  return Object.fromEntries(
    entries.flatMap((entry) => [
      [
        entry.key,
        entry.section === undefined ? { href: entry.href, current: entry.current } : { section: entry.section },
      ],
      ...Object.entries(actionsOf(entry.children)),
    ]),
  );
}

/**
 * Builds the nav of every page and merges them into the one side nav the site renders. Fails the
 * build if the site map or any page's nav breaks a rule in "What the build checks" in docs/development.md.
 * `sections` gives the sections of pages that are not tree roots, by page address.
 */
export function siteNavigation(sections: Record<string, PageSection[]>): SiteNavigation {
  checkSiteMap();
  for (const path of Object.keys(sections)) {
    if (!knownPaths.includes(path)) throw new Error(`Side nav: sections are given for ${path}, which is not a page`);
  }
  const navs = knownPaths.map((path) => [path, resolvePage(path, sections[path])] as const);
  const merged: NavNode[] = [];
  for (const [path, entries] of navs) {
    checkPage(path, entries);
    mergeInto(merged, entries, path);
  }
  checkParents(merged);
  return { tree: merged, pages: Object.fromEntries(navs.map(([path, entries]) => [path, actionsOf(entries)])) };
}
