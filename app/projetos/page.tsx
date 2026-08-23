import type { Metadata } from 'next';
import { CaseShell } from '@/components/CaseShell/CaseShell';
import { ProjectsPage } from '@/components/ProjectsPage/ProjectsPage';

const TITLE = 'Todos os projetos — João V. Melo';
const DESCRIPTION =
  'Índice completo do trabalho: quatro cases com estudo escrito e seis projetos em banking, varejo de alto volume, consultoria global e startups.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: { title: TITLE, description: DESCRIPTION, type: 'website' },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION },
};

/* CaseShell carries the nav, menu, contact modal and back-to-top — the same chrome a case page
 * gets, and for the same reason: without it the bar renders with no handlers and goes dead. */
export default function Page() {
  return (
    <CaseShell>
      <ProjectsPage />
    </CaseShell>
  );
}
