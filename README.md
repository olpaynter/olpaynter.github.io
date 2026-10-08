# olpaynter.github.io

Personal site of Oliver Paynter-Jones. It is a Next.js 16 app exported as static files (`output: "export"`) and served by GitHub Pages, so there is no server: every page is built ahead of time.

## Commands

| Command          | What it does                                                                                       |
| ---------------- | -------------------------------------------------------------------------------------------------- |
| `npm run dev`    | Development server at http://localhost:3000, with the theme switcher in the corner.                |
| `npm run build`  | Static export into `out/`. This is what GitHub Pages serves.                                       |
| `npm run format` | Formats everything with Prettier, including Tailwind class order.                                  |
| `npm run check`  | Format check, ESLint, route type generation and the TypeScript compiler. Run it before committing. |

## Layout of the code

| Path                  | Contents                                                                                                                                                                                                                                                                                                                               |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/app/`            | Routes: `/`, `/blog`, `/blog/[slug]`, `/resume`, `/journey/university-of-bath/dissertation`, the root layout, `globals.css`.                                                                                                                                                                                                           |
| `src/components/`     | Page pieces. `NavigationTransitions`, `RevealOnScroll` and `DevThemeSwitcher` run in the browser; the rest render at build time.                                                                                                                                                                                                       |
| `src/components/nav/` | The side nav: `SiteNav` (the component), `view.ts` (the rules for what each row shows), `NavRow`, `useScrollSpy` (the section in view), and `BackLink` for narrow screens.                                                                                                                                                             |
| `src/data/`           | `journey.ts` (the timeline) and `blog.ts` (the post list).                                                                                                                                                                                                                                                                             |
| `src/content/posts/`  | One HTML body per post, named after its slug.                                                                                                                                                                                                                                                                                          |
| `src/lib/`            | `routes.ts` (page addresses), `posts.ts` (post bodies and their sections), dates and site details.                                                                                                                                                                                                                                     |
| `src/lib/nav/`        | The side nav's data: `siteMap.ts` (the nav trees, declared), `build.ts` (turns them into the site-wide nav at build time), `checks.ts` (the build-time rules), `types.ts` (the shapes passed between them and to the browser), `hash.ts` (reading and writing section hashes), `tree.ts`, `intent.ts` (where a navigation is heading). |
| `public/`             | Files served as they are: images, the outline shapes in `shapes/`, the resume and the dissertation.                                                                                                                                                                                                                                    |

## Adding content

### Timeline entries

Add a chapter to `journey` in `src/data/journey.ts`, most recent first. Each chapter needs an `id`, which becomes its anchor under the journey section (`/#journey/icrtouch`) and its nav key (`chapter-icrtouch`), and a short `navLabel` for the side nav. Both must be unique across the timeline. The chapter appears in the side nav without any other change.

Dates are ISO strings, `YYYY-MM` or `YYYY-MM-DD`, and only the month and year are shown. Leave out `end` for the current role. A chapter with no dates at all, such as Home, shows no date markers and fades out at the bottom.

### Blog posts

1. Add an entry to `posts` in `src/data/blog.ts`, most recent first. `navLabel` is the short title for the side nav. Set `madeWithAI` honestly: only `false` shows a label. `draft: true` hides the post everywhere, including the nav and the sitemap.
2. Add the body as `src/content/posts/<slug>.html`. Each section is `<div class="section" id="...">` followed directly by its `<h2>`; the post page reads that pattern to build the section list in the side nav. The heading must be plain text, or the build fails. A section with no heading, such as an introduction, is left out of the nav. Section ids must be unique within the post.
3. Give every `<img>` its real `width` and `height`, plus `loading="lazy" decoding="async"`. The dimensions reserve the space before the image arrives, so the text does not shift and section links arrive at the right place.

### Images and photos

`next/image` cannot resize images in a static export (`images.unoptimized` is set), so every image is served exactly as committed. Before adding one:

- convert it to WebP, for example `cwebp -q 82 -m 6 in.png -o out.webp` (`gif2webp` for animations);
- resize photos to about 1280px wide first;
- set the `width` and `height` on `<Image>` to match the file's real aspect ratio.

A timeline photo in `src/data/journey.ts` can take an optional `caption`, shown beneath it. Any image on the site that fails to load, including those in post bodies, is replaced by `public/photos/fallback.svg` (`FALLBACK_IMAGE` in `src/lib/site.ts`); the script in the root layout does this before the page hydrates.

The resume is `public/resume.pdf`. Replace the file to update it. Each document page's PDF is listed in `documentFiles` in `src/lib/routes.ts`. `DocumentPrefetch` downloads it when the reader points at, focuses or touches a link to that page, unless they have asked to save data, so the preview opens from the cache.

## Themes

There are two themes, warm and typographic. The inline script in `src/app/layout.tsx` picks one at random on the first page of a visit and stores it in `sessionStorage`, so it holds across pages and reloads but a new visit picks again. It runs before the first paint, so the page never shows the other theme first. Warm is also the default if the script does not run.

Components never use colours directly. They read the variables declared at the top of `src/app/globals.css`, which each theme sets:

| Variable                                                    | Used for                                                                                     |
| ----------------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `--color-background`, `--color-foreground`, `--color-muted` | Page, text and secondary text (Tailwind's `bg-background`, `text-foreground`, `text-muted`). |
| `--mark`                                                    | Timeline dots and bars, and the active line in the side nav.                                 |
| `--link`                                                    | Links and their underlines.                                                                  |
| `--role`                                                    | The role under the name at the top of the home page.                                         |
| `--title`                                                   | Role titles in the timeline.                                                                 |
| `--shape`                                                   | The floating outlines in the margins.                                                        |

The typographic theme also restyles elements marked `t-serif` (headings and names, set in Newsreader) and `t-title` (role titles, set in capitals). To change a theme, edit its variables; to add a colour, add a variable to both themes rather than a colour value in a component.

`DevThemeSwitcher` appears only under `npm run dev`. The root layout does not render it in production.

## Floating outlines

`IslandBackdrop` lays out the outlines in the side margins from a fixed seed, so the layout is the same on every build. `PER_SIDE` sets how many there are, and each one gets a random size, rotation, position across the margin and drift. Two outlines of the same shape are kept `SAME_SHAPE_GAP` percent of the page apart. Each shape is a file in `public/shapes/`, used as a mask over the theme's `--shape` colour; to add a shape, add its file and its aspect ratio to `SHAPES`.

## Layout rules

- The content column is `max-w-3xl` (48rem). `IslandBackdrop` places the outlines in the margins either side of it using half that width, `24rem`, so change both together.
- The side nav and the margin dates appear from the `nav` breakpoint (1360px, declared in `globals.css`), below which they would collide. Use the `nav:` variant rather than a pixel value.
- The timeline's line, dot and indent offsets are calculated together in the `line` constants at the top of `JourneyTimeline.tsx`. A change to the dot size or indent needs those offsets recalculated.

## Motion

Every animation follows three rules.

1. Animate only `transform`, `opacity`, `filter` and colours, so the browser does not recalculate layout on each frame. The one exception is the side nav folds, which animate `grid-template-rows` because they have to push the items beneath them down.
2. Respect reduced motion. Motion is wrapped in `motion-safe:`, a `prefers-reduced-motion: no-preference` block, or has `motion-reduce:` overrides; page transitions drop to zero duration.
3. Use the shared easing, `var(--ease-settle)`, for anything that settles into place.

### Page transitions

Page transitions use React's `<ViewTransition>` and the browser's View Transitions API. They animate the page body only; the side nav is not part of them (see "Side nav structure").

| Name or class                                                   | Where                                                           | Effect                                                                     |
| --------------------------------------------------------------- | --------------------------------------------------------------- | -------------------------------------------------------------------------- |
| `page-out`, `page-in`                                           | `PageTransition`, wrapped around each page                      | The old page lifts away in 200ms; the new one settles in over about 600ms. |
| `history-page-old`, `history-page-new`                          | `main`, while `html[data-history-nav]` is set                   | Browser back and forward give the page body the same two classes.          |
| `post-title-<slug>`, class `morph`                              | `PostTitle`                                                     | A post's title glides between the list and the post page on link clicks.   |
| `site-nav`, `edge-fade-top`, `edge-fade-bottom`, class `steady` | The side nav, and the fades at the top and bottom of the screen | Lifted out of the page snapshots and shown live, unanimated.               |

Every name on a page must be unique, because a duplicate aborts the whole transition.

`NavigationTransitions` in the root layout coordinates every navigation between pages:

- It records where a link click or a back or forward is heading in `src/lib/nav/intent.ts`, before the router renders the next page. The side nav reads it while rendering that page, which happens before the address changes, so it highlights the section the reader is heading for straight away.
- Next.js applies back and forward as an immediate render, so it intercepts `popstate` before the router, starts the transition, and replays the event to the router once the old page has been captured.

### Side nav structure

The side nav follows three rules. Check a new page against them before adding it.

1. **Home is always the first entry.** It is the way home from every page, so it stays at the top of the nav whatever page the reader is on.
2. **A new page can replace the rest of the nav with its own.** On a page of its own, such as `/blog`, every entry except Home folds away and the page's own entries unroll beneath it. In the code this is a nav tree with that page as its root.
3. **A page that does not need its own nav unrolls from an existing entry instead.** It unrolls as a child of the entry it belongs to, only while the reader is on it, and nothing else in the nav is hidden. Clicking the parent goes back one step. "My resume" unrolls under Home, and "My dissertation" under University. A post works the same way within the blog nav: it opens under Blog with its sections, and Blog leads back to `/blog`.

The side nav is one component, mounted once in the root layout, and it is never replaced. At build time, `siteNavigation` in `src/lib/nav/build.ts` merges every page's nav into one tree holding every entry any page shows, and records, for each page, which entries it shows and what each does. Moving to another page changes only which entries are shown, where they lead and which is highlighted. Each entry is the same element on every page, so every change is a CSS transition on it: an entry that is not shown folds away, one that is shown unrolls, and a line that gains or loses the highlight grows or shrinks. Moving between pages therefore looks the same as moving within one. A branch unrolls and rolls up as one block, over 600ms: only the outermost fold that changes animates (`Fold` in `NavRow.tsx`). While a branch opens, the entries inside it take their new state at once; while it closes, they keep their look until it has rolled up. So the entries inside a branch never unroll on their own, a branch never empties before it rolls up, and nested folds never multiply their motion. During a page transition the nav is lifted out of the snapshots and shown live (the `steady` class in `globals.css`), so those transitions play while the page changes.

These rules are all in `navRows` in `src/components/nav/view.ts`. Exactly one entry is highlighted: the section in view, or, on a page with no sections, the entry for the page itself. The entries above it are not highlighted, though their folds are open. So on `/blog` the post in view is highlighted and Blog is not, and on a post the section in view is highlighted and the post is not.

Clicking the entry for the page you are already on, such as the current post, "My resume" or Blog on `/blog`, scrolls back to the top of that page rather than reloading it, and the highlight returns to its first section.

Each page's nav is resolved in `build.ts` from the trees in `src/lib/nav/siteMap.ts`. Each tree has a root page and a list of entries. An entry has a `key` and a `label`, and one or both of:

- a `section`, an id on the tree's root page. On the root page the entry scrolls to it; elsewhere it links to it, as in `/#journey/icrtouch`.
- a `page`, an address from `routes.ts`. The entry links to it, and is the current entry while the reader is on it. On the root page, an entry with a section scrolls to the section instead.

An entry with `unrolls: true` is shown only while the reader is on its page or a page beneath it (rule 3). A page that is not a root belongs to the one tree that lists it. On narrow screens, where the side nav is hidden, `BackLink` shows a single link to the entry one step above the current page.

Keys follow one scheme, so the same thing has the same key on every page and different things never share one:

| Key                   | Entry                                      |
| --------------------- | ------------------------------------------ |
| `home`                | Home                                       |
| `journey`, `blog`     | The home page sections, and Blog           |
| `chapter-<id>`        | A journey chapter                          |
| `post-<slug>`         | A blog post                                |
| `section-<slug>-<id>` | A section of a post                        |
| `page-<name>`         | A page that unrolls from an entry (rule 3) |

### What the build checks

The build creates every page's nav and the merged nav, and fails, and with it the deploy, if any of these is broken:

- Home is the first entry of every nav.
- Keys are lowercase words joined by hyphens, and unique within each nav.
- An entry with the same key is the same element on every page, so it has the same label, the same parent, and the same order among its siblings everywhere.
- No two entries scroll to the same section.
- Every link goes to a page in the site map, and a link to a section of a root page names a section that page declares.
- Every page in the site map has a page file under `src/app`, and belongs to exactly one tree, and every tree has an entry for its own root page.
- Only one entry is current.
- Every page address is written as `/a/b`, with no trailing slash, hash or query.
- Sections are given only for pages that exist.
- Every post section heading is plain text with no entities, and every section id is letters, digits, hyphens and underscores, so no section is silently left out of the nav or mislabelled.

`checkedLink` in `src/lib/nav/siteMap.ts` applies the same link check to links written into content, such as a project's link in the timeline. Use it for any internal link that is not a nav entry. It checks sections only on root pages, whose sections the site map declares; a link to a post's section is checked for its page but not its section.

While developing, the side nav also logs an error in the browser console for any section it cannot find on the page, and for any section listed out of page order. The build cannot tell whether a page passes its own address to `BackLink` or `DocumentPage`, so check that when copying a page.

### Side nav highlight

Scrolling sets a target, the section crossing a band just above the middle of the screen, and the highlight walks towards it one entry at a time. It never skips an entry and holds each for at least 75ms (`MIN_DWELL_MS` in `useScrollSpy.ts`), so a fast scroll plays through every section in order. At the very top of a page the first entry is highlighted, and at the very bottom the last, so a page too short for its last sections to reach the band still highlights them.

Clicking an entry is the exception. The nav does the scrolling itself: the highlight jumps straight to the entry and holds there until the scroll has been quiet for 150ms, or for at most 3 seconds. If the reader scrolls during the hold, the highlight then catches up with where they are; otherwise it stays on the clicked entry, even one too short to reach the band. Modified clicks, such as opening in a new tab, are left to the browser.

The address bar follows the highlight (`/#journey/icrtouch`, or the bare address for the first section) by replacing the current history entry, so scrolling adds nothing to the back button. While scrolling, it updates once the highlight has rested for 200ms, because browsers refuse a page that replaces its history entry many times a second. A click updates it straight away.

### Browser support

The site is built for current Chrome, Safari and Firefox, and each feature falls back cleanly where it is missing.

| Feature                  | Used for                      | Without it                                                                 |
| ------------------------ | ----------------------------- | -------------------------------------------------------------------------- |
| View transitions         | Page changes and title morphs | Pages change instantly.                                                    |
| Scroll-driven animations | The timeline entrances        | `RevealOnScroll` plays each entrance once as it comes into view (Firefox). |
| `scrollend`              | Ending the hold after a click | The hold ends when scroll events stop arriving.                            |

The side nav does not scroll, so a nav taller than the space below 30% of the screen height would run off the bottom on a short screen. Keep the number of entries shown at once small: folds already hide every branch the reader is not in.

Compare browsers on the built site (`npm run build`, then serve `out/`), because the dev server compiles pages on demand and runs everything twice. If another program already holds `127.0.0.1:3000`, some browsers reach it instead of the dev server; open `http://[::1]:3000`, which `allowedDevOrigins` in `next.config.ts` permits.

## Adding pages and sections

Each procedure below lists every file to touch. Run `npm run check` and `npm run build` afterwards. The build fails with a message naming the page and entry for the mistakes listed under "What the build checks". It does not catch the ones listed there as development-only, so open the page in the dev server and watch the browser console too.

### A section on the home page

1. Add its id to `homeSections` in `src/lib/routes.ts`.
2. Render it in `src/app/page.tsx` as `<section id={homeSections.<name>}>`.
3. Add an entry to the home tree in `src/lib/nav/siteMap.ts` with a new key, its label and `section: homeSections.<name>`, in the position it has on the page. The highlight follows the order of the entries, so it must match the order of the sections.

### A journey chapter or a blog post

Add it to the data file as described under "Adding content". The nav, its keys, the sitemap and the link checks pick it up from the data.

### A page that unrolls from an entry (rule 3)

For example a project page beneath a journey chapter.

1. Add its address to `routes` in `src/lib/routes.ts`. Nest the address under the part of the site it belongs to, as `/journey/university-of-bath/dissertation` is.
2. Create the page file at the matching path under `src/app`. For a document, use `DocumentPage` with `path={routes.<name>}`, which adds the back link for narrow screens. Otherwise wrap the page in `<PageTransition>` and render `<BackLink path={routes.<name>} />` first inside `<main>`, as the other pages do. The side nav itself is in the root layout and needs no change.
3. Add an entry under its parent in `src/lib/nav/siteMap.ts` with key `page-<name>`, a label, `page: routes.<name>` and `unrolls: true`. Beneath an entry generated from content data, such as a journey chapter or a post, add it to `unrolledPages` under that entry's key, for example `chapter-university-of-bath`.

A page can unroll beneath another unrolled page in the same way, to any depth: give the inner entry `unrolls: true` too, and every entry above it unrolls on the inner page.

### A page with its own nav (rule 2)

1. Add its address to `routes`, and create its page file as above.
2. Add a nav tree to `navTrees` in `src/lib/nav/siteMap.ts` with `root` set to the page's address. Its first entry is Home, `{ key: "home", label: "Home", page: routes.home }`. Then add an entry for the page itself, and its sections as children with `section` set. An entry that also appears in another tree, such as Home, must be under the same parent and in the same order there.
3. Give the page's own sections the ids its tree declares.
4. To link to the page from the home nav, add an entry with `page` set to it; the page still belongs to its own tree, because it is that tree's root.

### Sections on a page that is not a root

Pass them to `siteNavigation` in `src/app/layout.tsx`, under the page's address, alongside the posts' sections from `postSectionsByPage`. They appear beneath the page's entry while the reader is on it. Give them keys of the form `section-<page>-<id>` so they cannot collide with any other entry.

### A link written into content

Wrap the address in `checkedLink`, as `JourneyTimeline` does for project links, so a broken link fails the build.

## Search, sharing and missing pages

- `src/lib/site.ts` holds the site's address, name and description. The root layout uses them for the page metadata, and the sitemap and robots file use the address.
- `src/app/sitemap.ts` lists every page in the site map, and `src/app/robots.ts` points crawlers at it. Both are written to files at build time.
- `src/app/opengraph-image.png` is the preview shown when a link is shared, and `icon.svg` is the browser tab icon. Replace the image if the name, description or theme changes.
- `src/app/not-found.tsx` becomes `404.html`, which GitHub Pages serves for any unknown path. It sends the visitor to the home page.

## Deployment

`.github/workflows/deploy.yml` deploys on every push to `main`, and can also be run by hand from the Actions tab. It installs with `npm ci` on the Node version in `.nvmrc`, runs `npm run check`, builds, and publishes `out/` to GitHub Pages. A failing check stops the deploy. GitHub Pages must be set to deploy from GitHub Actions (Settings, Pages, Source).

Dependabot (`.github/dependabot.yml`) opens a weekly pull request for npm updates, grouping minor and patch versions together, and another for the workflow's actions. `.github/workflows/check.yml` runs the check and the build on every pull request, including Dependabot's, so an update is known to work before it is merged.
