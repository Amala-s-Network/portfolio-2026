'use client';

import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/lib/language';
import { contact } from '@/content/copy';
import styles from './BackToTop.module.css';

/**
 * README "Back-to-top button": hidden until the reader is past the cases, hidden again while the
 * footer is up.
 *
 * It used to appear as soon as the first case covered the screen, and that was wrong for what
 * the cases became. Those four panels are a sequence the reader is meant to move THROUGH — a
 * button offering to abandon it, floating over every one of them, argues against the page it is
 * sitting on. It waits for "Outros projetos" now, which is the first point where the reader has
 * finished something rather than being in the middle of it.
 *
 * The colour is NOT taken from the nav. The README is specific that the button "samples what is
 * behind its own centre" — it hit-tests the element under its own midpoint — so it is always the
 * inverse of its actual backdrop rather than of whatever the nav happens to be doing far above it.
 */
export function BackToTop({ suppressed = false }: { suppressed?: boolean }) {
  const { lang, t } = useLanguage();
  const ref = useRef<HTMLButtonElement>(null);
  const [visible, setVisible] = useState(false);
  const [onDark, setOnDark] = useState(false);

  useEffect(() => {
    const button = ref.current;
    if (!button) return;

    const isDark = (colour: string) => {
      const m = colour.match(/rgba?\(([^)]+)\)/);
      if (!m) return false;
      const [r, g, b, a = '1'] = m[1].split(',').map((v) => parseFloat(v));
      if (a === 0) return false;
      // Rec. 601 luma; the palette is near-monochrome so this is plenty.
      return (r * 299 + g * 587 + b * 114) / 1000 < 128;
    };

    const check = () => {
      /*
       * Anchored to the projects section by id rather than by position in the DOM: the sections
       * around it have been reordered more than once, and an nth-child would have gone quietly
       * wrong the next time.
       */
      const projects = document.querySelector('#projetos');
      const shown = projects ? projects.getBoundingClientRect().top <= window.innerHeight * 0.5 : false;
      setVisible(shown && !suppressed);
      if (!shown) return;

      // Sample what is actually behind the button's own centre.
      const rect = button.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      const previous = button.style.pointerEvents;
      button.style.pointerEvents = 'none'; // do not hit-test ourselves
      const behind = document.elementFromPoint(cx, cy);
      button.style.pointerEvents = previous;

      let node: Element | null = behind;
      while (node && node !== document.documentElement) {
        const bg = getComputedStyle(node).backgroundColor;
        if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
          setOnDark(isDark(bg));
          return;
        }
        node = node.parentElement;
      }
      setOnDark(false);
    };

    check();
    window.addEventListener('scroll', check, { passive: true });
    window.addEventListener('resize', check);
    const interval = window.setInterval(check, 180);

    return () => {
      window.removeEventListener('scroll', check);
      window.removeEventListener('resize', check);
      window.clearInterval(interval);
    };
  }, [suppressed]);

  return (
    <button
      ref={ref}
      type="button"
      className={`${styles.button} ${visible ? styles.visible : ''} ${
        onDark ? styles.onDark : styles.onLight
      }`}
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label={t(contact.backToTop)}
      tabIndex={visible ? 0 : -1}
      lang={lang}
    >
      <span aria-hidden="true">⇡</span>
    </button>
  );
}
