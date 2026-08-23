'use client';

import Image from 'next/image';
import { useRef } from 'react';
import { Button } from '@/components/Button/Button';
import { Reveal } from '@/components/Reveal/Reveal';
import { useLanguage } from '@/lib/language';
import { hero as copy } from '@/content/copy';
import avatar from '@/public/avatar.png';
import styles from './Hero.module.css';

/**
 * README "Entrance cascade": kicker → H1 → paragraph → CTA, 260ms apart, starting when the intro
 * releases scroll. (The 260×1px divider that used to sit between H1 and paragraph was removed at
 * João's request, so it is no longer a step.)
 */
export function Hero({ onContact, started = true }: { onContact?: () => void; started?: boolean }) {
  const { lang, t } = useLanguage();
  const avatarRef = useRef<HTMLDivElement>(null);
  const titleWrapRef = useRef<HTMLDivElement>(null);
  const sphereRef = useRef<HTMLDivElement>(null);

  /** Both layers render the same three hard-broken lines. */
  const lines = copy.title[lang].map((line, i) => (
    <span key={i} style={{ display: 'block' }}>
      {line}
    </span>
  ));

  /*
   * One shared position on the wrapper; --mx/--my inherit down to both the disc and the mask, so
   * the two layers can never drift out of register.
   */
  const positionSphere = (event: React.MouseEvent<HTMLDivElement>) => {
    const wrap = titleWrapRef.current;
    if (!wrap) return;
    const rect = wrap.getBoundingClientRect();
    wrap.style.setProperty('--mx', `${event.clientX - rect.left}px`);
    wrap.style.setProperty('--my', `${event.clientY - rect.top}px`);
  };

  /*
   * README §2: "Set the opacity synchronously in the enter handler — gating it on
   * requestAnimationFrame breaks in throttled/embedded contexts."
   *
   * The position is committed with the trail suppressed, so the sphere fades in already under the
   * cursor instead of gliding in from wherever it was last left.
   */
  const onSphereEnter = (event: React.MouseEvent<HTMLDivElement>) => {
    const wrap = titleWrapRef.current;
    if (!wrap) return;
    wrap.style.transition = 'none';
    positionSphere(event);
    wrap.getBoundingClientRect(); // commit the jump before the trail is restored
    wrap.style.transition = '';
    wrap.classList.add(styles.sphereOn);
  };

  const onSphereMove = (event: React.MouseEvent<HTMLDivElement>) => {
    positionSphere(event);
  };

  const onSphereLeave = () => {
    titleWrapRef.current?.classList.remove(styles.sphereOn);
  };

  /*
   * README §2: click restarts coinFlip by clearing style.animation, forcing reflow, then
   * re-assigning it. Without the reflow the browser coalesces the two writes and nothing replays.
   */
  const replayFlip = () => {
    const el = avatarRef.current;
    if (!el) return;
    el.style.animation = 'none';
    void el.offsetWidth; // force reflow
    el.style.animation = '';
  };

  return (
    <header className={styles.hero}>
      <div className={styles.stack}>
        <div className={styles.avatarWrap}>
          {/* Not a link (README §2). */}
          <div ref={avatarRef} className={styles.avatar} onClick={replayFlip}>
            <Image src={avatar} alt="João Vitor Melo" width={56} height={56} priority />
          </div>
        </div>

        <Reveal on={started} order={0} as="p" className={styles.kicker}>
          <span className={styles.diamond} aria-hidden="true" />
          {t(copy.kicker)}
        </Reveal>

        <Reveal on={started} order={1}>
        <div
          ref={titleWrapRef}
          className={styles.titleWrap}
          onMouseEnter={onSphereEnter}
          onMouseMove={onSphereMove}
          onMouseLeave={onSphereLeave}
        >
          {/* Three hard-broken lines — the breaks are part of the design. */}
          <h1 className={styles.title}>{lines}</h1>

          {/* The disc, painted over the base headline. */}
          <div className={styles.sphereDisc} aria-hidden="true" />

          {/*
           * The headline again in white, masked to the disc so the letters read as knocked out
           * of it. aria-hidden because these are the same words — a screen reader must not
           * announce the headline twice.
           */}
          <div ref={sphereRef} className={styles.titleSphere} aria-hidden="true">
            {lines}
          </div>
        </div>
        </Reveal>

        <Reveal on={started} order={2} as="p" className={styles.paragraph}>
          {copy.paragraph[lang].map((line, i) => (
            <span key={i} style={{ display: 'block' }}>
              {line}
            </span>
          ))}
        </Reveal>

        <Reveal on={started} order={3}>
          <Button className={styles.cta} onClick={onContact}>
            {t(copy.cta)}
          </Button>
        </Reveal>
      </div>
    </header>
  );
}
