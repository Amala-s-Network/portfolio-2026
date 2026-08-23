'use client';

import { useEffect, useRef } from 'react';
import { Button } from '@/components/Button/Button';
import { useLanguage } from '@/lib/language';
import { contact as copy, nav as navCopy, links } from '@/content/copy';
import styles from './Footer.module.css';

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

type FooterProps = {
  onContact?: () => void;
  /** Lets the page suppress the back-to-top button while the panel is up (README §9). */
  onRiseChange?: (up: boolean) => void;
};

export function Footer({ onContact, onRiseChange }: FooterProps) {
  const { lang, t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const riseRef = useRef(false);

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    const panel = panelRef.current;
    if (!section || !stage || !panel) return;

    /* Same page-turn maths as the cases (README §5), reused deliberately. */
    const apply = () => {
      const vh = window.innerHeight;
      const r = section.getBoundingClientRect();
      const p = clamp01((vh - r.top) / (vh * 0.58));
      const eased = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
      const rest = 1 - eased;

      panel.style.transform = `translateY(${rest * 100}%) rotateX(${rest * -11}deg) scale(${
        1 - rest * 0.05
      })`;

      /*
       * The stage is fixed and full-screen, so it would swallow every click on the page even
       * while the panel is still off-screen. Only take pointer events once it is actually up.
       */
      const up = p > 0.02;
      stage.classList.toggle(styles.stageLive, up);

      if (up !== riseRef.current) {
        riseRef.current = up;
        onRiseChange?.(up);
      }
    };

    apply();
    window.addEventListener('scroll', apply, { passive: true });
    window.addEventListener('resize', apply);
    const interval = window.setInterval(apply, 180);
    document.addEventListener('visibilitychange', apply);
    window.addEventListener('pageshow', apply);

    return () => {
      window.removeEventListener('scroll', apply);
      window.removeEventListener('resize', apply);
      window.clearInterval(interval);
      document.removeEventListener('visibilitychange', apply);
      window.removeEventListener('pageshow', apply);
    };
  }, [onRiseChange]);

  return (
    <section ref={sectionRef} className={styles.section} id="contato">
      <div ref={stageRef} className={styles.stage}>
        <div ref={panelRef} className={styles.panel} data-dark>
          <div className={styles.folio}>
            <span>{t(copy.folioLeft)}</span>
            <span>{t(copy.folioRight)}</span>
          </div>

          <div className={styles.body}>
            <div>
              <h2 className={styles.heading}>
                {copy.heading[lang].map((line, i) => (
                  <span key={i} style={{ display: 'block' }}>
                    {line}
                  </span>
                ))}
              </h2>
              <p className={styles.blurb}>{t(copy.paragraph)}</p>
            </div>

            <div className={styles.right}>
              <div className={styles.channels}>
                {Object.entries(copy.channels).map(([key, c]) => (
                  <a
                    key={key}
                    className={styles.channel}
                    href={c.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className={styles.channelLabel}>{c.label}</span>
                    <span className={styles.channelValue}>{c.value}</span>
                  </a>
                ))}
              </div>

              <div className={styles.social}>
                {copy.social.map((s) => (
                  <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer">
                    {s.name}
                  </a>
                ))}
              </div>

              <Button className={styles.cta} onClick={onContact}>
                {t(copy.cta)}
              </Button>
            </div>
          </div>

          <div className={styles.bottom}>
            <span className={styles.wordmark}>{navCopy.wordmark}</span>
            <span>{t(copy.credit)}</span>
            <span className={styles.copyright}>{copy.copyright}</span>
            <button
              type="button"
              className={styles.toTop}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              {t(copy.backToTop)}
              <span className={styles.toTopArrow} aria-hidden="true">
                ⇡
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
