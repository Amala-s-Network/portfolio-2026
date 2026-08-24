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
      <head>
        {/*
          * Every load starts at the top.
          *
          * This has to be an inline script in the head, and a React effect will not do — which
          * is how the first attempt failed. The browser restores the previous scroll position
          * during load, long before hydration, and Next's router sets scrollRestoration back to
          * "auto" for its own purposes; by the time an effect runs, the page has already been
          * put back where the reader left it. Parsed here, this runs before either happens.
          *
          * It matters more than tidiness: the case sequence is driven entirely by scroll offset,
          * so being dropped into the middle of it on a reload means landing among panels whose
          * arrival was never played.
          */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "if('scrollRestoration' in history){history.scrollRestoration='manual'}" +
              "window.addEventListener('load',function(){window.scrollTo(0,0)});",
          }}
        />
      </head>
      <body>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
