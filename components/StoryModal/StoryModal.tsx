'use client';

import { useEffect, useRef, useState } from 'react';
import { useOverlay } from '@/hooks/useOverlay';
import { useLanguage } from '@/lib/language';
import { story as copy } from '@/content/copy';
import styles from './StoryModal.module.css';

type StoryModalProps = {
  open: boolean;
  onClose: () => void;
};

/**
 * The story behind the portrait, set as a newspaper that turns sideways.
 *
 * The rest of the site scrolls; this one does not. That is the point of it being a modal at all
 * — it is a different object, held in the hands rather than travelled through, and turning it
 * horizontally is what makes the difference legible before a word is read.
 */
export function StoryModal({ open, onClose }: StoryModalProps) {
  const { lang, t } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(0);

  const pages = copy.pages[lang];
  const last = pages.length - 1;

  useOverlay(ref, open, onClose, { lockScroll: true });

  /* Every opening starts at page one. Reopening on page two is a state nobody asked to resume. */
  useEffect(() => {
    if (open) setPage(0);
  }, [open]);

  /*
   * Left and right arrows turn the page.
   *
   * The overlay hook owns Escape; this is only the pager. Bound while open and to the document,
   * because the reader's focus could legitimately be on the close button or on nothing at all,
   * and a page-turner that only answers when a particular element is focused is a page-turner
   * that appears broken.
   */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') setPage((p) => Math.min(last, p + 1));
      if (e.key === 'ArrowLeft') setPage((p) => Math.max(0, p - 1));
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, last]);

  return (
    <div
      ref={ref}
      className={`${styles.root} ${open ? styles.open : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label={t({ pt: 'Minha história', en: 'My story' })}
      aria-hidden={!open}
    >
      <div className={styles.stage}>
        {/* Close sits on the card's own top-right corner, which is where a modal's close lives. */}
        <button type="button" className={styles.close} onClick={onClose} aria-label={t(copy.close)}>
          <span aria-hidden="true">✕</span>
        </button>

        <div className={styles.viewport}>
          <div className={styles.track} style={{ '--page': page } as React.CSSProperties}>
            {pages.map((p, i) => (
              <article
                key={i}
                className={styles.page}
                /* Only the page in view is reachable — the others are off-screen, not hidden. */
                aria-hidden={i !== page}
                {...(i !== page ? { inert: '' as unknown as boolean } : {})}
              >
                <p className={styles.folio}>{p.folio}</p>
                <h2 className={styles.title}>{p.title}</h2>
                <p className={styles.lead}>{p.lead}</p>

                <div className={styles.body}>
                  {p.body.map((para, j) => (
                    <p key={j}>{para}</p>
                  ))}
                </div>

                <p className={styles.aside}>{p.aside}</p>
              </article>
            ))}
          </div>
        </div>

        <div className={styles.pager}>
          <button
            type="button"
            className={styles.pageButton}
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            aria-label={t(copy.previous)}
          >
            <span aria-hidden="true">⇠</span>
          </button>

          <span className={styles.count} aria-live="polite">
            {page + 1} / {pages.length}
          </span>

          <button
            type="button"
            className={styles.pageButton}
            onClick={() => setPage((p) => Math.min(last, p + 1))}
            disabled={page === last}
            aria-label={t(copy.next)}
          >
            <span aria-hidden="true">⇢</span>
          </button>
        </div>
      </div>
    </div>
  );
}
