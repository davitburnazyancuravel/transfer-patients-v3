import Link from "next/link";

import { ArrowRight } from "@/components/ui/icons";
import { SERVICES } from "@/lib/content";

/* ============================================================
   The six service lines as a card grid.

   Used twice: as the whole of /services, and as the "other
   services" footer on each individual service page — which is
   the only reason `exclude` exists.

   Server-rendered. Each tile carries its own data-accent, so the
   mark and the arrow plate tint themselves from --c / --c-wash
   with no per-service CSS.
   ============================================================ */

export function ServiceTiles({ exclude }: { exclude?: string }) {
  const items = SERVICES.items.filter((item) => item.slug !== exclude);

  return (
    <ul className="sp__grid">
      {items.map((item, i) => (
        <li className="rv rv--sm" key={item.key} style={{ "--i": String(i) }}>
          <Link
            className="sp__tile"
            href={`/services/${item.slug}`}
            data-accent={item.accent}
          >
            <span className="sp__tileMark" aria-hidden="true" />
            <h3 className="sp__tileName">{item.name}</h3>
            <p className="sp__tileCopy">{item.short}</p>
            <span className="sp__tileMore">
              {SERVICES.how}
              <span className="sp__tileArrow" aria-hidden="true">
                <ArrowRight />
              </span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
