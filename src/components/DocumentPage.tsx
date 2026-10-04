import type { ReactNode } from "react";
import { HiOutlineArrowDownTray } from "react-icons/hi2";
import { PageTransition } from "@/components/PageTransition";
import { BackLink } from "@/components/nav/BackLink";

/** A page that shows a PDF with a download button, used by the resume and the dissertation. */
export function DocumentPage({
  title,
  intro,
  file,
  downloadName,
  path,
}: {
  title: string;
  /** Shown under the title, such as socials or a subtitle. */
  intro?: ReactNode;
  /** Path of the PDF under public/. */
  file: string;
  downloadName: string;
  /** The page's address in `routes`, which places it in the side nav. */
  path: string;
}) {
  return (
    <PageTransition>
      <main className="relative mx-auto w-full max-w-3xl px-6 py-20 sm:py-28">
        <BackLink path={path} />
        <header className="mt-8 mb-8 flex flex-wrap items-end justify-between gap-6 nav:mt-0">
          <div>
            <h1 className="t-serif text-3xl font-bold tracking-tight">{title}</h1>
            {intro}
          </div>
          <a
            href={file}
            download={downloadName}
            className="group inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-sm font-medium transition-colors duration-300 hover:border-(--link)/60 hover:bg-white/5"
          >
            <HiOutlineArrowDownTray
              aria-hidden
              className="h-4 w-4 transition-transform duration-300 ease-out group-hover:translate-y-0.5 motion-reduce:transform-none"
            />
            Download PDF
          </a>
        </header>
        <iframe
          src={`${file}#toolbar=0&navpanes=0&view=FitH`}
          title={title}
          className="aspect-[1/1.414] w-full rounded-xl border border-white/10 bg-white"
        />
        <p className="mt-4 text-sm text-muted">
          If the preview does not load,{" "}
          <a href={file} className="text-(--link) underline-offset-4 hover:underline">
            open the PDF directly
          </a>
          .
        </p>
      </main>
    </PageTransition>
  );
}
