"use client";

/* ============================================================
   Cases — the testimonial shape from the reference.

   A pale-tinted band with a centred head, a strip of four tabs
   under a sliding accent underline, and beneath that two columns:
   the case photograph on the left with its own pager bar sitting
   inside the card, and the story on the right with two more cards
   peeking out behind its right edge so the reader can see the
   deck is deeper than one.

   All four panels stay in the same grid cell. Only the live one is
   visible, but the hidden three still claim their height, so the
   column — and the photo card stretched alongside it — never jumps
   as the reader moves between cases.

   Client-side because the tabs carry state, and because the
   underline is measured rather than guessed: label widths differ,
   and the font swap changes them again after first paint.
   ============================================================ */

import Image from "next/image";
import {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from "react";

import { BrandMark } from "@/components/BrandMark";
import { ArrowLeft, ArrowRight, Check } from "@/components/ui/icons";
import { CASES } from "@/lib/content";
import { PHOTOS } from "@/lib/media";
import { pad2, prefersReducedMotion } from "@/lib/util";

/* ------------------------------------------------------------
   Copy that lib/content.ts does not carry yet.

   Every other visible string here comes from CASES. These four are
   control labels and the announcement the live region makes, which
   the content module has no keys for; they belong in CASES beside
   `tabs` as soon as that file can be edited.
   ------------------------------------------------------------ */
const LABELS = {
  prev: "Previous case",
  next: "Next case",
  did: "What we did",
  status: (name: string, n: number, total: number) =>
    `${name} — case ${n} of ${total}`,
} as const;

/** Lets a style prop carry the reveal stagger index without a cast to any. */
type Staggered = CSSProperties & Record<"--i", string>;
const step = (i: number): Staggered => ({ "--i": String(i) });

const TOTAL = CASES.items.length;
const LAST = TOTAL - 1;

export function Cases() {
  const uid = useId();
  const tabId = (i: number) => `${uid}-tab-${i}`;
  const panelId = (i: number) => `${uid}-panel-${i}`;

  const [active, setActive] = useState(0);

  const scrollRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  /* Park the underline under the live tab. Measured rather than
     derived from percentages: the labels are different lengths, and
     equal-width columns would squash "Emergency response". */
  useEffect(() => {
    const strip = stripRef.current;
    const scroller = scrollRef.current;
    if (!strip || !scroller) return;

    const place = () => {
      const tab = tabRefs.current[active];
      if (!tab) return;

      strip.style.setProperty("--ink-x", `${tab.offsetLeft}px`);
      strip.style.setProperty("--ink-w", `${tab.offsetWidth}px`);

      /* Narrow screens scroll the strip sideways. Nudge the live tab
         into view by hand — scrollIntoView would take the page's
         vertical position with it. */
      if (scroller.scrollWidth > scroller.clientWidth) {
        scroller.scrollTo({
          left: tab.offsetLeft + tab.offsetWidth / 2 - scroller.clientWidth / 2,
          behavior: prefersReducedMotion() ? "auto" : "smooth",
        });
      }
    };

    place();

    /* The underline only starts sliding once it has been put somewhere,
       so the first paint does not animate it out of the left corner. */
    const frame = requestAnimationFrame(() => {
      strip.dataset.ready = "true";
    });

    /* Watching every tab, not just the strip: the font swap resizes the
       labels without changing the width of the strip around them. */
    const resize = new ResizeObserver(place);
    resize.observe(strip);
    for (const tab of tabRefs.current) if (tab) resize.observe(tab);

    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
    };
  }, [active]);

  /* The pager wraps rather than dead-ending on a disabled arrow. */
  const go = (delta: number) => {
    setActive((i) => (i + delta + TOTAL) % TOTAL);
  };

  /* Automatic activation: arrowing along the strip selects as it goes,
     which is the expected behaviour when the panels are already loaded. */
  const onTabKey = (event: KeyboardEvent<HTMLButtonElement>) => {
    const next =
      event.key === "ArrowRight"
        ? (active + 1) % TOTAL
        : event.key === "ArrowLeft"
          ? (active + LAST) % TOTAL
          : event.key === "Home"
            ? 0
            : event.key === "End"
              ? LAST
              : null;

    if (next === null) return;

    event.preventDefault();
    setActive(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <section
      id="cases"
      className="section section--panel cases"
      aria-labelledby="cases-title"
      data-rv
    >
      <div className="wrap">
        <div className="sec-head cases__head">
          <span className="eyebrow rv rv--fade">
            <span className="eyebrow__mark">
              <BrandMark />
            </span>
            <span className="eyebrow__label">{CASES.eyebrow}</span>
          </span>

          <h2 className="h2 cases__title" id="cases-title">
            {CASES.title.map((line, i) => (
              <span className="line-rise" key={line} style={step(i)}>
                <span>{i === 0 ? line : <strong>{line}</strong>}</span>
              </span>
            ))}
          </h2>

          <p className="lede lede--center rv rv--sm" style={step(2)}>
            {CASES.lede}
          </p>
        </div>

        <div className="cases__tabsWrap rv rv--sm" style={step(3)}>
          <div className="cases__scroll" ref={scrollRef}>
            {/* The strip is the positioning context the underline is
                measured against; the tablist itself owns only tabs. */}
            <div className="cases__strip" ref={stripRef}>
              <div className="cases__tabs" role="tablist" aria-label={CASES.eyebrow}>
                {CASES.tabs.map((label, i) => (
                  <button
                    key={label}
                    type="button"
                    role="tab"
                    id={tabId(i)}
                    className="cases__tab"
                    aria-selected={i === active}
                    aria-controls={panelId(i)}
                    tabIndex={i === active ? 0 : -1}
                    ref={(el) => {
                      tabRefs.current[i] = el;
                    }}
                    onClick={() => setActive(i)}
                    onKeyDown={onTabKey}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <span className="cases__ink" aria-hidden="true" />
            </div>
          </div>
        </div>

        {/* The tab strip is announced by the roles; this covers the
            pager, which changes the same index from somewhere else. */}
        <p className="sr" role="status" aria-live="polite">
          {LABELS.status(CASES.tabs[active], active + 1, TOTAL)}
        </p>

        <div className="cases__body">
          <div className="cases__photo card rv rv--pop" style={step(4)}>
            <div className="cases__frame">
              {CASES.items.map((item, i) => {
                const photo = PHOTOS.cases[item.key];

                return (
                  <span
                    key={item.key}
                    className="cases__shot"
                    data-on={i === active ? "true" : undefined}
                    aria-hidden={i === active ? undefined : true}
                  >
                    <Image
                      className="cases__img"
                      src={photo.src}
                      alt={photo.alt}
                      fill
                      sizes="(max-width: 900px) 92vw, 420px"
                    />
                  </span>
                );
              })}
            </div>

            <div className="cases__pager">
              <button
                type="button"
                className="icon-btn"
                aria-label={LABELS.prev}
                onClick={() => go(-1)}
              >
                <ArrowLeft />
              </button>

              {/* The live region above carries the position for AT. */}
              <span className="counter cases__count" aria-hidden="true">
                {pad2(active + 1)}
                <em>/{pad2(TOTAL)}</em>
              </span>

              <button
                type="button"
                className="icon-btn"
                aria-label={LABELS.next}
                onClick={() => go(1)}
              >
                <ArrowRight />
              </button>
            </div>
          </div>

          <div className="cases__story rv rv--sm" style={step(5)}>
            {CASES.items.map((item, i) => (
              <div
                key={item.key}
                id={panelId(i)}
                role="tabpanel"
                aria-labelledby={tabId(i)}
                tabIndex={0}
                className="cases__panel"
                data-on={i === active ? "true" : undefined}
                data-accent={item.accent}
              >
                <div className="cases__stack">
                  {/* The deck behind the card: furthest first, so the
                      live card paints over both. Decoration only. */}
                  <span className="cases__ghost cases__ghost--b" aria-hidden="true" />
                  <span className="cases__ghost cases__ghost--a" aria-hidden="true" />

                  <article className="cases__card card">
                    <span className="cases__mark" aria-hidden="true">
                      <span className="cases__markBar" />
                      <span className="cases__markDot" />
                      <span className="cases__markDot" />
                    </span>

                    <h3 className="h3 cases__caseTitle">
                      {item.title.map((line) => (
                        <span key={line}>{line}</span>
                      ))}
                    </h3>

                    <p className="cases__copy">{item.copy}</p>

                    <div className="cases__work">
                      <p className="cases__label">{LABELS.did}</p>
                      <ul className="ticks cases__did">
                        {item.did.map((entry) => (
                          <li key={entry}>
                            <span className="tick">
                              <Check />
                            </span>
                            {entry}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Typographic decoration, drawn by CSS so no copy
                        lives outside the content module. */}
                    <span className="cases__quote" aria-hidden="true" />
                  </article>
                </div>

                <p className="meta cases__caption">{item.caption}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
