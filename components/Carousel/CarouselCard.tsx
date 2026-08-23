'use client';

import { useRef } from 'react';
import { useParallax } from '@/hooks/useParallax';
import { useLanguage } from '@/lib/language';
import type { Project } from '@/content/copy';
import styles from './Carousel.module.css';

export function CarouselCard({ data }: { data: Project }) {
  const { t } = useLanguage();
  const innerRef = useRef<HTMLDivElement>(null);

  // README "Parallax": carousel images carry 26px.
  useParallax(innerRef, 26);

  return (
    <article className={styles.card}>
      <div className={styles.frame}>
        <div ref={innerRef} className={styles.frameInner}>
          {/*
           * Generated placeholder — see assets/placeholders/README.md. content/copy.ts keeps
           * image: null as the real state until João supplies the 16:9 artwork.
           */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={data.image ?? `/placeholders/projects/${data.slug}.svg`}
            alt=""
            aria-hidden="true"
            draggable={false}
          />
        </div>
      </div>
      <p className={styles.name}>{t(data.name)}</p>
      <p className={styles.company}>{t(data.company)}</p>
    </article>
  );
}
