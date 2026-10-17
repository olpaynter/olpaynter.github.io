import { readFile } from "node:fs/promises";
import path from "node:path";
import { publishedPosts } from "@/data/blog";
import type { PageSection } from "@/lib/nav/types";
import { routes } from "@/lib/routes";

const ENTITIES: Record<string, string> = { "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"', "&#39;": "'" };

export async function readPostBody(slug: string): Promise<string> {
  return withAspectRatios(await readFile(path.join(process.cwd(), "src/content/posts", `${slug}.html`), "utf8"));
}

/**
 * Gives each image and video an aspect-ratio from its width and height attributes, so its box has its
 * final size before the file loads. Firefox on Android sized a lazy image on the first screen
 * differently until it loaded, which pushed the text below it down as the page appeared.
 */
function withAspectRatios(html: string): string {
  return html.replace(/<(img|video)\b[^>]*>/g, (tag) => {
    const width = /\swidth="(\d+)"/.exec(tag)?.[1];
    const height = /\sheight="(\d+)"/.exec(tag)?.[1];
    if (!width || !height) return tag;
    const ratio = `aspect-ratio: ${width} / ${height};`;
    return /\sstyle="/.test(tag)
      ? tag.replace(/\sstyle="/, ` style="${ratio} `)
      : tag.replace(/^<(img|video)/, `<$1 style="${ratio}"`);
  });
}

/**
 * The side nav entries for a post's sections. Post bodies mark each section as
 * <div class="section" id="..."> followed by its <h2>; see docs/development.md. A section with no heading, such
 * as an introduction, is left out of the nav. Fails the build for a headed section the nav would
 * otherwise drop or mislabel.
 */
export function postSections(slug: string, body: string): PageSection[] {
  const fail = (problem: string): never => {
    throw new Error(`Post ${slug}: ${problem}`);
  };
  const headed = body.match(/<div\b[^>]*\bclass="[^"]*\bsection\b[^"]*"[^>]*>\s*<h2\b/g)?.length ?? 0;
  const sections = [...body.matchAll(/<div class="section" id="([^"]+)">\s*<h2>\s*([^<]+?)\s*<\/h2>/g)].map(
    ([, id, heading]) => {
      if (!/^[A-Za-z0-9_-]+$/.test(id)) fail(`section id "${id}" must be letters, digits, hyphens and underscores`);
      const label = heading.replace(/&(amp|lt|gt|quot|#39);/g, (entity) => ENTITIES[entity]);
      if (/&[#a-z0-9]+;/i.test(label)) fail(`the heading "${heading}" uses an entity; write the character itself`);
      return {
        section: id,
        label,
        key: `section-${slug}-${id.toLowerCase().replace(/[_-]+/g, "-").replace(/^-|-$/g, "")}`,
      };
    },
  );
  if (sections.length !== headed) {
    fail(
      `${headed - sections.length} section heading(s) are not written as <div class="section" id="..."><h2>Plain text</h2>`,
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
