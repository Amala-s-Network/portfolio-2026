'use client';

import type { CSSProperties, ElementType, ReactNode } from 'react';
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
  /*
   * Passed through to the rendered element. The component owns --revealDelay and merges anything
   * given here on top of it, so a caller can position or colour the element without having to
   * add a wrapper div purely to hold one property — which is what the alternative was.
   */
  style?: CSSProperties;
  /** For elements that are conditionally present, like the case page's argument block. */
  hidden?: boolean;
};

export function Reveal({
  children,
  order = 0,
  on,
  scaled,
  as: Tag = 'div',
  className,
  style,
  hidden,
}: RevealProps) {
  const cls = [styles.item, scaled ? styles.scaled : '', on ? styles.on : '', className ?? '']
    .filter(Boolean)
    .join(' ');

  return (
    <Tag
      className={cls}
      hidden={hidden}
      style={{ '--revealDelay': `${order * STEP_MS}ms`, ...style } as React.CSSProperties}
    >
      {children}
    </Tag>
  );
}
