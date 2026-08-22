'use client';

import { useRef } from 'react';
import { Reveal } from '@/components/Reveal/Reveal';
import { useReveal } from '@/hooks/useReveal';
import { useLanguage } from '@/lib/language';
import { metrics as copy } from '@/content/copy';
import styles from './Metrics.module.css';

export function Metrics() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const revealed = useReveal(sectionRef);

  return (
    <section ref={sectionRef} className={styles.section}>
      <Reveal on={revealed} order={0}>
        <span className={styles.kicker}>
          <span className={styles.diamond} aria-hidden="true" />
          {t(copy.kicker)}
        </span>
      </Reveal>

      <Reveal on={revealed} order={1}>
        <p className={styles.subhead}>{t(copy.subhead)}</p>
      </Reveal>

      <Reveal on={revealed} order={2} className={styles.grid}>
        {copy.items.map((m, i) => (
          <div key={i} className={styles.cell}>
            <span className={styles.label}>{t(m.label)}</span>
            <span className={styles.value}>{m.value}</span>
            <span className={styles.note}>{t(m.note)}</span>
          </div>
        ))}
      </Reveal>
    </section>
  );
}
