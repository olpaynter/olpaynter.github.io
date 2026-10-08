# opaynter.com

The personal site of Oliver Paynter-Jones, live at [opaynter.com](https://opaynter.com). It is a Next.js app exported as static files and served by GitHub Pages.

## Commands

| Command          | What it does                                                                |
| ---------------- | --------------------------------------------------------------------------- |
| `npm run dev`    | Development server at http://localhost:3000, with a theme switcher.         |
| `npm run build`  | Static export into `out/`.                                                  |
| `npm run format` | Formats everything with Prettier.                                           |
| `npm run check`  | Format check, ESLint and the TypeScript compiler. Run it before committing. |

## Content

| What                         | Where                                                                         |
| ---------------------------- | ----------------------------------------------------------------------------- |
| Timeline                     | `src/data/journey.ts`, most recent first.                                     |
| Blog posts                   | An entry in `src/data/blog.ts` and a body in `src/content/posts/<slug>.html`. |
| Quotes on the home page      | `src/data/reminders.ts`.                                                      |
| Resume, dissertation, photos | `public/`. Convert images to WebP first.                                      |

[docs/development.md](docs/development.md) has the details: the code layout, themes, motion, the side nav, and how to add pages.

## Deployment

Every push to `main` runs `.github/workflows/deploy.yml`, which checks, builds and publishes the site. A failing check stops the deploy. Pull requests, including Dependabot's, run the same check and build in `.github/workflows/check.yml`.
