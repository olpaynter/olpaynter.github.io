import { FaGithub, FaLinkedinIn } from "react-icons/fa6";
import { HiOutlineMail } from "react-icons/hi";

const socials = [
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/olpaynter/",
    icon: FaLinkedinIn,
    colour: "bg-[#0a66c2] hover:bg-[#1877d9]",
  },
  {
    label: "GitHub",
    href: "https://github.com/olpaynter",
    icon: FaGithub,
    colour: "bg-[#8957e5] hover:bg-[#9a6cf0]",
  },
  {
    label: "Email",
    href: "mailto:opaynterjones@gmail.com",
    icon: HiOutlineMail,
    colour: "bg-[#e5534b] hover:bg-[#f06a62]",
  },
];

export function Socials({ className = "" }: { className?: string }) {
  return (
    <ul className={`flex gap-3 ${className}`}>
      {socials.map(({ label, href, icon: Icon, colour }) => (
        <li key={label}>
          <a
            href={href}
            aria-label={label}
            target={href.startsWith("http") ? "_blank" : undefined}
            rel="noopener noreferrer"
            className={`flex h-11 w-11 items-center justify-center rounded-full text-white transition-transform hover:-translate-y-0.5 motion-reduce:transform-none ${colour}`}
          >
            <Icon className="h-5 w-5" aria-hidden />
          </a>
        </li>
      ))}
    </ul>
  );
}
