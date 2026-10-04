/**
 * Page addresses and home page section ids. Every page must also appear in a nav tree in
 * `siteMap.ts`, which is what the build checks links against. See "Adding pages and sections" in the
 * README before adding one.
 */
export const routes = {
  home: "/",
  blog: "/blog",
  post: (slug: string) => `/blog/${slug}`,
  resume: "/resume",
  dissertation: "/journey/university-of-bath/dissertation",
} as const;

/** Section ids on the home page. The page renders them, and nav entries scroll to them. */
export const homeSections = {
  about: "about",
  journey: "journey",
  blog: "blog",
} as const;
