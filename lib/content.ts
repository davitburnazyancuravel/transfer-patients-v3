/* ============================================================
   General Medical — content.
   Every string on the site lives here. Sections import from this
   module and never inline their own copy, so the client can
   re-word the site without touching layout or behaviour.
   ============================================================ */

import type { StatFormat } from "@/lib/util";

/* One palette slot per service line. Named for the hue rather than
   the service, so a service can be renamed or reordered without a
   token rename following it through the stylesheets. */
export type Accent =
  | "azure"
  | "violet"
  | "mint"
  | "amber"
  | "gold"
  | "coral";

/* ---- Site chrome ----------------------------------------- */

export const SITE = {
  name: "General Medical",
  tagline: "Transportation & Home Care",
  title: "General Medical — Non-Emergency Medical Transportation & Home Care",
  description:
    "General Medical provides non-emergency medical transportation, non-emergency ambulance, home health, physical therapy, occupational therapy and medical home modifications — coordinated by one provider.",
  ogDescription:
    "Getting there, and getting better at home. Six coordinated services from one provider.",
} as const;

export const NAV = [
  { label: "About Us", href: "/#about" },
  { label: "Services", href: "/#services" },
  { label: "Crew", href: "/#crew" },
  { label: "Calculator", href: "/#calculator" },
  { label: "Cases", href: "/#cases" },
] as const;

export const NAV_CTA = { label: "Request service", href: "/#contact" } as const;

/* ---- Hero ------------------------------------------------- */

export const HERO = {
  badge: { value: "6", label: "Coordinated services" },
  title: ["Getting there,", "and getting better", "at home"],
  lede:
    "General Medical moves patients to the care they need and delivers care in the place they live — transportation, home health and therapy arranged through one provider, on one schedule.",
  cta: { label: "Request service", href: "/#contact" },
  glass: {
    stat: "6",
    unit: "",
    /* The counter rewrites the whole figure as it animates, so the
       format — not `unit` — owns the final string. "plain" keeps
       this a bare count; `unit` is only the pre-animation snapshot. */
    format: "plain" as StatFormat,
    caption: "Service lines, coordinated by a single care team",
    chips: [
      "Wheelchair & gurney",
      "Non-emergency ambulance",
      "Home health",
      "Physical therapy",
      "Occupational therapy",
      "Home modifications",
    ],
  },
  marquee: "General Medical — Scheduled. Staffed. Supervised.",
} as const;

/* ---- Statement (scroll-revealed) -------------------------- */

export const STATEMENT = {
  /* Words in `lead` stay ink from the start; the rest reveals. */
  text:
    "At General Medical we do not treat the ride and the recovery as two separate problems — we treat them as one plan of care",
  emphasis: ["General Medical", "one plan of care"],
} as const;

/* ---- About / bento ---------------------------------------- */

export const ABOUT = {
  eyebrow: "About us",
  title: ["Unveil precision.", "Discover the General Medical", "difference."],
  lede:
    "At General Medical we do not treat the ride and the recovery as two separate problems. The same organization that brings a patient to their appointment also delivers the nursing and therapy at home, and modifies the home when that is what stands in the way — so the plan holds together instead of being handed between strangers.",
  cells: [
    {
      key: "coordination",
      accent: "azure" as Accent,
      title: "One provider, one schedule",
      copy: "Transportation, nursing, therapy and modifications booked through the same team, so appointments and visits stop colliding.",
    },
    {
      key: "athome",
      accent: "coral" as Accent,
      title: "Care where the patient lives",
      copy: "Nursing and therapy delivered in the home, measured against the patient's own stairs, bathroom and routine.",
    },
    {
      key: "lead",
      accent: "violet" as Accent,
      title: "One point of contact",
      copy: "A single person owns the plan, so families are not repeating the same history to a new voice each week.",
    },
    {
      key: "record",
      accent: "mint" as Accent,
      title: "Findings go back to the physician",
      copy: "What our clinicians see at home is reported to the physician who ordered the care, not left on the kitchen counter.",
    },
  ],
  stats: [
    { to: 12, format: "plus" as const, display: "12+", label: "Years on the road" },
    { to: 99.2, format: "decimal1" as const, display: "99.2%", label: "On-time arrival" },
    { to: 84000, format: "thousands" as const, display: "84,000+", label: "Patients moved" },
    { to: 240, format: "plain" as const, display: "240", label: "Crew on call" },
  ],
} as const;

/* ---- Services --------------------------------------------
   Six service lines. Each one is both a step in the stepper on
   the overall page and a page of its own at /services/<slug>,
   so `page` carries everything the sub-page needs and nothing
   the stepper reads.
   ---------------------------------------------------------- */

/** Shared chrome for every /services/<slug> page. */
export const SERVICE_PAGE = {
  eyebrow: "Service",
  includedTitle: "What\u2019s included",
  whoTitle: "Who it\u2019s for",
  stepsTitle: "How it works",
  faqTitle: "Common questions",
  otherTitle: "Other services",
  endTitle: "Tell us what the patient needs and we\u2019ll tell you what we can do.",
  cta: { label: "Request this service", href: "/#contact" },
  backLabel: "All services",
  backHref: "/services",
} as const;

export const SERVICES = {
  eyebrow: "Services",
  title: ["Six services,", "one provider"],
  lede:
    "Transportation, in-home care and the modifications that make a home work — arranged together, so the ride, the recovery and the front doorstep are not three separate phone calls.",
  cta: { label: "Request service", href: "/#contact" },
  /* The stepper's per-item affordance, alongside `cta`. */
  how: "See how it works",
  items: [
    {
      key: "nemt",
      slug: "non-emergency-medical-transportation",
      accent: "azure" as Accent,
      name: "Non-Emergency Medical Transportation",
      short: "Wheelchair and gurney rides to scheduled care.",
      headline: "Wheelchair and gurney rides, on schedule",
      copy: "Scheduled transportation for people who cannot drive themselves and cannot safely take a taxi — dialysis, chemotherapy, wound care, follow-up appointments and the ride home after a discharge. Wheelchair-accessible vans and gurney vehicles, with an attendant who helps at both ends.",
      points: [
        "Wheelchair-accessible vans",
        "Gurney and stretcher vans",
        "Door-through-door assistance",
      ],
      chip: "Wheelchair & gurney",
      enquire: "Request non-emergency medical transportation",
      page: {
        title: ["Wheelchair and gurney", "transportation"],
        lede:
          "A ride to treatment should not be the reason treatment gets missed. We handle the recurring appointments and the one-off trips, with vehicles and attendants matched to how the patient actually travels.",
        included: [
          {
            title: "Wheelchair-accessible vans",
            copy: "Ramp or lift equipped, with four-point securement for the chair and a shoulder belt for the passenger.",
          },
          {
            title: "Gurney transportation",
            copy: "For patients who travel lying down but need no clinical monitoring on the way.",
          },
          {
            title: "Door-through-door help",
            copy: "The attendant collects the patient inside the residence and hands them over inside the clinic, not at the curb.",
          },
          {
            title: "Recurring schedules",
            copy: "Standing bookings for dialysis and therapy runs, set once instead of called in each week.",
          },
        ],
        who: [
          "Dialysis and infusion patients on a fixed weekly schedule",
          "Patients discharged home who cannot sit up in a car",
          "Assisted living and memory care residents attending appointments",
          "Wheelchair users without an accessible vehicle at home",
          "Families coordinating care for a parent from out of state",
        ],
        steps: [
          {
            title: "Tell us the appointment",
            copy: "Pickup address, clinic, date and time, and whether the patient travels seated or lying down.",
          },
          {
            title: "We match the vehicle",
            copy: "Wheelchair van or gurney van, with the attendant support the trip calls for.",
          },
          {
            title: "Both legs are covered",
            copy: "The return is scheduled with the outbound, so nobody waits in a lobby for a ride that was never booked.",
          },
        ],
        faq: [
          {
            q: "Can a family member ride along?",
            a: "Yes. Let us know when you book so the vehicle assigned has a seat for them.",
          },
          {
            q: "Do you transport patients on oxygen?",
            a: "Patients travelling with their own portable oxygen can be carried on this service. If oxygen has to be administered or monitored in transit, non-emergency ambulance is the right service instead.",
          },
          {
            q: "How far in advance should we book?",
            a: "Recurring appointments are best set up as a standing schedule. For a single trip, contact us as early as you can and we will confirm what is available.",
          },
        ],
      },
    },
    {
      key: "ambulance",
      slug: "non-emergency-ambulance",
      accent: "violet" as Accent,
      name: "Non-Emergency Ambulance",
      short: "Monitored transport without a 911 call.",
      headline: "Clinical transport, without the 911 call",
      copy: "For patients who need monitoring or clinical support on the way but are not in an emergency — facility-to-facility moves, planned admissions, and returns home. Staffed by licensed EMTs, with oxygen, suction and vitals monitoring on board.",
      points: [
        "Licensed EMT crew",
        "Oxygen, suction and vitals monitoring",
        "Facility, admission and discharge moves",
      ],
      chip: "BLS equipped",
      enquire: "Request non-emergency ambulance transport",
      page: {
        title: ["Non-emergency", "ambulance transport"],
        lede:
          "Some patients are stable but still need a clinician within arm's reach. This is the service for planned moves where monitoring cannot lapse, and where an emergency response was never the right call.",
        included: [
          {
            title: "Licensed EMT crew",
            copy: "Every unit is staffed to basic life support level, with the crew riding in the patient compartment.",
          },
            {
            title: "Monitoring in transit",
            copy: "Vitals, oxygen and suction available for the whole journey rather than checked at either end.",
          },
          {
            title: "Facility-to-facility moves",
            copy: "Hospital to skilled nursing, skilled nursing to hospital, and planned admissions arranged with both sites.",
          },
          {
            title: "Paperwork that arrives with the patient",
            copy: "Transfer documentation handed to the receiving staff, so the record does not have to be chased afterwards.",
          },
        ],
        who: [
          "Patients moving between a hospital and a skilled nursing facility",
          "Planned admissions where the patient cannot travel by car",
          "Discharges home that need clinical supervision on the way",
          "Bariatric transports needing equipment a van cannot carry",
          "Hospice patients moving to or from an inpatient unit",
        ],
        steps: [
          {
            title: "Confirm the clinical need",
            copy: "We take the referral from the facility or the family and confirm the level of transport the patient actually needs.",
          },
          {
            title: "Both ends are notified",
            copy: "Sending and receiving staff get the window, so the patient is ready and the bed is waiting.",
          },
          {
            title: "Handover, in person",
            copy: "The crew hands the patient and the paperwork to the receiving team rather than leaving either at a desk.",
          },
        ],
        faq: [
          {
            q: "Is this an emergency service?",
            a: "No. General Medical does not provide 911 or emergency response. If someone is in immediate danger, call 911. This service is for planned and scheduled transport of stable patients.",
          },
          {
            q: "How is this different from your wheelchair and gurney service?",
            a: "Wheelchair and gurney transportation carries patients who need no clinical care on the way. Non-emergency ambulance is staffed and equipped for patients who need monitoring or support in transit.",
          },
          {
            q: "Can a hospital case manager book directly?",
            a: "Yes. Discharge planners and case managers can arrange transport with us and we will coordinate with the receiving facility.",
          },
        ],
      },
    },
    {
      key: "homehealth",
      slug: "home-health",
      accent: "mint" as Accent,
      name: "Home Health",
      short: "Skilled nursing and aide visits at home.",
      headline: "Skilled care where the patient already lives",
      copy: "Nursing and aide visits at home for patients recovering from surgery, managing a long-term condition, or leaving the hospital with a care plan someone has to actually follow. Visits are scheduled around the household and coordinated with the ordering physician.",
      points: [
        "Skilled nursing visits",
        "Home health aide support",
        "Coordinated with the ordering physician",
      ],
      chip: "In-home care",
      enquire: "Request home health services",
      page: {
        title: ["Home health", "visits"],
        lede:
          "Recovery does not happen in a clinic — it happens in a kitchen, on a staircase, at 6am. Home health puts the clinical part of that where it belongs, and reports back to the physician who ordered it.",
        included: [
          {
            title: "Skilled nursing",
            copy: "Wound care, medication management, injections, vitals and the assessments the care plan calls for.",
          },
          {
            title: "Home health aide visits",
            copy: "Help with bathing, dressing, mobility and the daily routine, on a schedule the household can rely on.",
          },
          {
            title: "Physician coordination",
            copy: "Findings and changes go back to the ordering physician rather than sitting in a folder on the counter.",
          },
          {
            title: "One care team",
            copy: "Nursing, therapy and transportation drawn from the same organization, so nothing has to be re-explained.",
          },
        ],
        who: [
          "Patients discharged home with a post-hospital care plan",
          "Adults managing diabetes, heart failure or COPD at home",
          "Post-surgical patients needing wound care between appointments",
          "Older adults whose families cannot provide daily help",
          "Patients who would rather not travel for routine care",
        ],
        steps: [
          {
            title: "Referral and orders",
            copy: "We take the referral from the physician, hospital or family and confirm what has been ordered.",
          },
          {
            title: "Assessment at home",
            copy: "A clinician visits, reviews the home as it is, and builds the visit schedule around the household.",
          },
          {
            title: "Visits, then reporting",
            copy: "Care is delivered on schedule and progress goes back to the physician who ordered it.",
          },
        ],
        faq: [
          {
            q: "Do we need a physician's order?",
            a: "Skilled nursing and therapy are provided under a physician's order. If you do not have one yet, contact us and we will walk you through what is needed.",
          },
          {
            q: "How often are visits?",
            a: "Visit frequency comes from the care plan rather than a fixed package, and is adjusted as the patient improves.",
          },
          {
            q: "Can home health and therapy be combined?",
            a: "Yes — nursing, physical therapy and occupational therapy are frequently scheduled together, which is the main reason to take them from one provider.",
          },
        ],
      },
    },
    {
      key: "physical",
      slug: "physical-therapy",
      accent: "amber" as Accent,
      name: "Physical Therapy",
      short: "Strength, balance and mobility, rebuilt at home.",
      headline: "Strength, balance and mobility, rebuilt",
      copy: "One-on-one therapy for patients recovering from surgery, injury, a stroke or a fall — gait and balance work, strengthening and pain management, delivered in the home where the progress has to hold.",
      points: [
        "Post-surgical and post-injury rehabilitation",
        "Gait, balance and fall-prevention work",
        "In-home sessions, no travel required",
      ],
      chip: "In-home PT",
      enquire: "Request physical therapy",
      page: {
        title: ["Physical therapy,", "in the home"],
        lede:
          "A patient who can walk the length of a clinic hallway has not necessarily solved their own staircase. Therapy at home is measured against the real obstacles, because that is where the sessions happen.",
        included: [
          {
            title: "Gait and balance training",
            copy: "Walking, turning, curbs and stairs — practised on the surfaces the patient actually uses.",
          },
          {
            title: "Strengthening programs",
            copy: "Progressive work after surgery or a long hospital stay, adjusted session by session.",
          },
          {
            title: "Fall-risk reduction",
            copy: "The hazards that cause falls at home get identified and trained around, not just noted.",
          },
          {
            title: "A home program that fits",
            copy: "Exercises the patient can do with what is in the house, so the days between visits still count.",
          },
        ],
        who: [
          "Patients recovering from hip or knee replacement",
          "Stroke survivors rebuilding mobility and gait",
          "Adults who have had a fall and lost confidence moving around",
          "Patients deconditioned by a long hospital admission",
          "Anyone whose mobility makes travelling to an outpatient clinic hard",
        ],
        steps: [
          {
            title: "Evaluation at home",
            copy: "A therapist assesses strength, gait and balance, and walks the rooms the patient has trouble with.",
          },
            {
            title: "A plan with a target",
            copy: "Goals are set against real tasks — the stairs, the bathroom, the walk to the mailbox.",
          },
          {
            title: "Sessions and progression",
            copy: "Visits continue on schedule, the program advances as the patient does, and progress is reported back.",
          },
        ],
        faq: [
          {
            q: "Is home therapy as effective as a clinic?",
            a: "For mobility and daily-function goals it has a real advantage: the therapist trains on the patient's own stairs, floors and furniture rather than a clinic's.",
          },
          {
            q: "What equipment is needed?",
            a: "The therapist brings what the session requires and builds the home program around what is already in the house.",
          },
          {
            q: "Can therapy be combined with occupational therapy?",
            a: "Often, yes. Physical therapy works on moving; occupational therapy works on the tasks. Many patients are scheduled for both.",
          },
        ],
      },
    },
    {
      key: "occupational",
      slug: "occupational-therapy",
      accent: "gold" as Accent,
      name: "Occupational Therapy",
      short: "Getting back to everyday tasks safely.",
      headline: "Back to the everyday things",
      copy: "Therapy aimed at the tasks that make a day work — dressing, bathing, cooking, getting in and out of a chair. Therapists assess the home as it stands, then train around it, with adaptive equipment where equipment is what helps.",
      points: [
        "Activities-of-daily-living training",
        "Adaptive equipment and technique",
        "Home safety assessment",
      ],
      chip: "Daily living",
      enquire: "Request occupational therapy",
      page: {
        title: ["Occupational therapy,", "task by task"],
        lede:
          "Independence is not one skill, it is a hundred small ones — reaching a cupboard, standing from a chair, managing a shower alone. Occupational therapy rebuilds those specifically, in the place they have to work.",
        included: [
          {
            title: "Daily living retraining",
            copy: "Dressing, bathing, grooming, cooking and eating, retrained with technique before equipment.",
          },
          {
            title: "Adaptive equipment",
            copy: "Reachers, seating, bathing aids and utensils, recommended and then actually practised with.",
          },
          {
            title: "Home safety assessment",
            copy: "A room-by-room review of what the patient does in a day and what the home makes harder than it needs to be.",
          },
          {
            title: "Caregiver training",
            copy: "The people helping day to day learn the same techniques, so care does not reset between visits.",
          },
        ],
        who: [
          "Stroke survivors relearning one-handed or seated technique",
          "Patients with arthritis or Parkinson's managing daily tasks",
          "Adults recovering from a hand, shoulder or upper-limb injury",
          "Patients with memory loss who need routines simplified",
          "Households where a caregiver needs training as much as the patient does",
        ],
        steps: [
          {
            title: "Assessment in context",
            copy: "The therapist watches the tasks that are actually difficult, in the rooms where they happen.",
          },
          {
            title: "Technique, then equipment",
            copy: "Method is trained first; adaptive equipment is added where it genuinely earns its place.",
          },
          {
            title: "Handover to the household",
            copy: "Patient and caregivers are trained together, and anything structural is referred on for modification.",
          },
        ],
        faq: [
          {
            q: "How is this different from physical therapy?",
            a: "Physical therapy targets movement — strength, gait, balance. Occupational therapy targets the tasks that movement is for, like dressing, bathing and cooking.",
          },
          {
            q: "Will you recommend equipment we then have to source ourselves?",
            a: "We tell you exactly what is needed and why. Where the answer is structural — a grab bar, a shower conversion — it can go straight to our home modifications team.",
          },
          {
            q: "Can caregivers be included in sessions?",
            a: "Yes, and we encourage it. Training the household is usually what makes the gains stick.",
          },
        ],
      },
    },
    {
      key: "homemods",
      slug: "medical-home-modifications",
      accent: "coral" as Accent,
      name: "Medical Home Modifications",
      short: "Ramps, grab bars and bathroom conversions.",
      headline: "A home that stops working against the patient",
      copy: "Ramps, grab bars, stair lifts and bathroom conversions, specified from a clinical assessment rather than guesswork — then built, installed and checked. The same assessment our therapists already carry out becomes the specification.",
      points: [
        "Ramps, grab bars and stair lifts",
        "Walk-in shower and bathroom conversions",
        "Specified from a clinical assessment",
      ],
      chip: "Access & safety",
      enquire: "Request medical home modifications",
      page: {
        title: ["Medical home", "modifications"],
        lede:
          "Most falls happen in a handful of predictable places. Modifications are the part of care that outlasts the visits — built to what the assessment found, not to what fitted in the van.",
        included: [
          {
            title: "Access and entry",
            copy: "Ramps, threshold ramps, handrails and widened doorways so the front door stops being the hardest part of the day.",
          },
          {
            title: "Bathroom conversions",
            copy: "Walk-in and roll-in showers, grab bars set to the patient's reach, raised seating and non-slip flooring.",
          },
          {
            title: "Stairs and levels",
            copy: "Stair lifts, handrails and step modifications where a home has levels the patient cannot manage.",
          },
          {
            title: "Clinically specified",
            copy: "Heights, widths and placements come from the therapist's assessment of this patient, not a standard install sheet.",
          },
        ],
        who: [
          "Patients coming home to a house they can no longer navigate",
          "Wheelchair users whose entry or bathroom is not accessible",
          "Older adults staying at home rather than moving to assisted living",
          "Households after a fall, where the cause is still in place",
          "Families acting on a therapist's home safety recommendations",
        ],
        steps: [
          {
            title: "Assessment and specification",
            copy: "A clinician reviews the home against what the patient can do, and the findings become the build specification.",
          },
          {
            title: "Scope and quote",
            copy: "You get the work, the sequence and the cost in writing before anything is ordered.",
          },
          {
            title: "Install and verify",
            copy: "The work is installed, then checked with the patient using it — not just signed off as complete.",
          },
        ],
        faq: [
          {
            q: "Do we need a therapy assessment first?",
            a: "It is the best starting point, because it tells us the reach, height and clearance this particular patient needs. If an assessment already exists, we can work from it.",
          },
          {
            q: "How quickly can work start?",
            a: "It depends on scope: grab bars and threshold ramps are quick, a full bathroom conversion is a build. We give you the timeline with the quote.",
          },
          {
            q: "Can this be arranged alongside a hospital discharge?",
            a: "Yes, and that is when it matters most. Tell us the discharge date and we will tell you honestly what can be in place by then.",
          },
        ],
      },
    },
  ],
} as const;

/** The service line behind a /services/<slug> route, if the slug is real. */
export type Service = (typeof SERVICES.items)[number];

export function serviceBySlug(slug: string): Service | undefined {
  return SERVICES.items.find((item) => item.slug === slug);
}

/* ---- Crew ------------------------------------------------- */

export const CREW = {
  eyebrow: "Specialists",
  title: ["Meet the crew", "behind every mile"],
  lede:
    "Paramedics, flight nurses and intensive-care physicians who stay with your patient from bedside to bedside — one team, one handover, one record.",
  cta: { label: "View all crew", href: "/#contact" },
  people: [
    { role: "Critical Care Paramedic", name: "Daniel Whitfield", line: "Leads advanced-life-support road transfers and ventilated inter-facility moves.", meta: "On the road since 2014" },
    { role: "Flight Nurse", name: "Amara Osei", line: "Fixed-wing and rotary repatriation, bedside to bedside.", meta: "Flying since 2016" },
    { role: "Intensive Care Physician", name: "Dr Sofia Marchetti", line: "Escorts the most unstable patients we move.", meta: "Practising since 2009" },
    { role: "Neonatal Transport Nurse", name: "Priya Raman", line: "Transport incubators and neonatal ventilation.", meta: "With General Medical since 2015" },
    { role: "Dispatch Lead", name: "Marcus Feld", line: "Runs the 24/7 desk and every contract response window.", meta: "With General Medical since 2012" },
    { role: "Bariatric Specialist", name: "Tomas Nowak", line: "Powered loading and safe manual handling.", meta: "With General Medical since 2017" },
    { role: "Emergency Medical Technician", name: "Chloe Bennett", line: "Discharge and step-down transfers across London.", meta: "With General Medical since 2019" },
    { role: "Retrieval Consultant", name: "Dr Idris Kamara", line: "Pre-hospital retrieval and major trauma transfer.", meta: "Practising since 2007" },
    { role: "Paediatric Nurse", name: "Hannah Vogel", line: "Paediatric critical care in transit.", meta: "With General Medical since 2018" },
    { role: "Anaesthetic Practitioner", name: "Ravi Deshmukh", line: "Airway management on long transfers.", meta: "Practising since 2011" },
    { role: "Mental Health Escort", name: "Naomi Clarke", line: "Section 136 and voluntary psychiatric transport.", meta: "With General Medical since 2016" },
    { role: "Ambulance Technician", name: "Luca Ferretti", line: "Non-emergency and renal pathway transport.", meta: "With General Medical since 2020" },
    { role: "Infection Control Lead", name: "Dr Mei Tanaka", line: "Isolation transfers and decontamination protocol.", meta: "Practising since 2010" },
    { role: "Fleet Clinical Engineer", name: "Owen Pritchard", line: "Keeps every monitor, pump and ventilator in service.", meta: "With General Medical since 2013" },
    { role: "Repatriation Coordinator", name: "Sara Lindqvist", line: "Cross-border logistics, escorts and customs.", meta: "With General Medical since 2015" },
    { role: "Advanced Paramedic", name: "Grace Adeyemi", line: "Community response and urgent care pathways.", meta: "On the road since 2017" },
    { role: "Neonatal Consultant", name: "Dr Peter Halloran", line: "Clinical oversight for every neonatal move.", meta: "Practising since 2005" },
  ],
} as const;

/* ---- Ticker ----------------------------------------------- */

export const TICKER = [
  "Non-emergency medical transportation",
  "Non-emergency ambulance",
  "Home health",
  "Physical therapy",
  "Occupational therapy",
  "Medical home modifications",
  "Scheduled. Staffed. Supervised.",
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
      accent: "coral" as Accent,
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
      accent: "azure" as Accent,
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
      accent: "violet" as Accent,
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
      accent: "mint" as Accent,
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
    "General Medical plugs into the way your trust already works — one agreement, one invoice, and dispatch you can trigger from your own software.",
  facts: [
    { label: "Response window", value: "Contracted per tier" },
    { label: "Coverage", value: "UK-wide, Europe on request" },
    { label: "Reporting", value: "Monthly SLA pack, live API" },
  ],
  cta: { label: "Talk to our contracts team", href: "/#contact" },
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
        { label: "Non-Emergency Transportation", href: "/services/non-emergency-medical-transportation" },
        { label: "Non-Emergency Ambulance", href: "/services/non-emergency-ambulance" },
        { label: "Home Health", href: "/services/home-health" },
        { label: "Physical Therapy", href: "/services/physical-therapy" },
        { label: "Occupational Therapy", href: "/services/occupational-therapy" },
        { label: "Medical Home Modifications", href: "/services/medical-home-modifications" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About us", href: "/#about" },
        { label: "Our crew", href: "/#crew" },
        { label: "Case studies", href: "/#cases" },
        { label: "For partners", href: "/#partners" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Transfer calculator", href: "/#calculator" },
        { label: "Coverage map", href: "/#calculator" },
        { label: "SLA reporting", href: "/#partners" },
        { label: "Dispatch API", href: "/#partners" },
      ],
    },
    {
      title: "Contact",
      links: [
        { label: "Request a transfer", href: "/#contact" },
        { label: "Contracts team", href: "/#contact" },
        { label: "Privacy Policy", href: "#" },
        { label: "Terms of Service", href: "#" },
      ],
    },
  ],
  legal: "General Medical — Scheduled. Staffed. Supervised.",
  wordmark: "General Medical",
} as const;
