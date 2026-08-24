'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useLanguage } from '@/lib/language';
import { craftGate, craftPage as copy } from '@/content/copy';
import styles from './CraftPage.module.css';

/**
 * The craft side, built as a start menu rather than as a page wearing a palette.
 *
 * The first version took the colours and left the grammar behind, which João caught: the
 * reference is not a colour scheme, it is a way of arranging a choice. A list on the left where
 * exactly one row is ARMED and inverted; a pointer sitting outside it in the margin; a panel to
 * the right showing what that row contains; and a status bar at the foot explaining the armed
 * row one sentence at a time.
 *
 * That last part is the piece most ports drop. The menu never explains itself in the list — put
 * the descriptions in the rows and it stops being a menu and becomes a page of paragraphs. Down
 * in the bar, the same words are an answer to "what is this one", asked and answered as the
 * reader moves.
 */
export function CraftPage() {
  const { lang, t } = useLanguage();
  const [armed, setArmed] = useState(0);

  /* Arrow keys move the selection, as they would with a controller. */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setArmed((i) => (i + 1) % copy.options.length);
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setArmed((i) => (i - 1 + copy.options.length) % copy.options.length);
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const current = copy.options[armed];

  return (
    /* nierSurface is the hook globals.css looks for to switch the paper grain off. */
    <main className={`${styles.page} nierSurface`}>
      {/*
        * The faint drawing behind everything: long diagonals and two wide arcs, at the edge of
        * visible. In the reference it is what stops a flat colour field from reading as an empty
        * div — the screen feels like a surface with something printed on it.
        */}
      <svg className={styles.backdrop} viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <g fill="none" stroke="currentColor" strokeWidth="1">
          <path d="M-100 240 L900 -160" />
          <path d="M-60 420 L1180 -180" />
          <path d="M700 980 L1700 380" />
          <path d="M760 1000 L1760 400" />
          <circle cx="420" cy="-160" r="620" />
          <circle cx="1480" cy="1120" r="540" />
          <circle cx="1520" cy="1080" r="700" />
        </g>
      </svg>

      <div className={styles.dots} aria-hidden="true" />

      <div className={styles.frame}>
        <header className={styles.head}>
          <span className={styles.system}>{t(copy.system)}</span>
          <h1 className={styles.title}>{t(copy.title)}</h1>
        </header>

        <div className={styles.columns}>
          {/* The list. A vertical track runs beside it, as in the reference. */}
          <div className={styles.menu}>
            <span className={styles.track} aria-hidden="true" />

            <ul className={styles.list} role="listbox" aria-label={t(copy.title)}>
              {copy.options.map((option, i) => (
                <li key={option.id} className={styles.row}>
                  {/* The pointer lives OUTSIDE the row, in the margin — it points at it. */}
                  <span
                    className={`${styles.pointer} ${armed === i ? styles.pointerOn : ''}`}
                    aria-hidden="true"
                  />

                  <button
                    type="button"
                    role="option"
                    aria-selected={armed === i}
                    className={`${styles.option} ${armed === i ? styles.armed : ''}`}
                    onMouseEnter={() => setArmed(i)}
                    onFocus={() => setArmed(i)}
                    onClick={() => setArmed(i)}
                  >
                    <span className={styles.mark} aria-hidden="true" />
                    {t(option.label)}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/*
            * What the armed row contains. Empty, and it says so rather than dressing an empty
            * page as a finished one — the projects go in here as they are made.
            */}
          <div className={styles.panel}>
            <p className={styles.empty}>{t(copy.empty)}</p>
          </div>
        </div>
      </div>

      {/* The status bar: the armed row explained, and what the keys do. */}
      <div className={styles.status}>
        <span className={styles.statusBar} aria-hidden="true" />
        <p className={styles.statusText} aria-live="polite">
          {t(current.hint)}
        </p>

        <div className={styles.keys}>
          <span className={styles.key}>
            <span className={styles.keyCap} aria-hidden="true">
              ↕
            </span>
            {t(copy.keys.select)}
          </span>
          <span className={styles.key}>
            <span className={styles.keyCap} aria-hidden="true">
              ↵
            </span>
            {t(copy.keys.confirm)}
          </span>
          <Link className={styles.key} href="/">
            <span className={styles.keyCap} aria-hidden="true">
              esc
            </span>
            {t(copy.keys.back)}
          </Link>
        </div>
      </div>

      <div className={styles.dots} aria-hidden="true" />

      {/* The credit, on the screen that does the borrowing. */}
      <p className={styles.credit}>{t(craftGate.credit)}</p>
    </main>
  );
}
