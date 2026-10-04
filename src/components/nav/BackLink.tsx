import Link from "next/link";
import { backLinkFor } from "@/lib/nav/build";

/**
 * The link one step up the side nav from the page at `path`, shown instead of the side nav on
 * screens too narrow for it. Renders nothing on a page with nowhere to go back to.
 */
export function BackLink({ path }: { path: string }) {
  const back = backLinkFor(path);
  if (!back) return null;
  return (
    <Link
      href={back.href}
      className="text-sm text-muted transition-colors duration-300 hover:text-foreground nav:hidden"
    >
      ← {back.label}
    </Link>
  );
}
