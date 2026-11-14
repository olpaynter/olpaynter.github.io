import { PageTransition } from "@/components/PageTransition";
import type { Metadata } from "next";
import { StoriesIntro, StoryList } from "@/components/StoryList";
import { publishedPosts } from "@/data/stories";

export const metadata: Metadata = { title: "Stories | Oliver Paynter-Jones" };

export default function StoriesIndex() {
  return (
    <PageTransition>
      <main className="relative mx-auto w-full max-w-3xl px-6 pt-28 pb-20 sm:py-28">
        <h1 className="t-serif mb-6 text-3xl font-bold tracking-tight">Stories</h1>
        <StoriesIntro />
        <StoryList posts={publishedPosts} anchored Heading="h2" />
      </main>
    </PageTransition>
  );
}
