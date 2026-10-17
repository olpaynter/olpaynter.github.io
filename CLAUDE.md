@AGENTS.md

How the site is built (themes, motion, navigation and layout rules) is described in `docs/development.md`. Read the relevant section before changing those areas. Run `npm run check` and `npm run build` before calling a change finished, because CI runs both on every pull request. For a change that could alter how a page looks, also follow the `screenshot-review` skill, which compares screenshots of every page at four widths from before and after the change.
