'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useOverlay } from '@/hooks/useOverlay';
import { useLanguage } from '@/lib/language';
import { hacking as copy, craftGate } from '@/content/copy';
import styles from './Hacking.module.css';

/* ---------------------------------------------------------------- tuning */

const SHIP_SPEED = 320; // px per second
const SHIP_RADIUS = 9;
/*
 * Milliseconds between shots. The ship never stops firing — the player only aims and moves.
 *
 * 105 rather than 130 after watching a simulated run: at three hits per target and a third of
 * the field arriving as things you cannot shoot, the slower cadence meant a target could cross
 * the whole arena while you held aim on it and still leave. The rate is what makes aiming feel
 * answered.
 */
const FIRE_EVERY = 105;
const BULLET_SPEED = 560;
const BULLET_LENGTH = 16;

const RED_HP = 3; // João's rule: three shots each
const RED_RADIUS = 13;
const BLACK_RADIUS = 11;

/** Seconds between spawns, tightening as the run goes on. */
const SPAWN_START = 1.15;
const SPAWN_FLOOR = 0.38;

type Vec = { x: number; y: number };
type Bullet = Vec & { vx: number; vy: number; angle: number; alive: boolean };
type Enemy = Vec & {
  kind: 'red' | 'black';
  hp: number;
  vx: number;
  vy: number;
  hit: number; // seconds of flash remaining
};

/**
 * The hacking minigame, after the shooter in NieR: Automata's credits.
 *
 * The rules are João's and they are the interesting part: the ship fires by itself, red targets
 * take three hits, and the black ones IGNORE your fire entirely. That last one is what makes it
 * a game rather than a toy — shooting is automatic, so the only thing the player actually does
 * is move, and the blacks are the only reason moving matters.
 *
 * Written on a canvas rather than in DOM elements. At a few hundred moving objects, each one as
 * a div is a few hundred layout and paint operations per frame; on a canvas it is one.
 */
export function Hacking({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { lang, t } = useLanguage();
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [phase, setPhase] = useState<'ready' | 'playing' | 'over'>('ready');
  const [score, setScore] = useState(0);

  /* Everything the loop mutates lives in refs: state here would re-render sixty times a second. */
  const keys = useRef<Record<string, boolean>>({});
  const ship = useRef<Vec>({ x: 0, y: 0 });
  const bullets = useRef<Bullet[]>([]);
  /*
   * Where the guns are pointing. Defaults to straight up so the ship is never firing at nothing
   * before the pointer has been anywhere — a first shot into the floor would read as broken.
   */
  const aim = useRef<Vec>({ x: 0, y: -1 });
  const enemies = useRef<Enemy[]>([]);
  const frame = useRef(0);
  const scoreRef = useRef(0);

  useOverlay(wrapRef, open, onClose, { lockScroll: true });

  /* ------------------------------------------------------------- input */

  useEffect(() => {
    if (!open) return;
    const down = (e: KeyboardEvent) => {
      if (
        ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd', ' '].includes(e.key)
      ) {
        /* The arrows scroll the page behind otherwise, which is not what a pilot expects. */
        e.preventDefault();
      }
      keys.current[e.key.toLowerCase()] = true;
    };
    const up = (e: KeyboardEvent) => {
      keys.current[e.key.toLowerCase()] = false;
    };
    window.addEventListener('keydown', down, { passive: false });
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
      keys.current = {};
    };
  }, [open]);

  /*
   * The pointer aims; the keys move. Two hands doing two jobs, which is what makes the black
   * enemies survivable — you can retreat from one while still firing at the reds behind it.
   *
   * Tracked on the canvas rather than the window so the aim only follows a pointer that is
   * actually over the arena.
   */
  useEffect(() => {
    if (!open) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const move = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      const dx = e.clientX - r.left - ship.current.x;
      const dy = e.clientY - r.top - ship.current.y;
      const len = Math.hypot(dx, dy);
      /* Right on top of the ship there is no direction to speak of; keep the last one. */
      if (len < 6) return;
      aim.current = { x: dx / len, y: dy / len };
    };

    canvas.addEventListener('pointermove', move);
    return () => canvas.removeEventListener('pointermove', move);
  }, [open, phase]);

  /* ------------------------------------------------------------- the run */

  const start = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    bullets.current = [];
    enemies.current = [];
    scoreRef.current = 0;
    setScore(0);
    ship.current = { x: canvas.clientWidth / 2, y: canvas.clientHeight - 70 };
    aim.current = { x: 0, y: -1 };
    setPhase('playing');
  }, []);

  useEffect(() => {
    if (!open || phase !== 'playing') return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    /*
     * The canvas is sized in device pixels and scaled back down, or every line is soft on a
     * retina screen — the one place a game like this cannot afford to look approximate.
     */
    const fit = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    fit();
    window.addEventListener('resize', fit);

    let last = performance.now();
    let sinceShot = 0;
    let sinceSpawn = 0;
    let elapsed = 0;
    let stopped = false;

    const W = () => canvas.clientWidth;
    const H = () => canvas.clientHeight;

    const spawn = () => {
      /*
       * Blacks arrive as roughly a third of the wave and always aim at where the ship is now.
       * A black that drifted straight down would be a red you cannot shoot; aiming is what makes
       * it a threat you have to answer with movement.
       */
      /* Fewer of the unshootable ones in the opening seconds, so the first thing the player meets is
       * something their fire actually affects. */
      const black = Math.random() < (elapsed < 8 ? 0.22 : 0.34);
      const x = 30 + Math.random() * (W() - 60);
      const y = -20;

      if (black) {
        const dx = ship.current.x - x;
        const dy = ship.current.y - y;
        const len = Math.hypot(dx, dy) || 1;
        const speed = 92 + Math.min(70, elapsed * 2.2);
        enemies.current.push({
          kind: 'black',
          x,
          y,
          hp: 1,
          vx: (dx / len) * speed,
          vy: (dy / len) * speed,
          hit: 0,
        });
      } else {
        enemies.current.push({
          kind: 'red',
          x,
          y,
          hp: RED_HP,
          vx: (Math.random() - 0.5) * 40,
          vy: 62 + Math.min(60, elapsed * 1.8),
          hit: 0,
        });
      }
    };

    const step = (now: number) => {
      if (stopped) return;
      const dt = Math.min(0.05, (now - last) / 1000); // clamped: a stalled tab must not teleport
      last = now;
      elapsed += dt;

      /* ---- ship ---- */
      const k = keys.current;
      let dx = 0;
      let dy = 0;
      if (k.arrowleft || k.a) dx -= 1;
      if (k.arrowright || k.d) dx += 1;
      if (k.arrowup || k.w) dy -= 1;
      if (k.arrowdown || k.s) dy += 1;
      if (dx && dy) {
        /* Normalised, or diagonals would be 41% faster than the straight lines. */
        dx *= Math.SQRT1_2;
        dy *= Math.SQRT1_2;
      }
      ship.current.x = Math.max(
        SHIP_RADIUS,
        Math.min(W() - SHIP_RADIUS, ship.current.x + dx * SHIP_SPEED * dt)
      );
      ship.current.y = Math.max(
        SHIP_RADIUS,
        Math.min(H() - SHIP_RADIUS, ship.current.y + dy * SHIP_SPEED * dt)
      );

      /* ---- firing, which the player does not control ---- */
      sinceShot += dt * 1000;
      if (sinceShot >= FIRE_EVERY) {
        sinceShot = 0;
        const a = aim.current;
        bullets.current.push({
          x: ship.current.x + a.x * SHIP_RADIUS,
          y: ship.current.y + a.y * SHIP_RADIUS,
          vx: a.x * BULLET_SPEED,
          vy: a.y * BULLET_SPEED,
          /* Stored once at birth: the streak is drawn along its own path, not along the ship's. */
          angle: Math.atan2(a.y, a.x),
          alive: true,
        });
      }

      for (const b of bullets.current) {
        b.x += b.vx * dt;
        b.y += b.vy * dt;
        if (b.y < -30 || b.y > H() + 30 || b.x < -30 || b.x > W() + 30) b.alive = false;
      }

      /* ---- spawning ---- */
      sinceSpawn += dt;
      const interval = Math.max(SPAWN_FLOOR, SPAWN_START - elapsed * 0.02);
      if (sinceSpawn >= interval) {
        sinceSpawn = 0;
        spawn();
      }

      /* ---- enemies ---- */
      for (const e of enemies.current) {
        e.x += e.vx * dt;
        e.y += e.vy * dt;
        if (e.hit > 0) e.hit -= dt;
        if (e.kind === 'red' && (e.x < RED_RADIUS || e.x > W() - RED_RADIUS)) e.vx *= -1;
      }

      /* ---- bullets against reds only: blacks pass through, which is the rule ---- */
      for (const b of bullets.current) {
        if (!b.alive) continue;
        for (const e of enemies.current) {
          if (e.kind !== 'red' || e.hp <= 0) continue;
          if (Math.hypot(b.x - e.x, b.y - e.y) < RED_RADIUS + 3) {
            b.alive = false;
            e.hp -= 1;
            e.hit = 0.12;
            if (e.hp <= 0) {
              scoreRef.current += 100;
              setScore(scoreRef.current);
            }
            break;
          }
        }
      }

      /* ---- the ship ---- */
      for (const e of enemies.current) {
        if (e.hp <= 0) continue;
        const r = e.kind === 'red' ? RED_RADIUS : BLACK_RADIUS;
        if (Math.hypot(ship.current.x - e.x, ship.current.y - e.y) < r + SHIP_RADIUS) {
          stopped = true;
          setPhase('over');
          return;
        }
      }

      bullets.current = bullets.current.filter((b) => b.alive);
      enemies.current = enemies.current.filter((e) => e.hp > 0 && e.y < H() + 40 && e.x > -60 && e.x < W() + 60);

      /* ---- draw ---- */
      ctx.clearRect(0, 0, W(), H());

      /* Bullets: white streaks with a bloom, as in the credits sequence. */
      ctx.save();
      ctx.shadowColor = 'rgba(255,255,255,0.9)';
      ctx.shadowBlur = 12;
      ctx.fillStyle = '#fff';
      for (const b of bullets.current) {
        /* Rotated to its own heading — which is what gives the diagonal streaks of the credits. */
        ctx.save();
        ctx.translate(b.x, b.y);
        ctx.rotate(b.angle + Math.PI / 2);
        ctx.fillRect(-2, -BULLET_LENGTH / 2, 4, BULLET_LENGTH);
        ctx.restore();
      }
      ctx.restore();

      for (const e of enemies.current) {
        ctx.save();
        if (e.kind === 'red') {
          /* Brightness carries remaining hp, so damage is legible without a bar. */
          const heat = e.hit > 0 ? 1 : 0.45 + (e.hp / RED_HP) * 0.55;
          ctx.shadowColor = `rgba(255,70,40,${heat})`;
          ctx.shadowBlur = 22;
          ctx.fillStyle = e.hit > 0 ? '#fff' : `rgba(${230 + 25 * heat},${40 + 30 * heat},${45},1)`;
          ctx.beginPath();
          ctx.arc(e.x, e.y, RED_RADIUS, 0, Math.PI * 2);
          ctx.fill();
        } else {
          /*
           * A black circle on a black field would be invisible, which is unfair rather than
           * difficult. It gets a bright rim and a faint halo — present, readable, and still
           * obviously not the thing you are meant to shoot.
           */
          ctx.shadowColor = 'rgba(210,210,225,0.5)';
          ctx.shadowBlur = 16;
          ctx.fillStyle = '#07070a';
          ctx.beginPath();
          ctx.arc(e.x, e.y, BLACK_RADIUS, 0, Math.PI * 2);
          ctx.fill();
          ctx.lineWidth = 1.6;
          ctx.strokeStyle = 'rgba(226,226,238,0.85)';
          ctx.stroke();
        }
        ctx.restore();
      }

      /* The ship: a small arrow, drawn last so nothing paints over the thing you are steering. */
      ctx.save();
      ctx.shadowColor = 'rgba(255,255,255,0.85)';
      ctx.shadowBlur = 14;
      ctx.fillStyle = '#fff';
      /* The hull turns to face the aim, so where it points and where it fires are the same. */
      ctx.translate(ship.current.x, ship.current.y);
      ctx.rotate(Math.atan2(aim.current.y, aim.current.x) + Math.PI / 2);
      ctx.beginPath();
      ctx.moveTo(0, -SHIP_RADIUS - 2);
      ctx.lineTo(SHIP_RADIUS, SHIP_RADIUS);
      ctx.lineTo(0, SHIP_RADIUS * 0.45);
      ctx.lineTo(-SHIP_RADIUS, SHIP_RADIUS);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      frame.current = requestAnimationFrame(step);
    };

    frame.current = requestAnimationFrame(step);

    return () => {
      stopped = true;
      cancelAnimationFrame(frame.current);
      window.removeEventListener('resize', fit);
    };
  }, [open, phase]);

  return (
    <div
      ref={wrapRef}
      className={`${styles.root} ${open ? styles.open : ''} nierSurface`}
      role="dialog"
      aria-modal="true"
      aria-label={t(copy.title)}
      aria-hidden={!open}
    >
      <div className={styles.head}>
        <span className={styles.system}>{t(copy.system)}</span>
        <h2 className={styles.title}>{t(copy.title)}</h2>

        <div className={styles.readout}>
          <span>
            {t(copy.score)} <b>{String(score).padStart(5, '0')}</b>
          </span>
          <button type="button" className={styles.quit} onClick={onClose}>
            {t(copy.quit)}
          </button>
        </div>
      </div>

      <div className={styles.arena}>
        <canvas ref={canvasRef} className={styles.canvas} />

        {phase !== 'playing' && (
          <div className={styles.curtain}>
            {phase === 'over' && (
              <>
                <p className={styles.over}>{t(copy.over)}</p>
                <p className={styles.overNote}>{t(copy.overNote)}</p>
              </>
            )}

            <ul className={styles.instructions}>
              {copy.instructions[lang].map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </ul>

            <div className={styles.legend}>
              <span className={styles.legendItem}>
                <i className={styles.dotRed} aria-hidden="true" />
                {t(copy.legend.red)}
              </span>
              <span className={styles.legendItem}>
                <i className={styles.dotBlack} aria-hidden="true" />
                {t(copy.legend.black)}
              </span>
            </div>

            <button type="button" className={styles.start} onClick={start}>
              <span className={styles.mark} aria-hidden="true" />
              {phase === 'over' ? t(copy.retry) : t(copy.start)}
            </button>
          </div>
        )}
      </div>

      {/* Same credit as every other borrowed screen. */}
      <p className={styles.credit}>{t(craftGate.credit)}</p>
    </div>
  );
}
