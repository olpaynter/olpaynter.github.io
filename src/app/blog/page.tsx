import { PageTransition } from "@/components/PageTransition";
import type { Metadata } from "next";
import { BackLink, SiteNav } from "@/components/SiteNav";
import { BlogIntro, BlogList } from "@/components/BlogList";
import { publishedPosts } from "@/data/blog";
import { blogNav } from "@/lib/blogNav";

export const metadata: Metadata = { title: "Blog | Oliver Paynter-Jones" };

export default function BlogIndex() {
  return (
    <PageTransition>
      <main className="relative mx-auto w-full max-w-3xl px-6 py-20 sm:py-28">
        <SiteNav items={blogNav()} />
        <BackLink href="/" label="Home" />
        <h1 className="t-serif mt-8 mb-6 text-3xl font-bold tracking-tight nav:mt-0">Blog</h1>
        <BlogIntro />
        <BlogList posts={publishedPosts} />
      </main>
    </PageTransition>
  );
}
