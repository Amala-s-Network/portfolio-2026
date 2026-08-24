'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useOverlay } from '@/hooks/useOverlay';
import { useLanguage } from '@/lib/language';
import { craftGate as copy } from '@/content/copy';
import styles from './CraftGate.module.css';

type CraftGateProps = {
  open: boolean;
  onClose: () => void;
};

/**
 * The door between the portfolio and the craft side, in the other identity.
 *
 * It arrives in a visual language the reader has not seen on this site, and that is the entire
 * job of it: the two halves want different things from them. The portfolio is an argument for
 * hiring him and every number in it is real; the craft side is work made for its own sake, with
 * invented briefs. Walking from one into the other with no warning would read as the site losing
 * its mind — so the door announces which room is which and lets them decline.
 *
 * The interaction grammar is NieR's own: a list where the FOCUSED row inverts, dark on light
 * becoming light on dark. That is not decoration copied off a screenshot, it is the one gesture
 * that menu is built on, and reproducing it is what makes the reference read as a tribute rather
 * than as a palette swap.
 */
export function CraftGate({ open, onClose }: CraftGateProps) {
  const { lang, t } = useLanguage();
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);

  /*
   * Which row is armed. Mirrors the game, where a menu always has exactly one selection and the
   * arrow keys move it — the pointer just moves it too.
   */
  const [armed, setArmed] = useState<'confirm' | 'cancel'>('cancel');

  useOverlay(ref, open, onClose, { lockScroll: true });

  /* Reopening always starts on "remain": the safe answer is the default one. */
  useEffect(() => {
    if (open) setArmed('cancel');
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        setArmed((a) => (a === 'confirm' ? 'cancel' : 'confirm'));
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const proceed = () => {
    onClose();
    router.push('/craft');
  };

  return (
    <div
      ref={ref}
      className={`${styles.root} ${open ? styles.open : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label={t(copy.heading)}
      aria-hidden={!open}
    >
      <div className={styles.panel}>
        {/* The dotted rules the game frames every screen with. */}
        <div className={styles.dots} aria-hidden="true" />

        <div className={styles.head}>
          <span className={styles.system}>{t(copy.system)}</span>
          <h2 className={styles.heading}>{t(copy.heading)}</h2>
        </div>

        <div className={styles.body}>
          {copy.body[lang].map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>

        <div className={styles.choices}>
          <button
            type="button"
            className={`${styles.choice} ${armed === 'confirm' ? styles.armed : ''}`}
            onMouseEnter={() => setArmed('confirm')}
            onFocus={() => setArmed('confirm')}
            onClick={proceed}
          >
            <span className={styles.mark} aria-hidden="true" />
            {t(copy.confirm)}
          </button>

          <button
            type="button"
            className={`${styles.choice} ${armed === 'cancel' ? styles.armed : ''}`}
            onMouseEnter={() => setArmed('cancel')}
            onFocus={() => setArmed('cancel')}
            onClick={onClose}
          >
            <span className={styles.mark} aria-hidden="true" />
            {t(copy.cancel)}
          </button>
        </div>

        {/*
          * The credit sits on the screen that does the borrowing, not in a footer nobody reaches.
          * It is the claim the whole thing rests on.
          */}
        <div className={styles.foot}>
          <p className={styles.credit}>{t(copy.credit)}</p>
          <span className={styles.hint}>{t(copy.hint)}</span>
        </div>

        <div className={styles.dots} aria-hidden="true" />
      </div>
    </div>
  );
}
