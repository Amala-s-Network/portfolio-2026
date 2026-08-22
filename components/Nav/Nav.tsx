'use client';

import { useEffect, useRef } from 'react';
import { Button } from '@/components/Button/Button';
import { useScrollProgress } from '@/hooks/useScrollProgress';
import { useLanguage } from '@/lib/language';
import { nav as copy } from '@/content/copy';
import styles from './Nav.module.css';

type NavProps = {
  menuOpen?: boolean;
  onToggleMenu?: () => void;
  onContact?: () => void;
};

export function Nav({ menuOpen = false, onToggleMenu, onContact }: NavProps) {
  const { lang, setLang, t } = useLanguage();
  const progress = useScrollProgress();
  const ref = useRef<HTMLElement>(null);

  /*
   * README §1: "The nav height is measured at runtime and published as --navH so the hero can
   * offset by it." Measured rather than hard-coded because the wordmark font swap changes it.
   */
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const publish = () => {
      document.documentElement.style.setProperty('--navH', `${el.offsetHeight}px`);
    };

    publish();
    const observer = new ResizeObserver(publish);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <nav ref={ref} className={styles.nav}>
      <button
        type="button"
        className={styles.wordmark}
        onClick={onToggleMenu}
        aria-expanded={menuOpen}
        aria-label={lang === 'pt' ? 'Abrir menu' : 'Open menu'}
      >
        {copy.wordmark}
        <span
          className={`${styles.caret} ${menuOpen ? styles.caretOpen : ''}`}
          aria-hidden="true"
        />
      </button>

      <div className={styles.langs}>
        <button
          type="button"
          className={`${styles.lang} ${lang === 'pt' ? styles.langActive : ''}`}
          onClick={() => setLang('pt')}
        >
          {copy.langPt}
        </button>
        <span className={styles.langSep} aria-hidden="true">
          /
        </span>
        <button
          type="button"
          className={`${styles.lang} ${lang === 'en' ? styles.langActive : ''}`}
          onClick={() => setLang('en')}
        >
          {copy.langEn}
        </button>
      </div>

      <Button className={styles.cta} small onClick={onContact}>
        {t(copy.cta)}
      </Button>

      {/* README §1: the progress bar IS the nav's bottom border. */}
      <div className={styles.track}>
        <div className={styles.bar} style={{ transform: `scaleX(${progress})` }} />
      </div>
    </nav>
  );
}
