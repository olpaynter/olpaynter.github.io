import type { CSSProperties } from "react";

/**
 * Each shape is a stroked outline in `public/shapes/`, used as a CSS mask over a block of the
 * theme's `--shape` colour. The browser decodes each file once and reuses it for every copy, and an
 * outline is a single element rather than an inline SVG tree. The Isle of Wight is drawn from its
 * OpenStreetMap coastline (relation 3955402), simplified and smoothed.
 */
const SHAPES = {
  island: { aspect: 208 / 129 },
  snowboard: { aspect: 200 / 60 },
  mountain: { aspect: 240 / 130 },
  castle: { aspect: 240 / 142 },
  barbell: { aspect: 240 / 90 },
} as const;

type ShapeName = keyof typeof SHAPES;

const SHAPE_NAMES = Object.keys(SHAPES) as ShapeName[];

/** Outlines per side of the column. */
const PER_SIDE = 16;

/** Two outlines of the same shape are kept at least this far apart, as a percentage of page height. */
const SAME_SHAPE_GAP = 12;

/** The same seed gives the same layout on every build, so the outlines do not move between visits. */
const SEED = 20251004;

type Outline = {
  shape: ShapeName;
  side: "left" | "right";
  /** Position across the side margin: 0 at the outer edge, 1 next to the column. */
  x: number;
  top: number;
  width: number;
  rotate: number;
  delay: number;
  duration: number;
  drift: [number, number];
};

function mulberry32(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function layout(): Outline[] {
  const random = mulberry32(SEED);
  const between = (low: number, high: number) => low + random() * (high - low);
  // A drift component between 0.4 and 1 in either direction, so every outline visibly moves.
  const drift = () => (random() < 0.5 ? -1 : 1) * between(0.4, 1);

  const outlines: Outline[] = [];
  for (const side of ["left", "right"] as const) {
    // Even slots down the page, each nudged a little, so coverage is even without looking gridded.
    const slot = 100 / PER_SIDE;
    for (let i = 0; i < PER_SIDE; i++) {
      const top = Math.min(97, Math.max(1, (i + 0.5) * slot + between(-0.35, 0.35) * slot));
      outlines.push({
        shape: "island",
        side,
        x: between(0.05, 0.95),
        top,
        width: between(70, 160),
        rotate: between(-30, 30),
        delay: -between(0, 30),
        duration: between(18, 30),
        drift: [drift(), drift()],
      });
    }
  }

  // Shapes are assigned down the page, avoiding any shape already used nearby on either side.
  outlines.sort((a, b) => a.top - b.top);
  for (const [index, outline] of outlines.entries()) {
    const nearby = new Set(
      outlines.slice(0, index).flatMap((other) => (outline.top - other.top < SAME_SHAPE_GAP ? [other.shape] : [])),
    );
    const allowed = SHAPE_NAMES.filter((name) => !nearby.has(name));
    const pool = allowed.length > 0 ? allowed : SHAPE_NAMES;
    outline.shape = pool[Math.floor(random() * pool.length)];
  }
  return outlines;
}

const OUTLINES = layout();

/** Decorative outlines in the side margins. Hidden below lg, where there are no margins to fill. */
export function IslandBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 hidden overflow-hidden lg:block">
      {OUTLINES.map((outline, i) => {
        // Never wider than the margin, so an outline cannot reach into the content column.
        const width = `min(${(outline.width / 16).toFixed(3)}rem, calc(50% - 24rem - 1rem))`;
        const style = {
          top: `${outline.top.toFixed(2)}%`,
          width,
          aspectRatio: SHAPES[outline.shape].aspect,
          [outline.side]: `calc((50% - 24rem - ${width}) * ${outline.x.toFixed(3)})`,
          maskImage: `url(/shapes/${outline.shape}.svg)`,
          "--float-rotate": `${outline.rotate.toFixed(1)}deg`,
          "--dx": outline.drift[0].toFixed(2),
          "--dy": outline.drift[1].toFixed(2),
          animationDelay: `${outline.delay.toFixed(1)}s`,
          animationDuration: `${outline.duration.toFixed(1)}s`,
        } as CSSProperties;
        return (
          <span
            key={i}
            className="float-shape absolute bg-(--shape) [mask-size:contain] [mask-repeat:no-repeat] opacity-[0.14]"
            style={style}
          />
        );
      })}
    </div>
  );
}
