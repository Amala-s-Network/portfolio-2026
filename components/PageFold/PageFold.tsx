'use client';

import { useEffect, useRef } from 'react';
import { useLanguage } from '@/lib/language';
import { pageFold as copy } from '@/content/copy';
import styles from './PageFold.module.css';

/** Corner size at rest, and how far scrolling through the hero peels it back. */
const REST = 96;
const PEELED = 300;

/**
 * How far the flap rotates off the page, in degrees, at full peel.
 *
 * This is what turns a static dog-ear into a page being turned. The rotation runs about the
 * fold line itself — the 45-degree diagonal — so the corner lifts towards the reader the way
 * paper does when it is pulled, instead of sliding or growing flat.
 */
const LIFT = 34;

/**
 * The dog-ear in the bottom-right corner of the first screen.
 *
 * The case sections already turn like magazine pages — that motion has been the point of this
 * design from the start. What it never had was an invitation: the reader had to scroll and
 * discover it. A folded corner is the oldest affordance print has, and it says "there is a page
 * under this one" without a single word of instruction.
 *
 * It answers to both gestures on purpose. Scrolling peels it further, so someone who never
 * touches it still sees the page beginning to turn as they move; hovering lifts it and names
 * where it goes; clicking takes them there. Three ways in, one destination.
 */
export function PageFold({ onEnter }: { onEnter?: () => void }) {
  const { t } = useLanguage();
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const apply = () => {
      const hero = document.querySelector('header');
      if (!hero) return;

      /*
       * Progress through the FIRST SCREEN, not through the document. The fold belongs to the
       * hero: once the hero is gone the reader is already among the cases and a corner offering
       * to take them there is furniture.
       */
      const heroHeight = hero.getBoundingClientRect().height || window.innerHeight;
      const p = Math.min(1, Math.max(0, window.scrollY / heroHeight));

      /* Reduced motion gets the corner, at a fixed size, with no peeling and no lift. */
      const size = reduced ? REST : REST + (PEELED - REST) * p;
      el.style.setProperty('--foldSize', `${size}px`);
      el.style.setProperty('--lift', `${reduced ? 0 : LIFT * p}deg`);

      /*
       * Gone by the time the first case owns the screen.
       *
       * The fade runs over the last third rather than the last quarter, because the corner is
       * much larger now: 300px vanishing in a quarter of a screen reads as a blink, and the
       * whole point is that it should feel handed over to the case rather than switched off.
       */
      const fade = p > 0.66 ? Math.max(0, 1 - (p - 0.66) / 0.34) : 1;
      el.style.opacity = String(fade);
      el.style.pointerEvents = fade < 0.1 ? 'none' : 'auto';
    };

    apply();
    window.addEventListener('scroll', apply, { passive: true });
    window.addEventListener('resize', apply);
    return () => {
      window.removeEventListener('scroll', apply);
      window.removeEventListener('resize', apply);
    };
  }, []);

  /*
   * Clicking scrolls to the first case rather than jumping. The panels are driven BY scroll
   * position, so a jump would land mid-animation with the page already turned — travelling
   * there is what makes the turn happen.
   */
  const turn = () => {
    if (onEnter) {
      onEnter();
      return;
    }
    const first = document.querySelector('main > section');
    first?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <button
      ref={ref}
      type="button"
      className={styles.fold}
      onClick={turn}
      aria-label={t(copy.label)}
    >
      {/* What shows through the hole the lifted corner leaves — the page underneath. */}
      <span className={styles.hole} aria-hidden="true" />

      {/*
        * The back of the sheet, flipped over the fold line. It occupies the mirrored triangle,
        * which is what reads as paper rather than as a cut-out corner.
        */}
      <span className={styles.flap} aria-hidden="true" />

      <span className={styles.label}>{t(copy.label)}</span>
    </button>
  );
}
