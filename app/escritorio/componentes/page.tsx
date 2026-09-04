import type { Metadata } from 'next';
import { CaseShell } from '@/components/CaseShell/CaseShell';
import { ComponentsPage } from '@/components/ComponentsPage/ComponentsPage';

const TITLE = 'Componentes · João V. Melo';
const DESCRIPTION = 'As peças que montam este site, soltas da página, para clicar e testar.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  robots: { index: false, follow: false },
  openGraph: { title: TITLE, description: DESCRIPTION, type: 'website' },
};

export default function Page() {
  return (
    <CaseShell>
      <ComponentsPage />
    </CaseShell>
  );
}
