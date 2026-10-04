export type Post = {
  slug: string;
  title: string;
  /** Short title for the side navigation. */
  navLabel: string;
  /** ISO date, YYYY-MM or YYYY-MM-DD. */
  date: string;
  summary: string;
  tags: string[];
  /** Whether AI tools helped write or build what the post describes. */
  madeWithAI: boolean;
  /** Hidden from the list while true. */
  draft?: boolean;
};

/** Most recent first. */
export const posts: Post[] = [
  {
    slug: "advanced-computer-graphics",
    navLabel: "Computer graphics",
    title: "Advanced computer graphics",
    date: "2024-10",
    summary:
      "Building the foundations of graphics in C++, from the matrix maths of projection to the optimisations behind ray tracing and photon mapping.",
    tags: ["C++", "Graphics"],
    madeWithAI: false,
  },
  {
    slug: "genetic-keyboard",
    navLabel: "Genetic keyboard",
    title: "The perfect keyboard: a genetic algorithm experiment",
    date: "2024-09",
    summary:
      "Evolving keyboard layouts for typing speed and comfort with a bespoke genetic algorithm, using frequency data from a 246,000-word corpus.",
    tags: ["Python", "Optimisation"],
    madeWithAI: false,
  },
  {
    slug: "society-matchmaker",
    navLabel: "Society Matchmaker",
    title: "Society Matchmaker",
    date: "2024-09",
    summary:
      "Leading an eight-person team to tackle low student engagement with university societies, from stakeholder interviews to a deployed React and Flask app.",
    tags: ["React", "Flask", "Teamwork"],
    madeWithAI: false,
  },
  {
    slug: "sudoku-solver",
    navLabel: "Sudoku solver",
    title: "Sudoku solver: speed and simplicity",
    date: "2024-09",
    summary: "An efficient solver that finds solutions to even the hardest puzzles in under 0.05 seconds.",
    tags: ["Python", "Algorithms"],
    madeWithAI: false,
  },
  {
    slug: "rubiks-cube-group-theory",
    navLabel: "Rubik's Cube",
    title: "Group theory and the Rubik's Cube",
    date: "2024-09",
    summary:
      "Applying group theory and a modified IDA* search to collapse a search space of 43 quintillion states.",
    tags: ["Python", "Maths"],
    madeWithAI: false,
    draft: true,
  },
];

export const publishedPosts = posts.filter((post) => !post.draft);
