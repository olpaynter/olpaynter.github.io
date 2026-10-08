import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { knownPaths, linkProblem, navTrees } from "@/lib/nav/siteMap";
import { walk } from "@/lib/nav/tree";
import type { NavNode, PageEntry } from "@/lib/nav/types";

const KEY_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;

const PAGE_FILES = ["page.tsx", "page.ts", "page.jsx", "page.js", "page.mdx"];

const DYNAMIC_SEGMENT = /^\[[^.\]]+\]$/;
const CATCH_ALL = /^\[\.\.\.[^\]]+\]$/;
const OPTIONAL_CATCH_ALL = /^\[\[\.\.\.[^\]]+\]\]$/;

/**
 * Whether a folder under `src/app` has a page for the remaining address segments, matching dynamic
 * segments such as `[slug]`, catch-alls such as `[...rest]` and `[[...rest]]`, and looking inside
 * route groups such as `(docs)`.
 */
function hasPageFile(segments: string[], dir = join(process.cwd(), "src/app")): boolean {
  const folders = readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
  const inside = (name: string, rest: string[]) => hasPageFile(rest, join(dir, name));

  if (folders.some((name) => /^\(.+\)$/.test(name) && inside(name, segments))) return true;
  if (segments.length === 0) {
    return (
      PAGE_FILES.some((file) => existsSync(join(dir, file))) ||
      folders.some((name) => OPTIONAL_CATCH_ALL.test(name) && inside(name, []))
    );
  }
  const [segment, ...rest] = segments;
  return folders.some(
    (name) =>
      ((name === segment || DYNAMIC_SEGMENT.test(name)) && inside(name, rest)) ||
      ((CATCH_ALL.test(name) || OPTIONAL_CATCH_ALL.test(name)) && inside(name, [])),
  );
}

/** Checks that every tree leads back to its own root and that every page address is sound. */
export function checkSiteMap() {
  for (const tree of navTrees) {
    if (!walk(tree.entries).some((entry) => entry.page === tree.root)) {
      throw new Error(`Site map: the tree for ${tree.root} needs an entry for ${tree.root} itself`);
    }
  }
  for (const path of knownPaths) {
    if (!path.startsWith("/") || /[#?]/.test(path) || (path !== "/" && path.endsWith("/"))) {
      throw new Error(
        `Site map: "${path}" is not a page address; write it as /a/b, and link to a section with \`section\``,
      );
    }
    if (!hasPageFile(path.split("/").filter(Boolean))) {
      throw new Error(`Site map: ${path} has no page file under src/app`);
    }
  }
}

/** Checks one page's nav against the rules in "What the build checks" in docs/development.md. */
export function checkPage(path: string, entries: PageEntry[]) {
  const fail = (problem: string): never => {
    throw new Error(`Side nav on ${path}: ${problem}`);
  };

  if (entries[0]?.key !== "home") fail(`the first entry must be Home (key "home"), not "${entries[0]?.key}"`);

  const keys = new Set<string>();
  const sections = new Set<string>();
  const all = walk(entries);
  for (const entry of all) {
    if (!KEY_PATTERN.test(entry.key)) fail(`key "${entry.key}" must be lowercase words joined by hyphens`);
    if (keys.has(entry.key)) fail(`key "${entry.key}" is used twice; keys must be unique`);
    keys.add(entry.key);
    if (entry.section !== undefined) {
      if (sections.has(entry.section)) fail(`section "${entry.section}" has two entries`);
      sections.add(entry.section);
    }
    const problem = entry.href === undefined ? undefined : linkProblem(entry.href);
    if (problem) fail(`"${entry.key}" links to ${entry.href}, but ${problem}`);
  }

  const current = all.filter((entry) => entry.current);
  if (current.length > 1) fail(`more than one entry is current: ${current.map((entry) => entry.key).join(", ")}`);
}

/** Checks that no key appears twice in the merged nav, which happens when its parent differs between pages. */
export function checkParents(merged: NavNode[]) {
  const keys = new Set<string>();
  for (const node of walk(merged)) {
    if (keys.has(node.key)) throw new Error(`Side nav: "${node.key}" is under different parents on different pages`);
    keys.add(node.key);
  }
}
