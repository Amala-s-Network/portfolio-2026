'use client';

import { useRef } from 'react';
import { useReveal } from '@/hooks/useReveal';
import { useLanguage } from '@/lib/language';
import { casePage, type CaseChart as ChartData } from '@/content/copy';
import styles from './CaseChart.module.css';

/**
 * The series behind a case's headline number.
 *
 * João sent this one as a slide screenshot. A screenshot would have been the fast answer and the
 * wrong one: it arrives wearing another company's typography, blurs on any display denser than
 * the capture, and reads to a screen reader as nothing whatsoever. Drawn from the figures, the
 * same five months take this page's own ink, stay sharp at any zoom, and — the part that counts
 * on a page arguing for someone's judgement — let the reader check the −21% against the bars
 * instead of taking it on faith from a picture.
 *
 * The bars are divs rather than SVG on purpose. Everything here is a rectangle in a row, which
 * is what flexbox already is; SVG would mean hand-computing every coordinate and re-computing it
 * at each breakpoint, in exchange for nothing this chart needs.
 */
export function CaseChart({ data }: { data: ChartData }) {
  const { t } = useLanguage();
  const ref = useRef<HTMLElement>(null);
  const shown = useReveal(ref);

  /*
   * Scaled against headroom above the tallest bar, not against the tallest bar itself: the
   * figures ride on top of the bars, so the tallest one needs somewhere to put its number.
   *
   * Zero is the baseline, deliberately. A chart of 1893–2395 with a truncated axis would make a
   * 21% fall look like a collapse, and on a page whose whole argument is that the numbers are
   * real, an axis that flatters them is the one thing that cannot happen.
   */
  const peak = Math.max(...data.points.map((p) => p.value)) * 1.2;

  const first = data.points[0].value;
  const last = data.points[data.points.length - 1].value;
  const fall = Math.round(((first - last) / first) * 100);

  return (
    <figure ref={ref} className={styles.root}>
      <figcaption className={styles.head}>
        <span className={styles.title}>{t(data.title)}</span>
        <span className={styles.delta}>−{fall}%</span>
      </figcaption>

      {/*
        * The visual is decoration on top of the table below it — the numbers are already in the
        * DOM as a real <table>, so announcing the bars too would read every figure twice.
        */}
      <div className={styles.plot} aria-hidden="true">
        {data.points.map((p, i) => (
          <div key={p.label} className={styles.column}>
            {/*
              * The bar and its figure share a track of their own rather than being three
              * siblings in the column.
              *
              * The first version made them siblings, and the flex container quietly shrank the
              * four tallest bars to an identical height to fit them beside the labels — five
              * different numbers drawn as four identical bars and one short one. A chart that
              * misreports its own data is worse than no chart, and it looked plausible. Inside
              * a track of its own, the bar is positioned against a resolved height and shrinks
              * against nothing.
              */}
            <div className={styles.track}>
              <span
                className={`${styles.value} ${shown ? styles.on : ''}`}
                style={{
                  ['--h' as string]: `${(p.value / peak) * 100}%`,
                  ['--delay' as string]: `${i * 90}ms`,
                }}
              >
                {p.value.toLocaleString('pt-BR')}
              </span>

              <div
                className={`${styles.bar} ${shown ? styles.on : ''}`}
                style={{
                  /*
                   * Height as a custom property, growth as `transform: scaleY()`. The compositor
                   * animates a transform without laying the page out again; animating `height`
                   * on five bars at once is the standard way to make a chart stutter on a
                   * laptop.
                   */
                  ['--h' as string]: `${(p.value / peak) * 100}%`,
                  ['--delay' as string]: `${i * 90}ms`,
                }}
              />
            </div>

            <span className={styles.label}>{p.label}</span>
          </div>
        ))}
      </div>

      {/*
        * The same five figures as a table, off-screen. This is what a screen reader reads, and
        * it is also the honest version: a bar chart is a way of looking at numbers, not a
        * replacement for them.
        */}
      <table className={styles.sr}>
        <caption>{t(data.title)}</caption>
        <thead>
          <tr>
            <th scope="col">{t(casePage.chart.period)}</th>
            <th scope="col">{t(casePage.chart.amount)}</th>
          </tr>
        </thead>
        <tbody>
          {data.points.map((p) => (
            <tr key={p.label}>
              <th scope="row">{p.label}</th>
              <td>{p.value.toLocaleString('pt-BR')}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className={styles.note}>{t(data.note)}</p>
    </figure>
  );
}
