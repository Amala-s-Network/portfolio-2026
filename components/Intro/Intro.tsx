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

/**
 * Whether the vignette has already run in THIS document.
 *
 * Module scope on purpose. It survives client-side navigation, because Next keeps the module
 * graph alive across route changes — and it is wiped by a real document load, because the whole
 * bundle is re-evaluated. That is exactly the line João drew: home → case → back must not replay
 * it, a reload of the home page must.
 *
 * sessionStorage would have been the obvious reach and is the wrong tool: it survives reloads
 * too, so the vignette would play once ever and never again for the rest of the tab.
 */
let alreadyPlayed = false;

/**
 * Whether this document was OPENED on the home page.
 *
 * Landing on /projetos and then walking to the home route is not "entering the home page" in the
 * sense the vignette is for — it is a step inside a visit that is already under way, and a
 * full-screen black wipe in the middle of that reads as the site restarting. The Navigation
 * Timing entry keeps the URL the document was loaded with, so it stays truthful no matter how
 * many client-side routes have been crossed since.
 */
function documentOpenedOnHome(): boolean {
  try {
    const entry = performance.getEntriesByType('navigation')[0] as
      | PerformanceNavigationTiming
      | undefined;
    if (!entry) return window.location.pathname === '/';
    return new URL(entry.name).pathname === '/';
  } catch {
    /* Navigation Timing is not guaranteed; falling back to playing is the friendlier failure. */
    return true;
  }
}

type IntroProps = {
  /** Fires when scroll unlocks, so the hero cascade can start. */
  onDone: () => void;
};

export function Intro({ onDone }: IntroProps) {
  /*
   * Decided during the first render, not in the effect. Deciding in the effect would paint one
   * frame of full-screen black before skipping it, which is a flash on every single return to
   * the home page — worse than the vignette it is meant to avoid.
   */
  const [skipped] = useState(() => {
    if (typeof window === 'undefined') return false;
    return alreadyPlayed || !documentOpenedOnHome();
  });

  const [wiping, setWiping] = useState(false);
  const [fading, setFading] = useState(false);
  const [gone, setGone] = useState(skipped);

  useEffect(() => {
    if (skipped) {
      /* Nothing to wait for: release the page immediately so the hero cascade runs at once. */
      onDone();
      return;
    }
    alreadyPlayed = true;

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
        window.setTimeout(() => {
          setWiping(true);
        }, WIPE_AT),
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

  /* Skipped means never mounted visually — no overlay, no black frame, no scroll lock. */
  if (skipped) return null;

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
