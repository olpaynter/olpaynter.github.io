import Link from "next/link";
import type { ReactNode } from "react";

/** Text in the accent colour with a short underline that draws out to full width on hover. */
export function AccentLink({
  href,
  children,
  className = "",
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link href={href} className={`group inline-flex flex-col text-sm font-medium text-(--link) ${className}`}>
      {children}
      <span
        aria-hidden
        className="mt-1 h-px origin-left scale-x-[0.35] bg-(--link) transition-transform duration-500 ease-out group-hover:scale-x-100 motion-reduce:transition-none"
      />
    </Link>
  );
}
