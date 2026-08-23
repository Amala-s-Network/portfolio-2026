import Link from 'next/link';
import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from 'react';
import styles from './Button.module.css';

type Variant = 'filled' | 'outline';
/** Which character trails the label, and therefore which axis it drifts on. */
type Arrow = 'right' | 'down' | 'up' | 'none';

const ARROW_CHAR: Record<Exclude<Arrow, 'none'>, string> = {
  right: '⇢',
  down: '↓',
  up: '⇡',
};

type CommonProps = {
  children: ReactNode;
  variant?: Variant;
  arrow?: Arrow;
  small?: boolean;
  className?: string;
};

function classes({ variant = 'filled', arrow = 'right', small, className }: CommonProps) {
  return [
    styles.button,
    styles[variant],
    small ? styles.small : '',
    arrow === 'down' ? styles.down : '',
    arrow === 'up' ? styles.up : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');
}

function Inner({ children, arrow = 'right' }: Pick<CommonProps, 'children' | 'arrow'>) {
  return (
    <>
      <span className={styles.label}>{children}</span>
      {arrow !== 'none' && (
        <span className={styles.arrow} aria-hidden="true">
          {ARROW_CHAR[arrow]}
        </span>
      )}
    </>
  );
}

export function Button({
  children,
  variant,
  arrow = 'right',
  small,
  className,
  ...rest
}: CommonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={classes({ children, variant, arrow, small, className })} {...rest}>
      <Inner arrow={arrow}>{children}</Inner>
    </button>
  );
}

/**
 * An internal route goes through next/link; everything else stays a plain anchor.
 *
 * This mattered more than it looks. As a bare <a>, "ver todos os projetos" was a full document
 * navigation — the bundle re-evaluated, every module reset, and the intro's "already played"
 * flag with it. Walking home from the projects page therefore replayed the vignette, which is
 * the exact thing it is now written to avoid. Client-side navigation keeps the document, and
 * with it everything the page has learned since it loaded.
 *
 * Hashes, mailto:, tel: and external URLs are deliberately left alone: Link has nothing to
 * offer them and would only get in the way of the browser's own handling.
 */
export function ButtonLink({
  children,
  variant,
  arrow = 'right',
  small,
  className,
  href,
  ...rest
}: CommonProps & AnchorHTMLAttributes<HTMLAnchorElement>) {
  const cls = classes({ children, variant, arrow, small, className });
  const inner = <Inner arrow={arrow}>{children}</Inner>;
  const internal = typeof href === 'string' && href.startsWith('/') && !href.startsWith('//');

  if (internal) {
    return (
      <Link className={cls} href={href} {...rest}>
        {inner}
      </Link>
    );
  }

  return (
    <a className={cls} href={href} {...rest}>
      {inner}
    </a>
  );
}
