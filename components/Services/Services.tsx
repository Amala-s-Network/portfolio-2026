'use client';

import { useRef } from 'react';
import { Reveal } from '@/components/Reveal/Reveal';
import { useReveal } from '@/hooks/useReveal';
import { useLanguage } from '@/lib/language';
import { services as copy } from '@/content/copy';
import styles from './Services.module.css';

/**
 * What João can be hired to do, between "Sobre mim" and the results band.
 *
 * The placement is the argument. It follows who he is and precedes what the work moved, so a
 * reader arrives at the numbers already knowing what they would be buying — and a reader who
 * skips the numbers has still passed the offer. Putting it after the results would have made it
 * a footnote to them.
 */
export function Services() {
  const { lang, t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const revealed = useReveal(sectionRef);

  return (
    <section ref={sectionRef} className={styles.section} id="servicos">
      <Reveal on={revealed} order={0}>
        <span className={styles.kicker}>
          <span className={styles.diamond} aria-hidden="true" />
          {t(copy.kicker)}
        </span>
      </Reveal>

      <Reveal on={revealed} order={1}>
        <h2 className={styles.heading}>{t(copy.heading)}</h2>
      </Reveal>

      <Reveal on={revealed} order={2}>
        <p className={styles.intro}>{t(copy.intro)}</p>
      </Reveal>

      <ol className={styles.list}>
        {copy.items.map((item, i) => (
          <Reveal key={i} on={revealed} order={i + 3} as="li" className={styles.item}>
            {/* Numbered because it is a list of four things, and a reader should feel the four. */}
            <span className={styles.number} aria-hidden="true">
              {String(i + 1).padStart(2, '0')}
            </span>
            <h3 className={styles.title}>{item.title[lang]}</h3>
            <p className={styles.body}>{item.body[lang]}</p>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}
