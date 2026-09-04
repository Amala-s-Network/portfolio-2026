import type { NextConfig } from 'next';

/**
 * Security headers. These four are pure wins — no tradeoff, no behaviour change.
 *
 * A Content-Security-Policy is deliberately NOT here. Next's App Router injects inline scripts
 * to carry hydration data, so a CSP has exactly two shapes: allow `unsafe-inline` for scripts,
 * which permits precisely the injected-script attack a CSP exists to stop and buys close to
 * nothing; or issue a per-request nonce from middleware, which works properly but forces every
 * page to render dynamically and gives up the static prerender the whole site currently enjoys.
 * That is a real decision with a real cost, not a config line — see the note to João.
 */
const securityHeaders = [
  // Stops the browser second-guessing a declared Content-Type — the classic vector for making
  // an uploaded or user-controlled file execute as script.
  { key: 'X-Content-Type-Options', value: 'nosniff' },

  // Send the origin, not the full URL, when leaving the site. The case URLs are not secret, but
  // there is no reason to hand full paths to Drive, LinkedIn or Behance.
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },

  // The site can currently be framed by anyone, which is what clickjacking needs. Nothing here
  // is meant to be embedded. frame-ancestors is the modern form; X-Frame-Options covers old
  // browsers that ignore it.
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Content-Security-Policy', value: "frame-ancestors 'none'" },

  // The page asks for none of these, so refuse them outright rather than leaving them available.
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=(), payment=(), usb=()',
  },
];

const nextConfig: NextConfig = {
  images: {
    /*
     * AVIF first, WebP as the fallback. Measured on production: the portrait at w=1080 is
     * already served as a 31.9 KB WebP, so this is a marginal gain rather than the large one
     * it might sound like — AVIF typically takes another 20–30% off that.
     */
    formats: ['image/avif', 'image/webp'],
  },

  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },

  /*
   * /playground moved to /escritorio, and the old paths keep working.
   *
   * Permanent rather than temporary: the room is not coming back to the old address, so a 308
   * lets browsers and anything that has already crawled the site stop asking. The wildcard covers
   * the two pages behind the frames — /playground/interfaces and /playground/componentes — in one
   * rule instead of three, and it is a redirect rather than a rewrite so the address bar actually
   * changes: a rewrite would leave people copying a URL that no longer names the page.
   */
  async redirects() {
    return [
      { source: '/playground', destination: '/escritorio', permanent: true },
      { source: '/playground/:path*', destination: '/escritorio/:path*', permanent: true },
    ];
  },
};

export default nextConfig;
