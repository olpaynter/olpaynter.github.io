import type { CSSProperties, ReactNode } from "react";

// Isle of Wight coastline from OpenStreetMap (relation 3955402), simplified and smoothed.
const COAST = "M0.0 66.9C3.9 67.3 19.0 61.5 25.0 60.9C31.0 60.3 31.8 60.4 36.0 63.2C40.2 65.9 45.2 74.1 50.1 77.4C55.0 80.7 61.4 81.4 65.3 83.1C69.1 84.8 70.1 85.1 73.2 87.7C76.4 90.3 80.8 96.0 84.1 98.7C87.5 101.3 90.2 101.5 93.1 103.6C95.9 105.7 99.3 108.7 101.4 111.3C103.5 113.9 104.1 117.4 105.6 119.0C107.1 120.5 106.7 120.9 110.5 120.6C114.4 120.2 122.9 118.7 128.6 116.8C134.3 114.9 140.1 111.0 144.6 109.1C149.1 107.3 153.2 107.9 155.7 105.5C158.1 103.2 158.8 97.7 159.3 95.1C159.8 92.4 157.8 93.1 158.6 89.6C159.4 86.0 161.4 77.7 164.2 73.7C167.1 69.7 171.6 67.2 175.7 65.6C179.8 63.9 186.5 64.8 188.9 63.9C191.2 63.1 187.9 62.5 189.7 60.3C191.6 58.0 199.1 53.0 200.0 50.6C200.9 48.1 196.8 46.4 195.0 45.6C193.3 44.8 191.4 48.6 189.6 45.8C187.8 42.9 188.3 32.7 184.2 28.6C180.2 24.5 170.7 22.3 165.3 21.2C159.8 20.0 155.4 21.8 151.5 21.7C147.5 21.5 142.9 20.9 141.5 20.3C140.0 19.8 144.3 19.1 142.9 18.3C141.5 17.6 136.1 17.9 133.0 15.6C129.9 13.3 127.0 7.0 124.4 4.5C121.8 2.0 119.9 0.8 117.5 0.7C115.2 0.5 112.7 3.6 110.3 3.5C107.9 3.4 106.3 -1.0 103.2 0.0C100.2 1.0 94.4 6.3 91.8 9.3C89.2 12.2 91.5 15.1 87.6 17.6C83.6 20.2 70.1 23.0 68.1 24.7C66.0 26.4 74.5 27.0 75.2 28.0C75.8 29.1 74.4 30.0 72.1 31.0C69.8 32.0 62.8 34.7 61.5 34.0C60.3 33.4 65.0 28.8 64.6 27.3C64.1 25.9 62.8 23.9 59.0 25.4C55.1 26.9 45.5 34.1 41.4 36.2C37.4 38.3 38.1 37.7 34.6 38.0C31.2 38.2 23.8 37.1 20.7 37.7C17.5 38.3 16.5 40.2 15.7 41.7C14.9 43.2 16.7 44.3 15.8 46.6C14.9 48.9 12.7 53.7 10.4 55.7C8.0 57.7 3.6 56.8 1.8 58.7C0.1 60.6 -3.9 66.6 0.0 66.9Z";

type ShapeName = "island" | "snowboard" | "mountain" | "castle" | "barbell";

const SHAPES: Record<ShapeName, { viewBox: string; body: ReactNode }> = {
  island: { viewBox: "-4 -4 208 129", body: <path d={COAST} /> },
  snowboard: {
    viewBox: "0 0 200 60",
    body: (
      <>
        <path d="M18 30C18 13 30 9 48 11C80 15 120 15 152 11C170 9 182 13 182 30C182 47 170 51 152 49C120 45 80 45 48 49C30 51 18 47 18 30Z" />
        <rect x="62" y="21" width="16" height="18" rx="3" />
        <rect x="122" y="21" width="16" height="18" rx="3" />
      </>
    ),
  },
  // An Alpine range with the Matterhorn as its central peak.
  mountain: {
    viewBox: "0 0 240 130",
    body: (
      <>
        <path d="M4 126L40 84L54 92L78 62L94 76L106 52L118 22L125 6L132 10L137 26L150 48L162 44L178 70L196 56L216 82L236 126" />
        <path d="M71 71L75 68L79 72L84 68L88 71" />
        <path d="M110 44L117 49L124 41L131 48L141 42" />
        <path d="M189 65L193 62L197 66L201 62L206 66" />
        <path d="M12 120C40 110 68 106 98 112C130 118 168 104 224 112" />
      </>
    ),
  },
  // Edinburgh Castle on Castle Rock, with the Half Moon Battery on the left.
  castle: {
    viewBox: "0 -12 240 142",
    body: (
      <>
        <path d="M4 126C24 118 38 108 48 98C54 90 60 80 64 66C64 50 74 42 90 42V36H95V42H100V36H105V42H110V24L118 14L126 24V10H131V2H136V10H141V24H156V30L164 20L172 30H184V40H194L198 54L202 66L206 78L214 82L218 94C224 106 230 118 236 126" />
        <path d="M133.5 2V-9L141 -6L133.5 -3" />
      </>
    ),
  },
  barbell: {
    viewBox: "0 0 240 90",
    body: (
      <>
        <path d="M72 45H168" />
        <rect x="4" y="41" width="18" height="8" rx="2" />
        <rect x="218" y="41" width="18" height="8" rx="2" />
        <rect x="22" y="37" width="6" height="16" rx="1.5" />
        <rect x="212" y="37" width="6" height="16" rx="1.5" />
        <rect x="29" y="26" width="8" height="38" rx="2" />
        <rect x="203" y="26" width="8" height="38" rx="2" />
        <rect x="38" y="14" width="10" height="62" rx="3" />
        <rect x="192" y="14" width="10" height="62" rx="3" />
        <rect x="49" y="6" width="14" height="78" rx="3" />
        <rect x="177" y="6" width="14" height="78" rx="3" />
        <rect x="64" y="35" width="8" height="20" rx="2" />
        <rect x="168" y="35" width="8" height="20" rx="2" />
      </>
    ),
  },
};

type Item = {
  shape: ShapeName;
  side: "left" | "right";
  /** Position across the side margin: 0 at the outer edge, 1 next to the column. */
  x: number;
  top: string;
  width: number;
  rotate: number;
  /** Seconds; negative so each item starts part-way through its cycle. */
  delay: number;
  duration: number;
  /** Drift direction, each between -1 and 1, so items wander different ways. */
  drift: [number, number];
};

const ITEMS: Item[] = [
  { shape: "island", side: "left", x: 0.35, top: "5%", width: 120, rotate: -8, delay: 0, duration: 22, drift: [1, -1] },
  { shape: "mountain", side: "right", x: 0.5, top: "9%", width: 140, rotate: 4, delay: -7, duration: 26, drift: [-1, 0.6] },
  { shape: "snowboard", side: "left", x: 0.65, top: "21%", width: 110, rotate: -24, delay: -12, duration: 19, drift: [0.4, 1] },
  { shape: "island", side: "right", x: 0.3, top: "30%", width: 140, rotate: -14, delay: -3, duration: 24, drift: [-0.8, -1] },
  { shape: "castle", side: "left", x: 0.3, top: "40%", width: 150, rotate: 2, delay: -9, duration: 28, drift: [1, 0.3] },
  { shape: "barbell", side: "right", x: 0.6, top: "50%", width: 110, rotate: 16, delay: -15, duration: 21, drift: [-0.5, 1] },
  { shape: "island", side: "left", x: 0.55, top: "60%", width: 95, rotate: 18, delay: -5, duration: 20, drift: [0.9, 0.8] },
  { shape: "mountain", side: "right", x: 0.35, top: "70%", width: 150, rotate: -5, delay: -11, duration: 25, drift: [-1, -0.4] },
  { shape: "barbell", side: "left", x: 0.3, top: "81%", width: 100, rotate: -12, delay: -2, duration: 23, drift: [0.3, -1] },
  { shape: "island", side: "right", x: 0.55, top: "90%", width: 115, rotate: 8, delay: -14, duration: 27, drift: [-0.7, 0.9] },
  { shape: "snowboard", side: "right", x: 0.2, top: "22%", width: 95, rotate: 28, delay: -4, duration: 24, drift: [0.6, -0.8] },
  { shape: "island", side: "left", x: 0.15, top: "33%", width: 85, rotate: -16, delay: -10, duration: 21, drift: [-0.6, -0.7] },
  { shape: "castle", side: "right", x: 0.45, top: "80%", width: 125, rotate: -3, delay: -16, duration: 27, drift: [0.8, 0.5] },
];

/** Decorative outlines in the side margins. Hidden below lg, where there are no margins to fill. */
export function IslandBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 hidden overflow-hidden lg:block">
      {ITEMS.map((item, i) => {
        const { viewBox, body } = SHAPES[item.shape];
        const style = {
          top: item.top,
          width: item.width,
          [item.side]: `calc((50% - 24rem - ${item.width}px) * ${item.x})`,
          "--float-rotate": `${item.rotate}deg`,
          "--dx": item.drift[0],
          "--dy": item.drift[1],
          animationDelay: `${item.delay}s`,
          animationDuration: `${item.duration}s`,
        } as CSSProperties;
        return (
          <svg key={i} viewBox={viewBox} className="float-shape absolute text-(--shape) opacity-[0.14]" style={style}>
            <g fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke">
              {body}
            </g>
          </svg>
        );
      })}
    </div>
  );
}
