'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import { CopyIcon, CheckIcon } from './CopyIcon';
import { ButtonLink } from '@/components/Button/Button';
import { Reveal } from '@/components/Reveal/Reveal';
import { useReveal } from '@/hooks/useReveal';
import { useParallax } from '@/hooks/useParallax';
import { useLanguage } from '@/lib/language';
import { Mascot } from '@/components/Mascot/Mascot';
import { about as copy, mascot as mascotCopy, links } from '@/content/copy';
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
           * The portrait and the mascot share one hover area. Hovering the photo is what summons
           * him — the reader is already looking at João when the offer to know more appears.
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

            {/* TODO: the secret area does not exist yet — João has the page drafted elsewhere. */}
            <a className={styles.secretLink} href="#" aria-label={t(mascotCopy.label)}>
              <Mascot />
            </a>
          </span>

          <span className={styles.caption}>
            <span className={styles.diamond} aria-hidden="true" />
            {t(copy.portraitCaption)}
          </span>
        </Reveal>
      </div>

      <Reveal on={revealed} order={4} className={styles.metadata}>
        {copy.metadata.map((m, i) => (
          <span key={`l-${i}`} className={styles.metaLabel} style={{ gridColumn: i + 1 }}>
            {t(m.label)}
          </span>
        ))}
        {copy.metadata.map((m, i) => (
          <span key={`v-${i}`} className={styles.metaValue} style={{ gridColumn: i + 1 }}>
            {t(m.value)}
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
