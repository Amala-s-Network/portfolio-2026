'use client';

import { useEffect, useState } from 'react';

/**
 * Nav progress bar. README §1:
 *   scrollTop / (scrollHeight - innerHeight)
 * applied as scaleX() with transform-origin: left.
 *
 * Deliberately NOT gated behind a lone requestAnimationFrame — README "Entrance cascade"
 * records that rAF-gated scroll work failed silently in throttled contexts.
 */
export function useScrollProgress(): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const read = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0);
    };

    read();
    window.addEventListener('scroll', read, { passive: true });
    window.addEventListener('resize', read);
    return () => {
      window.removeEventListener('scroll', read);
      window.removeEventListener('resize', read);
    };
  }, []);

  return progress;
}
