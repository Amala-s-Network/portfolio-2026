import type { Metadata } from 'next';
import { Playground } from '@/components/Playground/Playground';

const TITLE = 'Playground · João V. Melo';
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
 * No CaseShell here, and that is the design rather than an omission.
 *
 * The room fills one viewport and carries its own chrome: the wordmark and the title in one
 * corner, the instruction in another, the doors along the bottom. Dropping the site nav on top of
 * that gives the reader two headers arguing over the same 60px — which is exactly what it did,
 * with the h1 sitting behind the wordmark. The way back is the wordmark in the HUD.
 */
export default function Page() {
  return <Playground />;
}
