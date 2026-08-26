'use client';

import { useLanguage } from '@/lib/language';
import { casePage, type CasePlateSpec } from '@/content/copy';
import styles from './CasePlate.module.css';

/** DEV ONLY: the note that says which picture belongs here. Never shipped to a visitor. */
const SHOW_PROMPTS = process.env.NODE_ENV !== 'production';

/**
 * The picture on a spread.
 *
 * A stakeholder deck is half pictures — the wireframe, the flow, the screen before and the screen
 * after — and a case page that is only prose is a deck with the slides removed. Every content
 * spread now carries one of these.
 *
 * When the real artwork does not exist yet it renders as a PLATE rather than as a paragraph
 * apologising for itself: a framed, ruled, grained rectangle at the right ratio, holding the
 * case's generated placeholder. It reads as a picture that has not been printed yet, which is
 * what it is. The note naming the shot only appears in development.
 */
export function CasePlate({ spec, slug }: { spec: CasePlateSpec; slug: string }) {
  const { t } = useLanguage();
  const src = spec.src ?? `/placeholders/cases/${slug}.svg`;
  const pending = !spec.src;

  return (
    <figure className={`${styles.root} ${pending ? styles.pending : ''}`}>
      <div className={styles.frame} data-ratio={spec.ratio ?? '4:3'}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className={styles.img} src={src} alt="" aria-hidden="true" />

        {/*
          * The grain sits ON the picture, not only behind it. Without this the photograph is the
          * one surface on the page that is not printed on the same paper as everything else, and
          * it shows immediately.
          */}
        <span className={styles.grain} aria-hidden="true" />

        {pending && <span className={styles.corner} aria-hidden="true" />}
      </div>

      <figcaption className={styles.caption}>
        <span className={styles.captionText}>{t(spec.caption)}</span>
        {spec.confidential && pending && (
          <span className={styles.flag}>{t(casePage.ndaPending)}</span>
        )}
      </figcaption>

      {pending && SHOW_PROMPTS && spec.brief && (
        <p className={styles.brief}>
          <span className={styles.briefTag}>Imagem a fornecer</span>
          {t(spec.brief)}
        </p>
      )}
    </figure>
  );
}
