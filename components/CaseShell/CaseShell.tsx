'use client';

import { useCallback, useState } from 'react';
import { Nav } from '@/components/Nav/Nav';
import { MenuOverlay } from '@/components/MenuOverlay/MenuOverlay';
import { ContactModal } from '@/components/ContactModal/ContactModal';
import { BackToTop } from '@/components/BackToTop/BackToTop';

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
export function CaseShell({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

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

      <main id="conteudo">{children}</main>

      {/* No footer panel on a case page, so nothing ever suppresses it. */}
      <BackToTop />

      <MenuOverlay open={menuOpen} onClose={closeMenu} onContact={openContact} />
      <ContactModal open={contactOpen} onClose={closeContact} />
    </>
  );
}
