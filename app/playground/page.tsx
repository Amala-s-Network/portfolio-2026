import type { Metadata } from 'next';
import { CaseShell } from '@/components/CaseShell/CaseShell';
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

export default function Page() {
  return (
    <CaseShell>
      <Playground />
    </CaseShell>
  );
}
