# Handoff: Portfólio João V. Melo 2026

## Overview
One-page portfolio site for João Vitor Melo (Senior Product Designer / CX Designer / AI Product
Builder). Editorial, near-monochrome, animation-heavy. Sequence of sections:

1. **Header** — fixed nav + centred hero (avatar, kicker, H1, divider, paragraph, CTA)
2. **Animated divider** — a bar that fills left→right then retracts right→left, on a loop
3. **Marquee** — scrolling list of disciplines
4. **Cases 01–04** — full-screen photo panels that rise from the bottom on scroll, "magazine page turn"
5. **Outros projetos** — horizontal carousel of secondary projects
6. **Sobre mim** — full-viewport editorial profile section
7. **Resultados em destaque** — dark metrics band
8. **Minha história no design** — company list, two columns
9. **Contato / footer** — dark panel that rises and swallows the page, including the nav

Plus two overlays: a full-screen **menu** (opens from the wordmark) and a **contact modal**
(opens from every "Entrar em contato" button).

## About the Design Files
The files in this bundle are **design references created in HTML** — working prototypes that show
the intended look, motion and behaviour. They are **not production code to copy directly**.

The `.dc.html` files are authored in a component format that pairs a markup template with a small
logic class, rendered by `support.js` at runtime. Treat that pairing as pseudo-code for a real
component: the template is the JSX/markup, the logic class is the component's state and effects.

The task is to **recreate these designs in the target codebase's environment** (React, Next.js,
Vue, Astro, etc.) using its established patterns. If no codebase exists yet, Next.js + Tailwind or
plain React + CSS modules both fit this design cleanly — there is no data layer, so the choice is
about tooling comfort, not capability.

### Running the reference locally
The bundled HTML is self-contained apart from relative asset paths, so it needs a static server
(opening `file://` directly will block the font and asset fetches in some browsers):

```bash
cd design_handoff_portfolio_2026/reference
npx serve .          # or: python3 -m http.server 8000
```

Then open `http://localhost:3000/Portfolio%20-%20Jo%C3%A3o%20Vitor%20Melo%202026.dc.html`
(port differs per server). The mobile variant is the second `.dc.html` in the same folder.

## Fidelity
**High-fidelity.** Final colours, typography, spacing, motion timings and copy. Recreate
pixel-for-pixel. Every value in this document is the value used in the prototype.

## Design Tokens

### Colour
| Token | Value | Use |
| --- | --- | --- |
| Ink | `#14120F` | All "black": text, filled buttons, dark panels, footer, nav when inverted |
| Paper | `#ffffff` | Page ground, inverted button fill |
| Body text | `#3d3d3d` | Paragraphs |
| Muted | `#6a6a6a` | Captions, footer meta |
| Muted light | `#8a8a8a`, `#9a9a9a` | Labels, kickers, folio lines |
| Accent | `#35d07a` | The green diamond only — never a fill or a text colour |
| Hairline | `#e0e0e0`, `#e6e6e6` | Section rules, metadata dividers |
| Hairline light | `#e2e2e2` | Outline-button borders inside the modal |
| Hairline mid | `#cfcfcf`, `#d7d7d7`, `#dcdcdc` | Secondary button borders, hero divider, marquee rules |
| On-dark text | `#ffffff`, `rgba(255,255,255,.72)`, `rgba(255,255,255,.5)` | Footer / metrics band |
| On-dark rules | `rgba(255,255,255,.16)`, `rgba(255,255,255,.18)` | Footer hairlines |

Bauhaus tile greys (menu overlay only, after the header ones were removed):
`#dcdcdc #efefef #e4e4e4 #ededed #bdb9b6 #e8e8e8 #cdcdcd #f2f2f2 #e0e0e0 #dedede #c6c3c0 #ececec #e3e3e3 #d4d4d4`

### Typography
- **Headings** — Playfair Display, weights 400/500/600/700. Google Fonts.
- **Body / UI** — Archivo, weights 300/400/500/600/700. Google Fonts.

| Element | Size | Weight | Line-height | Tracking |
| --- | --- | --- | --- | --- |
| Wordmark (nav) | 26px | 700 Playfair | — | -0.015em |
| Hero H1 | **96px** (fixed) | 700 Playfair | 0.98 | -0.028em |
| Hero kicker | 13.5px | 400 Archivo | — | 0.13em |
| Hero paragraph | 18px | 300 Archivo | 1.48 | — |
| Hero CTA | 16px | 500 Archivo | — | — |
| Case title | 40px | 700 Archivo | 1.1 | -0.02em |
| Case company | 20px | 400 Archivo | — | — |
| Case description | 25px | 400 Archivo | 1.42 | — |
| Case hover label | 13px | 400 Archivo | — | 0.14em |
| Section H2 | 56px | 700 Playfair | 1.04 | -0.026em |
| Section subhead | 20px | 300 Archivo | 1.5 | — |
| "Sobre mim" H2 | clamp(62px, 6vw, 86px) | 700 Playfair | 0.98 | -0.03em |
| Metric number | clamp(40px, 4.4vw, 66px) | 300 Archivo, `tabular-nums` | 1 | -0.03em |
| Metric label | 11.5px | 400 Archivo | — | 0.12em |
| Company name | 27px | 700 Playfair | — | -0.02em |
| Footer H2 | clamp(52px, 5.4vw, 82px) | 700 Playfair | 1.0 | -0.03em |
| Footer links | 20px | 400 Archivo | — | — |
| Marquee | 14px | 400 Archivo | — | 0.3em |

### Spacing
Page gutter is **48px** left and right, everywhere. Section padding is 96–118px top,
104–120px bottom. Header stack (top to bottom): 20px pad → avatar 68px → 16px → kicker → 22px →
H1 → 30px → divider 260×1px → 24px → paragraph → 30px → CTA → 28px pad.

The whole first screen (nav + hero + divider + marquee) is budgeted to land **under 760px** so it
fits a 1366×768 display. Verify this when porting — it is a hard requirement.

### Radius & shadow
Radius is **0** on every surface except circles (avatar, bauhaus tiles). Shadows appear only on
hover:
- Buttons: `0 22px 40px -20px rgba(20,18,15,.45)`
- Small buttons: `0 12px 26px -14px rgba(20,18,15,.4)`
- Outline buttons: `0 18px 34px -20px rgba(20,18,15,.3)`
- Cards / portrait: `0 30px 56px -26px rgba(20,18,15,.4)`
- Rising panels: `0 -34px 70px -24px rgba(20,18,15,.55)`
- Modal card: `0 40px 90px -40px rgba(20,18,15,.6)`

## Screens / Views

### 1. Nav (fixed, all screens)
Full-width, `position: fixed`, z-index 50. Padding 20px 28px 20px 48px. Contents left→right:
wordmark "JoãoV.Melo" (Playfair 700, 26px) + a caret (8×8px, two 1.5px borders, rotated 45°),
language pair "Português (PT-BR) / English (EN-US)", then a filled CTA pushed right with
`margin-left: auto`.

- Background `#fff`, no border — the **scroll-progress bar is the border**: a 1px strip at
  `bottom: 0` on `rgba(20,18,15,.13)`, with an inner bar scaled by `scrollTop / (scrollHeight - innerHeight)`
  via `transform: scaleX()`, `transform-origin: left`, `transition: transform .18s linear`.
- **Inversion**: when a dark surface passes under the nav, background → `#14120F`, text → `#fff`,
  progress track → `rgba(255,255,255,.22)`, and the CTA flips to white-filled. Transition
  `background .6s cubic-bezier(.4,0,.2,1)`. Driven by CSS custom properties
  (`--navBg --navFg --navMuted --navTrack --btnBg --btnFg --btnBd --btnBgH --btnFgH --btnBdH`)
  set on the nav element from JS.
- Caret rotates from `rotate(45deg) translateY(-2px)` to `rotate(-135deg) translateY(-2px)` when
  the menu is open, `.45s cubic-bezier(.2,.8,.2,1)`.
- The nav height is measured at runtime and published as `--navH` so the hero can offset by it.

### 2. Hero
Single centred column, `display: flex`, `min-height: calc(100vh - var(--navH) - 118px)`,
`padding-top: var(--navH)`. Everything centre-aligned.

- **Avatar** — 68×68px circle, `overflow: hidden`, 1px `rgba(20,18,15,.14)` border, inside a
  wrapper with `perspective: 620px`. Not a link. Hover **and** click both run `coinFlip`
  (`rotateY(0 → 360deg)`, 1.15s `cubic-bezier(.42,.02,.38,1)`). Click restarts the animation by
  clearing `style.animation`, forcing reflow, then re-assigning it.
- **Kicker** — 11×11px `#35d07a` square + "Senior Product Designer // CX Designer // AI Product Builder".
  The square runs `diamondBeat`: `rotate(45deg) scale(1 → .68)`, opacity 1 → .5, 5.5s ease-in-out,
  infinite.
- **H1** — three hard-broken lines: "Design com foco em / experiência, produto e / métricas".
  Runs `titleSway` (translate3d 0,0 → -5px,-11px → 4px,8px), 13s ease-in-out, **4.6s delay** so it
  starts after the entrance animation.
- **Sphere hover** *(signature interaction)* — the H1 sits in a wrapper with `isolation: isolate`
  and `background: #fff`. Inside it, a 236×236px `#fff` circle with
  `mix-blend-mode: difference` follows the cursor: on `mousemove` the wrapper's bounding rect
  gives local coordinates written to `transform: translate(x, y)` (`.32s cubic-bezier(.2,.8,.2,1)`,
  so it trails slightly); `margin: -118px 0 0 -118px` centres it on the pointer. Opacity goes 0 → 1
  on enter (`.8s`), 1 → 0 on leave. **Set the opacity synchronously in the enter handler** — gating
  it on `requestAnimationFrame` breaks in throttled/embedded contexts.
  Cursor over the wrapper is a custom 30×30px data-URI SVG: a rounded square rotated 45° (diamond),
  white at 35% with a 1.4px `#14120F` stroke, with a solid `#14120F` 5×5px core, hotspot 15,15.
- **Divider** — 260×1px `#d7d7d7`.
- **Paragraph** — three hard-broken lines, 18px/1.48, weight 300, `#3d3d3d`. Static (no float).
- **CTA** — "Entrar em contato ⇢", filled `#14120F`. Opens the contact modal.

### 3. Animated divider
1px `#dcdcdc` track, `overflow: hidden`. Inner bar `#14120F` running `fillTrack`, period
**7s** (tweakable), `cubic-bezier(.5,0,.5,1)`, infinite:

```
0%          scaleX(0)  origin left
46%–50%     scaleX(1)  origin left
50.01%      scaleX(1)  origin right     ← origin flip at the midpoint
96%–100%    scaleX(0)  origin right
```

### 4. Marquee
22px vertical padding, `overflow: hidden`. Two identical `<span>`s side by side, parent runs
`marquee` (`translateX(0 → -50%)`), **46s linear infinite** — the duplicate is what makes the
loop seamless. Content: "UI/UX · PRODUCT DESIGN · CX DESIGN · BRAND DESIGN · AI BUILDING ·
MÉTRICAS · DESIGN SYSTEMS ·", 14px, 0.3em tracking, `#4a4a4a`.

### 5. Cases 01–04 (the page-turn)
Each case is a `<section>` of `height: 130vh` on white. Inside, a `position: fixed; inset: 0`
stage with `perspective: 1500px; perspective-origin: 50% 100%`, and inside that the panel:
`transform-origin: 50% 100%`, starting at `translateY(100%)`.

Scroll maths, per frame:
```js
const r = section.getBoundingClientRect();
const p = clamp01((vh - r.top) / (vh * 0.58));        // reveal completes over 58% of a screen
const eased = p < .5 ? 2*p*p : 1 - Math.pow(-2*p + 2, 2)/2;   // easeInOutQuad
const rest = 1 - eased;
panel.style.transform =
  `translateY(${rest*100}%) rotateX(${rest*-11}deg) scale(${1 - rest*0.05})`;
photo.style.transform = `translateY(${rest*-6}%)`;   // parallax inside the frame
```
The `rotateX` + `scale` is what reads as a page being turned rather than a slide. Panels stack by
ascending z-index (20, 21, 22, 23) so each covers the previous. When a section's `bottom <= 0` its
stage gets `visibility: hidden` so it stops intercepting clicks.

Panel contents: full-bleed photo (`inset: -8% 0` for parallax headroom), a top-to-bottom scrim
`linear-gradient(180deg, rgba(20,18,15,.62) 0%, rgba(20,18,15,.18) 34%, rgba(20,18,15,.2) 62%, rgba(20,18,15,.66) 100%)`,
then padding 116px 56px 64px with the title + company at the top and, at the bottom, a 22px-gap
column holding the hover label and the description.

**Hover** on the panel: a `#14120F` veil fades to 18% opacity (`.6s`) and the label
"CLIQUE AQUI PARA VER O CASE COMPLETO" (with a rotated green diamond) rises 10px into place
(`.5s`). Both driven by custom props `--veil`, `--ctaOp`, `--ctaY` declared on the panel.
A `position: absolute; inset: 0` anchor covers the panel as the click target.

### 6. Outros projetos (carousel)
Section padding 96px 0 104px; header and controls padded 48px horizontally.

- **Rail** — `display: flex; gap: 30px; overflow-x: auto; scroll-snap-type: x mandatory`,
  `padding: 0 48px 4px`, `scroll-padding-left: 48px`, scrollbar hidden, `cursor: grab`.
- **Cards** — `flex: none; width: calc((100% - 60px) / 3); min-width: 200px; scroll-snap-align: start`.
  Three fit the grid exactly; the fourth bleeds off the right edge. Image frame is 16:9,
  `overflow: hidden`, `#f1f1f1` placeholder, with an inner div carrying 26px of parallax.
  Hover: `translateY(-10px) scale(1.03)` + card shadow, `.6s cubic-bezier(.2,.8,.2,1)`.
  Below: project name 19px/500, company 14px/300 `#6a6a6a`.
- **Wheel capture** — a non-passive `wheel` listener on the rail converts vertical wheel delta to
  `scrollLeft` and calls `preventDefault()`, **except** at either end, where it lets the event
  through so the page keeps scrolling. Without the end-check the page traps the user.
- **Controls** — a row below: two 46×46px outline squares (⇠ ⇢) on the left that scroll by one
  card width + gap with `behavior: 'smooth'`, and an outline "ver todos os projetos ⇢" pushed right.

### 7. Sobre mim
`min-height: 100vh`, `display: flex; flex-direction: column`, padding 44px 48px 56px.

- **Folio** — "Perfil" left, "Made from Minas Gerais, Brazil" right, over a 1px `#e0e0e0` rule.
- **Body** — two columns `minmax(0,1.35fr) minmax(0,1fr)`, 72px gap, 58px top padding.
  Left: H2 "Sobre mim" then two 17px/1.62 paragraphs in a 26px-gap column, max-width 620px.
  Right: the portrait, `align-items: flex-end` so it pins to the right edge of the grid, in line
  with the folio's right-hand text.
- **Portrait** — square (`aspect-ratio: 1/1`), max-width 470px, wrapped in a link to LinkedIn with
  `overflow: hidden`. Hover: `translateY(-10px) scale(1.03)` + shadow. The `<img>` inside carries
  46px of scroll parallax. Caption below: green diamond + "Design, jogos digitais e tecnologia."
- **Metadata strip** — pushed to the bottom with `margin-top: auto`. A single grid,
  4 columns × 2 rows, `align-items: start`: all four labels share row 1, all four values share
  row 2, so they align even when a label wraps. Columns: Foco / Ferramentas / Metodologias /
  Processo de handoff. **The three vertical rules are background layers on the container**, not
  per-cell borders — otherwise each rule is only as tall as its own cell:
  ```css
  background-image: linear-gradient(#e6e6e6,#e6e6e6) ×3;
  background-size: 1px calc(100% - 30px);
  background-position: calc(25% - .5px) bottom, calc(50% - .5px) bottom, calc(75% - .5px) bottom;
  ```
- **Actions** — filled "Currículo 2026 ↓" (arrow slides down 5px on hover) + a copy-to-clipboard
  e-mail control: a 17px Lucide-style copy glyph and the address; clicking writes to the clipboard
  and swaps the label to "Copiado" / "Copied" for 1.6s.

### 8. Resultados em destaque
Dark band: `#14120F`, white text, padding 118px 48px 104px.
Kicker (green diamond + "RESULTADOS EM DESTAQUE"), a 20px subhead, then four metrics in a grid
with `column-gap: 34px` over a `rgba(255,255,255,.14)` top rule, each cell
`grid-template-rows: auto auto 1fr` with a `min-height: 2.9em` label so all four numbers share a
baseline. Values are placeholders: **+90%** CSAT, **+34%** LTV, **86+** projects, **9+** years.
Hover on a cell runs `digitHop` on its number (translateY 0 → -7px → 1px, .95s) via a
`--digit` custom property.

### 9. Contato / footer
Same rising-panel mechanism as the cases, but `height: 150vh`, `background: #14120F`, and
**z-index 70 — above the nav**, so it swallows the nav as it rises. While it is up, the floating
back-to-top button is suppressed.

Layout, padding 44px 48px: folio row ("Contato" / "Made from Minas Gerais, Brazil"), then two
columns (1.3fr / 1fr, 64px gap): left has "Vamos conversar?" (two lines) and a 17px paragraph;
right, bottom-aligned, has three rows (E-MAIL / WHATSAPP / LINKEDIN) each as a flex row with the
label left, value right, and a `rgba(255,255,255,.18)` bottom rule; then Behance / Dribbble /
Steam / Currículo 2026 at 20px with a 30px gap; then a white-filled "Entrar em contato ⇢".
Bottom bar (`margin-top: auto`, top rule): wordmark, "Criado e desenvolvido por João V. Melo",
then "© 2026" and a "voltar ao topo ⇡" link pushed right (arrow lifts 4px on hover).

### Overlays

**Menu** — full-screen `#14120F`, z-index 150, revealed with
`clip-path: inset(0 0 100% 0) → inset(0 0 0 0)`, `.78s cubic-bezier(.62,0,.32,1)` (a curtain down
from the top). Right 46% carries four bauhaus tiles at 10% opacity running the ambient animations.
Three columns: MENU (Página inicial / Projetos / Sobre mim / Contato, 34px Playfair, each sliding
6px right on hover), CONTATO (phone → wa.me, e-mail → mailto, Currículo → Drive), REDES (LinkedIn,
Behance, Dribbble, Steam). Kicker at the bottom. Close ✕ rotates 90° on hover. Body scroll locked
while open. "Contato" closes the menu and opens the modal.

**Contact modal** — z-index 90. Backdrop `rgba(20,18,15,.5)` + `backdrop-filter: blur(2px)`,
fading over `.7s`. Card: white, max-width 560px, padding 44px 44px 40px, entering with
`opacity 0 → 1` and `translateY(22px) scale(.99) → translateY(0) scale(1)` over `.7s`
`cubic-bezier(.22,.7,.24,1)`. Contents: folio + ✕, "Vamos conversar?" (42px Playfair), a 15.5px
line, then three full-width rows — **E-mail filled**, WhatsApp and LinkedIn outlined
(`#e2e2e2` border) — each with the channel name left, the value right, and a trailing ⇢.

## Interactions & Behavior

### Intro (page load)
1. Full-screen `#14120F` overlay, z-index 200. Body scroll locked.
2. The wordmark is set as ten individual `<span>`s, each running `letterHop`
   (translateY 0 → -12px, 1.5s `cubic-bezier(.4,0,.3,1)`, infinite) with a **0.07s stagger** —
   the "three dots loading" rhythm applied to letters.
3. At **2100ms** a white circle grows from the centre: `clip-path: circle(0% → 150% at 50% 50%)`,
   `1.5s cubic-bezier(.62,0,.32,1)`. The same wordmark sits inside it in `#14120F`, still hopping,
   so the letters carry through the colour change.
4. At **3450ms** the overlay fades out (`.9s`), scroll unlocks, and the hero cascade starts.
5. At **4400ms** the overlay is `display: none`.

### Entrance cascade
Hero: elements marked for reveal start at `opacity: 0; translateY(16–22px)` and are shown in
order — kicker → H1 → divider (also `scaleX(.2) → scaleX(1)`) → paragraph → CTA — **260ms apart**,
with 1.5–1.8s transitions.

Sections: the same idea, per section, in an author-declared order (`data-order`) —
for "Sobre mim" it is folio → H2 → text → portrait → metadata → actions. A section fires **once**,
when its top passes 88% of the viewport height, and then runs to completion regardless of further
scrolling. The portrait also scales from `.985`.

⚠️ **Implementation note that cost real time:** this was originally built with
`IntersectionObserver` and then with a `requestAnimationFrame`-throttled scroll handler, and both
failed silently in embedded/throttled contexts, leaving content stuck at `opacity: 0`. The working
version runs the reveal check on the scroll event **and** on a 180ms interval, resets on
`visibilitychange` / `pageshow`, and never gates a reveal behind a single `rAF`. In a real app,
`IntersectionObserver` is the right tool — just verify it in a production build before trusting it.

### Parallax
Elements declare an amount in px; per frame:
```js
const mid = rect.top + rect.height/2 - vh/2;
el.style.transform = `translate3d(0, ${-(mid / vh) * amount}px, 0)`;
```
Portrait 46px, carousel images 26px.

### Button interaction (used on every button)
1. **Float** — `translateY(-3px to -6px)` on hover, `.45–.5s cubic-bezier(.2,.8,.2,1)`, plus shadow.
2. **Inversion** — filled buttons flip to white background / `#14120F` text / `#14120F` border;
   outline buttons darken their border to `#14120F`.
3. **Reflection** — a `::before` at `inset: -1px` with
   `linear-gradient(105deg, transparent 34%, rgba(128,128,128,.85) 50%, transparent 66%)` and
   `mix-blend-mode: difference`, swept `translateX(-140% → 140%)` over `.9–.95s`.
   The parent needs `overflow: hidden; isolation: isolate`, and the label/arrow need
   `position: relative; z-index: 1` to stay above it.
4. **Arrow drift** — the trailing ⇢ / ↓ / ⇡ slides 5–8px via a custom property (`--ax` / `--ay`).

### Language toggle
PT-BR / EN-US in the nav. Both weights are equal; the active one is underlined
(`border-bottom: 1px solid currentColor`) and the inactive sits at 48% opacity — deliberately
reading as an *option*, not a call to action. Switching sets two custom properties on the root,
`--showPt` and `--showEn`, and every translated string is a pair of `<span>`s whose `display`
reads from them. **In a real app, use i18n keys instead** — the twin-span trick exists only because
the prototype has no framework.

### Back-to-top button
Fixed, 54×54px, bottom-right, z-index 60. Hidden until the first case panel covers the screen
(enter: `opacity 0 → 1` + `translateY(16px → 0)`, `.5s`), hidden again while the footer is up.
**It samples what is behind its own centre** — it hit-tests dark panels and dark sections against
its own bounding box centre — rather than following the nav, so it is always the inverse of its
actual backdrop.

## State Management
No server state, no data fetching. Local UI state only:

| State | Type | Trigger |
| --- | --- | --- |
| `lang` | `'pt' \| 'en'` | Nav language links |
| `menuOpen` | boolean | Wordmark click / ✕ / a menu link |
| `contactOpen` | boolean | Any "Entrar em contato" / menu "Contato" / ✕ |
| `introDone` | boolean | Timers at 2100 / 3450 / 4400ms |
| `revealedSections` | Set | Section top crosses 88% viewport height |
| `navInverted` | boolean | Dark surface under the nav |
| `topBtnVisible` | boolean | First case covered / footer up |
| `scrollProgress` | 0–1 | Scroll |
| `railScroll` | px | Carousel drag / arrows / wheel |

Body scroll is locked during the intro and while the menu is open.

## Assets
In `reference/`:
- `avatar.png` — hero avatar, user-supplied. Square, rendered in a 68px circle.
- `retrato.png` — "Sobre mim" portrait, user-supplied. Square, in colour (an earlier grayscale
  treatment was explicitly rejected).
- `logo.svg` — the real wordmark, user-supplied. **Currently unused**: the intro needed per-letter
  animation and the file's glyphs are single paths, so the wordmark is set in Playfair Display
  instead. If you want the real mark animated, split it into one path per letter.
- `logos-marcas.svg` — company logo strip, user-supplied. Also unused: it briefly replaced the
  marquee, then the discipline labels were restored.
- Case photos and carousel images are **empty drop-slots** in the prototype — no real imagery yet.
  Ask João for these; each case panel needs one full-bleed photo and each carousel card one 16:9.

Fonts: Playfair Display and Archivo, both Google Fonts. Icons: Lucide (only the copy glyph is used
so far; the arrows are the text characters ⇢ ⇠ ⇡ ↓ ✕, which you may want to swap for real icons).

## Files
| File | What it is |
| --- | --- |
| `reference/Portfolio - João Vitor Melo 2026.dc.html` | The full desktop design — this is the source of truth |
| `reference/Portfolio Mobile - João Vitor Melo 2026.dc.html` | Mobile variant (390×844): stacked nav, 44px H1, horizontal bauhaus band, same case mechanism. Predates several desktop refinements — treat as directional |
| `reference/support.js` | The prototype runtime. **Do not port this** — it is scaffolding |
| `reference/image-slot.js` | The drag-and-drop image placeholder component. Replace with real `<img>` tags |
| `reference/_ds/…/styles.css` | The Classical design-system stylesheet the prototype loads |

## Open items
1. Real case photography and the four case titles / companies / descriptions.
2. Carousel content — six projects, currently placeholders.
3. The four metric values are invented placeholders. They must be replaced with real numbers
   before this ships.
4. Individual case pages and an "all projects" index do not exist yet — the links are `#`.
5. Responsive behaviour between 480px and 1366px is unspecified; only the desktop and the 390px
   mobile variant were designed.
