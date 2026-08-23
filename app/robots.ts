import type { MetadataRoute } from 'next';

/**
 * Crawling is ALLOWED on purpose, even though the site is currently kept out of search.
 *
 * The `noindex` directive in app/layout.tsx is what does the blocking. A crawler has to fetch the
 * page to read that directive, so disallowing here would defeat it: Google would be unable to see
 * the noindex and could still list the URL from inbound links, with no way to drop it.
 *
 * Allow the crawl, serve noindex, and the page stays out of the index properly.
 *
 * REMOVE the robots block in app/layout.tsx before launch — this file can stay as it is.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
  };
}
