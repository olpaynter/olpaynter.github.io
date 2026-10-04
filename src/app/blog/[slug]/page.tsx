import { PageTransition, PostTitle } from "@/components/PageTransition";
import { readFile } from "node:fs/promises";
import path from "node:path";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AiLabel } from "@/components/BlogList";
import { BackLink, type NavItem, SiteNav } from "@/components/SiteNav";
import { publishedPosts } from "@/data/blog";
import { blogNav } from "@/lib/blogNav";
import { monthYear } from "@/lib/dates";

// Every post is generated at build time; GitHub Pages has no server to render an unknown slug.
export const dynamicParams = false;

export function generateStaticParams() {
  return publishedPosts.map((post) => ({ slug: post.slug }));
}

// Post bodies mark each section as <div class="section" id="..."> followed by its <h2>.
function sectionsOf(body: string): NavItem[] {
  return [...body.matchAll(/<div class="section" id="([^"]+)">\s*<h2>\s*([^<]+?)\s*<\/h2>/g)].map(([, id, label]) => ({
    id,
    label,
  }));
}

function findPost(slug: string) {
  return publishedPosts.find((post) => post.slug === slug);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const post = findPost((await params).slug);
  return { title: post ? `${post.title} | Oliver Paynter-Jones` : undefined, description: post?.summary };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const post = findPost((await params).slug);
  if (!post) notFound();

  // Post bodies are trusted HTML carried over from the previous version of the site.
  const body = await readFile(path.join(process.cwd(), "src/content/posts", `${post.slug}.html`), "utf8");

  return (
    <PageTransition>
      <main className="relative mx-auto w-full max-w-3xl px-6 py-20 sm:py-28">
        <SiteNav items={blogNav(post.slug, sectionsOf(body))} />
        <BackLink href="/blog" label="All posts" />
        <header className="mt-8 mb-12 min-[1360px]:mt-0">
          <time dateTime={post.date} className="text-sm text-muted">
            {monthYear(post.date)}
          </time>
          <PostTitle slug={post.slug}>
              <h1 className="t-serif mt-2 w-fit text-3xl font-bold tracking-tight sm:text-4xl">{post.title}</h1>
            </PostTitle>
          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted">
            <span>{post.tags.join(" · ")}</span>
            <AiLabel madeWithAI={post.madeWithAI} />
          </div>
        </header>
        <article className="post-body" dangerouslySetInnerHTML={{ __html: body }} />
      </main>
    </PageTransition>
  );
}
