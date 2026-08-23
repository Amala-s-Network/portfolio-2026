import type { Metadata } from 'next';
import { playfair, archivo } from '@/lib/fonts';
import { LanguageProvider } from '@/lib/language';
import './globals.css';

export const metadata: Metadata = {
  title: 'João V. Melo — Product Designer',
  description:
    'Product Designer com 9 anos em design, 6 dedicados a produtos digitais. Banking, varejo, consultoria global e startups.',

  /*
   * KEPT OUT OF SEARCH while the case studies still carry placeholder imagery and unvalidated
   * copy. Requested by João 2026-08-22.
   *
   * `noindex` is the mechanism, deliberately NOT a robots.txt Disallow. A Disallow blocks
   * crawling, and a crawler that never fetches the page never reads this tag — Google can still
   * list a disallowed URL from inbound links, just without a snippet. Allowing the crawl and
   * serving noindex is what actually keeps it out of the index.
   *
   * REMOVE THIS BLOCK before launch, or the finished portfolio will be invisible to search.
   */
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${playfair.variable} ${archivo.variable}`}>
      <body>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
