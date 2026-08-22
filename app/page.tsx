'use client';

import { useCallback, useState } from 'react';
import { Nav } from '@/components/Nav/Nav';
import { Hero } from '@/components/Hero/Hero';
import { Divider } from '@/components/Divider/Divider';
import { Marquee } from '@/components/Marquee/Marquee';
import { CasePanel } from '@/components/CasePanel/CasePanel';
import { About } from '@/components/About/About';
import { Metrics } from '@/components/Metrics/Metrics';
import { History } from '@/components/History/History';
import { Footer } from '@/components/Footer/Footer';
import { cases } from '@/content/copy';

/**
 * The one-pager. Section order from CLAUDE.md:
 *   Hero → Divider → Marquee → Cases → Carousel → About → Metrics → History → Footer
 *
 * Still to come: the carousel (step 6), the menu overlay and contact modal (step 7), the intro
 * overlay (step 3), and the back-to-top button.
 */
export default function Page() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [, setContactOpen] = useState(false);
  const [, setFooterUp] = useState(false);

  const openContact = useCallback(() => setContactOpen(true), []);
  const handleFooterRise = useCallback((up: boolean) => setFooterUp(up), []);

  return (
    <>
      <Nav
        menuOpen={menuOpen}
        onToggleMenu={() => setMenuOpen((v) => !v)}
        onContact={openContact}
      />
      <main>
        <Hero onContact={openContact} />
        <Divider />
        <Marquee />

        {/* Cases 01–04. Panels stack by ascending z-index so each covers the previous. */}
        {cases.map((c, i) => (
          <CasePanel key={c.slug} data={c} index={i} />
        ))}

        <About />
        <Metrics />
        <History />
        <Footer onContact={openContact} onRiseChange={handleFooterRise} />
      </main>
    </>
  );
}
