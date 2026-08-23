'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import { CopyIcon, CheckIcon } from './CopyIcon';
import { ButtonLink } from '@/components/Button/Button';
import { Reveal } from '@/components/Reveal/Reveal';
import { useReveal } from '@/hooks/useReveal';
import { useParallax } from '@/hooks/useParallax';
import { useLanguage } from '@/lib/language';
import { about as copy, links } from '@/content/copy';
import portrait from '@/public/retrato.webp';
import styles from './About.module.css';

export function About() {
  const { lang, t } = useLanguage();
  const sectionRef = useRef<HTMLElement>(null);
  const portraitImgRef = useRef<HTMLImageElement>(null);
  const revealed = useReveal(sectionRef);
  const [copied, setCopied] = useState(false);
  const resetRef = useRef<number | undefined>(undefined);

  // README "Parallax": the portrait carries 46px.
  useParallax(portraitImgRef, 46);

  /* README §7: clicking writes the address and swaps the label for 1.6s. */
  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(links.email);
      setCopied(true);
      window.clearTimeout(resetRef.current);
      resetRef.current = window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard can be blocked by permissions or an insecure origin; leave the label alone
      // rather than claiming a copy that did not happen.
    }
  };

  /* Cascade order (README): folio → H2 → text → portrait → metadata → actions. */
  return (
    <section ref={sectionRef} className={styles.section} id="sobre">
      <Reveal on={revealed} order={0} className={styles.folio}>
        <span>{t(copy.folioLeft)}</span>
        <span>{t(copy.folioRight)}</span>
      </Reveal>

      <div className={styles.body}>
        <div>
          <Reveal on={revealed} order={1}>
            <h2 className={styles.heading}>{t(copy.heading)}</h2>
          </Reveal>

          <Reveal on={revealed} order={2} className={styles.paragraphs}>
            {copy.paragraphs[lang].map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </Reveal>
        </div>

        <Reveal on={revealed} order={3} scaled className={styles.portraitCol}>
          {/*
           * The mascot used to stand to the left of this photo and appear on hover, offering a
           * way into a secret area. He is switched off, not deleted: the page he pointed at was
           * never built, so the reveal was an invitation to a dead link — and João intends to
           * build that area properly later. The <Mascot /> component and its copy stay in the
           * repo for that. What is left here is the portrait's own lift on hover.
           */}
          <span className={styles.portraitStage}>
            <a
              className={styles.portraitLink}
              href={links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Image
                ref={portraitImgRef}
                src={portrait}
                alt="Retrato de João Vitor Melo"
                width={470}
                height={470}
              />
            </a>
          </span>

          <span className={styles.caption}>
            <span className={styles.diamond} aria-hidden="true" />
            {t(copy.portraitCaption)}
          </span>
        </Reveal>
      </div>

      <Reveal on={revealed} order={4} className={styles.metadata}>
        {/*
          * Each label sits next to its own value in the DOM. The previous version emitted all
          * four labels and then all four values, which the desktop grid hid by placing them into
          * explicit rows — but stacked into one column on mobile the DOM order showed through and
          * every label was orphaned from its text.
          *
          * The wrapper is display: contents on desktop, so the grid still sees eight individual
          * cells and can align them in two rows; on mobile it becomes a block and each pair holds
          * together on its own.
          */}
        {copy.metadata.map((m, i) => (
          <span key={i} className={styles.metaPair} style={{ '--metaCol': i + 1 } as React.CSSProperties}>
            <span className={styles.metaLabel}>{t(m.label)}</span>
            <span className={styles.metaValue}>{t(m.value)}</span>
          </span>
        ))}
      </Reveal>

      <Reveal on={revealed} order={5} className={styles.actions}>
        <ButtonLink href={links.cv} target="_blank" rel="noopener noreferrer" arrow="down">
          {t(copy.resume)}
        </ButtonLink>

        <button type="button" className={styles.copyEmail} onClick={copyEmail}>
          {copied ? (
            <CheckIcon size={17} className={styles.copyIcon} />
          ) : (
            <CopyIcon size={17} className={styles.copyIcon} />
          )}
          {copied ? t(copy.copyEmail) : links.email}
        </button>
      </Reveal>
    </section>
  );
}
