/**
 * The page and section a navigation in progress is heading for. `NavigationTransitions` records it
 * from link clicks and from back and forward, before the router renders the next page. The side nav
 * reads it while rendering that page, which happens before the address changes, so it can highlight
 * the section straight away instead of passing through the page's first section. Reading does not
 * clear it, because React may render a page more than once before committing it.
 */
let intent: { path: string; section: string } | null = null;

export function expectNavigation(url: URL) {
  intent = { path: url.pathname, section: decodeURIComponent(url.hash.slice(1)) };
}

/** The section a navigation to `path` is heading for, if one is in progress. */
export function sectionOnArrival(path: string): string | undefined {
  return intent?.path === path && intent.section ? intent.section : undefined;
}

/** Called once a new page has committed, so an intent never outlives its navigation. */
export function navigationCommitted() {
  intent = null;
}
