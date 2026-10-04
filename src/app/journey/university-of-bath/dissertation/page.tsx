import type { Metadata } from "next";
import { DocumentPage } from "@/components/DocumentPage";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Dissertation | Oliver Paynter-Jones",
  description: "Behavioural Biometrics in Anti-cheat: Evaluating Angle-Based Mouse Dynamics for Anomaly Detection.",
};

export default function DissertationPage() {
  return (
    <DocumentPage
      title="Dissertation"
      intro={
        <p className="mt-3 max-w-md text-base leading-relaxed text-muted">
          Behavioural Biometrics in Anti-cheat: Evaluating Angle-Based Mouse Dynamics for Anomaly Detection
        </p>
      }
      file="/dissertation.pdf"
      downloadName="Oliver Paynter-Jones dissertation.pdf"
      path={routes.dissertation}
    />
  );
}
