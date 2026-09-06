"use client";

/* ============================================================
   Footer.

   Sits on the plate's own --ground, so there is no seam where the
   last section ends. The one piece of weight in the block is the
   ghost wordmark, which deliberately runs past the bottom of the
   plate — .plate has overflow:clip, so the plate's rounded corner
   is what crops it.

   Why the whole module is "use client": the newsletter form needs
   state, and this section is allowed exactly one file. Everything
   outside <Newsletter /> is static markup and would happily be a
   server component again the moment the form can move into its own
   module (components/NewsletterForm.tsx) — that is the only change
   needed to shrink the boundary.
   ============================================================ */

import { useEffect, useId, useRef, useState, type FormEvent } from "react";

import { BrandMark } from "@/components/BrandMark";
import { ArrowRight } from "@/components/ui/icons";
import { FOOTER, SITE } from "@/lib/content";

/* ------------------------------------------------------------
   Copy that lib/content.ts does not carry yet.

   Every other visible string in this file comes from FOOTER/SITE.
   These two are the newsletter's response states, which the content
   module has no keys for; they belong in FOOTER alongside
   `subscribe` as soon as that file can be edited.
   ------------------------------------------------------------ */
const PENDING_COPY = {
  invalid: "Please enter a valid email address.",
  done: "You’re on the list — service updates will land in your inbox.",
} as const;

/* Shape check only. Deliverability is the endpoint's problem, not
   the browser's, so we keep this deliberately permissive. */
const EMAIL_SHAPE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/* ------------------------------------------------------------
   Social marks.

   Authored here rather than in ui/icons.tsx because nothing else on
   the site links out. Each glyph is a single path so the tile can
   colour it with currentColor; the ones drawn as donuts (Instagram's
   frame, YouTube's play cut-out) rely on the even-odd fill rule.
   ------------------------------------------------------------ */
type Social = {
  readonly name: string;
  readonly href: string;
  readonly path: string;
  readonly fillRule?: "evenodd";
};

const SOCIALS: readonly Social[] = [
  {
    name: "LinkedIn",
    href: "#",
    path:
      "M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.4h4V21H3V9.4Zm7 0h3.8v1.6a4.2 4.2 0 0 1 3.7-1.9c2.6 0 4.5 1.7 4.5 5.3V21h-4v-6c0-1.5-.6-2.5-1.9-2.5-1 0-1.6.7-1.9 1.4-.1.2-.1.6-.1.9V21h-4V9.4Z",
  },
  {
    name: "X",
    href: "#",
    path:
      "M18.9 2.4h3.4l-7.4 8.4L23.6 22h-6.8l-5.3-6.9L5.4 22H2l7.9-9L1.6 2.4h7l4.8 6.3 5.5-6.3Zm-1.2 17.6h1.9L7.4 4.3H5.4l12.3 15.7Z",
  },
  {
    name: "Instagram",
    href: "#",
    fillRule: "evenodd",
    path:
      "M8 2h8a6 6 0 0 1 6 6v8a6 6 0 0 1-6 6H8a6 6 0 0 1-6-6V8a6 6 0 0 1 6-6Zm0 2a4 4 0 0 0-4 4v8a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4V8a4 4 0 0 0-4-4H8Zm4 3a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm5.4-3.3a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5Z",
  },
  {
    name: "YouTube",
    href: "#",
    fillRule: "evenodd",
    path:
      "M19.83 5.43A2.5 2.5 0 0 1 21.6 7.2c.4 1.59.4 4.8.4 4.8s0 3.21-.4 4.8a2.5 2.5 0 0 1-1.77 1.77C18.25 19 12 19 12 19s-6.25 0-7.83-.43A2.5 2.5 0 0 1 2.4 16.8C2 15.21 2 12 2 12s0-3.21.4-4.8a2.5 2.5 0 0 1 1.77-1.77C5.75 5 12 5 12 5s6.25 0 7.83.43ZM10 8.8v6.4l5.2-3.2L10 8.8Z",
  },
];

/* ------------------------------------------------------------
   Newsletter
   ------------------------------------------------------------ */

function Newsletter() {
  const uid = useId();
  const emailId = `${uid}-email`;
  const statusId = `${uid}-status`;

  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "invalid" | "sent">("idle");
  const statusRef = useRef<HTMLParagraphElement>(null);

  /* The submit button vanishes with the form, so send focus to the
     confirmation rather than dropping the user back at the body. */
  useEffect(() => {
    if (state === "sent") statusRef.current?.focus();
  }, [state]);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!EMAIL_SHAPE.test(email.trim())) {
      setState("invalid");
      return;
    }

    /* ---------------------------------------------------------
       THE REAL SUBSCRIPTION ENDPOINT GOES HERE.
       Replace this line with the POST — a server action, or
       fetch("/api/newsletter", { method: "POST", body: … }) — and
       only flip to "sent" once it resolves, adding a "sending"
       state for the pending window. Nothing is transmitted today.
       --------------------------------------------------------- */
    setState("sent");
  };

  return (
    <div className="ft__news rv rv--sm" style={{ "--i": "2" }}>
      {state !== "sent" ? (
        <form
          className="ft__form"
          onSubmit={onSubmit}
          noValidate
          data-invalid={state === "invalid" ? "true" : undefined}
        >
          <label className="sr" htmlFor={emailId}>
            {FOOTER.emailPlaceholder}
          </label>

          <input
            id={emailId}
            className="ft__input"
            type="email"
            name="email"
            inputMode="email"
            autoComplete="email"
            placeholder={FOOTER.emailPlaceholder}
            value={email}
            aria-invalid={state === "invalid"}
            aria-describedby={state === "invalid" ? statusId : undefined}
            onChange={(event) => {
              setEmail(event.target.value);
              /* Clear the complaint as soon as they start fixing it. */
              if (state === "invalid") setState("idle");
            }}
          />

          <button type="submit" className="btn btn--primary ft__submit">
            {FOOTER.subscribe}
            <span className="btn__arrow">
              <ArrowRight />
            </span>
          </button>
        </form>
      ) : null}

      {/* Always mounted, so the live region exists before it fills.
          An empty <p> generates no line box, so it costs no space. */}
      <p
        id={statusId}
        ref={statusRef}
        className="ft__status"
        data-state={state}
        role="status"
        aria-live="polite"
        tabIndex={state === "sent" ? -1 : undefined}
      >
        {state === "invalid" ? PENDING_COPY.invalid : null}
        {state === "sent" ? PENDING_COPY.done : null}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------
   Footer
   ------------------------------------------------------------ */

export function Footer() {
  return (
    <footer className="section ft" data-rv>
      <div className="wrap wrap--wide ft__top">
        <div className="ft__brand">
          <div className="ft__logo rv rv--sm" style={{ "--i": "0" }}>
            <BrandMark className="ft__mark" />
            <span className="ft__name">{SITE.name}</span>
          </div>

          <p className="ft__blurb rv rv--sm" style={{ "--i": "1" }}>
            {FOOTER.blurb}
          </p>

          <Newsletter />

          <ul className="ft__social rv rv--sm" style={{ "--i": "3" }}>
            {SOCIALS.map((social) => (
              <li key={social.name}>
                <a
                  className="ft__social-link"
                  href={social.href}
                  aria-label={social.name}
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                    <path
                      d={social.path}
                      fill="currentColor"
                      fillRule={social.fillRule}
                      clipRule={social.fillRule}
                    />
                  </svg>
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Headings carry the structure here; a labelled nav landmark
            would need a name the content module does not define. */}
        <div className="ft__cols">
          {FOOTER.columns.map((column, index) => (
            <div
              className="ft__col rv rv--sm"
              key={column.title}
              style={{ "--i": String(index + 1) }}
            >
              <h2 className="ft__col-title">{column.title}</h2>
              <ul className="ft__links">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a className="ft__link" href={link.href}>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="wrap wrap--wide ft__base rv rv--fade" style={{ "--i": "5" }}>
        <hr className="rule" />
        <div className="ft__legal">
          <p>{FOOTER.legal}</p>
          {/* No year on purpose. A year computed on the server bakes
              into the build and goes stale on 1 January; computing it
              on the client flashes or mismatches on hydration. A
              copyright line is valid without one. */}
          <p>© {SITE.name}</p>
        </div>
      </div>

      {/* Decoration. The plate's overflow:clip cuts the lower third,
          which is why the footer carries no bottom padding. */}
      <div className="wrap wrap--wide ft__ghost rv rv--fade" style={{ "--i": "6" }}>
        <span className="ft__wordmark" aria-hidden="true">
          {FOOTER.wordmark}
        </span>
      </div>
    </footer>
  );
}
