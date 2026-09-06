/* ============================================================
   Photography manifest.

   Every photo on the site is referenced through this file, so
   swapping the placeholder stock for real General Medical photography is
   a one-file change: replace each `src` (and keep the `alt`).

   Placeholders are Unsplash-hosted and are allow-listed in
   next.config.ts. For production, download the approved shots
   into /public/photos and change these to local paths.
   ============================================================ */

export type Photo = {
  /** Absolute URL or /public path. */
  src: string;
  /** Meaningful alt text. Empty string only for pure decoration. */
  alt: string;
};

const u = (id: string, w = 1600, q = 78): string =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=${q}`;

/* Filled by the media pass; every id below is verified reachable
   and free of third-party operator, hospital or airline branding. */
export const PHOTOS = {
  hero: { src: u("photo-1780570349003-f698592df551", 1900), alt: "A crew member wheeling a loaded stretcher across open tarmac towards the open rear doors of an ambulance." },

  services: {
    emergency:    { src: u("photo-1554734867-bf3c00a49371"), alt: "An ambulance moving at speed through a city street at dusk, its blue lights streaking across the frame." },
    interfacility:{ src: u("photo-1517120026326-d87759a7b63b"), alt: "A nurse in scrubs pushing a wheeled patient transport unit along a bright hospital corridor." },
    longdistance: { src: u("photo-1696243144290-792f1f48339e"), alt: "The cabin of an air ambulance, a stretcher secured on its rail loading system beside a patient monitor." },
    neonatal:     { src: u("photo-1560306580-9e204fe45f3e"), alt: "A newborn resting calmly in an incubator, wrapped in a white blanket with monitoring leads attached." },
    bariatric:    { src: u("photo-1782835431138-a8be539ae04b"), alt: "A made-up stretcher with pillow, blankets and restraint straps inside an ambulance, a folded transport chair behind it." },
  },

  cases: {
    emergency:    { src: u("photo-1758874960868-eebf9d36d5d5", 900), alt: "An older woman sitting at her kitchen table at home, smiling calmly at the camera." },
    interfacility:{ src: u("photo-1688565631550-ff8aa569f71a", 900), alt: "A clinician in scrubs and a surgical cap adjusting a patient monitor beside a ventilator in critical care." },
    repatriation: { src: u("photo-1772751320776-fb98dfba127a", 900), alt: "A traveller resting in a bright airport terminal with his suitcase, watching the apron through a tall window." },
    neonatal:     { src: u("photo-1782010440982-2b7f1ace7a60", 900), alt: "A newborn sleeping peacefully in a transport incubator, wrapped in a soft patterned blanket." },
  },

  about: {
    bay:   { src: u("photo-1707081636498-3e55bdd7a74d", 1200), alt: "The rear doors and tail lights of an ambulance parked outside in cold winter light." },
    cabin: { src: u("photo-1696243144413-503bc482a608", 1200), alt: "The interior of a mobile intensive-care cabin, with a stretcher, a wall-mounted monitor and an equipment panel." },
  },

  /** Cycled across the crew marquee; order is not meaningful. */
  crew: [
    { src: u("photo-1594824476967-48c8b964273f", 700), alt: "A nurse with long dark curly hair in teal scrubs, arms folded, smiling." },
    { src: u("photo-1622253692010-333f2da6031d", 700), alt: "A smiling paramedic in blue scrubs with a stethoscope round his neck." },
    { src: u("photo-1637059824899-a441006a6875", 700), alt: "A doctor in a white shirt with a stethoscope, standing with arms folded in a hospital corridor." },
    { src: u("photo-1784333250630-e647a26b2240", 700), alt: "An experienced nurse in teal scrubs and a patterned surgical cap, laughing." },
    { src: u("photo-1770134223774-13b735e29201", 700), alt: "A nurse in navy scrubs and clear-framed glasses, arms folded, smiling at the camera." },
    { src: u("photo-1758691461516-7e716e0ca135", 700), alt: "A senior consultant with white hair and glasses, in a white coat with a stethoscope." },
    { src: u("photo-1643297654416-05795d62e39c", 700), alt: "A doctor in a white coat smiling and holding out her stethoscope." },
    { src: u("photo-1757125736482-328a3cdd9743", 700), alt: "A doctor in a white coat over green scrubs, smiling outdoors." },
    { src: u("photo-1666887360742-974c8fce8e6b", 700), alt: "A nurse in pale blue scrubs with clear-framed glasses and a stethoscope, against a white wall." },
    { src: u("photo-1786840085336-049527aef52e", 700), alt: "A clinician in a grey coat wearing magnifying loupes, holding a stethoscope." },
  ] as Photo[],

  cta: { src: u("photo-1614167929771-ce3e54213aef", 1900), alt: "An ambulance response car parked on a seafront esplanade above calm water, under soft grey cloud." },
} satisfies {
  hero: Photo;
  services: Record<string, Photo>;
  cases: Record<string, Photo>;
  about: Record<string, Photo>;
  crew: Photo[];
  cta: Photo;
};
