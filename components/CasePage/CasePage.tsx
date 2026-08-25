'use client';

import { useEffect, useState } from 'react';
import { CaseChart } from '@/components/CaseChart/CaseChart';
import { CaseFigure } from '@/components/CaseFigure/CaseFigure';
import { CaseReader, type ReaderPage } from '@/components/CaseReader/CaseReader';
import { useLanguage } from '@/lib/language';
import { cases, caseDetails, casePage as copy, type CaseSection, type T } from '@/content/copy';
import styles from './CasePage.module.css';

/**
 * Authoring scaffolding: these prompts exist to tell João which fields still need writing.
 *
 * DEV ONLY. The site is public and indexable, so a visitor must never land on a page telling
 * them what the author has not written yet — that reads as an abandoned draft, which is worse
 * than a shorter page. In production the prompt renders nothing, and any spread that would be
 * entirely empty is never built.
 */
const SHOW_PROMPTS = process.env.NODE_ENV !== 'production';

function Missing({ what, ask, dark }: { what: string; ask: string; dark?: boolean }) {
  if (!SHOW_PROMPTS) return null;
  return (
    <div className={styles.todo} style={dark ? { color: 'var(--on-dark)' } : undefined}>
      <span className={styles.todoTitle}>Falta escrever: {what}</span>
      {ask}
    </div>
  );
}

/**
 * How long this takes to read.
 *
 * 160 words a minute, not the 200 a newspaper assumes. That figure is for skimming English news
 * prose; this is considered reading, in Portuguese, about work the reader is deciding something
 * from.
 */
function readingMinutes(words: number) {
  return Math.max(1, Math.round(words / 160));
}

/**
 * A case, composed as a set of spreads for the horizontal reader.
 *
 * The 6s / 60s / 6min method still shapes it — the opening, the argument, then the detail — and
 * still does not announce itself. What changed is the axis: this is a newspaper now, and a
 * newspaper is turned rather than scrolled. Each block of the argument becomes one spread, so
 * the structure the method describes is the structure the reader physically moves through.
 */
export function CasePage({ slug }: { slug: string }) {
  const { t } = useLanguage();

  /*
   * Where "back" goes, decided by where the reader came from.
   *
   * Read in an effect rather than during render: sessionStorage does not exist on the server, and
   * reading it while rendering would give the server one answer and the browser another, which is
   * the mismatch React calls a hydration error.
   */
  const [fromHome, setFromHome] = useState(false);

  useEffect(() => {
    try {
      setFromHome(sessionStorage.getItem('caseOrigin') === 'home');
    } catch {
      /* Storage refused — the projects index is the safe destination. */
    }
  }, []);

  const summary = cases.find((c) => c.slug === slug);
  const data = caseDetails[slug];
  if (!summary || !data) return null;

  const line = (v: T | null) => (v ? t(v) : null);

  const hasArgument = Boolean(data.conflict || data.tradeoff || data.decision);
  const showArgument = SHOW_PROMPTS || hasArgument;

  type Chapter = { key: string; heading: string; body: string; points?: CaseSection['points'] };

  const details: Chapter[] = data.detail.map((d, i) => ({
    key: `d${i}`,
    heading: t(d.title),
    body: t(d.body),
    points: d.points,
  }));

  const challenge = line(data.challenge)
    ? [{ key: 'challenge', heading: t(copy.headings.challenge), body: line(data.challenge)! }]
    : [];

  /*
   * The hardest part sits SECOND, after the opening context. Leading with it asks the reader to
   * weigh a difficulty before they know what the work was.
   */
  const chapters: Chapter[] = [
    ...details.slice(0, 1),
    ...challenge,
    ...details.slice(1),
    ...(line(data.gameChanger)
      ? [{ key: 'game', heading: t(copy.headings.gameChanger), body: line(data.gameChanger)! }]
      : []),
  ];

  const words =
    [t(data.context), ...chapters.map((c) => c.body), ...data.contribution.map((c) => t(c))]
      .join(' ')
      .trim()
      .split(/\s+/).length;

  const minutes = data.readTime ?? readingMinutes(words);

  /* ------------------------------------------------------- the spreads */

  const pages: ReaderPage[] = [];

  pages.push({
    id: 'p-open',
    /* "Abertura", not the case title: the index is a list of parts, and the title is the whole. */
    label: t(copy.headings.opening),
    node: (
      <div className={styles.opening}>
        <h1 className={styles.title}>{t(summary.title)}</h1>
        <p className={styles.standfirst}>{t(data.context)}</p>

        <div className={styles.impact}>
          <span className={styles.impactValue}>{data.impact.value}</span>
          <span className={styles.impactText}>
            <span className={styles.impactLabel}>{t(data.impact.label)}</span>
            <span className={styles.impactNote}>{t(data.impact.note)}</span>
          </span>
        </div>
      </div>
    ),
  });

  if (showArgument) {
    const parts: { head: string; body: string | null; what: string; ask: string }[] = [
      {
        head: t(copy.headings.conflict),
        body: line(data.conflict),
        what: 'o conflito',
        ask: 'Quais duas forças não podiam vencer ao mesmo tempo?',
      },
      {
        head: t(copy.headings.tradeoff),
        body: line(data.tradeoff),
        what: 'o trade-off',
        ask: 'O que foi deliberadamente sacrificado para resolver o conflito? Sem isso, o case vira lista de entregas.',
      },
      {
        head: t(copy.headings.decision),
        body: line(data.decision),
        what: 'a decisão',
        ask: 'Qual foi a escolha feita, e por quê? Uma frase da qual alguém possa discordar.',
      },
    ];

    pages.push({
      id: 'p-argue',
      label: t(copy.headings.conflict),
      tone: 'dark',
      node: (
        <div className={`${styles.argue} nierIgnore`}>
          <div className={styles.argument}>
            {parts.map((part) => (
              <div key={part.what} className={styles.arg}>
                <p className={styles.argHead}>{part.head}</p>
                {part.body ? (
                  part.body.split(/\n{2,}/).map((para, i) => (
                    <p key={i} className={styles.argBody}>
                      {para}
                    </p>
                  ))
                ) : (
                  <Missing dark what={part.what} ask={part.ask} />
                )}
              </div>
            ))}
          </div>
        </div>
      ),
    });
  }

  if (data.evidence.length > 0 || data.chart) {
    pages.push({
      id: 'p-numbers',
      label: t(copy.headings.results),
      /* The chart is drawn in the --on-dark palette, so its spread has to be the dark one. */
      tone: 'dark',
      node: (
        <div className={styles.numbers}>
          <p className={styles.spreadHead}>{t(copy.headings.results)}</p>

          {/*
            * Cards on the left, chart on the right, once there is width for it. Stacked, this
            * spread ran past the bottom of a 768px screen, and a page you have to scroll is not a
            * page you turn.
            */}
          <div className={styles.numbersGrid}>
            {data.evidence.length > 0 && (
              <div className={styles.evidence}>
                {data.evidence.map((e, i) => (
                  <div key={i}>
                    <div className={styles.evidenceValue}>{e.value}</div>
                    <div className={styles.evidenceLabel}>{t(e.label)}</div>
                    <div className={styles.evidenceNote}>{t(e.note)}</div>
                  </div>
                ))}
              </div>
            )}

            {data.chart && <CaseChart data={data.chart} />}
          </div>
        </div>
      ),
    });
  }

  for (const c of chapters) {
    pages.push({
      id: `p-${c.key}`,
      label: c.heading,
      node: (
        <div className={styles.chapter}>
          <h2 className={styles.chapterHead}>{c.heading}</h2>

          {/*
            * The columns of a newspaper page. Text flows down one and into the next, which is how
            * a spread holds four paragraphs in the height of a screen without either shrinking
            * the type or asking the reader to scroll inside a page they are meant to turn.
            */}
          <div className={styles.flow}>
            {c.body.split(/\n{2,}/).map((para, i) => (
              <p key={i} className={styles.chapterBody}>
                {para}
              </p>
            ))}
          </div>

          {c.points && c.points.length > 0 && (
            <ul
              className={c.points.some((pt) => pt.body) ? styles.cards : styles.principles}
              style={{ ['--n' as string]: c.points.length }}
            >
              {c.points.map((pt, i) => (
                <li key={i} className={styles.point}>
                  <span className={styles.pointNum}>{String(i + 1).padStart(2, '0')}</span>
                  <span className={styles.pointTitle}>{t(pt.title)}</span>
                  {pt.body && <span className={styles.pointBody}>{t(pt.body)}</span>}
                </li>
              ))}
            </ul>
          )}
        </div>
      ),
    });
  }

  if (SHOW_PROMPTS || data.contribution.length > 0) {
    pages.push({
      id: 'p-role',
      label: t(copy.headings.contribution),
      node: (
        <div className={styles.chapter}>
          <h2 className={styles.chapterHead}>{t(copy.headings.contribution)}</h2>
          {data.contribution.length > 0 ? (
            <ul className={styles.contribution}>
              {data.contribution.map((c, i) => (
                <li key={i}>{t(c)}</li>
              ))}
            </ul>
          ) : (
            <Missing
              what="o meu papel"
              ask="O que foi seu, em primeira pessoa? Três ou quatro linhas, cada uma começando com um verbo."
            />
          )}
        </div>
      ),
    });
  }

  if (data.gallery.length > 0) {
    pages.push({
      id: 'p-gallery',
      label: t(copy.headings.gallery),
      node: (
        <div className={styles.gallery}>
          {data.gallery.map((g, i) => (
            <CaseFigure key={i} media={g} slug={slug} />
          ))}
        </div>
      ),
    });
  }

  return (
    <CaseReader
      pages={pages}
      backHref={fromHome ? '/' : '/projetos'}
      backLabel={fromHome ? t(copy.backHome) : t(copy.back)}
      folio={
        <>
          <span>{t(summary.company)}</span>
          <span>{t(data.role)}</span>
          <span>{data.year}</span>
          <span>
            {minutes} {t(minutes === 1 ? copy.readingTimeOne : copy.readingTime)}
          </span>
        </>
      }
    />
  );
}
