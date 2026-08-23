'use client';

import { useEffect, useState } from 'react';
import { nav as navCopy } from '@/content/copy';
import styles from './Intro.module.css';

/** README "Intro (page load)" — the three beats. */
const WIPE_AT = 2100;
const FADE_AT = 3450;
const GONE_AT = 4400;

/** Reduced motion: same shape, no spectacle, and a much shorter wait. */
const REDUCED_FADE_AT = 700;
const REDUCED_GONE_AT = 1600;

const LETTERS = navCopy.wordmark.split('');

type IntroProps = {
  /** Fires when scroll unlocks, so the hero cascade can start. */
  onDone: () => void;
};

export function Intro({ onDone }: IntroProps) {
  const [wiping, setWiping] = useState(false);
  const [fading, setFading] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Body scroll is locked for the duration (README).
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const unlock = () => {
      document.body.style.overflow = previousOverflow;
      onDone();
    };

    const timers: number[] = [];

    if (reduced) {
      timers.push(
        window.setTimeout(() => {
          setFading(true);
          unlock();
        }, REDUCED_FADE_AT),
        window.setTimeout(() => setGone(true), REDUCED_GONE_AT)
      );
    } else {
      timers.push(
        window.setTimeout(() => setWiping(true), WIPE_AT),
        window.setTimeout(() => {
          setFading(true);
          unlock();
        }, FADE_AT),
        window.setTimeout(() => setGone(true), GONE_AT)
      );
    }

    return () => {
      timers.forEach(window.clearTimeout);
      document.body.style.overflow = previousOverflow;
    };
    // Intentionally runs once: the intro is a page-load event, not a reactive one.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* The same mark twice — white underneath, ink inside the wipe — so the letters carry through. */
  const mark = (
    <span className={styles.wordmark}>
      {LETTERS.map((ch, i) => (
        <span
          key={i}
          className={styles.letter}
          style={{ '--hop': `${i * 0.07}s` } as React.CSSProperties}
        >
          {/* A space would collapse in an inline-block; keep the glyph box alive. */}
          {ch === ' ' ? ' ' : ch}
        </span>
      ))}
    </span>
  );

  return (
    <div
      className={`${styles.overlay} ${fading ? styles.fading : ''} ${gone ? styles.gone : ''}`}
      aria-hidden="true"
    >
      {mark}
      <div className={`${styles.wipe} ${wiping ? styles.wiping : ''}`}>{mark}</div>
    </div>
  );
}
