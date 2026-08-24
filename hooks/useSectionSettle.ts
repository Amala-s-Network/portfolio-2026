'use client';

import { useEffect } from 'react';

/** How long the reader must be still before the page decides they have stopped. */
const IDLE_MS = 180;
/** Nothing under this is worth moving for; below it the settle would read as a twitch. */
const DEAD_ZONE = 10;
/**
 * How long a page turn takes.
 *
 * This is THE control over the speed of the transition, and it did not exist before: the code
 * used scrollTo({ behavior: 'smooth' }), whose duration belongs to the browser — around 300 to
 * 500ms in Chrome, unadjustable. Widening the reveal window changed how far the panel travelled
 * per pixel of scroll, but the scroll itself still finished in under half a second, so the whole
 * turn did too.
 *
 * Driving the offset frame by frame puts the duration here. The panel needs no changes to follow:
 * its position has always been a function of scroll offset, so a slower scroll IS a slower turn,
 * and the two cannot fall out of step.
 */
const TURN_MS = 1500;


/**
 * How much wheel travel counts as a deliberate gesture — ACCUMULATED, not per event.
 *
 * The old test asked a single event to clear 14, and that is the wrong question. A mouse notch
 * arrives as one delta of 100 or so and passes easily; a trackpad sends a stream of values in the
 * single digits, none of which ever clears the bar on its own. So the page answered a mouse
 * immediately and appeared stuck under a finger — "precisa scrollar muito".
 *
 * Summing over a short window asks the honest question: has the reader moved enough, however
 * they chose to move. 20 is roughly a fifth of a mouse notch and a few frames of a trackpad.
 */
const GESTURE_DELTA = 20;

/** How long the accumulator remembers. Past this, a new stretch of scrolling is a new gesture. */
const GESTURE_WINDOW_MS = 200;

/**
 * How far into a turn a second gesture is accepted.
 *
 * Everything used to be swallowed for the full 1500ms, so scrolling twice quickly registered
 * once and the page felt locked. Past two thirds the turn is visually all but finished, and
 * letting the next one start there is what makes several pages in a row feel like scrolling
 * rather than like waiting.
 */
const CHAIN_AT = 0.66;

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
    /* Wheel travel summed over GESTURE_WINDOW_MS, and when the current turn began. */
    let travel = 0;
    let travelReset = 0;
    let turnBegan = 0;

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
      turnBegan = began;
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

      /*
       * Mid-flight, swallow — but only for the first two thirds. This is still what stops a
       * flick paging three sections, while letting a deliberate second gesture land.
       */
      if (settling && performance.now() - turnBegan < TURN_MS * CHAIN_AT) {
        e.preventDefault();
        return;
      }

      /* Inside the paged run the wheel never scrolls the page directly — it asks for a turn. */
      e.preventDefault();

      travel += e.deltaY;
      window.clearTimeout(travelReset);
      travelReset = window.setTimeout(() => {
        travel = 0;
      }, GESTURE_WINDOW_MS);

      if (Math.abs(travel) < GESTURE_DELTA) return;
      travel = 0;

      /*
       * The wheel is a DIRECTION, not a distance.
       *
       * This used to require the reader to be sitting exactly on a boundary, and anywhere in
       * between it did nothing and left the settle to tidy up — so a gesture that landed slightly
       * off would appear to be ignored, and the next one after it too. Reading it as up or down
       * and going to the adjacent boundary from wherever they are makes it behave like a pair of
       * buttons: one flick, one page, no distance to cover.
       */
      const down = e.deltaY > 0;
      const target = down
        ? marks.find((m) => m > y + 4)
        : [...marks].reverse().find((m) => m < y - 4);

      if (target === undefined) return;

      window.clearTimeout(idle);
      glideTo(target);
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
      window.clearTimeout(deadline);
      window.clearTimeout(travelReset);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);
}
