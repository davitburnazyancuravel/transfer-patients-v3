import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { BrandMark } from "@/components/BrandMark";
import { ServiceTiles } from "@/components/ServiceTiles";
import { ArrowRight, Check, Plus } from "@/components/ui/icons";
import {
  SERVICES,
  SERVICE_PAGE,
  SITE,
  serviceBySlug,
} from "@/lib/content";
import { PHOTOS } from "@/lib/media";
import { pad2 } from "@/lib/util";

/* ============================================================
   A single service line — /services/<slug>.

   Entirely server-rendered: nothing on the page needs state, so
   the FAQ opens with a native <details> and the only motion is
   the shared .rv reveal that SiteEffects releases. The six routes
   are known at build time, so they prerender.

   Copy comes from SERVICES.items[].page and the shared labels in
   SERVICE_PAGE; nothing here is inlined.
   ============================================================ */

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return SERVICES.items.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = serviceBySlug(slug);

  if (!service) return {};

  const title = `${service.name} — ${SITE.name}`;

  return {
    title,
    description: service.page.lede,
    openGraph: {
      type: "article",
      siteName: SITE.name,
      title,
      description: service.page.lede,
    },
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const service = serviceBySlug(slug);

  if (!service) notFound();

  const photo = PHOTOS.services[service.key];
  const { page } = service;

  return (
    <article className="sp" data-accent={service.accent}>
      {/* ---- Masthead ------------------------------------- */}
      <section className="sp__top" aria-labelledby="sp-title" data-rv>
        <div className="wrap">
          <Link className="sp__crumb" href={SERVICE_PAGE.backHref}>
            <span className="sp__crumbArrow" aria-hidden="true">
              <ArrowRight />
            </span>
            {SERVICE_PAGE.backLabel}
          </Link>

          <div className="sp__head">
            <div>
              <span className="eyebrow rv rv--fade">
                <span className="eyebrow__mark">
                  <BrandMark />
                </span>
                <span className="eyebrow__label">{SERVICE_PAGE.eyebrow}</span>
              </span>

              <h1 className="sp__h1" id="sp-title">
                {page.title.map((line, i) => (
                  <span className="line-rise" key={line} style={{ "--i": String(i) }}>
                    <span>{i === page.title.length - 1 ? <strong>{line}</strong> : line}</span>
                  </span>
                ))}
              </h1>

              <p className="sp__lede rv rv--sm" style={{ "--i": "2" }}>
                {page.lede}
              </p>

              <ul className="ticks sp__ticks rv rv--sm" style={{ "--i": "3" }}>
                {service.points.map((point) => (
                  <li key={point}>
                    <span className="tick" aria-hidden="true">
                      <Check />
                    </span>
                    {point}
                  </li>
                ))}
              </ul>

              <div className="sp__actions rv rv--sm" style={{ "--i": "4" }}>
                {/* A plain anchor, not <Link>: this points at a hash on
                    another route, and a soft navigation lands at the top
                    of that page because #contact has not rendered when
                    the navigation commits. */}
                <a
                  className="btn btn--primary"
                  href={SERVICE_PAGE.cta.href}
                  aria-label={service.enquire}
                >
                  {SERVICE_PAGE.cta.label}
                  <span className="btn__arrow" aria-hidden="true">
                    <ArrowRight />
                  </span>
                </a>
              </div>
            </div>

            <div className="sp__headMedia rv rv--pop" style={{ "--i": "2" }}>
              <div className="sp__frame">
                <span className="sp__plate" aria-hidden="true" />

                {/* unoptimized: the panels are SVG — see lib/media.ts. */}
                <div className="sp__shot">
                  <Image
                    className="sp__img"
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes="(min-width: 900px) 440px, 340px"
                    priority
                    unoptimized
                  />

                  <p className="sp__chip">
                    <span className="sp__chipDot" aria-hidden="true" />
                    {service.chip}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---- What's included ------------------------------ */}
      <section className="section section--white" aria-labelledby="sp-included" data-rv>
        <div className="wrap">
          <div className="sec-head sec-head--left">
            <h2 className="h2" id="sp-included">
              <span className="line-rise">
                <span>
                  <strong>{SERVICE_PAGE.includedTitle}</strong>
                </span>
              </span>
            </h2>
          </div>

          <div className="sp__cards">
            {page.included.map((cell, i) => (
              <div
                className="sp__card rv rv--sm"
                key={cell.title}
                style={{ "--i": String(i) }}
              >
                <span className="sp__cardMark" aria-hidden="true">
                  {pad2(i + 1)}
                </span>
                <h3 className="sp__cardTitle">{cell.title}</h3>
                <p className="sp__cardCopy">{cell.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Who it's for, and how it works --------------- */}
      <section className="section section--panel" aria-labelledby="sp-who" data-rv>
        <div className="wrap sp__split">
          <div>
            <h2 className="sp__blockTitle" id="sp-who">
              {SERVICE_PAGE.whoTitle}
            </h2>

            <ul className="ticks rv rv--sm">
              {page.who.map((line) => (
                <li key={line}>
                  <span className="tick" aria-hidden="true">
                    <Check />
                  </span>
                  {line}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="sp__blockTitle">{SERVICE_PAGE.stepsTitle}</h2>

            <ol className="sp__steps">
              {page.steps.map((step, i) => (
                <li
                  className="sp__step rv rv--sm"
                  key={step.title}
                  style={{ "--i": String(i) }}
                >
                  <span className="sp__stepNum" aria-hidden="true">
                    {pad2(i + 1)}
                  </span>
                  <div>
                    <h3 className="sp__stepTitle">{step.title}</h3>
                    <p className="sp__stepCopy">{step.copy}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ---- FAQ ------------------------------------------ */}
      <section className="section section--white" aria-labelledby="sp-faq" data-rv>
        <div className="wrap">
          <div className="sec-head sec-head--left">
            <h2 className="h2" id="sp-faq">
              <span className="line-rise">
                <span>
                  <strong>{SERVICE_PAGE.faqTitle}</strong>
                </span>
              </span>
            </h2>
          </div>

          <div className="sp__faq">
            {page.faq.map((row, i) => (
              <details
                className="sp__q rv rv--sm"
                key={row.q}
                style={{ "--i": String(i) }}
              >
                <summary className="sp__qHead">
                  {row.q}
                  <span className="sp__qMark" aria-hidden="true">
                    <Plus />
                  </span>
                </summary>
                <p className="sp__qBody">{row.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Other services, and the ask ----------------- */}
      <section className="section section--panel" aria-labelledby="sp-other" data-rv>
        <div className="wrap">
          <div className="sec-head sec-head--left">
            <h2 className="h2" id="sp-other">
              <span className="line-rise">
                <span>
                  <strong>{SERVICE_PAGE.otherTitle}</strong>
                </span>
              </span>
            </h2>
          </div>

          <ServiceTiles exclude={service.slug} />

          <div className="sp__end rv rv--sm">
            <h2 className="sp__endTitle">{SERVICE_PAGE.endTitle}</h2>
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
