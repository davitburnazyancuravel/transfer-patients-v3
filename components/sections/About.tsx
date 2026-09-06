import type { ComponentType, CSSProperties } from "react";

import { BrandMark } from "@/components/BrandMark";
import { ArrowRight, Check, Plus, Users } from "@/components/ui/icons";
import { ABOUT, CREW } from "@/lib/content";

/* ============================================================
   About — the bento.

   Four tinted tiles separated by a hairline gutter of page ground
   so they read as one block cut into quarters, with the brand orb
   resting on the crossing. Each tile carries a small line-art
   diagram of the promise it makes: a monitoring trace, a kit plan,
   a named clinician between two bedsides, a record that travels.
   The diagrams are decoration — every one is hidden from AT.
   ============================================================ */

/** Lets a style prop carry the reveal stagger index without a cast to any. */
type Staggered = CSSProperties & Record<"--i", string>;
const step = (i: number): Staggered => ({ "--i": String(i) });

type CellKey = (typeof ABOUT.cells)[number]["key"];

/* Which corner of the block each tile owns, in source order. */
const CORNERS = ["tl", "tr", "bl", "br"] as const;

/* ------------------------------------------------------------
   Diagrams. All share a 320×140 canvas so the four tiles settle
   at the same height, and all colour themselves from the --c /
   --c-wash pair the tile's data-accent exposes.
   ------------------------------------------------------------ */

/** Continuous supervision — a trace that never breaks. */
function TraceDiagram() {
  return (
    <svg
      className="about-dia"
      viewBox="0 0 320 140"
      width="320"
      height="140"
      aria-hidden="true"
      focusable="false"
    >
      <rect className="about-dia__panel" x="8" y="10" width="304" height="120" rx="16" />

      <g className="about-dia__grid">
        <path d="M24 54h272M24 114h272" />
        <path d="M80 48v72M136 48v72M192 48v72M248 48v72" strokeDasharray="2 6" />
      </g>

      <path className="about-dia__base" d="M24 84h272" />

      {/* Three complete cardiac cycles, unbroken from edge to edge. */}
      <path
        className="about-dia__line"
        d="M24 84H58l5-6 4 10 5-30 5 42 5-22 4 6H130l5-6 4 10 5-30 5 42 5-22 4 6H236l5-6 4 10 5-30 5 42 5-22 4 6H296"
      />

      <circle className="about-dia__halo" cx="296" cy="84" r="9" />
      <circle className="about-dia__fill" cx="296" cy="84" r="3.6" />

      {/* Readout chip — the vitals the crew watches all the way. */}
      <rect className="about-dia__chip" x="22" y="20" width="104" height="26" rx="13" />
      <circle className="about-dia__fill" cx="38" cy="33" r="4.5" />
      <rect className="about-dia__bar" x="50" y="27" width="34" height="5" rx="2.5" />
      <rect className="about-dia__bar" x="50" y="36" width="58" height="4" rx="2" />
    </svg>
  );
}

/** The vehicle as a plan — stretcher, kit bays, rail, all called out. */
function KitDiagram() {
  return (
    <svg
      className="about-dia"
      viewBox="0 0 320 140"
      width="320"
      height="140"
      aria-hidden="true"
      focusable="false"
    >
      <rect className="about-dia__panel" x="8" y="10" width="304" height="120" rx="16" />

      {/* Cabin shell */}
      <rect className="about-dia__outline" x="26" y="24" width="180" height="94" rx="14" />

      {/* Kit bays at the head end: defib, airway, ventilation, drugs. */}
      <g>
        <rect className="about-dia__mod" x="38" y="34" width="24" height="24" rx="7" />
        <rect className="about-dia__mod" x="66" y="34" width="24" height="24" rx="7" />
        <rect className="about-dia__mod" x="94" y="34" width="24" height="24" rx="7" />
        <rect className="about-dia__mod" x="122" y="34" width="24" height="24" rx="7" />
        <path className="about-dia__thin" d="M44 46h12M78 40v12M72 46h12M100 49l4-6 4 8 4-5M128 42h12M128 50h12" />
      </g>

      {/* Stretcher, pillow end nearest the head of the cabin. */}
      <rect className="about-dia__wash" x="38" y="68" width="156" height="30" rx="10" />
      <rect className="about-dia__outline" x="38" y="68" width="156" height="30" rx="10" />
      <rect className="about-dia__soft" x="44" y="73" width="20" height="20" rx="6" />
      <path className="about-dia__thin" d="M70 83h112" />

      {/* Equipment rail along the floor. */}
      <rect className="about-dia__soft" x="38" y="106" width="156" height="6" rx="3" />

      {/* Callouts */}
      <path className="about-dia__thin" d="M146 46h68M198 83h16M198 109h16M214 46v63" />
      <circle className="about-dia__fill" cx="146" cy="46" r="2.2" />
      <circle className="about-dia__fill" cx="198" cy="83" r="2.2" />
      <circle className="about-dia__fill" cx="198" cy="109" r="2.2" />
      <rect className="about-dia__bar" x="222" y="42" width="66" height="8" rx="4" />
      <rect className="about-dia__bar" x="222" y="79" width="50" height="8" rx="4" />
      <rect className="about-dia__bar" x="222" y="105" width="72" height="8" rx="4" />
    </svg>
  );
}

/** One named clinician, holding both ends of the journey. */
function LeadDiagram() {
  /* The lead is a real crew member, so the tile names somebody the
     rest of the site also names. */
  const lead = CREW.people[0];

  return (
    <svg
      className="about-dia"
      viewBox="0 0 320 140"
      width="320"
      height="140"
      aria-hidden="true"
      focusable="false"
    >
      <rect className="about-dia__panel" x="8" y="10" width="304" height="120" rx="16" />

      {/* Referring bedside */}
      <circle className="about-dia__mod" cx="42" cy="70" r="20" />
      <rect className="about-dia__outline" x="32" y="68" width="20" height="9" rx="2.5" />
      <rect className="about-dia__soft" x="32" y="61" width="8" height="6" rx="2" />
      <path className="about-dia__thin" d="M33 77v4M51 77v4" />

      {/* Receiving bedside */}
      <circle className="about-dia__mod" cx="278" cy="70" r="20" />
      <rect className="about-dia__outline" x="268" y="68" width="20" height="9" rx="2.5" />
      <rect className="about-dia__soft" x="268" y="61" width="8" height="6" rx="2" />
      <path className="about-dia__thin" d="M269 77v4M287 77v4" />

      {/* The one thread that runs between them */}
      <path className="about-dia__dash" d="M62 70h28M230 70h28" />

      <rect className="about-dia__chip" x="90" y="50" width="140" height="40" rx="20" />
      <circle className="about-dia__wash" cx="110" cy="70" r="12" />
      <circle className="about-dia__fill" cx="110" cy="66" r="4" />
      <path className="about-dia__thin" d="M103 79c1.6-3.4 4-5 7-5s5.4 1.6 7 5" />
      <text className="about-dia__name" x="128" y="68">
        {lead.name}
      </text>
      <rect className="about-dia__bar" x="128" y="74" width="62" height="5" rx="2.5" />
    </svg>
  );
}

/** One record, travelling bedside to bedside and landing complete. */
function RecordDiagram() {
  return (
    <svg
      className="about-dia"
      viewBox="0 0 320 140"
      width="320"
      height="140"
      aria-hidden="true"
      focusable="false"
    >
      <rect className="about-dia__panel" x="8" y="10" width="304" height="120" rx="16" />

      {/* Two bedsides */}
      <rect className="about-dia__mod" x="24" y="52" width="42" height="42" rx="14" />
      <path className="about-dia__line" d="M45 64v18M36 73h18" />
      <rect className="about-dia__mod" x="254" y="52" width="42" height="42" rx="14" />
      <path className="about-dia__line" d="M275 64v18M266 73h18" />

      {/* The path the paperwork takes */}
      <path className="about-dia__dash" d="M66 73C104 26 216 26 254 73" />

      {/* The record itself, mid-journey */}
      <rect className="about-dia__chip" x="126" y="34" width="72" height="66" rx="10" />
      <path className="about-dia__soft" d="M180 34h4l14 14v4h-14a4 4 0 0 1-4-4V34Z" />
      <rect className="about-dia__bar" x="138" y="58" width="42" height="5" rx="2.5" />
      <rect className="about-dia__bar" x="138" y="69" width="48" height="5" rx="2.5" />
      <rect className="about-dia__bar" x="138" y="80" width="30" height="5" rx="2.5" />

      {/* Landed, signed off */}
      <circle className="about-dia__panel" cx="196" cy="96" r="13" />
      <circle className="about-dia__fill" cx="196" cy="96" r="10" />
      <path className="about-dia__tick" d="m191.5 96 3.2 3.4 6-6.8" />
    </svg>
  );
}

const DIAGRAMS: Record<CellKey, ComponentType> = {
  supervision: TraceDiagram,
  vehicles: KitDiagram,
  lead: LeadDiagram,
  record: RecordDiagram,
};

/* The plate glyph reads as the promise: clinical, in motion,
   staffed, signed off. */
const PLATE_ICONS: Record<CellKey, ComponentType> = {
  supervision: Plus,
  vehicles: ArrowRight,
  lead: Users,
  record: Check,
};

export function About() {
  return (
    <section id="about" className="section about" aria-labelledby="about-title" data-rv>
      <div className="wrap">
        <div className="about__head">
          <div className="sec-head sec-head--left about__headText">
            <span className="eyebrow rv rv--fade">
              <span className="eyebrow__mark">
                <BrandMark />
              </span>
              <span className="eyebrow__label">{ABOUT.eyebrow}</span>
            </span>

            <h2 className="h2 about__title" id="about-title">
              {ABOUT.title.map((line, i) => (
                <span className="line-rise" key={line} style={step(i)}>
                  <span>{i === 0 ? <strong>{line}</strong> : line}</span>
                </span>
              ))}
            </h2>

            <p className="lede about__lede rv rv--sm" style={step(3)}>
              {ABOUT.lede}
            </p>
          </div>

          {/* Redundant with the header nav, so it stays out of the
              accessibility tree and out of the tab order. */}
          <a
            className="icon-btn about__jump rv rv--fade"
            style={step(4)}
            href="#services"
            aria-hidden="true"
            tabIndex={-1}
          >
            <ArrowRight />
          </a>
        </div>

        <div className="about__bento">
          {ABOUT.cells.map((cell, i) => {
            const Diagram = DIAGRAMS[cell.key];
            const PlateIcon = PLATE_ICONS[cell.key];

            return (
              <article
                key={cell.key}
                className={`about__cell about__cell--${CORNERS[i]} rv rv--pop`}
                style={step(i)}
                data-accent={cell.accent}
              >
                <div className="about__cellHead">
                  <span className="about__plate" aria-hidden="true">
                    <PlateIcon />
                  </span>
                  <h3 className="about__cellTitle">{cell.title}</h3>
                  <p className="about__cellCopy">{cell.copy}</p>
                </div>

                <div className="about__art">
                  <Diagram />
                </div>
              </article>
            );
          })}

          <div className="about__orb" aria-hidden="true">
            <BrandMark />
          </div>
        </div>

        <ul className="about__stats">
          {ABOUT.stats.map((stat, i) => (
            <li key={stat.label} className="about__stat card rv rv--sm" style={step(i)}>
              <span
                className="about__statNum counter"
                aria-hidden="true"
                data-count={String(stat.to)}
                data-count-format={stat.format}
              >
                {stat.display}
              </span>
              <span className="about__statLabel" aria-hidden="true">
                {stat.label}
              </span>
              {/* The animated figure is decoration; this is the value. */}
              <span className="sr">
                {stat.display} {stat.label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
