'use client';

import { useEffect, type RefObject } from 'react';

/**
 * Flips the nav to its inverted palette when a dark surface passes beneath it (README §1).
 *
 * Geometry, not colour sampling. The nav sits at z-index 50, so `elementFromPoint` under it
 * returns the nav itself — the technique BackToTop uses works there only because that button can
 * disable its own pointer-events for one frame, which a bar the user is about to click cannot
 * safely do. Instead every dark surface carries `data-dark`, and this simply asks whether any of
 * them currently overlaps the nav's band.
 *
 * The case panels are the reason this has to run per frame rather than per section: they are
 * `position: fixed` and slide under the bar continuously, so their rect changes even when the
 * page's scroll position does not.
 */
export function useSurfaceInversion(navRef: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    const apply = () => {
      const bar = nav.getBoundingClientRect();
      let dark = false;

      for (const el of document.querySelectorAll<HTMLElement>('[data-dark]')) {
        if (el.offsetParent === null && getComputedStyle(el).position !== 'fixed') continue;
        const r = el.getBoundingClientRect();
        if (getComputedStyle(el).visibility === 'hidden') continue;

        /*
         * Overlap is measured against the bar's own midline rather than its full height. Using
         * the whole rect makes the nav flip the instant a panel's top edge touches its bottom
         * border, while the bar still reads as sitting on white — the flip lands early and looks
         * like a glitch. The midline is where the eye actually judges it.
         */
        const mid = bar.top + bar.height / 2;
        if (r.top <= mid && r.bottom >= mid && r.left < bar.right && r.right > bar.left) {
          dark = true;
          break;
        }
      }

      const s = nav.style;
      if (dark) {
        s.setProperty('--navBg', 'var(--ink)');
        s.setProperty('--navFg', 'var(--paper)');
        s.setProperty('--navMuted', 'var(--on-dark-50)');
        s.setProperty('--navTrack', 'rgba(255, 255, 255, 0.22)');
        // The CTA is a filled button; on ink it has to become the inverse of itself.
        s.setProperty('--btnBg', 'var(--paper)');
        s.setProperty('--btnFg', 'var(--ink)');
        s.setProperty('--btnBd', 'var(--paper)');
        s.setProperty('--btnBgH', 'transparent');
        s.setProperty('--btnFgH', 'var(--paper)');
        s.setProperty('--btnBdH', 'var(--paper)');
      } else {
        for (const p of [
          '--navBg', '--navFg', '--navMuted', '--navTrack',
          '--btnBg', '--btnFg', '--btnBd', '--btnBgH', '--btnFgH', '--btnBdH',
        ]) {
          s.removeProperty(p);
        }
      }
    };

    apply();
    window.addEventListener('scroll', apply, { passive: true });
    window.addEventListener('resize', apply);
    // Fixed panels move without the page scrolling, so a scroll listener alone misses frames.
    const interval = window.setInterval(apply, 120);

    return () => {
      window.removeEventListener('scroll', apply);
      window.removeEventListener('resize', apply);
      window.clearInterval(interval);
    };
  }, [navRef]);
}
