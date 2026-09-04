"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useOverlay } from "@/hooks/useOverlay";
import { useLanguage } from "@/lib/language";
import { hacking as copy, craftGate } from "@/content/copy";
import styles from "./Hacking.module.css";

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

/**
 * Seconds between spawns, tightening as the run goes on — and two extra spawns that switch on
 * later, so the field thickens without the interval alone having to carry it.
 */
const SPAWN_START = 0.82;
const SPAWN_FLOOR = 0.17;

/* Three lives, and 1.8s of grace after losing one. */
const LIVES = 3;
const INVULNERABLE = 1.8;
/*
 * On respawn, everything within this radius is cleared. Without it the ship comes back inside the
 * shell that just killed it and loses the next life on the following frame, which reads as the
 * game cheating rather than as a mistake.
 */
const CLEAR_RADIUS = 120;

type Vec = { x: number; y: number };
type Bullet = Vec & { vx: number; vy: number; angle: number; alive: boolean };
type Enemy = Vec & {
  kind: "red" | "black";
  hp: number;
  vx: number;
  vy: number;
  hit: number; // seconds of flash remaining
};

/*
 * Debris, in one array rather than three.
 *
 * Rings, chunks and sparks have different geometry and the same life: a clock, a maximum, and a
 * position. Keeping them in one list with `{t, max}` means one update loop and one draw pass, and
 * the alternative — three arrays that must each be stepped, filtered and drawn in the right order
 * — is three places for the same bug.
 */
type Part = Vec & {
  kind: "ring" | "chunk" | "spark";
  vx: number;
  vy: number;
  t: number;
  max: number;
  size: number;
  rot: number;
  spin: number;
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
export function Hacking({
  open,
  onClose,
  /**
   * The escritório opens this in a window over the room; /craft still gives it the whole screen.
   * Two modes rather than one change, because the craft start menu IS a full screen and putting
   * a card in the middle of it would frame a screen inside a screen.
   */
  windowed = false,
}: {
  open: boolean;
  onClose: () => void;
  windowed?: boolean;
}) {
  const { lang, t } = useLanguage();
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [phase, setPhase] = useState<"ready" | "playing" | "over">("ready");
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(LIVES);

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
  const parts = useRef<Part[]>([]);
  const frame = useRef(0);
  const scoreRef = useRef(0);
  /*
   * Lives and invulnerability live in refs as well as in state. The loop reads them sixty times a
   * second and must see the value from THIS frame; state inside the loop is the value from the
   * render that started it, which is how a single collision takes two lives.
   */
  const livesRef = useRef(LIVES);
  const invRef = useRef(0);

  useOverlay(wrapRef, open, onClose, { lockScroll: true });

  /* ------------------------------------------------------------- input */

  useEffect(() => {
    if (!open) return;
    const down = (e: KeyboardEvent) => {
      if (
        [
          "ArrowUp",
          "ArrowDown",
          "ArrowLeft",
          "ArrowRight",
          "w",
          "a",
          "s",
          "d",
          " ",
        ].includes(e.key)
      ) {
        /* The arrows scroll the page behind otherwise, which is not what a pilot expects. */
        e.preventDefault();
      }
      keys.current[e.key.toLowerCase()] = true;
    };
    const up = (e: KeyboardEvent) => {
      keys.current[e.key.toLowerCase()] = false;
    };
    window.addEventListener("keydown", down, { passive: false });
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
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

    canvas.addEventListener("pointermove", move);
    return () => canvas.removeEventListener("pointermove", move);
  }, [open, phase]);

  /* ------------------------------------------------------------- the run */

  const start = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    bullets.current = [];
    enemies.current = [];
    parts.current = [];
    scoreRef.current = 0;
    setScore(0);
    livesRef.current = LIVES;
    invRef.current = 0;
    setLives(LIVES);
    ship.current = { x: canvas.clientWidth / 2, y: canvas.clientHeight - 70 };
    aim.current = { x: 0, y: -1 };
    setPhase("playing");
  }, []);

  useEffect(() => {
    if (!open || phase !== "playing") return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
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
    window.addEventListener("resize", fit);

    let last = performance.now();
    let sinceShot = 0;
    let sinceSpawn = 0;
    let elapsed = 0;
    let stopped = false;

    const W = () => canvas.clientWidth;
    const H = () => canvas.clientHeight;

    const rnd = (a: number, b: number) => a + Math.random() * (b - a);

    /*
     * A shell coming apart, Contra-style: one expanding ring, twelve tumbling chunks and ten
     * sparks. The ring is what sells it — a flat flash reads as a light going out, a ring that
     * grows and thins reads as something bursting outwards.
     */
    const burst = (x: number, y: number) => {
      parts.current.push({
        kind: "ring",
        x,
        y,
        vx: 0,
        vy: 0,
        t: 0,
        max: 0.38,
        size: 0,
        rot: 0,
        spin: 0,
      });
      for (let i = 0; i < 12; i++) {
        const a = Math.random() * Math.PI * 2;
        const sp = rnd(90, 350);
        parts.current.push({
          kind: "chunk",
          x,
          y,
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp,
          t: 0,
          max: rnd(0.35, 0.7),
          size: rnd(2.5, 6.5),
          rot: Math.random() * Math.PI,
          spin: rnd(-9, 9),
        });
      }
      for (let i = 0; i < 10; i++) {
        const a = Math.random() * Math.PI * 2;
        const sp = rnd(120, 420);
        parts.current.push({
          kind: "spark",
          x,
          y,
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp,
          t: 0,
          max: rnd(0.18, 0.36),
          size: rnd(1, 2.2),
          rot: 0,
          spin: 0,
        });
      }
    };

    /*
     * A hit that does not kill. The sparks are thrown BACK along the bullet's own heading rather
     * than in a circle, so the shot visibly breaks on the shell instead of vanishing into it.
     */
    const shatter = (x: number, y: number, vx: number, vy: number) => {
      const back = Math.atan2(-vy, -vx);
      for (let i = 0; i < 6; i++) {
        const a = back + rnd(-0.75, 0.75);
        parts.current.push({
          kind: "spark",
          x,
          y,
          vx: Math.cos(a) * 300,
          vy: Math.sin(a) * 300,
          t: 0,
          max: rnd(0.14, 0.28),
          size: rnd(1, 2),
          rot: 0,
          spin: 0,
        });
      }
      for (let i = 0; i < 3; i++) {
        const a = back + rnd(-0.9, 0.9);
        parts.current.push({
          kind: "chunk",
          x,
          y,
          vx: Math.cos(a) * rnd(80, 200),
          vy: Math.sin(a) * rnd(80, 200),
          t: 0,
          max: rnd(0.25, 0.45),
          size: rnd(2, 4),
          rot: Math.random() * Math.PI,
          spin: rnd(-9, 9),
        });
      }
    };

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
        const speed = 140 + Math.min(150, elapsed * 3.6);
        enemies.current.push({
          kind: "black",
          x,
          y,
          hp: 1,
          vx: (dx / len) * speed,
          vy: (dy / len) * speed,
          hit: 0,
        });
      } else {
        enemies.current.push({
          kind: "red",
          x,
          y,
          hp: RED_HP,
          vx: (Math.random() - 0.5) * 90,
          vy: 100 + Math.min(130, elapsed * 3.1),
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
        Math.min(W() - SHIP_RADIUS, ship.current.x + dx * SHIP_SPEED * dt),
      );
      ship.current.y = Math.max(
        SHIP_RADIUS,
        Math.min(H() - SHIP_RADIUS, ship.current.y + dy * SHIP_SPEED * dt),
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
        if (b.y < -30 || b.y > H() + 30 || b.x < -30 || b.x > W() + 30)
          b.alive = false;
      }

      /* ---- spawning ---- */
      sinceSpawn += dt;
      const interval = Math.max(SPAWN_FLOOR, SPAWN_START - elapsed * 0.028);
      if (sinceSpawn >= interval) {
        sinceSpawn = 0;
        spawn();
        /*
         * Two extra spawns that switch on later in the run. The interval alone cannot thicken the
         * field past its own floor, and a wave that arrives together is a different problem to
         * solve than the same number of shells arriving one at a time.
         */
        if (elapsed > 18 && Math.random() < 0.45) spawn();
        if (elapsed > 42 && Math.random() < 0.3) spawn();
      }

      /* ---- enemies ---- */
      for (const e of enemies.current) {
        e.x += e.vx * dt;
        e.y += e.vy * dt;
        if (e.hit > 0) e.hit -= dt;
        if (e.kind === "red" && (e.x < RED_RADIUS || e.x > W() - RED_RADIUS))
          e.vx *= -1;
      }

      /* ---- bullets against reds only: blacks pass through, which is the rule ---- */
      for (const b of bullets.current) {
        if (!b.alive) continue;
        for (const e of enemies.current) {
          if (e.kind !== "red" || e.hp <= 0) continue;
          if (Math.hypot(b.x - e.x, b.y - e.y) < RED_RADIUS + 3) {
            b.alive = false;
            e.hp -= 1;
            e.hit = 0.12;
            if (e.hp <= 0) {
              burst(e.x, e.y);
              scoreRef.current += 100;
              setScore(scoreRef.current);
            } else {
              shatter(b.x, b.y, b.vx, b.vy);
            }
            break;
          }
        }
      }

      /* ---- the ship ---- */
      if (invRef.current > 0) invRef.current = Math.max(0, invRef.current - dt);

      if (invRef.current === 0) {
        for (const e of enemies.current) {
          if (e.hp <= 0) continue;
          const r = e.kind === "red" ? RED_RADIUS : BLACK_RADIUS;
          if (
            Math.hypot(ship.current.x - e.x, ship.current.y - e.y) <
            r + SHIP_RADIUS
          ) {
            burst(ship.current.x, ship.current.y);
            livesRef.current -= 1;
            setLives(livesRef.current);

            if (livesRef.current <= 0) {
              stopped = true;
              setPhase("over");
              return;
            }

            /* Grace, and a clear space to spend it in. */
            invRef.current = INVULNERABLE;
            for (const other of enemies.current) {
              if (
                Math.hypot(ship.current.x - other.x, ship.current.y - other.y) <
                CLEAR_RADIUS
              ) {
                other.hp = 0;
              }
            }
            break;
          }
        }
      }

      /* ---- debris ---- */
      for (const q of parts.current) {
        q.t += dt;
        q.x += q.vx * dt;
        q.y += q.vy * dt;
        if (q.kind !== "ring") {
          /* Drag, so chunks decelerate into their arc instead of flying off at a constant rate. */
          const drag = Math.max(0, 1 - 2.6 * dt);
          q.vx *= drag;
          q.vy *= drag;
          q.rot += q.spin * dt;
        }
      }
      parts.current = parts.current.filter((q) => q.t < q.max);

      bullets.current = bullets.current.filter((b) => b.alive);
      enemies.current = enemies.current.filter(
        (e) => e.hp > 0 && e.y < H() + 40 && e.x > -60 && e.x < W() + 60,
      );

      /* ---- draw ---- */
      ctx.clearRect(0, 0, W(), H());

      /* Bullets: white streaks with a bloom, as in the credits sequence. */
      ctx.save();
      ctx.shadowColor = "rgba(255,255,255,0.9)";
      ctx.shadowBlur = 12;
      ctx.fillStyle = "#fff";
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
        if (e.kind === "red") {
          /* Brightness carries remaining hp, so damage is legible without a bar. */
          const heat = e.hit > 0 ? 1 : 0.45 + (e.hp / RED_HP) * 0.55;
          ctx.shadowColor = `rgba(255,70,40,${heat})`;
          ctx.shadowBlur = 22;
          ctx.fillStyle =
            e.hit > 0
              ? "#fff"
              : `rgba(${230 + 25 * heat},${40 + 30 * heat},${45},1)`;
          ctx.beginPath();
          ctx.arc(e.x, e.y, RED_RADIUS, 0, Math.PI * 2);
          ctx.fill();
        } else {
          /*
           * A black circle on a black field would be invisible, which is unfair rather than
           * difficult. It gets a bright rim and a faint halo — present, readable, and still
           * obviously not the thing you are meant to shoot.
           */
          ctx.shadowColor = "rgba(210,210,225,0.5)";
          ctx.shadowBlur = 16;
          ctx.fillStyle = "#07070a";
          ctx.beginPath();
          ctx.arc(e.x, e.y, BLACK_RADIUS, 0, Math.PI * 2);
          ctx.fill();
          ctx.lineWidth = 1.6;
          ctx.strokeStyle = "rgba(226,226,238,0.85)";
          ctx.stroke();
        }
        ctx.restore();
      }

      /* ---- debris, under the ship ---- */
      for (const q of parts.current) {
        const u = q.t / q.max; // 0 at birth, 1 at death
        ctx.save();
        if (q.kind === "ring") {
          /*
           * White for the first 45%, then the enemy red. The colour change is what reads as heat
           * leaving the explosion; a ring that stays one colour reads as a circle animating.
           */
          ctx.strokeStyle = u < 0.45 ? "#fff" : "#e6402d";
          ctx.shadowColor = ctx.strokeStyle;
          ctx.shadowBlur = 16;
          ctx.lineWidth = 7 - u * 6;
          ctx.globalAlpha = 1 - u;
          ctx.beginPath();
          ctx.arc(q.x, q.y, 6 + u * 46, 0, Math.PI * 2);
          ctx.stroke();
        } else if (q.kind === "chunk") {
          ctx.globalAlpha = 1 - u;
          ctx.fillStyle = "#e6402d";
          ctx.shadowColor = "rgba(230,64,45,0.8)";
          ctx.shadowBlur = 10;
          ctx.translate(q.x, q.y);
          ctx.rotate(q.rot);
          ctx.fillRect(-q.size / 2, -q.size / 2, q.size, q.size);
        } else {
          ctx.globalAlpha = 1 - u;
          ctx.fillStyle = "#ffb59d";
          ctx.shadowColor = "rgba(255,181,157,0.9)";
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(q.x, q.y, q.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      /* ---- the ship, and the wing flying with it ---- */
      const ang = Math.atan2(aim.current.y, aim.current.x);

      /*
       * The spare lives fly the wing. The count is min(2, lives - 1), so the formation shortens
       * as you lose them — the same number the header shows, said in the place the player is
       * actually looking.
       */
      const hull = (scale: number, alpha: number) => {
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.moveTo(0, (-SHIP_RADIUS - 2) * scale);
        ctx.lineTo(SHIP_RADIUS * scale, SHIP_RADIUS * scale);
        ctx.lineTo(0, SHIP_RADIUS * 0.45 * scale);
        ctx.lineTo(-SHIP_RADIUS * scale, SHIP_RADIUS * scale);
        ctx.closePath();
        ctx.fill();
      };

      ctx.save();
      ctx.shadowColor = "rgba(255,255,255,0.85)";
      ctx.shadowBlur = 14;
      ctx.fillStyle = "#fff";

      const escorts = Math.min(2, livesRef.current - 1);
      /* Perpendicular to the aim, so the wing stays abreast however the ship is pointing. */
      const px = -aim.current.y;
      const py = aim.current.x;
      for (let i = 0; i < escorts; i++) {
        const side = i === 0 ? 1 : -1;
        const wobble = Math.sin(now / 250 + i * 2.1) * 3.5;
        const ex =
          ship.current.x + px * side * 31 - aim.current.x * 19 + px * wobble;
        const ey =
          ship.current.y + py * side * 31 - aim.current.y * 19 + py * wobble;
        ctx.save();
        ctx.translate(ex, ey);
        ctx.rotate(ang + Math.PI / 2);
        hull(0.6, 0.75);
        ctx.restore();
      }

      /*
       * Blinking while invulnerable. Sampled from the clock rather than counted in frames, so the
       * rate is 90ms on any refresh rate instead of 90ms only at 60fps.
       */
      const blink = invRef.current > 0 && Math.floor(now / 90) % 2 === 0;
      ctx.save();
      /* The hull turns to face the aim, so where it points and where it fires are the same. */
      ctx.translate(ship.current.x, ship.current.y);
      ctx.rotate(ang + Math.PI / 2);
      hull(1, blink ? 0.25 : 1);
      ctx.restore();

      ctx.restore();

      frame.current = requestAnimationFrame(step);
    };

    frame.current = requestAnimationFrame(step);

    return () => {
      stopped = true;
      cancelAnimationFrame(frame.current);
      window.removeEventListener("resize", fit);
    };
  }, [open, phase]);

  return (
    <div
      ref={wrapRef}
      className={`${styles.root} ${open ? styles.open : ""} ${windowed ? styles.windowed : ""} nierSurface`}
      role="dialog"
      aria-modal="true"
      aria-label={t(copy.title)}
      aria-hidden={!open}
    >
      <div className={styles.panel}>
        <div className={styles.head}>
          <span className={styles.system}>{t(copy.system)}</span>
          <h2 className={styles.title}>{t(copy.title)}</h2>

          <div className={styles.readout}>
            {/*
             * The triangles are the wing, read from the header instead of from the field. They are
             * marked as one label with a number rather than as three graphics, so a screen reader
             * says "lives, 3" and not "triangle triangle triangle".
             */}
            <span className={styles.livesBlock}>
              {t(copy.lives)}{" "}
              <span
                className={styles.pips}
                role="img"
                aria-label={`${t(copy.lives)}: ${lives}`}
              >
                {Array.from({ length: LIVES }, (_, i) => (
                  <i
                    key={i}
                    className={`${styles.pip} ${i < lives ? styles.pipOn : ""}`}
                  />
                ))}
              </span>
            </span>
            <span>
              {t(copy.score)} <b>{String(score).padStart(5, "0")}</b>
            </span>
            <button type="button" className={styles.quit} onClick={onClose}>
              {t(copy.quit)}
            </button>
          </div>
        </div>

        <div className={styles.arena}>
          <canvas ref={canvasRef} className={styles.canvas} />

          {phase !== "playing" && (
            <div className={styles.curtain}>
              {phase === "over" && (
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
                {phase === "over" ? t(copy.retry) : t(copy.start)}
              </button>
            </div>
          )}
        </div>

        {/* Same credit as every other borrowed screen. */}
        <p className={styles.credit}>{t(craftGate.credit)}</p>
      </div>
    </div>
  );
}
