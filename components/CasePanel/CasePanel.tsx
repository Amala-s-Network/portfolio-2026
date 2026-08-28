'use client';

import Link from 'next/link';
import { useLanguage } from '@/lib/language';
import { caseLabels, inProductionCases, type Case } from '@/content/copy';
import styles from './CasePanel.module.css';

type CasePanelProps = {
  data: Case;
  /** Called instead of navigating, when this case is still being produced. */
  onInProduction?: () => void;
};

export function CasePanel({ data, onInProduction }: CasePanelProps) {
  const { t } = useLanguage();
  /*
   * No scroll effect, no page-turn, no sound.
   *
   * The panels used to be fixed stages that slid and rotated over one another as the sections
   * scrolled past, with a rustle at each arrival. João asked for the portfolio to scroll plainly,
   * so a case is now what it looks like: a section with a photograph, a title and a link. The
   * turn lives on the case pages, where the reader chose to be.
   */

  return (
    <section className={styles.section}>
      <div className={styles.stage}>
        {/* data-dark: the nav reads these to know when to invert. */}
        <div className={styles.panel} data-dark>
          <div className={styles.photoFrame}>
            {/*
             * Placeholder art, generated for this repo — see assets/placeholders/README.md.
             * Swapping in real photography is a one-line change here.
             */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className={styles.photo}
              src={data.photo ?? `/placeholders/cases/${data.slug}.svg`}
              alt=""
              aria-hidden="true"
            />
          </div>

          <div className={styles.scrim} />

          {/* README §5: an absolute anchor covers the panel as the click target. */}
          {/*
            * The origin is recorded on the way out, not guessed on the way back.
            *
            * document.referrer is empty after a client-side navigation, and Next does not expose
            * the previous route — so the only honest way to know whether the reader came from
            * the one-pager or from the projects index is for whoever sent them to say so.
            */}
          <Link
            className={styles.anchor}
            href={`/cases/${data.slug}`}
            aria-label={t(data.title)}
            onClick={(e) => {
              /*
               * A case whose screens are not ready says so instead of opening.
               *
               * preventDefault rather than dropping the link: it stays a real anchor, so it keeps
               * its keyboard focus, its accessible name and its right-click, and a reader who
               * opens it in a new tab still gets the page. Only the ordinary click is intercepted.
               */
              if (onInProduction && inProductionCases.includes(data.slug as never)) {
                e.preventDefault();
                onInProduction();
                return;
              }
              try {
                sessionStorage.setItem('caseOrigin', 'home');
              } catch {
                /* Private modes can refuse storage; the fallback destination is still correct. */
              }
            }}
          />

          <div className={styles.veil} />

          <div className={styles.head}>
            <h2 className={styles.title}>{t(data.title)}</h2>
            <p className={styles.company}>{t(data.company)}</p>
          </div>


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
