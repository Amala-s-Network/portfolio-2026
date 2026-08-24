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
  const [active, setActive] = useState('home');
  const pathname = usePathname();

  /*
   * OFF THE HOME ROUTE, the answer comes from the URL and not from the scroll.
   *
   * This was a real bug: the mark was read purely from the geometry of the one-pager, so on
   * /projetos and on a case page there was no #projetos or #sobre in the document to measure and
   * every link went unmarked. The reader clicked "Projetos", arrived on the projects page, and
   * the bar said they were nowhere.
   *
   * A case page counts as "Projetos" too — it is reached from that index and belongs to it.
   */
  useEffect(() => {
    if (pathname === '/projetos' || pathname.startsWith('/cases/')) setActive('projetos');
  }, [pathname]);

  useEffect(() => {
    /* The scroll test only means anything where the sections it measures exist. */
    if (pathname !== '/') return;

    const check = () => {
      const line = window.innerHeight / 3;

      const sobre = document.querySelector('#sobre');
      if (sobre) {
        const r = sobre.getBoundingClientRect();
        if (r.top <= line && r.bottom > line) {
          setActive('sobre');
          return;
        }
      }

      const projetos = document.querySelector('#projetos');
      if (projetos) {
        const r = projetos.getBoundingClientRect();
        if (r.top <= line && r.bottom > line) {
          setActive('projetos');
          return;
        }
      }

      /*
       * Everything above "Outros projetos" — the header and the four cases — counts as home.
       * The cases have no nav entry of their own, and marking nothing at all while the reader
       * moves through the main body of the site reads as the bar having lost track of them.
       */
      const projectsTop = projetos ? projetos.getBoundingClientRect().top : Infinity;
      setActive(projectsTop > line ? 'home' : '');
    };

    check();
    window.addEventListener('scroll', check, { passive: true });
    window.addEventListener('resize', check);
    return () => {
      window.removeEventListener('scroll', check);
      window.removeEventListener('resize', check);
    };
  }, [pathname]);

  return active;
}
