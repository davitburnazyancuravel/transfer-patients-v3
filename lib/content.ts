/* ============================================================
   Curavel — content.
   Every string on the site lives here. Sections import from this
   module and never inline their own copy, so the client can
   re-word the site without touching layout or behaviour.
   ============================================================ */

export type Accent =
  | "emergency"
  | "interfac"
  | "longdist"
  | "neonatal"
  | "bariatric";

/* ---- Site chrome ----------------------------------------- */

export const SITE = {
  name: "Curavel",
  tagline: "Patient Transfer",
  title: "Curavel — Patient Transfer Services",
  description:
    "Curavel is a contracted medical transport partner. Emergency, inter-facility, neonatal and long-distance patient transfers under continuous clinical supervision — 24/7, SLA-backed, across the UK and Europe.",
  ogDescription:
    "Not every transfer is urgent. Every one is critical. Contracted medical transport with ICU-grade care in motion.",
} as const;

export const NAV = [
  { label: "About Us", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Crew", href: "#crew" },
  { label: "Calculator", href: "#calculator" },
  { label: "Cases", href: "#cases" },
] as const;

export const NAV_CTA = { label: "Request a transfer", href: "#contact" } as const;

/* ---- Hero ------------------------------------------------- */

export const HERO = {
  badge: { value: "84,000+", label: "Patients moved" },
  title: ["Not every transfer", "is urgent, every one", "is critical"],
  lede:
    "Curavel is a contracted medical transport partner — moving patients between hospitals, clinics and homes with intensive-care-grade supervision that never pauses at the door.",
  cta: { label: "Request a transfer", href: "#contact" },
  glass: {
    stat: "99.2",
    unit: "%",
    caption: "On-time arrival across every contracted service tier",
    chips: [
      "Emergency response",
      "Inter-facility",
      "Neonatal",
      "Repatriation",
      "Bariatric",
      "24/7 dispatch",
    ],
  },
  marquee: "Curavel — Safe. Swift. Supervised.",
} as const;

/* ---- Statement (scroll-revealed) -------------------------- */

export const STATEMENT = {
  /* Words in `lead` stay ink from the start; the rest reveals. */
  text:
    "At Curavel we do not treat a transfer as a gap between two hospitals — we treat it as part of the care",
  emphasis: ["Curavel", "part of the care"],
} as const;

/* ---- About / bento ---------------------------------------- */

export const ABOUT = {
  eyebrow: "About us",
  title: ["Unveil precision.", "Discover the Curavel", "difference."],
  lede:
    "At Curavel we do not treat a transfer as a gap between two hospitals — we treat it as part of the care. Our contracted crews move patients under continuous clinical supervision, in vehicles built and equipped as mobile intensive-care units, with a single named clinical lead from bedside to bedside.",
  cells: [
    {
      key: "supervision",
      accent: "interfac" as Accent,
      title: "Continuous clinical supervision",
      copy: "Monitoring never stops at the door — ECG, SpO₂ and pressures run from the referring bedside to the receiving one.",
    },
    {
      key: "vehicles",
      accent: "emergency" as Accent,
      title: "Vehicles built as mobile ICUs",
      copy: "Every vehicle carries defibrillation, airway, ventilation and controlled-drug packs, checked before each job.",
    },
    {
      key: "lead",
      accent: "longdist" as Accent,
      title: "One named clinical lead",
      copy: "A single accountable clinician owns the journey end to end, so nothing is handed between strangers mid-transfer.",
    },
    {
      key: "record",
      accent: "neonatal" as Accent,
      title: "One team, one handover, one record",
      copy: "Documentation travels with the patient and lands complete at the receiving ward — audit-ready, every time.",
    },
  ],
  stats: [
    { to: 12, format: "plus" as const, display: "12+", label: "Years on the road" },
    { to: 99.2, format: "decimal1" as const, display: "99.2%", label: "On-time arrival" },
    { to: 84000, format: "thousands" as const, display: "84,000+", label: "Patients moved" },
    { to: 240, format: "plain" as const, display: "240", label: "Crew on call" },
  ],
} as const;

/* ---- Services (numbered stepper) -------------------------- */

export const SERVICES = {
  eyebrow: "Services",
  title: ["Coverage for every", "level of care"],
  lede:
    "We run the full spectrum of medical transport — each service staffed, equipped and documented to the clinical level the patient actually needs.",
  cta: { label: "Schedule a transfer", href: "#contact" },
  items: [
    {
      key: "emergency",
      accent: "emergency" as Accent,
      name: "Emergency response",
      headline: "Blue-light cover, on contract",
      copy: "Dispatch inside ninety seconds with advanced-life-support crews held on standing contracts for hospitals and care groups. Every vehicle carries defibrillation, airway and controlled-drug packs.",
      points: ["Dispatch inside 90 seconds", "ALS crews on standing contract", "Defibrillation, airway and drug packs"],
      chip: "Dispatch in 90s",
      enquire: "Enquire about emergency response cover",
    },
    {
      key: "interfacility",
      accent: "interfac" as Accent,
      name: "Inter-facility transfer",
      headline: "Ward to ward, without a gap",
      copy: "Planned and urgent moves between sites, with monitoring continuity, complete handover documentation and one named clinical lead accountable for the whole journey.",
      points: ["Monitoring continuity end to end", "Complete handover documentation", "One named clinical lead"],
      chip: "Bedside to bedside",
      enquire: "Enquire about inter-facility transfer",
    },
    {
      key: "longdistance",
      accent: "longdist" as Accent,
      name: "Long-distance & repatriation",
      headline: "Home, however far that is",
      copy: "Cross-country and cross-border transfers by road and air ambulance, coordinated end to end — including escorts, customs and liaison with the receiving facility.",
      points: ["Road and air ambulance", "Escorts, customs and liaison", "Coordinated end to end"],
      chip: "UK & Europe",
      enquire: "Enquire about long-distance transfer and repatriation",
    },
    {
      key: "neonatal",
      accent: "neonatal" as Accent,
      name: "Neonatal & paediatric",
      headline: "The smallest patients, the steadiest hands",
      copy: "Transport incubators, neonatal ventilators and crews credentialled in paediatric critical care, for babies who cannot wait for a bed somewhere else.",
      points: ["Transport incubators", "Neonatal ventilation", "Paediatric critical-care crews"],
      chip: "Incubator equipped",
      enquire: "Enquire about neonatal and paediatric transport",
    },
    {
      key: "bariatric",
      accent: "bariatric" as Accent,
      name: "Bariatric & specialty",
      headline: "Dignity at any weight",
      copy: "Reinforced stretchers rated to 450 kg, powered loading systems and crews trained in safe manual handling — alongside isolation and mental-health transport.",
      points: ["Stretchers rated to 450 kg", "Powered loading systems", "Isolation and mental-health transport"],
      chip: "Rated to 450 kg",
      enquire: "Enquire about bariatric and specialty transport",
    },
  ],
} as const;

/* ---- Crew ------------------------------------------------- */

export const CREW = {
  eyebrow: "Specialists",
  title: ["Meet the crew", "behind every mile"],
  lede:
    "Paramedics, flight nurses and intensive-care physicians who stay with your patient from bedside to bedside — one team, one handover, one record.",
  cta: { label: "View all crew", href: "#contact" },
  people: [
    { role: "Critical Care Paramedic", name: "Daniel Whitfield", line: "Leads advanced-life-support road transfers and ventilated inter-facility moves.", meta: "On the road since 2014" },
    { role: "Flight Nurse", name: "Amara Osei", line: "Fixed-wing and rotary repatriation, bedside to bedside.", meta: "Flying since 2016" },
    { role: "Intensive Care Physician", name: "Dr Sofia Marchetti", line: "Escorts the most unstable patients we move.", meta: "Practising since 2009" },
    { role: "Neonatal Transport Nurse", name: "Priya Raman", line: "Transport incubators and neonatal ventilation.", meta: "With Curavel since 2015" },
    { role: "Dispatch Lead", name: "Marcus Feld", line: "Runs the 24/7 desk and every contract response window.", meta: "With Curavel since 2012" },
    { role: "Bariatric Specialist", name: "Tomas Nowak", line: "Powered loading and safe manual handling.", meta: "With Curavel since 2017" },
    { role: "Emergency Medical Technician", name: "Chloe Bennett", line: "Discharge and step-down transfers across London.", meta: "With Curavel since 2019" },
    { role: "Retrieval Consultant", name: "Dr Idris Kamara", line: "Pre-hospital retrieval and major trauma transfer.", meta: "Practising since 2007" },
    { role: "Paediatric Nurse", name: "Hannah Vogel", line: "Paediatric critical care in transit.", meta: "With Curavel since 2018" },
    { role: "Anaesthetic Practitioner", name: "Ravi Deshmukh", line: "Airway management on long transfers.", meta: "Practising since 2011" },
    { role: "Mental Health Escort", name: "Naomi Clarke", line: "Section 136 and voluntary psychiatric transport.", meta: "With Curavel since 2016" },
    { role: "Ambulance Technician", name: "Luca Ferretti", line: "Non-emergency and renal pathway transport.", meta: "With Curavel since 2020" },
    { role: "Infection Control Lead", name: "Dr Mei Tanaka", line: "Isolation transfers and decontamination protocol.", meta: "Practising since 2010" },
    { role: "Fleet Clinical Engineer", name: "Owen Pritchard", line: "Keeps every monitor, pump and ventilator in service.", meta: "With Curavel since 2013" },
    { role: "Repatriation Coordinator", name: "Sara Lindqvist", line: "Cross-border logistics, escorts and customs.", meta: "With Curavel since 2015" },
    { role: "Advanced Paramedic", name: "Grace Adeyemi", line: "Community response and urgent care pathways.", meta: "On the road since 2017" },
    { role: "Neonatal Consultant", name: "Dr Peter Halloran", line: "Clinical oversight for every neonatal move.", meta: "Practising since 2005" },
  ],
} as const;

/* ---- Ticker ----------------------------------------------- */

export const TICKER = [
  "Emergency response",
  "Inter-facility transfer",
  "Neonatal & paediatric",
  "Long-distance & repatriation",
  "Bariatric & specialty",
  "Safe. Swift. Supervised.",
] as const;

/* ---- Cases ------------------------------------------------ */

export const CASES = {
  eyebrow: "Case studies",
  title: ["Real transfers.", "Real outcomes."],
  lede:
    "Nothing speaks louder than the journeys themselves — and the patients who arrived in better shape than they left.",
  tabs: ["Emergency response", "Inter-facility", "Repatriation", "Neonatal"],
  items: [
    {
      key: "emergency",
      accent: "emergency" as Accent,
      tab: "Emergency response",
      title: ["Margaret’s transfer,", "uninterrupted"],
      copy: "Margaret went into a cardiac event on a Tuesday morning in a community hospital with no cath lab. The nearest interventional centre was forty minutes away, and every one of those minutes was going to count.",
      did: [
        "Blue-light ALS crew on the road in 82 seconds",
        "Twelve-lead ECG transmitted ahead to the receiving team",
        "Door-to-balloon inside the ninety-minute target",
      ],
      caption: "Margaret, three weeks after her transfer — home, and walking daily.",
    },
    {
      key: "interfacility",
      accent: "interfac" as Accent,
      tab: "Inter-facility",
      title: ["A ventilated patient,", "moved without a gap"],
      copy: "A ventilated ICU patient needed a specialist neurosurgical bed sixty miles away. The risk was never the distance — it was the handover, and everything that can be dropped in one.",
      did: [
        "Transport ventilator matched to ward settings before departure",
        "Consultant escort and continuous invasive monitoring",
        "Single written record handed over bedside to bedside",
      ],
      caption: "Transferred at 02:40, in theatre by 05:15.",
    },
    {
      key: "repatriation",
      accent: "longdist" as Accent,
      tab: "Repatriation",
      title: ["Eleven hundred miles,", "one clinical team"],
      copy: "After a fall on holiday in southern Spain, a patient with a fractured pelvis needed to come home — with the same team from the Spanish ward all the way to a bed in Leeds.",
      did: [
        "Air ambulance with a stretcher-configured cabin",
        "Flight nurse escort and full analgesia protocol in transit",
        "Ground legs, customs and receiving ward coordinated end to end",
      ],
      caption: "Home in nineteen hours, door to door.",
    },
    {
      key: "neonatal",
      accent: "neonatal" as Accent,
      tab: "Neonatal",
      title: ["Four hours old,", "and already travelling"],
      copy: "A baby born at thirty-one weeks needed a level-three neonatal unit that the delivering hospital did not have. Everything about the journey had to be built around keeping her warm, stable and undisturbed.",
      did: [
        "Transport incubator pre-warmed at the referring unit",
        "Neonatal ventilation and continuous thermal monitoring",
        "Parents transported with their daughter, not behind her",
      ],
      caption: "Discharged home at thirty-eight weeks, thriving.",
    },
  ],
} as const;

/* ---- Partners (constellation + accordion) ----------------- */

export const PARTNERS = {
  eyebrow: "For partners",
  title: ["Contracted care,", "wired into your systems"],
  lede:
    "Curavel plugs into the way your trust already works — one agreement, one invoice, and dispatch you can trigger from your own software.",
  facts: [
    { label: "Response window", value: "Contracted per tier" },
    { label: "Coverage", value: "UK-wide, Europe on request" },
    { label: "Reporting", value: "Monthly SLA pack, live API" },
  ],
  cta: { label: "Talk to our contracts team", href: "#contact" },
  spokes: [
    "NHS trusts",
    "Private hospitals",
    "Care groups",
    "Insurers",
    "Air ambulance",
    "Hospices",
    "Renal units",
    "Neonatal networks",
  ],
  faqEyebrow: "What you get",
  faqTitle: ["Got questions?", "We’ve got answers."],
  faq: [
    {
      q: "SLA-backed response windows",
      a: "Contractual dispatch and arrival times per service tier, measured on every job and reported monthly.",
    },
    {
      q: "One contract, one invoice",
      a: "Every service line — emergency, planned, neonatal, bariatric — on a single agreement and a single monthly bill.",
    },
    {
      q: "Vetted, insured, audit-ready",
      a: "DBS-checked crews, full clinical governance, and documentation built to survive an inspection.",
    },
    {
      q: "Dispatch API and live tracking",
      a: "Book from your own system and watch the vehicle move, with ETAs your ward clerks can actually rely on.",
    },
  ],
} as const;

/* ---- Calculator ------------------------------------------- */

export const CALCULATOR = {
  eyebrow: "Transfer calculator",
  title: ["Plan your transfer"],
  lede:
    "Estimate crew level, time on the road and cost before you pick up the phone. Interactive. Free. Indicative only.",
  labels: {
    type: "Transfer type",
    care: "Care level",
    contract: "Contract status",
    route: "Plan the route",
    result: "Result",
    live: "Live",
    routeHint: "Select any facility to plan a new route.",
    pickup: "Pickup",
    destination: "Destination",
    distance: "Distance",
    complexity: "Transfer complexity",
    complexityNote: "Estimation only",
    time: "Time on road (est.)",
    timeNote: "Subject to traffic and handover",
    crew: "Recommended crew",
    plan: "Recommended plan",
    cost: "Estimated cost range",
    costNote: "Indicative only. Final cost confirmed on booking.",
  },
  types: [
    { id: "emergency", label: "Emergency response" },
    { id: "interfacility", label: "Inter-facility transfer" },
    { id: "discharge", label: "Discharge to home" },
    { id: "repatriation", label: "Long-distance & repatriation" },
  ],
  cares: [
    { id: "bls", label: "BLS", note: "basic life support" },
    { id: "als", label: "ALS", note: "advanced life support" },
    { id: "icu", label: "ICU", note: "intensive care" },
  ],
  contracts: [
    { id: "contracted", label: "Contracted partner" },
    { id: "adhoc", label: "Not enrolled" },
  ],
  presets: [
    { id: "shortest", label: "Shortest" },
    { id: "motorway", label: "Motorway" },
  ],
  plan: [
    "ALS crew of two",
    "Continuous ECG and SpO₂",
    "Receiving-ward handover",
    "Priority dispatch under your SLA",
  ],
} as const;

export const FACILITIES = [
  { id: "leeds", name: "Leeds General", x: 232, y: 92, mx: 60, my: 200, anchor: "start" },
  { id: "qe", name: "Birmingham QE", x: 190, y: 200, mx: 35, my: 110, anchor: "end" },
  { id: "adden", name: "Addenbrooke’s", x: 340, y: 226, mx: 105, my: 55, anchor: "start" },
  { id: "barts", name: "St Bartholomew’s", x: 268, y: 300, mx: 78, my: 8, anchor: "end" },
  { id: "royal", name: "Royal London", x: 316, y: 316, mx: 81, my: 7, anchor: "start" },
  { id: "guys", name: "Guy’s", x: 296, y: 348, mx: 79, my: 6, anchor: "start" },
  { id: "kings", name: "King’s College", x: 258, y: 352, mx: 79, my: 3, anchor: "end" },
  { id: "soton", name: "Southampton General", x: 226, y: 404, mx: 52, my: -55, anchor: "end" },
] as const;

export const CALC_CREW = {
  physician: { name: "Dr Sofia Marchetti", role: "Intensive Care Physician" },
  paramedic: { name: "Daniel Whitfield", role: "Critical Care Paramedic" },
  flight: { name: "Amara Osei", role: "Flight Nurse" },
  neonatal: { name: "Priya Raman", role: "Neonatal Transport Nurse" },
  bariatric: { name: "Tomas Nowak", role: "Bariatric Specialist" },
  dispatch: { name: "Marcus Feld", role: "Dispatch Lead" },
  emt: { name: "Chloe Bennett", role: "Emergency Medical Technician" },
} as const;

/* ---- Contact / CTA ---------------------------------------- */

export const CONTACT = {
  eyebrow: "Consultation",
  title: ["Book your first transfer"],
  lede:
    "Leave us your email and our dispatch desk will be in touch within fifteen minutes to take the details.",
  placeholder: "Enter your email",
  submit: "Send request",
  consent: "By clicking this button you accept",
  consentLink: "Privacy Policy",
  done: "Thank you — our dispatch desk will email you within fifteen minutes.",
  again: "Send another request",
  badge: { value: "24/7", label: "Dispatch desk" },
} as const;

/* ---- Footer ----------------------------------------------- */

export const FOOTER = {
  blurb: "Join our newsletter for service updates, coverage changes and SLA reporting notes.",
  emailPlaceholder: "Your email",
  subscribe: "Subscribe",
  columns: [
    {
      title: "Services",
      links: [
        { label: "Emergency response", href: "#services" },
        { label: "Inter-facility transfer", href: "#services" },
        { label: "Long-distance & repatriation", href: "#services" },
        { label: "Neonatal & paediatric", href: "#services" },
        { label: "Bariatric & specialty", href: "#services" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About us", href: "#about" },
        { label: "Our crew", href: "#crew" },
        { label: "Case studies", href: "#cases" },
        { label: "For partners", href: "#partners" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Transfer calculator", href: "#calculator" },
        { label: "Coverage map", href: "#calculator" },
        { label: "SLA reporting", href: "#partners" },
        { label: "Dispatch API", href: "#partners" },
      ],
    },
    {
      title: "Contact",
      links: [
        { label: "Request a transfer", href: "#contact" },
        { label: "Contracts team", href: "#contact" },
        { label: "Privacy Policy", href: "#" },
        { label: "Terms of Service", href: "#" },
      ],
    },
  ],
  legal: "Curavel — Safe. Swift. Supervised.",
  wordmark: "Curavel",
} as const;
