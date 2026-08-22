'use client';

import { useEffect, type RefObject } from 'react';

/**
 * README "Parallax". The element declares an amount in px; per frame:
 *   const mid = rect.top + rect.height/2 - vh/2;
 *   translate3d(0, -(mid / vh) * amount, 0)
 *
 * Portrait uses 46px, carousel images 26px.
 */
export function useParallax(ref: RefObject<HTMLElement | null>, amount: number) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const apply = () => {
      const vh = window.innerHeight;
      const rect = el.getBoundingClientRect();
      const mid = rect.top + rect.height / 2 - vh / 2;
      el.style.transform = `translate3d(0, ${-(mid / vh) * amount}px, 0)`;
    };

    apply();
    window.addEventListener('scroll', apply, { passive: true });
    window.addEventListener('resize', apply);
    return () => {
      window.removeEventListener('scroll', apply);
      window.removeEventListener('resize', apply);
    };
  }, [ref, amount]);
}
