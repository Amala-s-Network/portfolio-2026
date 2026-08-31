'use client';

import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/lib/language';
import { casePage, type CaseMedia } from '@/content/copy';
import styles from './CaseFigure.module.css';

/**
 * A figure inside a case: a still, a screen recording, or a sequence of frames.
 *
 * João asked whether a GIF or a prototype could go in some of these. It can, and it should not
 * be a GIF. A GIF cannot be paused, dithers to 256 colours, and weighs several times what the
 * same frames weigh as WebP — and anything that moves for more than five seconds needs a way to
 * stop it (WCAG 2.2.2), which a GIF has no way of offering. So this takes an mp4/webm or a plain
 * list of stills and plays either one properly.
 *
 * Nothing here autoplays under prefers-reduced-motion. The figure loads on its first frame with
 * the control saying "play", which is the setting's whole point: motion on request, not by
 * default.
 */
export function CaseFigure({ media, slug }: { media: CaseMedia; slug: string }) {
  const { t } = useLanguage();

  const kind = media.kind ?? 'still';
  const frames = media.frames ?? [];
  const frameMs = media.frameMs ?? 400;

  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(true);
  const [frame, setFrame] = useState(0);

  /*
   * Read once, on mount, rather than through a media query in CSS: this decides whether the
   * figure STARTS moving, and that is a JavaScript decision. Checked in an effect because
   * matchMedia does not exist while rendering on the server.
   */
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) setPlaying(false);
  }, []);

  /* The flipbook. Stopped whenever the figure is paused, so a paused figure costs nothing. */
  useEffect(() => {
    if (kind !== 'frames' || !playing || frames.length < 2) return;
    const id = window.setInterval(() => setFrame((f) => (f + 1) % frames.length), frameMs);
    return () => window.clearInterval(id);
  }, [kind, playing, frames.length, frameMs]);

  useEffect(() => {
    const el = video.current;
    if (!el) return;
    if (playing) void el.play().catch(() => setPlaying(false));
    else el.pause();
  }, [playing]);

  const moving = kind === 'video' || (kind === 'frames' && frames.length > 1);
  const label = playing ? t(casePage.media.pause) : t(casePage.media.play);

  return (
    <figure className={styles.figure}>
      {/*
       * The frame is the picture's own shape, declared in the copy.
       *
       * It is a reserved box either way — a video needs somewhere to sit before its metadata
       * arrives, and a page that jumps as images land is worse than one that waits — but the box
       * is now the right one, and nothing inside it is cropped to fit.
       */}
      <div className={styles.frame} data-ratio={media.ratio}>
        {kind === 'video' && media.src ? (
          <video
            ref={video}
            className={styles.media}
            src={media.src}
            poster={media.poster ?? undefined}
            muted
            loop
            playsInline
            /*
             * No `autoPlay` attribute. The effect above starts it, which is what lets the
             * reduced-motion branch decide NOT to — an autoplaying attribute would have the
             * video already running before any of that code gets a say.
             */
            aria-label={t(media.caption)}
          />
        ) : (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            className={styles.media}
            src={
              kind === 'frames' && frames.length
                ? frames[frame]
                : (media.src ?? `/placeholders/cases/${slug}.svg`)
            }
            alt=""
            aria-hidden="true"
          />
        )}

        {moving && (
          <button
            type="button"
            className={styles.control}
            onClick={() => setPlaying((p) => !p)}
            aria-label={label}
          >
            <span className={playing ? styles.iconPause : styles.iconPlay} aria-hidden="true" />
            {label}
          </button>
        )}
      </div>

      <figcaption className={styles.caption}>
        {t(media.caption)}
        {media.confidential && !media.src && !frames.length && ` · ${t(casePage.ndaPending)}`}
      </figcaption>
    </figure>
  );
}
