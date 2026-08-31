'use client';

import { useRef } from 'react';
import { useOverlay } from '@/hooks/useOverlay';
import { useLanguage } from '@/lib/language';
import { inProduction as copy } from '@/content/copy';
import styles from './InProduction.module.css';

/**
 * The notice on a case João cannot publish.
 *
 * Itaú and EMS are both under NDA, so the panel is still clickable and what it opens is the
 * honest sentence rather than a page with the work taken out of it. Saying so is not a dead end:
 * the work exists, it can be walked through in a call, and the button is that offer.
 *
 * The two ways out do DIFFERENT things now. The button goes on — it opens the contact modal,
 * because the notice asks the reader to get in touch and a button that only said "got it" would
 * leave them to find that themselves. The X and the scrim are still the way out for anyone who
 * was only curious.
 */
export function InProduction({
  open,
  onClose,
  onContact,
}: {
  open: boolean;
  onClose: () => void;
  onContact?: () => void;
}) {
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

        <button
          type="button"
          className={styles.confirm}
          /*
           * Close first, open the next one AFTER that has committed.
           *
           * Both overlays use useOverlay, whose teardown hands focus back to whatever opened it
           * and restores the body's overflow. Opening the contact modal in the same commit puts
           * those two teardowns and two setups in a race: focus lands back on the case panel
           * instead of in the form, and whichever scroll-lock cleanup runs last wins. A macrotask
           * apart, they simply happen in order.
           */
          onClick={() => {
            onClose();
            if (onContact) window.setTimeout(onContact, 0);
          }}
        >
          {t(copy.confirm)}
        </button>
      </div>
    </div>
  );
}
