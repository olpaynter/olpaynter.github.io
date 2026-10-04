import { readFile } from "node:fs/promises";
import path from "node:path";
import { publishedPosts } from "@/data/blog";
import type { PageSection } from "@/lib/nav/types";
import { routes } from "@/lib/routes";

const ENTITIES: Record<string, string> = { "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"', "&#39;": "'" };

export function readPostBody(slug: string): Promise<string> {
  return readFile(path.join(process.cwd(), "src/content/posts", `${slug}.html`), "utf8");
}

/**
 * The side nav entries for a post's sections. Post bodies mark each section as
 * <div class="section" id="..."> followed by its <h2>; see README. A section with no heading, such
 * as an introduction, is left out of the nav.
 */
export function postSections(slug: string, body: string): PageSection[] {
  const headed = body.match(/class="section"[^>]*>\s*<h2/g)?.length ?? 0;
  const sections = [...body.matchAll(/<div class="section" id="([^"]+)">\s*<h2>\s*([^<]+?)\s*<\/h2>/g)].map(
    ([, id, label]) => ({
      section: id,
      label: label.replace(/&(amp|lt|gt|quot|#39);/g, (entity) => ENTITIES[entity]),
      key: `section-${slug}-${id.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    }),
  );
  if (sections.length !== headed) {
    throw new Error(
      `Post ${slug}: ${headed - sections.length} section heading(s) do not match <div class="section" id="..."><h2>Plain text</h2>`,
    );
  }
  return sections;
}

/** The sections of every published post, by the post's address, for the side nav. */
export async function postSectionsByPage(): Promise<Record<string, PageSection[]>> {
  const entries = await Promise.all(
    publishedPosts.map(async (post) => [
      routes.post(post.slug),
      postSections(post.slug, await readPostBody(post.slug)),
    ]),
  );
  return Object.fromEntries(entries);
}
