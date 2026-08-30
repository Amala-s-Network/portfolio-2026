'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Reveal } from '@/components/Reveal/Reveal';
import { useReveal } from '@/hooks/useReveal';
import { useLanguage } from '@/lib/language';
import { casePage as copy } from '@/content/copy';
import styles from './CaseDoc.module.css';

export type DocSection = {
  id: string;
  /** What the index calls this part, and what the rail prints. */
  label: string;
  /**
   * A rail line of its own, instead of the numbered one.
   *
   * The opening uses it to print the company: on a printed page the first thing in the margin is
   * who the work was for, not "section one".
   */
  rail?: string;
  /** Kept out of the running number. The opening and the closing are not chapters. */
  unnumbered?: boolean;
  node: React.ReactNode;
};

/**
 * A case, read top to bottom.
 *
 * The horizontal reader is gone. A case is a document again: one column of type held to the left
 * of a wide page, a margin beside it carrying the running number of each part, and a full-width
 * rule between them. Everything the reader needs is where a document keeps it, in the flow, and
 * the only furniture that follows them down the page is the way out and the index.
 *
 * The wide right-hand emptiness is deliberate, and is most of what makes this read as printed
 * rather than as a web page: the measure stays at a readable 620-odd pixels however wide the
 * screen gets, instead of stretching to fill it.
 */
export function CaseDoc({
  sections,
  backHref,
  backLabel,
}: {
  sections: DocSection[];
  backHref: string;
  backLabel: string;
}) {
  const { t } = useLanguage();
  const [tocOpen, setTocOpen] = useState(false);
  const [active, setActive] = useState(sections[0]?.id ?? '');

  /*
   * Which part the reader is in.
   *
   * A scroll listener plus a slow interval rather than IntersectionObserver, for the same reason
   * useReveal takes that route: the observer has been seen to go quiet in throttled and embedded
   * contexts, and an index that highlights the wrong entry is a small lie told constantly.
   *
   * Keyed on a JOINED STRING of the ids, not on the array. The array is rebuilt on every render,
   * so depending on it restarted the interval before it could ever fire and the highlight never
   * moved. This file's ancestor had exactly that bug.
   */
  const idsKey = sections.map((s) => s.id).join('|');

  useEffect(() => {
    const ids = idsKey.split('|');

    const sync = () => {
      /* The line the reader is actually reading sits nearer the top than the middle. */
      const line = window.innerHeight * 0.34;
      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) current = id;
      }
      setActive(current);
    };

    sync();
    window.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync);
    const interval = window.setInterval(sync, 400);

    return () => {
      window.removeEventListener('scroll', sync);
      window.removeEventListener('resize', sync);
      window.clearInterval(interval);
    };
  }, [idsKey]);

  /* Escape closes the index, wherever focus is. */
  useEffect(() => {
    if (!tocOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setTocOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [tocOpen]);

  /* The running number covers the numbered parts only, so the opening does not eat "001". */
  let counter = 0;
  const numbers = sections.map((s) => (s.unnumbered || s.rail ? null : ++counter));

  return (
    <div className={styles.root}>
      {/*
       * Register marks at the corners of the sheet.
       *
       * Printer's furniture, and the cheapest possible way to say that this page is a printed
       * object. Fixed to the viewport, sitting inside the gutter so they never meet the nav or
       * the back-to-top, and gone on a phone where there is no margin to spare.
       */}
      <div className={styles.corners} aria-hidden="true">
        <Cross />
        <Cross />
        <Cross />
        <Cross />
      </div>

      {/*
       * The way out and the index, docked together at the foot.
       *
       * At the foot rather than the head because the top-left of this page is where the case
       * announces itself, and a floating "back" landing on the company and the title is the one
       * place it must not be.
       */}
      <div className={styles.dock}>
        <Link className={styles.back} href={backHref}>
          <span className={styles.backArrow} aria-hidden="true">
            &#8672;
          </span>
          {backLabel}
        </Link>

        <button
          type="button"
          className={styles.tocButton}
          onClick={() => setTocOpen((v) => !v)}
          aria-expanded={tocOpen}
          aria-controls="case-toc"
        >
          <span className={styles.tocBars} aria-hidden="true" />
          {t(copy.toc.label)}
        </button>
      </div>

      <article className={styles.doc}>
        {sections.map((s, i) => (
          <Part
            key={s.id}
            section={s}
            number={numbers[i]}
            total={counter}
            first={i === 0}
            index={i}
          />
        ))}
      </article>

      {/* ---- the index, over the page, reachable from anywhere in it ---- */}

      <nav
        id="case-toc"
        className={`${styles.toc} ${tocOpen ? styles.tocOn : ''}`}
        aria-label={t(copy.toc.label)}
        aria-hidden={!tocOpen}
        inert={!tocOpen ? true : undefined}
      >
        <p className={styles.tocHead}>{t(copy.toc.label)}</p>
        <ol className={styles.tocList}>
          {sections.map((s, i) => (
            <li key={s.id}>
              <a
                className={`${styles.tocLink} ${s.id === active ? styles.tocOnItem : ''}`}
                href={`#${s.id}`}
                aria-current={s.id === active ? 'true' : undefined}
                onClick={() => setTocOpen(false)}
              >
                <span className={styles.tocNum}>
                  {numbers[i] ? String(numbers[i]).padStart(2, '0') : '—'}
                </span>
                <span className={styles.tocLabel}>{s.label}</span>
              </a>
            </li>
          ))}
        </ol>
      </nav>

      {tocOpen && (
        <button
          type="button"
          className={styles.scrim}
          onClick={() => setTocOpen(false)}
          aria-label={t(copy.toc.close)}
        />
      )}
    </div>
  );
}

/**
 * One part of the document: a margin, a column, and a rule above it.
 *
 * Its own component because each part fades in on its own as it arrives, which is what the
 * page-turn's entrance became once the page stopped turning.
 */
function Part({
  section,
  number,
  total,
  first,
  index,
}: {
  section: DocSection;
  number: number | null;
  total: number;
  first: boolean;
  index: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const shown = useReveal(ref);

  return (
    <section
      ref={ref}
      id={section.id}
      className={styles.part}
      /* Moves the register mark down the margin, so the right-hand side is not a rhythm. */
      data-beat={index % 3}
      aria-label={section.label}
    >
      {!first && <span className={styles.rule} aria-hidden="true" />}

      <Reveal on={shown} order={0} className={styles.rail}>
        {(number || section.rail) && (
          <p className={styles.railLabel}>
            {number ? (
              <>
                <span className={styles.railNum}>{String(number).padStart(3, '0')}</span>
                <span className={styles.railDash} aria-hidden="true">
                  {'—'}
                </span>
                {section.label}
              </>
            ) : (
              section.rail
            )}
          </p>
        )}

        {number ? (
          <span className={styles.railOf} aria-hidden="true">
            {'/ '}
            {String(total).padStart(3, '0')}
          </span>
        ) : null}
      </Reveal>

      <Reveal on={shown} order={1} className={styles.body}>
        {section.node}
      </Reveal>

      <span className={styles.reg} aria-hidden="true">
        <Bracket />
      </span>
    </section>
  );
}

function Cross() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" aria-hidden="true">
      <path d="M6.5 0V13M0 6.5H13" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

function Bracket() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M.5 4.5V.5h4M11.5.5h4v4M15.5 11.5v4h-4M4.5 15.5h-4v-4"
        stroke="currentColor"
        strokeWidth="1"
      />
    </svg>
  );
}
