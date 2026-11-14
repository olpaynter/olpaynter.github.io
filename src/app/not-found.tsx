import type { Metadata } from "next";
import Link from "next/link";
import { routes } from "@/lib/routes";

export const metadata: Metadata = { title: "Redirecting | Oliver Paynter-Jones", robots: { index: false } };

const redirect = `location.replace(/^\\/blog(\\/|$)/.test(location.pathname) ? location.pathname.replace(/^\\/blog/, ${JSON.stringify(routes.stories)}) + location.hash : "/");`;

/**
 * The export writes this page to 404.html, which GitHub Pages serves for any unknown path. An inline
 * script sends an old /blog address to the same page under /stories and anything else home, before
 * React loads. With scripts off, a meta refresh sends the visitor home.
 */
export default function NotFound() {
  return (
    <main className="relative mx-auto w-full max-w-3xl px-6 py-20 sm:py-28">
      <script dangerouslySetInnerHTML={{ __html: redirect }} />
      <noscript>
        <meta httpEquiv="refresh" content="0; url=/" />
      </noscript>
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
