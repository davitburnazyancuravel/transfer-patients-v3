import type { CSSProperties } from "react";

import { BrandMark } from "@/components/BrandMark";
import { ArrowRight } from "@/components/ui/icons";
import { PARTNERS, SITE } from "@/lib/content";

/* ============================================================
   Partners — the integration constellation.

   A centred head, then one diagram that makes the whole argument:
   the brand orb dead centre, twenty-four small white chips fanned
   out in two mirrored four-by-three grids, and six dotted wires
   running from the orb out through every row to the frame edge.
   The eight chips nearest the orb carry the PARTNERS.spokes
   captions, so the picture names the systems it plugs into rather
   than gesturing at them.

   The diagram is one image: the figure takes role="img" with a
   label composed from the content module, and everything inside it
   is hidden. That is also why the internals are plain divs — there
   is no structure here worth spelling out twice.

   Server component. The entrance rides the shared observer on the
   section root and the dash flow is pure CSS, so nothing reaches
   the client.
   ============================================================ */

/** Lets a style prop carry the reveal stagger index without a cast to any. */
type Staggered = CSSProperties & Record<"--i", string>;
const step = (i: number): Staggered => ({ "--i": String(i) });

/* ------------------------------------------------------------
   Glyphs.

   Twelve line-art marks on a shared 24×24 canvas, each a single
   path so the chip can draw them all at one weight from CSS. They
   are decoration inside a labelled figure, so none of them is
   exposed on its own.
   ------------------------------------------------------------ */

type GlyphKey =
  | "hospital"
  | "ambulance"
  | "helicopter"
  | "clipboard"
  | "phone"
  | "calendar"
  | "shield"
  | "bed"
  | "pulse"
  | "plane"
  | "document"
  | "plug";

const GLYPHS: Record<GlyphKey, string> = {
  hospital: "M5 19.6V8h14v11.6M4 19.6h16M12 10.6v4M10 12.6h4M9.4 19.6v-4.2h5.2v4.2",
  ambulance:
    "M3 15.6V8h10.2v7.6M13.2 10.8h3.2l2.6 3v1.8M3 15.6h1.6M10.2 15.6h4.4M6 11.4h3.6M7.8 9.6v3.6M5.9 15.6a1.5 1.5 0 1 0 3 0 1.5 1.5 0 1 0-3 0M17.6 15.6a1.5 1.5 0 1 0 3 0 1.5 1.5 0 1 0-3 0",
  helicopter:
    "M7.8 9.2h4.6a4 4 0 0 1 4 4v1.2H7.8a2.6 2.6 0 0 1 0-5.2ZM4.4 6.6h15.2M12 6.6v2.6M16.4 11.4H21M20.4 9.8v3.2M6.8 16.6h10.4M8.8 14.4v2.2M15.2 14.4v2.2",
  clipboard:
    "M9 4.4h6v2.6H9ZM8.6 5.7H6.7A1.7 1.7 0 0 0 5 7.4v11a1.7 1.7 0 0 0 1.7 1.7h10.6a1.7 1.7 0 0 0 1.7-1.7v-11a1.7 1.7 0 0 0-1.7-1.7h-1.9M8.4 11.6h7.2M8.4 14.8h7.2M8.4 18h4.4",
  phone:
    "M6.6 4.8h2.7l1.5 3.6-2 1.3a10.4 10.4 0 0 0 5.5 5.5l1.3-2 3.6 1.5v2.7a1.7 1.7 0 0 1-1.7 1.7A14.2 14.2 0 0 1 4.9 6.5a1.7 1.7 0 0 1 1.7-1.7Z",
  calendar:
    "M5 6.6h14a2 2 0 0 1 2 2v9.8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8.6a2 2 0 0 1 2-2ZM3 11.2h18M8 4v3.4M16 4v3.4",
  shield:
    "M12 3.6 4.6 6.4v5.4c0 4.3 3 7.5 7.4 8.6 4.4-1.1 7.4-4.3 7.4-8.6V6.4L12 3.6Zm-2.8 8.4 2 2 3.6-4",
  bed: "M3.2 19.2V9.6M3.2 14.2h12a4.6 4.6 0 0 1 4.6 4.6v.4M3.2 16.8h16.6M7.2 10.8a1.8 1.8 0 1 0 3.6 0 1.8 1.8 0 1 0-3.6 0M11.2 14.2v-1.6h3.2",
  pulse: "M3 12h3.4l1.8-5 3 10 2.4-6.4L16 12h5",
  plane: "M20.6 3.4 3.4 10.6l6.6 2.8 2.8 6.6 7.8-16.6ZM10 13.4l4.6-4.6",
  document:
    "M13.6 3.6H7.4a2 2 0 0 0-2 2v12.8a2 2 0 0 0 2 2h9.2a2 2 0 0 0 2-2V8.6l-5-5ZM13.4 3.8v4.6h4.8M8.8 13h6.4M8.8 16.2h4.4",
  plug: "M9 3.6v4M15 3.6v4M6.6 7.6h10.8v3.2a5.4 5.4 0 0 1-10.8 0V7.6ZM12 16.2v4.2",
};

function Chip({ glyph }: { glyph: GlyphKey }) {
  return (
    <span className="pt__chip">
      <svg className="pt__glyph" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <path d={GLYPHS[glyph]} />
      </svg>
    </span>
  );
}

/* ------------------------------------------------------------
   The two grids.

   Each side is three rows of four, written from the orb outwards,
   so `c === 0` is always the chip closest to the centre. The four
   slots carrying a spoke index are, by plain geometry, that side's
   four nearest: the whole inner column, plus the middle chip of
   the second column — which sits closer to the orb than the inner
   column's top and bottom corners do.

   Every side uses all twelve glyphs exactly once, so the two grids
   mirror each other in texture without repeating a mark.
   ------------------------------------------------------------ */

type Slot = {
  readonly glyph: GlyphKey;
  /** Index into PARTNERS.spokes when this chip is one of the labelled eight. */
  readonly spoke?: number;
};

type Grid = readonly (readonly Slot[])[];

const LEFT: Grid = [
  [{ glyph: "bed", spoke: 1 }, { glyph: "phone" }, { glyph: "plane" }, { glyph: "plug" }],
  [
    { glyph: "hospital", spoke: 0 },
    { glyph: "shield", spoke: 3 },
    { glyph: "calendar" },
    { glyph: "document" },
  ],
  [{ glyph: "clipboard", spoke: 2 }, { glyph: "ambulance" }, { glyph: "pulse" }, { glyph: "helicopter" }],
];

const RIGHT: Grid = [
  [{ glyph: "pulse", spoke: 5 }, { glyph: "phone" }, { glyph: "document" }, { glyph: "plug" }],
  [
    { glyph: "helicopter", spoke: 4 },
    { glyph: "ambulance", spoke: 7 },
    { glyph: "hospital" },
    { glyph: "plane" },
  ],
  [{ glyph: "calendar", spoke: 6 }, { glyph: "bed" }, { glyph: "clipboard" }, { glyph: "shield" }],
];

/* Below 880px the grids go away and the spokes carry the diagram on
   their own, so the narrow layout is derived from the same two
   sources rather than restated. */
type Labelled = Slot & { readonly spoke: number };

const LABELLED: readonly Labelled[] = [...LEFT, ...RIGHT]
  .flat()
  .filter((slot): slot is Labelled => slot.spoke !== undefined)
  .sort((a, b) => a.spoke - b.spoke);

/* ------------------------------------------------------------
   The wires.

   Six paths on a 1000×400 field that the CSS stretches to the
   figure box. All six start behind the orb at the centre and run
   outward, which is what lets one dash-offset keyframe drive the
   flow in both directions.

   The rows sit at a sixth, a half and five sixths of the height —
   exactly where three equal grid rows centre their chips — and each
   fan finishes bending by x = 620 / 380, comfortably inside the
   innermost chip at every width this layout is used at.
   ------------------------------------------------------------ */

const WIRES: readonly string[] = [
  "M500 200H1000",
  "M500 200C548 200 562 66.7 620 66.7H1000",
  "M500 200C548 200 562 333.3 620 333.3H1000",
  "M500 200H0",
  "M500 200C452 200 438 66.7 380 66.7H0",
  "M500 200C452 200 438 333.3 380 333.3H0",
];

/* The figure's accessible name. lib/content.ts has no key for it, so
   it is composed from the strings that are already there rather than
   invented here — see the note in the hand-off. */
const FIGURE_LABEL = `${SITE.name} — ${PARTNERS.title.join(" ")}: ${PARTNERS.spokes.join(", ")}.`;

function Side({ side, rows }: { side: "l" | "r"; rows: Grid }) {
  return (
    <div className={`pt__side pt__side--${side}`} aria-hidden="true">
      {rows.map((row, r) => (
        /* Static, never reordered — the row index is a stable key. */
        <div className="pt__row" key={r}>
          {row.map((slot, c) => (
            <span
              className="pt__slot rv rv--pop"
              key={slot.glyph}
              /* Outermost column lands first and the wave travels in. */
              style={step(4 + (3 - c))}
            >
              <Chip glyph={slot.glyph} />
              {slot.spoke !== undefined ? (
                <span className="pt__cap">{PARTNERS.spokes[slot.spoke]}</span>
              ) : null}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

export function Partners() {
  return (
    <section
      id="partners"
      className="section section--panel pt"
      aria-labelledby="partners-title"
      data-rv
    >
      <div className="wrap">
        <div className="sec-head pt__head">
          <span className="eyebrow rv rv--fade" style={step(0)}>
            <span className="eyebrow__mark">
              <BrandMark />
            </span>
            <span className="eyebrow__label">{PARTNERS.eyebrow}</span>
          </span>

          {/* First line muted, second ink — the house split heading. */}
          <h2 className="h2 pt__title" id="partners-title">
            {PARTNERS.title.map((line, i) => (
              <span className="line-rise" key={line} style={step(i)}>
                <span>{i === 0 ? line : <strong>{line}</strong>}</span>
              </span>
            ))}
          </h2>

          <p className="lede lede--center rv rv--sm" style={step(2)}>
            {PARTNERS.lede}
          </p>

          <a className="btn btn--primary rv rv--sm" style={step(3)} href={PARTNERS.cta.href}>
            {PARTNERS.cta.label}
            <span className="btn__arrow" aria-hidden="true">
              <ArrowRight />
            </span>
          </a>
        </div>

        <div className="pt__figure" role="img" aria-label={FIGURE_LABEL}>
          <span className="bloom pt__bloom" aria-hidden="true" />

          <svg
            className="pt__wires rv rv--fade"
            style={step(7)}
            viewBox="0 0 1000 400"
            preserveAspectRatio="none"
            aria-hidden="true"
            focusable="false"
          >
            {WIRES.map((d) => (
              <path className="pt__wire" key={d} d={d} vectorEffect="non-scaling-stroke" />
            ))}
          </svg>

          <Side side="l" rows={LEFT} />

          <div className="pt__hub" aria-hidden="true">
            <div className="pt__orb rv rv--pop" style={step(9)}>
              <BrandMark />
            </div>
            {/* Narrow layouts only: the one wire left once the grids go. */}
            <span className="pt__stem" />
          </div>

          <Side side="r" rows={RIGHT} />

          {/* The narrow-screen reading of the same diagram. */}
          <div className="pt__spokes" aria-hidden="true">
            {LABELLED.map((slot) => (
              <div className="pt__spoke rv rv--sm" key={slot.spoke} style={step(4 + slot.spoke)}>
                <Chip glyph={slot.glyph} />
                <span className="pt__spokeLabel">{PARTNERS.spokes[slot.spoke]}</span>
              </div>
            ))}
          </div>
        </div>

        <ul className="pt__facts">
          {PARTNERS.facts.map((fact, i) => (
            <li className="pt__fact rv rv--sm" key={fact.label} style={step(10 + i)}>
              <span className="pt__factLabel">{fact.label}</span>
              <span className="pt__factValue">{fact.value}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
