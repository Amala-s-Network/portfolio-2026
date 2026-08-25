'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { CaseChart } from '@/components/CaseChart/CaseChart';
import { CaseFigure } from '@/components/CaseFigure/CaseFigure';
import { CaseToc, type TocItem } from '@/components/CaseToc/CaseToc';
import { Reveal } from '@/components/Reveal/Reveal';
import { useReveal } from '@/hooks/useReveal';
import { useLanguage } from '@/lib/language';
import { cases, caseDetails, casePage as copy, type CaseSection, type T } from '@/content/copy';
import styles from './CasePage.module.css';

/**
 * Authoring scaffolding: these prompts exist to tell João which fields still need writing.
 *
 * DEV ONLY. The site is public and indexable, so a visitor must never land on a page telling
 * them what the author has not written yet — that reads as an abandoned draft, which is worse
 * than a shorter page. In production the prompt renders nothing, and any block that would be
 * entirely empty is dropped instead.
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

/** Roughly 200 words a minute, the figure newspapers use, floored at one. */
function readingMinutes(words: number) {
  return Math.max(1, Math.round(words / 200));
}

export function CasePage({ slug }: { slug: string }) {
  const { t } = useLanguage();

  /*
   * One observer per band rather than one for the page. The opening is above the fold and should
   * play immediately; the argument and the long read are further down and should wait for the
   * reader rather than having already happened by the time they arrive.
   */
  const openRef = useRef<HTMLElement>(null);
  const argueRef = useRef<HTMLElement>(null);
  const readRef = useRef<HTMLElement>(null);
  const openIn = useReveal(openRef);
  const argueIn = useReveal(argueRef);
  const readIn = useReveal(readRef);

  /*
   * Where "back" goes, decided by where the reader came from.
   *
   * Read in an effect rather than during render: sessionStorage does not exist on the server,
   * and reading it while rendering would give the server one answer and the browser another —
   * the mismatch React calls a hydration error. Defaulting to the projects index means the
   * first paint is always the safe one, and a reader who came from the home page sees the label
   * correct itself on the same frame the page becomes interactive.
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

  /*
   * In production a section with nothing written is dropped rather than rendered empty. The
   * argument only appears once at least one of its three fields exists.
   */
  const hasArgument = Boolean(data.conflict || data.tradeoff || data.decision);
  const showArgument = SHOW_PROMPTS || hasArgument;

  /*
   * The whole dark band goes when there is nothing in it.
   *
   * A case still waiting to be written has no argument, no numbers and no chart, and in
   * production the prompts render nothing — so the band was about to ship as 208px of solid
   * black between the headline and the text. Invisible in dev, because the prompts fill it.
   */
  const showArgue = showArgument || data.evidence.length > 0 || Boolean(data.chart);

  /*
   * The long read, assembled as one sequence of {heading, body} blocks rather than as three
   * differently-shaped sections.
   *
   * The method behind this page has not changed: what the reader meets first, then the argument,
   * then the detail. What changed is that it no longer announces itself. A band headed "EM 6
   * MINUTOS" was telling the reader about the author's process at the exact moment they were
   * about to start reading about the work — and the structure does its job whether or not it is
   * labelled.
   */
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
   * The hardest part sits SECOND, after the opening context, rather than first.
   *
   * Leading with "the hardest part" asks the reader to weigh a difficulty before they know what
   * the work was — so it read as a complaint rather than as a measure of the problem. One
   * chapter later, it lands.
   */
  const chapters: Chapter[] = [
    ...details.slice(0, 1),
    ...challenge,
    ...details.slice(1),
    ...(line(data.gameChanger)
      ? [{ key: 'game', heading: t(copy.headings.gameChanger), body: line(data.gameChanger)! }]
      : []),
  ];

  const toc: TocItem[] = [
    ...chapters.map((c) => ({ id: `c-${c.key}`, label: c.heading })),
    ...(data.contribution.length > 0
      ? [{ id: 'c-role', label: t(copy.headings.contribution) }]
      : []),
  ];

  /*
   * Counted from what is actually on the page in the active language, so it stays honest when a
   * case grows and when the reader switches to English.
   */
  const words =
    [t(data.context), ...chapters.map((c) => c.body), ...data.contribution.map((c) => t(c))]
      .join(' ')
      .trim()
      .split(/\s+/).length;

  return (
    <article className={styles.page}>
      {/* ------------------------------------------------- opening */}
      <header ref={openRef} className={styles.open}>
        {/*
         * The way out, at the top.
         *
         * There was already a "Voltar para o início" in the page footer, but a case page is long
         * and that link is only reachable by reading to the end of it — which is exactly the
         * thing a reader who wants to leave has decided not to do. The nav's wordmark opens the
         * menu rather than going home, so without this the only escape was the browser's own
         * back button.
         */}
        <Link className={styles.backTop} href={fromHome ? '/' : '/projetos'}>
          <span className={styles.backArrow} aria-hidden="true">⇠</span>
          {fromHome ? t(copy.backHome) : t(copy.back)}
        </Link>

        <Reveal on={openIn} order={0} className={styles.folio}>
          <span>{t(summary.company)}</span>
          <span>{t(data.role)}</span>
          <span>{data.year}</span>
          {/* Furniture for the reader, in place of furniture for the author. */}
          <span className={styles.folioSpacer}>
            {readingMinutes(words)} {t(copy.readingTime)}
          </span>
        </Reveal>

        <Reveal on={openIn} order={1} as="h1" className={styles.title}>
          {t(summary.title)}
        </Reveal>

        <Reveal on={openIn} order={2} as="p" className={styles.standfirst}>
          {t(data.context)}
        </Reveal>

        <Reveal on={openIn} order={3} className={styles.impact}>
          <span className={styles.impactValue}>{data.impact.value}</span>
          <span className={styles.impactText}>
            <span className={styles.impactLabel}>{t(data.impact.label)}</span>
            <span className={styles.impactNote}>{t(data.impact.note)}</span>
          </span>
        </Reveal>
      </header>

      {/* ------------------------------------------------ argument */}
      {showArgue && (
      <section ref={argueRef} className={styles.argue}>
        <Reveal on={argueIn} order={0} className={styles.argument} hidden={!showArgument}>
          <div className={styles.arg}>
            <p className={styles.argHead}>{t(copy.headings.conflict)}</p>
            {line(data.conflict) ? (
              <p className={styles.argBody}>{line(data.conflict)}</p>
            ) : (
              <Missing
                dark
                what="o conflito"
                ask="Quais duas forças não podiam vencer ao mesmo tempo? Ex.: velocidade de entrega contra profundidade de pesquisa; consistência com o design system contra a necessidade específica desta jornada."
              />
            )}
          </div>

          <div className={styles.arg}>
            <p className={styles.argHead}>{t(copy.headings.tradeoff)}</p>
            {line(data.tradeoff) ? (
              <p className={styles.argBody}>{line(data.tradeoff)}</p>
            ) : (
              <Missing
                dark
                what="o trade-off"
                ask="O que foi deliberadamente sacrificado para resolver o conflito? Esta é a parte que separa senior de pleno. Sem ela, o case vira lista de entregas."
              />
            )}
          </div>

          <div className={styles.arg}>
            <p className={styles.argHead}>{t(copy.headings.decision)}</p>
            {line(data.decision) ? (
              <p className={styles.argBody}>{line(data.decision)}</p>
            ) : (
              <Missing
                dark
                what="a decisão"
                ask="Qual foi a escolha feita, e por quê? Uma frase da qual alguém possa discordar. Sem uma alternativa descartada, não houve escolha."
              />
            )}
          </div>
        </Reveal>

        {/*
          * Numbers and the chart run the full width, outside the reading measure. They are looked
          * at rather than read, and a column sized for prose is the wrong shape for both.
          */}
        {data.evidence.length > 0 && (
          <Reveal on={argueIn} order={1} className={styles.evidence}>
            {data.evidence.map((e, i) => (
              <div key={i}>
                <div className={styles.evidenceValue}>{e.value}</div>
                <div className={styles.evidenceLabel}>{t(e.label)}</div>
                <div className={styles.evidenceNote}>{t(e.note)}</div>
              </div>
            ))}
          </Reveal>
        )}

        {data.chart && <CaseChart data={data.chart} />}
      </section>
      )}

      {/* ------------------------------------------------ long read */}
      <section ref={readRef} className={styles.read}>
        {/*
          * Two columns: the reading measure, and the index beside it. The index is the answer to
          * a column of paper sitting empty next to every paragraph — it carries how much of this
          * there is and where the reader currently is, which a scrollbar cannot say.
          */}
        <div className={styles.readGrid}>
          <div className={styles.measure}>
            {chapters.map((c) => (
              <section key={c.key} id={`c-${c.key}`} className={styles.chapter}>
                <h2 className={styles.chapterHead}>{c.heading}</h2>
                {/*
                  * Split on blank lines so a chapter can be several paragraphs. A wall of eight
                  * lines is where a reader gives up, and the copy can be broken up without
                  * touching this component.
                  */}
                {c.body.split(/\n{2,}/).map((para, i) => (
                  <p key={i} className={styles.chapterBody}>
                    {para}
                  </p>
                ))}

                {c.points && c.points.length > 0 && (
                  /*
                   * Items WITH a body become numbered cards laid across the page; items without
                   * one become a compact ruled list, which is the shape a set of principles
                   * wants. One field decides it, so the copy chooses its own diagram.
                   */
                  <ul className={c.points.some((pt) => pt.body) ? styles.cards : styles.principles}>
                    {c.points.map((pt, i) => (
                      <li key={i} className={styles.point}>
                        <span className={styles.pointNum}>{String(i + 1).padStart(2, '0')}</span>
                        <span className={styles.pointTitle}>{t(pt.title)}</span>
                        {pt.body && <span className={styles.pointBody}>{t(pt.body)}</span>}
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}

            {(SHOW_PROMPTS || data.contribution.length > 0) && (
              <section id="c-role" className={styles.chapter}>
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
                    ask="O que foi seu, em primeira pessoa? Três ou quatro linhas, cada uma começando com um verbo: mapeei, propus, desenhei, medi."
                  />
                )}
              </section>
            )}
          </div>

          <CaseToc items={toc} />
        </div>

        {data.gallery.length > 0 && (
          <Reveal on={readIn} order={0} className={styles.gallery}>
            {data.gallery.map((g, i) => (
              <CaseFigure key={i} media={g} slug={slug} />
            ))}
          </Reveal>
        )}
      </section>

      <footer className={styles.pageFoot}>
        <Link className={styles.backLink} href="/">
          <span aria-hidden="true">⇠</span>
          {t(copy.backLong)}
        </Link>
      </footer>
    </article>
  );
}
