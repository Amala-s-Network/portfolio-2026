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
  const riseRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const revealed = useReveal(sectionRef);

  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const [dragging, setDragging] = useState(false);
  /** Timer that restores scroll snapping once a drag settles. */
  const settleRef = useRef<number | undefined>(undefined);

  /*
   * The section arrives as another page turning, the way the cases do.
   *
   * Case 04 has nothing above it to be covered by, so its exit already slides it away at exactly
   * the rate this section arrives. What was missing was the other half of that gesture: the
   * carousel simply sat there, static, while the panel above it left. Giving it the same
   * rotateX-and-scale entrance means the seam reads as one page passing over another rather
   * than as one page leaving and a flat page being underneath all along.
   *
   * It is applied to a wrapper INSIDE the section rather than to the section itself: the section
   * owns the scroll geometry the maths is read from, and transforming the thing you are also
   * measuring is how you get a feedback loop.
   *
   * No fold here, at João's instruction. The dog-ear is an invitation to the cases, and by this
   * point the reader has taken it.
   */
  useEffect(() => {
    const section = sectionRef.current;
    const rise = riseRef.current;
    if (!section || !rise) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const apply = () => {
      const vh = window.innerHeight;
      const r = section.getBoundingClientRect();

      /* Same 58% reveal window and easeInOutQuad as README §5, so the two gestures match. */
      const p = Math.min(1, Math.max(0, (vh - r.top) / (vh * 0.58)));
      const eased = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
      const rest = 1 - eased;

      /*
       * Shallower than a case panel: 26% against 100%, 9deg against 11. A full-strength turn on
       * a section that is not full-screen overshoots — the content would swing up from below the
       * fold and land, which reads as a slide rather than as a page settling.
       */
      rise.style.transform = `translateY(${rest * 26}%) rotateX(${rest * -9}deg) scale(${
        1 - rest * 0.04
      })`;
      rise.style.opacity = String(1 - rest * 0.45);
    };

    apply();
    window.addEventListener('scroll', apply, { passive: true });
    window.addEventListener('resize', apply);
    return () => {
      window.removeEventListener('scroll', apply);
      window.removeEventListener('resize', apply);
    };
  }, []);

  const readEdges = useCallback(() => {
    const rail = railRef.current;
    if (!rail) return;
    const max = rail.scrollWidth - rail.clientWidth;
    setAtStart(rail.scrollLeft <= EDGE);
    setAtEnd(rail.scrollLeft >= max - EDGE);
  }, []);

  /*
   * README §6 describes a wheel capture that converts vertical wheel delta into horizontal
   * scroll. It is deliberately NOT used on a pointer device any more.
   *
   * João's reason is the right one: a rail that hijacks the wheel steals the gesture the user was
   * making. They meant to move down the page, the page stopped, and something sideways happened
   * instead. Even implemented correctly — with the end-check that hands the event back at either
   * edge — the moment of "why did the page stop" is itself the confusion. On desktop the arrows
   * are now the whole navigation, which is unambiguous.
   *
   * Touch keeps its native horizontal swipe, which is a distinct gesture from a vertical scroll
   * and confuses nobody.
   */
  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    rail.addEventListener('scroll', readEdges, { passive: true });
    window.addEventListener('resize', readEdges);
    readEdges();

    return () => {
      rail.removeEventListener('scroll', readEdges);
      window.removeEventListener('resize', readEdges);
      window.clearTimeout(settleRef.current);
    };
  }, [readEdges]);

  /*
   * Drag-to-scroll, TOUCH ONLY.
   *
   * On mobile this is the whole navigation: the arrows are hidden below 768px, so swiping the
   * rail is the only way through the projects and it MUST stay.
   *
   * On a pointer device it goes, for the same reason the wheel capture did. A mouse drag across
   * the rail is not a gesture anyone means as "scroll sideways", and once the arrows are the
   * stated navigation, a second hidden way to move the rail only muddies it.
   */
  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    if (!window.matchMedia('(pointer: coarse)').matches) return;

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
      <div ref={riseRef} className={styles.rise}>
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

        <ButtonLink className={styles.viewAll} variant="outline" href="/projetos" small>
          {t(copy.viewAll)}
        </ButtonLink>
      </Reveal>
      </div>
    </section>
  );
}
