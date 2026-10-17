---
name: screenshot-review
description: Use when a change could alter how any page of this site looks (CSS, Tailwind classes, components, layout, the nav, post bodies, images, fonts), before calling such a change finished, or when asked to review, check or screenshot the site's appearance at different screen sizes.
---

# Screenshot review

`npm run screenshots` builds the site and compares a full-page screenshot of every page in the sitemap, at four widths, with the screenshots saved in `.screenshots/`. It uses Playwright's `toHaveScreenshot`; the settings are in `playwright.config.ts` and the test is `tests/screenshots.spec.ts`.

## Widths

| Width | What it covers                                                                   |
| ----- | -------------------------------------------------------------------------------- |
| 390   | Phones: below `sm`, with the smaller text and the photo beside the name.         |
| 1024  | Below the `nav` breakpoint (1360px): the mobile nav bar instead of the side nav. |
| 1440  | The side nav and the margin dates.                                               |
| 1920  | Above 1512px, where the root font size grows with the viewport.                  |

## Procedure

1. Before editing, record the current look with `npm run screenshots -- --update-snapshots`. `.screenshots/` is not committed, so a fresh clone needs this before its first comparison. If you have already edited, run `git stash` first and `git stash pop` afterwards.
2. Make the change, then run `npm run screenshots`.
3. Each failing test is a page at one width that looks different. Its folder in `test-results/` holds `-expected.png` (before), `-actual.png` (after) and `-diff.png`, which marks the changed pixels in red. Read the diff and the actual image for every failure, and confirm each difference is one the change intended. A failure on a page or width the change should not have affected is a regression.
4. A failure in `expect(errors)` means the page logged a console or page error. Fix it.
5. When the result is right, run `npm run screenshots -- --update-snapshots` again, so the next change is compared with this one.

The user can open the same comparison in a browser with `npx playwright show-report`.

## Limits

- Animated images and the PDF previews are masked with magenta blocks, so changes inside them are not compared.
- Motion, hover and focus states are not covered. The browser is set to reduced motion, so animations show their final state.
- Fixed elements (the side nav, the mobile nav bar and the edge fades) appear once, in their position on the first screen.
- The 404 page redirects home, so it is not screenshotted.
- Google Chrome must be installed, because the tests use it instead of a downloaded browser.

## CI

`.github/workflows/screenshots.yml` runs the same comparison on every push to `main` and every pull request, with screenshots of the commit before it as the baseline. It uploads the report as the `screenshot-report` artifact and does not fail the run when pages differ.
