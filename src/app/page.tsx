import { PageTransition } from "@/components/PageTransition";
import Image from "next/image";
import Link from "next/link";
import { HiOutlineMapPin } from "react-icons/hi2";
import { BlogIntro, BlogList } from "@/components/BlogList";
import { JourneyTimeline } from "@/components/JourneyTimeline";
import { SiteNav } from "@/components/SiteNav";
import { Socials } from "@/components/Socials";
import { AccentLink } from "@/components/AccentLink";
import { publishedPosts } from "@/data/blog";
import { journey } from "@/data/journey";
import { homeNav } from "@/lib/homeNav";

const current = journey.find((chapter) => chapter.kind === "work")!;
const currentRole = current.roles[0];

export default function Home() {
  return (
    <PageTransition>
      <div className="relative">
        <SiteNav items={homeNav(true)} />
      <main className="relative mx-auto w-full max-w-3xl px-6 py-20 sm:py-28">
        <section id="about" className="grid grid-cols-1 gap-10 sm:grid-cols-[12rem_1fr] sm:gap-12">
          <div className="flex flex-col items-center sm:items-start">
            <Image
              src="/profile.svg"
              alt="Oliver Paynter-Jones"
              width={240}
              height={240}
              priority
              className="aspect-square w-40 rounded-full object-cover ring-2 ring-white/10 sm:w-48"
            />
            <p className="mt-5 flex items-center gap-2 text-base text-muted">
              <HiOutlineMapPin className="h-5 w-5" aria-hidden />
              Edinburgh, UK
            </p>
            <Socials className="mt-5" />
          </div>

          <div>
            <h1 className="t-serif text-3xl font-bold tracking-tight sm:text-4xl">
              Oliver Paynter-Jones
            </h1>
            <p className="mt-2 text-lg font-medium text-(--role)">
              {currentRole.title} at {current.name}
            </p>
            <div className="mt-6 space-y-4 text-lg leading-relaxed text-foreground/90">
              <p>
                I&rsquo;m a software engineer with a background in Computer Science
                and Mathematics from the University of Bath. I find the
                intersection of abstract logic and working code more interesting
                than either on its own.
              </p>
              <p>
                I care about building systems that are simple to reason about and
                resilient at scale, and I like to understand how a technology
                works by building something with it.
              </p>
            </div>
            <AccentLink href="/resume" className="mt-6">
              View my resume
            </AccentLink>
          </div>
        </section>

        <section id="journey" className="mt-16">
          <h2 className="t-serif mb-10 text-3xl font-bold tracking-tight">
            My Journey and Experiences
          </h2>
          <JourneyTimeline chapters={journey} />
        </section>

        <section id="blog" className="mt-24">
          <h2 className="t-serif mb-6 text-3xl font-bold tracking-tight">
            Blog
          </h2>
          <BlogIntro />
          <BlogList posts={publishedPosts.slice(0, 3)} />
          <Link
            href="/blog"
            className="group mt-10 inline-block text-sm font-medium text-muted transition-colors duration-300 hover:text-foreground"
          >
            All posts
            <span aria-hidden className="ml-2 inline-block transition-transform duration-300 ease-out group-hover:translate-x-1">
              →
            </span>
          </Link>
        </section>
      </main>
      </div>
    </PageTransition>
  );
}
