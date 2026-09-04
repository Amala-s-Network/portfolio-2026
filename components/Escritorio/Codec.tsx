'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useOverlay } from '@/hooks/useOverlay';
import { useLanguage } from '@/lib/language';
import { escritorio as copy } from '@/content/copy';
import styles from './Codec.module.css';

type ContactKey = (typeof copy.codec.order)[number];

/* One character per 26ms. Slow enough to read as a transmission, fast enough not to be a wait. */
const TYPE_MS = 26;
/* The tuning sweep before the first line. */
const BOOT_MS = 1700;

/**
 * The portrait: a simulated signal frame, not a likeness.
 *
 * Bands and blocks only, and that is a decision rather than a limitation — a drawn portrait of a
 * real character would be someone else's design sitting on João's page. What identifies each
 * contact is one accessory: a cap, glasses, a visor, long hair. Snake carries the bandana, the
 * stubble raster and the scar.
 */
function Portrait({
  who,
  face,
  label,
  dim,
  talking,
}: {
  who: 'snake' | 'them';
  face?: string;
  label: string;
  dim: boolean;
  talking: boolean;
}) {
  return (
    <div className={styles.portrait} style={{ opacity: dim ? 0.4 : 1 }} aria-hidden="true">
      <span className={styles.head} />

      {who === 'snake' && (
        <>
          <span className={styles.bandana} />
          <span className={styles.bandanaEdge} />
          <span className={styles.tailOne} />
          <span className={styles.tailTwo} />
          <span className={`${styles.brow} ${styles.browL}`} />
          <span className={`${styles.brow} ${styles.browR}`} />
          <span className={`${styles.eye} ${styles.eyeL}`} />
          <span className={`${styles.eye} ${styles.eyeR}`} />
          <span className={styles.nose} />
          <span className={styles.stubble} />
          <span className={styles.scar} />
        </>
      )}

      {who === 'them' && (
        <>
          {face === 'cap' && (
            <>
              <span className={styles.cap} />
              <span className={styles.capBrim} />
            </>
          )}
          {face === 'glasses' && (
            <>
              <span className={`${styles.lens} ${styles.lensL}`} />
              <span className={`${styles.lens} ${styles.lensR}`} />
              <span className={styles.bridge} />
            </>
          )}
          {face === 'visor' && (
            <>
              <span className={styles.visor} />
              <span className={styles.visorSlit} />
            </>
          )}
          {face === 'hair' && (
            <>
              <span className={`${styles.hair} ${styles.hairL}`} />
              <span className={`${styles.hair} ${styles.hairR}`} />
              <span className={styles.fringe} />
            </>
          )}
          {/* The visor replaces the eyes; every other face keeps them. */}
          {face !== 'visor' && (
            <>
              <span className={`${styles.eye} ${styles.eyeL}`} />
              <span className={`${styles.eye} ${styles.eyeR}`} />
            </>
          )}
          <span className={styles.noseThem} />
        </>
      )}

      <span className={`${styles.mouth} ${talking ? styles.mouthTalking : ''}`} />
      <span className={styles.scan} />
      {who === 'them' && <span className={styles.sweep} />}
      <span className={styles.name}>{label}</span>
    </div>
  );
}

/*
 * Mounted only while the call is up — see Escritorio.tsx. That is not a detail: it is what lets
 * every "start from the beginning again" be the initial state of a fresh component instead of an
 * effect that reaches in and resets four values after the fact.
 */
export function Codec({ onClose }: { onClose: () => void }) {
  const { t } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);

  /* The design starts tuning, then opens straight on Campbell. That is the initial state. */
  const [stage, setStage] = useState<'boot' | 'pick' | 'talk'>('boot');
  const [who, setWho] = useState<ContactKey>('campbell');
  const [index, setIndex] = useState(0);

  useOverlay(ref, true, onClose, { lockScroll: true });

  useEffect(() => {
    const id = window.setTimeout(() => setStage('talk'), BOOT_MS);
    return () => window.clearTimeout(id);
  }, []);

  const contact = copy.codec.contacts[who];
  const line = stage === 'talk' ? contact.lines[index] : null;
  const full = line ? t(line.text) : '';

  /*
   * How much of the current line is revealed, stored WITH the identity of the line it belongs to.
   *
   * The obvious shape is a bare counter plus an effect that zeroes it whenever the line changes,
   * and that is a cascading render: the new line paints once with the old line's character count
   * before the effect corrects it. Keying the count to the line means a line it does not belong
   * to simply reads as zero, during the very first render, with no second pass. The key includes
   * the text itself, so switching language mid-sentence restarts the typing rather than leaving
   * a count pointing into a string that no longer exists.
   */
  const key = `${who}:${index}:${full}`;
  const [reveal, setReveal] = useState({ key, n: 0 });
  const shown = reveal.key === key ? reveal.n : 0;
  const typing = !!line && shown < full.length;

  /* The typewriter. One timer per character. */
  useEffect(() => {
    if (!typing) return;
    const id = window.setTimeout(() => setReveal({ key, n: shown + 1 }), TYPE_MS);
    return () => window.clearTimeout(id);
  }, [typing, key, shown]);

  /* First press finishes the line; the next one moves on. */
  const advance = useCallback(() => {
    if (typing) {
      setReveal({ key, n: full.length });
      return;
    }
    if (index < contact.lines.length - 1) {
      setIndex((i) => i + 1);
    }
  }, [typing, key, full.length, index, contact.lines.length]);

  /*
   * Space and Enter advance the line, and they do it WITHOUT a key listener.
   *
   * The dialogue box is a real button, so the browser already turns both keys into a click on it
   * — all it needs is the focus. That matters because the first thing I wrote here was a document
   * keydown handler that bailed out whenever the event target was a BUTTON, to avoid stealing the
   * key from "close" and "change frequency". It never fired once: useOverlay puts initial focus on
   * the first focusable thing in the card, which IS a button, so the guard rejected every press.
   * Moving the focus to the box instead fixes the feature and deletes the handler — and it leaves
   * the other two controls with their own keyboard behaviour intact, which was the point of the
   * guard in the first place.
   */
  const box = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (stage !== 'talk') return;
    box.current?.focus();
  }, [stage]);

  const fromSnake = line?.who === 'SNAKE';
  const fromSystem = line?.who === 'SISTEMA';
  const speaker = !line
    ? ''
    : fromSnake
      ? 'SNAKE'
      : fromSystem
        ? t(copy.codec.system)
        : contact.short;

  return (
    <div className={`${styles.scrim} codecSurface`}>
      <div
        ref={ref}
        className={styles.card}
        data-pg-card
        role="dialog"
        aria-modal="true"
        aria-label="Codec"
      >
        <header className={styles.head2}>
          <span className={styles.freq}>{stage === 'talk' ? contact.freq : '· · ·'}</span>
          <button type="button" className={styles.close} onClick={onClose} aria-label={t(copy.codec.close)}>
            ✕
          </button>
        </header>

        {stage === 'boot' && (
          <div className={styles.boot}>
            <p className={styles.bootTitle}>{t(copy.codec.booting)}</p>
            <div className={styles.bars} aria-hidden="true">
              {Array.from({ length: 14 }, (_, i) => (
                <i
                  key={i}
                  style={{
                    height: `${16 + ((i * 37) % 30)}px`,
                    animationDuration: `${0.5 + (i % 5) * 0.16}s`,
                  }}
                />
              ))}
            </div>
            <p className={styles.bootNote}>{t(copy.codec.sweeping)}</p>
          </div>
        )}

        {stage === 'pick' && (
          <ul className={styles.list}>
            {copy.codec.order.map((k) => {
              const c = copy.codec.contacts[k];
              return (
                <li key={k}>
                  <button
                    type="button"
                    className={styles.row}
                    onClick={() => {
                      setWho(k);
                      setIndex(0);
                      setStage('talk');
                    }}
                  >
                    <span className={styles.rowFreq}>{c.freq}</span>
                    <span className={styles.rowName}>{t(c.name)}</span>
                    <span className={styles.rowRole}>{t(c.role)}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}

        {stage === 'talk' && line && (
          <>
            <div className={styles.faces}>
              <Portrait
                who="snake"
                label="SNAKE"
                dim={!fromSnake}
                talking={typing && fromSnake}
              />

              <div className={styles.centre}>
                <div className={styles.wave} aria-hidden="true">
                  {Array.from({ length: 18 }, (_, i) => (
                    <i key={i} style={{ height: `${6 + Math.round(Math.sin(i * 0.7) * 12 + 14)}px` }} />
                  ))}
                </div>
                <p className={styles.secure}>
                  {contact.freq} · {t(copy.codec.secure)}
                </p>
              </div>

              <Portrait
                who="them"
                face={contact.face}
                label={contact.short}
                dim={fromSnake || fromSystem}
                talking={typing && !fromSnake && !fromSystem}
              />
            </div>

            <button ref={box} type="button" className={styles.box} onClick={advance}>
              <span className={styles.speaker}>{speaker}</span>
              <span className={styles.said}>{full.slice(0, shown)}</span>
            </button>

            <div className={styles.foot}>
              {(typing || index < contact.lines.length - 1) && (
                <span className={styles.more}>▼ {t(copy.codec.advance)}</span>
              )}
              <button type="button" className={styles.change} onClick={() => setStage('pick')}>
                {t(copy.codec.change)}
              </button>
            </div>
          </>
        )}

        {/* Kept in the card, not in a footer nobody reads. */}
        <p className={styles.attribution}>{t(copy.codec.attribution)}</p>
      </div>
    </div>
  );
}
