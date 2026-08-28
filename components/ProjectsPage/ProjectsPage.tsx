'use client';

import Link from 'next/link';
import { useMemo, useRef, useState } from 'react';
import { Reveal } from '@/components/Reveal/Reveal';
import { useReveal } from '@/hooks/useReveal';
import { useLanguage } from '@/lib/language';
import {
  cases,
  isHidden,
  projects,
  caseDetails,
  projectsPage as copy,
  type Category,
  type T,
} from '@/content/copy';
import styles from './ProjectsPage.module.css';

/** README-scale decision: eight to a page, then paginate (João's brief). */
const PER_PAGE = 8;

type Entry = {
  slug: string;
  categories: Category[];
  company: T;
  title: T;
  description: T;
  image: string;
  /** Only the four written cases have a page to go to. */
  href: string | null;
};

/**
 * The projects index.
 *
 * Cases and carousel projects are two shapes in content/copy.ts — one has a written study, the
 * other is a name and a company. On this page they are one list, because a visitor filtering by
 * "Interfaces" is asking about the work, not about how much of it has been written up. What
 * still separates them is whether the card is a link: the four with a case go somewhere, the six
 * without do not, and a card that invites a click and answers with nothing is the defect this
 * page was built to remove.
 */
export function ProjectsPage() {
  const { t } = useLanguage();
  const headRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const headIn = useReveal(headRef);

  const [tab, setTab] = useState<string>('todos');
  const [page, setPage] = useState(0);

  const all: Entry[] = useMemo(
    () => [
      /* A hidden case has no route, so it must not appear here offering to go to one. */
      ...cases.filter((c) => !isHidden(c.slug)).map((c) => ({
        slug: c.slug,
        categories: c.categories,
        company: c.company,
        title: c.title,
        description: c.description,
        image: c.photo ?? `/placeholders/cases/${c.slug}.svg`,
        href: caseDetails[c.slug] ? `/cases/${c.slug}` : null,
      })),
      ...projects.map((p) => ({
        slug: p.slug,
        categories: p.categories,
        company: p.company,
        title: p.name,
        /* No written description exists for these six yet — the company carries the card. */
        description: { pt: '', en: '' } as T,
        image: p.image ?? `/placeholders/projects/${p.slug}.svg`,
        href: null,
      })),
    ],
    []
  );

  const filtered = useMemo(
    () => (tab === 'todos' ? all : all.filter((e) => e.categories.includes(tab as Category))),
    [all, tab]
  );

  const pageCount = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const current = Math.min(page, pageCount - 1);
  const shown = filtered.slice(current * PER_PAGE, current * PER_PAGE + PER_PAGE);

  /* Changing filter resets to the first page — otherwise a narrow filter lands on page 2 of 1. */
  const chooseTab = (id: string) => {
    setTab(id);
    setPage(0);
  };

  const goToPage = (n: number) => {
    setPage(n);
    /* Send the reader back to the top of the grid, not the top of the document. */
    gridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <article className={styles.page}>
      <header ref={headRef} className={styles.head}>
        <Link className={styles.back} href="/">
          <span className={styles.backArrow} aria-hidden="true">
            ⇠
          </span>
          {t(copy.back)}
        </Link>

        <Reveal on={headIn} order={0}>
          <h1 className={styles.heading}>{t(copy.heading)}</h1>
        </Reveal>

        <Reveal on={headIn} order={1}>
          <p className={styles.subheading}>{t(copy.subheading)}</p>
        </Reveal>
      </header>

      {/*
        * A tablist, not a row of links.
        *
        * The filter changes what is on the page without changing the page, which is exactly what
        * the tab pattern describes — so it carries the roles that tell a screen reader the same
        * thing the underline tells everyone else. Arrow-key navigation is what the pattern
        * expects next; it is NOT implemented here, so every tab stays in the tab order rather
        * than pretending to be a composite widget that only half works.
        */}
      <div className={styles.tabsRow} role="tablist" aria-label={t(copy.subheading)}>
        {copy.tabs.map((tb) => (
          <button
            key={tb.id}
            type="button"
            role="tab"
            id={`tab-${tb.id}`}
            aria-selected={tab === tb.id}
            aria-controls="painel-projetos"
            className={`${styles.tab} ${tab === tb.id ? styles.tabActive : ''}`}
            onClick={() => chooseTab(tb.id)}
          >
            {t(tb.label)}
          </button>
        ))}
      </div>

      <div
        ref={gridRef}
        id="painel-projetos"
        role="tabpanel"
        aria-labelledby={`tab-${tab}`}
        className={styles.panel}
      >
        {shown.length === 0 ? (
          <p className={styles.empty}>{t(copy.empty)}</p>
        ) : (
          <ul className={styles.grid}>
            {shown.map((e) => {
              const inner = (
                <>
                  <span className={styles.frame}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={e.image} alt="" aria-hidden="true" />
                  </span>
                  <span className={styles.company}>{t(e.company)}</span>
                  <span className={styles.title}>{t(e.title)}</span>
                  {t(e.description) ? (
                    <span className={styles.desc}>{t(e.description)}</span>
                  ) : null}
                  {e.href ? (
                    <span className={styles.cta}>
                      {t(copy.readCase)}
                      <span className={styles.ctaArrow} aria-hidden="true">
                        →
                      </span>
                    </span>
                  ) : null}
                </>
              );

              return (
                <li key={e.slug} className={styles.card}>
                  {e.href ? (
                    <Link
                      className={styles.cardLink}
                      href={e.href}
                      onClick={() => {
                        try {
                          sessionStorage.setItem('caseOrigin', 'projetos');
                        } catch {
                          /* See CasePanel — storage can be refused, the default still holds. */
                        }
                      }}
                    >
                      {inner}
                    </Link>
                  ) : (
                    <div className={styles.cardStatic}>{inner}</div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Only when there is more than one page — a lone "1 of 1" is furniture. */}
      {pageCount > 1 && (
        <nav className={styles.pagination} aria-label={t(copy.pagination.page)}>
          <button
            type="button"
            className={styles.pageButton}
            onClick={() => goToPage(current - 1)}
            disabled={current === 0}
            aria-label={t(copy.pagination.previous)}
          >
            <span aria-hidden="true">⇠</span>
          </button>

          <span className={styles.pageCount} aria-live="polite">
            {t(copy.pagination.page)} {current + 1} {t(copy.pagination.of)} {pageCount}
          </span>

          <button
            type="button"
            className={styles.pageButton}
            onClick={() => goToPage(current + 1)}
            disabled={current === pageCount - 1}
            aria-label={t(copy.pagination.next)}
          >
            <span aria-hidden="true">⇢</span>
          </button>
        </nav>
      )}
    </article>
  );
}
