'use client';

import Link from 'next/link';
import { useLanguage } from '@/lib/language';
import { cases, caseDetails, type T } from '@/content/copy';
import styles from './CasePage.module.css';

/**
 * A visible stand-in for a field João has not written yet. Loud on purpose — the 60s layer is
 * what carries the judgement, and a case page missing its conflict is not finished, however
 * complete the rest looks.
 */
function Missing({ what, ask, dark }: { what: string; ask: string; dark?: boolean }) {
  return (
    <div className={styles.todo} style={dark ? { color: 'var(--on-dark)' } : undefined}>
      <span className={styles.todoTitle}>Falta escrever — {what}</span>
      {ask}
    </div>
  );
}

export function CasePage({ slug }: { slug: string }) {
  const { t } = useLanguage();
  const summary = cases.find((c) => c.slug === slug);
  const data = caseDetails[slug];
  if (!summary || !data) return null;

  const line = (v: T | null) => (v ? t(v) : null);

  return (
    <article className={styles.page}>
      {/* ------------------------------------------------ 6 seconds */}
      <header className={styles.six}>
        <div className={styles.folio}>
          <span>{t(summary.company)}</span>
          <span>{t(data.role)}</span>
          <span className={styles.folioSpacer}>{data.year}</span>
        </div>

        <h1 className={styles.title}>{t(summary.title)}</h1>
        <p className={styles.context}>{t(data.context)}</p>

        <div className={styles.impact}>
          <span className={styles.impactValue}>{data.impact.value}</span>
          <span className={styles.impactText}>
            <span className={styles.impactLabel}>{t(data.impact.label)}</span>
            <span className={styles.impactNote}>{t(data.impact.note)}</span>
          </span>
        </div>
      </header>

      {/* ----------------------------------------------- 60 seconds */}
      <section className={styles.sixty}>
        <span className={styles.layerMark}>
          <span className={styles.diamond} aria-hidden="true" />
          60 SEGUNDOS — CONFLITO, DECISÃO, EVIDÊNCIA
        </span>

        <div className={styles.argument}>
          <div>
            <p className={styles.argumentHead}>O CONFLITO</p>
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
            <p className={styles.argumentHead}>O QUE ABRI MÃO</p>
            {line(data.tradeoff) ? (
              <p className={styles.argumentBody}>{line(data.tradeoff)}</p>
            ) : (
              <Missing
                dark
                what="o trade-off"
                ask="O que foi deliberadamente sacrificado para resolver o conflito? Esta é a parte que separa senior de pleno — sem ela, o case vira lista de entregas."
              />
            )}
          </div>

          <div>
            <p className={styles.argumentHead}>A DECISÃO</p>
            {line(data.decision) ? (
              <p className={styles.argumentBody}>{line(data.decision)}</p>
            ) : (
              <Missing
                dark
                what="a decisão"
                ask="Qual foi a escolha feita, e por quê? Uma frase que alguém possa discordar — decisão sem alternativa descartada não é decisão."
              />
            )}
          </div>
        </div>

        <div className={styles.evidence}>
          {data.evidence.map((e, i) => (
            <div key={i}>
              <div className={styles.evidenceValue}>{e.value}</div>
              <div className={styles.evidenceLabel}>{t(e.label)}</div>
              <div className={styles.evidenceNote}>{t(e.note)}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------ 6 minutes */}
      <section className={styles.sixMin}>
        <span className={styles.layerMark} style={{ color: 'var(--muted-light)' }}>
          <span className={styles.diamond} aria-hidden="true" />
          6 MINUTOS — DETALHE E O QUE MUDOU O JOGO
        </span>

        <div className={styles.detailGrid}>
          <p className={styles.detailTitle}>O principal desafio</p>
          <div>
            {line(data.challenge) ? (
              <p className={styles.detailBody}>{line(data.challenge)}</p>
            ) : (
              <Missing
                what="o principal desafio"
                ask="Qual foi a coisa mais difícil deste trabalho? Não o objetivo — o obstáculo. Restrição técnica, política interna, prazo, dado que não existia."
              />
            )}
          </div>
        </div>

        {data.detail.map((d, i) => (
          <div key={i} className={styles.detailGrid}>
            <p className={styles.detailTitle}>{t(d.title)}</p>
            <p className={styles.detailBody}>{t(d.body)}</p>
          </div>
        ))}

        <div className={styles.detailGrid}>
          <p className={styles.detailTitle}>Meu papel</p>
          <ul className={styles.contribution}>
            {data.contribution.map((c, i) => (
              <li key={i}>{t(c)}</li>
            ))}
          </ul>
        </div>

        <div className={styles.detailGrid}>
          <p className={styles.detailTitle}>O que mudou o jogo</p>
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

        <div className={styles.gallery}>
          {data.gallery.map((g, i) => (
            <figure key={i} style={{ margin: 0 }}>
              <div className={styles.frame}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={g.src ?? `/placeholders/cases/${slug}.svg`} alt="" aria-hidden="true" />
              </div>
              <figcaption className={styles.caption}>
                {t(g.caption)}
                {g.confidential && !g.src && ' · imagem pendente de avaliação de NDA'}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <footer className={styles.pageFoot}>
        <Link className={styles.backLink} href="/">
          <span aria-hidden="true">⇠</span>
          Voltar para o início
        </Link>
      </footer>
    </article>
  );
}
