import { walk } from "@/lib/nav/tree";
import type { EntryAction, NavNode } from "@/lib/nav/types";

/** One entry of the side nav as drawn on the current page, with the entries beneath it. */
export type NavRowView = {
  key: string;
  label: string;
  depth: number;
  /** Whether the page shows this entry. One it does not show is folded away. */
  present: boolean;
  /** Whether the entries beneath this one are unrolled. */
  unrolled: boolean;
  highlighted: boolean;
  /** What the entry does on this page, or undefined if the page does not show it. */
  action?: EntryAction;
  children: NavRowView[];
};

/** A section of the current page, and the key of its entry. */
export type SectionEntry = { section: string; key: string };

/** The page's sections in nav order, with the key of the entry for each. */
export function sectionEntries(tree: NavNode[], actions: Record<string, EntryAction>): SectionEntry[] {
  return walk(tree).flatMap((node) => {
    const section = actions[node.key]?.section;
    return section === undefined ? [] : [{ section, key: node.key }];
  });
}

/**
 * The side nav for one page. These rules decide the whole look of the nav, on every page:
 * - Exactly one entry is highlighted: the section in view, or, on a page with no sections, the
 *   entry for the page itself. The entries above it are not.
 * - The highlighted entry and the current page's entry are unrolled, with every entry above them.
 * - An entry the page does not show is folded away.
 */
export function navRows(
  tree: NavNode[],
  actions: Record<string, EntryAction>,
  sections: SectionEntry[],
  activeSection: string | undefined,
): NavRowView[] {
  const current = Object.keys(actions).find((key) => actions[key].current);
  const highlighted = sections.length > 0 ? sections.find(({ section }) => section === activeSection)?.key : current;

  const parents = new Map<string, string>();
  const index = (nodes: NavNode[], parent?: string) => {
    for (const node of nodes) {
      if (parent) parents.set(node.key, parent);
      index(node.children, node.key);
    }
  };
  index(tree);
  const unrolled = new Set<string>();
  for (let key = highlighted; key; key = parents.get(key)) unrolled.add(key);
  for (let key = current; key; key = parents.get(key)) unrolled.add(key);

  const view = (nodes: NavNode[], depth: number): NavRowView[] =>
    nodes.map((node) => {
      const children = view(node.children, depth + 1);
      return {
        key: node.key,
        label: node.label,
        depth,
        present: actions[node.key] !== undefined,
        unrolled: unrolled.has(node.key) && children.some((child) => child.present),
        highlighted: node.key === highlighted,
        action: actions[node.key],
        children,
      };
    });
  return view(tree, 0);
}
