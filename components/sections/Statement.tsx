"use client";

import { Fragment, useEffect, useRef } from "react";

import { STATEMENT } from "@/lib/content";
import { clamp } from "@/lib/util";

/* ============================================================
   Statement — the sentence the scroll reads aloud.

   One paragraph, centred on the bare ground, with more empty
   space around it than copy inside it. Every word starts at
   --ghost and warms as the section travels up the viewport, so
   the reader's own scrolling is what speaks the line. The
   phrases in STATEMENT.emphasis are ink from the first frame:
   they carry the argument, the rest is grammar catching up.

   The whole effect costs one style write per frame. JS knows
   only how far the section has travelled (--p, 0 → 1); CSS
   derives all twenty-odd word colours from it. Nothing here
   touches layout, so a frame is a repaint and no more.

   This module is client-side because it needs a scroll
   listener — but only the listener is dynamic. The sentence is
   split, matched and rendered during SSR, so the markup ships
   complete and readable before hydration.
   ============================================================ */

type Word = {
  readonly text: string;
  /** Part of an emphasis phrase — ink throughout, never revealed. */
  readonly anchor: boolean;
};

const WHITESPACE = /\s+/;
const PUNCTUATION_ONLY = /^[^\p{L}\p{N}]+$/u;

/** Comparison key for phrase matching: letters and digits only. */
const key = (s: string): string => s.toLowerCase().replace(/[^\p{L}\p{N}]/gu, "");

function buildWords(text: string, emphasis: readonly string[]): readonly Word[] {
  /* Tie a lone dash to the word before it with a no-break space.
     Punctuation should never open a line, and it should never burn
     a beat of the reveal on its own. */
  const tokens: string[] = [];
  for (const raw of text.split(WHITESPACE)) {
    if (!raw) continue;
    const last = tokens.length - 1;
    if (last >= 0 && PUNCTUATION_ONLY.test(raw)) tokens[last] = `${tokens[last]}\u00A0${raw}`;
    else tokens.push(raw);
  }

  /* Emphasis is written as phrases, not indices, so the client can
     re-word the sentence in content.ts and the anchors follow. */
  const keys = tokens.map(key);
  const anchored = tokens.map(() => false);

  for (const phrase of emphasis) {
    const needle = phrase.split(WHITESPACE).map(key).filter(Boolean);
    if (needle.length === 0) continue;

    for (let i = 0; i + needle.length <= keys.length; i += 1) {
      if (needle.some((part, j) => keys[i + j] !== part)) continue;
      for (let j = 0; j < needle.length; j += 1) anchored[i + j] = true;
    }
  }

  return tokens.map((word, i) => ({ text: word, anchor: anchored[i] === true }));
}

const WORDS = buildWords(STATEMENT.text, STATEMENT.emphasis);

/* Where the reveal opens: the section's top crossing this fraction
   down the viewport. It must close by the moment the section's
   bottom reaches the viewport floor. */
const OPENS_AT = 0.82;
/* Floor on the travel distance, so a section shorter than the
   viewport still resolves over a comfortable stretch of scroll. */
const MIN_TRAVEL = 0.4;
/* Below this, a fresh reading is not worth the style write. */
const STEP = 0.002;

export function Statement() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    /* Reduced motion: the CSS has already settled every word at ink.
       We attach nothing at all. */
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    let last = -1;

    const measure = () => {
      frame = 0;

      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight || 1;

      const from = vh * OPENS_AT;
      const to = vh - rect.height;
      const travel = Math.max(from - to, vh * MIN_TRAVEL);
      const p = clamp((from - rect.top) / travel, 0, 1);

      if (!Number.isFinite(p) || Math.abs(p - last) < STEP) return;
      last = p;
      el.style.setProperty("--p", p.toFixed(4));
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section ref={ref} className="section stmt" style={{ "--total": WORDS.length }}>
      <div className="wrap">
        <p className="stmt__text">
          {WORDS.map((word, i) => (
            <Fragment key={`${i}-${word.text}`}>
              {i > 0 ? " " : null}
              <span
                className={word.anchor ? "stmt__w stmt__w--anchor" : "stmt__w"}
                style={{ "--w": i }}
              >
                {word.text}
              </span>
            </Fragment>
          ))}
        </p>
      </div>
    </section>
  );
}
