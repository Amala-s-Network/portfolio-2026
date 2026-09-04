import type { Metadata } from 'next';
import { CaseShell } from '@/components/CaseShell/CaseShell';
import { Escritorio } from '@/components/Escritorio/Escritorio';

const TITLE = 'Escritório · João V. Melo';
const DESCRIPTION =
  'Uma sala desenhada em código: três quadros, um fliperama que funciona, um computador tocando alguma coisa e três gatos que não obedecem ninguém.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  /*
   * Out of search while it is reachable only from the nav button, at João's instruction. It is
   * somewhere he sends people from his own site, not a page a stranger should land on cold.
   */
  robots: { index: false, follow: false },
  openGraph: { title: TITLE, description: DESCRIPTION, type: 'website' },
};

/*
 * The chrome is back, in its fixed form.
 *
 * It came off in the first pass for a real reason — the site nav landed on top of the HUD and the
 * h1 sat behind the wordmark — but "no bar" was the wrong fix for "two headers in the same 72px".
 * The right one is to measure: CaseShell's noScroll variant starts the page under the bar, so the
 * room gets the viewport minus the nav and the two never overlap. The reader keeps the menu, the
 * language pair and "Entrar em contato" everywhere on the site, this room included.
 *
 * Back-to-top is suppressed by the same variant: this page does not scroll, so the nav's progress
 * bar reads zero and a button that returns you to a top you never left would be chrome pretending
 * to be a control.
 */
export default function Page() {
  return (
    <CaseShell noScroll>
      <Escritorio />
    </CaseShell>
  );
}
