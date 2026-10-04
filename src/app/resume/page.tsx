import type { Metadata } from "next";
import { DocumentPage } from "@/components/DocumentPage";
import { Socials } from "@/components/Socials";
import { routes } from "@/lib/routes";

export const metadata: Metadata = { title: "Resume | Oliver Paynter-Jones" };

export default function ResumePage() {
  return (
    <DocumentPage
      title="Resume"
      intro={<Socials className="mt-5" />}
      file="/resume.pdf"
      downloadName="Oliver Paynter-Jones resume.pdf"
      path={routes.resume}
    />
  );
}
