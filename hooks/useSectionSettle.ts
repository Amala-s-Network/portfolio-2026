'use client';

import { useEffect } from 'react';

/** How long the reader must be still before the page decides they have stopped. */
const IDLE_MS = 180;
/** Nothing under this is worth moving for; below it the settle would read as a twitch. */
const DEAD_ZONE = 10;
/** Long enough for the smooth scroll to arrive before we listen again. */
const SETTLE_MS = 900;

/**
 * Pulls the page onto a section boundary once the reader stops scrolling.
 *
 * This is scroll snapping, done in JavaScript, and the reason not to use the CSS property is the
 * whole point: `scroll-snap-type` acts DURING the gesture. With the case sections at exactly one
 * viewport, the next snap point sits exactly one wheel gesture away, so the browser ran its snap
 * straight through the panel's own turn — a 410px reveal compressed into a jump, which is why
 * the page appeared to have no animation between cases at all.
 *
 * Waiting for the gesture to finish keeps both things: the turn plays out under the reader's own
 * scrolling, and then the page settles rather than leaving them parked half way through a
 * transition with two panels on screen at once.
 *
 * Only the full-height sections take part — the header and the four cases. Below them the page
 * is ordinary editorial content of uneven height, and snapping a reader out of the middle of a
 * paragraph they are reading is the version of this feature everybody hates.
 */
export function useSectionSettle() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let idle = 0;
    let settling = false;
    let release = 0;

    /* Recomputed per settle rather than cached: these heights are all vh-based and a window
     * resize would silently invalidate anything measured once. */
    const boundaries = () => {
      const hero = document.querySelector('header') as HTMLElement | null;
      const cases = [...document.querySelectorAll('main > section')].filter((s) =>
        /CasePanel/.test((s as HTMLElement).className)
      ) as HTMLElement[];
      if (!hero || cases.length === 0) return [];

      const last = cases[cases.length - 1];
      return [hero.offsetTop, ...cases.map((c) => c.offsetTop), last.offsetTop + last.offsetHeight];
    };

    const stop = () => {
      /* Halting a smooth scroll means asking for the position it is already at. */
      window.scrollTo({ top: window.scrollY, behavior: 'auto' });
      settling = false;
      window.clearTimeout(release);
    };

    const settle = () => {
      if (settling) return;

      const marks = boundaries();
      if (marks.length === 0) return;

      const y = window.scrollY;
      /* Outside the full-height run, the page is left alone. */
      if (y < marks[0] - 4 || y > marks[marks.length - 1] + 4) return;

      const nearest = marks.reduce((best, m) => (Math.abs(m - y) < Math.abs(best - y) ? m : best));
      if (Math.abs(nearest - y) < DEAD_ZONE) return;

      settling = true;
      window.scrollTo({ top: nearest, behavior: 'smooth' });
      release = window.setTimeout(() => {
        settling = false;
      }, SETTLE_MS);
    };

    const onScroll = () => {
      if (settling) return;
      window.clearTimeout(idle);
      idle = window.setTimeout(settle, IDLE_MS);
    };

    /*
     * Any deliberate input during a settle cancels it. A page that keeps hauling the reader
     * somewhere after they have started moving again is fighting them, and it is the single
     * thing that makes this pattern feel broken rather than helpful.
     */
    const onIntent = () => {
      if (settling) stop();
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('wheel', onIntent, { passive: true });
    window.addEventListener('touchstart', onIntent, { passive: true });
    window.addEventListener('keydown', onIntent);
    window.addEventListener('resize', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('wheel', onIntent);
      window.removeEventListener('touchstart', onIntent);
      window.removeEventListener('keydown', onIntent);
      window.removeEventListener('resize', onScroll);
      window.clearTimeout(idle);
      window.clearTimeout(release);
    };
  }, []);
}
