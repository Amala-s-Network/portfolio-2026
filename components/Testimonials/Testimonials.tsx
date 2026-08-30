'use client';

import { useEffect, useRef, useState } from 'react';
import { Reveal } from '@/components/Reveal/Reveal';
import { useReveal } from '@/hooks/useReveal';
import { useLanguage } from '@/lib/language';
import { testimonials as copy } from '@/content/copy';
import styles from './Testimonials.module.css';

/**
 * What people who worked with him say, on one moving row.
 *
 * Eight cards of the same size, travelling in one direction. The argument in this section is the
 * volume — design, engineering, data and management saying the same kinds of things unprompted —
 * so several are on screen at once rather than one at a time.
 *
 * The row is its content twice over. The track slides by half its own width and loops, so the
 * second copy is always arriving where the first one leaves; there is no jump to hide because
 * nothing ever ends.
 */
export function Testimonials() {
  const { t } = useLanguage();
  const ref = useRef<HTMLElement>(null);
  const shown = useReveal(ref);
  const [running, setRunning] = useState(true);

  /*
   * Reduced motion stops it outright, read here rather than in CSS alone: the control below has
   * to agree with what the page is actually doing, and a pause button that says "pause" over
   * something already still is a lie.
   */
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) setRunning(false);
  }, []);

  /*
   * One row, at João's instruction.
   *
   * The eight run in a single track rather than two counter-running ones. It reads calmer, and
   * with every card the same size the row has a steady beat instead of a ragged edge.
   */
  const row = copy.items;

  return (
    <section ref={ref} id="pessoas" className={styles.root}>
      <div className={styles.head}>
        <Reveal on={shown} order={0} as="h2" className={styles.heading}>
          {t(copy.heading)}
        </Reveal>

        {/*
          * A real control, not just pause-on-hover.
          *
          * WCAG 2.2.2 asks for a way to stop anything that moves for more than five seconds, and
          * hover is not a mechanism a keyboard or a touch reader has. This is that mechanism.
          */}
        <button
          type="button"
          className={styles.toggle}
          onClick={() => setRunning((r) => !r)}
          aria-pressed={!running}
        >
          <span className={running ? styles.iconPause : styles.iconPlay} aria-hidden="true" />
          {running ? t(copy.pause) : t(copy.play)}
        </button>
      </div>

      <Reveal on={shown} order={1} className={styles.wall}>
        <div className={styles.row} data-running={running ? 'true' : 'false'}>
          {/*
            * The row twice. The second copy is hidden from assistive tech: a screen reader
            * reading eight recommendations sixteen times is the cost of a visual loop, and it
            * should not have to pay it.
            */}
          {[0, 1].map((copyIndex) => (
            <div key={copyIndex} className={styles.track} aria-hidden={copyIndex === 1}>
              {row.map((item) => (
                <figure key={item.name} className={styles.card}>
                  {/*
                    * The quote area is a fixed box that fades at its foot rather than cutting.
                    * Every card is the same size, and these run from ninety words to a hundred
                    * and fifty — so the longest ones dissolve at the bottom edge instead of
                    * stopping mid-letter. The full text stays in the DOM either way.
                    */}
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
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
