# Placeholder imagery — DEV ONLY, NEVER SHIP

Drop the temporary case/carousel images here while building. They exist so the page-turn, the
parallax and the carousel can be seen working before real photography exists.

## Rules

1. **Nothing in this folder may reach a production build.** It is excluded from `public/`
   deliberately — the app reads it only through a dev-only path.
2. The current placeholders are **third-party copyrighted anime and game art** (Square Enix,
   Shueisha, Riot Games, and one DeviantArt piece with a visible artist watermark). Publishing them
   on a portfolio — commercial material sent to recruiters and clients — is infringement.
3. `content/copy.ts` keeps `photo: null` / `image: null` as the real state. That is the source of
   truth; these files are scaffolding.

## Before launch

Replace every one with João's own material:

- screenshots of screens he actually designed, respecting each employer's NDA
- process shots, workshop photos, artefacts
- original artwork (he has the branding repertoire and is a Canva Creator)
- or properly licensed stock (Unsplash / Pexels) if an atmospheric image is wanted instead

## Naming

Match the slugs in `content/copy.ts` so the wiring is obvious:

```
cases/itau-cartoes-pj.jpg
cases/reserva-ink-aparencia-de-loja.jpg
cases/reserva-ink-imagens-de-vitrine.jpg
cases/bricker-amelie.jpg
projects/ems-saude.jpg
projects/itau-investimentos.jpg
projects/zema-emprestimo-pessoal.jpg
projects/zema-black-friday.jpg
projects/m1place-ecommerce.jpg
projects/canva-creator.jpg
```
