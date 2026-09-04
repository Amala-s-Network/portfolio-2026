'use client';

import { useCallback, useState } from 'react';
import { Nav } from '@/components/Nav/Nav';
import { MenuOverlay } from '@/components/MenuOverlay/MenuOverlay';
import { ContactModal } from '@/components/ContactModal/ContactModal';
import { BackToTop } from '@/components/BackToTop/BackToTop';
import { Footer } from '@/components/Footer/Footer';
import styles from './CaseShell.module.css';

/**
 * The chrome around a case page: nav, menu, contact modal, back-to-top.
 *
 * This exists because the case route was rendering a bare `<Nav />` with no props at all. Every
 * control on it is driven from outside — `onToggleMenu` and `onContact` both come from the page
 * that owns the state — so with none passed, the wordmark, the burger and "Entrar em contato"
 * were live buttons wired to nothing. They focused, they hovered, they pressed, and nothing
 * happened, which is worse than a bar that is visibly inert.
 *
 * The state lived inside `app/page.tsx`, so only the one-pager ever had it. Lifting it into a
 * shell both routes use is the fix; the alternative — moving it up into the layout — would put
 * a client boundary around every page for the benefit of two of them.
 */
export function CaseShell({
  children,
  /** The projects index closes with the same panel the one-pager does; a case page does not. */
  withFooter = false,
  /**
   * A page that fills the viewport exactly once and never scrolls — the escritório.
   *
   * It changes two things. The main becomes a fixed box that starts under the bar, so the room
   * is measured from the bottom of the nav rather than from the top of the window and the two
   * stop fighting over the same 72px. And back-to-top goes: a control that scrolls you to a top
   * you are already at is not a affordance, it is a button that does nothing.
   */
  noScroll = false,
}: {
  children: React.ReactNode;
  withFooter?: boolean;
  noScroll?: boolean;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [footerUp, setFooterUp] = useState(false);

  const openContact = useCallback(() => setContactOpen(true), []);
  const closeContact = useCallback(() => setContactOpen(false), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const toggleMenu = useCallback(() => setMenuOpen((v) => !v), []);

  return (
    <>
      {/* WCAG 2.4.1, same as the one-pager. */}
      <a href="#conteudo" className="srOnly">
        Pular para o conteúdo
      </a>

      <Nav menuOpen={menuOpen} onToggleMenu={toggleMenu} onContact={openContact} />

      <main id="conteudo" className={noScroll ? styles.fixedMain : undefined}>
        {children}
        {withFooter && <Footer onContact={openContact} onRiseChange={setFooterUp} />}
      </main>

      {/* Suppressed while the footer panel is up, exactly as on the one-pager. */}
      {!noScroll && <BackToTop suppressed={footerUp} />}

      <MenuOverlay open={menuOpen} onClose={closeMenu} onContact={openContact} />
      <ContactModal open={contactOpen} onClose={closeContact} />
    </>
  );
}
