import type { Metadata } from 'next';
import { playfair, archivo } from '@/lib/fonts';
import { LanguageProvider } from '@/lib/language';
import './globals.css';

const SITE = 'https://joaomeloux.vercel.app';
const TITLE = 'João V. Melo — Senior Product Designer & CX Designer';
const DESCRIPTION =
  'Product Designer com 9 anos de experiência, 6 deles em produtos digitais. Banking em escala, varejo de alto volume, consultoria global e startups — com foco em craft, métricas e IA.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: TITLE,
  description: DESCRIPTION,
  authors: [{ name: 'João Vitor Melo', url: 'https://www.linkedin.com/in/joaovmelo' }],
  creator: 'João Vitor Melo',
  keywords: [
    'Product Designer',
    'CX Designer',
    'UX Designer',
    'Design System',
    'AI Product Builder',
    'Brasil',
  ],

  /* Link previews — what a recruiter sees when this URL is pasted into LinkedIn or WhatsApp. */
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: SITE,
    siteName: 'João V. Melo',
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
  },

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
