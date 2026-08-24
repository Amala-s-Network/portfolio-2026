'use client';

import { useEffect } from 'react';

/** How long the reader must be still before the page decides they have stopped. */
const IDLE_MS = 180;
/** Nothing under this is worth moving for; below it the settle would read as a twitch. */
const DEAD_ZONE = 10;
/** Long enough for the smooth scroll to arrive before we listen again. */
const SETTLE_MS = 900;

/**
 * How much wheel travel counts as a deliberate gesture.
 *
 * Trackpads emit a long tail of tiny deltas as a flick decays, and treating those as new
 * gestures would page the reader through three sections for one swipe. 14 is above that noise
 * and well below a mouse wheel's single notch.
 */
const GESTURE_DELTA = 14;

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
     * ONE SECTION PER GESTURE, which is what João asked for: a scroll down should do what pulling
     * the corner does.
     *
     * The settle below already put the reader on a boundary after they stopped, but the journey
     * there was still theirs to get wrong — a long flick could carry them a section and a half,
     * and the settle would then haul them back, which is the "scroll bugado". Taking the gesture
     * and turning it into exactly one page removes the overshoot instead of correcting it.
     *
     * Only inside the full-height run, and only for the wheel. Keyboard and scrollbar dragging
     * are left completely alone: hijacking those takes away the coarse control some people rely
     * on to move around a page at all, and the settle still tidies up after them.
     */
    const onWheel = (e: WheelEvent) => {
      const marks = boundaries();
      if (marks.length === 0) return;

      const y = window.scrollY;
      const first = marks[0];
      const last = marks[marks.length - 1];

      /* Outside the run — and at its very end scrolling down — the page behaves normally. */
      if (y < first - 4 || y > last + 4) return;
      if (y >= last - 4 && e.deltaY > 0) return;
      if (y <= first + 4 && e.deltaY < 0) return;

      /* Mid-flight, swallow everything: this is what stops a flick paging three sections. */
      if (settling) {
        e.preventDefault();
        return;
      }

      if (Math.abs(e.deltaY) < GESTURE_DELTA) return;

      const down = e.deltaY > 0;
      /* The boundary the reader is currently sitting on, allowing for sub-pixel drift. */
      const here = marks.findIndex((m) => Math.abs(m - y) < 4);
      const target = down
        ? marks.find((m) => m > y + 4)
        : [...marks].reverse().find((m) => m < y - 4);

      if (target === undefined) return;
      /* If they are between boundaries, the settle handles it — this only pages from a landing. */
      if (here === -1) return;

      e.preventDefault();
      window.clearTimeout(idle);
      settling = true;
      window.scrollTo({ top: target, behavior: 'smooth' });
      release = window.setTimeout(() => {
        settling = false;
      }, SETTLE_MS);
    };

    /*
     * Any deliberate input during a settle cancels it. A page that keeps hauling the reader
     * somewhere after they have started moving again is fighting them, and it is the single
     * thing that makes this pattern feel broken rather than helpful.
     */
    const onIntent = () => {
      if (settling) stop();
    };

    /*
     * The wheel is deliberately NOT in the cancel list any more. It was there so a reader who
     * started scrolling again would not be dragged onwards — but now the wheel is what drives the
     * paging, and cancelling on it would stop every page turn the instant it began.
     */

    window.addEventListener('scroll', onScroll, { passive: true });
    /* passive: false — paging means preventing the default scroll, which a passive listener cannot. */
    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchstart', onIntent, { passive: true });
    window.addEventListener('keydown', onIntent);
    window.addEventListener('resize', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onIntent);
      window.removeEventListener('keydown', onIntent);
      window.removeEventListener('resize', onScroll);
      window.clearTimeout(idle);
      window.clearTimeout(release);
    };
  }, []);
}
