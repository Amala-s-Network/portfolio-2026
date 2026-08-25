'use client';

import { useLanguage } from '@/lib/language';
import type { CaseMarkSpec } from '@/content/copy';
import styles from './CaseMark.module.css';

/**
 * Figures drawn in code, for the parts of a case that are a shape rather than a sentence.
 *
 * "40% of the calls were only asking about status" is a proportion, and a proportion set as prose
 * asks the reader to picture it themselves. Drawn, it is understood before it is read. Same for a
 * conversation that used to leave through five channels and now leaves through one, or a journey
 * that breaks in the middle: those are diagrams that were being described.
 *
 * Everything here is SVG in currentColor, so a mark inherits the ink of whatever spread it lands
 * on and works on paper and on the dark band without a second palette. No images, no icon font,
 * nothing to load.
 */
export function CaseMark({ spec }: { spec: CaseMarkSpec }) {
  const { t } = useLanguage();

  return (
    <figure className={styles.root}>
      <div className={styles.plate}>{draw(spec)}</div>
      <figcaption className={styles.caption}>{t(spec.caption)}</figcaption>
    </figure>
  );
}

function draw(spec: CaseMarkSpec) {
  switch (spec.kind) {
    case 'share':
      return <Share value={spec.value ?? 0} />;
    case 'converge':
      return <Converge from={spec.from ?? 5} />;
    case 'split':
      return <Split />;
    case 'steps':
      return <Steps count={spec.from ?? 4} at={spec.to ?? 1} />;
  }
}

/**
 * A hundred squares, of which `value` are inked.
 *
 * A bar would carry the same number in less space and say less. The grid is countable — the
 * reader can check it — and a proportion the reader can check is the whole reason this site
 * draws its own figures instead of asserting them.
 */
function Share({ value }: { value: number }) {
  const cells = Array.from({ length: 100 }, (_, i) => i);
  const filled = Math.round(value);

  return (
    <svg viewBox="0 0 106 106" className={styles.svg} role="img" aria-label={`${filled} de 100`}>
      {cells.map((i) => {
        const x = (i % 10) * 10.6;
        const y = Math.floor(i / 10) * 10.6;
        const on = i < filled;
        return (
          <rect
            key={i}
            x={x}
            y={y}
            width="7.4"
            height="7.4"
            fill="currentColor"
            opacity={on ? 1 : 0.16}
          />
        );
      })}
    </svg>
  );
}

/** Many ways in, one way out. The As Is beside the To Be, in one picture. */
function Converge({ from }: { from: number }) {
  const lines = Array.from({ length: from }, (_, i) => i);
  const span = 120;
  const step = span / (from - 1 || 1);

  return (
    <svg viewBox="0 0 200 130" className={styles.svg} role="img" aria-label="Vários canais em um só">
      <g fill="none" stroke="currentColor" strokeWidth="1.2">
        {lines.map((i) => {
          const y = 5 + i * step;
          return <path key={i} d={`M0 ${y} H58 C104 ${y} 96 65 148 65`} opacity="0.55" />;
        })}
        <path d="M148 65 H200" strokeWidth="2.4" />
      </g>
      {lines.map((i) => (
        <circle key={i} cx="0" cy={5 + i * step} r="2.6" fill="currentColor" opacity="0.55" />
      ))}
      <circle cx="200" cy="65" r="4" fill="currentColor" />
    </svg>
  );
}

/** One path that stops, and starts again somewhere else. The break in the middle of a journey. */
function Split() {
  return (
    <svg viewBox="0 0 200 90" className={styles.svg} role="img" aria-label="A jornada interrompida">
      <g fill="none" stroke="currentColor" strokeWidth="2.4">
        <path d="M0 45 H78" />
        <path d="M122 45 H200" />
      </g>
      {/* The gap, marked rather than merely left empty. */}
      <g stroke="currentColor" strokeWidth="1.2" opacity="0.5">
        <path d="M86 26 V64" />
        <path d="M114 26 V64" />
      </g>
      <circle cx="0" cy="45" r="4" fill="currentColor" />
      <circle cx="200" cy="45" r="4" fill="currentColor" />
      <text
        x="100"
        y="49"
        fill="currentColor"
        opacity="0.6"
        fontSize="15"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        ✕
      </text>
    </svg>
  );
}

/** A run of stages with one of them marked: where in the pipeline the question was being asked. */
function Steps({ count, at }: { count: number; at: number }) {
  const nodes = Array.from({ length: count }, (_, i) => i);
  const span = 186;
  const step = span / (count - 1 || 1);

  return (
    <svg viewBox="0 0 200 60" className={styles.svg} role="img" aria-label={`Etapa ${at + 1} de ${count}`}>
      <path d="M7 30 H193" stroke="currentColor" strokeWidth="1.2" opacity="0.3" fill="none" />
      {nodes.map((i) => {
        const x = 7 + i * step;
        const on = i === at;
        return on ? (
          <g key={i}>
            <circle cx={x} cy="30" r="9" fill="none" stroke="currentColor" strokeWidth="1.2" />
            <circle cx={x} cy="30" r="4.5" fill="currentColor" />
          </g>
        ) : (
          <circle key={i} cx={x} cy="30" r="4.5" fill="currentColor" opacity="0.28" />
        );
      })}
    </svg>
  );
}
