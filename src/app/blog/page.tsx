import { PageTransition } from "@/components/PageTransition";
import type { Metadata } from "next";
import { BackLink } from "@/components/nav/BackLink";
import { BlogIntro, BlogList } from "@/components/BlogList";
import { publishedPosts } from "@/data/blog";
import { routes } from "@/lib/routes";

export const metadata: Metadata = { title: "Blog | Oliver Paynter-Jones" };

export default function BlogIndex() {
  return (
    <PageTransition>
      <main className="relative mx-auto w-full max-w-3xl px-6 py-20 sm:py-28">
        <BackLink path={routes.blog} />
        <h1 className="t-serif mt-8 mb-6 text-3xl font-bold tracking-tight nav:mt-0">Blog</h1>
        <BlogIntro />
        <BlogList posts={publishedPosts} anchored />
      </main>
    </PageTransition>
  );
}
