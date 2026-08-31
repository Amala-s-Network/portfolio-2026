'use client';

import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/lib/language';
import { caseProto as copy, type CaseProtoSpec } from '@/content/copy';
import styles from './CaseProto.module.css';

const STEP_MS = 2600;

/**
 * The prototype, played back.
 *
 * Pulled out of Figma through the MCP: the flow map on that page is sixty frames across a board
 * twenty-one thousand pixels wide, and generating sixty screens as components would be a great
 * deal of code that nobody reads and nothing maintains. What the reader wants is the flow, so
 * what got built in code is the PLAYER — the frames are the designer's own, exported at source.
 *
 * It advances on its own because a prototype that needs to be clicked to prove it exists is a
 * prototype most readers never see. It stops the moment anyone touches it, because a thing that
 * keeps moving while you are trying to look at one step of it is worse than one that never moved.
 */
export function CaseProto({ spec }: { spec: CaseProtoSpec }) {
  const { t } = useLanguage();
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(true);
  const root = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);

  const steps = spec.steps;
  const count = steps.length;

  /*
   * Reduced motion never autoplays, and neither does a player that is off screen: a loop running
   * in a section nobody has scrolled to is work done for no one, on every device that has to do
   * it. Both are read here rather than in CSS because both decide whether a timer starts at all.
   */
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setReduced(true);
      setPlaying(false);
    }
  }, []);

  /*
   * The recording, when there is one: it plays instead of the frames, and the same control that
   * stepped them now starts and stops it. Under reduced motion the video is never mounted at all
   * and the frames stand in, because a still is the honest fallback for someone who asked for
   * less movement — not a video sitting there paused.
   */
  const clip = reduced ? undefined : spec.video;

  useEffect(() => {
    const el = video.current;
    if (!el) return;
    if (playing) el.play().catch(() => setPlaying(false));
    else el.pause();
  }, [playing, clip]);

  useEffect(() => {
    if (clip || !playing || count < 2) return;
    const el = root.current;

    const tick = () => {
      const seen = el ? el.getBoundingClientRect().top < window.innerHeight && el.getBoundingClientRect().bottom > 0 : true;
      if (seen) setI((n) => (n + 1) % count);
    };

    const id = window.setInterval(tick, STEP_MS);
    return () => window.clearInterval(id);
  }, [clip, playing, count]);

  const go = (n: number) => {
    setPlaying(false);
    setI(((n % count) + count) % count);
  };

  const current = steps[i];

  return (
    <section ref={root} className={styles.root} aria-label={t(copy.label)}>
      <div className={styles.head}>
        <p className={styles.kicker}>{t(copy.label)}</p>
        <h2 className={styles.heading}>{t(spec.heading)}</h2>
        <p className={styles.note}>{t(spec.note)}</p>
      </div>

      <div className={styles.stage}>
        {/*
          * Every frame is mounted and stacked; only the current one is opaque. Swapping a single
          * src would flash white on each step while the next image decodes — cross-fading between
          * two already-decoded layers is the difference between a prototype and a slideshow.
          */}
        <div className={styles.screen} data-clip={clip ? 'true' : undefined}>
          {clip ? (
            <video
              ref={video}
              className={styles.clip}
              src={clip.src}
              width={clip.width}
              height={clip.height}
              muted
              loop
              playsInline
              /* Metadata only: 5MB should not be fetched for a section nobody has reached. */
              preload="metadata"
              aria-label={t(spec.heading)}
            />
          ) : (
            steps.map((s, n) => (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                key={s.src}
                className={`${styles.frame} ${n === i ? styles.frameOn : ''}`}
                src={s.src}
                alt=""
                aria-hidden="true"
                loading={n === 0 ? 'eager' : 'lazy'}
              />
            ))
          )}
          <span className={styles.grain} aria-hidden="true" />
        </div>

        <div className={styles.rail}>
          {/*
           * Stepping controls only make sense over the frames. With the recording playing there
           * is nothing to step, so the dots and the arrows go and the eight labels stay as what
           * they always were underneath: the list of what the flow walks through.
           */}
          {clip ? (
            <ol className={styles.legend}>
              {steps.map((s, n) => (
                <li key={s.src}>
                  <span className={styles.stepNum}>{String(n + 1).padStart(2, '0')}</span>
                  {t(s.label)}
                </li>
              ))}
            </ol>
          ) : (
            <>
              <p className={styles.stepName} aria-live="polite">
                <span className={styles.stepNum}>
                  {String(i + 1).padStart(2, '0')}/{String(count).padStart(2, '0')}
                </span>
                {t(current.label)}
              </p>

              <ol className={styles.dots}>
                {steps.map((s, n) => (
                  <li key={s.src}>
                    <button
                      type="button"
                      className={`${styles.dot} ${n === i ? styles.dotOn : ''}`}
                      onClick={() => go(n)}
                      aria-current={n === i ? 'true' : undefined}
                      aria-label={`${n + 1}. ${t(s.label)}`}
                    >
                      <span className={styles.dotMark} aria-hidden="true" />
                    </button>
                  </li>
                ))}
              </ol>
            </>
          )}

          <div className={styles.controls}>
            {!clip && (
              <button
                type="button"
                className={styles.ctl}
                onClick={() => go(i - 1)}
                aria-label={t(copy.previous)}
              >
                <span aria-hidden="true">←</span>
              </button>
            )}

            <button
              type="button"
              className={styles.ctl}
              onClick={() => setPlaying((p) => !p)}
              aria-label={playing ? t(copy.pause) : t(copy.play)}
            >
              <span className={playing ? styles.iconPause : styles.iconPlay} aria-hidden="true" />
            </button>

            {!clip && (
              <button
                type="button"
                className={styles.ctl}
                onClick={() => go(i + 1)}
                aria-label={t(copy.next)}
              >
                <span aria-hidden="true">→</span>
              </button>
            )}
          </div>

          {/*
            * The whole board, small, at the foot of the controls.
            *
            * It says how much there is behind the eight frames above it: sixty screens across
            * twenty-one thousand pixels, of which this player shows the path a seller walks.
            */}
          {spec.map && (
            <figure className={styles.map}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={spec.map.src}
                width={spec.map.width}
                height={spec.map.height}
                alt=""
                aria-hidden="true"
                loading="lazy"
              />
              <figcaption>{t(copy.mapCaption)}</figcaption>
            </figure>
          )}
        </div>
      </div>

    </section>
  );
}
