export type Project = {
  name: string;
  description: string;
  highlights?: string[];
  link?: { label: string; href: string };
};

/** A path under public/, for example /photos/paris.jpg. */
export type Photo = {
  src: string;
  alt: string;
  /** Shown beneath the photo. */
  caption?: string;
};

export type Grade = { subject: string; grade: string };

export type Role = {
  title?: string;
  /** ISO date, YYYY-MM or YYYY-MM-DD. Only the month and year are shown. Leave out for an undated chapter. */
  start?: string;
  /** ISO date, YYYY-MM or YYYY-MM-DD. Leave out for something still going on. */
  end?: string;
  summary?: string;
  /** One line of small print, shown under the title in place of a summary. */
  note?: string;
  grades?: Grade[];
  highlights?: string[];
  projects?: Project[];
  /** Longer prose, one string per paragraph, shown after the projects. */
  story?: string[];
  images?: Photo[];
};

export type ChapterKind = "work" | "education" | "travel" | "home";

/** One continuous period: a job at one company, a degree, time away, or home. */
export type Chapter = {
  /** Anchor for links from the navigation, for example #university-of-bath. */
  id: string;
  /** Short label for the side navigation. */
  navLabel: string;
  kind: ChapterKind;
  name: string;
  location: string;
  /** Most recent first. */
  roles: Role[];
};

/** A chapter's anchor sits under the journey section, so its address reads /#journey/icrtouch. */
export function chapterAnchor(chapter: Chapter) {
  return `journey/${chapter.id}`;
}

/** Most recent chapter first. */
export const journey: Chapter[] = [
  {
    id: "amazon",
    navLabel: "Amazon",
    kind: "work",
    name: "Amazon",
    location: "Edinburgh, UK",
    roles: [
      {
        title: "SDE 5",
        start: "2027-04-01",
        summary: "Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt.",
        projects: [
          {
            name: "Multi-region ingestion",
            description:
              "Ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi.",
            highlights: [
              "Reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
              "Excepteur sint occaecat cupidatat non proident sunt in.",
            ],
          },
          {
            name: "Ingestion observability",
            description:
              "Ut aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit in voluptate velit esse cillum.",
          },
        ],
      },
      {
        title: "SDE 4",
        start: "2026-08-03",
        end: "2027-03-31",
        summary: "Dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt in culpa qui.",
        projects: [
          {
            name: "Feed validation service",
            description:
              "Officia deserunt mollit anim id est laborum lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod.",
            highlights: [
              "Culpa qui officia deserunt mollit anim id est laborum lorem.",
              "Ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor.",
            ],
          },
        ],
      },
    ],
  },
  {
    id: "icrtouch",
    navLabel: "ICRTouch",
    kind: "work",
    name: "ICRTouch",
    location: "Isle of Wight, UK",
    roles: [
      {
        title: "Software Developer",
        start: "2025-11",
        end: "2026-06-10",
        summary:
          "Tempor incididunt ut labore et dolore magna aliqua ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi.",
        highlights: ["Incididunt ut labore et dolore magna aliqua.", "Ut enim ad minim veniam quis."],
      },
    ],
  },
  {
    id: "travelling",
    navLabel: "Travelling",
    kind: "travel",
    name: "Travelling",
    location: "Netherlands and France",
    roles: [
      {
        start: "2025-09",
        end: "2025-10",
        summary: "Ut aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit in voluptate velit.",
        images: [
          {
            src: "/photos/travel-placeholder.svg",
            alt: "Esse cillum dolore eu fugiat nulla pariatur excepteur sint occaecat cupidatat.",
            caption: "Non proident sunt in culpa qui officia deserunt.",
          },
        ],
      },
    ],
  },
  {
    id: "amazon-internship",
    navLabel: "Internship",
    kind: "work",
    name: "Amazon",
    location: "Edinburgh Development Centre, UK",
    roles: [
      {
        title: "Software Development Engineer Intern",
        start: "2025-06-02",
        end: "2025-08-28",
        summary:
          "Mollit anim id est laborum lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor.",
        highlights: [
          "Nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure.",
          "Dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla.",
          "Pariatur excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum.",
        ],
      },
    ],
  },
  {
    id: "university-of-bath",
    navLabel: "University",
    kind: "education",
    name: "University of Bath",
    location: "Bath, UK",
    roles: [
      {
        title: "BSc (Hons) Computer Science and Mathematics",
        start: "2022-10",
        end: "2025-07",
        summary: "Graduated with First Class Honours. My highest module marks:",
        grades: [
          { subject: "Advanced Computer Graphics", grade: "92%" },
          { subject: "Principles of Programming 2", grade: "91%" },
          { subject: "Foundations of Computation", grade: "82%" },
        ],
        projects: [
          {
            name: "Dissertation: catching aimbots from the way a player moves their mouse",
            description:
              "Cheaters drive players away from games, and most anti-cheat hunts for the cheat program itself, which cheat developers keep getting around. Earlier attempts to catch aimbots from a player's aim needed labelled cheating data or large amounts of a player's history, and struggled with aimbots tuned to look human. I built a new anomaly-detection system in Python, an ensemble of one-class SVMs on angle-based mouse features from user-authentication research, which learns a player's honest aim in Counter-Strike 2 from a short sample of play and needs no examples of cheating. Over 14 kills it told cheating from honest aim with a ROC AUC of 0.99, including against an aimbot smoothed to look human. It was marked 75%, a First.",
            link: { label: "Read the dissertation", href: "/journey/university-of-bath/dissertation" },
          },
          {
            name: "A graphics engine in C++",
            description: "Rasterisation, projection, ray tracing and photon mapping, worked up from the matrix maths.",
            link: { label: "Read how I built it", href: "/stories/advanced-computer-graphics" },
          },
        ],
        story: [
          "I had planned a master's at Bath to test the system on far more players, but the course was restructured in a way that no longer fitted that research, so I graduated and joined Amazon. Not continuing it formally is my one real disappointment from Bath, and I'd still like to take it further.",
          "Alongside the course, Bath's sport drew me there. I'd always loved powerlifting, and the Isle of Wight had nowhere to take it further. I competed twice in the 83kg class, but the gym mattered more than the meets: it was where I made friends, switched off from work and kept fit. I think people underestimate their bodies. Many decide they are too old, too injured or not capable without ever giving their body the chance to adapt. I'd like to be an example of that, and to learn more about biomechanics so I can help people stay healthy.",
        ],
        images: [
          {
            src: "/photos/bath-placeholder.svg",
            alt: "Placeholder for a photo from graduation day.",
            caption: "Graduation day.",
          },
          {
            src: "/photos/bath-placeholder.svg",
            alt: "Placeholder for a photo of me lifting.",
            caption: "Competing in the 83kg class.",
          },
        ],
      },
    ],
  },
  {
    id: "christ-the-king-college",
    navLabel: "School",
    kind: "education",
    name: "Christ the King College",
    location: "Newport, Isle of Wight, UK",
    roles: [
      {
        title: "A-Levels",
        start: "2020-09",
        end: "2022-06",
        grades: [
          { subject: "Further Mathematics", grade: "A*" },
          { subject: "Mathematics", grade: "A*" },
          { subject: "Computer Science", grade: "A*" },
          { subject: "Extended Project", grade: "A*" },
          { subject: "Economics", grade: "B" },
        ],
        projects: [
          {
            name: "Extended Project: what makes an education system work?",
            description:
              "An independent research essay, “Education in England: optimising the system from a student's perspective”, awarded an A*. It weighs the research on school governance, teacher pay and the curriculum against how England runs its schools, written by someone sitting in its classrooms.",
            highlights: [
              "Wrote to the maths teacher and YouTuber Eddie Woo, who replied with a video on what engaging teaching looks like.",
              "Drew on interviews, Department for Education statistics, OECD research and National Education Union surveys.",
            ],
          },
          {
            name: "Computer Science coursework: a Rubik's Cube solver",
            description:
              "For my A-Level project I wrote a program that solves any scrambled Rubik's Cube in under a second. It uses Herbert Kociemba's two-phase algorithm, which searches the cube's 43 quintillion states for a solution of typically 20 moves or fewer. That is close to the shortest possible: in 2010 it took 35 CPU-years of Google's computers to prove that no position needs more than 20. I learned the group theory the algorithm is built on from maths books and Kociemba's own explanations.",
          },
        ],
      },
      {
        title: "GCSEs",
        start: "2015-09",
        end: "2020-06",
        note: "Eleven GCSEs, with eight 9s (Mathematics, Computer Science, Biology, Chemistry, Physics, English Language, English Literature, and Design and Technology) and two 8s.",
      },
    ],
  },
  {
    id: "home",
    navLabel: "Isle of Wight",
    kind: "home",
    name: "Home",
    location: "Isle of Wight, UK",
    roles: [
      {
        story: [
          "Nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure.",
          "Dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat.",
        ],
        images: [
          {
            src: "/photos/isle-of-wight-placeholder.svg",
            alt: "Elit sed do eiusmod tempor incididunt ut labore et dolore.",
            caption: "Magna aliqua ut enim ad minim veniam quis.",
          },
          {
            src: "/photos/isle-of-wight-placeholder.svg",
            alt: "Nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo.",
            caption: "Consequat duis aute irure dolor in.",
          },
        ],
      },
    ],
  },
];
