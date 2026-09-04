'use client';

import { useEffect, useRef } from 'react';
import styles from './Playground.module.css';

export type DoorId = 'projetos' | 'interfaces' | 'componentes' | 'arcade' | 'codec' | 'rpg';
export type CatVariant = 'tabby' | 'white' | 'black';

type RoomProps = {
  onDoor: (id: DoorId) => void;
  onCat: (variant: CatVariant) => void;
};

/**
 * The client wrapper around <playground-room>.
 *
 * It does almost nothing on purpose. The scene owns its own canvas, its own resize observer and
 * its own animation loop; React's job here is to put the element on the page, hear the two events
 * it emits, and stay out of the way. Anything else — lifting the cats' positions into state, say —
 * would be sixty reconciliations a second to move six numbers.
 */
export function Room({ onDoor, onCat }: RoomProps) {
  const host = useRef<HTMLDivElement>(null);

  /*
   * Registers <playground-room> and <cat-portrait>, once, in the browser only. The import is
   * dynamic because the module touches `document` and `customElements` at evaluation time, and
   * because three.js has no business in the server bundle.
   */
  useEffect(() => {
    import('./room/playground-room.js');
  }, []);

  /*
   * Both events bubble, so one listener on the wrapper covers every object in the scene. The
   * element is inert until connectedCallback and cancels its RAF and ResizeObserver in
   * disconnectedCallback, so strict mode's double mount is safe.
   */
  useEffect(() => {
    const el = host.current;
    if (!el) return;

    const door = (e: Event) => onDoor((e as CustomEvent).detail.id as DoorId);
    const cat = (e: Event) => onCat((e as CustomEvent).detail.variant as CatVariant);

    el.addEventListener('door', door);
    el.addEventListener('cat', cat);
    return () => {
      el.removeEventListener('door', door);
      el.removeEventListener('cat', cat);
    };
  }, [onDoor, onCat]);

  return (
    <div ref={host} className={styles.stage}>
      <playground-room />
    </div>
  );
}
