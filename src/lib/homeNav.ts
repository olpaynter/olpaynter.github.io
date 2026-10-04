import type { NavItem } from "@/components/SiteNav";
import { journey } from "@/data/journey";

/**
 * The home page's side nav. On the home page its entries scroll to sections; on any other page
 * they link back to those sections on the home page.
 */
export function homeNav(onHomePage: boolean, { onResumePage = false } = {}): NavItem[] {
  const entry = (label: string, id: string, children?: NavItem[]): NavItem =>
    onHomePage ? { label, id, children } : { label, href: `/#${id}`, children };
  const home: NavItem = onHomePage ? { label: "Home", id: "about" } : { label: "Home", href: "/" };

  return [
    {
      ...home,
      // The resume hangs off Home only while you are on it, and folds away again on leaving.
      children: onResumePage ? [{ label: "My resume", href: "/resume", current: true }] : undefined,
    },
    entry(
      "Journey and Experiences",
      "journey",
      journey.map((chapter) => entry(chapter.navLabel, chapter.id)),
    ),
    entry("Blog", "blog"),
  ];
}
