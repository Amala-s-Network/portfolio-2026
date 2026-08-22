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

export function ButtonLink({
  children,
  variant,
  arrow = 'right',
  small,
  className,
  ...rest
}: CommonProps & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a className={classes({ children, variant, arrow, small, className })} {...rest}>
      <Inner arrow={arrow}>{children}</Inner>
    </a>
  );
}
