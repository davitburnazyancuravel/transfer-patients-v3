"use client";

/* ============================================================
   Header.

   The bar has two faces and the CSS in styles/chrome.css owns both
   of them; this file's only job is to say which one applies, via
   data-solid on the root. Everything else — colour, the cross-fade,
   the sheet's travel — is a transition on a custom property, so
   nothing here animates anything by hand.

   Three pieces of behaviour live here:

   1. The face. An observer on the hero flips data-solid the moment
      the photograph's bottom edge clears the bar.
   2. The scroll-spy. This is the one bespoke IntersectionObserver
      the site allows: it is not an entrance reveal, it tracks which
      section is currently under the bar so the sliding underline
      can follow it. Entrance reveals still belong to SiteEffects.
   3. The mobile sheet, with the usual dialog manners — focus moved
      in, trapped while open, restored to the toggle on close, body
      scroll locked, Escape honoured.
   ============================================================ */

import { useCallback, useEffect, useId, useRef, useState } from "react";

import { BrandMark } from "@/components/BrandMark";
import { ArrowRight } from "@/components/ui/icons";
import { NAV, NAV_CTA, SITE } from "@/lib/content";

/* ------------------------------------------------------------
   Copy that lib/content.ts does not carry yet.

   NAV and NAV_CTA define the links; nothing in the content module
   names the two nav landmarks or the menu toggle. These three belong
   beside NAV as soon as that file can be edited — every other visible
   string in here comes from NAV / NAV_CTA / SITE.
   ------------------------------------------------------------ */
const CHROME_COPY = {
  navLabel: "Primary",
  openMenu: "Open menu",
  closeMenu: "Close menu",
} as const;

/* The hero owns the transparent face. Must match the id Hero.tsx
   renders; without it there is no photograph to sit on and the ink
   face is the only legible one. */
const HERO_ID = "hero";

/* Mirrors the breakpoint in styles/chrome.css. Past it the sheet is
   display:none, so an open menu has to be dismissed rather than left
   holding the body scroll lock. */
const DESKTOP_QUERY = "(min-width: 900px)";

/* Only reached if --header-h cannot be read off the document. */
const HEADER_FALLBACK = 76;

/* Section ids the spy watches, in the order the nav lists them.
   Document order is resolved from the DOM below, because the page
   does not lay these sections out in nav order. */
const SECTION_IDS = NAV.map((item) => item.href.slice(1));

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Reads the header height from the token so the observers measure
    against the same number the layout uses. */
function headerHeight(): number {
  const raw = getComputedStyle(document.documentElement).getPropertyValue("--header-h");
  const px = Number.parseFloat(raw);
  return Number.isFinite(px) ? px : HEADER_FALLBACK;
}

/** Focusable descendants that are actually rendered. The desktop nav
    and its CTA are display:none behind the breakpoint, and the trap
    must not hand focus to them while the sheet is down. */
function focusablesIn(root: HTMLElement): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (el) => el.getClientRects().length > 0
  );
}

export function Header() {
  const rootRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);

  /* Measured per link so the underline can be placed without reading
     the DOM during render. */
  const linkRefs = useRef(new Map<string, HTMLAnchorElement>());

  const sheetId = useId();

  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [bar, setBar] = useState<{ x: number; w: number } | null>(null);

  const closeMenu = useCallback((returnFocus: boolean) => {
    setOpen(false);
    /* Only when the user dismissed the sheet themselves. Following a
       link should leave focus on its way to the section, not snap it
       back to the control they just used. */
    if (returnFocus) burgerRef.current?.focus();
  }, []);

  /* ---- Face ------------------------------------------------
     The root is inset by the bar's own height, so the hero stops
     intersecting exactly as its last pixel passes under the bar. */
  useEffect(() => {
    const hero = document.getElementById(HERO_ID);

    if (!hero) {
      setSolid(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) setSolid(!entry.isIntersecting);
      },
      { rootMargin: `-${headerHeight()}px 0px 0px 0px`, threshold: 0 }
    );

    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  /* ---- Scroll-spy ------------------------------------------
     The "current" band runs from just under the bar down to a third
     of the viewport. Whichever watched section comes first in the
     document and touches that band is the current one, so the mark
     hands over only once the previous section has scrolled clean
     past the bar rather than the instant the next one appears. */
  useEffect(() => {
    const sections = SECTION_IDS.map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)
      .sort((a, b) =>
        a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
      );

    if (sections.length === 0) return;

    const inBand = new Set<string>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) inBand.add(entry.target.id);
          else inBand.delete(entry.target.id);
        }

        const current = sections.find((el) => inBand.has(el.id));
        setActiveId(current ? current.id : null);
      },
      { rootMargin: `-${headerHeight()}px 0px -67% 0px`, threshold: 0 }
    );

    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  /* ---- Underline geometry ----------------------------------
     One bar for the whole row, so it needs the active item's box in
     the list's own coordinates. Rects rather than offsets: the item
     is nested in an <li> and this stays correct whatever the row's
     positioning becomes later. */
  useEffect(() => {
    const list = listRef.current;
    const link = activeId ? linkRefs.current.get(activeId) : undefined;

    if (!list || !link) {
      setBar(null);
      return;
    }

    const measure = () => {
      const listBox = list.getBoundingClientRect();
      const linkBox = link.getBoundingClientRect();
      const x = Math.round(linkBox.left - listBox.left);
      const w = Math.round(linkBox.width);
      setBar((prev) => (prev && prev.x === x && prev.w === w ? prev : { x, w }));
    };

    measure();

    /* The row reflows on resize and again when the webfont swaps in;
       both move the item out from under the bar. */
    const observer = new ResizeObserver(measure);
    observer.observe(list);
    return () => observer.disconnect();
  }, [activeId]);

  /* ---- Sheet: focus ----------------------------------------
     The trap spans the whole header, not just the sheet: the brand
     and the toggle stay visible above it and belong in the loop. */
  useEffect(() => {
    if (!open) return;

    const root = rootRef.current;
    if (!root) return;

    /* One frame, so the sheet has left visibility:hidden before we
       try to put focus inside it. */
    const frame = window.requestAnimationFrame(() => {
      const sheet = sheetRef.current;
      const targets = sheet ? focusablesIn(sheet) : [];
      if (targets.length > 0) targets[0].focus();
    });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMenu(true);
        return;
      }

      if (event.key !== "Tab") return;

      const items = focusablesIn(root);
      if (items.length === 0) return;

      const first = items[0];
      const last = items[items.length - 1];
      const current = document.activeElement;
      const inside = current instanceof Node && root.contains(current);

      if (event.shiftKey && (!inside || current === first)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (!inside || current === last)) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      window.cancelAnimationFrame(frame);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, closeMenu]);

  /* ---- Sheet: scroll lock ---------------------------------- */
  useEffect(() => {
    if (!open) return;

    const { body } = document;
    const previous = body.style.overflow;
    body.style.overflow = "hidden";

    return () => {
      body.style.overflow = previous;
    };
  }, [open]);

  /* ---- Sheet: breakpoint ----------------------------------- */
  useEffect(() => {
    const query = window.matchMedia(DESKTOP_QUERY);

    /* Widening past the breakpoint takes the sheet away with CSS.
       Closing here keeps state honest and releases the scroll lock. */
    const onChange = (event: MediaQueryListEvent) => {
      if (event.matches) setOpen(false);
    };

    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return (
    <header
      ref={rootRef}
      className="hdr"
      data-solid={solid ? "true" : "false"}
      data-open={open ? "true" : "false"}
    >
      <div className="wrap hdr__inner">
        <a className="hdr__brand" href={`#${HERO_ID}`}>
          <BrandMark className="hdr__mark" />
          <span className="hdr__brandText">
            <span className="hdr__name">{SITE.name}</span>
            <span className="hdr__tag">{SITE.tagline}</span>
          </span>
        </a>

        {/* Both navs carry the same name on purpose: the breakpoint
            display:nones whichever one is not in play, so only ever
            one of them reaches the accessibility tree. */}
        <nav className="hdr__nav" aria-label={CHROME_COPY.navLabel}>
          <ul className="hdr__list" ref={listRef}>
            {NAV.map((item, i) => {
              const id = item.href.slice(1);

              return (
                <li className="hdr__item" key={item.href} style={{ "--i": String(i) }}>
                  <a
                    className="hdr__link"
                    href={item.href}
                    aria-current={activeId === id ? "true" : undefined}
                    ref={(node) => {
                      if (node) linkRefs.current.set(id, node);
                      else linkRefs.current.delete(id);
                    }}
                  >
                    {item.label}
                  </a>
                </li>
              );
            })}

            {/* Decoration: the state it reports is already on the
                links as aria-current. */}
            <li
              className="hdr__bar"
              aria-hidden="true"
              style={{
                "--x": `${bar ? bar.x : 0}px`,
                "--w": `${bar ? bar.w : 0}px`,
                "--on": bar ? "1" : "0",
              }}
            />
          </ul>
        </nav>

        <a className="btn btn--ghost hdr__cta" href={NAV_CTA.href}>
          {NAV_CTA.label}
        </a>

        <button
          ref={burgerRef}
          type="button"
          className="hdr__burger"
          aria-expanded={open}
          aria-controls={sheetId}
          aria-label={open ? CHROME_COPY.closeMenu : CHROME_COPY.openMenu}
          onClick={() => (open ? closeMenu(true) : setOpen(true))}
        >
          <span className="hdr__bars" aria-hidden="true">
            <span />
            <span />
          </span>
        </button>
      </div>

      {/* Sits after the row so the brand and the toggle keep their
          place in the tab order while the sheet travels under them. */}
      <div className="hdr__sheet" id={sheetId} ref={sheetRef}>
        <nav className="hdr__sheetNav" aria-label={CHROME_COPY.navLabel}>
          <ul className="hdr__sheetList">
            {NAV.map((item, i) => {
              const id = item.href.slice(1);

              return (
                <li
                  className="hdr__sheetItem"
                  key={item.href}
                  style={{ "--i": String(i) }}
                >
                  <a
                    className="hdr__sheetLink"
                    href={item.href}
                    aria-current={activeId === id ? "true" : undefined}
                    onClick={() => closeMenu(false)}
                  >
                    {item.label}
                    <span className="hdr__sheetArrow" aria-hidden="true">
                      <ArrowRight />
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <a
          className="btn btn--primary hdr__sheetCta"
          href={NAV_CTA.href}
          onClick={() => closeMenu(false)}
        >
          {NAV_CTA.label}
          <span className="btn__arrow" aria-hidden="true">
            <ArrowRight />
          </span>
        </a>
      </div>
    </header>
  );
}
