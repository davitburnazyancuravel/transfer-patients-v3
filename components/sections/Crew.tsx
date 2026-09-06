import Image from "next/image";

import { BrandMark } from "@/components/BrandMark";
import { ArrowRight } from "@/components/ui/icons";
import { CREW, type Accent } from "@/lib/content";
import { PHOTOS } from "@/lib/media";

/* ============================================================
   Crew — the staggered tile marquee.

   Two rows drift past in opposite directions. Each person is a
   pair: a portrait tile, and a small pastel label tile hung off
   one of its bottom corners so the two overlap. Every other pair
   is nudged down, which is what stops the band reading as a grid.

   The rows are decoration — they cannot be tabbed through, so
   they are hidden from assistive tech and the roster at the foot
   of the section carries all seventeen people as text instead.
   Under reduced motion the rows are swapped for a static grid of
   the first eight; that swap is CSS-only, so this stays a server
   component.
   ============================================================ */

type Person = (typeof CREW.people)[number];

/* Five pastels against seventeen people. Cycling by roster index
   means neighbours never share a colour — including across the
   seam where a track meets its own duplicate. */
const ACCENTS: readonly Accent[] = [
  "emergency",
  "interfac",
  "longdist",
  "neonatal",
  "bariatric",
];

/* Row A takes the first nine, row B the remaining eight. Each row
   keeps its slice's offset so accents and photographs stay on the
   roster-wide cycle rather than restarting per row. */
const ROW_SPLIT = Math.ceil(CREW.people.length / 2);
const ROW_A = CREW.people.slice(0, ROW_SPLIT);
const ROW_B = CREW.people.slice(ROW_SPLIT);

/* Enough to fill the band twice over without asking anyone to
   scroll a static grid that is only a reduced-motion stand-in. */
const STATIC_PEOPLE = CREW.people.slice(0, 8);

type PairProps = {
  person: Person;
  /** Position in the full roster — drives the accent and photo cycles. */
  index: number;
};

function Pair({ person, index }: PairProps) {
  const accent = ACCENTS[index % ACCENTS.length];
  const photo = PHOTOS.crew[index % PHOTOS.crew.length];

  /* Odd pairs drop and carry their label on the left, so the two
     alternations reinforce each other into one zigzag. The drop
     itself is applied only inside a row; the static grid stays
     tidy. */
  const offbeat = index % 2 === 1;

  return (
    <div
      className="crew__pair"
      data-accent={accent}
      data-side={offbeat ? "l" : "r"}
      data-drop={offbeat ? "true" : undefined}
    >
      {/* Photo and label lift together; the card below stays put. */}
      <div className="crew__stack">
        <div className="crew__tile">
          <Image
            className="crew__photo"
            src={photo.src}
            alt={photo.alt}
            fill
            sizes="(max-width: 700px) 140px, 190px"
          />
        </div>

        <span className="crew__role">{person.role}</span>
      </div>

      <span className="crew__card">
        <span className="crew__name">{person.name}</span>
        <span className="crew__metaLine">{person.meta}</span>
      </span>
    </div>
  );
}

type TrackProps = {
  people: readonly Person[];
  /** Roster index of `people[0]`. */
  offset: number;
};

function Track({ people, offset }: TrackProps) {
  return (
    <div className="marquee__track crew__track">
      {people.map((person, i) => (
        <Pair key={person.name} person={person} index={offset + i} />
      ))}
    </div>
  );
}

export function Crew() {
  return (
    <section id="crew" className="section crew" aria-labelledby="crew-title" data-rv>
      <div className="wrap">
        <div className="sec-head crew__head">
          <span className="eyebrow rv rv--fade">
            <span className="eyebrow__mark">
              <BrandMark />
            </span>
            <span className="eyebrow__label">{CREW.eyebrow}</span>
          </span>

          <h2 className="h2 crew__title" id="crew-title">
            {CREW.title.map((line, i) => (
              <span className="line-rise" key={line} style={{ "--i": String(i) }}>
                <span>{i === 1 ? <strong>{line}</strong> : line}</span>
              </span>
            ))}
          </h2>

          <p className="lede lede--center rv rv--sm" style={{ "--i": "2" }}>
            {CREW.lede}
          </p>

          <a className="btn btn--ghost rv rv--sm" style={{ "--i": "3" }} href={CREW.cta.href}>
            {CREW.cta.label}
            <span className="btn__arrow" aria-hidden="true">
              <ArrowRight />
            </span>
          </a>
        </div>
      </div>

      {/* Each row is two identical tracks: the second closes the loop.
          Everything in here is duplicated, unreachable by keyboard and
          in constant motion, so none of it is exposed. */}
      <div className="crew__rows">
        <div
          className="marquee crew__row crew__row--a rv rv--fade"
          style={{ "--i": "4" }}
          aria-hidden="true"
        >
          <Track people={ROW_A} offset={0} />
          <Track people={ROW_A} offset={0} />
        </div>

        <div
          className="marquee marquee--rev crew__row crew__row--b rv rv--fade"
          style={{ "--i": "5" }}
          aria-hidden="true"
        >
          <Track people={ROW_B} offset={ROW_SPLIT} />
          <Track people={ROW_B} offset={ROW_SPLIT} />
        </div>
      </div>

      {/* Shown only under prefers-reduced-motion, in place of the rows. */}
      <div className="crew__static" aria-hidden="true">
        {STATIC_PEOPLE.map((person, i) => (
          <Pair key={person.name} person={person} index={i} />
        ))}
      </div>

      {/* The trade: the decoration above is hidden, the people are not.
          This is the only version of the crew that assistive tech sees,
          so it carries everything the tiles only hint at. */}
      <ul className="sr">
        {CREW.people.map((person) => (
          <li key={person.name}>
            {person.name} — {person.role}. {person.line} {person.meta}.
          </li>
        ))}
      </ul>
    </section>
  );
}
