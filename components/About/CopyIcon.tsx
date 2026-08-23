/**
 * The two glyphs the site actually uses, inlined.
 *
 * These were imported from `lucide-react`, which put the package in the initial bundle for the
 * sake of two icons. Lucide's own source for both is a handful of SVG primitives — reproducing
 * them costs nothing and removes a dependency from the critical path entirely.
 *
 * Stroke geometry matches Lucide's defaults (24px grid, 2px stroke, round caps and joins) so
 * they sit correctly alongside anything added from the library later.
 */

type IconProps = { size?: number; className?: string };

const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
};

export function CopyIcon({ size = 17, className }: IconProps) {
  return (
    <svg {...base} width={size} height={size} className={className}>
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
  );
}

export function CheckIcon({ size = 17, className }: IconProps) {
  return (
    <svg {...base} width={size} height={size} className={className}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
