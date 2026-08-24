'use client';

import { useEffect } from 'react';

/** How long the reader must be still before the page decides they have stopped. */
const IDLE_MS = 180;
/** Nothing under this is worth moving for; below it the settle would read as a twitch. */
const DEAD_ZONE = 10;
/**
 * How long the settle takes to close the gap.
 *
 * 650, not the 1500 a full page turn used to take. This is no longer moving the reader a whole
 * screen — the wheel does that now, natively and at whatever speed they choose. All this does is
 * close whatever is left over when they stop, and a correction that takes a second and a half
 * stops reading as tidying up and starts reading as the page taking the wheel off them. That is
 * the "trava" João kept running into.
 *
 * The slowness of the TURN itself is untouched and lives elsewhere: the panel completes its
 * reveal over 0.92 of a screen of scrolling, so it is slow because it is tied to the scroll, not
 * because anything is animating on a timer.
 */
const TURN_MS = 650;


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
    /*
     * Dead-man's switch on the turn.
     *
     * settling is cleared when the animation's last frame runs — and if that frame never runs,
     * it never clears and paging is dead for the rest of the session. requestAnimationFrame does
     * not fire in a background tab and can be throttled to nothing in embedded contexts; the
     * README warns about exactly this class of failure elsewhere in the project, and it showed
     * up here the moment a turn was started in a pane that composites no frames.
     *
     * The timer is a floor, not the mechanism: the animation clears the flag itself in the normal
     * case, well before this fires.
     */
    let deadline = 0;

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

    let frame = 0;

    const stop = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      settling = false;
      window.clearTimeout(deadline);
    };

    /*
     * The turn, driven by hand.
     *
     * easeInOutCubic rather than the browser's own curve: it leaves slowly, carries speed through
     * the middle and arrives without stopping short, which is what a sheet of paper does. The
     * browser's smooth scroll is tuned for getting somewhere, not for being watched.
     */
    const glideTo = (target: number) => {
      const start = window.scrollY;
      const distance = target - start;
      if (Math.abs(distance) < 1) return;

      const began = performance.now();
      settling = true;
      window.clearTimeout(deadline);
      deadline = window.setTimeout(() => {
        settling = false;
        if (frame) cancelAnimationFrame(frame);
        frame = 0;
      }, TURN_MS + 400);


      const step = (now: number) => {
        const t = Math.min(1, (now - began) / TURN_MS);
        const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        window.scrollTo(0, start + distance * eased);

        if (t < 1) {
          frame = requestAnimationFrame(step);
        } else {
          frame = 0;
          settling = false;
          window.clearTimeout(deadline);
        }
      };

      frame = requestAnimationFrame(step);
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

      glideTo(nearest);
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
      window.clearTimeout(deadline);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);
}
