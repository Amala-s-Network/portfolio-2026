'use client';

import { useRef } from 'react';
import { Reveal } from '@/components/Reveal/Reveal';
import { useReveal } from '@/hooks/useReveal';
import { useLanguage } from '@/lib/language';
import { history as copy } from '@/content/copy';
import styles from './History.module.css';

export function History() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const revealed = useReveal(sectionRef);

  return (
    <section ref={sectionRef} className={styles.section}>
      <Reveal on={revealed} order={0}>
        <h2 className={styles.heading}>{t(copy.heading)}</h2>
      </Reveal>

      <Reveal on={revealed} order={1}>
        <p className={styles.intro}>{t(copy.intro)}</p>
      </Reveal>

      <Reveal on={revealed} order={2} className={styles.list}>
        {copy.companies.map((c) => (
          <div key={c.name} className={styles.row}>
            <div className={styles.head}>
              <h3 className={styles.name}>{c.name}</h3>
              {/* A plain year range reads the same in both languages; a phrase gets translated. */}
              <span className={styles.period}>
                {typeof c.period === 'string' ? c.period : t(c.period)}
              </span>
            </div>
            <p className={styles.description}>{t(c.description)}</p>
          </div>
        ))}
      </Reveal>
    </section>
  );
}
