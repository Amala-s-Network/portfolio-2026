'use client';

import { useState } from 'react';
import { Nav } from '@/components/Nav/Nav';
import { Hero } from '@/components/Hero/Hero';
import { Divider } from '@/components/Divider/Divider';
import { Marquee } from '@/components/Marquee/Marquee';

/**
 * The one-pager. Sections land in the order given by CLAUDE.md:
 *   Hero → Divider → Marquee → Cases → Carousel → About → Metrics → History → Footer
 *
 * Built so far: steps 1 and 3 (nav, hero without the sphere, divider, marquee). The divider and
 * marquee are here early because the 1366×768 budget is measured across all four.
 */
export default function Page() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <>
      <Nav
        menuOpen={menuOpen}
        onToggleMenu={() => setMenuOpen((v) => !v)}
        onContact={() => setContactOpen(true)}
      />
      <main>
        <Hero onContact={() => setContactOpen(true)} />
        <Divider />
        <Marquee />
      </main>
    </>
  );
}
