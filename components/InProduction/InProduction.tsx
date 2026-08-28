'use client';

import { useRef } from 'react';
import { useOverlay } from '@/hooks/useOverlay';
import { useLanguage } from '@/lib/language';
import { inProduction as copy } from '@/content/copy';
import styles from './InProduction.module.css';

/**
 * The notice on a case whose screens are not ready.
 *
 * A written case with no pictures is worse than one that says "not yet" — the reader arrives
 * expecting the work and finds paragraphs. So the panel is still clickable, and what it opens is
 * an honest sentence rather than a half-finished page.
 *
 * Both ways out do the same thing, which is deliberate: the X is for the reader who has already
 * decided, and the button is for the one who read it. Nothing here is a decision, so nothing here
 * should look like one.
 */
export function InProduction({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);

  /* Escape, focus trap and focus return to the panel that opened it. */
  useOverlay(ref, open, onClose, { lockScroll: true });

  return (
    <div
      ref={ref}
      className={`${styles.root} ${open ? styles.on : ''}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="inprod-heading"
      aria-hidden={!open}
      inert={!open ? true : undefined}
    >
      <div className={styles.panel}>
        <button type="button" className={styles.close} onClick={onClose} aria-label={t(copy.close)}>
          <span aria-hidden="true">✕</span>
        </button>

        <p className={styles.mark} aria-hidden="true" />

        <h2 id="inprod-heading" className={styles.heading}>
          {t(copy.heading)}
        </h2>
        <p className={styles.body}>{t(copy.body)}</p>

        <button type="button" className={styles.confirm} onClick={onClose}>
          {t(copy.confirm)}
        </button>
      </div>
    </div>
  );
}
