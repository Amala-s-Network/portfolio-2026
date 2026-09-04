'use client';

import { useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useOverlay } from '@/hooks/useOverlay';
import { useLanguage } from '@/lib/language';
import { menu as copy, hero, nav as navCopy, links, escritorio as escritorioCopy } from '@/content/copy';
import styles from './MenuOverlay.module.css';

type MenuOverlayProps = {
  open: boolean;
  onClose: () => void;
  /** README: "Contato" closes the menu and opens the modal. */
  onContact: () => void;
};

export function MenuOverlay({ open, onClose, onContact }: MenuOverlayProps) {
  const { lang, setLang, t } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Focus trap, Escape, focus return, and the body scroll lock (README "Overlays").
  useOverlay(ref, open, onClose, { lockScroll: true });

  /*
   * The section anchors only exist on the one-pager. Opened from a case page the menu looked
   * perfectly alive and every link was a no-op, because `#projetos` matched nothing in the
   * document — so off the home route they are prefixed to navigate home first.
   *
   * The plain hash form is kept ON the home route deliberately: `/#projetos` there would be a
   * full document navigation, throwing away the intro state and the scroll position to land in
   * the same place a hash jump reaches instantly.
   */
  const home = pathname === '/';
  const sections = [
    { href: home ? '#' : '/', label: copy.links[0] },
    /*
     * "Projetos" is a PAGE now, not the carousel section on the home route. It used to jump to
     * #projetos, which put the reader beside six cards and a button to the very index they had
     * just asked for. It goes straight there.
     */
    /*
     * Same order as the bar, and here for the same reason it is there: on a phone the bar
     * collapses into this overlay, and the escritório would otherwise need the URL typed. The room
     * is not drawn below 1200px, but that page is every door in it as a plain row, so the link
     * goes somewhere real at every width.
     */
    { href: '/escritorio', label: escritorioCopy.label },
    { href: '/projetos', label: copy.links[1] },
    { href: home ? '#sobre' : '/#sobre', label: copy.links[2] },
  ];

  return (
    <div
      ref={ref}
      className={`${styles.overlay} ${open ? styles.open : ''}`}
      aria-hidden={!open}
      role="dialog"
      aria-modal="true"
      aria-label={lang === 'pt' ? 'Menu' : 'Menu'}
    >
      <div className={styles.tiles} aria-hidden="true">
        <span className={`${styles.tile} ${styles.tile1}`} />
        <span className={`${styles.tile} ${styles.tile2}`} />
        <span className={`${styles.tile} ${styles.tile3}`} />
        <span className={`${styles.tile} ${styles.tile4}`} />
      </div>

      <div className={styles.head}>
        <span className={styles.wordmark}>{navCopy.wordmark}</span>
        <button
          type="button"
          className={styles.close}
          onClick={onClose}
          aria-label={lang === 'pt' ? 'Fechar menu' : 'Close menu'}
        >
          <span aria-hidden="true">✕</span>
        </button>
      </div>

      <div className={styles.columns}>
        <nav>
          <p className={styles.colHeading}>{t(copy.headings.menu)}</p>
          <div className={styles.links}>
            {sections.map((s) => {
              /* Same reason as ButtonLink: a route change must not reload the document. */
              const Tag = s.href.startsWith('/') ? Link : 'a';
              return (
              <Tag
                key={s.href}
                className={styles.mainLink}
                href={s.href}
                onClick={(e) => {
                  onClose();
                  /*
                   * "Página inicial" on the home route pointed at "#", which does land at the top
                   * but leaves a bare hash on the URL and jumps rather than travels — everything
                   * else on this site scrolls smoothly, back-to-top included. Handled explicitly
                   * so the one link that means "take me back to the start" behaves like the rest.
                   */
                  if (s.href === '#') {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    return;
                  }
                  /*
                   * The same explicit scroll the nav does, for the same two reasons: it travels
                   * instead of jumping, like everything else here, and it keeps working on the
                   * second press. Deferred a tick because onClose() above hands focus back and
                   * releases the scroll lock, and a scroll started inside that is a scroll that
                   * may not survive it.
                   */
                  if (home && s.href.startsWith('#')) {
                    e.preventDefault();
                    const href = s.href;
                    window.setTimeout(() => {
                      const target = document.querySelector(href);
                      if (!target) return;
                      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                      target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
                      try {
                        window.history.replaceState(null, '', href);
                      } catch {
                        /* Some embedded contexts refuse replaceState. */
                      }
                    }, 0);
                  }
                }}
              >
                {t(s.label)}
              </Tag>
              );
            })}
            {/* Closes the menu and opens the modal, rather than navigating. */}
            <button
              type="button"
              className={styles.mainLink}
              onClick={() => {
                onClose();
                onContact();
              }}
            >
              {t(copy.links[3])}
            </button>
          </div>
        </nav>

        <div>
          <p className={styles.colHeading}>{t(copy.headings.contact)}</p>
          <div className={styles.links}>
            <a className={styles.subLink} href={links.whatsapp} target="_blank" rel="noopener noreferrer">
              {links.phone}
            </a>
            <a className={styles.subLink} href={`mailto:${links.email}`}>
              {links.email}
            </a>
            <a className={styles.subLink} href={links.cv} target="_blank" rel="noopener noreferrer">
              Currículo 2026
            </a>
          </div>
        </div>

        <div>
          <p className={styles.colHeading}>{t(copy.headings.social)}</p>
          <div className={styles.links}>
            <a className={styles.subLink} href={links.linkedin} target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
            <a className={styles.subLink} href={links.behance} target="_blank" rel="noopener noreferrer">
              Behance
            </a>
            <a className={styles.subLink} href={links.dribbble} target="_blank" rel="noopener noreferrer">
              Dribbble
            </a>
            <a className={styles.subLink} href={links.steam} target="_blank" rel="noopener noreferrer">
              Steam
            </a>
          </div>
        </div>
      </div>

      {/*
        * Mobile only. Below 768px the nav bar drops the language pair to make room, so this
        * overlay becomes its only route — without it the site would be single-language on a
        * phone. Hidden above the breakpoint, where the nav still carries it.
        */}
      <div className={styles.mobileLangs}>
        <button
          type="button"
          className={`${styles.mobileLang} ${lang === "pt" ? styles.mobileLangActive : ""}`}
          onClick={() => setLang("pt")}
          aria-pressed={lang === "pt"}
        >
          {navCopy.langPt}
        </button>
        <span aria-hidden="true">/</span>
        <button
          type="button"
          className={`${styles.mobileLang} ${lang === "en" ? styles.mobileLangActive : ""}`}
          onClick={() => setLang("en")}
          aria-pressed={lang === "en"}
        >
          {navCopy.langEn}
        </button>
      </div>

      <p className={styles.kicker}>
        <span className={styles.diamond} aria-hidden="true" />
        {t(hero.kicker)}
      </p>
    </div>
  );
}
