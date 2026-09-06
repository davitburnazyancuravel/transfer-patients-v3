"use client";

/* ============================================================
   Contact — the closing banner.

   One photograph in a rounded card and nothing else: badge,
   two-line heading, lede, the email field and the consent line,
   all stacked down the centre. Along with the hero this is the
   only dark surface on the page, and it is dark because it is a
   photograph — not because it is a panel.

   Why the whole module is "use client": the request field needs
   state, and this section is allowed exactly one file. Everything
   around <RequestForm /> is static markup and would happily be a
   server component again the moment the field can move into its
   own module (components/RequestForm.tsx) — that is the only
   change needed to shrink the boundary.
   ============================================================ */

import Image from "next/image";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";

import { ArrowRight } from "@/components/ui/icons";
import { CONTACT } from "@/lib/content";
import { PHOTOS } from "@/lib/media";

/* ------------------------------------------------------------
   Copy that lib/content.ts does not carry yet.

   Every other visible string in this file comes from CONTACT.
   `titleAccent` is the second, accent-coloured half of the
   heading the reference frame shows under CONTACT.title, and
   `invalid` is the field's validation message. Both belong in
   CONTACT — the first as a second entry in `title`, the second
   as an `invalid` key — as soon as that file can be edited.
   ------------------------------------------------------------ */
const PENDING_COPY = {
  titleAccent: "Care that never pauses",
  invalid: "Please enter a valid email address.",
} as const;

/* Shape check only. Deliverability is the endpoint's problem, not
   the browser's, so we keep this deliberately permissive — the same
   test the newsletter field uses. */
const EMAIL_SHAPE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type FormState = "idle" | "invalid" | "sent";

/* ------------------------------------------------------------
   Request form
   ------------------------------------------------------------ */

function RequestForm() {
  const uid = useId();
  const emailId = `${uid}-email`;
  const statusId = `${uid}-status`;

  const [email, setEmail] = useState("");
  const [state, setState] = useState<FormState>("idle");

  const inputRef = useRef<HTMLInputElement>(null);
  const doneRef = useRef<HTMLParagraphElement>(null);
  /* Only move focus in response to a submit or a restore, never on
     the first paint — otherwise mounting the section would yank the
     reader down the page. */
  const settled = useRef(false);

  useEffect(() => {
    if (!settled.current) return;
    settled.current = false;

    /* The control that had focus has just been unmounted, so hand it
       on deliberately rather than dropping the user back at <body>. */
    if (state === "sent") doneRef.current?.focus();
    else inputRef.current?.focus();
  }, [state]);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!EMAIL_SHAPE.test(email.trim())) {
      setState("invalid");
      return;
    }

    /* ---------------------------------------------------------
       THE REAL DISPATCH ENDPOINT GOES HERE.
       Replace this line with the POST — a server action, or
       fetch("/api/transfer-request", { method: "POST", body: … })
       — and only flip to "sent" once it resolves, adding a
       "sending" state for the pending window. The address is held
       in component state and transmitted nowhere today.
       --------------------------------------------------------- */
    settled.current = true;
    setState("sent");
  };

  const restore = () => {
    setEmail("");
    settled.current = true;
    setState("idle");
  };

  if (state === "sent") {
    return (
      <div className="cta__done">
        {/* Focused on arrival, which is what announces it — a live
            region mounted at the same moment is not reliably read. */}
        <p className="cta__doneText" ref={doneRef} tabIndex={-1}>
          {CONTACT.done}
        </p>
        <button type="button" className="cta__again" onClick={restore}>
          {CONTACT.again}
        </button>
      </div>
    );
  }

  return (
    <>
      <form
        className="cta__form"
        onSubmit={onSubmit}
        noValidate
        data-invalid={state === "invalid" ? "true" : undefined}
      >
        <label className="sr" htmlFor={emailId}>
          {CONTACT.placeholder}
        </label>

        <input
          id={emailId}
          ref={inputRef}
          className="cta__input"
          type="email"
          name="email"
          inputMode="email"
          autoComplete="email"
          placeholder={CONTACT.placeholder}
          value={email}
          aria-invalid={state === "invalid"}
          aria-describedby={state === "invalid" ? statusId : undefined}
          onChange={(event) => {
            setEmail(event.target.value);
            /* Drop the complaint the moment they start fixing it. */
            if (state === "invalid") setState("idle");
          }}
        />

        <button type="submit" className="btn btn--primary cta__submit">
          {CONTACT.submit}
          <span className="btn__arrow">
            <ArrowRight />
          </span>
        </button>
      </form>

      {/* Always mounted so the live region exists before it fills.
          An empty <p> generates no line box, so it costs no space. */}
      <p
        id={statusId}
        className="cta__status"
        role="status"
        aria-live="polite"
      >
        {state === "invalid" ? PENDING_COPY.invalid : null}
      </p>

      <p className="cta__consent rv rv--sm" style={{ "--i": "6" }}>
        {CONTACT.consent}{" "}
        <a className="cta__consentLink" href="#">
          {CONTACT.consentLink}
        </a>
      </p>
    </>
  );
}

/* ------------------------------------------------------------
   Section
   ------------------------------------------------------------ */

export function Contact() {
  return (
    <section id="contact" className="section cta" aria-labelledby="cta-title" data-rv>
      <div className="wrap wrap--wide">
        <div className="cta__frame">
          <Image
            className="cta__photo"
            src={PHOTOS.cta.src}
            alt={PHOTOS.cta.alt}
            fill
            sizes="(min-width: 1460px) 1300px, 100vw"
          />

          {/* One scrim, denser through the middle where the copy sits
              and easing off towards the corners, so the photograph
              still reads as a photograph at its edges. */}
          <div className="cta__scrim" aria-hidden="true" />

          <div className="cta__inner">
            <p className="cta__badge rv rv--sm" style={{ "--i": "0" }}>
              <span className="cta__badge-value">{CONTACT.badge.value}</span>
              <span className="cta__badge-label">{CONTACT.badge.label}</span>
            </p>

            <h2 className="cta__title" id="cta-title">
              {CONTACT.title.map((line, i) => (
                <span className="line-rise cta__line" key={line} style={{ "--i": String(i + 1) }}>
                  <span>{line}</span>
                </span>
              ))}

              {/* The closing half, in the brighter step of the accent —
                  see the note on .cta__line--accent in contact.css. */}
              <span
                className="line-rise cta__line cta__line--accent"
                style={{ "--i": String(CONTACT.title.length + 1) }}
              >
                <span>{PENDING_COPY.titleAccent}</span>
              </span>
            </h2>

            <p className="lede cta__lede rv" style={{ "--i": "4" }}>
              {CONTACT.lede}
            </p>

            <div className="cta__act rv" style={{ "--i": "5" }}>
              <RequestForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
