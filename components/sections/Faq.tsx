"use client";

/* ============================================================
   FAQ — the partner accordion.

   Two columns on white: a sticky title block on the left that
   holds its place while the questions travel past it, and the
   accordion itself on the right — pale rounded bars, each with
   a round accent plate that turns its plus into a cross when the
   row opens.

   One row at a time is open, but "all closed" is a legal state:
   clicking the open row shuts it rather than refusing. The first
   row is open on arrival so the pattern explains itself without
   anyone having to click.

   The panel height is animated with grid-template-rows 0fr → 1fr,
   so the answer measures itself and no JavaScript ever touches a
   pixel value. The only reason this file is a client component is
   the single piece of open/closed state.
   ============================================================ */

import { useId, useState, type CSSProperties } from "react";

import { BrandMark } from "@/components/BrandMark";
import { ArrowRight, Plus } from "@/components/ui/icons";
import { PARTNERS } from "@/lib/content";

/** Lets a style prop carry the reveal stagger index without a cast to any. */
type Staggered = CSSProperties & Record<"--i", string>;
const step = (i: number): Staggered => ({ "--i": String(i) });

/* Open row, by index. null is "all closed", which the user is
   allowed to reach by clicking the row that is already open. */
type OpenIndex = number | null;

export function Faq() {
  const uid = useId();
  const [open, setOpen] = useState<OpenIndex>(0);

  return (
    <section
      id="faq"
      className="section section--white faq"
      aria-labelledby="faq-title"
      data-rv
    >
      <div className="wrap faq__grid">
        <div className="faq__aside">
          <div className="sec-head sec-head--left faq__head">
            <span className="eyebrow rv rv--fade" style={step(0)}>
              <span className="eyebrow__mark">
                <BrandMark />
              </span>
              <span className="eyebrow__label">{PARTNERS.faqEyebrow}</span>
            </span>

            {/* First line muted, second ink — the house split heading. */}
            <h2 className="h2 faq__title" id="faq-title">
              {PARTNERS.faqTitle.map((line, i) => (
                <span className="line-rise" key={line} style={step(i)}>
                  <span>{i === 0 ? line : <strong>{line}</strong>}</span>
                </span>
              ))}
            </h2>

            <a
              className="btn btn--primary faq__cta rv rv--sm"
              style={step(2)}
              href={PARTNERS.cta.href}
            >
              {PARTNERS.cta.label}
              <span className="btn__arrow" aria-hidden="true">
                <ArrowRight />
              </span>
            </a>
          </div>
        </div>

        <ul className="faq__list">
          {PARTNERS.faq.map((entry, i) => {
            const isOpen = open === i;
            const buttonId = `${uid}-q${i}`;
            const panelId = `${uid}-a${i}`;

            return (
              <li
                key={entry.q}
                className="faq__item rv rv--sm"
                style={step(i)}
                data-open={isOpen ? "true" : "false"}
              >
                {/* Heading-wrapped control: the questions stay in the
                    document outline, so a screen reader can list them
                    without opening a single row. */}
                <h3 className="faq__qHead">
                  <button
                    type="button"
                    id={buttonId}
                    className="faq__btn"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    /* Toggling to null is deliberate — a reader who has
                       finished with an answer can put it away. Enter and
                       Space come free with the native button, and arrow
                       keys are left to the browser. */
                    onClick={() => setOpen(isOpen ? null : i)}
                  >
                    <span className="faq__q">{entry.q}</span>
                    <span className="faq__plus" aria-hidden="true">
                      <Plus />
                    </span>
                  </button>
                </h3>

                <div
                  id={panelId}
                  className="faq__panel"
                  role="region"
                  aria-labelledby={buttonId}
                >
                  {/* The clipping box. It owns no spacing of its own so
                      that it can collapse to a true zero height. */}
                  <div className="faq__panelInner">
                    <p className="faq__a">{entry.a}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
