import type { Metadata } from "next";
import { Inter, Newsreader } from "next/font/google";
import { DevThemeSwitcher } from "@/components/DevThemeSwitcher";
import { HistoryTransitions } from "@/components/HistoryTransitions";
import { IslandBackdrop } from "@/components/IslandBackdrop";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Oliver Paynter-Jones",
  description: "Software Development Engineer at Amazon, based in Edinburgh.",
};

// Picks warm or typographic once per visit: sessionStorage survives reloads but not a new visit.
// It runs before first paint so the page never flashes the other theme.
const pickTheme = `try {
  var t = sessionStorage.getItem("theme");
  if (t !== "warm" && t !== "typographic") {
    t = Math.random() < 0.5 ? "warm" : "typographic";
    sessionStorage.setItem("theme", t);
  }
  document.documentElement.dataset.theme = t;
} catch (e) {}`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth" className={`${inter.variable} ${newsreader.variable} h-full antialiased`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: pickTheme }} />
      </head>
      <body className="min-h-full font-sans">
        <HistoryTransitions />
        <DevThemeSwitcher />
        <div className="relative min-h-full">
          <IslandBackdrop />
          {children}
        </div>
        <div aria-hidden className="pointer-events-none fixed inset-x-0 top-0 z-10 h-16 bg-linear-to-b from-background to-transparent" />
        <div aria-hidden className="pointer-events-none fixed inset-x-0 bottom-0 z-10 h-24 bg-linear-to-t from-background to-transparent" />
      </body>
    </html>
  );
}
