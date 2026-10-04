import type { Metadata } from "next";
import { HiOutlineArrowDownTray } from "react-icons/hi2";
import { PageTransition } from "@/components/PageTransition";
import { BackLink, SiteNav } from "@/components/SiteNav";
import { Socials } from "@/components/Socials";
import { homeNav } from "@/lib/homeNav";

export const metadata: Metadata = { title: "Resume | Oliver Paynter-Jones" };

const RESUME = "/resume.pdf";


export default function ResumePage() {
  return (
    <PageTransition>
      <main className="relative mx-auto w-full max-w-3xl px-6 py-20 sm:py-28">
        <SiteNav items={homeNav(false, { onResumePage: true })} />
        <BackLink href="/" label="Home" />
        <header className="mt-8 mb-8 flex flex-wrap items-end justify-between gap-6 min-[1360px]:mt-0">
          <div>
            <h1 className="t-serif text-3xl font-bold tracking-tight">
              Resume
            </h1>
            <Socials className="mt-5" />
          </div>
          <a
            href={RESUME}
            download="Oliver Paynter-Jones resume.pdf"
            className="group inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-sm font-medium transition-colors duration-300 hover:border-(--link)/60 hover:bg-white/5"
          >
            <HiOutlineArrowDownTray
              aria-hidden
              className="h-4 w-4 transition-transform duration-300 ease-out group-hover:translate-y-0.5"
            />
            Download PDF
          </a>
        </header>
        <iframe
          src={`${RESUME}#toolbar=0&navpanes=0&view=FitH`}
          title="Oliver Paynter-Jones resume"
          className="aspect-[1/1.414] w-full rounded-xl border border-white/10 bg-white"
        />
        <p className="mt-4 text-sm text-muted">
          If the preview does not load,{" "}
          <a href={RESUME} className="text-(--link) underline-offset-4 hover:underline">
            open the PDF directly
          </a>
          .
        </p>
      </main>
    </PageTransition>
  );
}
