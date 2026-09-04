'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Which part of the page the reader is actually looking at.
 *
 * Read from geometry on scroll rather than from IntersectionObserver, for the same reason
 * useReveal does: the README warns that the observer failed silently in embedded and throttled
 * contexts on the prototype, and a nav mark that quietly stops updating is worse than one that
 * costs a few rect reads.
 *
 * The test is which section owns the UPPER THIRD of the viewport, not which is most visible.
 * "Most visible" flickers between two sections at the moment they split the screen evenly, and
 * the resulting mark jitters between two links while the reader is doing nothing unusual.
 */
export function useActiveSection(): string {
  const [scrolled, setScrolled] = useState('home');
  const pathname = usePathname();

  useEffect(() => {
    /* The scroll test only means anything where the sections it measures exist. */
    if (pathname !== '/') return;

    const check = () => {
      const line = window.innerHeight / 3;

      const sobre = document.querySelector('#sobre');
      if (sobre) {
        const r = sobre.getBoundingClientRect();
        if (r.top <= line && r.bottom > line) {
          setScrolled('sobre');
          return;
        }
      }

      /* Absent while SHOW_PROJECTS is off, which is why every read of it is guarded. */
      const projetos = document.querySelector('#projetos');
      if (projetos) {
        const r = projetos.getBoundingClientRect();
        if (r.top <= line && r.bottom > line) {
          setScrolled('projetos');
          return;
        }
      }

      /*
       * Everything above "Outros projetos" — the header and the four cases — counts as home.
       * The cases have no nav entry of their own, and marking nothing at all while the reader
       * moves through the main body of the site reads as the bar having lost track of them.
       */
      /*
       * Everything above the first section after the cases counts as home. With the projects
       * section gone that boundary becomes "Sobre mim" — without the fallback the boundary was
       * Infinity, so the whole page below the cases still reported as home and the mark never
       * moved off it.
       */
      const boundary = projetos ?? document.querySelector('#sobre');
      const boundaryTop = boundary ? boundary.getBoundingClientRect().top : Infinity;
      setScrolled(boundaryTop > line ? 'home' : '');
    };

    check();
    window.addEventListener('scroll', check, { passive: true });
    window.addEventListener('resize', check);
    return () => {
      window.removeEventListener('scroll', check);
      window.removeEventListener('resize', check);
    };
  }, [pathname]);

  /*
   * OFF THE HOME ROUTE, the answer comes from the URL — and it is DERIVED, not stored.
   *
   * The URL answer used to be written into the same state by an effect, and that state started at
   * 'home'. So the escritório's first paint marked "Página inicial" and corrected itself a frame
   * later; the bar told the reader they were somewhere they had just left. Reading the pathname
   * during the render has the right answer before anything is painted, and there is no second
   * source of truth to fall out of step with the first.
   *
   * A case page counts as "Projetos": it is reached from that index and belongs to it. The two
   * pages behind the frames count as the escritório for the same reason, which is what the prefix
   * match buys over an equality check.
   */
  if (pathname === '/projetos' || pathname.startsWith('/cases/')) return 'projetos';
  if (pathname.startsWith('/escritorio')) return 'escritorio';
  /* Any other route has no entry in the bar, and marking one of them would be a guess. */
  if (pathname !== '/') return '';

  return scrolled;
}
