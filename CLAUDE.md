# Portfólio João V. Melo — instructions for Claude Code

Read `README.md` first. It is the specification; this file is the working agreement.

## What this is
A design handoff. `reference/` holds HTML prototypes of a finished portfolio design. Your job is to
rebuild them as a real site that runs on localhost and can be deployed.

## Ground rules
1. **Do not ship the prototype.** `reference/support.js` is throwaway scaffolding, and the
   `.dc.html` files depend on it. Read them as specification, not as source.
2. **The README's numbers are exact.** Colours, sizes, timings, easings and copy were all decided
   deliberately over many rounds. When something looks arbitrary (a `-11deg` rotation, a `0.58`
   divisor, a `4.6s` delay), it is tuned — carry it across verbatim rather than rounding it.
3. **The first screen must fit 1366×768.** nav + hero + divider + marquee under ~760px. This has
   regressed several times; measure it, don't estimate.
4. **Motion is the product here.** The sphere on the H1, the case page-turn, the intro vignette and
   the button reflection are the reasons this design exists. If a technical constraint forces a
   compromise, raise it rather than silently simplifying.

## Suggested stack
Next.js (App Router) + TypeScript, plain CSS Modules or Tailwind. No CMS, no data layer — the
content is static. `next/font` for Playfair Display and Archivo. `lucide-react` for icons.

Suggested structure:

```
app/
  layout.tsx            fonts, <Nav/>, <ContactModal/>, <MenuOverlay/>, <BackToTop/>
  page.tsx              the one-pager: Hero → Divider → Marquee → Cases → Carousel
                        → About → Metrics → History → Footer
  cases/[slug]/page.tsx  not designed yet — see README "Open items"
components/
  Nav/  Hero/  Sphere/  CaseP anel/  Carousel/  About/  Metrics/  History/
  Footer/  Intro/  ContactModal/  MenuOverlay/  BackToTop/
hooks/
  useScrollProgress.ts   nav progress bar
  useReveal.ts           entrance cascade (IntersectionObserver — verify in a prod build)
  useParallax.ts         portrait + carousel images
  useSurfaceInversion.ts nav + back-to-top colour flipping
content/
  copy.ts                all strings, keyed, pt + en
```

## Order of work
1. Fonts, colour tokens, nav (with progress bar and inversion), hero **without** the sphere.
   Confirm the 1366×768 budget before going further.
2. The sphere hover. Set opacity synchronously; do not gate it on a lone `requestAnimationFrame`.
3. Divider, marquee, intro overlay.
4. Case panels — the scroll maths is in the README verbatim. Get one working, then stack four.
5. About, metrics, history, footer.
6. Carousel, including the wheel-capture end-check.
7. Menu overlay and contact modal.
8. i18n: replace the twin-`<span>` trick with real keys from `content/copy.ts`.
9. `prefers-reduced-motion`: the prototype ignores it. Add a branch that drops the intro to a plain
   fade, freezes the ambient loops, and reveals sections without transforms.

## Before you call it done
- 1366×768 and 1440×900: first screen fits, no horizontal scrollbar.
- Every reveal actually fires in a production build (`next build && next start`, not just dev).
- Every "Entrar em contato" entry point opens the modal: nav, hero, menu, footer.
- Back-to-top inverts against whatever is behind it, and hides while the footer is up.
- Keyboard: the menu and modal trap focus, close on Escape, and return focus to their trigger.
  The prototype does none of this — it is a genuine gap, not a design decision.
- Case panels release pointer events once scrolled past.

## Content still missing
Case photos, case titles/companies/descriptions, the six carousel projects, and the four metric
numbers (`+90%`, `+34%`, `86+`, `9+` are placeholders). Ask João before launch.
