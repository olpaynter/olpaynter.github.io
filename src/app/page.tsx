import { PageTransition } from "@/components/PageTransition";
import Image from "next/image";
import Link from "next/link";
import { HiOutlineMapPin } from "react-icons/hi2";
import { BlogIntro, BlogList } from "@/components/BlogList";
import { JourneyTimeline } from "@/components/JourneyTimeline";
import { Socials } from "@/components/Socials";
import { AccentLink } from "@/components/AccentLink";
import { Quote } from "@/components/Quote";
import { publishedPosts } from "@/data/blog";
import { journey } from "@/data/journey";
import { reminders } from "@/data/reminders";
import { homeSections, routes } from "@/lib/routes";
import { FALLBACK_IMAGE } from "@/lib/site";

const current = journey.find((chapter) => chapter.kind === "work")!;
const currentRole = current.roles[0];

function Location({ className = "" }: { className?: string }) {
  return (
    <p className={`flex items-center gap-2 text-muted ${className}`}>
      <HiOutlineMapPin className="h-[1.25em] w-[1.25em]" aria-hidden />
      Edinburgh, UK
    </p>
  );
}

export default function Home() {
  return (
    <PageTransition>
      <main className="relative mx-auto w-full max-w-3xl px-6 pt-20 pb-16 sm:py-28">
        <section id={homeSections.about}>
          {/* From sm the photo column spans both rows, so the introduction sits directly under the name. */}
          <div className="grid grid-cols-[6rem_1fr] items-center gap-x-5 gap-y-8 sm:grid-cols-[12rem_1fr] sm:items-start sm:gap-x-12 sm:gap-y-6">
            <div className="sm:row-span-2">
              <Image
                src={FALLBACK_IMAGE}
                alt="Oliver Paynter-Jones"
                width={240}
                height={240}
                preload
                className="aspect-square w-24 rounded-full object-cover ring-2 ring-white/10 sm:w-48"
              />
              <div className="hidden sm:block">
                <Location className="mt-5" />
                <Socials className="mt-5" />
              </div>
            </div>

            <div>
              <h1 className="t-serif text-xl font-bold tracking-tight sm:text-3xl">Oliver Paynter-Jones</h1>
              <p className="mt-1 text-base font-medium text-(--role) sm:mt-2 sm:text-lg">
                {currentRole.title} at {current.name}
              </p>
              <Location className="mt-1 text-sm sm:hidden" />
            </div>

            <div className="col-span-2 sm:col-span-1 sm:col-start-2">
              <div className="space-y-4 text-base leading-relaxed text-foreground/90 sm:text-lg">
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                  dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                  aliquip ex ea commodo consequat.
                </p>
                <p>
                  Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                  Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim.
                </p>
              </div>
              <div className="mt-6 flex items-center justify-between sm:block">
                <AccentLink href={routes.resume}>View my resume</AccentLink>
                <Socials className="sm:hidden" />
              </div>
            </div>
          </div>

          <ul className="mt-12 space-y-12 sm:mt-14">
            {reminders.map((reminder, i) => (
              <li key={i}>
                <Quote reminder={reminder} />
              </li>
            ))}
          </ul>
        </section>

        <section id={homeSections.journey} className="mt-20 sm:mt-16">
          <h2 className="t-serif mb-8 text-2xl font-bold tracking-tight sm:mb-10 sm:text-3xl">
            My Journey and Experiences
          </h2>
          <JourneyTimeline chapters={journey} />
        </section>

        <section id={homeSections.blog} className="mt-20 sm:mt-24">
          <h2 className="t-serif mb-6 text-2xl font-bold tracking-tight sm:text-3xl">Blog</h2>
          <BlogIntro />
          <BlogList posts={publishedPosts.slice(0, 3)} />
          <Link
            href={routes.blog}
            className="group mt-10 inline-block text-sm font-medium text-muted transition-colors duration-300 hover:text-foreground"
          >
            All posts
            <span
              aria-hidden
              className="ml-2 inline-block transition-transform duration-300 ease-out group-hover:translate-x-1 motion-reduce:transform-none"
            >
              →
            </span>
          </Link>
        </section>
      </main>
    </PageTransition>
  );
}
