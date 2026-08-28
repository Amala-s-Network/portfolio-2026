'use client';

import { useCallback, useEffect, useState } from 'react';
import { Nav } from '@/components/Nav/Nav';
import { Hero } from '@/components/Hero/Hero';
import { CasePanel } from '@/components/CasePanel/CasePanel';
import { Carousel } from '@/components/Carousel/Carousel';
import { About } from '@/components/About/About';
import { Services } from '@/components/Services/Services';
import { Testimonials } from '@/components/Testimonials/Testimonials';
import { Metrics } from '@/components/Metrics/Metrics';
import { History } from '@/components/History/History';
import { Footer } from '@/components/Footer/Footer';
import { MenuOverlay } from '@/components/MenuOverlay/MenuOverlay';
import { ContactModal } from '@/components/ContactModal/ContactModal';
import { CraftGate } from '@/components/CraftGate/CraftGate';
import { BackToTop } from '@/components/BackToTop/BackToTop';
import { InProduction } from '@/components/InProduction/InProduction';
import { Intro } from '@/components/Intro/Intro';
import { featuredCases } from '@/content/copy';

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
  /* Shown when a reader opens a case whose screens are not ready yet. */
  const [productionOpen, setProductionOpen] = useState(false);

  const handleIntroDone = useCallback(() => setIntroDone(true), []);
  const openContact = useCallback(() => setContactOpen(true), []);
  const closeContact = useCallback(() => setContactOpen(false), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const openGate = useCallback(() => setGateOpen(true), []);
  const closeGate = useCallback(() => setGateOpen(false), []);
  const handleFooterRise = useCallback((up: boolean) => setFooterUp(up), []);

  return (
    <>
      <Intro onDone={handleIntroDone} />

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

        {/* Cases 01–04, as plain sections. The page-turn is gone at João’s instruction. */}
        {featuredCases.map((c) => (
          <CasePanel key={c.slug} data={c} onInProduction={() => setProductionOpen(true)} />
        ))}

        {SHOW_PROJECTS && <Carousel />}
        <About />
        {/* Between who he is and what the work moved: the reader reaches the numbers already
            knowing what they would be buying. */}
        <Services />
        <Metrics />
        <History />
        {/* What people who worked with him say, straight after where he has worked. */}
        <Testimonials />
        <Footer onContact={openContact} onRiseChange={handleFooterRise} />
      </main>

      {/* Suppressed while the footer is up, per README. */}
      <BackToTop suppressed={footerUp} />

      <MenuOverlay open={menuOpen} onClose={closeMenu} onContact={openContact} />
      <ContactModal open={contactOpen} onClose={closeContact} />
      <CraftGate open={gateOpen} onClose={closeGate} />
      <InProduction open={productionOpen} onClose={() => setProductionOpen(false)} />
    </>
  );
}
