'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { scrollToHash } from '@/lib/hashScroll';
import { useScrollProgress } from '@/hooks/useScrollProgress';
import { useSurfaceInversion } from '@/hooks/useSurfaceInversion';
import { useLanguage } from '@/lib/language';
import { nav as copy, menu as menuCopy, playground as playgroundCopy } from '@/content/copy';
import { useActiveSection } from '@/hooks/useActiveSection';
import { SHOW_PROJECTS } from '@/app/page';
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
  const pathname = usePathname();
  const home = pathname === '/';
  const active = useActiveSection();

  /*
   * The four destinations, promoted out of the overlay menu and into the bar.
   *
   * "Contato" is a BUTTON, not a link: it opens the modal rather than going anywhere, and giving
   * it an href would promise a page that does not exist. The other three are real anchors, so
   * they can be opened in a new tab, copied, and read as links by anything that reads links.
   */
  const items = [
    { id: 'home', href: home ? '#' : '/', label: menuCopy.links[0] },
    /* Dropped with the section it points at — see SHOW_PROJECTS in app/page.tsx. */
    ...(SHOW_PROJECTS ? [{ id: 'projetos', href: '/projetos', label: menuCopy.links[1] }] : []),
    { id: 'sobre', href: home ? '#sobre' : '/#sobre', label: menuCopy.links[2] },
  ];

  // README §1: the bar inverts when a dark surface passes under it.
  useSurfaceInversion(ref);

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

      {/*
        * The section links. The line under each one is drawn on hover and stays drawn on the
        * section the reader is actually in — same mark, two reasons for being there, which is
        * what makes "where am I" and "where could I go" read as one system.
        */}
      <div className={styles.links}>
        {items.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className={`${styles.link} ${active === item.id ? styles.linkActive : ''}`}
            aria-current={active === item.id ? 'page' : undefined}
            onClick={(e) => {
              if (item.href === '#') {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
              }
              /* Every click after the first, which next/link would otherwise drop. */
              scrollToHash(e, item.href, home);
            }}
          >
            {t(item.label)}
          </Link>
        ))}

        {/*
          * The playground, and only from here.
          *
          * João's instruction: one button in the bar, nothing on the home page and nothing in the
          * menu overlay until he says otherwise. It is marked so it reads as a door out of the
          * portfolio rather than another section of it.
          */}
        <Link
          href="/playground"
          className={`${styles.link} ${styles.playground}`}
          aria-current={pathname.startsWith('/playground') ? 'page' : undefined}
        >
          <span className={styles.playgroundMark} aria-hidden="true" />
          {t(playgroundCopy.label)}
        </Link>

        <button type="button" className={styles.link} onClick={onContact}>
          {t(menuCopy.links[3])}
        </button>
      </div>

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

      {/*
        * Mobile only — replaces the language pair and the CTA, which do not fit at 360px and both
        * live on inside the menu overlay this opens. It is the same control as the wordmark, so
        * it carries the same aria-expanded and controls the same panel; aria-hidden is NOT used,
        * because the button is genuinely interactive at this width.
        */}
      <button
        type="button"
        className={`${styles.burger} ${menuOpen ? styles.burgerOpen : ""}`}
        onClick={onToggleMenu}
        aria-expanded={menuOpen}
        aria-label={
          menuOpen
            ? lang === "pt" ? "Fechar menu" : "Close menu"
            : lang === "pt" ? "Abrir menu" : "Open menu"
        }
      >
        <span className={styles.burgerBar} aria-hidden="true" />
        <span className={styles.burgerBar} aria-hidden="true" />
        <span className={styles.burgerBar} aria-hidden="true" />
      </button>

      {/* README §1: the progress bar IS the nav's bottom border. */}
      <div className={styles.track}>
        <div className={styles.bar} style={{ transform: `scaleX(${progress})` }} />
      </div>
    </nav>
  );
}
