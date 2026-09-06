"use client";

/* ============================================================
   Transfer calculator.

   Four inputs — transfer type, care level, contract status and a
   route picked off the facility map — drive one estimate: crew,
   complexity, time on the road, plan and cost range.

   Wearing the reference's pricing shape: three white cards across
   a pale ground, each with a plate icon, a title, a big live
   figure, a hairline rule and its own controls beneath.

   State lives in one object so the estimate memo has a single
   dependency and the tween has a single trigger. This is the only
   client component on the page that holds real state; everything
   it renders is derived, so nothing here is stored twice.
   ============================================================ */

import Image from "next/image";
import { useEffect, useId, useMemo, useRef, useState } from "react";

import { BrandMark } from "@/components/BrandMark";
import { ArrowRight, Calendar, Check } from "@/components/ui/icons";
import { CALCULATOR, CALC_CREW, FACILITIES, NAV_CTA } from "@/lib/content";
import { PHOTOS } from "@/lib/media";
import {
  clamp,
  easeOutCubic,
  hoursMins,
  lerp,
  miles as milesLabel,
  money,
  prefersReducedMotion,
  round,
} from "@/lib/util";

/* ------------------------------------------------------------
   Copy that lib/content.ts does not carry yet.

   Every other visible string in this file comes from CALCULATOR,
   FACILITIES, CALC_CREW or NAV_CTA. These are the pieces the
   content module has no keys for — a card title, the second state
   of the route hint, a control-group name and the connective
   words of the spoken summary. They belong in CALCULATOR.labels
   as soon as that file can be edited.
   ------------------------------------------------------------ */
const COPY = {
  planTransfer: "Plan the transfer",
  chooseDestination: "Now choose a destination.",
  presetGroup: "Route preset",

  /** Reads correctly before each care-level acronym. */
  article: { bls: "a", als: "an", icu: "an" },

  /** The whole result as one sentence, for the live region. */
  summary: (p: {
    type: string;
    article: string;
    care: string;
    from: string;
    to: string;
    miles: number;
    duration: string;
    lo: string;
    hi: string;
  }) =>
    `${p.type} with ${p.article} ${p.care} crew, ${p.from} to ${p.to} — ` +
    `${p.miles} miles, about ${p.duration} on the road, ` +
    `estimated ${p.lo} to ${p.hi}.`,

  /** Same sentence while the destination is still outstanding. */
  summaryPending: (p: {
    type: string;
    article: string;
    care: string;
    from: string;
  }) =>
    `${p.type} with ${p.article} ${p.care} crew from ${p.from}. ` +
    `Now choose a destination.`,
} as const;

/* ------------------------------------------------------------
   Model.

   Ported verbatim from v2 — every constant a commercial
   conversation would want to tune lives here, and nothing below
   invents a number of its own. Changing anything in this block
   changes the quotes the site gives out.
   ------------------------------------------------------------ */

type TransferType = (typeof CALCULATOR.types)[number]["id"];
type CareLevel = (typeof CALCULATOR.cares)[number]["id"];
type ContractStatus = (typeof CALCULATOR.contracts)[number]["id"];
type RoutePreset = (typeof CALCULATOR.presets)[number]["id"];
type Facility = (typeof FACILITIES)[number];
type FacilityId = Facility["id"];
type CrewKey = keyof typeof CALC_CREW;

type Model = {
  /** Multiplier on staffing and equipment cost. */
  readonly care: Readonly<Record<CareLevel, number>>;
  /** Multiplier on the call-out fee. */
  readonly type: Readonly<Record<TransferType, number>>;
  /** 0..1 inputs to the complexity blend. */
  readonly careScore: Readonly<Record<CareLevel, number>>;
  readonly typeScore: Readonly<Record<TransferType, number>>;
  readonly complexityWeights: {
    readonly care: number;
    readonly type: number;
    readonly distance: number;
  };
  /** Miles at which distance stops adding to complexity. */
  readonly complexityDistanceCap: number;
  /** Straight-line miles → road miles. */
  readonly routeFactor: Readonly<Record<RoutePreset, number>>;
  readonly avgMph: number;
  readonly speedFactor: Readonly<Partial<Record<TransferType, number>>>;
  /** Minutes of loading, handover and documentation either side. */
  readonly overheadMin: number;
  readonly overheadCare: Readonly<Record<CareLevel, number>>;
  readonly overheadType: Readonly<Partial<Record<TransferType, number>>>;
  /** The twelve-segment bar spans ten hours. */
  readonly segmentScaleMin: number;
  readonly costPerMile: number;
  readonly callOut: number;
  readonly costFloor: number;
  readonly contractedDiscount: number;
  readonly rangeLow: number;
  readonly rangeHigh: number;
  /** The cost bar is logarithmic — typical jobs would be a sliver otherwise. */
  readonly barMin: number;
  readonly barMax: number;
};

const MODEL: Model = {
  care: { bls: 1.0, als: 1.55, icu: 2.35 },
  type: {
    emergency: 1.35,
    interfacility: 1.0,
    discharge: 0.72,
    repatriation: 1.5,
  },
  careScore: { bls: 0.18, als: 0.52, icu: 1.0 },
  typeScore: {
    discharge: 0.15,
    interfacility: 0.42,
    emergency: 0.85,
    repatriation: 1.0,
  },
  complexityWeights: { care: 0.46, type: 0.34, distance: 0.2 },
  complexityDistanceCap: 320,

  routeFactor: { shortest: 1.15, motorway: 1.22 },

  avgMph: 46,
  speedFactor: { emergency: 1.25, repatriation: 1.15 },
  overheadMin: 35,
  overheadCare: { bls: 0, als: 8, icu: 20 },
  overheadType: { emergency: -12, repatriation: 45 },
  segmentScaleMin: 600,

  costPerMile: 3.1,
  callOut: 180,
  costFloor: 165,
  contractedDiscount: 0.88,
  rangeLow: 0.86,
  rangeHigh: 1.34,

  barMin: 250,
  barMax: 14000,
};

/** Twelve, to match segmentScaleMin's ten-hour span. */
const SEGMENTS = 12;
const SEGMENT_INDEXES = Array.from({ length: SEGMENTS }, (_, i) => i);

/* Costs are quoted to the nearest ten pounds, distances to the mile
   and durations to five minutes — the precision a dispatcher would
   actually say out loud. */
const COST_STEP = 10;
const MINUTE_STEP = 5;

/* ------------------------------------------------------------
   Derivation
   ------------------------------------------------------------ */

type CalcState = {
  readonly type: TransferType;
  readonly care: CareLevel;
  readonly contract: ContractStatus;
  readonly preset: RoutePreset;
  readonly from: FacilityId;
  /** Null between choosing a pickup and choosing a destination. */
  readonly to: FacilityId | null;
};

const INITIAL: CalcState = {
  type: "interfacility",
  care: "als",
  contract: "contracted",
  preset: "motorway",
  from: "qe",
  to: "barts",
};

/** The option lists are closed, so the fallback is unreachable —
    it exists only to keep the return type honest. */
function optionFor<T extends { readonly id: string }>(
  items: readonly T[],
  id: string
): T {
  return items.find((item) => item.id === id) ?? items[0];
}

/** mx/my are miles east/north on a rough GB grid, so the distances
    we quote are believable rather than pixel measurements. */
function straightMiles(a: Facility, b: Facility): number {
  return Math.hypot(a.mx - b.mx, a.my - b.my);
}

type Estimate = {
  readonly miles: number;
  readonly complexity: number;
  readonly minutes: number;
  readonly lo: number;
  readonly hi: number;
  readonly crew: readonly CrewKey[];
};

function pickCrew(state: CalcState): readonly CrewKey[] {
  if (state.care === "icu") return ["physician", "paramedic"];
  if (state.type === "repatriation") return ["flight", "paramedic"];
  if (state.type === "emergency") return ["paramedic", "emt"];
  if (state.care === "bls") return ["emt", "dispatch"];
  return ["paramedic", "dispatch"];
}

function estimate(state: CalcState): Estimate {
  const from = optionFor(FACILITIES, state.from);
  const to = state.to ? optionFor(FACILITIES, state.to) : null;

  const miles = to
    ? straightMiles(from, to) * MODEL.routeFactor[state.preset]
    : 0;

  const careMult = MODEL.care[state.care];
  const typeMult = MODEL.type[state.type];

  /* Complexity — a weighted blend, never 0 and never quite 100. */
  const w = MODEL.complexityWeights;
  const distScore = clamp(miles / MODEL.complexityDistanceCap, 0, 1);
  const complexity = Math.round(
    clamp(
      100 *
        (w.care * MODEL.careScore[state.care] +
          w.type * MODEL.typeScore[state.type] +
          w.distance * distScore),
      8,
      98
    )
  );

  /* Time on the road. */
  const mph = MODEL.avgMph * (MODEL.speedFactor[state.type] ?? 1);
  const overhead =
    MODEL.overheadMin +
    MODEL.overheadCare[state.care] +
    (MODEL.overheadType[state.type] ?? 0);
  const minutes = Math.max(20, (miles / mph) * 60 + overhead);

  /* Cost. */
  let cost =
    MODEL.callOut * typeMult * careMult + miles * MODEL.costPerMile * careMult;
  if (state.contract === "contracted") cost *= MODEL.contractedDiscount;
  cost = Math.max(cost, MODEL.costFloor);

  return {
    miles,
    complexity,
    minutes,
    lo: cost * MODEL.rangeLow,
    hi: cost * MODEL.rangeHigh,
    crew: pickCrew(state),
  };
}

/** Position on the logarithmic cost scale, as a percentage. */
function barPos(value: number): number {
  const span = Math.log(MODEL.barMax) - Math.log(MODEL.barMin);
  const t = (Math.log(Math.max(value, MODEL.barMin)) - Math.log(MODEL.barMin)) / span;
  return clamp(t * 100, 0, 100);
}

/* ------------------------------------------------------------
   Tweening.

   One rAF loop drives every figure on the result card, so the
   numbers travel together rather than racing each other. The loop
   is cancelled on unmount and restarted from wherever it had got
   to whenever an input changes mid-flight. Reduced motion skips
   straight to the answer.
   ------------------------------------------------------------ */

const METRIC_KEYS = ["miles", "complexity", "minutes", "lo", "hi"] as const;
type Metrics = Record<(typeof METRIC_KEYS)[number], number>;

const TWEEN_MS = 720;
/* Below this the change is invisible, so it is not worth a frame. */
const TWEEN_EPSILON = 0.01;

function useTweened(target: Metrics): Metrics {
  const [shown, setShown] = useState<Metrics>(target);
  const shownRef = useRef<Metrics>(target);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const from = shownRef.current;
    const settled = METRIC_KEYS.every(
      (key) => Math.abs(from[key] - target[key]) < TWEEN_EPSILON
    );
    /* True on mount, which is why the first paint never animates. */
    if (settled) return;

    if (prefersReducedMotion()) {
      shownRef.current = target;
      setShown(target);
      return;
    }

    let start: number | null = null;

    const step = (now: number) => {
      if (start === null) start = now;
      const t = Math.min(1, (now - start) / TWEEN_MS);
      const eased = easeOutCubic(t);

      const next = METRIC_KEYS.reduce<Metrics>(
        (acc, key) => {
          acc[key] = lerp(from[key], target[key], eased);
          return acc;
        },
        { ...from }
      );

      shownRef.current = next;
      setShown(next);
      if (t < 1) frameRef.current = requestAnimationFrame(step);
    };

    frameRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameRef.current);
  }, [target]);

  return shown;
}

/* ------------------------------------------------------------
   The map.

   A stylised silhouette rather than a real coastline: the point is
   that eight named facilities sit in a believable arrangement, not
   that Kent is the right shape. The 520×448 canvas is the frame
   FACILITIES' x/y coordinates were authored against.
   ------------------------------------------------------------ */

const MAP_W = 520;
const MAP_H = 448;

const LAND =
  "M268 24C330 24 380 62 392 122C402 172 372 206 386 250C400 300 372 344 348 380" +
  "C322 418 288 438 244 432C194 426 152 394 134 346C114 294 132 252 124 208" +
  "C116 158 150 96 198 58C218 42 242 24 268 24Z";

const RIVER =
  "M172 40C214 106 178 172 214 216C250 260 226 302 258 340C288 376 288 412 274 452";

const CORRIDORS =
  "M272 62L176 172L266 286L336 300M266 286L344 228M266 286L246 352L188 388M246 352L320 370";

/** A quadratic bowed the same way every time, so the route reads as
    a flight path rather than a straight line between two dots. */
function arcPath(a: Facility, b: Facility): string {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  const bow = Math.min(len * 0.24, 74);
  const cx = (a.x + b.x) / 2 + (-dy / len) * bow;
  const cy = (a.y + b.y) / 2 + (dx / len) * bow;
  return `M${a.x} ${a.y}Q${cx.toFixed(2)} ${cy.toFixed(2)} ${b.x} ${b.y}`;
}

/* The gauge is a half-circle of radius 86 on a 200×112 canvas.
   pathLength normalises it to 100 so the dash array can be the
   percentage itself, with no magic arc length to keep in step. */
const GAUGE_ARC = "M14 100A86 86 0 0 1 186 100";

/* ------------------------------------------------------------
   Crew portraits.

   CALC_CREW names the people; the manifest holds the photography.
   The pairing is fixed here so a given clinician always wears the
   same face, and so swapping the stock for real General Medical portraits
   stays a one-file change in lib/media.ts.
   ------------------------------------------------------------ */
const CREW_PORTRAIT: Record<CrewKey, number> = {
  physician: 6,
  paramedic: 1,
  flight: 0,
  neonatal: 8,
  bariatric: 7,
  dispatch: 2,
  emt: 4,
};

const PORTRAIT_PX = 44;

/* ------------------------------------------------------------
   Section
   ------------------------------------------------------------ */

export function Calculator() {
  const uid = useId();
  const hintId = `${uid}-hint`;

  const [state, setState] = useState<CalcState>(INITIAL);

  const result = useMemo(() => estimate(state), [state]);
  const target = useMemo<Metrics>(
    () => ({
      miles: result.miles,
      complexity: result.complexity,
      minutes: result.minutes,
      lo: result.lo,
      hi: result.hi,
    }),
    [result]
  );
  const shown = useTweened(target);

  const from = optionFor(FACILITIES, state.from);
  const to = state.to ? optionFor(FACILITIES, state.to) : null;
  const care = optionFor(CALCULATOR.cares, state.care);
  const careIndex = CALCULATOR.cares.findIndex((c) => c.id === state.care);
  const transfer = optionFor(CALCULATOR.types, state.type);

  /* The map cycles pickup → destination → start again, so a third
     click always begins a fresh route rather than stalling. */
  const pick = (id: FacilityId) => {
    setState((s) => {
      if (s.to) return { ...s, from: id, to: null };
      if (id === s.from) return s;
      return { ...s, to: id };
    });
  };

  const duration = hoursMins(round(shown.minutes, MINUTE_STEP));
  const filled = clamp(
    Math.round((shown.minutes / MODEL.segmentScaleMin) * SEGMENTS),
    1,
    SEGMENTS
  );

  const barLeft = barPos(result.lo);
  const barWidth = Math.max(barPos(result.hi) - barLeft, 1.5);

  /* Spoken from the settled estimate, not the tweened one, so the
     region fires once per change instead of once per frame. */
  const summary = to
    ? COPY.summary({
        type: transfer.label,
        article: COPY.article[state.care],
        care: care.label,
        from: from.name,
        to: to.name,
        miles: Math.round(result.miles),
        duration: hoursMins(round(result.minutes, MINUTE_STEP)),
        lo: money(round(result.lo, COST_STEP)),
        hi: money(round(result.hi, COST_STEP)),
      })
    : COPY.summaryPending({
        type: transfer.label,
        article: COPY.article[state.care],
        care: care.label,
        from: from.name,
      });

  return (
    <section
      id="calculator"
      className="section section--panel calc"
      aria-labelledby="calculator-title"
      data-rv
    >
      <div className="wrap">
        <div className="sec-head calc__head">
          <span className="eyebrow rv rv--fade">
            <span className="eyebrow__mark">
              <BrandMark />
            </span>
            <span className="eyebrow__label">{CALCULATOR.eyebrow}</span>
          </span>

          <h2 className="h2" id="calculator-title">
            {CALCULATOR.title.map((line, i) => (
              <span className="line-rise" key={line} style={{ "--i": String(i) }}>
                <span>
                  <strong>{line}</strong>
                </span>
              </span>
            ))}
          </h2>

          <p className="lede lede--center rv rv--sm" style={{ "--i": "1" }}>
            {CALCULATOR.lede}
          </p>
        </div>

        <div className="calc__grid">
          {/* ---- Card 1 — the transfer itself ------------------ */}

          <section
            className="card calc__card calc__card--inputs rv rv--pop"
            style={{ "--i": "0" }}
            aria-labelledby={`${uid}-inputs`}
          >
            <header className="calc__cardHead">
              <span className="calc__plate" aria-hidden="true">
                <Calendar />
              </span>
              <h3 className="calc__cardTitle" id={`${uid}-inputs`}>
                {COPY.planTransfer}
              </h3>
              <p className="calc__figure">{care.label}</p>
              <p className="calc__figureNote">{care.note}</p>
            </header>

            <hr className="rule calc__rule" />

            <div className="calc__body calc__body--spread">
              <fieldset className="calc-field">
                <legend className="calc-field__legend">
                  {CALCULATOR.labels.type}
                </legend>
                <div className="calc-opts">
                  {CALCULATOR.types.map((option) => (
                    <label className="calc-opt" key={option.id}>
                      <input
                        className="calc-opt__input"
                        type="radio"
                        name={`${uid}-type`}
                        value={option.id}
                        checked={state.type === option.id}
                        onChange={() =>
                          setState((s) => ({ ...s, type: option.id }))
                        }
                      />
                      <span className="calc-opt__ring" aria-hidden="true" />
                      <span className="calc-opt__label">{option.label}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <fieldset className="calc-field">
                <legend className="calc-field__legend">
                  {CALCULATOR.labels.care}
                </legend>
                {/* Segmented control: the thumb slides to the active
                    slot, the inputs underneath stay real radios. */}
                <div
                  className="calc-seg"
                  style={{ "--seg-i": String(Math.max(careIndex, 0)) }}
                >
                  <span className="calc-seg__thumb" aria-hidden="true" />
                  {CALCULATOR.cares.map((option) => (
                    <label className="calc-seg__slot" key={option.id}>
                      <input
                        className="calc-seg__input"
                        type="radio"
                        name={`${uid}-care`}
                        value={option.id}
                        checked={state.care === option.id}
                        onChange={() =>
                          setState((s) => ({ ...s, care: option.id }))
                        }
                      />
                      <span className="calc-seg__face">
                        {option.label}
                        <span className="sr">{option.note}</span>
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <fieldset className="calc-field">
                <legend className="calc-field__legend">
                  {CALCULATOR.labels.contract}
                </legend>
                <div className="calc-opts">
                  {CALCULATOR.contracts.map((option) => (
                    <label className="calc-opt" key={option.id}>
                      <input
                        className="calc-opt__input"
                        type="radio"
                        name={`${uid}-contract`}
                        value={option.id}
                        checked={state.contract === option.id}
                        onChange={() =>
                          setState((s) => ({ ...s, contract: option.id }))
                        }
                      />
                      <span className="calc-opt__ring" aria-hidden="true" />
                      <span className="calc-opt__label">{option.label}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            </div>
          </section>

          {/* ---- Card 2 — the route --------------------------- */}

          <section
            className="card calc__card calc__card--map rv rv--pop"
            style={{ "--i": "1" }}
            aria-labelledby={`${uid}-route`}
          >
            <header className="calc__cardHead">
              <span className="calc__plate" aria-hidden="true">
                <ArrowRight />
              </span>
              <h3 className="calc__cardTitle" id={`${uid}-route`}>
                {CALCULATOR.labels.route}
              </h3>
              <span className="calc__live">
                <span className="calc__liveDot" aria-hidden="true" />
                {CALCULATOR.labels.live}
              </span>
              {/* The distance is this card's headline figure, which is
                  why it is not repeated in the readout below. */}
              <p className="calc__figure counter">{milesLabel(shown.miles)}</p>
              <p className="calc__figureNote">{CALCULATOR.labels.distance}</p>
            </header>

            <hr className="rule calc__rule" />

            <div className="calc__body">
              <div className="calc-map">
                {/* Frame and pins share one aspect ratio, so the HTML
                    buttons stay registered with the drawing however
                    much height the card gives them. */}
                <div className="calc-map__frame">
                  <svg
                    className="calc-map__svg"
                    viewBox={`0 0 ${MAP_W} ${MAP_H}`}
                    preserveAspectRatio="xMidYMid meet"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <defs>
                      <clipPath id="calcLandClip">
                        <path d={LAND} />
                      </clipPath>
                    </defs>

                    <path className="calc-map__land" d={LAND} />

                    <g clipPath="url(#calcLandClip)">
                      <g className="calc-map__grid">
                        <path d="M80 120H440M80 190H440M80 260H440M80 330H440M80 400H440" />
                        <path d="M160 0V448M240 0V448M320 0V448M400 0V448" />
                      </g>
                      <path className="calc-map__river" d={RIVER} />
                      <path className="calc-map__road" d={CORRIDORS} />
                      <ellipse
                        className="calc-map__ring"
                        cx="292"
                        cy="327"
                        rx="92"
                        ry="76"
                      />
                    </g>

                    {to ? (
                      /* Keyed on the pair so a new route restarts the
                         draw-in rather than sliding out of the old one. */
                      <g
                        className="calc-map__route"
                        key={`${state.from}-${state.to}`}
                      >
                        <path
                          className="calc-map__routeDraw"
                          d={arcPath(from, to)}
                          pathLength="1"
                        />
                        <path
                          className="calc-map__routeFlow"
                          d={arcPath(from, to)}
                        />
                      </g>
                    ) : null}
                  </svg>

                  <div
                    className="calc-map__pins"
                    role="group"
                    aria-label={CALCULATOR.labels.route}
                  >
                    {FACILITIES.map((facility) => {
                      const role =
                        facility.id === state.from
                          ? "from"
                          : facility.id === state.to
                            ? "to"
                            : undefined;

                      const roleLabel =
                        role === "from"
                          ? CALCULATOR.labels.pickup
                          : role === "to"
                            ? CALCULATOR.labels.destination
                            : null;

                      return (
                        <button
                          key={facility.id}
                          type="button"
                          className="calc-map__pin"
                          data-role={role}
                          data-anchor={facility.anchor}
                          style={{
                            "--px": `${((facility.x / MAP_W) * 100).toFixed(3)}%`,
                            "--py": `${((facility.y / MAP_H) * 100).toFixed(3)}%`,
                          }}
                          aria-label={
                            roleLabel
                              ? `${facility.name}, ${roleLabel}`
                              : facility.name
                          }
                          aria-describedby={hintId}
                          onClick={() => pick(facility.id)}
                        >
                          <span className="calc-map__dot" aria-hidden="true" />
                          {/* Named on the map only while it is part of
                              the route; the button carries the name for
                              assistive tech either way. */}
                          <span className="calc-map__label" aria-hidden="true">
                            {roleLabel ? (
                              <span className="calc-map__tag">{roleLabel}</span>
                            ) : null}
                            <span className="calc-map__name">
                              {facility.name}
                            </span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <p className="calc-route">
                <span className="calc-route__leg">
                  <span className="calc-route__tag">
                    {CALCULATOR.labels.pickup}
                  </span>
                  <span className="calc-route__name">{from.name}</span>
                </span>
                <span className="calc-route__arrow" aria-hidden="true">
                  <ArrowRight />
                </span>
                <span className="calc-route__leg calc-route__leg--to">
                  <span className="calc-route__tag">
                    {CALCULATOR.labels.destination}
                  </span>
                  <span className="calc-route__name">
                    {to ? to.name : COPY.chooseDestination}
                  </span>
                </span>
              </p>

              <div className="calc-foot">
                <p className="calc-hint" id={hintId}>
                  {to ? CALCULATOR.labels.routeHint : COPY.chooseDestination}
                </p>

                <div
                  className="calc-presets"
                  role="group"
                  aria-label={COPY.presetGroup}
                >
                  {CALCULATOR.presets.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      className="calc-preset"
                      aria-pressed={state.preset === option.id}
                      onClick={() =>
                        setState((s) => ({ ...s, preset: option.id }))
                      }
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* ---- Card 3 — the answer -------------------------- */}

          <section
            className="card calc__card calc__card--result rv rv--pop"
            style={{ "--i": "2" }}
            aria-labelledby={`${uid}-result`}
          >
            <header className="calc__cardHead">
              <span className="calc__plate" aria-hidden="true">
                <Check />
              </span>
              <h3 className="calc__cardTitle" id={`${uid}-result`}>
                {CALCULATOR.labels.result}
              </h3>
            </header>

            <hr className="rule calc__rule" />

            {/* The one place the whole estimate is stated in words. */}
            <p className="sr" role="status" aria-live="polite">
              {summary}
            </p>

            <div className="calc__body">
              <div className="calc-block">
                <h4 className="calc-block__h">{CALCULATOR.labels.complexity}</h4>

                <div className="calc-gauge">
                  <svg
                    className="calc-gauge__svg"
                    viewBox="0 0 200 112"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <defs>
                      <linearGradient
                        id="calcGaugeGrad"
                        x1="0"
                        y1="0"
                        x2="1"
                        y2="0"
                      >
                        <stop className="calc-gauge__stop--a" offset="0" />
                        <stop className="calc-gauge__stop--b" offset=".55" />
                        <stop className="calc-gauge__stop--c" offset="1" />
                      </linearGradient>
                    </defs>
                    <path
                      className="calc-gauge__track"
                      d={GAUGE_ARC}
                      pathLength="100"
                    />
                    <path
                      className="calc-gauge__value"
                      d={GAUGE_ARC}
                      pathLength="100"
                      strokeDasharray={`${shown.complexity.toFixed(2)} 100`}
                    />
                  </svg>

                  <p className="calc-gauge__read">
                    <span className="calc-gauge__pct counter">
                      {Math.round(shown.complexity)}
                      <span className="calc-gauge__sign">%</span>
                    </span>
                    <span className="calc-gauge__note">
                      {CALCULATOR.labels.complexityNote}
                    </span>
                  </p>
                </div>
              </div>

              <div className="calc-block">
                <h4 className="calc-block__h">{CALCULATOR.labels.time}</h4>
                <div className="calc-segs" aria-hidden="true">
                  {SEGMENT_INDEXES.map((i) => (
                    <span
                      key={i}
                      className={
                        i < filled ? "calc-seg-bar is-on" : "calc-seg-bar"
                      }
                      style={{ "--i": String(i) }}
                    />
                  ))}
                </div>
                <p className="calc-block__val counter">{duration}</p>
                <p className="calc-block__note">{CALCULATOR.labels.timeNote}</p>
              </div>

              <div className="calc-block">
                <h4 className="calc-block__h">{CALCULATOR.labels.crew}</h4>
                {/* Keyed on the pairing so a swap fades rather than
                    mutating names under the reader's eye. */}
                <ul className="calc-crew" key={result.crew.join("-")}>
                  {result.crew.map((key, i) => {
                    const person = CALC_CREW[key];
                    const portrait = PHOTOS.crew[CREW_PORTRAIT[key]];

                    return (
                      <li
                        className="calc-crew__item"
                        key={key}
                        style={{ "--i": String(i) }}
                      >
                        <Image
                          className="calc-crew__pic"
                          src={portrait.src}
                          alt={portrait.alt}
                          width={PORTRAIT_PX}
                          height={PORTRAIT_PX}
                          sizes={`${PORTRAIT_PX}px`}
                        />
                        <span className="calc-crew__txt">
                          <strong>{person.name}</strong>
                          <em>{person.role}</em>
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="calc-block">
                <h4 className="calc-block__h">{CALCULATOR.labels.plan}</h4>
                <ul className="ticks calc-plan">
                  {CALCULATOR.plan.map((item) => (
                    <li key={item}>
                      <span className="tick" aria-hidden="true">
                        <Check />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="calc-block">
                <h4 className="calc-block__h">{CALCULATOR.labels.cost}</h4>
                <p className="calc-block__val calc-block__val--cost counter">
                  {money(round(shown.lo, COST_STEP))} –{" "}
                  {money(round(shown.hi, COST_STEP))}
                </p>

                {/* Logarithmic, so a £700 job is not a sliver next to
                    the top of the scale. */}
                <div className="calc-bar" aria-hidden="true">
                  <span
                    className="calc-bar__fill"
                    style={{
                      left: `${barLeft.toFixed(1)}%`,
                      width: `${barWidth.toFixed(1)}%`,
                    }}
                  />
                </div>
                <p className="calc-bar__ends" aria-hidden="true">
                  <span>{money(MODEL.barMin)}</span>
                  <span>{money(MODEL.barMax)}</span>
                </p>
                <p className="calc-block__note">{CALCULATOR.labels.costNote}</p>
              </div>

              <a className="btn btn--primary calc__cta" href={NAV_CTA.href}>
                {NAV_CTA.label}
                <span className="btn__arrow" aria-hidden="true">
                  <ArrowRight />
                </span>
              </a>
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}
