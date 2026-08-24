'use client';

import { useCallback, useEffect, useState } from 'react';
import { Nav } from '@/components/Nav/Nav';
import { Hero } from '@/components/Hero/Hero';
import { CasePanel } from '@/components/CasePanel/CasePanel';
import { Carousel } from '@/components/Carousel/Carousel';
import { About } from '@/components/About/About';
import { Services } from '@/components/Services/Services';
import { Metrics } from '@/components/Metrics/Metrics';
import { History } from '@/components/History/History';
import { Footer } from '@/components/Footer/Footer';
import { MenuOverlay } from '@/components/MenuOverlay/MenuOverlay';
import { ContactModal } from '@/components/ContactModal/ContactModal';
import { CraftGate } from '@/components/CraftGate/CraftGate';
import { BackToTop } from '@/components/BackToTop/BackToTop';
import { Intro } from '@/components/Intro/Intro';
import { PageFold } from '@/components/PageFold/PageFold';
import { useSectionSettle } from '@/hooks/useSectionSettle';
import { cases } from '@/content/copy';

/**
 * Whether "Outros projetos" and its nav entry are shown.
 *
 * OFF at João's request, so the page argues for four cases and nothing else — parked, not
 * deleted. The carousel, the /projetos index, the filters and the pagination are all intact
 * and one edit away.
 *
 * A flag rather than commented-out markup: commented JSX stops being type-checked and stops
 * being touched by refactors, so it rots quietly and is broken by the time anyone brings it
 * back. Gating the render keeps the code live.
 */
export const SHOW_PROJECTS = false;
import styles from './page.module.css';

/**
 * The one-pager. Section order from CLAUDE.md:
 *   Hero (carries the diagonal marquee) → Cases → Carousel → About → Services →
 *   Metrics → History → Footer
 *
 * Still to come: the intro overlay (step 3).
 */
export default function Page() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [footerUp, setFooterUp] = useState(false);
  const [introDone, setIntroDone] = useState(false);
  /* The door to the craft side; see components/CraftGate. */
  const [gateOpen, setGateOpen] = useState(false);

  /* Pulls the page onto a section edge once the reader stops, so nobody parks mid-turn. */
  useSectionSettle();

  const handleIntroDone = useCallback(() => setIntroDone(true), []);
  const openContact = useCallback(() => setContactOpen(true), []);
  const closeContact = useCallback(() => setContactOpen(false), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const openGate = useCallback(() => setGateOpen(true), []);
  const closeGate = useCallback(() => setGateOpen(false), []);
  const handleFooterRise = useCallback((up: boolean) => setFooterUp(up), []);

  /*
   * The fold is a shortcut, not a gate.
   *
   * It used to hold the page still and play a 1.9s animated lift on click, and that machinery is
   * gone. Scroll was already the mechanism — the sheet's position has always been a function of
   * the offset — so locking it meant building a second, slower way to do the same thing, and
   * every bug in this feature lived in the seam between the two. Clicking now scrolls, the sheet
   * lifts because it is scrolling, and there is one mechanism instead of three phases.
   */
  const turnPage = useCallback(() => {
    const first = document.querySelector('main > section');
    first?.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      block: 'start',
    });
  }, []);

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
        <Hero onContact={openContact} onUnlock={openGate} started={introDone} />

        {/* Cases 01–04. Panels stack by ascending z-index so each covers the previous. */}
        {cases.map((c, i) => (
          <CasePanel
            key={c.slug}
            data={c}
            index={i}
            isLast={i === cases.length - 1}
            /* Only the first rises over the static photograph behind the header. */
            pinned={i === 0}
          />
        ))}

        {SHOW_PROJECTS && <Carousel />}
        <About />
        {/* Between who he is and what the work moved: the reader reaches the numbers already
            knowing what they would be buying. */}
        <Services />
        <Metrics />
        <History />
        <Footer onContact={openContact} onRiseChange={handleFooterRise} />
      </main>

      {/*
        * The dog-ear. It belongs to the first screen rather than to any section, so it is a
        * sibling of <main> — fixed to the viewport corner, fading out as the first case takes
        * the screen.
        */}
      <PageFold onEnter={turnPage} />

      {/* Suppressed while the footer is up, per README. */}
      <BackToTop suppressed={footerUp} />

      <MenuOverlay open={menuOpen} onClose={closeMenu} onContact={openContact} />
      <ContactModal open={contactOpen} onClose={closeContact} />
      <CraftGate open={gateOpen} onClose={closeGate} />
    </>
  );
}
