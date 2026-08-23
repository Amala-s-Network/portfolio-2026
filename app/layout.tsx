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
