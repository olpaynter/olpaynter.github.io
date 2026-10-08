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
    why: "Between the end of my internship and the start of my full-time role at Amazon, the way software gets written changed a great deal. AI has not lowered my bar for quality; if anything, it lets me iterate towards that bar faster than I could before. The cost is that it becomes easy to forget how to do the work yourself. Some see that as no more worrying than no longer writing assembly, but I want to keep the skill, because it deepens my understanding of the field, so each week I spend time on a task that does not affect delivery and do it the old-fashioned way. When I work with agents, I set them up so that I drive the work and nothing moves on without me. Autonomous development has its place, but for systems that customers rely on and that carry my name, I read and verify the code and the claims an agent makes before I stand behind them.",
  },
  {
    text: "Something you read or heard that stays with you.",
    source: "Where it came from",
    why: "A sentence or two on why it matters to you day to day.",
  },
  {
    text: "Something you read or heard that stays with you.",
    source: "Where it came from",
    why: "A sentence or two on why it matters to you day to day.",
  },
];
