'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { CaseChart } from '@/components/CaseChart/CaseChart';
import { Reveal } from '@/components/Reveal/Reveal';
import { useReveal } from '@/hooks/useReveal';
import { useLanguage } from '@/lib/language';
import { cases, caseDetails, casePage as copy, type T } from '@/content/copy';
import styles from './CasePage.module.css';

/**
 * Authoring scaffolding: these prompts exist to tell João which fields still need writing.
 *
 * DEV ONLY. The site is public and indexable, so a visitor must never land on a page telling
 * them what the author has not written yet — that reads as an abandoned draft, which is worse
 * than a shorter page. In production the prompt renders nothing, and any block that would be
 * entirely empty is dropped instead (see `hasAny` below).
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

export function CasePage({ slug }: { slug: string }) {
  const { t } = useLanguage();

  /*
   * The case page had no entrance at all: everything was simply present on load, which reads as
   * a document appearing rather than as one being opened. It now uses the same cascade the rest
   * of the site does — the one "Sobre mim" runs on — so each of the three layers fades and rises
   * as the reader reaches it.
   *
   * One observer per layer rather than one for the page. The 6s block is above the fold and
   * should play immediately; the 60s and 6min blocks are further down and should wait for the
   * reader rather than having already happened by the time they arrive.
   */
  const sixRef = useRef<HTMLElement>(null);
  const sixtyRef = useRef<HTMLElement>(null);
  const sixMinRef = useRef<HTMLElement>(null);
  const sixIn = useReveal(sixRef);
  const sixtyIn = useReveal(sixtyRef);
  const sixMinIn = useReveal(sixMinRef);

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
   * 60s layer only appears once at least one of its three fields exists; the evidence numbers
   * are real either way, so they move up into the 6min layer if the argument is not written yet.
   */
  const hasArgument = Boolean(data.conflict || data.tradeoff || data.decision);
  const showArgument = SHOW_PROMPTS || hasArgument;

  return (
    <article className={styles.page}>
      {/* ------------------------------------------------ 6 seconds */}
      <header ref={sixRef} className={styles.six}>
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

        <Reveal on={sixIn} order={0} className={styles.folio}>
          <span>{t(summary.company)}</span>
          <span>{t(data.role)}</span>
          <span className={styles.folioSpacer}>{data.year}</span>
        </Reveal>

        <Reveal on={sixIn} order={1} as="h1" className={styles.title}>
          {t(summary.title)}
        </Reveal>

        <Reveal on={sixIn} order={2} as="p" className={styles.context}>
          {t(data.context)}
        </Reveal>

        <Reveal on={sixIn} order={3} className={styles.impact}>
          <span className={styles.impactValue}>{data.impact.value}</span>
          <span className={styles.impactText}>
            <span className={styles.impactLabel}>{t(data.impact.label)}</span>
            <span className={styles.impactNote}>{t(data.impact.note)}</span>
          </span>
        </Reveal>
      </header>

      {/* ----------------------------------------------- 60 seconds */}
      <section ref={sixtyRef} className={styles.sixty}>
        <Reveal on={sixtyIn} order={0} as="span" className={styles.layerMark}>
          <span className={styles.diamond} aria-hidden="true" />
          {showArgument ? t(copy.layers.sixty) : t(copy.layers.sixtyShort)}
        </Reveal>

        <Reveal on={sixtyIn} order={1} className={styles.argument} hidden={!showArgument}>
          <div>
            <p className={styles.argumentHead}>{t(copy.headings.conflict)}</p>
            {line(data.conflict) ? (
              <p className={styles.argumentBody}>{line(data.conflict)}</p>
            ) : (
              <Missing
                dark
                what="o conflito"
                ask="Quais duas forças não podiam vencer ao mesmo tempo? Ex.: velocidade de entrega contra profundidade de pesquisa; consistência com o design system contra a necessidade específica desta jornada."
              />
            )}
          </div>

          <div>
            <p className={styles.argumentHead}>{t(copy.headings.tradeoff)}</p>
            {line(data.tradeoff) ? (
              <p className={styles.argumentBody}>{line(data.tradeoff)}</p>
            ) : (
              <Missing
                dark
                what="o trade-off"
                ask="O que foi deliberadamente sacrificado para resolver o conflito? Esta é a parte que separa senior de pleno. Sem ela, o case vira lista de entregas."
              />
            )}
          </div>

          <div>
            <p className={styles.argumentHead}>{t(copy.headings.decision)}</p>
            {line(data.decision) ? (
              <p className={styles.argumentBody}>{line(data.decision)}</p>
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
          * Dropped entirely when there is nothing to put in it. The grid carries a rule and its
          * own padding, so an empty one renders as a bordered strip of nothing — which is
          * exactly what the case still waiting to be written was showing.
          */}
        {data.evidence.length > 0 && (
          <Reveal on={sixtyIn} order={2} className={styles.evidence}>
            {data.evidence.map((e, i) => (
              <div key={i}>
                <div className={styles.evidenceValue}>{e.value}</div>
                <div className={styles.evidenceLabel}>{t(e.label)}</div>
                <div className={styles.evidenceNote}>{t(e.note)}</div>
              </div>
            ))}
          </Reveal>
        )}

        {/*
          * The series, when there is one. It sits directly under the evidence numbers because it
          * is the same claim at a different resolution: the cards state −21%, the bars show the
          * five months it took and let the reader do the division themselves.
          */}
        {data.chart && <CaseChart data={data.chart} />}
      </section>

      {/* ------------------------------------------------ 6 minutes */}
      <section ref={sixMinRef} className={styles.sixMin}>
        <Reveal
          on={sixMinIn}
          order={0}
          as="span"
          className={styles.layerMark}
          style={{ color: 'var(--muted-light)' }}
        >
          <span className={styles.diamond} aria-hidden="true" />
          {t(copy.layers.sixMin)}
        </Reveal>

        {(SHOW_PROMPTS || data.challenge) && (
          <div className={styles.detailGrid}>
            <p className={styles.detailTitle}>{t(copy.headings.challenge)}</p>
            <div>
              {line(data.challenge) ? (
                <p className={styles.detailBody}>{line(data.challenge)}</p>
              ) : (
                <Missing
                  what="o principal desafio"
                  ask="Qual foi a coisa mais difícil deste trabalho? O obstáculo, não o objetivo. Restrição técnica, política interna, prazo, dado que não existia."
                />
              )}
            </div>
          </div>
        )}

        {data.detail.map((d, i) => (
          <div key={i} className={styles.detailGrid}>
            <p className={styles.detailTitle}>{t(d.title)}</p>
            <p className={styles.detailBody}>{t(d.body)}</p>
          </div>
        ))}

        {(SHOW_PROMPTS || data.contribution.length > 0) && (
          <div className={styles.detailGrid}>
            <p className={styles.detailTitle}>{t(copy.headings.contribution)}</p>
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
          </div>
        )}

        {(SHOW_PROMPTS || data.gameChanger) && (
          <div className={styles.detailGrid}>
            <p className={styles.detailTitle}>{t(copy.headings.gameChanger)}</p>
            <div>
              {line(data.gameChanger) ? (
                <p className={styles.detailBody}>{line(data.gameChanger)}</p>
              ) : (
                <Missing
                  what="o que mudou o jogo"
                  ask="O que este trabalho destravou além da métrica? Mudou como o time opera, virou padrão para outras jornadas, abriu um mercado?"
                />
              )}
            </div>
          </div>
        )}

        {data.gallery.length > 0 && (
          <Reveal on={sixMinIn} order={1} className={styles.gallery}>
            {data.gallery.map((g, i) => (
              <figure key={i} style={{ margin: 0 }}>
                <div className={styles.frame}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={g.src ?? `/placeholders/cases/${slug}.svg`} alt="" aria-hidden="true" />
                </div>
                <figcaption className={styles.caption}>
                  {t(g.caption)}
                  {g.confidential && !g.src && ` · ${t(copy.ndaPending)}`}
                </figcaption>
              </figure>
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
