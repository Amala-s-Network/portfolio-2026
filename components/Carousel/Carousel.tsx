'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ButtonLink } from '@/components/Button/Button';
import { Reveal } from '@/components/Reveal/Reveal';
import { CarouselCard } from './CarouselCard';
import { useReveal } from '@/hooks/useReveal';
import { useLanguage } from '@/lib/language';
import { carousel as copy, projects } from '@/content/copy';
import styles from './Carousel.module.css';

/** Rail gap, kept in sync with the 30px in Carousel.module.css. */
const GAP = 30;
/** Sub-pixel slack, so a rail that is 0.4px from its end still counts as at the end. */
const EDGE = 2;

export function Carousel() {
  const { lang, t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const revealed = useReveal(sectionRef);

  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [dragging, setDragging] = useState(false);
  /** Timer that restores scroll snapping once a wheel gesture stops. */
  const settleRef = useRef<number | undefined>(undefined);

  const readEdges = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return;
    const max = rail.scrollWidth - rail.clientWidth;
    setAtStart(rail.scrollLeft <= EDGE);
    setAtEnd(rail.scrollLeft >= max - EDGE);
  }, []);

  /*
   * README §6 "Wheel capture": a non-passive wheel listener turns vertical wheel delta into
   * scrollLeft and calls preventDefault() — EXCEPT at either end, where the event is let through
   * so the page keeps scrolling.
   *
   * That exception is the whole point. Without it the rail swallows every wheel event while the
   * pointer is over it and the user cannot scroll past the section at all.
   *
   * Registered here rather than via onWheel because React's synthetic wheel handler is passive,
   * and a passive listener is forbidden from calling preventDefault().
   */
  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    const onWheel = (e: WheelEvent) => {
      // Leave horizontal trackpad gestures to the browser; it already does the right thing.
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;

      const max = rail.scrollWidth - rail.clientWidth;
      const goingRight = e.deltaY > 0;
      const stuck = goingRight ? rail.scrollLeft >= max - EDGE : rail.scrollLeft <= EDGE;

      // At the end in the direction of travel: hand the event back to the page.
      if (stuck) return;

      e.preventDefault();

      // Suspend snapping for the gesture, or each tick is snapped back before the next arrives.
      rail.classList.add(styles.railFree);
      rail.scrollLeft += e.deltaY;
      readEdges();

      window.clearTimeout(settleRef.current);
      settleRef.current = window.setTimeout(() => {
        // Gesture over: restore snapping and let the rail settle onto the nearest card.
        rail.classList.remove(styles.railFree);
        readEdges();
      }, 140);
    };

    rail.addEventListener('wheel', onWheel, { passive: false });
    rail.addEventListener('scroll', readEdges, { passive: true });
    window.addEventListener('resize', readEdges);
    readEdges();

    return () => {
      rail.removeEventListener('wheel', onWheel);
      rail.removeEventListener('scroll', readEdges);
      window.removeEventListener('resize', readEdges);
      window.clearTimeout(settleRef.current);
    };
  }, [readEdges]);

  /* Drag-to-scroll — the rail advertises it with cursor: grab. */
  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    let startX = 0;
    let startScroll = 0;
    let active = false;

    const down = (e: PointerEvent) => {
      // Primary button only, and never hijack a click on a link inside a card.
      if (e.button !== 0) return;
      active = true;
      startX = e.clientX;
      startScroll = rail.scrollLeft;
      setDragging(true);
      rail.classList.add(styles.railFree); // same reason as the wheel handler
    };

    const move = (e: PointerEvent) => {
      if (!active) return;
      const dx = e.clientX - startX;
      // Only capture the pointer once it has clearly become a drag, so taps still work.
      if (Math.abs(dx) > 4 && !rail.hasPointerCapture(e.pointerId)) {
        rail.setPointerCapture(e.pointerId);
      }
      rail.scrollLeft = startScroll - dx;
    };

    const up = (e: PointerEvent) => {
      if (!active) return;
      active = false;
      setDragging(false);
      if (rail.hasPointerCapture(e.pointerId)) rail.releasePointerCapture(e.pointerId);
      // Restore snapping so the rail settles onto the nearest card when released.
      rail.classList.remove(styles.railFree);
      readEdges();
    };

    rail.addEventListener('pointerdown', down);
    rail.addEventListener('pointermove', move);
    rail.addEventListener('pointerup', up);
    rail.addEventListener('pointercancel', up);

    return () => {
      rail.removeEventListener('pointerdown', down);
      rail.removeEventListener('pointermove', move);
      rail.removeEventListener('pointerup', up);
      rail.removeEventListener('pointercancel', up);
    };
  }, [readEdges]);

  /** Arrows step by exactly one card width plus the gap (README §6). */
  const step = (direction: -1 | 1) => {
    const rail = railRef.current;
    if (!rail) return;
    const card = rail.firstElementChild as HTMLElement | null;
    const distance = (card?.offsetWidth ?? 300) + GAP;
    rail.scrollBy({ left: direction * distance, behavior: 'smooth' });
  };

  return (
    <section ref={sectionRef} className={styles.section} id="projetos">
      <Reveal on={revealed} order={0} className={styles.header}>
        <h2 className={styles.heading}>{t(copy.heading)}</h2>
      </Reveal>

      <Reveal on={revealed} order={1}>
        <div
          ref={railRef}
          className={`${styles.rail} ${dragging ? styles.railDragging : ''}`}
          role="region"
          aria-label={t(copy.heading)}
        >
          {projects.map((p) => (
            <CarouselCard key={p.slug} data={p} />
          ))}
        </div>
      </Reveal>

      <Reveal on={revealed} order={2} className={styles.controls}>
        <button
          type="button"
          className={styles.arrow}
          onClick={() => step(-1)}
          disabled={atStart}
          aria-label={lang === 'pt' ? 'Projeto anterior' : 'Previous project'}
        >
          <span aria-hidden="true">⇠</span>
        </button>
        <button
          type="button"
          className={styles.arrow}
          onClick={() => step(1)}
          disabled={atEnd}
          aria-label={lang === 'pt' ? 'Próximo projeto' : 'Next project'}
        >
          <span aria-hidden="true">⇢</span>
        </button>

        <ButtonLink className={styles.viewAll} variant="outline" href="#" small>
          {t(copy.viewAll)}
        </ButtonLink>
      </Reveal>
    </section>
  );
}
