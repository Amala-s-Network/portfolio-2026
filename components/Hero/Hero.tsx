'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { Button } from '@/components/Button/Button';
import { Reveal } from '@/components/Reveal/Reveal';
import { Marquee } from '@/components/Marquee/Marquee';
import { useLanguage } from '@/lib/language';
import { hero as copy } from '@/content/copy';
import avatar from '@/public/avatar.webp';
import styles from './Hero.module.css';

/**
 * How often the avatar turns on its own.
 *
 * Touch has no hover, so without a timer the flip simply does not exist on a phone. Running it
 * on desktop too keeps one behaviour rather than two — hovering or tapping still restarts it
 * immediately.
 *
 * 3000ms against a 1150ms animation leaves the avatar still for most of a cycle, which reads as
 * a deliberate glance rather than a spinning ornament — and puts real distance between it and
 * WCAG 2.2.2, which is uneasy about motion that never pauses.
 */
const FLIP_EVERY = 3000;

/**
 * README "Entrance cascade": kicker → H1 → paragraph → CTA, 260ms apart, starting when the intro
 * releases scroll. (The 260×1px divider that used to sit between H1 and paragraph was removed at
 * João's request, so it is no longer a step.)
 */
export function Hero({
  onContact,
  started = true,
  /** True once the reader has pulled the corner: the sheet lifts away and stays gone. */
  turned = false,
}: {
  onContact?: () => void;
  started?: boolean;
  turned?: boolean;
}) {
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
   * README §2: clicking restarts coinFlip. The prototype clears style.animation, forces reflow,
   * then re-assigns the literal keyframe string — that last step cannot be copied here because
   * CSS Modules hashes the keyframe name, so a class is toggled instead.
   *
   * The reflow between removing and re-adding is essential: without it the browser coalesces the
   * two class writes into one frame, sees no change, and nothing replays.
   */
  const replayFlip = () => {
    const el = avatarRef.current;
    if (!el) return;
    el.classList.remove(styles.flipping);
    void el.offsetWidth; // force reflow
    el.classList.add(styles.flipping);
  };

  /*
   * Hover is bound natively rather than through React's onMouseEnter. React synthesises
   * enter/leave from delegated mouseover/mouseout at the root, which makes the handler awkward
   * to exercise and adds a layer between a very simple interaction and its trigger. A native
   * mouseenter on the element itself is exactly the semantic wanted: fires once on entry, does
   * not repeat for children.
   */
  useEffect(() => {
    const el = avatarRef.current;
    if (!el) return;
    const onEnter = () => replayFlip();
    const onEnd = () => el.classList.remove(styles.flipping);
    el.addEventListener('mouseenter', onEnter);
    el.addEventListener('animationend', onEnd);

    // Anyone who asked for less motion gets the flip on interaction only, never unprompted.
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const timer = reduced ? 0 : window.setInterval(replayFlip, FLIP_EVERY);
    return () => {
      el.removeEventListener('mouseenter', onEnter);
      el.removeEventListener('animationend', onEnd);
      if (timer) window.clearInterval(timer);
    };
  }, []);

  return (
    <header className={`${styles.hero} ${turned ? styles.turned : ''}`}>
      {/*
        * The diagonal strip, absolutely positioned against the hero and rendered FIRST so it
        * paints underneath the headline. It is aria-hidden inside the component already, so it
        * adds nothing to the reading order by sitting here.
        */}
      <Marquee />

      <div className={styles.stack}>
        <div className={styles.avatarWrap}>
          {/* Not a link (README §2) — a button role, since clicking it does something. */}
          <div
            ref={avatarRef}
            className={styles.avatar}
            onClick={replayFlip}
            role="button"
            tabIndex={0}
            aria-label="Foto de João Vitor Melo"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                replayFlip();
              }
            }}
          >
            <Image src={avatar} alt="João Vitor Melo" width={56} height={56} priority />
          </div>
        </div>

        <Reveal on={started} order={0} as="p" className={styles.kicker}>
          {/* Inline, not a flex sibling — as a flex item it wrapped onto its own line on mobile. */}
          <span className={`${styles.diamond} ${styles.diamondInline}`} aria-hidden="true" />
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

        {/*
          * The deck: two columns of body text and the call to action, on one line.
          *
          * A newspaper sets its lede and its angle side by side rather than stacked, and that is
          * the whole reason this reads as a front page instead of a landing page. The first
          * column says who; the second says how the work is argued. They are different texts —
          * the prototype printed one twice because it was placeholder.
          *
          * It also buys vertical space: the same words in one column would cost roughly twice
          * the height, and the first screen has to hold nav, hero and marquee inside 768px.
          */}
        <div className={styles.deck}>
          {/*
            * JOINED WITH SPACES, not rendered as separate blocks.
            *
            * copy.ts stores these as arrays because the old full-width paragraph had hard line
            * breaks that were part of the design. In a column that can be any width those breaks
            * are wrong, so the text has to reflow — but simply setting the spans to inline glued
            * the last word of each line to the first word of the next ("sendo 6 delesdedicados"),
            * because the stored strings carry no trailing space. Joining is the honest fix.
            */}
          <Reveal on={started} order={2} as="p" className={styles.paragraph}>
            {copy.paragraph[lang].join(' ')}
          </Reveal>

          <Reveal on={started} order={3} as="p" className={styles.paragraph}>
            {copy.paragraphB[lang].join(' ')}
          </Reveal>

          <Reveal on={started} order={4} className={styles.ctaWrap}>
            <Button className={styles.cta} onClick={onContact}>
              {t(copy.cta)}
            </Button>
          </Reveal>
        </div>
      </div>
    </header>
  );
}
