'use client';

import { useEffect, useRef } from 'react';
import { useLanguage } from '@/lib/language';
import { pageFold as copy } from '@/content/copy';
import { playPaper } from '@/lib/paper';
import styles from './PageFold.module.css';

/**
 * Corner size at rest and at full peel, both as a FRACTION OF THE VIEWPORT HEIGHT.
 *
 * Fixed pixels were wrong across João's three screens: 96px is a confident corner on a 768-tall
 * window and a stamp on a 1080-tall one, and the peeled 300px that read well at 1920 crowded the
 * deck at 1366. Sizing from the height ties the corner to the sheet it belongs to — it is a
 * proportion of the page, which is what a folded corner actually is.
 *
 * The clamps stop it collapsing on a short window or swallowing a tall one.
 */
const REST_RATIO = 0.105;
const PEEL_RATIO = 0.3;
const REST_MIN = 62;
const REST_MAX = 132;
const PEEL_MIN = 150;
const PEEL_MAX = 340;

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
export function PageFold({
  onEnter,
  /**
   * 'hero' is the big corner on the first screen: fixed to the viewport, peeling as the reader
   * scrolls through the header.
   *
   * 'case' is the small one that sits between cases. It is ABSOLUTE, because it lives inside a
   * panel that is already fixed and already the full viewport — a second fixed element there
   * would be positioned against the window rather than against the page it belongs to, and would
   * survive its own panel leaving the screen.
   *
   * It also does not peel with scroll. The panel behind it is mid-turn for the whole time it is
   * visible, and a corner growing on top of a page that is itself moving is two motions arguing.
   * It answers to hover, and to the click.
   */
  variant = 'hero',
  /** What shows through the hole. Defaults to the first case, which is what the hero reveals. */
  image,
  label,
}: {
  onEnter?: () => void;
  variant?: 'hero' | 'case';
  image?: string;
  label?: string;
}) {
  const { t } = useLanguage();
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const apply = () => {
      /* The case corner is a fixed size; only the hero's peels with the scroll. */
      if (variant === 'case') return;

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
      const vh = window.innerHeight;
      const rest = Math.min(REST_MAX, Math.max(REST_MIN, vh * REST_RATIO));
      const peeled = Math.min(PEEL_MAX, Math.max(PEEL_MIN, vh * PEEL_RATIO));
      const size = reduced ? rest : rest + (peeled - rest) * p;
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
  }, [variant]);

  /*
   * Clicking scrolls to the first case rather than jumping. The panels are driven BY scroll
   * position, so a jump would land mid-animation with the page already turned — travelling
   * there is what makes the turn happen.
   */
  const turn = () => {
    playPaper();

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
      className={`${styles.fold} ${variant === 'case' ? styles.inCase : ''}`}
      onClick={turn}
      aria-label={label ?? t(copy.label)}
      style={image ? ({ '--foldImage': `url('${image}')` } as React.CSSProperties) : undefined}
    >
      {/* What shows through the hole the lifted corner leaves — the page underneath. */}
      <span className={styles.hole} aria-hidden="true" />

      {/*
        * The back of the sheet, flipped over the fold line. It occupies the mirrored triangle,
        * which is what reads as paper rather than as a cut-out corner.
        */}
      <span className={styles.flap} aria-hidden="true" />

      <span className={styles.label}>{label ?? t(copy.label)}</span>
    </button>
  );
}
