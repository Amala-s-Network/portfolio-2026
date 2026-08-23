'use client';

import { useCallback, useEffect, useState } from 'react';
import { Nav } from '@/components/Nav/Nav';
import { Hero } from '@/components/Hero/Hero';
import { CasePanel } from '@/components/CasePanel/CasePanel';
import { Carousel } from '@/components/Carousel/Carousel';
import { About } from '@/components/About/About';
import { Metrics } from '@/components/Metrics/Metrics';
import { History } from '@/components/History/History';
import { Footer } from '@/components/Footer/Footer';
import { MenuOverlay } from '@/components/MenuOverlay/MenuOverlay';
import { ContactModal } from '@/components/ContactModal/ContactModal';
import { BackToTop } from '@/components/BackToTop/BackToTop';
import { Intro } from '@/components/Intro/Intro';
import { PageFold } from '@/components/PageFold/PageFold';
import { cases } from '@/content/copy';
import styles from './page.module.css';

/**
 * The one-pager. Section order from CLAUDE.md:
 *   Hero (carries the diagonal marquee) → Cases → Carousel → About → Metrics →
 *   History → Footer
 *
 * Still to come: the intro overlay (step 3).
 */
export default function Page() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [footerUp, setFooterUp] = useState(false);
  const [introDone, setIntroDone] = useState(false);

  /*
   * The first screen is HELD until the reader pulls the corner.
   *
   * The cases have always been under this page — that is what the whole page-turn language has
   * been saying. Letting the reader scroll straight past the fold made the corner decorative:
   * a thing you could ignore rather than the way through. Holding the page makes the invitation
   * the actual mechanism, and the photograph already showing through the corner is what tells
   * them there is something under there worth pulling for.
   *
   * Scroll returns the moment the sheet is gone, and cases 01-04 keep the scroll-driven turn
   * they have always had.
   */
  /**
   * 'held'    — the first screen is locked and the corner is the only way forward
   * 'turning' — the single animated lift, playing now
   * 'live'    — the sheet follows the scroll offset from here on
   *
   * Three states rather than a boolean, because "has the corner ever been pulled" and "where is
   * the sheet right now" are different questions. Collapsing them meant the page re-locked when
   * the reader scrolled back to the top, which is a trap rather than a page.
   */
  const [phase, setPhase] = useState<'held' | 'turning' | 'live'>('held');

  const handleIntroDone = useCallback(() => setIntroDone(true), []);

  /* The sheet lifts, and only once it is clear does the document become scrollable again. */
  const turnPage = useCallback(() => {
    setPhase('turning');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.setTimeout(
      () => {
        /*
         * The jump and the handover happen together, and the order is what makes the seam
         * invisible: at scrollY === heroHeight the scroll-driven transform resolves to exactly
         * the position the CSS transition just finished in, so the sheet does not move when
         * control changes hands.
         */
        const hero = document.querySelector('header');
        window.scrollTo(0, hero ? hero.offsetHeight : window.innerHeight);
        setPhase('live');
      },
      reduced ? 260 : 1900
    );
  }, []);
  const openContact = useCallback(() => setContactOpen(true), []);
  const closeContact = useCallback(() => setContactOpen(false), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const handleFooterRise = useCallback((up: boolean) => setFooterUp(up), []);

  /*
   * Body scroll is locked while the page is held. It is released by the turn, and also if the
   * reader never gets that far — the menu and the modal lock it themselves and must be able to
   * give it back.
   */
  /*
   * A reload starts at the top, always.
   *
   * Browsers restore the previous scroll position by default, which is usually a kindness and
   * here is a trap: the first screen is HELD, and restoring someone to the middle of the case
   * sequence hands them a page that is locked, un-turned, and scrolled past the thing that
   * unlocks it. Manual restoration plus an explicit jump means every load begins where the
   * mechanism expects to begin.
   */
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (phase !== 'held') return;
    document.documentElement.classList.add('isHeld');
    return () => {
      document.documentElement.classList.remove('isHeld');
    };
  }, [phase]);

  return (
    <>
      <Intro onDone={handleIntroDone} />

      {/*
        * The case photograph, behind the sheet from the very first frame. It is what shows
        * through the fold and what the page lifts to reveal — one continuous picture, not two
        * copies that have to be made to match.
        */}
      <div className={styles.underlay} aria-hidden="true" />

      {/*
        * WCAG 2.4.1 — a way past the nav for keyboard and switch users. Visually hidden until
        * focused, at which point it is the first thing Tab reaches on the page.
        */}
      <a href="#conteudo" className="srOnly">
        Pular para o conteúdo
      </a>

      <Nav
        menuOpen={menuOpen}
        onToggleMenu={() => setMenuOpen((v) => !v)}
        onContact={openContact}
      />

      <main id="conteudo">
        {/*
          * The marquee is INSIDE the hero now, not a band under it.
          *
          * As a diagonal strip it is a mark laid across the page rather than a divider between
          * two sections, so it belongs to the hero's own box — which is also what lets it be
          * positioned absolutely against it. The animated Divider that used to sit above it is
          * gone at João's instruction.
          */}
        <Hero onContact={openContact} started={introDone} phase={phase} />

        {/* Cases 01–04. Panels stack by ascending z-index so each covers the previous. */}
        {cases.map((c, i) => (
          <CasePanel key={c.slug} data={c} index={i} isLast={i === cases.length - 1} />
        ))}

        <Carousel />
        <About />
        <Metrics />
        <History />
        <Footer onContact={openContact} onRiseChange={handleFooterRise} />
      </main>

      {/*
        * The dog-ear. It belongs to the first screen rather than to any section, so it is a
        * sibling of <main> — fixed to the viewport corner, fading out as the first case takes
        * the screen.
        */}
      <PageFold held={phase === 'held'} turning={phase === 'turning'} onEnter={turnPage} />

      {/* Suppressed while the footer is up, per README. */}
      <BackToTop suppressed={footerUp} />

      <MenuOverlay open={menuOpen} onClose={closeMenu} onContact={openContact} />
      <ContactModal open={contactOpen} onClose={closeContact} />
    </>
  );
}
