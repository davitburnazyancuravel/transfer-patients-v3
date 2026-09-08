import type { Metadata } from "next";

import { BrandMark } from "@/components/BrandMark";
import { ServiceTiles } from "@/components/ServiceTiles";
import { ArrowRight } from "@/components/ui/icons";
import { SERVICES, SERVICE_PAGE, SITE } from "@/lib/content";

/* ============================================================
   /services — the index over the six service lines.

   The overall page at / already walks the six as a stepper; this
   route exists so that /services is not a dead URL above its own
   children, and so the six can be linked as a set from anywhere.
   ============================================================ */

export const metadata: Metadata = {
  title: `Services — ${SITE.name}`,
  description: SERVICES.lede,
  openGraph: {
    type: "website",
    siteName: SITE.name,
    title: `Services — ${SITE.name}`,
    description: SERVICES.lede,
  },
};

export default function ServicesIndexPage() {
  return (
    <article className="sp">
      <section className="sp__top" aria-labelledby="services-index-title" data-rv>
        <div className="wrap">
          <span className="eyebrow rv rv--fade">
            <span className="eyebrow__mark">
              <BrandMark />
            </span>
            <span className="eyebrow__label">{SERVICES.eyebrow}</span>
          </span>

          <h1 className="sp__h1" id="services-index-title">
            {SERVICES.title.map((line, i) => (
              <span className="line-rise" key={line} style={{ "--i": String(i) }}>
                <span>{i === SERVICES.title.length - 1 ? <strong>{line}</strong> : line}</span>
              </span>
            ))}
          </h1>

          <p className="sp__lede rv rv--sm" style={{ "--i": "2" }}>
            {SERVICES.lede}
          </p>

          <ServiceTiles />

          <div className="sp__end rv rv--sm">
            <h2 className="sp__endTitle">{SERVICE_PAGE.endTitle}</h2>
            {/* See the note in [slug]/page.tsx: cross-route hash. */}
            <a className="btn btn--primary" href={SERVICE_PAGE.cta.href}>
              {SERVICES.cta.label}
              <span className="btn__arrow" aria-hidden="true">
                <ArrowRight />
              </span>
            </a>
          </div>
        </div>
      </section>
    </article>
  );
}
