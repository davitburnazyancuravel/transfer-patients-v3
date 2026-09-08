/* Small shared helpers. No DOM access at module scope. */

export const clamp = (v: number, lo: number, hi: number): number =>
  Math.min(hi, Math.max(lo, v));

export const round = (v: number, step: number): number =>
  Math.round(v / step) * step;

export const pad2 = (n: number): string => String(n).padStart(2, "0");

export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

export const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);

export const money = (v: number): string =>
  "$" + Math.round(v).toLocaleString("en-US");

export const miles = (v: number): string => `${Math.round(v)} mi`;

export const hoursMins = (totalMin: number): string => {
  const h = Math.floor(totalMin / 60);
  const m = Math.round(totalMin % 60);
  return h ? `${h} h ${pad2(m)} m` : `${m} m`;
};

/** Format a stat counter the same way in every section. */
export type StatFormat = "plus" | "decimal1" | "thousands" | "plain";

export const formatStat = (v: number, format: StatFormat): string => {
  switch (format) {
    case "plus":
      return `${Math.round(v)}+`;
    case "decimal1":
      return `${v.toFixed(1)}%`;
    case "thousands":
      return `${Math.round(v).toLocaleString("en-US")}+`;
    default:
      return String(Math.round(v));
  }
};

export const prefersReducedMotion = (): boolean =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
