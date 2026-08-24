import { Playfair_Display, Archivo, Jost } from 'next/font/google';

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

/**
 * The other identity's voice.
 *
 * Jost is a geometric grotesque in the Futura line, which is what the reference's interface is
 * set in — near-circular bowls, a single-storey 'a', uniform strokes. Archivo is a fine text
 * face and completely wrong here: it has the humanist detailing that makes the portfolio feel
 * printed, and printed is the opposite of what this surface is.
 *
 * Only the NieR surfaces load it — the gate, the craft page, and the button while it is being
 * hovered. It is one more weight on the wire and it buys the whole change of voice.
 */
export const jost = Jost({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  display: 'swap',
  variable: '--font-jost',
});
