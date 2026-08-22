'use client';

import { useLanguage } from '@/lib/language';
import { marquee as copy } from '@/content/copy';
import styles from './Marquee.module.css';

export function Marquee() {
  const { t } = useLanguage();
  const text = `${t(copy)}  `;

  return (
    <div className={styles.marquee} aria-hidden="true">
      <div className={styles.track}>
        {/* The duplicate is what makes the loop seamless — not decoration. */}
        <span className={styles.span}>{text}</span>
        <span className={styles.span}>{text}</span>
      </div>
    </div>
  );
}
