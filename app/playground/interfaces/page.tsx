import type { Metadata } from 'next';
import { CaseShell } from '@/components/CaseShell/CaseShell';
import { InterfacesPage } from '@/components/InterfacesPage/InterfacesPage';

const TITLE = 'Interfaces · João V. Melo';
const DESCRIPTION = 'Telas desenhadas para produto, das que podem ser mostradas.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  robots: { index: false, follow: false },
  openGraph: { title: TITLE, description: DESCRIPTION, type: 'website' },
};

export default function Page() {
  return (
    <CaseShell>
      <InterfacesPage />
    </CaseShell>
  );
}
