'use client';

import { useEffect, useState, type RefObject } from 'react';

/**
 * Entrance cascade. README: a section fires ONCE, when its top passes 88% of the viewport
 * height, and then runs to completion regardless of further scrolling.
 *
 * ⚠️ The README carries a warning that cost real time on the prototype: this was built first with
 * IntersectionObserver and then with a rAF-throttled scroll handler, and both failed silently in
 * embedded/throttled contexts, leaving whole sections stuck at opacity: 0.
 *
 * So: check on scroll AND on a 180ms interval, re-check on visibilitychange and pageshow, and
 * never gate the reveal behind a single requestAnimationFrame. CLAUDE.md notes IntersectionObserver
 * is the right tool in a real app — but only once it has been verified in a production build, and
 * the cost of being wrong here is invisible content.
 */
export function useReveal(ref: RefObject<HTMLElement | null>): boolean {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let done = false;
    /*
     * `interval` must be declared with `let` BEFORE check() can reach cleanup(). Declaring it as
     * a const further down puts it in the temporal dead zone: a section already in view on mount
     * fires check() → cleanup() → ReferenceError, and the whole effect dies before any listener
     * is attached — leaving that section stuck at opacity 0 forever. Exactly the class of silent
     * failure the README warns about.
     */
    let interval = 0;

    const cleanup = () => {
      window.removeEventListener('scroll', check);
      window.removeEventListener('resize', check);
      window.clearInterval(interval);
      document.removeEventListener('visibilitychange', check);
      window.removeEventListener('pageshow', check);
    };

    function check() {
      if (done) return;
      const rect = el!.getBoundingClientRect();
      if (rect.top <= window.innerHeight * 0.88) {
        done = true;
        setRevealed(true);
        cleanup();
      }
    }

    window.addEventListener('scroll', check, { passive: true });
    window.addEventListener('resize', check);
    interval = window.setInterval(check, 180);
    document.addEventListener('visibilitychange', check);
    window.addEventListener('pageshow', check);

    // Checked last, so a section already in view tears down listeners that actually exist.
    check();

    return cleanup;
  }, [ref]);

  return revealed;
}
