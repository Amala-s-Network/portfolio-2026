'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { useLanguage } from '@/lib/language';
import { PageFold } from '@/components/PageFold/PageFold';
import { playPaper } from '@/lib/paper';
import { caseLabels, caseFold, type Case } from '@/content/copy';
import styles from './CasePanel.module.css';

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

type CasePanelProps = {
  data: Case;
  /** 0-based; drives the z-index stack so each panel covers the one before it. */
  index: number;
  /**
   * The last panel needs an exit the others do not. Panels 1–3 are covered by the next panel
   * rising over them, so their disappearance is never seen. The last has nothing above it, so
   * without this it sits perfectly still for 1.7 viewports and then blinks out of existence at
   * the exact scroll position where the carousel begins.
   */
  isLast?: boolean;
  /**
   * The case this one hands over to. Present on 01-03 and absent on 04, which hands over to
   * "Outros projetos" — a different kind of place, and not something a corner promising another
   * case should be pointing at.
   */
  next?: Case;
};

export function CasePanel({ data, index, isLast, next }: CasePanelProps) {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLImageElement>(null);
  /*
   * Whether this panel's arrival has already been sounded.
   *
   * Latched rather than fired on a threshold crossing: scroll events arrive in clusters and the
   * progress value jitters across any given number, so "p just went past 0.5" is true several
   * times for one gesture. The latch releases only when the panel has gone well back down,
   * which is what makes scrolling up and down again rustle once per pass instead of continuously.
   */
  const soundedRef = useRef(false);

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const panel = panelRef.current;
    const photo = photoRef.current;
    if (!section || !stage || !panel || !photo) return;

    /*
     * The scroll maths, verbatim from README §5. The rotateX + scale is what reads as a page
     * being turned rather than a slide, so none of these constants are arbitrary.
     *
     * Read first, then write: every getBoundingClientRect happens before any style assignment,
     * so a panel never forces a second layout inside one frame.
     */
    const apply = () => {
      const vh = window.innerHeight;
      const r = section.getBoundingClientRect();

      // Reveal completes over 58% of a screen.
      const p = clamp01((vh - r.top) / (vh * 0.58));
      const eased = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2; // easeInOutQuad
      const rest = 1 - eased;

      /*
       * Exit, last panel only. `r.bottom` is also exactly where the next section's top sits, so
       * translating up by the same proportion keeps the panel's bottom edge locked to the
       * carousel's top edge: the panel slides away at precisely the rate the carousel arrives,
       * and the seam between them never moves. At r.bottom === 0 it is fully clear, which is the
       * same instant the stage hides — so the hide is invisible instead of being a cut.
       */
      const exit = isLast ? clamp01((vh - r.bottom) / vh) : 0;

      panel.style.transform = `translateY(${rest * 100 - exit * 100}%) rotateX(${
        rest * -11
      }deg) scale(${1 - rest * 0.05})`;

      /*
       * The page turning has a sound whether the reader pulled the corner or simply scrolled.
       * It fires at 0.45 — while the panel is still visibly arriving — because a rustle that
       * lands after the paper has settled reads as an echo rather than as the movement itself.
       */
      if (p > 0.45 && !soundedRef.current) {
        soundedRef.current = true;
        playPaper();
      } else if (p < 0.12) {
        soundedRef.current = false;
      }
      photo.style.transform = `translateY(${rest * -6}%)`;

      // Once the section is behind us the stage must stop intercepting clicks.
      const done = r.bottom <= 0;
      stage.style.visibility = done ? 'hidden' : '';

      /*
       * Pointer events are handled purely in CSS now — the stage never takes them and the panel
       * always does, so the interactive area is exactly the panel geometry. The progress-threshold
       * version this replaces made the whole viewport interactive as soon as a section edged into
       * view, which broke the hero on any screen tall enough for the first section to start above
       * the fold. See the note in CasePanel.module.css.
       */
    };

    apply();
    window.addEventListener('scroll', apply, { passive: true });
    window.addEventListener('resize', apply);

    /*
     * README "Entrance cascade" records that rAF-gated and observer-driven scroll work failed
     * silently in throttled contexts, leaving panels stuck off-screen. The interval is the cheap
     * insurance: it costs one rect read every 180ms and guarantees the panel is never wrong.
     */
    const interval = window.setInterval(apply, 180);
    const onWake = () => apply();
    document.addEventListener('visibilitychange', onWake);
    window.addEventListener('pageshow', onWake);

    return () => {
      window.removeEventListener('scroll', apply);
      window.removeEventListener('resize', apply);
      window.clearInterval(interval);
      document.removeEventListener('visibilitychange', onWake);
      window.removeEventListener('pageshow', onWake);
    };
  }, [isLast]);

  return (
    <section ref={sectionRef} className={styles.section}>
      <div ref={stageRef} className={styles.stage} style={{ zIndex: 20 + index }}>
        {/* data-dark: the nav reads these to know when to invert. */}
        <div ref={panelRef} className={styles.panel} data-dark>
          <div className={styles.photoFrame}>
            {/*
             * Placeholder art, generated for this repo — see assets/placeholders/README.md.
             * Swapping in real photography is a one-line change here.
             */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={photoRef}
              className={styles.photo}
              src={data.photo ?? `/placeholders/cases/${data.slug}.svg`}
              alt=""
              aria-hidden="true"
            />
          </div>

          <div className={styles.scrim} />

          {/* README §5: an absolute anchor covers the panel as the click target. */}
          <Link
            className={styles.anchor}
            href={`/cases/${data.slug}`}
            aria-label={t(data.title)}
          />

          <div className={styles.veil} />

          <div className={styles.head}>
            <h2 className={styles.title}>{t(data.title)}</h2>
            <p className={styles.company}>{t(data.company)}</p>
          </div>

          {/*
            * The corner, carried through from the first screen. Cases 01-03 have one; it shows
            * the next case's photograph and takes the reader there, so the same gesture that got
            * them into the work is the one that moves them through it.
            *
            * It sits AFTER the anchor in the markup and above it in z-index: the panel's own
            * full-bleed link would otherwise swallow the corner's clicks, and the reader would
            * land on the case page they were trying to move past.
            */}
          {next && (
            <PageFold
              variant="case"
              image={next.photo ?? `/placeholders/cases/${next.slug}.svg`}
              label={t(caseFold.label)}
              onEnter={() => {
                const sections = document.querySelectorAll('main > section');
                const target = sections[index + 1];
                target?.scrollIntoView({
                  behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
                    ? 'auto'
                    : 'smooth',
                  block: 'start',
                });
              }}
            />
          )}

          <div className={styles.foot}>
            <span className={styles.hoverLabel}>
              <span className={styles.diamond} aria-hidden="true" />
              {t(caseLabels.hover)}
            </span>
            <p className={styles.description}>{t(data.description)}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
