export type Project = {
  name: string;
  description: string;
  highlights?: string[];
  link?: { label: string; href: string };
};

/** A path under public/, for example /photos/paris.jpg. */
export type Photo = { src: string; alt: string };

export type Role = {
  title?: string;
  /** ISO date, YYYY-MM or YYYY-MM-DD. Only the month and year are shown. Leave out for an undated chapter. */
  start?: string;
  /** ISO date, YYYY-MM or YYYY-MM-DD. Leave out for something still going on. */
  end?: string;
  summary?: string;
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
        summary: "Leading the design of the next generation of creative ingestion across multiple marketplaces.",
        projects: [
          {
            name: "Multi-region ingestion",
            description:
              "Designed and led the rollout of ingestion to three new regions, cutting feed latency for European advertisers.",
            highlights: [
              "Wrote the high-level design and secured sign-off from four partner teams.",
              "Mentored two engineers through their first production launches.",
            ],
          },
          {
            name: "Ingestion observability",
            description:
              "Built per-feed dashboards and alarms so that a failed upload is detected in minutes rather than hours.",
          },
        ],
      },
      {
        title: "SDE 4",
        start: "2026-08-03",
        end: "2027-03-31",
        summary: "Working on the ingestion systems that power Amazon's pilots of dynamic creatives across the world.",
        projects: [
          {
            name: "Feed validation service",
            description:
              "Built a validation step that rejects malformed advertiser feeds before processing, with clear error reports for each row.",
            highlights: [
              "Reduced failed ingestion runs by 40% in the first month.",
              "Added load tests covering feeds of up to a million rows.",
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
          "Maintained the legacy systems used by thousands of businesses across the UK, spanning ICRTouch's wide range of interconnected software.",
        highlights: ["Delivered bespoke work for customers on request.", "Fixed bugs across the product range."],
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
        summary: "Took time off after university and my internship to travel through the Netherlands and France.",
        images: [
          {
            src: "/photos/travel-placeholder.svg",
            alt: "Placeholder illustration of a sunset over hills with the Eiffel Tower",
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
          "Built a TypeScript browser tool that automated product intake and delivery tracking, replacing an error-prone manual workflow.",
        highlights: [
          "Gathered requirements from non-technical stakeholders and wrote the design documents recommending the chosen approach.",
          "Led design reviews with peers and senior engineers to agree the approach.",
          "Added unit tests and CI/CD pipelines, and delivered a final presentation and live demo to engineers and managers.",
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
        summary: "Graduated with a strong First Class Honours, specialising in machine learning.",
        projects: [
          {
            name: "Dissertation: machine-learning anti-cheat",
            description:
              "Researched a novel anti-cheat for video games that runs locally, is non-invasive and performs well, using machine learning to detect anomalies in players' mouse movements.",
            link: { label: "Read the dissertation", href: "/dissertation.pdf" },
          },
        ],
        story: [
          "Placeholder: a few sentences on what you learnt at Bath beyond the degree itself.",
          "Placeholder: the experiences, people and moments that shaped your time there.",
        ],
        images: [
          { src: "/photos/bath-placeholder.svg", alt: "Placeholder illustration of the Royal Crescent in Bath" },
          { src: "/photos/bath-placeholder.svg", alt: "Placeholder illustration of the Royal Crescent in Bath" },
        ],
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
          "Placeholder: what you love about the Isle of Wight and what makes it special.",
          "Placeholder: how growing up there made you who you are today.",
        ],
        images: [
          {
            src: "/photos/isle-of-wight-placeholder.svg",
            alt: "Placeholder illustration of the Needles off the Isle of Wight",
          },
          {
            src: "/photos/isle-of-wight-placeholder.svg",
            alt: "Placeholder illustration of the Needles off the Isle of Wight",
          },
        ],
      },
    ],
  },
];
