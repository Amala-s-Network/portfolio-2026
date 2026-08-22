import type { Metadata } from 'next';
import { playfair, archivo } from '@/lib/fonts';
import { LanguageProvider } from '@/lib/language';
import './globals.css';

export const metadata: Metadata = {
  title: 'João V. Melo — Product Designer',
  description:
    'Product Designer com 9 anos em design, 6 dedicados a produtos digitais. Banking, varejo, consultoria global e startups.',
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
