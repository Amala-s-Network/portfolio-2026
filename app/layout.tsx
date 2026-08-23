import type { Metadata, Viewport } from 'next';
import { playfair, archivo } from '@/lib/fonts';
import { LanguageProvider } from '@/lib/language';
import './globals.css';

const SITE = 'https://joaomeloux.vercel.app';
const TITLE = 'João V. Melo — Senior Product Designer & CX Designer';
const DESCRIPTION =
  'Product Designer com 9 anos de experiência, 6 deles em produtos digitais. Banking em escala, varejo de alto volume, consultoria global e startups — com foco em craft, métricas e IA.';

/*
 * Declared explicitly rather than left to the framework default.
 *
 * No maximumScale and no userScalable: false. Both are common in mobile boilerplate and both
 * break WCAG 1.4.4 — a user who needs to pinch-zoom to read is simply locked out. The only
 * thing set here is the initial scale.
 *
 * viewportFit: 'cover' lets the page paint into the notch/home-indicator area on iPhone; the
 * safe-area insets below keep content out of it.
 */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#14120f',
};

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
