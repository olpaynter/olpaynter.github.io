import type { Metadata } from "next";
import { Inter, Newsreader } from "next/font/google";
import { DevThemeSwitcher } from "@/components/DevThemeSwitcher";
import { NavigationTransitions } from "@/components/NavigationTransitions";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { SiteNav } from "@/components/nav/SiteNav";
import { siteNavigation } from "@/lib/nav/build";
import { postSectionsByPage } from "@/lib/posts";
import { IslandBackdrop } from "@/components/IslandBackdrop";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// Only the typographic theme uses the serif, so it is fetched when that theme first needs it
// rather than preloaded on every visit.
const newsreader = Newsreader({
  variable: "--font-serif",
  subsets: ["latin"],
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_NAME,
  description: SITE_DESCRIPTION,
  openGraph: { type: "website", siteName: SITE_NAME, locale: "en_GB", url: "/" },
  twitter: { card: "summary_large_image" },
};

// Runs before first paint, so the page never flashes the other theme or shows the timeline before
// its entrance. It picks warm or typographic once per visit: sessionStorage survives reloads but not
// a new visit. Where scroll-driven animations are missing, it turns on the fallback in globals.css.
const beforePaint = `try {
  var t = sessionStorage.getItem("theme");
  if (t !== "warm" && t !== "typographic") {
    t = Math.random() < 0.5 ? "warm" : "typographic";
    sessionStorage.setItem("theme", t);
  }
  document.documentElement.dataset.theme = t;
} catch (e) {}
if (window.CSS && !CSS.supports("animation-timeline: view()")) document.documentElement.dataset.reveal = "";`;

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const navigation = siteNavigation(await postSectionsByPage());
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${inter.variable} ${newsreader.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: beforePaint }} />
      </head>
      <body className="min-h-full font-sans">
        <NavigationTransitions />
        {process.env.NODE_ENV === "development" && <DevThemeSwitcher />}
        <div className="relative min-h-full">
          <IslandBackdrop />
          {children}
        </div>
        <SiteNav navigation={navigation} />
        <RevealOnScroll />
        <div
          aria-hidden
          className="steady edge-fade-top pointer-events-none fixed inset-x-0 top-0 z-10 h-16 bg-linear-to-b from-background to-transparent"
        />
        <div
          aria-hidden
          className="steady edge-fade-bottom pointer-events-none fixed inset-x-0 bottom-0 z-10 h-24 bg-linear-to-t from-background to-transparent"
        />
      </body>
    </html>
  );
}
