'use client';

import Link from 'next/link';
import { useLanguage } from '@/lib/language';
import { caseDetails, interfacesPage as copy, escritorio, type T } from '@/content/copy';
import styles from './InterfacesPage.module.css';

type Shot = { src: string; caption: T };

/**
 * The screens, on their own.
 *
 * Built from the case data rather than from a second list of file paths: every shot here is one
 * already published inside a case, so nothing can end up on this page that has not cleared the
 * same bar. That is also why it is short — most of the work is under NDA, and a page that padded
 * itself out with the parts that are not allowed would be the one mistake this site cannot make.
 */
export function InterfacesPage() {
  const { t } = useLanguage();

  /*
   * Only cases that are actually publishable. Itaú and EMS are behind the NDA notice on the home
   * page, so their screens do not belong here either — the modal and this page have to agree.
   */
  const publishable = ['reserva-ink-aparencia-de-loja'];

  const shots: Shot[] = publishable.flatMap((slug) => {
    const c = caseDetails[slug];
    if (!c) return [];
    const plates = c.detail
      .map((d) => d.plate)
      .filter((p): p is NonNullable<typeof p> => Boolean(p?.src))
      .map((p) => ({ src: p.src as string, caption: p.caption }));
    const gallery = c.gallery
      .filter((g) => Boolean(g.src))
      .map((g) => ({ src: g.src as string, caption: g.caption }));
    const proto = (c.proto?.steps ?? []).map((s) => ({ src: s.src, caption: s.label }));
    return [...plates, ...gallery, ...proto];
  });

  return (
    <div className={styles.root}>
      <header className={styles.head}>
        <Link className={styles.back} href="/escritorio">
          <span aria-hidden="true">&#8672;</span> {t(escritorio.label)}
        </Link>
        <h1 className={styles.title}>{t(copy.title)}</h1>
        <p className={styles.intro}>{t(copy.intro)}</p>
      </header>

      {shots.length === 0 ? (
        <p className={styles.empty}>{t(copy.empty)}</p>
      ) : (
        <ul className={styles.grid}>
          {shots.map((s, i) => (
            <li key={s.src} className={styles.cell}>
              <figure className={styles.figure}>
                <div className={styles.frame}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className={styles.img}
                    src={s.src}
                    alt=""
                    aria-hidden="true"
                    loading={i < 2 ? 'eager' : 'lazy'}
                  />
                  <span className={styles.grain} aria-hidden="true" />
                </div>
                <figcaption className={styles.caption}>
                  <span className={styles.num}>{String(i + 1).padStart(2, '0')}</span>
                  {t(s.caption)}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
