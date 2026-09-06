"use client";

import { useEffect } from "react";

import { formatStat, type StatFormat } from "@/lib/util";

/* ============================================================
   One observer for the whole page.

   • Any element carrying data-rv gets .is-in when it scrolls into
     view, which releases every .rv / .line-rise inside it.
   • Any element carrying data-count animates its number once.

   Sections never wire their own observers — they just mark up.
   ============================================================ */

const REVEAL_SELECTOR = "[data-rv]";
const COUNT_SELECTOR = "[data-count]";

export function SiteEffects() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* ---- reveals ------------------------------------------ */

    const revealTargets = Array.from(
      document.querySelectorAll<HTMLElement>(REVEAL_SELECTOR)
    );

    if (reduce) {
      revealTargets.forEach((el) => el.classList.add("is-in"));
    }

    const revealObserver = reduce
      ? null
      : new IntersectionObserver(
          (entries) => {
            for (const entry of entries) {
              if (!entry.isIntersecting) continue;
              entry.target.classList.add("is-in");
              revealObserver?.unobserve(entry.target);
            }
          },
          { rootMargin: "0px 0px -12% 0px", threshold: 0.06 }
        );

    revealTargets.forEach((el) => revealObserver?.observe(el));

    /* ---- counters ----------------------------------------- */

    const countTargets = Array.from(
      document.querySelectorAll<HTMLElement>(COUNT_SELECTOR)
    );

    const runCount = (el: HTMLElement) => {
      const to = Number(el.dataset.count ?? "0");
      const format = (el.dataset.countFormat ?? "plain") as StatFormat;
      if (!Number.isFinite(to)) return;

      if (reduce) {
        el.textContent = formatStat(to, format);
        return;
      }

      const duration = 1400;
      let start: number | null = null;
      let frame = 0;

      const step = (now: number) => {
        if (start === null) start = now;
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        el.textContent = formatStat(to * eased, format);
        if (t < 1) frame = requestAnimationFrame(step);
      };

      frame = requestAnimationFrame(step);
      el.dataset.countCancel = String(frame);
    };

    const countObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          runCount(entry.target as HTMLElement);
          countObserver.unobserve(entry.target);
        }
      },
      { threshold: 0.4 }
    );

    countTargets.forEach((el) => countObserver.observe(el));

    /* ---- teardown ----------------------------------------- */

    return () => {
      revealObserver?.disconnect();
      countObserver.disconnect();
      countTargets.forEach((el) => {
        const frame = Number(el.dataset.countCancel);
        if (frame) cancelAnimationFrame(frame);
      });
    };
  }, []);

  return null;
}
