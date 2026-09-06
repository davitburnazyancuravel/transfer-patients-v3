import { TICKER } from "@/lib/content";

/* ============================================================
   Ticker — the full-bleed word strip between the crew and the
   partners. It is texture rather than reading matter: the eye
   catches two or three services and moves on.

   Server component; the loop is pure CSS, so nothing here needs
   to reach the client.
   ============================================================ */

/* The strapline sits last in TICKER by convention, and it is the
   single entry that takes the accent — one spot of colour keeps
   the strip from reading as wallpaper. */
const ACCENT_INDEX = TICKER.length - 1;

type TrackProps = {
  /** The second copy of the track exists only to close the loop. */
  decorative?: boolean;
};

function Track({ decorative = false }: TrackProps) {
  return (
    <ul
      className="marquee__track tk__track"
      aria-hidden={decorative ? true : undefined}
    >
      {TICKER.map((entry, i) => (
        <li className="tk__item" key={entry}>
          <span
            className={
              i === ACCENT_INDEX ? "tk__word tk__word--accent" : "tk__word"
            }
          >
            {entry}
          </span>
          {/* Punctuation between entries, never announced. */}
          <span className="tk__slash" aria-hidden="true">
            /
          </span>
        </li>
      ))}
    </ul>
  );
}

export function Ticker() {
  return (
    <section className="tk" data-rv>
      <div className="marquee tk__marquee rv rv--fade">
        {/* The first track is the real list a screen reader hears. */}
        <Track />
        <Track decorative />
      </div>
    </section>
  );
}
