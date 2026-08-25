'use client';

import { useEffect, useRef, useState } from 'react';
import { useReveal } from '@/hooks/useReveal';
import { useLanguage } from '@/lib/language';
import { casePage, type CaseChart as ChartData } from '@/content/copy';
import styles from './CaseChart.module.css';

/**
 * The series behind a case's headline number, drawn rather than pasted in as a picture.
 *
 * João sent the first of these as a slide screenshot. A screenshot would have been the fast
 * answer and the wrong one: it arrives wearing another company's typography, blurs on any
 * display denser than the capture, and reads to a screen reader as nothing whatsoever. Drawn
 * from the figures, the same months take this page's own ink, stay sharp at any zoom, and let
 * the reader check the fall against the bars instead of taking it on faith from a picture.
 *
 * Three things make it a chart rather than five rectangles:
 *
 *   the reference line   a dashed rule at the starting value, so the drop is measurable against
 *                        where it began rather than only against the bar beside it
 *   the drop bracket     on the final column, spanning the gap between that line and the last
 *                        bar — the distance the case is actually about
 *   the readout          one line under the plot that answers "which one am I looking at",
 *                        because a number on a bar cannot also carry its month and its unit
 *
 * The columns are buttons. Hovering picks one, so does focus, and the arrow keys walk the
 * series — which means the chart is explorable with a keyboard and each bar announces itself,
 * rather than being a picture with a table hidden behind it.
 */
export function CaseChart({ data }: { data: ChartData }) {
  const { t } = useLanguage();
  const ref = useRef<HTMLElement>(null);
  const shown = useReveal(ref);

  const points = data.points;
  const lastIndex = points.length - 1;

  /* Opens on the last point: the one the headline number is quoted from. */
  const [active, setActive] = useState(lastIndex);
  const btns = useRef<(HTMLButtonElement | null)[]>([]);

  /*
   * Scaled against headroom above the tallest bar, because the figures ride on top of the bars
   * and the tallest one needs somewhere to put its number.
   *
   * Zero is the baseline, deliberately. A chart of 1893 to 2395 on a truncated axis would make a
   * 21% fall look like a collapse, and on a page whose whole argument is that the numbers are
   * real, an axis that flatters them is the one thing that cannot happen.
   */
  const peak = Math.max(...points.map((p) => p.value)) * 1.2;
  const pct = (v: number) => (v / peak) * 100;

  const first = points[0].value;
  const last = points[lastIndex].value;

  /*
   * Stated when the bars summarise something wider than themselves, computed otherwise. INK's
   * tickets were measured as two ranges, so its bars are midpoints and dividing them would put
   * 89% on screen beside João's 87%; Itaú's bars ARE the monthly figures, so there the chart
   * does the division, which is most of the reason for drawing it at all.
   */
  const fall = Math.round(((first - last) / first) * 100);
  const delta = data.delta ?? `−${fall}%`;

  /*
   * Stepped from the column the key actually happened on, rather than from `active`.
   *
   * Reading state here looks equivalent and is not: the handler closes over the value from its
   * own render, so two keypresses landing before React re-renders would both compute from the
   * same starting index and the selection would move one step for two presses. The index of the
   * button that received the event cannot go stale.
   */
  const move = (from: number, dir: 1 | -1) => {
    const next = Math.min(lastIndex, Math.max(0, from + dir));
    setActive(next);
    btns.current[next]?.focus();
  };

  /*
   * Re-anchor when the series changes length. Without this, switching to a shorter chart leaves
   * `active` pointing past the end and the readout reads undefined.
   */
  useEffect(() => {
    setActive(points.length - 1);
  }, [points.length]);

  const current = points[Math.min(active, lastIndex)];
  const currentName = current.full ? t(current.full) : current.label;
  const drop = Math.round(((first - current.value) / first) * 100);

  /*
   * The readout must not do arithmetic the chart has already refused to do.
   *
   * When `delta` is stated, the bars are summaries of something wider and dividing them is
   * unreliable — INK's midpoints give 88% against the 87% João measured. Printing the computed
   * figure here would have put the chart in disagreement with its own headline one line below
   * it, which is the exact failure the stated delta exists to prevent. So: stated series quote
   * the measured figure, computed series divide.
   */
  const relative =
    active === 0
      ? t(casePage.chart.start)
      : data.delta
        ? data.delta
        : `${Math.abs(drop)}% ${drop >= 0 ? t(casePage.chart.below) : t(casePage.chart.above)}`;

  return (
    <figure ref={ref} className={styles.root}>
      <figcaption className={styles.head}>
        <span className={styles.title}>{t(data.title)}</span>
        <span className={styles.delta}>{delta}</span>
      </figcaption>

      <div className={styles.plot}>
        {/*
          * The starting value, held across the whole plot. Everything to the right of the first
          * column is read against this line, which is what turns a row of bars into a fall.
          */}
        <span
          className={`${styles.refLine} ${shown ? styles.on : ''}`}
          style={{ bottom: `${pct(first)}%` }}
          aria-hidden="true"
        >
          <span className={styles.refTag}>{first.toLocaleString('pt-BR')}</span>
        </span>

        <div className={styles.cols}>
          {points.map((p, i) => {
            const h = pct(p.value);
            const isActive = i === active;
            const name = p.full ? t(p.full) : p.label;

            return (
              <button
                key={p.label}
                type="button"
                ref={(el) => {
                  btns.current[i] = el;
                }}
                className={`${styles.col} ${isActive ? styles.colOn : ''}`}
                /* The bar says its own name, value and unit, so no parallel table is needed. */
                aria-label={`${name}: ${p.value.toLocaleString('pt-BR')} ${t(data.unit)}`}
                aria-pressed={isActive}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                    e.preventDefault();
                    move(i, 1);
                  }
                  if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
                    e.preventDefault();
                    move(i, -1);
                  }
                }}
              >
                <span
                  className={`${styles.value} ${shown ? styles.on : ''}`}
                  style={{ bottom: `${h}%`, ['--delay' as string]: `${i * 90}ms` }}
                  aria-hidden="true"
                >
                  {p.value.toLocaleString('pt-BR')}
                </span>

                {/*
                  * The gap between where it started and where it ended, drawn on the last column
                  * only. It is the distance the case is about, and until it was on screen the
                  * reader had to eyeball it between two bars at opposite ends of the plot.
                  */}
                {i === lastIndex && pct(first) > h + 2 && (
                  <span
                    className={`${styles.drop} ${shown ? styles.on : ''}`}
                    style={{ bottom: `${h}%`, height: `${pct(first) - h}%` }}
                    aria-hidden="true"
                  >
                    <span className={styles.dropTag}>{delta}</span>
                  </span>
                )}

                <span
                  className={`${styles.bar} ${shown ? styles.on : ''}`}
                  style={{
                    /*
                     * Height as a custom property, growth as `transform: scaleY()`. The
                     * compositor animates a transform without laying the page out again;
                     * animating `height` on five bars at once is the standard way to make a
                     * chart stutter on a laptop.
                     */
                    height: `${h}%`,
                    ['--delay' as string]: `${i * 90}ms`,
                  }}
                  aria-hidden="true"
                />
              </button>
            );
          })}
        </div>

        <span className={`${styles.axis} ${shown ? styles.on : ''}`} aria-hidden="true" />
      </div>

      <div className={styles.labels} aria-hidden="true">
        {points.map((p, i) => (
          <span key={p.label} className={`${styles.label} ${i === active ? styles.labelOn : ''}`}>
            {p.label}
          </span>
        ))}
      </div>

      {/*
        * Not aria-live. Every column already announces its own name, value and unit when focused,
        * so making this live would say each figure twice to anyone stepping through with a
        * keyboard. It exists for the reader who is hovering.
        */}
      <p className={styles.readout} aria-hidden="true">
        <span className={styles.readoutName}>{currentName}</span>
        <span className={styles.readoutValue}>
          {current.value.toLocaleString('pt-BR')} {t(data.unit)}
        </span>
        <span className={styles.readoutRel}>{relative}</span>
      </p>

      <p className={styles.note}>
        {t(data.note)} <span className={styles.hint}>{t(casePage.chart.hint)}</span>
      </p>
    </figure>
  );
}
