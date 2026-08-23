import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Nav } from '@/components/Nav/Nav';
import { CasePage } from '@/components/CasePage/CasePage';
import { cases, caseDetails } from '@/content/copy';

type Params = { params: Promise<{ slug: string }> };

/** Prerender all four at build time — the set is static and known. */
export function generateStaticParams() {
  return cases.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const summary = cases.find((c) => c.slug === slug);
  const detail = caseDetails[slug];
  if (!summary || !detail) return {};

  const title = `${summary.title.pt} — João V. Melo`;
  const description = detail.context.pt;

  return {
    title,
    description,
    openGraph: { title, description, type: 'article' },
    twitter: { card: 'summary_large_image', title, description },
  };
}

export default async function Page({ params }: Params) {
  const { slug } = await params;
  if (!caseDetails[slug]) notFound();

  return (
    <>
      <Nav />
      <main>
        <CasePage slug={slug} />
      </main>
    </>
  );
}
