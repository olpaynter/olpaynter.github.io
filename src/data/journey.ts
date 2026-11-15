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
        title: "Software Development Engineer (L4)",
        start: "2026-08-03",
        summary: "I returned to the Amazon team I had interned with, this time as a full-time engineer.",
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
          "ICRTouch is one of the UK's leading EPOS providers, with over 180,000 installs and partners around the world, and its office was a few minutes down the road from home. I worked on the reporting and on TouchOffice Web, the cloud back office for its tills, and the APIs behind it.",
        projects: [
          {
            name: "Custom reporting",
            description:
              "Customers and partners often needed reports that the standard product did not cover, and I built many of them as large SQL queries over a long-established data model. Making them run quickly was how I learned that data model.",
          },
          {
            name: "Automated testing for the TouchOffice Web API",
            description:
              "With about 14 developers in one team, I had to choose carefully what to push for: what would help the customer, what would help us help the customer, and whether it was really the priority at the time. Automated testing met that bar. A payments integration and framework updates were about to touch a lot of the code, and tests would let the team make those changes with more confidence. I put that to the team and the leadership, and asked the people who knew the system best which areas the coming work would affect most, so the first coverage went there. I built the framework with Playwright and Docker so that other projects could adopt it easily, and wrote a guide so the team could start writing tests first. It is still in use.",
          },
        ],
        story: [
          "Working in a team of that size also meant I could take an idea straight to the leadership and discuss it, and there was room to change direction, provided I picked the right things to pursue and then saw them through.",
        ],
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
    location: "Edinburgh, UK",
    roles: [
      {
        title: "Software Development Engineer Intern (L4)",
        start: "2025-06-02",
        end: "2025-08-29",
        summary:
          "I spent the summer on one problem: a group of senior program managers were keeping track of incoming product work and its delivery by hand.",
        projects: [
          {
            name: "Automating product intake and delivery tracking",
            description:
              "I interviewed the managers about how they worked, then wrote the design and defended it in reviews with senior engineers. I built it as a TypeScript browser tool that copies issues from the internal tracker into an external documents platform, on demand or on a timer, and it went out through an automated deployment pipeline, with tests covering 99% of its lines, before I demonstrated it to engineers and managers.",
          },
        ],
        story: [
          "My end-of-internship feedback picked out initiative on an open-ended problem and the trust I earned with the people I was building for. I finished with a full-time return offer without a fixed start date, so after some time travelling I looked for more experience in the meantime, which took me to ICRTouch.",
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
        summary: "I graduated with First Class Honours. These were my highest module marks:",
        grades: [
          { subject: "Advanced Computer Graphics", grade: "92%" },
          { subject: "Principles of Programming 2", grade: "91%" },
          { subject: "Foundations of Computation", grade: "82%" },
        ],
        projects: [
          {
            name: "Dissertation: catching aimbots from the way a player moves their mouse",
            description:
              "Cheaters drive players away from games, and most anti-cheat hunts for the cheat program itself, which cheat developers keep getting around. Earlier attempts to catch aimbots from a player's aim needed labelled cheating data or large amounts of a player's history, and struggled with aimbots tuned to look human. I built a new anomaly-detection system in Python, an ensemble of one-class SVMs on angle-based mouse features from user-authentication research, which learns a player's honest aim in Counter-Strike 2 from a short sample of play and never needs to see a cheater. Over 14 kills it told cheating from honest aim with a ROC AUC of 0.99, including against an aimbot smoothed to look human. It was marked 75%, a First.",
            link: { label: "Read the dissertation", href: "/journey/university-of-bath/dissertation" },
          },
          {
            name: "A graphics engine in C++",
            description:
              "It covers rasterisation, projection, ray tracing and photon mapping, worked up from the matrix maths.",
            link: { label: "Read how I built it", href: "/stories/advanced-computer-graphics" },
          },
        ],
        story: [
          "I had planned a master's at Bath to test the system on far more players, but the course was restructured in a way that no longer fitted that research, so I graduated and went into work instead. Not continuing it formally is my one real disappointment from Bath, and I would still like to take it further.",
          "Alongside the course, Bath's sport drew me there. I had always loved powerlifting, and the Isle of Wight had nowhere to take it further. I competed twice in the 83kg class, but the gym mattered more than the meets: it was where I made friends, switched off from work and kept fit. I think people underestimate their bodies. Many decide they are too old, too injured or not capable without ever giving their bodies the chance to adapt. I would like to be an example of what a body can do when it is given that chance, and to learn more about biomechanics so I can help people stay healthy.",
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
        note: "Ten GCSEs, with eight 9s (Mathematics, Computer Science, Biology, Chemistry, Physics, English Language, English Literature, and Design and Technology) and two 8s.",
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
