# Handoff: Playground — "Escritório"

## Overview

An interactive playground for **joaovmelo.com** (repo `Amala-s-Network/portfolio-2026`): a
black-and-white office drawn entirely in code, filling one viewport with no scroll. The room holds
three framed pictures, an arcade cabinet, two tube TVs on a rack with consoles and joysticks, an
L-shaped desk with someone working at it, a bookcase, and three cats with names and behaviour.

Five things open from inside the room:

| Target in the room | Opens |
| --- | --- |
| `[PROJETOS]` / `[INTERFACES]` / `[COMPONENTES]` frames | the three index views |
| Arcade cabinet | the NieR-style shooter (already exists in the repo as `Hacking`) |
| Big tube TV | a codec call — Campbell, Otacon, Raiden, Liquid |
| Small tube TV | a turn-based battle against a minotaur |
| Any cat | that cat's file, with a live 3D portrait |

It replaces the current `components/Playground/` implementation, which is a 2D/SVG room and does
not reach this design.

## About the design files

The files in this bundle are **design references created in HTML** — prototypes that show the
intended look and behaviour. They are not production code to paste in.

Two exceptions worth knowing before you plan the work:

- **`playground-room.js` is real, shippable code.** It is a framework-agnostic custom element
  (`<playground-room>` + `<cat-portrait>`) with no React in it. It should be ported nearly
  verbatim — only the three.js import needs to change (see *Integration*). Rewriting the scene in
  react-three-fiber is possible but buys nothing: there is no React state inside the render loop.
- **`Playground.dc.html`** holds the HUD, the five overlays and the two mini-games. All of that
  should be **recreated as React + CSS Modules** in the repo's existing patterns. The inline styles
  in the file are an artefact of the prototyping environment, not a style choice — the repo uses
  CSS Modules and design tokens, and this feature must too.

## Fidelity

**High fidelity.** Colours, type, spacing and interaction timings are final and are listed below.
Recreate them exactly, using the repo's existing tokens where they match (they mostly do — the
palette was taken from `app/globals.css`).

The one deliberately unfinished area: `[PROJETOS]` and `[INTERFACES]` content is structured
placeholder. Wire them to the real data in `content/copy.ts`.

---

# Integration into portfolio-2026

Stack, as read from the repo at `main`: Next.js App Router, TypeScript, CSS Modules, path alias
`@/`, `next/font/google` in `lib/fonts.ts`, copy centralised in `content/copy.ts`, tokens in
`app/globals.css`.

## Files to touch

| Action | Path | Note |
| --- | --- | --- |
| keep | `app/playground/page.tsx` | route + metadata are already right (`robots: noindex`, `<CaseShell><Playground /></CaseShell>`) |
| **replace** | `components/Playground/Playground.tsx` | becomes the HUD + overlay host |
| **delete** | `components/Playground/Cat.tsx` | superseded — the cats live in the 3D scene now |
| rewrite | `components/Playground/Playground.module.css` | HUD, fallback, and the five overlays |
| **add** | `components/Playground/Room.tsx` | client wrapper that mounts `<playground-room>` |
| **add** | `components/Playground/room/playground-room.js` | from this bundle, import fixed |
| **add** | `components/Playground/Codec.tsx` + `.module.css` | codec overlay |
| **add** | `components/Playground/Battle.tsx` + `.module.css` | minotaur battle |
| **add** | `components/Playground/CatFile.tsx` + `.module.css` | cat file overlay |
| extend | `components/Hacking/Hacking.tsx` | port the lives + particles work (below) |
| extend | `content/copy.ts` | all strings, **pt and en** |
| extend | `app/globals.css` | the two CRT palettes as scoped token blocks |

## 1. three.js

```bash
npm i three
```

In `playground-room.js`, replace the two dynamic esm.sh imports:

```js
// prototype (2 occurrences: PlaygroundRoom.boot and CatPortrait.boot)
const THREE = await import('https://esm.sh/three@0.160.0');
// production
const THREE = await import('three');
```

Nothing else in the file needs to change. It uses only `WebGLRenderer`, `Scene`,
`PerspectiveCamera`, `BoxGeometry`, `CylinderGeometry`, `SphereGeometry`, `ConeGeometry`,
`PlaneGeometry`, `CircleGeometry`, `RingGeometry`, `EdgesGeometry`, `MeshBasicMaterial`,
`LineBasicMaterial`, `CanvasTexture`, `Raycaster`, `Plane`, `Box3`. No loaders, no controls, no
post-processing — the whole scene is primitives with edge outlines and canvas textures.

## 2. Mounting the custom element

```tsx
// components/Playground/Room.tsx
'use client';

import { useEffect, useRef } from 'react';

export function Room({
  onDoor,
  onCat,
}: {
  onDoor: (id: string) => void;
  onCat: (variant: 'tabby' | 'white' | 'black') => void;
}) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // registers <playground-room> and <cat-portrait> once, client-side only
    import('./room/playground-room.js');
  }, []);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    const door = (e: Event) => onDoor((e as CustomEvent).detail.id);
    const cat = (e: Event) => onCat((e as CustomEvent).detail.variant);
    el.addEventListener('door', door);
    el.addEventListener('cat', cat);
    return () => {
      el.removeEventListener('door', door);
      el.removeEventListener('cat', cat);
    };
  }, [onDoor, onCat]);

  return (
    <div ref={host} className={styles.stage}>
      {/* @ts-expect-error custom element */}
      <playground-room />
    </div>
  );
}
```

- Both events bubble, so one listener on the wrapper covers the scene.
- The element is inert until `connectedCallback`, and it cancels its RAF and `ResizeObserver` in
  `disconnectedCallback` — React strict-mode double-mounting is safe.
- Add the JSX intrinsic types once, e.g. in `types/custom-elements.d.ts`:
  `declare namespace JSX { interface IntrinsicElements { 'playground-room': any; 'cat-portrait': { variant?: string } } }`
- `<cat-portrait variant="black">` is used the same way inside the cat file overlay. It observes
  `variant` and swaps the model in place.

## 3. Copy and i18n — the one blocking gap

The prototype is **Portuguese only**. The site is bilingual (`lib/language.tsx`, the PT/EN pair in
`Nav`). Every string in this design needs an `en` counterpart in `content/copy.ts` before it can
ship: HUD, the four shortcut buttons, the three cat files (name, role, four stats, three lore
paragraphs each), all four codec scripts, every battle log line, and the two mini-game rule lists.

Two strings must **not** be translated: the frame captions render as `[PROJETOS]`, `[INTERFACES]`,
`[COMPONENTES]` inside the 3D canvas as baked canvas textures. Either keep them Portuguese in both
languages, or pass a label map into the element (`FRAMES` array, `playground-room.js`) and let it
repaint. There is no i18n inside the scene today.

## 4. Reuse, don't rebuild

- **`hooks/useOverlay.ts`** — use it for all five overlays: `useOverlay(ref, open, close, { lockScroll: true })`.
  The prototype only handles Escape; it has **no focus trap and no focus return**, which is the same
  gap `CLAUDE.md` calls out for the menu and contact modal. Fix it on integration.
- **NieR token flip** — `app/globals.css:526-544` already redefines `--paper`/`--ink`/`--accent` for
  the NieR surface. The arcade overlay should adopt that block instead of hardcoding `#c3c2a5`.
  Do the same for the two new CRT surfaces: add `.codecSurface` and `.battleSurface` token blocks
  next to it rather than scattering hex values through the modules.
- **`lib/fonts.ts`** — `--font-playfair`, `--font-archivo`, `--font-jost` already exist. Jost is
  already reserved for the NieR surfaces; the codec and battle read as the same family of screens
  and use it too. No new font loads.
- **Existing routes** — `/playground/interfaces` and `/playground/componentes` already exist and
  render `InterfacesPage` / `ComponentsPage`; `/projetos` renders `ProjectsPage`. **Decision for
  you:** the prototype opens all three as in-page overlays to preserve the no-scroll frame. Routing
  to the real pages instead is defensible and less code — if you route, keep the room mounted (soft
  navigation) so it does not re-boot three.js on every back-navigation. The overlays for the arcade,
  codec, battle and cat files are not optional; those have no pages.

## 5. Port to `components/Hacking/Hacking.tsx`

The game gained four things this round. Everything is in `Playground.dc.html` in the `start()`
method of the logic class:

1. **Three lives** (`g.lives`, `g.inv`). A collision costs one life and grants 1.8s of
   invulnerability, during which the ship blinks at 0.25 alpha every 90ms and enemies within 120px
   are cleared so the next life does not die on the same frame. Game over at 0.
2. **Escort ships.** The spare lives fly the wing: two ships at 0.6 scale, offset ±31px along the
   axis perpendicular to the aim vector and 19px behind it, each wobbling ±3.5px on a 250ms period.
   The count is `min(2, lives - 1)`, so the wing shortens as you lose lives. The HUD triangles are
   a second readout of the same number.
3. **Contra-style destruction.** `burst()` = one expanding ring (6→52px over 0.38s, stroke 7→1px,
   white for the first 45% then `#e6402d`) + 12 tumbling chunks (2.5–6.5px, 90–350px/s, drag 2.6,
   spin ±9rad/s) + 10 sparks. All three kinds live in one `g.parts` array with `{t, max}`.
4. **Shots that come apart.** A hit that does not kill throws 6 sparks back along the bullet's
   reversed velocity (±0.75rad spread, 300px/s) plus 3 chunks — the bullet visibly breaking on the
   shell instead of vanishing.

Difficulty, for the same file: enemy speeds `black 140 + min(150, t·3.6)`, `red vy 100 + min(130, t·3.1)`,
red drift `±45px/s`; spawn interval `max(0.17, 0.82 - t·0.028)`; a second spawn at 45% chance after
18s and a third at 30% after 42s.

---

# Screens and views

## A. The room (the page itself)

**Purpose** — the whole playground. One viewport, no scroll: `html, body { overflow: hidden }`, the
stage `position: fixed; inset: 0`.

**Breakpoints** — designed and framed for **1366×768, 1440×900 and 1920×1080**. The camera is
framed against 16:9 and pulls back on taller ratios so the room is never cropped:

```js
const pull = clamp(1.78 / camera.aspect, 1, 1.42);
camera.position.set(3.6 * pull, 5.9 * pull, 16.4 * pull);
camera.lookAt(-1.3, 3.5, -1.2);   // fov 40
```

Below **1200px** the stage is `display: none` and a fallback panel takes over (see D).

**Layout** — four HUD corners over the canvas, all at `clamp(18px, 2.6vh, 30px)` / `clamp(20px, 2.4vw, 40px)` inset:

- top left: eyebrow `Playground · escritório 01` (Archivo 500, 10.5px, 0.2em, `--muted-light`) +
  h1 **Escritório** (Playfair 700, `clamp(30px, 3.4vw, 46px)`, line-height 1, -0.03em, `--ink`)
- top right: one line of instruction, right-aligned, max 30ch, Archivo 300 12px `#3d3d3d`
- bottom left: label `Ou vá direto:` + six shortcut buttons (Projetos, Interfaces, Componentes,
  Codec, Batalha, Fliperama)
- bottom right: label `Gatos` + three buttons (BAYLE, MEL, ROCKY)

Both HUD text blocks are `pointer-events: none` so they never eat a click meant for the room.

**Shortcut buttons** — min-height 40px, padding 0 16px, 1px `--hairline-mid` border, `--paper`
background, Archivo 12.5px. Hover inverts to `--ink` background / `--paper` text. `Fliperama` ships
inverted by default (it is the loudest thing in the room).

**Overlay grade** — two non-interactive layers sit on the canvas: a halftone
`radial-gradient(#14120f 0.6px, transparent 0.7px) / 5px 5px` at 0.22 opacity with
`mix-blend-mode: multiply`, and `box-shadow: inset 0 0 160px rgba(20,18,15,.12)` as a vignette.
Together they are what makes the render read as print rather than WebGL. Keep both.

### The scene

No lights anywhere — `MeshBasicMaterial` only, every volume carrying its own `EdgesGeometry`
outline. A lit scene has gradients, and gradients are the one thing this drawing cannot have.

| Object | Notes |
| --- | --- |
| Floor | canvas texture: 15 boards with staggered short joints, `rgba(20,18,15,.42)` at 2.4px |
| Back wall | halftone at 0.1 alpha; left wall `--paper-dark`, right wall `--paper` |
| Three frames | ink shells 0.26 deep, paper mats, wireframe canvas art per kind (grid / wire / list); captions on per-string planes at a constant 178px per world unit so type size matches across the three |
| Arcade | 1.34× scale, corner at (-7.9, 0, -4.4), rotated 0.54rad; marquee reads `GAME ROOM · 2026`; attract screen cycles START / 1 CREDIT |
| Media rack | two tube TVs (1.0 and 0.82 scale), three consoles in **solid ink**, cartridge stack, **two dual-stick joysticks on the shelf** with cables + one on the floor |
| L desk | 6.4×1.8 long run + 1.8×2.3 return; monitor, keyboard, mouse, laptop, mug, tower (1.42 high, under the run) |
| Chair + figure | 5-arm base, wheels; the person is seen from behind, arms typing on a 150ms period, head turning on 2600ms |
| Bookcase | flush with the left wall, open carcass, 4 shelves, **monochrome** spines (paper → ink + greys) each with a 0.016 ink hairline, every fifth leaning 0.22rad |
| Cats | Bayle (tabby) patrols the desk, Mel (white) owns the floor and the wool ball, Rocky (black) sleeps |

### The four live screens

Each is a `CanvasTexture` repainted every frame.

1. **Monitor (the desk PC)** — always a design tool: dark toolbar with 5 tool squares and the file
   name `sala-01 · rascunhos`, a 104px layers panel (10 rows, indented, the selected row washed
   `rgba(53,208,122,.24)` with a 2px accent bar, cycling every 2.6s), a 96px inspector (X/Y/L/A/R/OP
   fields + three fill swatches), and a canvas with two frames — one selected with an accent
   outline, eight 5px handles and a size chip, and a drifting cursor.
2. **Laptop** — the Spotify panel. Playlist name `Cutting the neck`, cover stand-in with a 5-bar
   visualiser, track title (Archivo 600 26px) + artist (300 19px), a 12s progress bar, and the next
   three tracks queued. Track list is `PLAYLIST` at the top of `playground-room.js`; the first
   entry is the one track the playlist exposes publicly, the rest are stand-ins to be replaced.
3. **Big TV** — codec standby: `140.85`, `CALLING`, a live waveform, a flashing `!`, scanlines.
4. **Small TV** — fighting-game attract: two draining health bars, `P1` / `CPU`, `VS`, two
   silhouettes trading a hit, `ROUND 1 · FIGHT` blinking.

### Interaction

- Hover on any frame, the cabinet, either TV or any cat shows a **DOM reticle**: four 14px brackets
  with 2px `--ink` borders, 10px padding around the object's projected bounding box, plus a label
  chip (`--ink` background, `--paper` text, Archivo 600 11px, 0.14em, 7px/10px padding) below it.
  Projected from the object's `Box3` every frame — cheaper and crisper than anything in-scene.
- Labels: `PROJETOS`, `INTERFACES`, `COMPONENTES`, `INSERT COIN`, `CODEC · 140.85`, `BATALHA`,
  `BAYLE`, `MEL`, `ROCKY`.
- Click a frame / cabinet / TV → `door` event. Click a cat → `cat` event.
- Click the floor → Bayle and Mel startle: they run from the pointer at 2.6× speed for ~1.5s.
  Rocky does not react to anything.
- Mel investigates the pointer when it is 0.7–8 units away (1.6s of interest, 1.4× speed). All cats
  turn their heads toward the pointer within ±0.7rad.
- `prefers-reduced-motion` freezes the cats and the typing figure; the screens keep painting.

### Rocky's sleep cycle

Sleeps 10s → stretches → sleeps again. One 0–1 dial (`poseSleep(u, k)`) drives spine height, four
leg rotations, head position and rotation, tail curl, and the eyelids (lines below 0.45, dots above)
so the stretch can start and unwind from anywhere. Envelope: 0.7s in, 1.5s hold, 0.9s out, eased
`k²(3-2k)`. He picks one of three beds per page load — arcade top, laptop, or floor — each oriented
so his long axis crosses the camera.

## B. Codec overlay

Scrim `rgba(2,8,4,.92)`; card max 980px, background `#060f0a`, 1px `#1f4630` border, double shadow
`0 0 0 1px rgba(141,243,166,.14), 0 40px 90px -40px #000`, `pgCard` entry (0.4s
`cubic-bezier(.16,1,.3,1)`, opacity + scale 0.965→1). A 3px scanline layer covers the whole card.

**Three stages:**

1. **Boot** (1.7s) — `SINTONIZANDO`, 14 blinking bars, `VARRENDO 130.00 — 145.00 MHz`.
2. **Call** — opens **straight on Campbell** by default. Two 168px portraits either side of a
   centre column (waveform + `140.85 · SEGURO`); the speaker's portrait is at opacity 1 with its
   mouth bar animating (`pgTalk` 0.26s `steps(2, end)` infinite), the other at 0.4.
3. **Frequency list** — reachable via `TROCAR FREQUÊNCIA`: four 62px rows, frequency + name + role.

**Portraits are simulated signal frames, not likenesses** — bands and blocks only. Snake carries a
bandana with two tails, brows, eyes, a nose shadow, a stubble raster and a scar. Each contact
carries one identifying accessory: cap (Campbell), glasses (Otacon), visor (Raiden), long hair
(Liquid). Keep them abstract on purpose.

**Dialogue** — typewriter at one character per 26ms. Click the text box or press Space/Enter to
finish the line, then again to advance. Campbell's signal corrupts near the end and drops to a
`SISTEMA` line. Four scripts, 8–10 lines each; **all dialogue was written for this page** — do not
substitute game transcripts.

Frequencies: Campbell 140.85, Otacon 141.12, Raiden 137.71, Liquid 143.21.

**Attribution line, keep it:** homage to the Metal Gear Solid / Rising codec, © Konami; personal
page, unaffiliated; simulated portraits and original dialogue.

## C. Battle overlay

Scrim `rgba(8,4,3,.93)`; card max 920px, `#0b0708`, 1px `#43241c`.

- **Header** — `ENCONTRO 01` + `Túnel de manutenção` (Jost 400 15px, 0.18em, uppercase) + close.
- **Stage** — `position: relative; overflow: hidden; min-height: 300px; flex: 1`, radial
  `120% 90% at 50% 108%, #2a1512 → #0b0708 62%`. The canvas **must** be
  `position: absolute; inset: 0` — with a percentage height against a `min-height` flex item the
  box falls back to the bitmap's intrinsic ratio, which `drawFoe` rewrites every frame, and the
  figure walks off over the controls. This bit me; do not undo it.
- **Monster** — an original minotaur silhouette, one path set: digitigrade legs with a backward
  hock, chest ±92 tapering to a ±62 waist, shoulders seated inside the torso, bull skull tapering
  into a snout with nostrils and ears, thick tapered horns, and an axe with a curved cutting edge,
  a poll counterweight and the haft through the fist. Fill `#2b1613`, outline `#e0552c`, dark parts
  `#3a1e19`, eyes `#f0d27a` with an 18px glow. Gashes appear at <68% and <34% health.
- **Hit** — a 0.5s knock-up arc `sin((1 - t/0.5)π) × 36px` plus a 0.14rad tilt, a
  `#f6e6c8` flash over the first 0.18s, and a two-stroke slash across the figure. Damage rises and
  fades over 0.85s (`pgRise`).
- **Footer** — left: **AVENTUREIRO** health bar (14px tall, 1px `#43241c`, fill `#f0d27a`, switching
  to `#e0552c` below 35%, 0.4s ease) and an 8px magic bar (`#7ea6d8`). Right: four commands in a
  2×2 grid, 48px min-height — **Atacar** (8–15), **Magia** (12 MP, 18–27), **Invocar** (30% failure,
  22–34), **Fugir** (45%). Disabled buttons drop to `#120b0a` / `rgba(246,230,200,.32)`.
- **The monster has no health bar** — deliberate. Progress reads through the gashes and the log.
- Turn order: player acts → 0.78s → either victory or the monster raises the axe → 0.72s → 6–14
  damage to the player.

## D. Narrow fallback (<1200px)

Eyebrow + `Escritório` + one paragraph, then every destination as a 52px row (Projetos, Interfaces,
Componentes, Codec, Batalha, Fliperama) and the three cat files. It is not a dead end: everything
except the 3D room is reachable. `justify-content: flex-start` with `margin: auto 0` on the content
block — `center` plus `overflow: auto` makes the top unreachable.

## E. Cat file overlay

Codec-styled card: `PTT` bar, then two panes — a **photo slot** (3:4) and a **live 3D portrait**
(`<cat-portrait>`, phosphor green, turntable, idle script of walk / sit / stretch with blinks) —
then a name plate. Right column: `FICHA` + code, name (Jost 400, `clamp(26px, 2.6vw, 38px)`,
0.06em, uppercase), role, a 2×2 stat grid, and three lore paragraphs.

**On integration the photo pane becomes a real `next/image`**, not the prototype's drag-and-drop
slot. Files: `public/gatos/mel.webp`, `bayle.webp`, `rocky.webp`. The pane keeps its green tint
(`rgba(28,120,62,.18)`, `mix-blend-mode: screen`) and 3px scanlines over the photo.

Codes: MEL `FEL-01`, BAYLE `FEL-02`, ROCKY `FEL-03`.

## F. Arcade overlay

The existing `Hacking` game, now windowed instead of full-bleed: scrim `rgba(6,6,4,.88)`, card
`min(1120px, 100%) × min(780px, 100%)`, `--paper`/`--ink` from the NieR token block. Header carries
`SISTEMA · HACKING`, `Invadir`, the **VIDAS** triangles, `PONTOS`, and close. See §5 for the
gameplay changes.

---

# State

All of it is local to the playground; nothing is fetched.

| State | Shape | Notes |
| --- | --- | --- |
| `open` | `null \| 'projetos' \| 'interfaces' \| 'componentes' \| 'arcade' \| 'codec' \| 'rpg' \| 'cat'` | one overlay at a time |
| `cat` | `'tabby' \| 'white' \| 'black'` | which file is open |
| `codecStage` | `'boot' \| 'pick' \| 'talk'` | `boot` → `talk` on campbell after 1.7s |
| `codecWho / codecI / codecShown` | string / number / number | contact, line index, characters revealed |
| `hp / mp / foe / rpgPhase / rpgLog / dmg` | numbers, `'ready' \| 'busy' \| 'won' \| 'lost' \| 'fled'`, strings | battle |
| `score / lives / phase` | numbers, `'ready' \| 'playing' \| 'over'` | arcade |
| `narrow` | boolean | `innerWidth < 1200`, on resize |

**Keep out of React state:** the room's entire scene, the shooter's world (`g`), the battle's
animation clock (`r`). Those run at 60fps and belong in refs — the prototype only lifts score,
lives, health and log lines into state, and that is the right line.

# Design tokens

Existing, from `app/globals.css` — use these, do not re-declare:

`--ink #14120f` · `--paper #f4f2ec` · `--accent #35d07a` · `--muted #6a6a6a` ·
`--muted-light #6e6b65` · `--hairline #e0e0e0` · `--hairline-light #e2e2e2` ·
`--hairline-mid #cfcfcf` · `--gutter 48px` · `--ease cubic-bezier(0.16, 1, 0.3, 1)`

NieR block (`globals.css:526`): `--paper #c3c2a5` · `--ink #46443b` · `--accent #46443b`; panel
`#d1cdad`, screen `#07070a`, enemy `#e6402d`, immune outline `#e2e2ee`, spark `#ffb59d`.

**New — add as scoped blocks:**

```css
.codecSurface {
  --crt-bg: #060f0a;      --crt-panel: #0a1a11;   --crt-screen: #071c11;
  --crt-line: #1f4630;    --crt-deep: #04120a;
  --phosphor: #8df3a6;    --phosphor-bright: #d8ffe4;
}
.battleSurface {
  --pit-bg: #0b0708;      --pit-panel: #1a0f0d;   --pit-line: #43241c;
  --amber: #f0d27a;       --ember: #e0552c;       --bone: #f6e6c8;
  --hide: #2b1613;        --hide-dark: #3a1e19;   --mana: #7ea6d8;
}
```

Scene greys (three.js only, not CSS): `#e7e3d9`, `#d2cec4`, `#b0aba0`, `#7d786f`, `#54504a`.

**Type** — Playfair Display 700 for the h1; Archivo 300/400/500/600/700 for UI (10.5–17px, tracking
0.1–0.26em on labels); Jost 300/400/500 for every CRT surface; `ui-monospace, SFMono-Regular, Menlo,
monospace` for readouts (frequencies, codes, stat keys).

**Motion** — `pgIn` 0.35–0.9s (14px rise + fade), `pgFade` 0.28–0.35s, `pgCard` 0.4s (scale 0.965),
`pgSweep` 5.5s linear (portrait sweep), `pgScan` 3.4s linear, `pgTalk` 0.26s `steps(2, end)`,
`pgBlip` 1–1.4s `steps(2, end)`, `pgRise` 0.85s. Everything eased uses `--ease`.

# Assets

None binary. The room, both mini-games, the portraits and every screen are procedural — three.js
primitives and 2D canvas. What integration needs to add:

- `public/gatos/{mel,bayle,rocky}.webp` — the three cat photos (3:4)
- the real playlist track list (`PLAYLIST`, top of `playground-room.js`)
- real `[PROJETOS]` / `[INTERFACES]` content from `content/copy.ts`

# Files in this bundle

| File | What it is |
| --- | --- |
| `Playground.dc.html` | the full design reference — HUD, five overlays, both mini-games |
| `playground-room.js` | the 3D room + cat portrait as custom elements. **Port this nearly as-is** |
| `screenshots/01-escritorio.png` | the room at 1770×1052 — the reference frame for camera, palette and HUD placement |
| `support.js` | the prototyping runtime that renders the `.dc.html`. **Do not port it** — it exists so the reference opens in a browser |
| `image-slot.js` | the drag-and-drop photo placeholder used by the cat file. **Do not port it** — replace with `next/image` |

Open `Playground.dc.html` in a browser at 1440×900 or wider to see the design running. All four
files must sit in the same folder for it to boot.
