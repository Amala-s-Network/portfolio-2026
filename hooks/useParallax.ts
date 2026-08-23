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

      /*
       * mid / vh is CLAMPED to ±1, which bounds the travel to `amount` exactly.
       *
       * The README's formula has no bound: mid keeps growing as the element moves away from the
       * viewport centre, so a tall element in a short window can be pushed further than the
       * overhang its frame was given — and the moment it exceeds that, the image slides off its
       * own frame and bare background shows along one edge. It was doing this on the carousel
       * cards: 22px of #f1f1f1 along the top.
       *
       * The clamp only engages where the untamed value would have exceeded the budget, which is
       * well outside the range anyone sees the element move through, so the motion itself is
       * unchanged. What it buys is an invariant the CSS can be written against: travel never
       * exceeds `amount`, so an overhang of `amount` on each side can never be outrun.
       */
      const ratio = Math.max(-1, Math.min(1, mid / vh));
      el.style.transform = `translate3d(0, ${-ratio * amount}px, 0)`;
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
