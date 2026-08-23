import type { MetadataRoute } from 'next';

/**
 * Crawling is allowed, and as of 2026-08-22 indexing is too — the `noindex` block that used to
 * sit in app/layout.tsx has been removed.
 *
 * If the site ever needs to come back out of search, add `robots: { index: false }` to the
 * metadata in app/layout.tsx rather than adding a Disallow here. A Disallow blocks crawling, and
 * a crawler that never fetches the page never reads the noindex — Google can still list a
 * disallowed URL picked up from inbound links, with no clean way to remove it.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
  };
}
