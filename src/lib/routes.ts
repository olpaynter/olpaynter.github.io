/**
 * Page addresses and home page section ids. Every page must also appear in a nav tree in
 * `siteMap.ts`, which is what the build checks links against. See "Adding pages and sections" in the
 * docs/development.md before adding one.
 */
export const routes = {
  home: "/",
  blog: "/blog",
  post: (slug: string) => `/blog/${slug}`,
  resume: "/resume",
  dissertation: "/journey/university-of-bath/dissertation",
} as const;

/** The PDF each document page shows, by the page's address. */
export const documentFiles: Record<string, string> = {
  [routes.resume]: "/resume.pdf",
  [routes.dissertation]: "/dissertation.pdf",
};

/** Section ids on the home page. The page renders them, and nav entries scroll to them. */
export const homeSections = {
  about: "about",
  journey: "journey",
  blog: "blog",
} as const;
