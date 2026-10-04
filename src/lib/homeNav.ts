import type { NavItem } from "@/components/SiteNav";
import { journey } from "@/data/journey";

/**
 * The home page's side nav. On the home page its entries scroll to sections; on any other page
 * they link back to those sections on the home page.
 */
export function homeNav(onHomePage: boolean): NavItem[] {
  const to = (id: string): Pick<NavItem, "id" | "href"> => (onHomePage ? { id } : { href: `/#${id}` });
  return [
    { label: "Home", ...(onHomePage ? { id: "about" } : { href: "/" }) },
    {
      label: "Journey and Experiences",
      ...to("journey"),
      children: journey.map((chapter) => ({ label: chapter.navLabel, ...to(chapter.id) })),
    },
    { label: "Blog", ...to("blog") },
  ];
}
