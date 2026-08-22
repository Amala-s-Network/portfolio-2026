'use client';

import type { ElementType, ReactNode } from 'react';
import styles from './Reveal.module.css';

/** 260ms apart, per README "Entrance cascade". */
const STEP_MS = 260;

type RevealProps = {
  children: ReactNode;
  /** Author-declared position in the cascade (README's `data-order`). */
  order?: number;
  /** Whether the parent section has fired. */
  on: boolean;
  /** The portrait also scales from .985. */
  scaled?: boolean;
  as?: ElementType;
  className?: string;
};

export function Reveal({
  children,
  order = 0,
  on,
  scaled,
  as: Tag = 'div',
  className,
}: RevealProps) {
  const cls = [styles.item, scaled ? styles.scaled : '', on ? styles.on : '', className ?? '']
    .filter(Boolean)
    .join(' ');

  return (
    <Tag className={cls} style={{ '--revealDelay': `${order * STEP_MS}ms` } as React.CSSProperties}>
      {children}
    </Tag>
  );
}
