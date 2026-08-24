import type { Metadata } from 'next';
import { CraftPage } from '@/components/CraftPage/CraftPage';

const TITLE = 'Craft — João V. Melo';
const DESCRIPTION =
  'Trabalho autoral e briefings inventados: peças feitas por gosto, fora do portfólio de produto.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  /*
   * Deliberately kept out of search results while it is a shell. A page that promises fictional
   * case studies and currently has none is not something to be found by a stranger through a
   * search — it is somewhere João sends people from his own front page.
   */
  robots: { index: false, follow: false },
  openGraph: { title: TITLE, description: DESCRIPTION, type: 'website' },
};

export default function Page() {
  return <CraftPage />;
}
