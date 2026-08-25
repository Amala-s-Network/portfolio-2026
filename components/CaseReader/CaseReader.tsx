'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/lib/language';
import { casePage as copy } from '@/content/copy';
import styles from './CaseReader.module.css';

export type ReaderPage = {
  id: string;
  label: string;
  node: React.ReactNode;
  /**
   * A spread that runs on ink instead of paper.
   *
   * Carried here rather than set by the page's own content because the colour has to reach the
   * whole sheet, edge to edge. A dark block inside a padded sheet is a card sitting on paper,
   * which is a different thing from a band the reader turns onto.
   */
  tone?: 'dark';
};

const TURN_MS = 760;
/* A trackpad fires dozens of wheel events per flick; one turn per gesture, not per event. */
const WHEEL_THRESHOLD = 42;
const SWIPE_THRESHOLD = 56;

/**
 * A case, read sideways.
 *
 * João asked for a newspaper, and a newspaper is turned rather than scrolled. Each spread is one
 * screen; the whole case is a horizontal track that slides one spread at a time, driven by the
 * arrow keys, the wheel, a swipe, the controls at the foot, or the index.
 *
 * Three things stay put while the pages move: the way out, the index, and the progress. That is
 * the point of a fixed frame — the reader can leave, jump or see where they are from any spread,
 * without having to find their way back to a control that scrolled off.
 *
 * The document itself does not scroll. The reader is a fixed box under the nav, so there is no
 * page height to scroll and no scrollbar; everything that moves does so inside it.
 */
export function CaseReader({
  pages,
  backHref,
  backLabel,
  folio,
}: {
  pages: ReaderPage[];
  backHref: string;
  backLabel: string;
  folio: React.ReactNode;
}) {
  const { t } = useLanguage();
  const [index, setIndex] = useState(0);
  const [tocOpen, setTocOpen] = useState(false);

  /*
   * Below this the piece is read the way everything else on the site is: top to bottom.
   *
   * A phone is not a broadsheet. Turned sideways, a chapter either shrinks to unreadable type or
   * scrolls inside a page the reader is being told to swipe — two gestures on two axes for one
   * piece of text. Read after mount rather than during render, because the server has no viewport
   * and a layout that changes on hydration is a jump on the first frame.
   */
  const [sideways, setSideways] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 901px)');
    const sync = () => setSideways(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  const turning = useRef(false);
  const wheelAcc = useRef(0);
  const touchX = useRef<number | null>(null);
  const touchY = useRef<number | null>(null);
  const root = useRef<HTMLDivElement>(null);

  const count = pages.length;

  const go = useCallback(
    (next: number) => {
      const clamped = Math.min(count - 1, Math.max(0, next));
      setIndex((current) => {
        if (clamped === current) return current;
        turning.current = true;
        /*
         * Released by a timer rather than by transitionend. transitionend does not fire when the
         * transition is cancelled, when the tab is in the background, or under reduced motion
         * where the duration is zero — and a latch that never releases leaves the reader stuck on
         * one spread with no way out but a reload.
         */
        window.setTimeout(() => {
          turning.current = false;
        }, TURN_MS);
        return clamped;
      });
    },
    [count],
  );

  /* Keys. Left and right are the spread; Home and End are the ends of the piece. */
  useEffect(() => {
    if (!sideways) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;

      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        e.preventDefault();
        if (!turning.current) go(indexRef.current + 1);
      }
      if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        if (!turning.current) go(indexRef.current - 1);
      }
      if (e.key === 'Home') {
        e.preventDefault();
        go(0);
      }
      if (e.key === 'End') {
        e.preventDefault();
        go(count - 1);
      }
      if (e.key === 'Escape') setTocOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [go, count, sideways]);

  /*
   * The handlers above are bound once and would otherwise close over the first value of `index`
   * forever. A ref carries the live one for them to read.
   */
  const indexRef = useRef(0);
  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  /* Wheel and trackpad. Either axis turns the page, because a mouse only has one. */
  useEffect(() => {
    const el = root.current;
    if (!el || !sideways) return;

    const onWheel = (e: WheelEvent) => {
      /* A page whose content is taller than the spread scrolls itself first. */
      const scroller = (e.target as HTMLElement)?.closest?.(`.${styles.sheetScroll}`);
      if (scroller && scroller.scrollHeight > scroller.clientHeight + 2) {
        const atTop = scroller.scrollTop <= 0;
        const atEnd = scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 2;
        if (!(atTop && e.deltaY < 0) && !(atEnd && e.deltaY > 0)) return;
      }

      e.preventDefault();
      if (turning.current) return;

      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      wheelAcc.current += delta;

      if (Math.abs(wheelAcc.current) >= WHEEL_THRESHOLD) {
        go(indexRef.current + (wheelAcc.current > 0 ? 1 : -1));
        wheelAcc.current = 0;
      }
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [go, sideways]);

  /* Swipe. */
  useEffect(() => {
    const el = root.current;
    if (!el || !sideways) return;

    const start = (e: TouchEvent) => {
      touchX.current = e.touches[0]?.clientX ?? null;
      touchY.current = e.touches[0]?.clientY ?? null;
    };
    const end = (e: TouchEvent) => {
      if (touchX.current === null || touchY.current === null) return;
      const dx = (e.changedTouches[0]?.clientX ?? touchX.current) - touchX.current;
      const dy = (e.changedTouches[0]?.clientY ?? touchY.current) - touchY.current;
      touchX.current = null;
      touchY.current = null;
      if (Math.abs(dx) < SWIPE_THRESHOLD || turning.current) return;
      /*
       * The gesture has to be decidedly sideways.
       *
       * On a phone a spread taller than the screen scrolls inside itself, and nobody drags a
       * thumb in a straight line — without this, reading down a long chapter turns the page every
       * time the finger wanders 56px off true.
       */
      if (Math.abs(dx) < Math.abs(dy) * 1.5) return;
      go(indexRef.current + (dx < 0 ? 1 : -1));
    };

    el.addEventListener('touchstart', start, { passive: true });
    el.addEventListener('touchend', end, { passive: true });
    return () => {
      el.removeEventListener('touchstart', start);
      el.removeEventListener('touchend', end);
    };
  }, [go, sideways]);

  /*
   * The reader owns the viewport while it is mounted, so the document behind it must not scroll.
   * Restored on unmount, which matters because the home page underneath very much does scroll.
   */
  useEffect(() => {
    if (!sideways) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [sideways]);

  const current = pages[index];

  return (
    <div className={styles.root} ref={root}>
      {/* ---- the frame that does not move ---- */}

      <Link className={styles.back} href={backHref}>
        <span className={styles.backArrow} aria-hidden="true">⇠</span>
        {backLabel}
      </Link>

      <div className={styles.folio}>{folio}</div>

      <button
        type="button"
        className={styles.tocButton}
        onClick={() => setTocOpen((v) => !v)}
        aria-expanded={tocOpen}
        aria-controls="case-toc"
      >
        <span className={styles.tocBars} aria-hidden="true" />
        {t(copy.toc.label)}
      </button>

      {/* ---- the pages ---- */}

      <div
        className={styles.track}
        style={{ ['--i' as string]: index }}
        /*
         * The whole track is one region that changes; announcing each spread as it arrives is the
         * only way a screen-reader user knows the turn happened at all.
         */
        aria-live="polite"
      >
        {pages.map((p, i) => (
          <section
            key={p.id}
            id={p.id}
            className={`${styles.sheet} ${!sideways || i === index ? styles.on : ''} ${p.tone === 'dark' ? styles.dark : ''}`}
            aria-label={`${i + 1}. ${p.label}`}
            aria-hidden={sideways && i !== index}
            /* Only sideways, where the other spreads are genuinely off screen. */
            inert={sideways && i !== index ? true : undefined}
          >
            <div className={styles.sheetScroll}>
              <div className={styles.sheetInner}>{p.node}</div>
            </div>
          </section>
        ))}
      </div>

      {/* ---- the index, over the page, reachable from every spread ---- */}

      <div
        id="case-toc"
        className={`${styles.toc} ${tocOpen ? styles.tocOn : ''}`}
        aria-hidden={!tocOpen}
        inert={!tocOpen ? true : undefined}
      >
        <p className={styles.tocHead}>{t(copy.toc.label)}</p>
        <ol className={styles.tocList}>
          {pages.map((p, i) => (
            <li key={p.id}>
              <button
                type="button"
                className={`${styles.tocLink} ${i === index ? styles.tocOnItem : ''}`}
                aria-current={i === index ? 'true' : undefined}
                onClick={() => {
                  go(i);
                  setTocOpen(false);
                }}
              >
                <span className={styles.tocNum}>{String(i + 1).padStart(2, '0')}</span>
                <span className={styles.tocLabel}>{p.label}</span>
                <span className={styles.tocMark} aria-hidden="true">→</span>
              </button>
            </li>
          ))}
        </ol>
      </div>

      {tocOpen && (
        <button
          type="button"
          className={styles.scrim}
          onClick={() => setTocOpen(false)}
          aria-label={t(copy.toc.close)}
        />
      )}

      {/* ---- progress, at the foot ---- */}

      <div className={styles.progress}>
        <button
          type="button"
          className={styles.turn}
          onClick={() => go(index - 1)}
          disabled={index === 0}
          aria-label={t(copy.toc.previous)}
        >
          <span aria-hidden="true">←</span>
        </button>

        <div className={styles.rail} aria-hidden="true">
          <span
            className={styles.railFill}
            style={{ transform: `scaleX(${count > 1 ? index / (count - 1) : 1})` }}
          />
        </div>

        <span className={styles.count}>
          <span className={styles.countNow}>{String(index + 1).padStart(2, '0')}</span>
          <span className={styles.countOf}>/ {String(count).padStart(2, '0')}</span>
        </span>

        <span className={styles.here}>{current?.label}</span>

        <button
          type="button"
          className={styles.turn}
          onClick={() => go(index + 1)}
          disabled={index === count - 1}
          aria-label={t(copy.toc.next)}
        >
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </div>
  );
}
