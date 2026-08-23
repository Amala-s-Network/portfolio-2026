'use client';

import Link from 'next/link';
import { useRef } from 'react';
import { Reveal } from '@/components/Reveal/Reveal';
import { useReveal } from '@/hooks/useReveal';
import { useLanguage } from '@/lib/language';
import { cases, projects, caseDetails, projectsPage as copy } from '@/content/copy';
import styles from './ProjectsPage.module.css';

/**
 * The index behind "ver todos os projetos".
 *
 * The page exists in two halves on purpose, and the split is editorial rather than technical.
 * Four projects have a written case behind them and are links; six do not and are not. Making
 * all ten look alike would have been tidier and would have meant six cards that invite a click
 * and answer with nothing — which is the defect this page was built to remove from the site.
 */
export function ProjectsPage() {
  const { t } = useLanguage();
  const headRef = useRef<HTMLElement>(null);
  const casesRef = useRef<HTMLElement>(null);
  const othersRef = useRef<HTMLElement>(null);

  const headIn = useReveal(headRef);
  const casesIn = useReveal(casesRef);
  const othersIn = useReveal(othersRef);

  return (
    <article className={styles.page}>
      <header ref={headRef} className={styles.head}>
        <Link className={styles.back} href="/">
          <span className={styles.backArrow} aria-hidden="true">
            ⇠
          </span>
          {t(copy.back)}
        </Link>

        <div className={styles.folio}>
          <span>{t(copy.folioLeft)}</span>
          <span>{t(copy.folioRight)}</span>
        </div>

        <Reveal on={headIn} order={0}>
          <h1 className={styles.heading}>{t(copy.heading)}</h1>
        </Reveal>

        <Reveal on={headIn} order={1}>
          <p className={styles.intro}>{t(copy.intro)}</p>
        </Reveal>
      </header>

      {/* ------------------------------------------------ the four written cases */}
      <section ref={casesRef} className={styles.block}>
        <Reveal on={casesIn} order={0}>
          <span className={styles.blockMark}>
            <span className={styles.diamond} aria-hidden="true" />
            {t(copy.casesHeading)}
          </span>
        </Reveal>

        <ol className={styles.caseList}>
          {cases.map((c, i) => {
            const detail = caseDetails[c.slug];
            return (
              <Reveal key={c.slug} on={casesIn} order={i + 1} as="li" className={styles.caseItem}>
                <Link className={styles.caseLink} href={`/cases/${c.slug}`}>
                  <span className={styles.caseIndex} aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>

                  <span className={styles.caseFrame}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={c.photo ?? `/placeholders/cases/${c.slug}.svg`}
                      alt=""
                      aria-hidden="true"
                    />
                  </span>

                  <span className={styles.caseText}>
                    <span className={styles.caseCompany}>{t(c.company)}</span>
                    <span className={styles.caseTitle}>{t(c.title)}</span>
                    <span className={styles.caseDesc}>{t(c.description)}</span>

                    <span className={styles.caseFoot}>
                      {/* The impact number is the one thing a skimming reader takes away. */}
                      {detail ? (
                        <span className={styles.caseImpact}>{detail.impact.value}</span>
                      ) : null}
                      <span className={styles.caseCta}>
                        {t(copy.readCase)}
                        <span className={styles.caseArrow} aria-hidden="true">
                          →
                        </span>
                      </span>
                    </span>
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </ol>
      </section>

      {/* --------------------------------------------- the six without a page yet */}
      <section ref={othersRef} className={styles.block}>
        <Reveal on={othersIn} order={0}>
          <span className={styles.blockMark}>
            <span className={styles.diamond} aria-hidden="true" />
            {t(copy.othersHeading)}
          </span>
        </Reveal>

        <Reveal on={othersIn} order={1}>
          <p className={styles.othersNote}>{t(copy.othersNote)}</p>
        </Reveal>

        <ul className={styles.grid}>
          {projects.map((p, i) => (
            <Reveal key={p.slug} on={othersIn} order={i + 2} as="li" className={styles.gridItem}>
              {/* Not a link, and not focusable — there is nothing behind it yet. */}
              <span className={styles.gridFrame}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.image ?? `/placeholders/projects/${p.slug}.svg`}
                  alt=""
                  aria-hidden="true"
                />
              </span>
              <span className={styles.gridName}>{t(p.name)}</span>
              <span className={styles.gridCompany}>{t(p.company)}</span>
            </Reveal>
          ))}
        </ul>
      </section>
    </article>
  );
}
