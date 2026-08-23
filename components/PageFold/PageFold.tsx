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

/** Resting size while the page is held still and the corner is the only way forward. */
const HELD = 190;

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
export function PageFold({
  onEnter,
  /**
   * When the page is held still, the corner cannot take its cue from scroll — there is none.
   * It sits already peeled instead, with the photograph showing through, because the whole
   * invitation depends on the reader seeing that something is under there.
   */
  held = false,
  /** True during the single animated lift: the corner has done its job and gets out of the way. */
  turning = false,
}: {
  onEnter?: () => void;
  held?: boolean;
  turning?: boolean;
}) {
  const { t } = useLanguage();
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const apply = () => {
      if (turning) {
        /* The reader has pulled it. Leave before the sheet does, not with it. */
        el.style.opacity = '0';
        el.style.visibility = 'hidden';
        return;
      }

      if (held) {
        el.style.setProperty('--foldSize', `${HELD}px`);
        el.style.setProperty('--lift', reduced ? '0deg' : `${LIFT * 0.55}deg`);
        el.style.opacity = '1';
        el.style.visibility = '';
        return;
      }

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
       * Gone BEFORE the first case owns the screen, which is much earlier than it looks.
       *
       * The hero is exactly one viewport tall, so the first case section's top sits exactly one
       * screen down — and its panel therefore starts rising on the very first pixel of scroll,
       * covering the screen completely by 58% of it (README §5's reveal window). The fade used
       * to start at 66%, which left roughly 320px of scrolling where the case had taken the
       * screen and the corner was still painted on top of it. That is the dog-ear João
       * photographed sitting on the forest.
       *
       * Gone by 50%, comfortably ahead of the panel it would otherwise be standing on.
       */
      const fade = Math.max(0, 1 - p / 0.5);
      el.style.opacity = String(fade);
      /* visibility, not pointer-events: the box already takes none — see the CSS. */
      el.style.visibility = fade < 0.05 ? 'hidden' : '';
    };

    apply();
    window.addEventListener('scroll', apply, { passive: true });
    window.addEventListener('resize', apply);
    return () => {
      window.removeEventListener('scroll', apply);
      window.removeEventListener('resize', apply);
    };
  }, [held, turning]);

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
