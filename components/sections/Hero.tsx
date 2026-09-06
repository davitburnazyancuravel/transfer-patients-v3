"use client";

/* The hero is the one section that never gets scrolled into view, so it
   cannot wait for the shared observer in SiteEffects to release it. That
   single mount effect is the only reason this file is a client component —
   everything else here is static markup. */

import Image from "next/image";
import { useEffect, useRef } from "react";

import { ArrowRight, Users } from "@/components/ui/icons";
import { HERO } from "@/lib/content";
import { PHOTOS } from "@/lib/media";
import { prefersReducedMotion } from "@/lib/util";

/* Enough repetitions to span the widest plate twice over; the marquee
   needs two identical tracks to loop without a seam. */
const MARQUEE_REPEATS = 8;
const MARQUEE_ITEMS = Array.from({ length: MARQUEE_REPEATS }, (_, i) => i);

function MarqueeTrack() {
  return (
    <div className="marquee__track">
      {MARQUEE_ITEMS.map((i) => (
        <span className="hero__mq-item" key={i}>
          {HERO.marquee}
          <span className="hero__mq-dot" />
        </span>
      ))}
    </div>
  );
}

export function Hero() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    /* A short beat after paint so the entrance reads as a sequence rather
       than as the page simply appearing. Reduced motion gets it instantly. */
    const delay = prefersReducedMotion() ? 0 : 140;
    const timer = window.setTimeout(() => root.classList.add("is-in"), delay);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <section
      id="hero"
      ref={rootRef}
      className="section section--flush hero"
      aria-labelledby="hero-title"
      data-rv
    >
      <div className="hero__frame">
        <Image
          className="hero__photo"
          src={PHOTOS.hero.src}
          alt={PHOTOS.hero.alt}
          fill
          sizes="100vw"
          priority
        />

        {/* Two scrims: the house left-to-right wash keeps the copy legible,
            the vertical one covers the header and the bottom edge. */}
        <div className="hero__wash" aria-hidden="true" />
        <div className="hero__scrim" aria-hidden="true" />

        <div className="wrap hero__inner">
          <div className="hero__copy">
            <p className="hero__badge rv rv--sm" style={{ "--i": "0" }}>
              <span className="hero__badge-mark" aria-hidden="true">
                <Users />
              </span>
              <span className="hero__badge-value">{HERO.badge.value}</span>
              <span className="hero__badge-label">{HERO.badge.label}</span>
            </p>

            <h1 className="hero__title" id="hero-title">
              {HERO.title.map((line, i) => (
                <span
                  className="line-rise hero__line"
                  key={line}
                  style={{ "--i": String(i + 1) }}
                >
                  <span>{line}</span>
                </span>
              ))}
            </h1>

            <p className="lede hero__lede rv" style={{ "--i": "5" }}>
              {HERO.lede}
            </p>

            <div className="hero__actions rv" style={{ "--i": "6" }}>
              <a className="btn btn--light" href={HERO.cta.href}>
                {HERO.cta.label}
                <span className="btn__arrow" aria-hidden="true">
                  <ArrowRight />
                </span>
              </a>
            </div>
          </div>

          <div className="hero__glass rv rv--pop" style={{ "--i": "7" }}>
            <div className="hero__figure">
              <span
                className="counter hero__figure-num"
                data-count={HERO.glass.stat}
                data-count-format="decimal1"
              >
                {HERO.glass.stat}
                {HERO.glass.unit}
              </span>
              <span className="hero__figure-cap">{HERO.glass.caption}</span>
            </div>

            <ul className="hero__chips">
              {HERO.glass.chips.map((chip, i) => (
                <li
                  className="chip hero__chip rv rv--sm"
                  key={chip}
                  style={{ "--i": String(9 + i) }}
                >
                  {chip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Flush under the photo: a hairline of colour that hands the eye on
          to the statement below. Decorative repetition, so the phrase is
          exposed to assistive tech exactly once. */}
      <div className="hero__strip">
        <p className="sr">{HERO.marquee}</p>
        <div className="marquee hero__mq" aria-hidden="true">
          <MarqueeTrack />
          <MarqueeTrack />
        </div>
      </div>
    </section>
  );
}
