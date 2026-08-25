'use client';

import { useEffect, useState } from 'react';
import { useLanguage } from '@/lib/language';
import { casePage } from '@/content/copy';
import styles from './CaseToc.module.css';

export type TocItem = { id: string; label: string };

/**
 * The topic index that rides alongside a case.
 *
 * A long read needs two things a scrollbar cannot give: how much of this there is, and where I
 * am in it. The index answers both at a glance, and it also puts something in the right-hand
 * space that was sitting empty next to a 68ch measure.
 *
 * Tracked on scroll rather than with IntersectionObserver. The README warns about this from the
 * prototype: an observer failed silently in throttled and embedded contexts and left whole
 * sections stuck, and the cost of being wrong here is an index that quietly stops following the
 * reader. A scroll handler plus a slow interval cannot fail that way.
 */
export function CaseToc({ items }: { items: TocItem[] }) {
  const { t } = useLanguage();
  const [active, setActive] = useState(items[0]?.id ?? '');

  /*
   * A STRING key, not the array.
   *
   * `items` is rebuilt on every render of the case page, so depending on it tore this effect
   * down and set it back up each time — and since the 400ms interval is created in setup and
   * cleared in teardown, a page that re-renders more often than that (three reveal hooks firing
   * as the reader scrolls) restarts the timer before it ever fires. The index went stale exactly
   * when the reader was moving, which is the only time it matters. Keyed on the ids, the effect
   * runs once per real change.
   */
  const key = items.map((i) => i.id).join('|');

  useEffect(() => {
    const ids = key ? key.split('|') : [];
    if (!ids.length) return;

    const check = () => {
      /*
       * The active topic is the last heading whose top has passed a line a third of the way down
       * the viewport, not the one nearest the top edge. Anchoring at the edge makes the index
       * flip to the next topic while the reader is still on the last paragraph of the previous.
       */
      const line = window.innerHeight * 0.34;
      let current = ids[0];
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) current = id;
      }

      /*
       * The last topic can never reach that line if there is less than a viewport of page after
       * it — which there always is here, because the figures and the footer follow. Without this
       * the final item in the index is unreachable no matter how far the reader scrolls.
       */
      const atBottom = window.innerHeight + window.scrollY >= document.body.scrollHeight - 4;
      if (atBottom) current = ids[ids.length - 1];

      setActive(current);
    };

    check();
    window.addEventListener('scroll', check, { passive: true });
    window.addEventListener('resize', check);
    const interval = window.setInterval(check, 400);
    return () => {
      window.removeEventListener('scroll', check);
      window.removeEventListener('resize', check);
      window.clearInterval(interval);
    };
  }, [key]);

  if (items.length < 2) return null;

  return (
    <nav className={styles.root} aria-label={t(casePage.toc.label)}>
      <div className={styles.sticky}>
        <p className={styles.head}>{t(casePage.toc.label)}</p>

        <ol className={styles.list}>
          {items.map((it, i) => (
            <li key={it.id}>
              <a
                href={`#${it.id}`}
                className={`${styles.link} ${active === it.id ? styles.on : ''}`}
                /*
                 * aria-current rather than a class alone: the highlight is the only thing that
                 * says "you are here", and a colour change says nothing to a screen reader.
                 */
                aria-current={active === it.id ? 'true' : undefined}
              >
                <span className={styles.num}>{String(i + 1).padStart(2, '0')}</span>
                <span>{it.label}</span>
                <span className={styles.mark} aria-hidden="true">
                  →
                </span>
              </a>
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}
