'use client';

import { useEffect, type RefObject } from 'react';

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'textarea:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

/**
 * Keyboard and scroll behaviour shared by the menu overlay and the contact modal.
 *
 * CLAUDE.md is explicit that the prototype does none of this and that it is "a genuine gap, not a
 * design decision": both overlays must trap focus, close on Escape, and return focus to whatever
 * opened them. An overlay that can be tabbed out of leaves a keyboard user stranded behind a
 * full-screen panel with no way back.
 *
 * @param lockScroll the menu locks body scroll (README "Overlays"); the modal does not need to.
 */
export function useOverlay(
  ref: RefObject<HTMLElement | null>,
  open: boolean,
  onClose: () => void,
  { lockScroll = false }: { lockScroll?: boolean } = {}
) {
  useEffect(() => {
    if (!open) return;
    const container = ref.current;
    if (!container) return;

    // Remember what to hand focus back to when this closes.
    const opener = document.activeElement as HTMLElement | null;

    const focusables = () =>
      Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null || el === document.activeElement
      );

    // Move focus in, so the very next Tab stays inside the overlay.
    const first = focusables()[0];
    first?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
        return;
      }

      if (e.key !== 'Tab') return;

      const items = focusables();
      if (items.length === 0) {
        e.preventDefault();
        return;
      }

      const firstItem = items[0];
      const lastItem = items[items.length - 1];
      const active = document.activeElement;

      // Wrap at both edges, and pull focus back in if it has escaped the container entirely.
      if (e.shiftKey && (active === firstItem || !container.contains(active))) {
        e.preventDefault();
        lastItem.focus();
      } else if (!e.shiftKey && (active === lastItem || !container.contains(active))) {
        e.preventDefault();
        firstItem.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown, true);

    let previousOverflow = '';
    if (lockScroll) {
      previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', onKeyDown, true);
      if (lockScroll) document.body.style.overflow = previousOverflow;
      // Return focus to the trigger, but not if something else has legitimately claimed it.
      if (opener && document.body.contains(opener)) opener.focus();
    };
  }, [ref, open, onClose, lockScroll]);
}
