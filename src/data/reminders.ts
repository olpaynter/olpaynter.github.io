export type Reminder = {
  /** The line itself, as read or heard. */
  text: string;
  /** Who said or wrote it. Leave out if it has no particular source. */
  source?: string;
  /** Where the source can be read. */
  href?: string;
  /** A saved copy, in case the original moves or disappears. */
  archiveHref?: string;
  /** A sentence or two on why it stays with you. */
  why: string;
};

/** Shown on the home page beneath the introduction, in this order. */
export const reminders: Reminder[] = [
  {
    text: "Cognitive surrender is not the same as saying AI is bad or that using AI is irrational … The key issue is calibration: knowing when AI is helping you think and when it is quietly doing the thinking for you.",
    source: "Steven Shaw, quoted in Addy Osmani’s “Cognitive Surrender”, May 2026",
    href: "https://addyosmani.com/blog/cognitive-surrender/",
    archiveHref: "https://web.archive.org/web/20260927123103/https://addyosmani.com/blog/cognitive-surrender/",
    why: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  },
  {
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.",
    source: "Lorem ipsum dolor",
    why: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  },
  {
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.",
    source: "Lorem ipsum dolor",
    why: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  },
];
