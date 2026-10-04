import type { NavItem } from "@/components/SiteNav";
import { journey } from "@/data/journey";

/**
 * The home page's side nav. On the home page its entries scroll to sections; on any other page
 * they link back to those sections on the home page.
 */
export function homeNav(onHomePage: boolean, { onResumePage = false } = {}): NavItem[] {
  const to = (id: string): Pick<NavItem, "id" | "href"> => (onHomePage ? { id } : { href: `/#${id}` });
  return [
    {
      label: "Home",
      ...(onHomePage ? { id: "about" } : { href: "/" }),
      // The resume hangs off Home only while you are on it, and folds away again on leaving.
      children: onResumePage ? [{ label: "My resume", href: "/resume", current: true }] : undefined,
    },
    {
      label: "Journey and Experiences",
      ...to("journey"),
      children: journey.map((chapter) => ({ label: chapter.navLabel, ...to(chapter.id) })),
    },
    { label: "Blog", ...to("blog") },
  ];
}
