import type { Metadata } from "next";
import Link from "next/link";
import { RedirectHome } from "@/components/RedirectHome";

export const metadata: Metadata = { title: "Redirecting | Oliver Paynter-Jones", robots: { index: false } };

/**
 * The export writes this page to 404.html, which GitHub Pages serves for any unknown path. It sends
 * the visitor to the home page: by script straight away, or by a meta refresh if scripts are off.
 */
export default function NotFound() {
  return (
    <main className="relative mx-auto w-full max-w-3xl px-6 py-20 sm:py-28">
      <meta httpEquiv="refresh" content="0; url=/" />
      <RedirectHome />
      <p className="text-lg text-muted">
        That page does not exist.{" "}
        <Link href="/" className="text-(--link) underline-offset-4 hover:underline">
          Go to the home page
        </Link>
        .
      </p>
    </main>
  );
}
