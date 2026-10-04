import Link from "next/link";
import type { ReactNode } from "react";

/** Text in a two-colour gradient with a short underline that draws out to full width on hover. */
export function GradientLink({
  href,
  from,
  to,
  children,
  className = "",
}: {
  href: string;
  from: string;
  to: string;
  children: ReactNode;
  className?: string;
}) {
  const gradient = { backgroundImage: `linear-gradient(to right, ${from}, ${to})` };
  return (
    <Link href={href} className={`group inline-flex flex-col text-sm font-medium ${className}`}>
      <span style={gradient} className="bg-clip-text text-transparent">
        {children}
      </span>
      <span
        aria-hidden
        style={gradient}
        className="mt-1 h-px origin-left scale-x-[0.35] transition-transform duration-500 ease-out group-hover:scale-x-100 motion-reduce:transition-none"
      />
    </Link>
  );
}
