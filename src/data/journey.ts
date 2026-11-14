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
        start: "2022-09",
        end: "2025-05",
        summary: "Incididunt ut labore et dolore magna aliqua ut enim ad minim.",
        projects: [
          {
            name: "Dissertation: machine-learning anti-cheat",
            description:
              "Veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.",
            link: { label: "Read the dissertation", href: "/journey/university-of-bath/dissertation" },
          },
        ],
        story: [
          "Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut.",
          "Labore et dolore magna aliqua ut enim ad minim veniam quis.",
        ],
        images: [
          {
            src: "/photos/bath-placeholder.svg",
            alt: "Eu fugiat nulla pariatur excepteur sint occaecat cupidatat.",
            caption: "Non proident sunt in culpa qui officia deserunt.",
          },
          {
            src: "/photos/bath-placeholder.svg",
            alt: "Mollit anim id est laborum lorem ipsum dolor.",
            caption: "Sit amet consectetur adipiscing.",
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
