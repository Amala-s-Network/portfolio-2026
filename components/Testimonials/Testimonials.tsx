'use client';

import { useRef } from 'react';
import { Reveal } from '@/components/Reveal/Reveal';
import { useReveal } from '@/hooks/useReveal';
import { useLanguage } from '@/lib/language';
import { testimonials as copy } from '@/content/copy';
import styles from './Testimonials.module.css';

/**
 * What people who worked with him say.
 *
 * Set as a wall of cards rather than as a carousel. A carousel shows one recommendation and hides
 * seven, and the point of eight of them is the eight — that this many people, across design,
 * engineering, data and management, said the same kinds of things unprompted.
 *
 * Every word is somebody else's, so every card carries the name, the role and how they know him.
 * A quotation without an attributable source is a testimonial, and a testimonial is marketing.
 */
export function Testimonials() {
  const { t } = useLanguage();
  const ref = useRef<HTMLElement>(null);
  const shown = useReveal(ref);

  return (
    <section ref={ref} id="pessoas" className={styles.root}>
      <Reveal on={shown} order={0} as="h2" className={styles.heading}>
        {t(copy.heading)}
      </Reveal>

      {/*
        * A masonry column layout rather than a grid: the recommendations are wildly different
        * lengths, and a grid would either stretch the short ones or leave a ragged bottom edge
        * under every row. Columns let each card be its own height and the wall stay dense.
        */}
      <Reveal on={shown} order={1} className={styles.wall}>
        {copy.items.map((item) => (
          <figure key={item.name} className={styles.card}>
            <blockquote className={styles.quote}>
              {item.quote.split('\n\n').map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </blockquote>

            <figcaption className={styles.who}>
              {item.photo ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img className={styles.face} src={item.photo} alt="" aria-hidden="true" />
              ) : (
                /* Initials, so a card with no photograph still has a mark where one goes. */
                <span className={styles.faceless} aria-hidden="true">
                  {item.name
                    .split(' ')
                    .slice(0, 2)
                    .map((w) => w[0])
                    .join('')}
                </span>
              )}

              <span className={styles.whoText}>
                <span className={styles.name}>{item.name}</span>
                <span className={styles.role}>{t(item.role)}</span>
                <span className={styles.relation}>{t(item.relation)}</span>
              </span>
            </figcaption>
          </figure>
        ))}
      </Reveal>
    </section>
  );
}
