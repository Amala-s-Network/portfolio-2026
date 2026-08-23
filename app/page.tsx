'use client';

import { useCallback, useState } from 'react';
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

  const handleIntroDone = useCallback(() => setIntroDone(true), []);
  const openContact = useCallback(() => setContactOpen(true), []);
  const closeContact = useCallback(() => setContactOpen(false), []);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
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
        <Hero onContact={openContact} started={introDone} />

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
      <PageFold />

      {/* Suppressed while the footer is up, per README. */}
      <BackToTop suppressed={footerUp} />

      <MenuOverlay open={menuOpen} onClose={closeMenu} onContact={openContact} />
      <ContactModal open={contactOpen} onClose={closeContact} />
    </>
  );
}
