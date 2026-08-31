'use client';

/**
 * Make an in-page hash link work more than once.
 *
 * next/link does nothing when the href it is given already matches the current URL, and a hash
 * link is the one place that bites: the first click on "Sobre mim" writes #sobre and scrolls, and
 * from then on the URL already says #sobre, so every click after it is dead. The reader scrolls
 * away, presses the same link again, and the page sits there.
 *
 * Reproduced on the live site: click one goes to 3600, click two from the top stays at 0, click
 * three from 1200 stays at 1200.
 *
 * So we scroll it ourselves and keep the hash in the address bar with replaceState — replace
 * rather than push, because pressing the same link twice should not put two identical entries in
 * the reader's back button.
 *
 * Returns true when it handled the click, so the caller knows it already called preventDefault.
 */
export function scrollToHash(event: React.MouseEvent, href: string, onSamePage: boolean): boolean {
  /* A modified click is the reader asking for a new tab. Leave it alone. */
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
    return false;
  }

  if (!onSamePage || !href.startsWith('#') || href === '#') return false;

  const target = document.querySelector(href);
  if (!target) return false;

  event.preventDefault();

  /*
   * Smooth, unless the reader asked for less movement — in which case a 3600px smooth scroll is
   * exactly the kind of thing the setting exists to stop.
   */
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });

  try {
    window.history.replaceState(null, '', href);
  } catch {
    /* Some embedded contexts refuse replaceState. The scroll is the part that matters. */
  }

  return true;
}
