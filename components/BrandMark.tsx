/* The Curavel mark — a droplet with a cross cut out of it.
   Inherits currentColor so it works on white and over photography. */

export function BrandMark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 28 28"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="cvMark" x1="6" y1="3" x2="22" y2="25" gradientUnits="userSpaceOnUse">
          <stop stopColor="currentColor" stopOpacity=".95" />
          <stop offset="1" stopColor="currentColor" stopOpacity=".62" />
        </linearGradient>
      </defs>
      <path
        d="M14 2.6c4.9 5.3 8.2 9.6 8.2 13.6A8.2 8.2 0 0 1 14 24.4a8.2 8.2 0 0 1-8.2-8.2c0-4 3.3-8.3 8.2-13.6Z"
        fill="url(#cvMark)"
      />
      <path
        d="M12.5 12.1h3v2.9h2.9v3h-2.9v2.9h-3V18h-2.9v-3h2.9v-2.9Z"
        fill="#fff"
        fillOpacity=".92"
      />
    </svg>
  );
}
