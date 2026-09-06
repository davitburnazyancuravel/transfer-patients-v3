/* Shared inline icons. Every icon inherits currentColor and sizes
   from its box, so callers style them with CSS only. */

export function ArrowRight() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false">
      <path
        d="M2.5 8h11m0 0L9 3.5M13.5 8 9 12.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ArrowLeft() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false">
      <path
        d="M13.5 8h-11m0 0L7 3.5M2.5 8 7 12.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Check() {
  return (
    <svg viewBox="0 0 12 12" fill="none" aria-hidden="true" focusable="false">
      <path
        d="M2.6 6.2 4.9 8.5 9.4 3.9"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Plus() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false">
      <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

export function Users() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false">
      <circle cx="6" cy="5.2" r="2.4" stroke="currentColor" strokeWidth="1.3" />
      <path d="M1.8 13c.4-2.3 2.1-3.6 4.2-3.6S9.8 10.7 10.2 13" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      <path d="M11 3.2a2.2 2.2 0 0 1 0 4.2M12.2 9.7c1.2.5 2 1.7 2.2 3.3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

export function Calendar() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false">
      <rect x="2" y="3.4" width="12" height="10.6" rx="2.2" stroke="currentColor" strokeWidth="1.3" />
      <path d="M2 6.9h12M5.4 1.9v2.6M10.6 1.9v2.6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}
