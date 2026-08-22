import { Playfair_Display, Archivo } from 'next/font/google';

/** Headings. README "Typography": weights 400/500/600/700. */
export const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-playfair',
});

/** Body / UI. README "Typography": weights 300/400/500/600/700. */
export const archivo = Archivo({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-archivo',
});
