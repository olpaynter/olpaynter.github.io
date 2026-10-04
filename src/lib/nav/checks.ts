import { existsSync, readdirSync } from "node:fs";
import path from "node:path";
import { knownPaths, linkProblem, navTrees, walk } from "@/lib/nav/siteMap";
import type { PageEntry } from "@/lib/nav/types";

const KEY_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;

const PAGE_FILES = ["page.tsx", "page.ts", "page.jsx", "page.js", "page.mdx"];

/**
 * Whether a folder under `src/app` has a page for the remaining address segments, matching dynamic
 * segments such as `[slug]` and `[...rest]`, and looking inside route groups such as `(docs)`.
 */
function hasPageFile(segments: string[], dir = path.join(process.cwd(), "src/app")): boolean {
  const folders = readdirSync(dir, { withFileTypes: true }).filter((entry) => entry.isDirectory());
  const inGroups = folders
    .filter((folder) => /^\(.+\)$/.test(folder.name))
    .some((group) => hasPageFile(segments, path.join(dir, group.name)));
  if (inGroups) return true;
  if (segments.length === 0) return PAGE_FILES.some((file) => existsSync(path.join(dir, file)));
  const [segment, ...rest] = segments;
  return folders.some((folder) => {
    const next = path.join(dir, folder.name);
    if (folder.name === segment || /^\[[^.\]]+\]$/.test(folder.name)) return hasPageFile(rest, next);
    if (/^\[{1,2}\.\.\.[^\]]+\]{1,2}$/.test(folder.name)) return hasPageFile([], next);
    return false;
  });
}

/** Checks that every tree leads back to its own root and that every page has a page file. */
export function checkSiteMap() {
  for (const tree of navTrees) {
    if (!walk(tree.entries).some((entry) => entry.page === tree.root)) {
      throw new Error(`Site map: the tree for ${tree.root} needs an entry for ${tree.root} itself`);
    }
  }
  for (const page of knownPaths()) {
    if (/[#?]/.test(page)) {
      throw new Error(`Site map: "${page}" is not a page address; link to a section with \`section\` instead`);
    }
    if (!hasPageFile(page.split("/").filter(Boolean))) {
      throw new Error(`Site map: ${page} has no page file under src/app`);
    }
  }
}

/** Checks one page's nav against the rules in "What the build checks" in the README. */
export function checkPage(page: string, entries: PageEntry[]) {
  const fail = (problem: string): never => {
    throw new Error(`Side nav on ${page}: ${problem}`);
  };
  const all = (list: PageEntry[]): PageEntry[] => list.flatMap((entry) => [entry, ...all(entry.children)]);

  if (entries[0]?.key !== "home") fail(`the first entry must be Home (key "home"), not "${entries[0]?.key}"`);

  const keys = new Set<string>();
  const sections = new Set<string>();
  for (const entry of all(entries)) {
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

  const current = all(entries).filter((entry) => entry.current);
  if (current.length > 1) fail(`more than one entry is current: ${current.map((entry) => entry.key).join(", ")}`);
}
