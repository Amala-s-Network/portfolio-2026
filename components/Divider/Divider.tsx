import styles from './Divider.module.css';

/** README §3. Period is 7s and explicitly "tweakable", so it is exposed as a prop. */
export function Divider({ period = '7s' }: { period?: string }) {
  return (
    <div className={styles.track} aria-hidden="true">
      <div className={styles.bar} style={{ '--fill-period': period } as React.CSSProperties} />
    </div>
  );
}
