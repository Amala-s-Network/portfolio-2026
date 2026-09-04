'use client';

import { useRef, useState } from 'react';
import { useOverlay } from '@/hooks/useOverlay';
import { useLanguage } from '@/lib/language';
import { playground as copy } from '@/content/copy';
import type { CatVariant } from './Room';
import styles from './CatFile.module.css';

type CatFileProps = {
  variant: CatVariant;
  onClose: () => void;
  /**
   * The live 3D portrait needs three.js, and three.js is exactly what the narrow branch refuses
   * to download. So on a phone the file keeps the photograph and the writing and drops the
   * turntable — the pane that cannot exist there simply is not drawn, rather than sitting empty.
   */
  withPortrait?: boolean;
};

/* The photographs live under /public/gatos, one per variant, cropped 3:4. */
const PHOTOS: Record<CatVariant, string> = {
  white: '/gatos/mel.webp',
  tabby: '/gatos/bayle.webp',
  black: '/gatos/rocky.webp',
};

/**
 * A cat's file, in the codec's own furniture.
 *
 * The two panes at the top are the joke and the point: on the left the animal as it exists, on
 * the right the same animal as the room draws it, turning on a plinth in phosphor green. Neither
 * is a caption for the other.
 */
export function CatFile({ variant, onClose, withPortrait = true }: CatFileProps) {
  const { t } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);

  /* Escape, the focus trap and the return of focus — the gap CLAUDE.md calls out by name. */
  useOverlay(ref, true, onClose, { lockScroll: true });

  /*
   * The photographs are the one thing in this room that is not procedural, so they are the one
   * thing that can be missing. If a file has not landed yet the pane keeps its tint and its
   * scanlines and simply holds nothing, which is quieter than a broken-image glyph.
   */
  const [noPhoto, setNoPhoto] = useState(false);

  const cat = copy.cats[variant];

  return (
    <div className={`${styles.scrim} codecSurface`}>
      <div
        ref={ref}
        className={styles.card}
        data-pg-card
        role="dialog"
        aria-modal="true"
        aria-label={`${cat.name} — ${t(copy.catFile.heading)}`}
      >
        <header className={styles.ptt}>
          <span className={styles.pttMark}>{t(copy.catFile.ptt)}</span>
          <span className={styles.pttCode}>{cat.code}</span>
          <button type="button" className={styles.close} onClick={onClose}>
            ✕
          </button>
        </header>

        <div className={styles.body}>
          <div className={styles.panes}>
            <div className={styles.photo}>
              {!noPhoto && (
                /*
                 * A plain <img>, not next/image: the pane is a fixed 3:4 box inside an overlay
                 * that is not part of any page's LCP, and next/image here would buy a second
                 * loader for one asset while costing the onError branch above.
                 */
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={PHOTOS[variant]}
                  alt={`${t(copy.catFile.photoAlt)} ${cat.name}`}
                  className={styles.photoImg}
                  onError={() => setNoPhoto(true)}
                />
              )}
              <span className={styles.tint} aria-hidden="true" />
              <span className={styles.scan} aria-hidden="true" />
            </div>

            {withPortrait && (
              <div className={styles.portrait}>
                {/*
                  * The same geometry as the cat in the room, drawn in phosphor instead of ink.
                  * It observes `variant` and swaps the model in place, so moving between the
                  * three files does not rebuild the scene.
                  */}
                <cat-portrait variant={variant} aria-label={t(copy.catFile.portraitLabel)} />
                <span className={styles.scan} aria-hidden="true" />
              </div>
            )}
          </div>

          <div className={styles.plate}>{cat.name}</div>
        </div>

        <div className={styles.text}>
          <p className={styles.heading}>
            {t(copy.catFile.heading)} <span className={styles.code}>{cat.code}</span>
          </p>
          <h2 className={styles.name}>{cat.name}</h2>
          <p className={styles.role}>{t(cat.role)}</p>

          <dl className={styles.stats}>
            {cat.stats.map((stat) => (
              <div key={stat.k.pt} className={styles.stat}>
                <dt className={styles.statKey}>{t(stat.k)}</dt>
                <dd className={styles.statValue}>{t(stat.v)}</dd>
              </div>
            ))}
          </dl>

          {cat.lore.map((para) => (
            <p key={para.pt} className={styles.lore}>
              {t(para)}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
