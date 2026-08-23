'use client';

import { useRef } from 'react';
import { useOverlay } from '@/hooks/useOverlay';
import { useLanguage } from '@/lib/language';
import { modal as copy, contact, links } from '@/content/copy';
import styles from './ContactModal.module.css';

type ContactModalProps = {
  open: boolean;
  onClose: () => void;
};

export function ContactModal({ open, onClose }: ContactModalProps) {
  const { lang, t } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);

  // Focus trap, Escape, and focus return — CLAUDE.md flags all three as missing in the prototype.
  useOverlay(ref, open, onClose);

  const rows = [
    {
      key: 'email',
      variant: styles.filled,
      channel: t(copy.channels.email),
      value: links.email,
      href: `mailto:${links.email}`,
      external: false,
    },
    {
      key: 'whatsapp',
      variant: styles.outline,
      channel: t(copy.channels.whatsapp),
      value: links.phone,
      href: links.whatsapp,
      external: true,
    },
    {
      key: 'linkedin',
      variant: styles.outline,
      channel: t(copy.channels.linkedin),
      value: '/in/joaovmelo',
      href: links.linkedin,
      external: true,
    },
  ];

  return (
    <div
      ref={ref}
      className={`${styles.root} ${open ? styles.open : ''}`}
      aria-hidden={!open}
      role="dialog"
      aria-modal="true"
      aria-label={t(copy.heading)}
    >
      {/* A button rather than a div, so dismissing by backdrop is reachable without a pointer. */}
      <button
        type="button"
        className={styles.backdrop}
        onClick={onClose}
        tabIndex={-1}
        aria-hidden="true"
      />

      <div className={styles.card}>
        <div className={styles.folio}>
          <span>{t(contact.folioLeft)}</span>
          <button
            type="button"
            className={styles.close}
            onClick={onClose}
            aria-label={lang === 'pt' ? 'Fechar' : 'Close'}
          >
            <span aria-hidden="true">✕</span>
          </button>
        </div>

        <h2 className={styles.heading}>{t(copy.heading)}</h2>
        <p className={styles.line}>{t(copy.line)}</p>

        <div className={styles.rows}>
          {rows.map((r) => (
            <a
              key={r.key}
              className={`${styles.row} ${r.variant}`}
              href={r.href}
              {...(r.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            >
              <span className={styles.channel}>{r.channel}</span>
              <span className={styles.value}>{r.value}</span>
              <span className={styles.arrow} aria-hidden="true">
                ⇢
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
