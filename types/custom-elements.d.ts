/*
 * The room and the cat portrait are custom elements, not React components — see
 * components/Playground/room/playground-room.js. They are framework-agnostic on purpose: there is
 * no React state inside a render loop that runs at 60fps, and rewriting the scene in
 * react-three-fiber would buy nothing but reconciliation.
 *
 * React 19 removed the global JSX namespace, so this augments the one on `react` instead of
 * declaring a global — the old `declare namespace JSX` form is silently ignored under these types.
 */
import type { DetailedHTMLProps, HTMLAttributes } from 'react';

type CustomElement<T = Record<string, never>> = DetailedHTMLProps<
  HTMLAttributes<HTMLElement>,
  HTMLElement
> &
  T;

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'playground-room': CustomElement;
      /* Observes `variant` and swaps the model in place, so the cat file can change cats. */
      'cat-portrait': CustomElement<{ variant?: string }>;
    }
  }
}
