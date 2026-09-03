'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { Hacking } from '@/components/Hacking/Hacking';
import { useLanguage } from '@/lib/language';
import { playground as copy } from '@/content/copy';
import { Cat, type CatVariant } from './Cat';
import styles from './Playground.module.css';

/* The scene is drawn once, at this size, and scaled to whatever the page gives it. */
const W = 1000;
const H = 760;
/** Where the wall stops and the floor starts. Everything that stands, stands below this. */
const FLOOR = 545;

type Door = { id: string; href: string; label: string; frame: { x: number; y: number; w: number; h: number } };

/**
 * A cat's state. Positions are in scene units, feet on the ground.
 *
 * Kept in a ref and written straight to the DOM as transforms. Sixty React renders a second to
 * move three cats would be sixty reconciliations of an SVG with a few hundred nodes in it, to
 * change six numbers.
 */
type CatState = {
  x: number;
  y: number;
  dir: 1 | -1;
  speed: number;
  /* Seconds left of whatever it is doing. A cat that walks in a straight line forever is a bug. */
  wait: number;
  walking: boolean;
  phase: number;
};

export function Playground() {
  const { t } = useLanguage();
  const [playing, setPlaying] = useState(false);
  const [track, setTrack] = useState(0);

  const arcadeRef = useRef<HTMLButtonElement>(null);
  const catRefs = [useRef<SVGGElement>(null), useRef<SVGGElement>(null), useRef<SVGGElement>(null)];
  const barsRef = useRef<SVGGElement>(null);

  const doors: Door[] = [
    {
      id: 'projetos',
      href: '/projetos',
      label: t(copy.frames.projects),
      frame: { x: 40, y: 70, w: 210, h: 215 },
    },
    {
      id: 'interfaces',
      href: '/playground/interfaces',
      label: t(copy.frames.interfaces),
      frame: { x: 272, y: 88, w: 170, h: 197 },
    },
    {
      id: 'componentes',
      href: '/playground/componentes',
      label: t(copy.frames.components),
      frame: { x: 464, y: 112, w: 112, h: 173 },
    },
  ];

  const catVariants: CatVariant[] = ['tabby', 'white', 'black'];
  const catNames = [t(copy.cats.tabby), t(copy.cats.white), t(copy.cats.black)];

  /* ---- the cats, and the machine's little equaliser ---- */

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /*
     * Three cats, three floor lanes, three different opinions about moving.
     *
     * `wait` starts well above zero on purpose: the loop flips a cat between walking and sitting
     * whenever its timer runs out, so a cat created with wait 0 turns around on the very first
     * frame and never takes a step. Two of them did exactly that.
     */
    const cats: CatState[] = [
      { x: 250, y: 690, dir: 1, speed: 46, wait: 5.5, walking: true, phase: 0 },
      { x: 560, y: 730, dir: -1, speed: 38, wait: 2.2, walking: false, phase: 1.7 },
      { x: 800, y: 640, dir: -1, speed: 52, wait: 3.8, walking: true, phase: 3.1 },
    ];

    const place = (i: number) => {
      const g = catRefs[i].current;
      if (!g) return;
      const c = cats[i];
      /* A little bob on the walk, and none at all standing still. */
      const bob = c.walking ? Math.sin(c.phase * 9) * 1.2 : 0;
      g.setAttribute('transform', `translate(${c.x} ${c.y + bob}) scale(${c.dir} 1)`);

      const swing = c.walking ? Math.sin(c.phase * 9) * 16 : 0;
      const set = (part: string, deg: number, ox: number) => {
        const el = g.querySelector<SVGGElement>(`[data-part="${part}"]`);
        if (el) el.setAttribute('transform', `rotate(${deg} ${ox} -15)`);
      };
      set('legFrontNear', swing, 17);
      set('legFrontFar', -swing, 12);
      set('legBackNear', -swing, -10);
      set('legBackFar', swing, -16);

      /* The tail keeps moving whether or not the cat does. That is the whole character of it. */
      const tail = g.querySelector<SVGGElement>('[data-part="tail"]');
      if (tail) tail.setAttribute('transform', `rotate(${Math.sin(c.phase * 2.1) * 11} -22 -26)`);

      const head = g.querySelector<SVGGElement>('[data-part="head"]');
      if (head) head.setAttribute('transform', `rotate(${Math.sin(c.phase * 1.3) * 3} 28 -46)`);
    };

    cats.forEach((_, i) => place(i));

    if (reduced) return;

    let raf = 0;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      cats.forEach((c, i) => {
        c.phase += dt;
        c.wait -= dt;

        if (c.wait <= 0) {
          /* Sit for a while, then wander again. Cats do not commute. */
          c.walking = !c.walking;
          c.wait = c.walking ? 3 + Math.random() * 5 : 1.5 + Math.random() * 4;
          if (c.walking && Math.random() < 0.4) c.dir = c.dir === 1 ? -1 : 1;
        }

        if (c.walking) {
          c.x += c.speed * c.dir * dt;
          /* The room has walls. Turn around rather than walking out of the picture. */
          if (c.x > W - 60) { c.x = W - 60; c.dir = -1; }
          if (c.x < 60) { c.x = 60; c.dir = 1; }
        }

        place(i);
      });

      /* Five bars on the monitor, moving like something is actually playing through them. */
      const bars = barsRef.current;
      if (bars) {
        const rects = bars.querySelectorAll('rect');
        rects.forEach((r, n) => {
          const h = 6 + (Math.sin(now / 190 + n * 1.3) * 0.5 + 0.5) * 20;
          r.setAttribute('y', String(-h));
          r.setAttribute('height', String(h));
        });
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, []);

  /* The machine changes what it is playing, slowly, whether or not anyone is watching. */
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = window.setInterval(() => setTrack((n) => (n + 1) % copy.desk.tracks.length), 9000);
    return () => window.clearInterval(id);
  }, []);

  const now = copy.desk.tracks[track];

  return (
    <div className={styles.root}>
      <header className={styles.head}>
        <p className={styles.kicker}>{t(copy.label)}</p>
        <h1 className={styles.title}>{t(copy.title)}</h1>
        <p className={styles.intro}>{t(copy.intro)}</p>
      </header>

      <div className={styles.stage}>
        <svg
          className={styles.scene}
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="xMidYMid meet"
          /* The room is decoration; every door in it is repeated as a real link underneath. */
          aria-hidden="true"
          focusable="false"
        >
          <defs>
            {/* The screentone that makes this read as printed rather than rendered. */}
            <pattern id="pgDots" width="6" height="6" patternUnits="userSpaceOnUse">
              <circle cx="1.5" cy="1.5" r="1" fill="var(--pg-ink)" opacity="0.18" />
            </pattern>
            <pattern id="pgDotsFaint" width="8" height="8" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="var(--pg-ink)" opacity="0.1" />
            </pattern>
            <clipPath id="pgScreen">
              <rect x="646" y="356" width="150" height="92" rx="3" />
            </clipPath>
          </defs>

          {/* ---------------------------------------------------------- room */}

          <rect x="0" y="0" width={W} height={FLOOR} fill="url(#pgDotsFaint)" />
          <rect x="0" y={FLOOR} width={W} height={H - FLOOR} fill="var(--pg-paper)" />
          <line x1="0" y1={FLOOR} x2={W} y2={FLOOR} stroke="var(--pg-ink)" strokeWidth="2" />

          {/* the mezzanine, top right */}
          <g stroke="var(--pg-ink)" strokeWidth="2" fill="none">
            <path d="M470 150 L1000 108" fill="url(#pgDots)" />
            <path d="M470 150 L1000 108 L1000 140 L470 186 Z" fill="url(#pgDots)" />
            <path d="M470 186 L1000 140" />
            {[0, 1, 2, 3, 4, 5].map((n) => (
              <line
                key={n}
                x1={520 + n * 90}
                y1={146 - n * 7}
                x2={520 + n * 90}
                y2={86 - n * 7}
                strokeWidth="1.6"
              />
            ))}
            <path d="M500 100 L1000 60" strokeWidth="1.6" />
            {/* the stair, going up out of frame */}
            <path d="M905 108 L1000 40" strokeWidth="1.6" />
            <path d="M930 108 L1000 58" strokeWidth="1.6" />
          </g>

          {/* a splash or two of ink, the way the reference has them */}
          <g fill="var(--pg-ink)" opacity="0.55">
            <circle cx="932" cy="196" r="5" />
            <circle cx="948" cy="212" r="2.6" />
            <circle cx="916" cy="214" r="1.8" />
            <circle cx="52" cy="470" r="4" />
            <circle cx="36" cy="492" r="2.2" />
            <circle cx="70" cy="496" r="1.6" />
          </g>

          {/* -------------------------------------------------------- frames */}

          {doors.map((d) => (
            <g key={d.id}>
              <rect
                x={d.frame.x}
                y={d.frame.y}
                width={d.frame.w}
                height={d.frame.h}
                fill="var(--pg-paper)"
                stroke="var(--pg-ink)"
                strokeWidth="7"
              />
              <rect
                x={d.frame.x + 12}
                y={d.frame.y + 12}
                width={d.frame.w - 24}
                height={d.frame.h - 24}
                fill="none"
                stroke="var(--pg-ink)"
                strokeWidth="1.4"
              />
              {/* Each frame holds a wireframe of the thing it opens. */}
              <Wire door={d.id} box={d.frame} />
              <text
                x={d.frame.x + d.frame.w / 2}
                y="322"
                textAnchor="middle"
                className={styles.frameLabel}
              >
                [{d.label}]
              </text>
            </g>
          ))}

          {/* ------------------------------------------------------- arcade */}

          <g>
            <path
              d="M152 700 L152 400 Q152 366 186 366 L306 366 Q340 366 340 400 L340 700 Z"
              fill="url(#pgDots)"
              stroke="var(--pg-ink)"
              strokeWidth="3"
            />
            {/* marquee */}
            <rect x="164" y="378" width="164" height="26" fill="var(--pg-paper)" stroke="var(--pg-ink)" strokeWidth="2" />
            <text x="246" y="396" textAnchor="middle" className={styles.marquee}>
              {t(copy.arcade.marquee)}
            </text>
            {/* screen */}
            <rect x="168" y="414" width="156" height="96" rx="4" fill="var(--pg-ink)" />
            <text x="246" y="462" textAnchor="middle" className={styles.arcadeScreen}>
              {t(copy.arcade.screen)}
            </text>
            <rect x="206" y="474" width="80" height="18" fill="none" stroke="var(--pg-paper)" strokeWidth="1.4" opacity="0.7" />
            <text x="246" y="487" textAnchor="middle" className={styles.arcadeSub}>
              1 CREDIT
            </text>
            {/* controls */}
            <rect x="164" y="520" width="164" height="46" fill="var(--pg-paper)" stroke="var(--pg-ink)" strokeWidth="2" />
            <circle cx="196" cy="543" r="9" fill="var(--pg-ink)" />
            <line x1="196" y1="543" x2="196" y2="528" stroke="var(--pg-ink)" strokeWidth="3" />
            <circle cx="196" cy="526" r="5" fill="var(--pg-paper)" stroke="var(--pg-ink)" strokeWidth="2" />
            {[0, 1, 2].map((n) => (
              <circle key={n} cx={240 + n * 26} cy="543" r="7" fill="var(--pg-paper)" stroke="var(--pg-ink)" strokeWidth="2" />
            ))}
            {/* the coin door */}
            <rect x="186" y="596" width="120" height="76" fill="var(--pg-paper)" stroke="var(--pg-ink)" strokeWidth="2" />
            <rect x="210" y="616" width="30" height="8" fill="var(--pg-ink)" />
            <rect x="256" y="616" width="30" height="8" fill="var(--pg-ink)" />
          </g>

          {/* --------------------------------------------------------- desk */}

          <g stroke="var(--pg-ink)" strokeWidth="2.4" fill="none">
            {/* the back shelf */}
            <rect x="610" y="452" width="370" height="12" fill="var(--pg-paper)" />
            <line x1="628" y1="464" x2="628" y2="618" />
            <line x1="962" y1="464" x2="962" y2="618" />
            {/* the front desk */}
            <rect x="586" y="580" width="394" height="13" fill="var(--pg-paper)" />
            <line x1="604" y1="593" x2="604" y2="716" />
            <line x1="962" y1="593" x2="962" y2="716" />
          </g>

          {/* the monitor */}
          <g>
            <rect x="638" y="348" width="166" height="108" rx="5" fill="var(--pg-paper)" stroke="var(--pg-ink)" strokeWidth="3" />
            <rect x="646" y="356" width="150" height="92" rx="3" fill="var(--pg-ink)" />
            <g clipPath="url(#pgScreen)">
              <text x="658" y="378" className={styles.screenLabel}>
                {t(copy.desk.label)}
              </text>
              <text x="658" y="402" className={styles.screenTrack}>
                {now.title}
              </text>
              <text x="658" y="418" className={styles.screenArtist}>
                {now.artist}
              </text>
              {/* the equaliser, driven from the loop */}
              <g ref={barsRef} transform="translate(658 442)">
                {[0, 1, 2, 3, 4].map((n) => (
                  <rect key={n} x={n * 9} y="-14" width="5" height="14" fill="var(--pg-paper)" opacity="0.85" />
                ))}
              </g>
              <rect x="712" y="434" width="76" height="3" fill="var(--pg-paper)" opacity="0.3" />
              <rect x="712" y="434" width="42" height="3" fill="var(--pg-paper)" />
            </g>
            <path d="M700 456 L700 470 L742 470 L742 456" fill="none" stroke="var(--pg-ink)" strokeWidth="3" />
            <rect x="686" y="470" width="70" height="7" rx="3" fill="var(--pg-paper)" stroke="var(--pg-ink)" strokeWidth="2.4" />
          </g>

          {/* the tower, beside it */}
          <g>
            <rect x="836" y="330" width="84" height="126" rx="4" fill="url(#pgDots)" stroke="var(--pg-ink)" strokeWidth="3" />
            <rect x="850" y="344" width="56" height="5" fill="var(--pg-ink)" />
            <rect x="850" y="356" width="56" height="5" fill="var(--pg-ink)" />
            <circle cx="878" cy="436" r="5" fill="none" stroke="var(--pg-ink)" strokeWidth="2" />
          </g>

          {/* the laptop on the front desk */}
          <g>
            <path d="M672 580 L688 496 L820 496 L836 580 Z" fill="var(--pg-paper)" stroke="var(--pg-ink)" strokeWidth="2.6" />
            <path d="M690 574 L702 502 L806 502 L818 574 Z" fill="none" stroke="var(--pg-ink)" strokeWidth="1.2" />
            <rect x="700" y="404" width="112" height="92" rx="4" fill="var(--pg-paper)" stroke="var(--pg-ink)" strokeWidth="2.6" />
            <rect x="707" y="411" width="98" height="78" fill="url(#pgDots)" />
            {/* something half-drawn on the screen, because it always is */}
            <circle cx="756" cy="450" r="21" fill="none" stroke="var(--pg-ink)" strokeWidth="2" />
            <path d="M756 429 A21 21 0 0 1 777 450 L756 450 Z" fill="var(--pg-ink)" opacity="0.65" />
          </g>

          {/* --------------------------------------------------------- cats */}

          {catVariants.map((v, i) => (
            <Cat key={v} ref={catRefs[i]} variant={v} label={catNames[i]} />
          ))}
        </svg>

        {/*
          * The hotspots, over the drawing.
          *
          * Real buttons and real links, positioned in percentages that track the same viewBox the
          * scene is drawn in, so they stay on their objects at every size. Drawing them as SVG
          * groups would have been fewer elements and worse: these focus, they have accessible
          * names, and a keyboard reaches them in the order the room reads.
          */}
        <div className={styles.hotspots}>
          {doors.map((d) => (
            <Link
              key={d.id}
              className={styles.hotspot}
              href={d.href}
              aria-label={d.label}
              style={{
                left: `${(d.frame.x / W) * 100}%`,
                top: `${(d.frame.y / H) * 100}%`,
                width: `${(d.frame.w / W) * 100}%`,
                height: `${((d.frame.h + 52) / H) * 100}%`,
              }}
            >
              <span className={styles.hotspotMark} aria-hidden="true" />
            </Link>
          ))}

          <button
            ref={arcadeRef}
            type="button"
            className={`${styles.hotspot} ${styles.arcadeHotspot}`}
            onClick={() => setPlaying(true)}
            aria-label={t(copy.arcade.action)}
            style={{
              left: `${(152 / W) * 100}%`,
              top: `${(366 / H) * 100}%`,
              width: `${(188 / W) * 100}%`,
              height: `${(334 / H) * 100}%`,
            }}
          >
            <span className={styles.hotspotMark} aria-hidden="true" />
          </button>
        </div>
      </div>

      {/*
        * The same doors, as a list.
        *
        * Not a fallback and not hidden on small screens: a room you have to click is charming and
        * exclusive, and this row is the version that works with a keyboard, on a phone, and for
        * anyone who would simply rather read where they are going.
        */}
      <nav className={styles.shortcuts} aria-label={t(copy.shortcuts)}>
        <span className={styles.shortcutsLabel}>{t(copy.shortcuts)}</span>
        {doors.map((d) => (
          <Link key={d.id} className={styles.shortcut} href={d.href}>
            {d.label}
          </Link>
        ))}
        <button type="button" className={styles.shortcut} onClick={() => setPlaying(true)}>
          {t(copy.arcade.action)}
        </button>
      </nav>

      <Hacking open={playing} onClose={() => setPlaying(false)} />
    </div>
  );
}

/** The wireframe inside each frame: a rough picture of what is behind that door. */
function Wire({ door, box }: { door: string; box: { x: number; y: number; w: number; h: number } }) {
  const x = box.x + 26;
  const y = box.y + 26;
  const w = box.w - 52;
  const h = box.h - 52;
  const ink = 'var(--pg-ink)';

  if (door === 'projetos') {
    return (
      <g stroke={ink} strokeWidth="1.8" fill="none">
        <rect x={x} y={y} width={w} height={h * 0.16} />
        {[0, 1, 2].map((c) =>
          [0, 1].map((r) => (
            <rect
              key={`${c}-${r}`}
              x={x + c * (w / 3)}
              y={y + h * 0.26 + r * (h * 0.3)}
              width={w / 3 - 8}
              height={h * 0.24}
              fill={c === 2 && r === 0 ? 'url(#pgDots)' : 'none'}
            />
          )),
        )}
      </g>
    );
  }

  if (door === 'interfaces') {
    return (
      <g stroke={ink} strokeWidth="1.8" fill="none">
        <rect x={x} y={y} width={w} height={h * 0.42} />
        <path d={`M${x} ${y} L${x + w} ${y + h * 0.42} M${x + w} ${y} L${x} ${y + h * 0.42}`} strokeWidth="1.4" />
        <rect x={x} y={y + h * 0.52} width={w * 0.55} height={h * 0.16} fill="url(#pgDots)" />
        <rect x={x} y={y + h * 0.74} width={w} height={h * 0.26} />
        <path d={`M${x} ${y + h * 0.74} L${x + w} ${y + h}`} strokeWidth="1.4" />
      </g>
    );
  }

  /* Components: the frame that has not been filled in yet. */
  return (
    <g stroke={ink} fill="none">
      <text
        x={box.x + box.w / 2}
        y={box.y + box.h / 2 + 20}
        textAnchor="middle"
        className={styles.question}
      >
        ?
      </text>
    </g>
  );
}
