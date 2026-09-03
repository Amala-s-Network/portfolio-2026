'use client';

import { forwardRef } from 'react';

export type CatVariant = 'tabby' | 'white' | 'black';

/**
 * A cat, drawn from primitives.
 *
 * Built at a fixed size around its own origin — feet on y=0, nose towards +x — so the scene can
 * place it with one translate and flip it with one scale. Everything that moves (the legs, the
 * tail, the head) is its own group with a `data-part`, because the walk cycle is written by
 * setting transforms on those groups from the animation loop rather than by re-rendering React
 * sixty times a second.
 *
 * The three coats are the same body with different fills: the tabby carries stripes, the white
 * one is drawn in outline because a white cat on white paper is otherwise a hole in the page, and
 * the black one is solid with its features knocked out in paper.
 */
export const Cat = forwardRef<SVGGElement, { variant: CatVariant; label: string }>(
  function Cat({ variant, label }, ref) {
    const solid = variant === 'black';
    const body = solid ? 'var(--pg-ink)' : 'var(--pg-paper)';
    const line = 'var(--pg-ink)';
    /* On a solid cat the eyes and the collar have to be cut out of the ink, not drawn on it. */
    const detail = solid ? 'var(--pg-paper)' : 'var(--pg-ink)';

    return (
      <g ref={ref} role="img" aria-label={label}>
        {/* The cat sits in its own shadow, which is what keeps it on the floor rather than in
            front of it. */}
        <ellipse cx="0" cy="0" rx="26" ry="4.5" fill="var(--pg-ink)" opacity="0.16" />

        <g data-part="body">
          {/* ---- legs, behind the body ---- */}
          <g data-part="legBackFar">
            <rect x="-19" y="-15" width="5.5" height="15" rx="2.4" fill={body} stroke={line} strokeWidth="1.6" />
          </g>
          <g data-part="legFrontFar">
            <rect x="9" y="-15" width="5.5" height="15" rx="2.4" fill={body} stroke={line} strokeWidth="1.6" />
          </g>

          {/* ---- tail ---- */}
          <g data-part="tail">
            <path
              d="M-22 -26 C -34 -30, -38 -42, -33 -52"
              fill="none"
              stroke={line}
              strokeWidth="4.4"
              strokeLinecap="round"
            />
          </g>

          {/* ---- torso ---- */}
          <path
            d="M-24 -26 C -26 -38, -16 -44, -2 -44 C 12 -44, 20 -38, 20 -28 C 20 -20, 12 -14, -2 -14 C -16 -14, -22 -18, -24 -26 Z"
            fill={body}
            stroke={line}
            strokeWidth="1.8"
          />

          {variant === 'tabby' && (
            <g stroke={line} strokeWidth="1.6" strokeLinecap="round" fill="none">
              <path d="M-14 -41 L -16 -31" />
              <path d="M-6 -43 L -8 -32" />
              <path d="M2 -43 L 0 -33" />
              <path d="M10 -41 L 8 -32" />
            </g>
          )}

          {/* ---- legs, in front ---- */}
          <g data-part="legBackNear">
            <rect x="-13" y="-15" width="6" height="15" rx="2.6" fill={body} stroke={line} strokeWidth="1.8" />
          </g>
          <g data-part="legFrontNear">
            <rect x="14" y="-15" width="6" height="15" rx="2.6" fill={body} stroke={line} strokeWidth="1.8" />
          </g>

          {/* ---- head ---- */}
          <g data-part="head">
            <path
              d="M14 -56 L 20 -66 L 26 -57 M32 -57 L 38 -66 L 42 -55"
              fill={body}
              stroke={line}
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
            <circle cx="28" cy="-46" r="13" fill={body} stroke={line} strokeWidth="1.8" />
            <circle cx="24" cy="-48" r="1.9" fill={detail} />
            <circle cx="33" cy="-48" r="1.9" fill={detail} />
            <path d="M28 -43 l -2.5 2 h 5 z" fill={detail} />
            <g stroke={detail} strokeWidth="1" strokeLinecap="round" opacity="0.75">
              <path d="M38 -45 L 47 -47" />
              <path d="M38 -43 L 47 -41" />
            </g>
          </g>
        </g>
      </g>
    );
  },
);
