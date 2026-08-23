'use client';

import { useId } from 'react';
import { useLanguage } from '@/lib/language';
import { mascot as copy } from '@/content/copy';
import styles from './Mascot.module.css';

/**
 * The easter-egg character, revealed on hover of the portrait in "Sobre mim".
 *
 * ⚠️ IP NOTE — this is a Jack Frost derivative, and Jack Frost belongs to Atlus. João made that
 * call knowingly on 2026-08-23, overriding his own MASCOT.md, which had specified an original
 * character precisely to avoid this. Recolouring to a silhouette does not change the position;
 * if anything a silhouette reads as the character more clearly, not less. Recorded here so
 * nobody later assumes it was an oversight.
 *
 * Drawn from João's own mODELO.svg, snapped to a 4px grid and reduced to one flat ink colour.
 * The eyes and mouth are masked OUT rather than filled — that is what lets a single-colour
 * silhouette still read as a face.
 */
export function Mascot() {
  const { t } = useLanguage();
  // Unique per instance, so two mascots on one page cannot collide on the mask id.
  const maskId = useId();

  return (
    <span className={styles.mascot}>
      <span className={styles.bubble}>
        <span className={styles.bubbleBody}>{t(copy.bubble)}</span>
        <span className={styles.bubbleTail} aria-hidden="true" />
      </span>

      <span className={styles.figure}>
        <svg
          viewBox="0 0 128 160"
          width="96"
          height="120"
          className={styles.svg}
          aria-hidden="true"
        >
          <defs>
            {/* White shows, black hides — the two eyes and the grin are the black shapes. */}
            <mask id={maskId}>
              <rect width="128" height="160" fill="#fff" />
              <rect x="40" y="72" width="12" height="20" fill="#000" />
              <rect x="76" y="72" width="12" height="20" fill="#000" />
              <rect x="44" y="100" width="40" height="8" fill="#000" />
              <rect x="52" y="108" width="24" height="4" fill="#000" />
            </mask>
          </defs>

          <g mask={`url(#${maskId})`} fill="var(--ink)">
            {/* hood — dome */}
            <rect x="40" y="32" width="48" height="8" />
            <rect x="32" y="40" width="64" height="8" />
            <rect x="24" y="48" width="80" height="8" />

            {/* hood — left lobe */}
            <rect x="8" y="40" width="24" height="8" />
            <rect x="0" y="48" width="24" height="8" />
            <rect x="4" y="56" width="20" height="8" />

            {/* hood — right lobe */}
            <rect x="96" y="40" width="24" height="8" />
            <rect x="104" y="48" width="24" height="8" />
            <rect x="104" y="56" width="20" height="8" />

            {/* head — the mask cuts the eyes and grin out of this block */}
            <rect x="24" y="56" width="80" height="56" />

            {/* body */}
            <rect x="40" y="112" width="48" height="16" />
            <rect x="32" y="128" width="64" height="8" />
          </g>

          {/* Arm waves on hover; outside the mask so it is never clipped by the face cut-outs. */}
          <g id="arm" className={styles.arm} fill="var(--ink)">
            <rect x="96" y="88" width="16" height="8" />
            <rect x="104" y="80" width="12" height="8" />
            <rect x="108" y="72" width="12" height="8" />
          </g>

          <g id="legA" className={styles.legA} fill="var(--ink)">
            <rect x="24" y="136" width="32" height="16" />
          </g>
          <g id="legB" className={styles.legB} fill="var(--ink)">
            <rect x="72" y="136" width="32" height="16" />
          </g>
        </svg>
      </span>
    </span>
  );
}
