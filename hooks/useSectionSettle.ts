'use client';

import { useEffect } from 'react';

/** How long the pull from the first screen into the first case takes. */
const TURN_MS = 1400;

/** How long the reader must be still before the page decides they have stopped. */
const IDLE_MS = 170;

/** Below this there is nothing worth moving for; the correction would read as a twitch. */
const DEAD_ZONE = 12;

/** Wheel travel, summed over a short window, that counts as a deliberate gesture. */
const GESTURE_DELTA = 20;
const GESTURE_WINDOW_MS = 200;

/**
 * The pull from the first screen into the first case — and nothing else.
 *
 * The narrowness is the correction. Earlier versions of this hook applied to every boundary in
 * the case run, so the page kept taking hold of the wheel while the reader was moving between
 * cases 01 and 04: they scrolled, the page decided how far that meant, and it felt locked no
 * matter how the thresholds were tuned. Widening the tolerances only moved the problem around,
 * because the problem was never the numbers — it was that the page was making a decision in a
 * place where the reader should have been making it.
 *
 * There is exactly one place worth insisting on: leaving the first screen. That is the transition
 * the dog-ear invites and the one the whole design is built around — a page being turned, not a
 * document being scrolled. Once the reader is among the cases they are reading, and reading is
 * theirs to pace. Below the first case this hook does nothing: no interception, no settling.
 */
export function useSectionSettle() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let idle = 0;
    let frame = 0;
    let settling = false;
    let deadline = 0;
    let travel = 0;
    let travelReset = 0;

    /*
     * The only two positions that matter: the top of the page, and the top of the first case.
     *
     * Measured on each use rather than cached — every height here is viewport-derived, so a
     * resize would silently invalidate anything read once.
     */
    const marks = (): [number, number] | null => {
      const hero = document.querySelector('header') as HTMLElement | null;
      const firstCase = [...document.querySelectorAll('main > section')].find((s) =>
        /CasePanel/.test((s as HTMLElement).className)
      ) as HTMLElement | undefined;
      if (!hero || !firstCase) return null;
      return [hero.offsetTop, firstCase.offsetTop];
    };

    /** True only while the reader is still on the first screen. */
    const inRegion = (y: number, top: number, bottom: number) => y >= top - 4 && y < bottom - 4;

    const stop = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      settling = false;
      window.clearTimeout(deadline);
    };

    /*
     * easeInOutCubic: leaves slowly, carries speed through the middle, arrives without stopping
     * short. The browser's own smooth scroll is tuned for getting somewhere rather than for being
     * watched, and its duration cannot be changed — which is why this is animated by hand.
     */
    const glideTo = (target: number) => {
      const start = window.scrollY;
      const distance = target - start;
      if (Math.abs(distance) < 1) return;

      const began = performance.now();
      settling = true;

      /*
       * Dead-man's switch. settling is cleared by the animation's last frame, and if that frame
       * never runs — a background tab, a throttled context — it never clears and the pull is dead
       * for the rest of the session. The README warns about this class of failure elsewhere.
       */
      window.clearTimeout(deadline);
      deadline = window.setTimeout(stop, TURN_MS + 400);

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

    /*
     * The wheel, on the first screen only: a direction, not a distance.
     *
     * Travel is summed over a window rather than tested per event. A mouse notch arrives as one
     * delta of about 100 and passes either test; a trackpad sends a stream of single-digit values
     * that never clears a per-event bar, which is what made the page feel dead under a finger.
     */
    const onWheel = (e: WheelEvent) => {
      const m = marks();
      if (!m) return;
      const [top, bottom] = m;
      const y = window.scrollY;

      /* Among the cases the wheel is not ours. Leave before touching the event. */
      if (!inRegion(y, top, bottom)) return;
      /* Scrolling up from the very top has nowhere to go. */
      if (y <= top + 4 && e.deltaY < 0) return;

      e.preventDefault();
      if (settling) return;

      travel += e.deltaY;
      window.clearTimeout(travelReset);
      travelReset = window.setTimeout(() => {
        travel = 0;
      }, GESTURE_WINDOW_MS);

      if (Math.abs(travel) < GESTURE_DELTA) return;

      const down = travel > 0;
      travel = 0;
      window.clearTimeout(idle);
      glideTo(down ? bottom : top);
    };

    /* Anything left over when the reader stops is closed — again, first screen only. */
    const settle = () => {
      if (settling) return;
      const m = marks();
      if (!m) return;
      const [top, bottom] = m;
      const y = window.scrollY;
      if (!inRegion(y, top, bottom)) return;

      const nearest = y - top < bottom - y ? top : bottom;
      if (Math.abs(nearest - y) < DEAD_ZONE) return;
      glideTo(nearest);
    };

    const onScroll = () => {
      if (settling) return;
      window.clearTimeout(idle);
      idle = window.setTimeout(settle, IDLE_MS);
    };

    /*
     * Deliberate input during a glide cancels it — except the wheel, which is what starts one.
     * A page that keeps hauling the reader somewhere after they have started moving again is the
     * single thing that makes this pattern hateful.
     */
    const onIntent = () => {
      if (settling) stop();
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    /* passive: false — holding the first screen means preventing the default scroll. */
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
