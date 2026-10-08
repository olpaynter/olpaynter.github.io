import { PageTransition } from "@/components/PageTransition";
import type { Metadata } from "next";
import { BlogIntro, BlogList } from "@/components/BlogList";
import { publishedPosts } from "@/data/blog";

export const metadata: Metadata = { title: "Blog | Oliver Paynter-Jones" };

export default function BlogIndex() {
  return (
    <PageTransition>
      <main className="relative mx-auto w-full max-w-3xl px-6 pt-28 pb-20 sm:py-28">
        <h1 className="t-serif mb-6 text-3xl font-bold tracking-tight">Blog</h1>
        <BlogIntro />
        <BlogList posts={publishedPosts} anchored />
      </main>
    </PageTransition>
  );
}
