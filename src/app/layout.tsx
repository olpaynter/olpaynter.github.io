import type { Metadata } from "next";
import { Inter, Newsreader } from "next/font/google";
import { DevThemeSwitcher } from "@/components/DevThemeSwitcher";
import { DocumentPrefetch } from "@/components/DocumentPrefetch";
import { NavigationTransitions } from "@/components/NavigationTransitions";
import { RevealOnScroll } from "@/components/RevealOnScroll";
import { SiteNav } from "@/components/nav/SiteNav";
import { siteNavigation } from "@/lib/nav/build";
import { postSectionsByPage } from "@/lib/posts";
import { IslandBackdrop } from "@/components/IslandBackdrop";
import { FALLBACK_IMAGE, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";
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

// Runs before first paint, so the page never shows the timeline before its entrance. The published
// site always uses the warm theme; in development it applies the theme chosen in DevThemeSwitcher,
// so the typographic theme can still be previewed. Where scroll-driven animations are missing, it
// turns on the fallback in globals.css.
// It also swaps any image that fails to load for the site's fallback image; listening this early
// catches images that fail before React hydrates, and the data attribute stops a failing fallback
// from retrying forever.
const devTheme = `try {
  var t = sessionStorage.getItem("theme");
  if (t === "warm" || t === "typographic") document.documentElement.dataset.theme = t;
} catch (e) {}
`;
const beforePaint = `${process.env.NODE_ENV === "development" ? devTheme : ""}if (window.CSS && !CSS.supports("animation-timeline: view()")) document.documentElement.dataset.reveal = "";
document.addEventListener("error", function (e) {
  var img = e.target;
  if (!(img instanceof HTMLImageElement) || "fallback" in img.dataset) return;
  img.dataset.fallback = "";
  img.removeAttribute("srcset");
  img.src = "${FALLBACK_IMAGE}";
}, true);`;

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
        <DocumentPrefetch />
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
