# Going live

## Switch GitHub Pages to deploy from GitHub Actions

1. In the repository on GitHub, open Settings, then Pages.
2. Under "Build and deployment", set Source to "GitHub Actions".
3. Merge `redesign` into `main`. The push to `main` runs `.github/workflows/deploy.yml`, which checks, builds and publishes `out/`.
4. Watch the run in the Actions tab. A failing check stops the deploy before anything is published.

## Check that pages load directly after the first deploy

1. Open `https://opaynter.com/blog` and `https://opaynter.com/resume` in a new tab, typing the address rather than following a link.
2. If both load, nothing more is needed.
3. If either ends up on the home page (the 404 page redirects there), the host is not serving `blog.html` for `/blog`. Fix it as follows:
   - Set `trailingSlash: true` in `next.config.ts`, so the export writes `blog/index.html` instead.
   - With that setting, the browser path ends in a slash (`/blog/`), but the side nav looks pages up by their address without one (`/blog`). A trial build confirmed that the nav then shows no entries. So in `src/components/nav/SiteNav.tsx`, strip a trailing slash from the path before looking up `navigation.pages`, leaving `/` alone.
   - Run `npm run check` and `npm run build`, and confirm the nav on `/blog/` and a post page in the built site before pushing.
