import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AiLabel } from "@/components/BlogList";
import { PageTransition, PostTitle } from "@/components/PageTransition";
import { publishedPosts } from "@/data/blog";
import { readPostBody } from "@/lib/posts";
import { routes } from "@/lib/routes";
import { monthYear } from "@/lib/dates";

// Every post is generated at build time; GitHub Pages has no server to render an unknown slug.
export const dynamicParams = false;

export function generateStaticParams() {
  return publishedPosts.map((post) => ({ slug: post.slug }));
}

function findPost(slug: string) {
  return publishedPosts.find((post) => post.slug === slug);
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const post = findPost((await params).slug);
  if (!post) return {};
  return {
    title: `${post.title} | Oliver Paynter-Jones`,
    description: post.summary,
    openGraph: { type: "article", title: post.title, description: post.summary, url: routes.post(post.slug) },
  };
}

export default async function PostPage({ params }: PageProps<"/blog/[slug]">) {
  const post = findPost((await params).slug);
  if (!post) notFound();

  // Post bodies are author-written and trusted, so they are injected without sanitising.
  const body = await readPostBody(post.slug);

  return (
    <PageTransition>
      <main className="relative mx-auto w-full max-w-3xl px-6 pt-28 pb-20 sm:py-28">
        <header className="mb-12">
          <time dateTime={post.date} className="text-sm text-muted">
            {monthYear(post.date)}
          </time>
          <PostTitle slug={post.slug}>
            <h1 className="t-serif mt-2 w-fit text-3xl font-bold tracking-tight sm:text-4xl">
              <Link href={routes.blog} className="transition-colors duration-300 hover:text-(--link)">
                {post.title}
              </Link>
            </h1>
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
