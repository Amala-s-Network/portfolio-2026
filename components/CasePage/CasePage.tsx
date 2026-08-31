'use client';

import { useEffect, useState } from 'react';
import { CaseChart } from '@/components/CaseChart/CaseChart';
import { CaseDoc, type DocSection } from '@/components/CaseDoc/CaseDoc';
import { CaseFigure } from '@/components/CaseFigure/CaseFigure';
import { CaseMark } from '@/components/CaseMark/CaseMark';
import { CasePlate } from '@/components/CasePlate/CasePlate';
import { CaseProto } from '@/components/CaseProto/CaseProto';
import { useLanguage } from '@/lib/language';
import {
  cases,
  caseDetails,
  caseFull,
  caseProto,
  casePage as copy,
  type CasePlateSpec,
  type T,
} from '@/content/copy';
import styles from './CasePage.module.css';

/**
 * Authoring scaffolding: these prompts exist to tell João which fields still need writing.
 *
 * DEV ONLY. The site is public and indexable, so a visitor must never land on a page telling
 * them what the author has not written yet — that reads as an abandoned draft, which is worse
 * than a shorter page. In production the prompt renders nothing, and any section that would be
 * entirely empty is never built.
 */
const SHOW_PROMPTS = process.env.NODE_ENV !== 'production';

function Missing({ what, ask }: { what: string; ask: string }) {
  if (!SHOW_PROMPTS) return null;
  return (
    <div className={styles.todo}>
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

/** A paragraph run, split on blank lines the way the copy is written. */
function Flow({ text, lead }: { text: string; lead?: boolean }) {
  return (
    <div className={[styles.flow, lead ? styles.flowLead : ''].filter(Boolean).join(' ')}>
      {text.split(/\n{2,}/).map((para, i) => (
        <p key={i}>{para}</p>
      ))}
    </div>
  );
}

/**
 * An aside in a ruled box: a label, a hairline, and prose.
 *
 * The shape a printed case study uses for the things that are true but are not the argument —
 * how something was measured, what went wrong, what it unlocked. Boxed, they stop interrupting
 * the thread and start supporting it.
 */
function Note({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className={styles.note}>
      <p className={styles.noteLabel}>{label}</p>
      <div className={styles.noteBody}>{children}</div>
    </div>
  );
}

/**
 * A case, set as a document.
 *
 * João's note was to read this vertically and to follow the structure he sent: a margin carrying
 * the number of each part, one column of type held to the left of a wide page, full-width rules
 * between the parts, ruled boxes for the asides, and numbered plates for the pictures.
 *
 * The 6s / 60s / 6min method still shapes the order — the opening, the argument, the detail, the
 * proof — and still does not announce itself. What the reader sees is a numbered document.
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

  const words =
    [t(data.context), ...data.detail.map((d) => t(d.body)), ...data.contribution.map((c) => t(c))]
      .join(' ')
      .trim()
      .split(/\s+/).length;

  const minutes = data.readTime ?? readingMinutes(words);

  /*
   * The headline number is whatever the evidence says. Where a case has no measured series yet,
   * the single impact figure stands in — rather than being printed twice, which is what happened
   * while it had a block of its own at the top and a row of its own at the foot.
   */
  const outcomes = data.evidence.length > 0 ? data.evidence : [data.impact];

  /*
   * The notice that this page is the short version, at both ends of the case.
   *
   * At the top it sets expectations before anyone decides how much to trust the page; at the foot
   * it catches the reader who got through it and wants more. A disclaimer that appears once
   * always appears in the wrong place for somebody.
   */
  const fullStudy = data.pdf ? (
    <div className={styles.full}>
      <p className={styles.fullLine}>{t(caseFull.line)}</p>
      {/*
       * Opened, not downloaded.
       *
       * The `download` attribute committed the reader to a 20MB file before they had seen a page
       * of it. The study lives on Drive now, so this opens the viewer and leaves the download to
       * them. New tab because it is another site, `noopener noreferrer` because any link that
       * opens one should carry it, and the destination is named in the link itself rather than
       * left as a surprise.
       */}
      <a
        className={styles.fullAction}
        href={data.pdf}
        target="_blank"
        rel="noopener noreferrer"
      >
        {t(caseFull.action)}
        <span className={styles.fullWeight}>{t(caseFull.weight)}</span>
      </a>
    </div>
  ) : null;

  /*
   * Plates are numbered across the whole document, the way figures are in a printed report.
   *
   * A plain function rather than a component, so the counter advances once while the sections are
   * being built. As a component it would advance during each child's own render, which under
   * StrictMode's double pass numbers the same picture twice.
   */
  let plateNo = 0;
  const plate = (spec: CasePlateSpec, label: string) => {
    plateNo += 1;
    const n = plateNo;
    return (
      <div className={styles.plate}>
        <p className={styles.plateHead}>
          <span className={styles.plateNum}>{String(n).padStart(2, '0')}</span>{' '}
          {label}
        </p>
        <CasePlate spec={spec} slug={slug} />
      </div>
    );
  };

  /* ------------------------------------------------------- the document */

  const sections: DocSection[] = [];

  /* ---- the opening ---- */

  const meta: { label: string; value: string }[] = [
    { label: t(copy.meta.year), value: data.year },
    { label: t(copy.meta.role), value: t(data.role) },
    { label: t(copy.meta.duration), value: t(data.duration) },
    {
      label: t(copy.meta.reading),
      value: `${minutes} ${t(minutes === 1 ? copy.readingTimeOne : copy.readingTime)}`,
    },
  ];

  sections.push({
    id: 'abertura',
    label: t(copy.headings.opening),
    rail: t(summary.company),
    unnumbered: true,
    node: (
      <div className={styles.opening}>
        <h1 className={styles.title}>{t(summary.title)}</h1>

        <dl className={styles.meta}>
          {meta.map((m) => (
            <div key={m.label} className={styles.metaItem}>
              <dt className={styles.metaLabel}>{m.label}</dt>
              <dd className={styles.metaValue}>{m.value}</dd>
            </div>
          ))}
        </dl>

        {/*
         * What was his, boxed and first.
         *
         * A case at a company is a case with a team behind it, and the question anyone reading
         * this is actually asking is which part he did. Answering it before the story starts is
         * more honest than answering it in a list at the end.
         */}
        <Note label={t(copy.headings.contribution)}>
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
        </Note>

        {fullStudy}
      </div>
    ),
  });

  /* ---- context, then the argument ---- */

  sections.push({
    id: 'contexto',
    label: t(copy.headings.context),
    node: <Flow lead text={t(data.context)} />,
  });

  const argument: { id: string; head: T; body: string | null; what: string; ask: string }[] = [
    {
      id: 'problema',
      head: copy.headings.conflict,
      body: line(data.conflict),
      what: 'o conflito',
      ask: 'Quais duas forças não podiam vencer ao mesmo tempo?',
    },
    {
      id: 'trade-off',
      head: copy.headings.tradeoff,
      body: line(data.tradeoff),
      what: 'o trade-off',
      ask: 'O que foi deliberadamente sacrificado para resolver o conflito? Sem isso, o case vira lista de entregas.',
    },
    {
      id: 'decisao',
      head: copy.headings.decision,
      body: line(data.decision),
      what: 'a decisão',
      ask: 'Qual foi a escolha feita, e por quê? Uma frase da qual alguém possa discordar.',
    },
  ];

  argument.forEach((part) => {
    if (!part.body && !SHOW_PROMPTS) return;
    sections.push({
      id: part.id,
      label: t(part.head),
      node: part.body ? (
        <Flow text={part.body} />
      ) : (
        <Missing what={part.what} ask={part.ask} />
      ),
    });
  });

  /* ---- the chapters, one part each ---- */

  data.detail.forEach((d, i) => {
    const heading = t(d.title);

    sections.push({
      id: `parte-${i + 1}`,
      label: heading,
      node: (
        <>
          <Flow text={t(d.body)} />

          {d.quote && <p className={styles.pull}>{t(d.quote)}</p>}

          {/*
           * Items with a body render as numbered cards; items without one render as a compact
           * ruled list, which is the right shape for a set of principles. Both are the case
           * page's own blocks, carried over unchanged.
           */}
          {d.points && d.points.length > 0 && (
            <ul className={d.points.some((pt) => pt.body) ? styles.cards : styles.principles}>
              {d.points.map((pt, pi) => (
                <li key={pi} className={styles.point}>
                  <span className={styles.pointNum}>{String(pi + 1).padStart(2, '0')}</span>
                  <span className={styles.pointTitle}>{t(pt.title)}</span>
                  {pt.body && <span className={styles.pointBody}>{t(pt.body)}</span>}
                </li>
              ))}
            </ul>
          )}

          {d.mark && (
            <div className={styles.markRow}>
              <CaseMark spec={d.mark} compact />
            </div>
          )}

          {/*
           * Every chapter carries a picture, supplied or reserved.
           *
           * João's note was for more images and more places to put them, and for the empty
           * states to be shaped around receiving a picture rather than filled with a paragraph
           * apologising. So a chapter with no artwork yet still prints a plate: a framed, ruled,
           * grained rectangle at the right ratio, with the shot it wants named in development.
           */}
          {plate(
            d.plate ?? {
              src: null,
              ratio: '4:3',
              caption: d.title,
              brief: {
                pt: 'Uma tela, um fluxo ou um artefato desta etapa. Ver IMAGENS.md para formato e peso.',
                en: 'A screen, a flow or an artefact from this stage. See IMAGENS.md for format and weight.',
              },
            },
            heading,
          )}
        </>
      ),
    });
  });

  /* ---- the proof ---- */

  if (outcomes.length > 0 || data.chart) {
    sections.push({
      id: 'resultado',
      label: t(copy.headings.results),
      /*
       * The proof runs on ink.
       *
       * The site's own band — Metrics, History and the footer are all bands like this on the
       * one-pager — and the reason the chart needs no help here: it was drawn in the --on-dark
       * family from the start, for a spread that was exactly this colour.
       */
      tone: 'dark',
      node: (
        <>
          <Flow lead text={t(data.impact.note)} />

          <div className={styles.numbers}>
            {outcomes.map((o, i) => (
              <div key={i} className={styles.number}>
                <span className={styles.numberValue}>{o.value}</span>
                <span className={styles.numberLabel}>{t(o.label)}</span>
                <span className={styles.numberNote}>{t(o.note)}</span>
              </div>
            ))}
          </div>

          {data.chart && (
            <div className={styles.chart}>
              <CaseChart data={data.chart} />
            </div>
          )}

        </>
      ),
    });
  }

  /*
   * What sits behind the figures, back on paper.
   *
   * These three were inside the band to begin with, and three ruled boxes of prose on ink came
   * to 1713px of solid black — nothing on the one-pager runs past 832. The band now ends where
   * the chart does, which is also where the proof ends.
   */
  if (data.chart || line(data.challenge) || line(data.gameChanger) || SHOW_PROMPTS) {
    sections.push({
      id: 'por-tras',
      label: t(copy.headings.behind),
      node: (
        <>
          {data.chart && (
            <Note label={t(copy.headings.howMeasured)}>
              <p>{t(data.chart.note)}</p>
            </Note>
          )}

          {(line(data.challenge) || SHOW_PROMPTS) && (
            <Note label={t(copy.headings.challenge)}>
              {line(data.challenge) ? (
                <Flow text={line(data.challenge)!} />
              ) : (
                <Missing
                  what="o principal desafio"
                  ask="Qual foi a coisa mais difícil deste trabalho? O obstáculo, não o objetivo."
                />
              )}
            </Note>
          )}

          {(line(data.gameChanger) || SHOW_PROMPTS) && (
            <Note label={t(copy.headings.gameChanger)}>
              {line(data.gameChanger) ? (
                <Flow text={line(data.gameChanger)!} />
              ) : (
                <Missing
                  what="o que mudou o jogo"
                  ask="O que este trabalho destravou além da métrica?"
                />
              )}
            </Note>
          )}
        </>
      ),
    });
  }

  /* ---- the prototype and the screens ---- */

  if (data.proto) {
    sections.push({
      id: 'prototipo',
      label: t(caseProto.label),
      node: (
        <div className={styles.proto}>
          <CaseProto spec={data.proto} />
        </div>
      ),
    });
  }

  if (data.gallery.length > 0) {
    sections.push({
      id: 'telas',
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

  if (fullStudy) {
    sections.push({
      id: 'estudo-completo',
      label: t(caseFull.action),
      unnumbered: true,
      node: <div className={styles.closingFull}>{fullStudy}</div>,
    });
  }

  return (
    <CaseDoc
      sections={sections}
      backHref={fromHome ? '/' : '/projetos'}
      backLabel={fromHome ? t(copy.backHome) : t(copy.back)}
    />
  );
}
