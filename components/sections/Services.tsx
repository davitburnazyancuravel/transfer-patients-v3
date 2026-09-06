"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { BrandMark } from "@/components/BrandMark";
import { ArrowRight, Check } from "@/components/ui/icons";
import { SERVICES } from "@/lib/content";
import { PHOTOS } from "@/lib/media";
import { clamp, pad2 } from "@/lib/util";

/* ============================================================
   Services — the numbered stepper.

   Five services, one at a time. On a wide screen the stage pins
   itself and the reader's own scroll walks the rail: the track
   is five viewports tall, the hairline fills to the live step,
   and the photograph/copy pair crossfades underneath it. Nothing
   is animated frame-by-frame — JS only decides *which* of the
   five is live, and CSS transitions everything else.

   Below 900px, and whenever the reader has asked for less
   motion, the mechanism is abandoned outright: the five become a
   plain stacked list with every item on screen at once.

   That choice lives in `mode`, and it also governs honesty
   towards assistive tech — four items may only be hidden from
   the accessibility tree while they are genuinely invisible.
   `mode` therefore starts at "list", so the server-rendered
   markup and a browser with JavaScript switched off both expose
   the whole set.
   ============================================================ */

type Mode = "list" | "pinned";

const COUNT = SERVICES.items.length;
const LAST = COUNT - 1;

/* Below this the two-column stage has no room to be worth pinning. */
const WIDE_ENOUGH = "(min-width: 900px)";
const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

/* How many of an item's points the card over the photo repeats. */
const FACT_COUNT = 2;

/* ------------------------------------------------------------
   Copy that lib/content.ts has no key for yet.

   Every other visible string in this file comes from SERVICES.
   This one is the stepper's per-item affordance; it belongs in
   SERVICES alongside `cta` (as `how`, say) the moment that file
   can be edited. Nothing else here should ever be inlined.
   ------------------------------------------------------------ */
const PENDING_COPY = { how: "See how it works" } as const;

export function Services() {
  const [mode, setMode] = useState<Mode>("list");
  const [active, setActive] = useState(0);

  /* The scroll handler reads the live index without re-subscribing
     every time it changes. */
  const activeRef = useRef(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);

  /* ---- Which mode we are in ------------------------------- */
  /* A media decision, so the server cannot make it: it renders the
     honest fallback and the client upgrades. Both queries stay
     subscribed, because a reader can rotate a tablet or change the
     motion setting mid-visit. */
  useEffect(() => {
    const wide = window.matchMedia(WIDE_ENOUGH);
    const still = window.matchMedia(REDUCED_MOTION);

    const sync = () => {
      const pinned = wide.matches && !still.matches;
      setMode(pinned ? "pinned" : "list");

      /* Falling back to the list leaves no rail to point at. */
      if (!pinned) {
        activeRef.current = 0;
        setActive(0);
      }
    };

    sync();
    wide.addEventListener("change", sync);
    still.addEventListener("change", sync);

    return () => {
      wide.removeEventListener("change", sync);
      still.removeEventListener("change", sync);
    };
  }, []);

  /* ---- Scrubbing the stepper ------------------------------ */
  /* One rAF-throttled read per frame, and a state write only on the
     four frames where the step actually changes. */
  useEffect(() => {
    if (mode !== "pinned") return;

    const track = trackRef.current;
    const sticky = stickyRef.current;
    if (!track || !sticky) return;

    let frame = 0;
    let pinTop = 0;

    /* Where the stage comes to rest. Read from the sticky element
       itself so the offset stays a CSS decision. */
    const readPinTop = () => {
      const top = Number.parseFloat(window.getComputedStyle(sticky).top);
      pinTop = Number.isFinite(top) ? top : 0;
    };

    const measure = () => {
      frame = 0;

      const rect = track.getBoundingClientRect();
      /* What is left of the track once the stage has pinned — the
         whole of the scrub, and zero before the stage is tall
         enough to pin at all. */
      const travel = rect.height - sticky.offsetHeight;
      if (travel <= 0) return;

      const progress = clamp((pinTop - rect.top) / travel, 0, 1);
      const next = Math.min(LAST, Math.floor(progress * COUNT));
      if (next === activeRef.current) return;

      activeRef.current = next;
      setActive(next);
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(measure);
    };

    const onResize = () => {
      readPinTop();
      onScroll();
    };

    readPinTop();
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [mode]);

  const current = SERVICES.items[active];
  /* Fraction of the rail between the first and last dot that the
     accent has claimed. */
  const fill = String(active / LAST);

  return (
    <section
      id="services"
      className="section section--white svc"
      aria-labelledby="services-title"
      data-mode={mode}
      style={{ "--svc-count": String(COUNT) }}
      data-rv
    >
      <div className="wrap">
        <div className="sec-head svc__head">
          <span className="eyebrow rv rv--fade">
            <span className="eyebrow__mark">
              <BrandMark />
            </span>
            <span className="eyebrow__label">{SERVICES.eyebrow}</span>
          </span>

          <h2 className="h2 svc__title" id="services-title">
            {SERVICES.title.map((line, i) => (
              <span className="line-rise" key={line} style={{ "--i": String(i) }}>
                <span>{i === 1 ? <strong>{line}</strong> : line}</span>
              </span>
            ))}
          </h2>

          <p className="lede rv rv--sm" style={{ "--i": "2" }}>
            {SERVICES.lede}
          </p>
        </div>

        {/* The tall part. In list mode it collapses to the height of
            its own contents and the sticky child never pins. */}
        <div className="svc__track" ref={trackRef}>
          <div className="svc__sticky" ref={stickyRef}>
            <div className="svc__stage">
              {/* Bare digits down a hairline say nothing useful when
                  read aloud; the live region below carries the change
                  and the headings carry the structure. */}
              <ol
                className="svc__rail rv rv--fade"
                style={{ "--fill": fill, "--i": "3" }}
                data-accent={current.accent}
                aria-hidden="true"
              >
                {SERVICES.items.map((item, i) => (
                  <li
                    className="svc__step"
                    key={item.key}
                    data-on={i === active}
                    data-done={i < active}
                  >
                    <span className="svc__dot">{i + 1}</span>
                  </li>
                ))}
              </ol>

              <div className="svc__items">
                {SERVICES.items.map((item, i) => {
                  const photo = PHOTOS.services[item.key];
                  const on = i === active;
                  /* Out of the accessibility tree only while the
                     stepper is genuinely showing one at a time. */
                  const gone = mode === "pinned" && !on;

                  return (
                    <article
                      className="svc__item"
                      key={item.key}
                      data-accent={item.accent}
                      data-on={on}
                      aria-hidden={gone || undefined}
                    >
                      <div className="svc__media">
                        <div className="svc__frame">
                          <span className="svc__plate" aria-hidden="true" />

                          <div className="svc__shot">
                            <Image
                              className="svc__img"
                              src={photo.src}
                              alt={photo.alt}
                              fill
                              sizes="(min-width: 1240px) 440px, (min-width: 900px) 38vw, (min-width: 560px) 460px, 88vw"
                            />

                            <p className="svc__chip">
                              <span className="svc__chipDot" aria-hidden="true" />
                              {item.chip}
                            </p>

                            {/* Repeats the first two ticks below, so
                                it is decoration on the photograph
                                rather than something to read twice. */}
                            <ul className="svc__facts" aria-hidden="true">
                              {item.points.slice(0, FACT_COUNT).map((point) => (
                                <li className="svc__fact" key={point}>
                                  {point}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div className="svc__copy">
                        <p className="svc__lead">
                          {/* Carries the step number where the rail
                              cannot — the stacked list has none. */}
                          <span className="svc__num">{pad2(i + 1)}</span>
                          <span className="svc__kicker">{item.headline}</span>
                        </p>

                        <h3 className="svc__name">{item.name}</h3>
                        <p className="svc__text">{item.copy}</p>

                        <ul className="ticks svc__ticks">
                          {item.points.map((point) => (
                            <li key={point}>
                              <span className="tick" aria-hidden="true">
                                <Check />
                              </span>
                              {point}
                            </li>
                          ))}
                        </ul>

                        <a
                          className="btn btn--ghost svc__more"
                          href={SERVICES.cta.href}
                          aria-label={item.enquire}
                          tabIndex={gone ? -1 : undefined}
                        >
                          {PENDING_COPY.how}
                          <span className="btn__arrow" aria-hidden="true">
                            <ArrowRight />
                          </span>
                        </a>
                      </div>
                    </article>
                  );
                })}
              </div>

              {/* Mounted only while the stepper can change, so the
                  list never leaves a stray status line behind. */}
              {mode === "pinned" ? (
                <p className="sr" role="status" aria-live="polite">
                  {current.name}
                </p>
              ) : null}
            </div>
          </div>
        </div>

        <div className="svc__cta rv rv--sm">
          <a className="btn btn--primary" href={SERVICES.cta.href}>
            {SERVICES.cta.label}
            <span className="btn__arrow" aria-hidden="true">
              <ArrowRight />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
