'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Hacking } from '@/components/Hacking/Hacking';
import { useLanguage } from '@/lib/language';
import { playground as copy } from '@/content/copy';
import { Room, type CatVariant, type DoorId } from './Room';
import { Codec } from './Codec';
import { Battle } from './Battle';
import { CatFile } from './CatFile';
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

/* The three pictures on the wall are routes; everything else in the room is an overlay. */
const ROUTES: Partial<Record<DoorId, string>> = {
  projetos: '/projetos',
  interfaces: '/playground/interfaces',
  componentes: '/playground/componentes',
};

type Overlay = 'arcade' | 'codec' | 'rpg' | null;

export function Playground() {
  const { t } = useLanguage();
  const router = useRouter();

  /*
   * `null` is "not decided yet", and it is why neither branch renders on the server: the answer
   * depends on innerWidth, and guessing it would either boot three.js on a phone or flash the
   * fallback at a desktop before replacing it.
   */
  const [wide, setWide] = useState<boolean | null>(null);
  const [overlay, setOverlay] = useState<Overlay>(null);
  const [cat, setCat] = useState<CatVariant | null>(null);

  useEffect(() => {
    const measure = () => setWide(window.innerWidth >= WIDE);
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  /* One overlay at a time: opening a cat file closes the codec, and the other way round. */
  const openOverlay = useCallback((next: Overlay) => {
    setCat(null);
    setOverlay(next);
  }, []);

  const openCat = useCallback((variant: CatVariant) => {
    setOverlay(null);
    setCat(variant);
  }, []);

  const onDoor = useCallback(
    (id: DoorId) => {
      const href = ROUTES[id];
      if (href) {
        router.push(href);
        return;
      }
      openOverlay(id as Overlay);
    },
    [router, openOverlay],
  );

  /* The three pictures, as links — so they can be opened in a tab, copied, and read as links. */
  const links = [
    { id: 'projetos', href: '/projetos', label: copy.doors.projetos },
    { id: 'interfaces', href: '/playground/interfaces', label: copy.doors.interfaces },
    { id: 'componentes', href: '/playground/componentes', label: copy.doors.componentes },
  ];

  /* The three that open in place. Fliperama ships inverted: it is the loudest thing in the room. */
  const buttons: { id: Overlay; label: (typeof copy.doors)['codec']; loud?: boolean }[] = [
    { id: 'codec', label: copy.doors.codec },
    { id: 'rpg', label: copy.doors.rpg },
    { id: 'arcade', label: copy.doors.arcade, loud: true },
  ];

  const cats: CatVariant[] = ['tabby', 'white', 'black'];

  return (
    <main className={styles.page}>
      {wide === true && (
        <>
          <Room onDoor={onDoor} onCat={openCat} />

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
                {links.map((d) => (
                  <Link key={d.id} href={d.href} className={styles.button}>
                    {t(d.label)}
                  </Link>
                ))}
                {buttons.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    className={`${styles.button} ${b.loud ? styles.buttonOn : ''}`}
                    onClick={() => openOverlay(b.id)}
                  >
                    {t(b.label)}
                  </button>
                ))}
              </div>
            </div>

            <div className={`${styles.corner} ${styles.bottomRight}`}>
              <span className={styles.hudLabel}>{t(copy.catsLabel)}</span>
              <div className={styles.buttons}>
                {cats.map((variant) => (
                  <button
                    key={variant}
                    type="button"
                    className={`${styles.button} ${styles.buttonCat}`}
                    onClick={() => openCat(variant)}
                  >
                    {copy.cats[variant].name}
                  </button>
                ))}
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
              {links.map((d) => (
                <li key={d.id}>
                  <Link href={d.href} className={styles.row}>
                    {t(d.label)}
                  </Link>
                </li>
              ))}
              {buttons.map((b) => (
                <li key={b.id}>
                  <button type="button" className={styles.row} onClick={() => openOverlay(b.id)}>
                    {t(b.label)}
                  </button>
                </li>
              ))}
              {cats.map((variant) => (
                <li key={variant}>
                  <button type="button" className={styles.row} onClick={() => openCat(variant)}>
                    {copy.cats[variant].name}
                  </button>
                </li>
              ))}
            </ul>

            <Link href="/" className={styles.back}>
              {t(copy.back)}
            </Link>
          </div>
        </div>
      )}

      {/*
        * The three new overlays are MOUNTED only while they are open, rather than kept in the
        * tree with an `open` prop. Reopening one is then a fresh instance whose initial state is
        * already the state the design wants — the codec back on tuning, the encounter back at
        * full health — instead of an effect that reaches in and resets half a dozen values one
        * render too late. Hacking keeps its `open` prop because it is shared with the rest of the
        * site and owns its own show/hide transition.
        */}
      <Hacking open={overlay === 'arcade'} onClose={() => setOverlay(null)} windowed />
      {overlay === 'codec' && <Codec onClose={() => setOverlay(null)} />}
      {overlay === 'rpg' && <Battle onClose={() => setOverlay(null)} />}
      {/*
        * Keyed by variant, so moving from one cat to another is a new file rather than the old
        * one with its fields swapped. The live portrait is three.js, and the narrow branch exists
        * precisely to not download that: on a phone the file keeps the photograph and the
        * writing, and the turntable is the one thing that cannot follow.
        */}
      {cat && (
        <CatFile key={cat} variant={cat} onClose={() => setCat(null)} withPortrait={wide === true} />
      )}
    </main>
  );
}
