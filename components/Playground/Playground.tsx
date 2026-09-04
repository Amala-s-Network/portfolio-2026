'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Hacking } from '@/components/Hacking/Hacking';
import { useLanguage } from '@/lib/language';
import { playground as copy } from '@/content/copy';
import { Room, type CatVariant, type DoorId } from './Room';
import styles from './Playground.module.css';

/*
 * The width below which the room is not drawn AT ALL — not hidden, not rendered.
 *
 * The camera is framed against 16:9 and pulls back on taller ratios; a phone is neither. And a
 * `display: none` element still runs connectedCallback, so hiding the room in CSS would boot
 * three.js and a few hundred outlined volumes on a phone to show nobody anything. The fallback
 * below is what a narrow screen gets instead, and it reaches every door the room does.
 */
const WIDE = 1200;

/* Where the three pictures on the wall lead. The other three doors are overlays. */
const ROUTES: Partial<Record<DoorId, string>> = {
  projetos: '/projetos',
  interfaces: '/playground/interfaces',
  componentes: '/playground/componentes',
};

export function Playground() {
  const { t } = useLanguage();
  const router = useRouter();

  /*
   * `null` is "not decided yet", and it is why neither branch renders on the server: the answer
   * depends on innerWidth, and guessing it would either boot three.js on a phone or flash the
   * fallback at a desktop before replacing it.
   */
  const [wide, setWide] = useState<boolean | null>(null);
  const [arcade, setArcade] = useState(false);

  useEffect(() => {
    const measure = () => setWide(window.innerWidth >= WIDE);
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  const onDoor = useCallback(
    (id: DoorId) => {
      if (id === 'arcade') {
        setArcade(true);
        return;
      }
      const href = ROUTES[id];
      if (href) router.push(href);
      /*
       * 'codec' and 'rpg' fall through on purpose: the two tube TVs are in the scene and emit
       * their events, but the codec call and the minotaur battle are not built yet. Which is
       * also why there is no nav link to this page — see Nav.tsx. Both land next.
       */
    },
    [router],
  );

  const onCat = useCallback((variant: CatVariant) => {
    /* The cat files land with the two TVs. Until then a cat is only something that walks. */
    void variant;
  }, []);

  const doors = [
    { id: 'projetos' as const, href: '/projetos', label: copy.doors.projetos },
    { id: 'interfaces' as const, href: '/playground/interfaces', label: copy.doors.interfaces },
    { id: 'componentes' as const, href: '/playground/componentes', label: copy.doors.componentes },
  ];

  return (
    <main className={styles.page}>
      {wide === true && (
        <>
          <Room onDoor={onDoor} onCat={onCat} />

          {/*
            * The grade. A halftone in multiply and an inset vignette, both inert, both over the
            * canvas — together they are what makes the render read as something printed rather
            * than as WebGL. Without them the room is the same drawing and looks like a screenshot
            * of a 3D editor.
            */}
          <div className={styles.grade} aria-hidden="true" />

          <div className={styles.hud}>
            {/* pointer-events: none, so the type never eats a click meant for the room. */}
            <div className={`${styles.corner} ${styles.topLeft}`}>
              <p className={styles.eyebrow}>
                <Link href="/" className={styles.eyebrowLink}>
                  {t(copy.eyebrowName)}
                </Link>
                <span aria-hidden="true"> · </span>
                {t(copy.eyebrowHere)}
              </p>
              <h1 className={styles.title}>{t(copy.title)}</h1>
            </div>

            <p className={`${styles.corner} ${styles.topRight} ${styles.intro}`}>{t(copy.intro)}</p>

            <div className={`${styles.corner} ${styles.bottomLeft}`}>
              <span className={styles.hudLabel}>{t(copy.shortcuts)}</span>
              <div className={styles.buttons}>
                {doors.map((d) => (
                  <Link key={d.id} href={d.href} className={styles.button}>
                    {t(d.label)}
                  </Link>
                ))}
                {/*
                  * The loudest thing in the room, and the only one that opens rather than goes —
                  * so it ships inverted, the way the design has it.
                  */}
                <button
                  type="button"
                  className={`${styles.button} ${styles.buttonOn}`}
                  onClick={() => setArcade(true)}
                >
                  {t(copy.doors.arcade)}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {wide === false && (
        <div className={styles.narrow}>
          <div className={styles.narrowInner}>
            <p className={styles.eyebrow}>
              {t(copy.eyebrowName)}
              <span aria-hidden="true"> · </span>
              {t(copy.eyebrowHere)}
            </p>
            <h1 className={styles.narrowTitle}>{t(copy.title)}</h1>
            <p className={styles.narrowNote}>{t(copy.narrow.note)}</p>

            <ul className={styles.rows}>
              {doors.map((d) => (
                <li key={d.id}>
                  <Link href={d.href} className={styles.row}>
                    {t(d.label)}
                  </Link>
                </li>
              ))}
              <li>
                <button type="button" className={styles.row} onClick={() => setArcade(true)}>
                  {t(copy.doors.arcade)}
                </button>
              </li>
            </ul>

            <Link href="/" className={styles.back}>
              {t(copy.back)}
            </Link>
          </div>
        </div>
      )}

      <Hacking open={arcade} onClose={() => setArcade(false)} />
    </main>
  );
}
