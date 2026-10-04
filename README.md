# olpaynter.github.io

Personal site of Oliver Paynter-Jones. It is a Next.js 16 app exported as static files (`output: "export"`) and served by GitHub Pages, so there is no server: every page is built ahead of time.

## Commands

| Command          | What it does                                                                        |
| ---------------- | ----------------------------------------------------------------------------------- |
| `npm run dev`    | Development server at http://localhost:3000, with the theme switcher in the corner. |
| `npm run build`  | Static export into `out/`. This is what GitHub Pages serves.                        |
| `npm run format` | Formats everything with Prettier, including Tailwind class order.                   |
| `npm run check`  | Format check, ESLint and the TypeScript compiler. Run it before committing.         |

## Layout of the code

| Path                 | Contents                                                                                                                  |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `src/app/`           | Routes: `/`, `/blog`, `/blog/[slug]`, `/resume`, plus the root layout and `globals.css`.                                  |
| `src/components/`    | Page pieces. `SiteNav`, `HistoryTransitions` and `DevThemeSwitcher` are client components; the rest render at build time. |
| `src/data/`          | `journey.ts` (the timeline) and `blog.ts` (the post list).                                                                |
| `src/content/posts/` | One HTML body per post, named after its slug.                                                                             |
| `src/lib/`           | Nav builders (`homeNav`, `blogNav`) and date formatting.                                                                  |
| `public/`            | Files served as they are: images, the outline shapes in `shapes/`, the resume and the dissertation.                       |

## Adding content

### Timeline entries

Add a chapter to `journey` in `src/data/journey.ts`, most recent first. Each chapter needs an `id` (its anchor, such as `/#icrtouch`) and a short `navLabel` for the side nav. Both must be unique across the timeline.

Dates are ISO strings, `YYYY-MM` or `YYYY-MM-DD`, and only the month and year are shown. Leave out `end` for the current role. A chapter with no dates at all, such as Home, shows no date markers and fades out at the bottom.

### Blog posts

1. Add an entry to `posts` in `src/data/blog.ts`, most recent first. `navLabel` is the short title for the side nav. Set `madeWithAI` honestly: only `false` shows a label. `draft: true` hides the post everywhere.
2. Add the body as `src/content/posts/<slug>.html`. Each section is `<div class="section" id="...">` followed directly by its `<h2>`; the post page reads that pattern to build the section list in the side nav.
3. Give every `<img>` its real `width` and `height`, plus `loading="lazy" decoding="async"`. The dimensions reserve the space before the image arrives, so the text does not shift and section links arrive at the right place.

### Images and photos

`next/image` cannot resize images in a static export (`images.unoptimized` is set), so every image is served exactly as committed. Before adding one:

- convert it to WebP, for example `cwebp -q 82 -m 6 in.png -o out.webp` (`gif2webp` for animations);
- resize photos to about 1280px wide first;
- set the `width` and `height` on `<Image>` to match the file's real aspect ratio.

The resume is `public/resume.pdf`. Replace the file to update it.

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

1. Animate only `transform`, `opacity` and colours, so the browser does not recalculate layout on each frame. The one exception is the side nav folds, which animate `grid-template-rows` because they have to push the items beneath them down.
2. Respect reduced motion. Motion is wrapped in `motion-safe:`, a `prefers-reduced-motion: no-preference` block, or has `motion-reduce:` overrides; page transitions drop to zero duration.
3. Use the shared easing, `var(--ease-settle)`, for anything that settles into place.

### Page transitions

Page transitions use React's `<ViewTransition>` and the browser's View Transitions API.

| Name or class                 | Where                                      | Effect                                                                     |
| ----------------------------- | ------------------------------------------ | -------------------------------------------------------------------------- |
| `page-out`, `page-in`         | `PageTransition`, wrapped around each page | The old page lifts away in 200ms; the new one settles in over about 500ms. |
| `nav-*`, class `nav-item`     | Each side nav entry                        | An entry on both pages glides to its new place in 680ms; others fade.      |
| `post-title-*`, class `morph` | `PostTitle`                                | A post's title glides between the list and the post page.                  |
| `html[data-history-nav]`      | `HistoryTransitions`                       | Browser back and forward get the same lift and settle on the whole page.   |

Every name on a page must be unique, because a duplicate aborts the whole transition. Nav entries are named after their label, so two entries on one page must not share a label; post sections use their own `transitionKey` to stay clear of page labels. An entry inside a closed fold has no name, so it does not appear in the snapshot outside its fold.

Browser back and forward need `HistoryTransitions` because Next.js applies them as an immediate render. It intercepts `popstate` before the router, starts the transition, and replays the event to the router once the old page has been captured.

### Side nav highlight

Scrolling sets a target, the section crossing a band just above the middle of the screen, and the highlight walks towards it one entry at a time. It never skips an entry and holds each for at least 75ms (`MIN_DWELL_MS` in `SiteNav.tsx`), so a fast scroll plays through every section in order. Clicking an entry is the exception: the highlight jumps straight to it and holds until the scroll it starts has finished.

## Deployment

GitHub Pages must be set to deploy from GitHub Actions (Settings, Pages, Source). The deploy workflow, which will build with `npm run build` and publish `out/`, has not been added yet.
