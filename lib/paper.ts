/**
 * The paper sound, shared.
 *
 * One element for the whole page rather than one per component. Four case panels and a hero
 * corner each building their own would be five fetches of the same file, and — worse — five
 * independent sounds that can overlap into a mush when two transitions land close together.
 * With a single element, a second trigger restarts the first rather than layering on it.
 *
 * Created lazily on first use, because constructing an Audio during module evaluation would run
 * on the server too.
 */
let paper: HTMLAudioElement | null = null;

/** Audible as texture, not as an event. */
const VOLUME = 0.45;

/**
 * Guards against the sound firing twice for one gesture.
 *
 * Scroll transitions and a click on the corner can both describe the same page turn — the reader
 * pulls the corner, the scroll that follows crosses the same threshold, and without this the
 * paper rustles twice for one action.
 */
let lastPlayed = 0;
const MIN_GAP_MS = 700;

export function playPaper() {
  if (typeof window === 'undefined') return;

  const now = performance.now();
  if (now - lastPlayed < MIN_GAP_MS) return;
  lastPlayed = now;

  if (!paper) {
    paper = new Audio('/audio/papel.mp3');
    paper.volume = VOLUME;
    paper.preload = 'auto';
  }

  paper.currentTime = 0;
  /* A refused play is not worth interrupting a page turn for. */
  paper.play().catch(() => {});
}
