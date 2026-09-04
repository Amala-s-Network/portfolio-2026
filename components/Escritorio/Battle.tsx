'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useOverlay } from '@/hooks/useOverlay';
import { useLanguage } from '@/lib/language';
import { escritorio as copy } from '@/content/copy';
import { drawFoe, type FoeClock } from './foe';
import styles from './Battle.module.css';

type Phase = 'ready' | 'busy' | 'won' | 'lost' | 'fled';
type Command = 'attack' | 'magic' | 'summon' | 'flee';

const rnd = (a: number, b: number) => a + Math.floor(Math.random() * (b - a + 1));

/** The damage number lands mid-sentence in Portuguese and at the end in English. */
const fill = (template: string, n: number) => template.replace('{n}', String(n));

const MAGIC_COST = 12;

/* Mounted only while the fight is up — see Escritorio.tsx. A fresh encounter is a fresh mount. */
export function Battle({ onClose }: { onClose: () => void }) {
  const { t } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);

  const [hp, setHp] = useState(100);
  const [mp, setMp] = useState(40);
  const [foe, setFoe] = useState(100);
  const [phase, setPhase] = useState<Phase>('ready');
  const [log, setLog] = useState<string>(() => t(copy.battle.log.opening));
  const [dmg, setDmg] = useState<string | null>(null);

  useOverlay(ref, true, onClose, { lockScroll: true });

  /*
   * The animation clock is a ref, not state. It is written every frame by the draw loop; in state
   * it would be sixty renders a second to move a hit timer that only the canvas ever reads.
   */
  const clock = useRef<FoeClock>({ hitT: 0, deadT: 0, last: 0 });

  /* Timers are collected so closing mid-turn cannot land a strike on an unmounted card. */
  const timers = useRef<number[]>([]);
  const later = useCallback((fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  }, []);
  const clearTimers = useCallback(() => {
    timers.current.forEach(window.clearTimeout);
    timers.current = [];
  }, []);

  const reset = useCallback(() => {
    clearTimers();
    clock.current = { hitT: 0, deadT: 0, last: 0 };
    setHp(100);
    setMp(40);
    setFoe(100);
    setPhase('ready');
    setDmg(null);
    setLog(t(copy.battle.log.opening));
  }, [clearTimers, t]);

  /* Every pending strike dies with the card, so a turn cannot land on an unmounted component. */
  useEffect(() => clearTimers, [clearTimers]);

  /* The draw loop. */
  useEffect(() => {
    let raf = 0;
    const loop = (now: number) => {
      const c = canvas.current;
      if (c) drawFoe(c, now, clock.current, foe);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [foe]);

  const foeStrike = useCallback(() => {
    setLog(t(copy.battle.log.raise));
    later(() => {
      const d = rnd(6, 14);
      setHp((prev) => {
        const next = Math.max(0, prev - d);
        setLog(next <= 0 ? t(copy.battle.log.lost) : fill(t(copy.battle.log.strike), d));
        setPhase(next <= 0 ? 'lost' : 'ready');
        return next;
      });
    }, 720);
  }, [later, t]);

  const hit = useCallback(
    (amount: number, message: string) => {
      clock.current.hitT = 0.5;
      setDmg(`−${amount}`);
      setPhase('busy');
      setLog(message);
      setFoe((prev) => {
        const next = Math.max(0, prev - amount);
        later(() => setDmg(null), 900);
        later(() => {
          if (next <= 0) {
            setPhase('won');
            setLog(t(copy.battle.log.won));
          } else {
            foeStrike();
          }
        }, 780);
        return next;
      });
    },
    [later, foeStrike, t],
  );

  /*
   * Memoised because it is an event handler that rolls dice. Left as a bare function in the
   * component body, the React compiler reads the Math.random() calls below as impure work done
   * during render — which is exactly the thing it should complain about, and here it is only
   * wrong about WHEN this runs.
   */
  const act = useCallback((kind: Command) => {
    if (phase !== 'ready') return;

    if (kind === 'attack') {
      const d = rnd(8, 15);
      hit(d, fill(t(copy.battle.log.attack), d));
      return;
    }

    if (kind === 'magic') {
      if (mp < MAGIC_COST) {
        setLog(t(copy.battle.log.noMana));
        return;
      }
      const d = rnd(18, 27);
      setMp((m) => m - MAGIC_COST);
      hit(d, fill(t(copy.battle.log.magic), d));
      return;
    }

    if (kind === 'summon') {
      /* Three in ten it answers nothing at all, and the axe comes down anyway. */
      if (Math.random() < 0.3) {
        setPhase('busy');
        setLog(t(copy.battle.log.summonFailed));
        later(foeStrike, 620);
        return;
      }
      const d = rnd(22, 34);
      hit(d, fill(t(copy.battle.log.summon), d));
      return;
    }

    if (Math.random() < 0.45) {
      setPhase('fled');
      setLog(t(copy.battle.log.fled));
      return;
    }
    setPhase('busy');
    setLog(t(copy.battle.log.blocked));
    later(foeStrike, 620);
  }, [phase, mp, hit, later, foeStrike, t]);

  const busy = phase !== 'ready';
  const ended = phase === 'won' || phase === 'lost' || phase === 'fled';
  const end = ended ? copy.battle.end[phase] : null;

  const commands: { kind: Command; c: (typeof copy.battle.commands)[Command] }[] = [
    { kind: 'attack', c: copy.battle.commands.attack },
    { kind: 'magic', c: copy.battle.commands.magic },
    { kind: 'summon', c: copy.battle.commands.summon },
    { kind: 'flee', c: copy.battle.commands.flee },
  ];

  return (
    <div className={`${styles.scrim} battleSurface`}>
      <div
        ref={ref}
        className={styles.card}
        data-pg-card
        role="dialog"
        aria-modal="true"
        aria-label={t(copy.battle.encounter)}
      >
        <header className={styles.head}>
          <span className={styles.encounter}>{t(copy.battle.encounter)}</span>
          <span className={styles.place}>{t(copy.battle.place)}</span>
          <button type="button" className={styles.close} onClick={onClose} aria-label={t(copy.battle.close)}>
            ✕
          </button>
        </header>

        <div className={styles.stage}>
          {/*
            * inset: 0 and absolute, NOT a percentage height. Against a min-height flex item a
            * percentage height falls back to the bitmap's intrinsic ratio — which drawFoe
            * rewrites every frame — and the figure walks off over the controls. The handoff
            * flags this one by name; do not undo it.
            */}
          <canvas ref={canvas} className={styles.canvas} aria-hidden="true" />
          {dmg && <span className={styles.dmg}>{dmg}</span>}
          <p className={styles.log}>{log}</p>

          {end && (
            <div className={styles.end}>
              <p className={styles.endTitle}>{t(end.title)}</p>
              <p className={styles.endNote}>{t(end.note)}</p>
              <button type="button" className={styles.again} onClick={reset}>
                {t(copy.battle.again)}
              </button>
            </div>
          )}
        </div>

        <footer className={styles.foot}>
          <div className={styles.vitals}>
            <span className={styles.heroName}>{t(copy.battle.hero)}</span>
            <div className={styles.hpTrack}>
              <span
                className={styles.hpFill}
                style={{ width: `${hp}%`, background: hp < 35 ? 'var(--ember)' : 'var(--amber)' }}
              />
            </div>
            <div className={styles.mpTrack}>
              <span className={styles.mpFill} style={{ width: `${(mp / 40) * 100}%` }} />
            </div>
            <span className={styles.numbers}>
              {hp} / 100 · {mp} / 40 MP
            </span>
          </div>

          <div className={styles.commands}>
            {commands.map(({ kind, c }) => {
              const off = busy || (kind === 'magic' && mp < MAGIC_COST);
              return (
                <button
                  key={kind}
                  type="button"
                  className={styles.command}
                  onClick={() => act(kind)}
                  disabled={off}
                >
                  <span className={styles.commandLabel}>{t(c.label)}</span>
                  <span className={styles.commandCost}>{t(c.cost)}</span>
                </button>
              );
            })}
          </div>
        </footer>
      </div>
    </div>
  );
}
