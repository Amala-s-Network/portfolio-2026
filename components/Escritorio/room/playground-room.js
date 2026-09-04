/*
 * The playground room, and the codec portrait that goes with it.
 *
 * <playground-room>   the room itself — flat black-and-white, fixed camera, square volumes with
 *                     their own EdgesGeometry outline, which is what makes it read as inked
 *                     rather than rendered. No lights at all: a lit scene has gradients, and
 *                     gradients are the one thing this drawing cannot have.
 * <cat-portrait>      one cat on a turntable, rendered in phosphor green for the codec card.
 *
 * <playground-room> emits:
 *   'door' {id}       a frame or the arcade was clicked
 *   'cat'  {variant}  a cat was clicked
 *   'ready'
 */
(() => {
  const PAPER = 0xf4f2ec;
  const PAPER_D = 0xe7e3d9;
  const GREY_1 = 0xd2cec4;
  const GREY_2 = 0xb0aba0;
  const GREY_3 = 0x7d786f;
  const GREY_4 = 0x54504a;
  const INK = 0x14120f;

  const BOOKS = [PAPER, GREY_1, GREY_2, GREY_3, GREY_4, INK, 0xe0dbd0, 0x9a958b];
  const CAT_NAMES = { tabby: 'BAYLE', white: 'MEL', black: 'ROCKY' };

  /*
   * Every screen, caption and label in this room is painted into a 2D canvas, and canvas2d has no
   * font-loading of its own: it draws with whatever is resolvable AT THE MOMENT OF THE CALL, and
   * silently substitutes when it is not. The live screens repaint every frame and would heal
   * themselves; the three frame captions are painted once, onto a plane whose width is derived
   * from the string, so a substituted font overflows the texture and the brackets are cut off for
   * the life of the page.
   *
   * `document.fonts.ready` alone does not cover this. It settles once the fonts ALREADY being
   * loaded have settled — and in the prototype Archivo was installed on the machine, so nothing
   * was ever pending and it read as sufficient. Here the font arrives from next/font, and this
   * canvas is usually the first thing in the document to ask for it, so `ready` can resolve
   * before the face exists. Asking for each weight by name starts the fetch and waits for it.
   */
  const FACES = ['300 16px Archivo', '400 16px Archivo', '500 16px Archivo', '600 16px Archivo', '700 16px Archivo'];
  const facesReady = async () => {
    if (!document.fonts) return;
    try {
      await Promise.all(FACES.map((f) => document.fonts.load(f)));
      await document.fonts.ready;
    } catch (e) {
      /* Painting with a substituted face is worse than ideal, not fatal. */
    }
  };

  /* ------------------------------------------------------------------ the kit */

  /**
   * The drawing primitives, bound to one ink colour.
   *
   * Built as a factory because the codec portrait draws the same cat in green: same geometry,
   * different ink. Geometry is cached per kit, since a room of one-off boxes is a room that
   * allocates a few hundred buffers for no reason.
   */
  const makeKit = (THREE, ink) => {
    const lineMat = new THREE.LineBasicMaterial({ color: ink });
    const lineSoft = new THREE.LineBasicMaterial({ color: ink, transparent: true, opacity: 0.4 });
    const flat = (c) => new THREE.MeshBasicMaterial({ color: c });

    const geo = new Map();
    const bgeo = (w, h, d) => {
      const key = `${w}|${h}|${d}`;
      let g = geo.get(key);
      if (!g) {
        g = new THREE.BoxGeometry(w, h, d);
        g.userData.edges = new THREE.EdgesGeometry(g);
        geo.set(key, g);
      }
      return g;
    };

    const box = (w, h, d, color = PAPER, soft = false) => {
      const g = bgeo(w, h, d);
      const m = new THREE.Mesh(g, flat(color));
      m.add(new THREE.LineSegments(g.userData.edges, soft ? lineSoft : lineMat));
      return m;
    };

    const slab = (w, h, d, color) => new THREE.Mesh(bgeo(w, h, d), flat(color));

    const tube = (r, h, color, seg = 18) => {
      const g = new THREE.CylinderGeometry(r, r, h, seg);
      const m = new THREE.Mesh(g, flat(color));
      m.add(new THREE.LineSegments(new THREE.EdgesGeometry(g, 30), lineMat));
      return m;
    };

    const ball = (r, color, seg = 14) =>
      new THREE.Mesh(new THREE.SphereGeometry(r, seg, Math.round(seg * 0.7)), flat(color));

    const at = (m, x, y, z) => { m.position.set(x, y, z); return m; };

    return { THREE, ink, lineMat, lineSoft, flat, box, slab, tube, ball, at };
  };

  /* ------------------------------------------------------------------ the cat */

  const makeCat = (kit, variant, coats) => {
    const { THREE, box, slab, ball, at, flat, lineMat } = kit;
    const coat = coats[variant];
    const detail = coats.detail(variant);
    const g = new THREE.Group();

    const shadow = new THREE.Mesh(
      new THREE.CircleGeometry(0.34, 20),
      new THREE.MeshBasicMaterial({ color: kit.ink, transparent: true, opacity: 0.14 }),
    );
    shadow.rotation.x = -Math.PI / 2;
    g.add(at(shadow, 0, 0.012, 0));

    const spine = new THREE.Group();
    g.add(spine);

    const torso = box(0.74, 0.36, 0.34, coat);
    spine.add(at(torso, 0, 0.42, 0));
    spine.add(at(box(0.15, 0.18, 0.19, coat), 0.4, 0.5, 0));
    if (variant === 'tabby') {
      const stripe = flat(coats.stripe);
      for (let i = 0; i < 4; i++) {
        spine.add(at(new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.372, 0.35), stripe), -0.24 + i * 0.16, 0.43, 0));
      }
    }

    const head = new THREE.Group();
    head.add(at(box(0.32, 0.32, 0.3, coat), 0, 0, 0));
    const ears = [];
    [-0.1, 0.1].forEach((z) => {
      const e = new THREE.Mesh(new THREE.ConeGeometry(0.095, 0.2, 4), flat(coat));
      e.add(new THREE.LineSegments(new THREE.EdgesGeometry(e.geometry), lineMat));
      e.rotation.y = Math.PI / 4;
      head.add(at(e, -0.02, 0.25, z));
      ears.push(e);
    });
    const eyes = new THREE.Group();
    [-0.08, 0.08].forEach((z) => {
      eyes.add(at(new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.06, 0.06), flat(detail)), 0.162, 0.04, z));
    });
    head.add(eyes);
    /* A sleeping cat's eyes are lines, not dots — the only cue that reads at this size. */
    const lids = new THREE.Group();
    [-0.08, 0.08].forEach((z) => {
      lids.add(at(new THREE.Mesh(new THREE.BoxGeometry(0.021, 0.022, 0.09), flat(detail)), 0.164, 0.04, z));
    });
    lids.visible = false;
    head.add(lids);
    head.add(at(slab(0.03, 0.05, 0.07, detail), 0.17, -0.06, 0));
    head.position.set(0.52, 0.58, 0);
    spine.add(head);

    const tail = new THREE.Group();
    tail.add(at(box(0.28, 0.07, 0.07, coat), -0.14, 0.06, 0));
    tail.add(at(box(0.07, 0.26, 0.07, coat), -0.27, 0.2, 0));
    tail.position.set(-0.38, 0.5, 0);
    spine.add(tail);

    const legs = [];
    [[0.26, 0.12], [0.26, -0.12], [-0.26, 0.12], [-0.26, -0.12]].forEach(([x, z]) => {
      const pivot = new THREE.Group();
      pivot.position.set(x, 0.26, z);
      pivot.add(at(box(0.1, 0.26, 0.1, coat), 0, -0.13, 0));
      spine.add(pivot);
      legs.push(pivot);
    });

    g.userData = { spine, head, tail, legs, torso, lids, eyes, ears, variant, label: CAT_NAMES[variant] };
    return g;
  };

  const INK_COATS = {
    tabby: GREY_2, white: 0xddd8ca, black: INK, stripe: GREY_3,
    detail: (v) => (v === 'black' ? PAPER : INK),
  };

  const lerp = (a, b, k) => a + (b - a) * k;

  /**
   * Rocky, between asleep and mid-stretch.
   *
   * One function and one 0..1 dial rather than two poses and a transition: he is asleep almost
   * all of the time, and the stretch has to be able to start and unwind from wherever it is.
   */
  const poseSleep = (u, k) => {
    u.spine.position.y = lerp(-0.22, -0.02, k);
    u.spine.rotation.z = lerp(0, -0.24, k);
    u.legs[0].rotation.z = lerp(-1.45, -0.95, k);
    u.legs[1].rotation.z = lerp(-1.45, -1.05, k);
    u.legs[2].rotation.z = lerp(1.45, 0.55, k);
    u.legs[3].rotation.z = lerp(1.45, 0.65, k);
    u.head.position.set(lerp(0.58, 0.64, k), lerp(0.2, 0.44, k), 0.02);
    u.head.rotation.z = lerp(-0.18, 0.3, k);
    u.tail.position.set(-0.4, lerp(0.2, 0.46, k), lerp(0.06, 0.02, k));
    u.tail.rotation.z = lerp(1.45, 0.4, k);
    u.tail.rotation.y = lerp(1.9, 0.5, k);
    u.lids.visible = k < 0.45;
    u.eyes.visible = k >= 0.45;
    u.ears.forEach((e, i) => { e.rotation.z = lerp(0, i ? 0.2 : -0.2, k); });
  };

  /* ===================================================================== room */

  class PlaygroundRoom extends HTMLElement {
    connectedCallback() {
      if (this._booted) return;
      this._booted = true;
      this.boot();
    }

    disconnectedCallback() {
      this._dead = true;
      if (this._raf) cancelAnimationFrame(this._raf);
      if (this._ro) this._ro.disconnect();
    }

    async boot() {
      const THREE = await import('three');
      if (this._dead) return;
      await facesReady();

      const kit = makeKit(THREE, INK);
      const { box, slab, tube, ball, at, flat, lineMat, lineSoft } = kit;

      this.style.cssText = 'display:block;position:relative;width:100%;height:100%;cursor:default';

      const canvas = document.createElement('canvas');
      canvas.style.cssText = 'display:block;width:100%;height:100%';
      this.appendChild(canvas);

      /* The hover reticle: four brackets in DOM, over the drawing. Crisper than anything drawn
         in the scene, and it can carry a text label. */
      const reticle = document.createElement('div');
      reticle.style.cssText =
        'position:absolute;pointer-events:none;opacity:0;transition:opacity .18s linear;left:0;top:0';
      reticle.innerHTML = ['nw', 'ne', 'sw', 'se'].map((c) => `<i data-c="${c}"></i>`).join('') + '<b></b>';
      reticle.querySelectorAll('i').forEach((i) => {
        const c = i.dataset.c;
        i.style.cssText =
          'position:absolute;width:14px;height:14px;border:2px solid #14120f;' +
          (c[0] === 'n' ? 'top:0;border-bottom:0;' : 'bottom:0;border-top:0;') +
          (c[1] === 'w' ? 'left:0;border-right:0;' : 'right:0;border-left:0;');
      });
      const badge = reticle.querySelector('b');
      badge.style.cssText =
        'position:absolute;left:0;top:100%;margin-top:8px;background:#14120f;color:#f4f2ec;' +
        'font:600 11px/1 Archivo,system-ui,sans-serif;letter-spacing:.14em;padding:7px 10px;white-space:nowrap';
      this.appendChild(reticle);

      const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(PAPER);
      const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 200);

      const drawn = (w, h, px, draw) => {
        const c = document.createElement('canvas');
        c.width = Math.round(px);
        c.height = Math.round((px * h) / w);
        const ctx = c.getContext('2d');
        draw(ctx, c.width, c.height);
        const tex = new THREE.CanvasTexture(c);
        tex.anisotropy = 4;
        const mesh = new THREE.Mesh(
          new THREE.PlaneGeometry(w, h),
          new THREE.MeshBasicMaterial({ map: tex, transparent: true }),
        );
        mesh.userData = { ctx, tex, cw: c.width, ch: c.height };
        return mesh;
      };

      const text = (str, w, h, opts = {}) => {
        const o = Object.assign({ size: 46, weight: 600, track: 0.14, fg: '#14120f', bg: null, px: 640 }, opts);
        return drawn(w, h, o.px, (ctx, cw, ch) => {
          if (o.bg) { ctx.fillStyle = o.bg; ctx.fillRect(0, 0, cw, ch); }
          ctx.fillStyle = o.fg;
          ctx.font = `${o.weight} ${o.size}px Archivo, system-ui, sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.letterSpacing = `${o.track}em`;
          ctx.fillText(str, cw / 2, ch / 2 + 2);
        });
      };

      const tone = (ctx, cw, ch, step = 7, r = 1.3, a = 0.5) => {
        ctx.save();
        ctx.fillStyle = `rgba(20,18,15,${a})`;
        for (let y = step / 2; y < ch; y += step) {
          for (let x = step / 2; x < cw; x += step) {
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        ctx.restore();
      };

      /* ------------------------------------------------------------------- room */

      const room = new THREE.Group();
      scene.add(room);

      const floor = drawn(26, 20, 1560, (ctx, cw, ch) => {
        ctx.fillStyle = '#e7e3d9';
        ctx.fillRect(0, 0, cw, ch);
        const pitch = ch / 15;
        ctx.lineWidth = 2.4;
        ctx.strokeStyle = 'rgba(20,18,15,.42)';
        for (let i = 0; i <= 15; i++) {
          const y = Math.round(i * pitch) + 0.5;
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(cw, y);
          ctx.stroke();
        }
        ctx.lineWidth = 1.8;
        ctx.strokeStyle = 'rgba(20,18,15,.3)';
        const seg = cw / 6;
        for (let i = 0; i < 15; i++) {
          const off = (i % 3) * (seg / 3);
          for (let x = off; x < cw; x += seg) {
            ctx.beginPath();
            ctx.moveTo(Math.round(x) + 0.5, i * pitch);
            ctx.lineTo(Math.round(x) + 0.5, (i + 1) * pitch);
            ctx.stroke();
          }
        }
      });
      floor.rotation.x = -Math.PI / 2;
      at(floor, 0, 0.01, 1);
      room.add(floor);

      const wallBack = drawn(26, 13, 800, (ctx, cw, ch) => {
        ctx.fillStyle = '#f4f2ec';
        ctx.fillRect(0, 0, cw, ch);
        tone(ctx, cw, ch, 10, 1.0, 0.1);
      });
      at(wallBack, 0, 6.5, -6);
      room.add(wallBack);

      const wallRight = new THREE.Mesh(new THREE.PlaneGeometry(20, 13), flat(PAPER));
      wallRight.rotation.y = -Math.PI / 2;
      at(wallRight, 9, 6.5, 3);
      room.add(wallRight);

      const wallLeft = new THREE.Mesh(new THREE.PlaneGeometry(20, 13), flat(PAPER_D));
      wallLeft.rotation.y = Math.PI / 2;
      at(wallLeft, -9.6, 6.5, 3);
      room.add(wallLeft);

      room.add(at(box(26, 0.07, 0.07, INK), 0, 0.03, -6));

      const splat = drawn(3.6, 3.6, 320, (ctx, cw, ch) => {
        ctx.clearRect(0, 0, cw, ch);
        ctx.fillStyle = 'rgba(20,18,15,.8)';
        [[170, 90, 15], [200, 122, 8], [143, 126, 6], [214, 70, 5], [128, 66, 4],
          [186, 158, 4.5], [232, 104, 3], [110, 100, 3.4], [160, 172, 2.6], [246, 138, 2]]
          .forEach(([x, y, r]) => { ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); });
      });
      at(splat, 7.9, 3.8, -5.94);
      room.add(splat);

      /* ------------------------------------------------------------- the frames */

      const doors = [];
      const FRAMES = [
        { id: 'projetos', label: '[PROJETOS]', w: 4.6, h: 2.3, x: -4.1, kind: 'grid' },
        { id: 'interfaces', label: '[INTERFACES]', w: 3.7, h: 1.85, x: 0.4, kind: 'wire' },
        { id: 'componentes', label: '[COMPONENTES]', w: 2.9, h: 1.45, x: 4.8, kind: 'list' },
      ];
      const FRAME_Y = 6.2;

      const wireFrame = (kind) => (ctx, cw, ch) => {
        ctx.fillStyle = '#f4f2ec';
        ctx.fillRect(0, 0, cw, ch);
        ctx.strokeStyle = '#14120f';
        ctx.lineWidth = 2.4;
        const p = cw * 0.06;
        if (kind === 'grid') {
          ctx.strokeRect(p, p, cw - p * 2, ch * 0.16);
          for (let c = 0; c < 4; c++) {
            for (let r = 0; r < 2; r++) {
              const w = (cw - p * 2) / 4 - 10;
              const x = p + c * ((cw - p * 2) / 4);
              const y = p + ch * 0.24 + r * (ch * 0.34);
              ctx.strokeRect(x, y, w, ch * 0.28);
              if (c === 2 && r === 0) {
                ctx.save();
                ctx.beginPath();
                ctx.rect(x, y, w, ch * 0.28);
                ctx.clip();
                tone(ctx, cw, ch, 8, 1.6, 0.5);
                ctx.restore();
              }
            }
          }
        } else if (kind === 'wire') {
          ctx.strokeRect(p, p, cw - p * 2, ch * 0.44);
          ctx.lineWidth = 1.7;
          ctx.beginPath();
          ctx.moveTo(p, p); ctx.lineTo(cw - p, p + ch * 0.44);
          ctx.moveTo(cw - p, p); ctx.lineTo(p, p + ch * 0.44);
          ctx.stroke();
          ctx.lineWidth = 2.4;
          ctx.strokeRect(p, p + ch * 0.54, (cw - p * 2) * 0.5, ch * 0.14);
          ctx.strokeRect(p, p + ch * 0.76, cw - p * 2, ch * 0.18);
        } else {
          const rows = 5;
          for (let r = 0; r < rows; r++) {
            const y = p + r * ((ch - p * 2) / rows);
            ctx.strokeRect(p, y, cw - p * 2, (ch - p * 2) / rows - 8);
            ctx.fillStyle = '#14120f';
            ctx.fillRect(p + 10, y + 10, 28, (ch - p * 2) / rows - 28);
          }
        }
      };

      FRAMES.forEach((f) => {
        const g = new THREE.Group();
        const shell = box(f.w, f.h, 0.26, INK);
        g.add(at(shell, 0, 0, 0));
        g.add(at(box(f.w - 0.38, f.h - 0.38, 0.1, PAPER), 0, 0, 0.13));
        g.add(at(drawn(f.w - 0.68, f.h - 0.68, 560, wireFrame(f.kind)), 0, 0, 0.2));
        g.position.set(f.x, FRAME_Y, -5.7);
        room.add(g);

        /* Each caption on a plane sized to its own string, at a constant 178px per world unit so
           the type stays one size across the three. */
        const capPx = f.label.length * 50;
        room.add(at(text(f.label, capPx / 178, 0.52, { size: 62, weight: 700, px: capPx }), f.x, 4.56, -5.68));

        shell.userData.door = f.id;
        shell.userData.label = f.label.replace(/[[\]]/g, '');
        doors.push(shell);
      });

      /* ------------------------------------------------------------- the arcade */

      const arcade = new THREE.Group();
      const cab = box(1.9, 4.4, 1.5, GREY_1);
      arcade.add(at(cab, 0, 2.2, 0));
      arcade.add(at(box(1.9, 0.7, 0.42, PAPER), 0, 4.15, 0.62));
      arcade.add(at(text('GAME ROOM · 2026', 1.72, 0.34, { size: 40, weight: 700, bg: '#f4f2ec' }), 0, 4.16, 0.85));

      const screen = drawn(1.6, 1.05, 420, (ctx, cw, ch) => { ctx.fillStyle = '#14120f'; ctx.fillRect(0, 0, cw, ch); });
      arcade.add(at(box(1.78, 1.2, 0.16, INK), 0, 3.24, 0.72));
      arcade.add(at(screen, 0, 3.24, 0.84));

      arcade.add(at(box(1.9, 0.24, 0.9, PAPER), 0, 2.5, 0.95));
      arcade.add(at(box(0.1, 0.34, 0.1, INK), -0.5, 2.76, 1.0));
      arcade.add(at(ball(0.11, INK), -0.5, 2.95, 1.0));
      for (let i = 0; i < 3; i++) arcade.add(at(tube(0.09, 0.06, PAPER, 16), 0.05 + i * 0.28, 2.65, 0.98));
      arcade.add(at(box(1.2, 0.9, 0.08, PAPER), 0, 0.85, 0.78));
      arcade.add(at(box(0.3, 0.09, 0.06, INK), -0.22, 1.05, 0.83));
      arcade.add(at(box(0.3, 0.09, 0.06, INK), 0.22, 1.05, 0.83));

      arcade.scale.setScalar(1.34);
      arcade.position.set(-7.9, 0, -4.4);
      arcade.rotation.y = 0.54;
      room.add(arcade);
      cab.userData.door = 'arcade';
      cab.userData.label = 'INSERT COIN';
      doors.push(cab);

      /* ------------------------------------------------------------ the books */

      /*
       * Flush with the left wall, at no angle at all.
       *
       * An open case built from panels: a solid box with books tucked inside it is a box, because
       * the carcass's own front face covers every spine on the shelf.
       */
      const shelf = new THREE.Group();
      shelf.add(at(box(0.1, 4.0, 4.2, PAPER), -0.26, 2.0, 0));
      shelf.add(at(box(0.62, 0.12, 4.2, PAPER), 0, 3.94, 0));
      shelf.add(at(box(0.62, 0.12, 4.2, PAPER), 0, 0.06, 0));
      shelf.add(at(box(0.62, 4.0, 0.12, PAPER), 0, 2.0, -2.1));
      shelf.add(at(box(0.62, 4.0, 0.12, PAPER), 0, 2.0, 2.1));
      const BOARDS = [0.62, 1.5, 2.38, 3.26];
      BOARDS.forEach((y) => shelf.add(at(box(0.62, 0.09, 4.0, PAPER_D), 0, y, 0)));

      BOARDS.forEach((y, row) => {
        let z = -1.9;
        let n = 0;
        while (z < 1.5) {
          const thick = 0.14 + Math.random() * 0.15;
          const tall = 0.56 + Math.random() * 0.18;
          const b = slab(0.5, tall, thick, BOOKS[(row * 3 + n) % BOOKS.length]);
          b.position.set(0.04, y + 0.045 + tall / 2, z + thick / 2);
          if (n % 5 === 4) { b.rotation.x = 0.22; b.position.y -= 0.03; }
          shelf.add(b);
          /* A hairline down each spine, so a shelf of tones still reads as separate books. */
          const edge = slab(0.505, tall, 0.016, INK);
          edge.position.copy(b.position);
          edge.rotation.copy(b.rotation);
          edge.position.z += thick / 2;
          shelf.add(edge);
          z += thick + 0.015;
          n++;
        }
        if (row % 2 === 1) {
          for (let i = 0; i < 3; i++) {
            shelf.add(at(slab(0.46, 0.11, 0.66, BOOKS[(row + i * 2) % BOOKS.length]), 0.04, y + 0.1 + i * 0.12, 1.72));
          }
        }
      });

      shelf.position.set(-9.25, 0, 0.4);
      room.add(shelf);

      /* ------------------------------------------------------- the L-shaped desk */

      const desk = new THREE.Group();
      const TOP = 1.62;

      desk.add(at(box(6.4, 0.16, 1.8, PAPER), 0, TOP, -2.2));
      desk.add(at(box(1.8, 0.16, 2.3, PAPER), 2.3, TOP, -0.15));

      [[-3.0, -2.9], [-3.0, -1.5], [3.1, -2.9], [3.1, 0.85], [1.5, 0.85]].forEach(([x, z]) => {
        desk.add(at(box(0.12, TOP - 0.08, 0.12, PAPER), x, (TOP - 0.08) / 2, z));
      });

      desk.add(at(box(2.6, 1.6, 0.18, PAPER), 0.2, 2.62, -2.5));
      const monScreen = drawn(2.3, 1.32, 540, (ctx, cw, ch) => { ctx.fillStyle = '#14120f'; ctx.fillRect(0, 0, cw, ch); });
      desk.add(at(monScreen, 0.2, 2.62, -2.39));
      desk.add(at(box(0.5, 0.55, 0.14, PAPER), 0.2, 1.94, -2.5));
      desk.add(at(box(1.15, 0.1, 0.55, PAPER), 0.2, 1.75, -2.4));

      /* the tower, under the long run and short enough to fit under it */
      desk.add(at(box(0.85, 1.42, 1.5, GREY_1), -2.3, 0.71, -2.3));
      desk.add(at(box(0.55, 0.06, 0.05, INK), -2.3, 1.22, -1.56));
      desk.add(at(box(0.55, 0.06, 0.05, INK), -2.3, 1.08, -1.56));

      const kbTop = drawn(1.9, 0.72, 380, (ctx, cw, ch) => {
        ctx.fillStyle = '#f4f2ec';
        ctx.fillRect(0, 0, cw, ch);
        ctx.strokeStyle = '#14120f';
        ctx.lineWidth = 1.5;
        for (let r = 0; r < 4; r++) {
          for (let c = 0; c < 14; c++) {
            ctx.strokeRect(10 + c * ((cw - 20) / 14), 8 + r * ((ch - 16) / 4), (cw - 20) / 14 - 4, (ch - 16) / 4 - 5);
          }
        }
      });
      kbTop.rotation.x = -Math.PI / 2;
      desk.add(at(box(1.9, 0.07, 0.72, PAPER), 0.2, TOP + 0.11, -1.75));
      desk.add(at(kbTop, 0.2, TOP + 0.16, -1.75));
      desk.add(at(box(0.24, 0.09, 0.36, PAPER), 1.5, TOP + 0.12, -1.72));

      desk.add(at(box(1.9, 0.1, 1.3, PAPER), 2.3, TOP + 0.13, -0.1));
      const lid = new THREE.Group();
      lid.add(at(box(1.9, 1.3, 0.08, PAPER), 0, 0.65, 0));
      const lapScreen = drawn(1.72, 1.12, 420, (ctx, cw, ch) => { ctx.fillStyle = '#f4f2ec'; ctx.fillRect(0, 0, cw, ch); });
      lid.add(at(lapScreen, 0, 0.65, 0.06));
      lid.position.set(2.3, TOP + 0.16, -0.72);
      lid.rotation.x = -0.2;
      desk.add(lid);

      desk.add(at(tube(0.17, 0.36, PAPER), 1.3, TOP + 0.26, -0.9));

      desk.position.set(4.3, 0, -1.0);
      room.add(desk);

      /* --------------------------------------------------------- the tube TVs */

      /*
       * Two sets on one unit, squared up with the back wall and running up to the left end of the
       * desk. Consoles in solid ink: they are the black plastic in a room that has none.
       */
      const media = new THREE.Group();
      media.add(at(box(6.7, 0.16, 1.7, PAPER), 0, 1.0, 0));
      media.add(at(box(6.7, 0.16, 1.7, PAPER), 0, 0.42, 0));
      [-3.2, -1.05, 1.05, 3.2].forEach((x) => {
        [-0.7, 0.7].forEach((z) => media.add(at(box(0.12, 1.08, 0.12, PAPER), x, 0.54, z)));
      });

      const tvScreens = [];
      const makeTv = (x, size, id, label) => {
        const g = new THREE.Group();
        const shell = box(2.3 * size, 1.9 * size, 1.75, GREY_1);
        shell.userData.door = id;
        shell.userData.label = label;
        doors.push(shell);
        g.add(at(shell, 0, 1.03 * size, -0.05));
        g.add(at(box(1.98 * size, 1.56 * size, 0.12, INK), 0, 1.1 * size, 0.8));
        const sc = drawn(1.78 * size, 1.34 * size, 440, (ctx, cw, ch) => {
          ctx.fillStyle = '#14120f';
          ctx.fillRect(0, 0, cw, ch);
        });
        g.add(at(sc, 0, 1.1 * size, 0.88));
        g.add(at(box(2.3 * size, 0.28, 0.2, PAPER), 0, 0.22 * size, 0.84));
        [0.55, 0.8].forEach((dx) => {
          const d = tube(0.065, 0.07, PAPER, 14);
          d.rotation.x = Math.PI / 2;
          g.add(at(d, dx * size, 0.22 * size, 0.96));
        });
        g.position.set(x, 1.08, 0);
        media.add(g);
        tvScreens.push(sc);
        return g;
      };
      makeTv(-2.1, 1, 'codec', 'CODEC · 140.85');
      makeTv(1.6, 0.82, 'rpg', 'BATALHA');

      /* the consoles, in ink, on the lower shelf */
      media.add(at(box(1.3, 0.26, 0.9, INK), -2.5, 0.63, 0.1));
      media.add(at(box(0.36, 0.05, 0.5, GREY_3), -2.5, 0.78, 0.1));
      media.add(at(box(1.1, 0.34, 0.8, INK), -0.6, 0.67, 0.1));
      media.add(at(box(0.5, 0.05, 0.34, GREY_3), -0.6, 0.86, 0.1));
      media.add(at(box(0.95, 0.2, 0.75, INK), 1.5, 0.6, 0.1));
      media.add(at(box(0.32, 0.05, 0.42, GREY_3), 1.5, 0.72, 0.1));
      /* one controller on the shelf is not enough for this room */
      for (let i = 0; i < 3; i++) {
        media.add(at(box(0.66, 0.14, 0.52, i === 1 ? PAPER : GREY_1), 3.0, 1.15 + i * 0.15, -0.4));
      }
      /* one controller on the shelf, its twin on the floor */
      /*
       * A dual-stick pad, the shape everyone's hands already know: slab body, two grips angled
       * down and out, d-pad, four face buttons, two sticks, two shoulders. Small enough in frame
       * that the silhouette is doing all the work.
       */
      const makePad = () => {
        const p = new THREE.Group();
        p.add(at(box(0.62, 0.1, 0.26, INK), 0, 0, 0));
        [-1, 1].forEach((sx) => {
          const grip = box(0.15, 0.09, 0.34, INK);
          grip.position.set(sx * 0.2, -0.03, 0.2);
          grip.rotation.x = -0.34;
          grip.rotation.z = sx * 0.12;
          p.add(grip);
          p.add(at(box(0.13, 0.05, 0.08, GREY_4), sx * 0.19, 0.05, -0.14));
        });
        /* d-pad */
        p.add(at(box(0.13, 0.03, 0.04, GREY_3), -0.19, 0.06, -0.02));
        p.add(at(box(0.04, 0.03, 0.13, GREY_3), -0.19, 0.06, -0.02));
        /* the four faces */
        [[0, -0.055], [0.055, 0], [0, 0.055], [-0.055, 0]].forEach(([dx, dz]) => {
          const b = tube(0.022, 0.03, GREY_3, 10);
          p.add(at(b, 0.19 + dx, 0.065, -0.02 + dz));
        });
        /* the sticks */
        [-0.085, 0.085].forEach((sx) => {
          p.add(at(tube(0.045, 0.04, GREY_4, 12), sx, 0.06, 0.07));
          p.add(at(tube(0.036, 0.05, GREY_3, 12), sx, 0.09, 0.07));
        });
        p.add(at(box(0.09, 0.03, 0.05, GREY_3), 0, 0.05, -0.06));
        return p;
      };

      /* two on the shelf, both wired back to the left console — it is a two-player rack */
      const shelfPad = makePad();
      shelfPad.position.set(-3.25, 1.14, 0.5);
      shelfPad.rotation.y = 0.42;
      media.add(shelfPad);
      media.add(at(box(0.045, 0.045, 0.78, INK, true), -3.15, 1.1, 0.93));
      media.add(at(box(0.5, 0.045, 0.045, INK, true), -2.92, 1.1, 1.3));

      const shelfPad2 = makePad();
      shelfPad2.position.set(-1.72, 1.14, 0.56);
      shelfPad2.rotation.y = -0.26;
      media.add(shelfPad2);
      media.add(at(box(0.045, 0.045, 0.7, INK, true), -1.82, 1.1, 0.95));
      media.add(at(box(0.72, 0.045, 0.045, INK, true), -2.2, 1.1, 1.28));

      media.position.set(-2.3, 0, -5.0);
      room.add(media);

      /* and the one somebody left on the floor, cable still running back to the rack */
      const padG = new THREE.Group();
      const floorPad = makePad();
      floorPad.position.y = 0.05;
      padG.add(floorPad);
      padG.add(at(box(0.045, 0.045, 1.5, INK, true), 0, 0.022, -0.9));
      padG.add(at(box(1.1, 0.045, 0.045, INK, true), -0.5, 0.022, -1.62));
      padG.position.set(-2.6, 0, -2.9);
      padG.rotation.y = -0.5;
      room.add(padG);

      /* ---------------------------------------------------- the chair, and whoever is in it */

      const seat = new THREE.Group();
      seat.add(at(tube(0.09, 0.5, GREY_1, 14), 0, 0.5, 0));
      for (let i = 0; i < 5; i++) {
        const a = (i / 5) * Math.PI * 2;
        const arm = box(0.7, 0.09, 0.13, GREY_1);
        arm.position.set(Math.cos(a) * 0.34, 0.16, Math.sin(a) * 0.34);
        arm.rotation.y = -a;
        seat.add(arm);
        seat.add(at(ball(0.08, INK, 10), Math.cos(a) * 0.66, 0.08, Math.sin(a) * 0.66));
      }
      seat.add(at(box(1.05, 0.18, 1.0, GREY_2), 0, 0.83, 0));
      const back = box(1.05, 1.25, 0.18, GREY_2);
      back.position.set(0, 1.5, 0.48);
      back.rotation.x = -0.14;
      seat.add(back);

      const body = new THREE.Group();
      body.add(at(box(0.86, 1.0, 0.5, PAPER), 0, 1.42, 0.1));
      body.add(at(box(0.44, 0.24, 0.36, PAPER), 0, 1.98, 0.1));
      const headM = box(0.56, 0.58, 0.52, PAPER);
      body.add(at(headM, 0, 2.38, 0.06));
      body.add(at(slab(0.59, 0.32, 0.55, INK), 0, 2.56, 0.07));
      body.add(at(slab(0.59, 0.38, 0.18, INK), 0, 2.36, 0.32));

      const armL = new THREE.Group();
      armL.add(at(box(0.2, 0.2, 1.0, PAPER), 0, 0, -0.42));
      armL.position.set(-0.46, 1.62, 0.02);
      body.add(armL);
      const armR = new THREE.Group();
      armR.add(at(box(0.2, 0.2, 1.0, PAPER), 0, 0, -0.42));
      armR.position.set(0.46, 1.62, 0.02);
      body.add(armR);

      seat.add(body);
      seat.position.set(4.5, 0, -1.5);
      seat.rotation.y = 0.12;
      room.add(seat);

      /* ------------------------------------------------------------ the screens */

      /*
       * The playlist on the laptop — "Cutting the neck", 100 tracks.
       *
       * The first entry is the only track the playlist exposes publicly. The rest are stand-ins
       * chosen to sit in the same register, NOT read from the playlist — swap any line for the
       * real one and the panel picks it up: one track every twelve seconds, next three queued.
       */
      const PLAYLIST_NAME = 'Cutting the neck';
      const PLAYLIST_COUNT = 100;
      const PLAYLIST = [
        ['Cry', 'Cigarettes After Sex'],
        ['Apocalypse', 'Cigarettes After Sex'],
        ['Space Song', 'Beach House'],
        ['Nobody', 'Mitski'],
        ['The Night We Met', 'Lord Huron'],
        ['Motion Sickness', 'Phoebe Bridgers'],
        ['Something About Us', 'Daft Punk'],
        ['Vampire Empire', 'Big Thief'],
      ];
      let track = 0;
      let trackT = 0;

      const noise = (ctx, cw, ch, t, label) => {
        const img = ctx.createImageData(cw, ch);
        for (let i = 0; i < img.data.length; i += 4) {
          const v = 20 + Math.random() * 210;
          img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
          img.data[i + 3] = 255;
        }
        ctx.putImageData(img, 0, 0);
        ctx.fillStyle = 'rgba(20,18,15,.65)';
        ctx.fillRect(0, (t / 6) % ch, cw, 26);
        if (label) {
          ctx.fillStyle = '#f4f2ec';
          ctx.font = '600 22px Archivo, sans-serif';
          ctx.letterSpacing = '0.2em';
          ctx.fillText(label, 34, 48);
          ctx.letterSpacing = '0em';
        }
      };

      /*
       * The main monitor: a design tool, always. Layers on the left, canvas in the middle,
       * inspector on the right — the three-panel shape you recognise from across a room, drawn
       * in the room's own ink and paper rather than another app's chrome.
       */
      const LAYERS = [
        ['Sala 01', 0], ['Fliperama', 1], ['TV · tubo', 1], ['Mesa em L', 1],
        ['Monitor', 2], ['Notebook', 2], ['Gatos', 1], ['Bayle', 2], ['Mel', 2], ['Rocky', 2],
      ];

      const paintMonitor = (t) => {
        const { ctx, cw, ch, tex } = monScreen.userData;
        const P = 0.16;
        ctx.fillStyle = '#cfccc2';
        ctx.fillRect(0, 0, cw, ch);
        ctx.textAlign = 'left';
        ctx.textBaseline = 'alphabetic';

        /* toolbar */
        ctx.fillStyle = '#14120f';
        ctx.fillRect(0, 0, cw, 26);
        ctx.fillStyle = '#f4f2ec';
        for (let i = 0; i < 5; i++) {
          const on = i === (Math.floor(t / 3400) % 5);
          ctx.globalAlpha = on ? 1 : 0.4;
          ctx.fillRect(10 + i * 22, 8, 11, 11);
        }
        ctx.globalAlpha = 1;
        ctx.font = '500 12px Archivo, sans-serif';
        ctx.fillText('sala-01 · rascunhos', 130, 18);
        ctx.fillStyle = '#35d07a';
        ctx.fillRect(cw - 58, 8, 11, 11);
        ctx.fillStyle = 'rgba(244,242,236,.55)';
        ctx.fillRect(cw - 40, 8, 11, 11);
        ctx.fillRect(cw - 22, 8, 11, 11);

        /* layers */
        const LW = 104;
        ctx.fillStyle = '#f4f2ec';
        ctx.fillRect(0, 26, LW, ch - 26);
        ctx.fillStyle = 'rgba(20,18,15,.5)';
        ctx.font = '600 9px Archivo, sans-serif';
        ctx.letterSpacing = '0.16em';
        ctx.fillText('CAMADAS', 10, 44);
        ctx.letterSpacing = '0em';
        const sel = Math.floor(t / 2600) % LAYERS.length;
        LAYERS.forEach(([name, ind], i) => {
          const y = 54 + i * 19;
          if (i === sel) {
            ctx.fillStyle = 'rgba(53,208,122,.24)';
            ctx.fillRect(0, y, LW, 19);
            ctx.fillStyle = '#35d07a';
            ctx.fillRect(0, y, 2, 19);
          }
          ctx.fillStyle = i === sel ? '#14120f' : 'rgba(20,18,15,.68)';
          ctx.font = `${i === sel ? 600 : 400} 11px Archivo, sans-serif`;
          ctx.fillText(name, 10 + ind * 9, y + 13);
        });

        /* inspector */
        const RW = 96;
        const rx = cw - RW;
        ctx.fillStyle = '#f4f2ec';
        ctx.fillRect(rx, 26, RW, ch - 26);
        ctx.fillStyle = 'rgba(20,18,15,.5)';
        ctx.font = '600 9px Archivo, sans-serif';
        ctx.letterSpacing = '0.16em';
        ctx.fillText('PROPRIEDADES', rx + 10, 44);
        ctx.letterSpacing = '0em';
        const jog = Math.round(Math.sin(t / 700) * 12);
        [['X', `${120 + jog}`], ['Y', '64'], ['L', '384'], ['A', '240'], ['R', '0'], ['OP', '100%']]
          .forEach(([k, v], i) => {
            const bx = rx + 10 + (i % 2) * 40;
            const by = 54 + Math.floor(i / 2) * 26;
            ctx.strokeStyle = 'rgba(20,18,15,.28)';
            ctx.lineWidth = 1;
            ctx.strokeRect(bx, by, 34, 18);
            ctx.fillStyle = 'rgba(20,18,15,.45)';
            ctx.font = '500 8px Archivo, sans-serif';
            ctx.fillText(k, bx + 3, by + 12);
            ctx.fillStyle = '#14120f';
            ctx.font = '500 10px Archivo, sans-serif';
            ctx.fillText(v, bx + 14, by + 12);
          });
        ctx.fillStyle = 'rgba(20,18,15,.5)';
        ctx.font = '600 9px Archivo, sans-serif';
        ctx.letterSpacing = '0.16em';
        ctx.fillText('PREENCHIMENTO', rx + 10, 148);
        ctx.letterSpacing = '0em';
        [INK, GREY_2, PAPER].forEach((c, i) => {
          ctx.fillStyle = `#${c.toString(16).padStart(6, '0')}`;
          ctx.fillRect(rx + 10 + i * 22, 156, 18, 18);
          ctx.strokeStyle = 'rgba(20,18,15,.3)';
          ctx.strokeRect(rx + 10 + i * 22, 156, 18, 18);
        });

        /* the canvas, with two frames and a live selection on one of them */
        const cxs = LW + 22;
        const cxe = rx - 22;
        ctx.fillStyle = 'rgba(20,18,15,.45)';
        ctx.font = '500 9px Archivo, sans-serif';
        ctx.fillText('Início / desktop', cxs, 52);
        ctx.fillStyle = '#f4f2ec';
        ctx.fillRect(cxs, 58, (cxe - cxs) * 0.56, 118);
        ctx.strokeStyle = 'rgba(20,18,15,.5)';
        ctx.lineWidth = 1;
        ctx.strokeRect(cxs, 58, (cxe - cxs) * 0.56, 118);
        ctx.fillStyle = 'rgba(20,18,15,.16)';
        ctx.fillRect(cxs + 10, 68, (cxe - cxs) * 0.36, 8);
        ctx.fillRect(cxs + 10, 82, (cxe - cxs) * 0.2, 8);
        for (let i = 0; i < 3; i++) {
          ctx.fillStyle = 'rgba(20,18,15,.1)';
          ctx.fillRect(cxs + 10 + i * 46, 100, 40, 62);
        }

        const fx = cxs + (cxe - cxs) * 0.62;
        const fy = 190;
        const fw = (cxe - cxs) * 0.38;
        const fh = 92;
        ctx.fillStyle = 'rgba(20,18,15,.45)';
        ctx.font = '500 9px Archivo, sans-serif';
        ctx.fillText('Ficha / codec', fx, fy - 6);
        ctx.fillStyle = '#f4f2ec';
        ctx.fillRect(fx, fy, fw, fh);
        ctx.fillStyle = 'rgba(20,18,15,.14)';
        ctx.fillRect(fx + 8, fy + 8, fw * 0.4, fh - 16);
        ctx.fillRect(fx + fw * 0.46, fy + 8, fw * 0.46, 7);
        ctx.fillRect(fx + fw * 0.46, fy + 22, fw * 0.34, 7);
        /* selection: green outline plus the eight handles */
        ctx.strokeStyle = '#35d07a';
        ctx.lineWidth = 1.4;
        ctx.strokeRect(fx, fy, fw, fh);
        ctx.fillStyle = '#f4f2ec';
        [[0, 0], [0.5, 0], [1, 0], [0, 0.5], [1, 0.5], [0, 1], [0.5, 1], [1, 1]].forEach(([hx, hy]) => {
          const px = fx + fw * hx - 2.5;
          const py = fy + fh * hy - 2.5;
          ctx.fillRect(px, py, 5, 5);
          ctx.strokeRect(px, py, 5, 5);
        });
        ctx.fillStyle = '#35d07a';
        ctx.fillRect(fx, fy + fh + 5, 62, 12);
        ctx.fillStyle = '#f4f2ec';
        ctx.font = '600 8px Archivo, sans-serif';
        ctx.fillText(`${Math.round(fw)} × ${fh}`, fx + 5, fy + fh + 14);

        /* somebody's cursor, drifting */
        const px = fx + fw * 0.5 + Math.sin(t / 900) * 26;
        const py = fy + fh * 0.4 + Math.cos(t / 1100) * 18;
        ctx.fillStyle = '#14120f';
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(px, py + 12);
        ctx.lineTo(px + 3.4, py + 9);
        ctx.lineTo(px + 8, py + 9);
        ctx.closePath();
        ctx.fill();

        tex.needsUpdate = true;
      };

      const paintArcade = (t) => {
        const { ctx, cw, ch, tex } = screen.userData;
        ctx.fillStyle = '#14120f';
        ctx.fillRect(0, 0, cw, ch);
        ctx.fillStyle = 'rgba(244,242,236,.5)';
        for (let i = 0; i < 26; i++) ctx.fillRect((i * 97 + t / 24) % cw, (i * 53) % ch, 2, 6);
        ctx.textAlign = 'center';
        ctx.fillStyle = '#f4f2ec';
        ctx.font = '700 74px Archivo, sans-serif';
        ctx.letterSpacing = '0.08em';
        ctx.fillText('START', cw / 2, ch / 2 + 4);
        ctx.letterSpacing = '0.22em';
        ctx.font = '500 22px Archivo, sans-serif';
        if (Math.floor(t / 600) % 2) ctx.fillText('1 CREDIT', cw / 2, ch * 0.78);
        ctx.letterSpacing = '0em';
        ctx.textAlign = 'left';
        tex.needsUpdate = true;
      };

      /*
       * The big set runs a standby codec: frequency, a waveform, and the alert everyone in the
       * world knows. The small one runs a fighting-game attract: two health bars, a round
       * counter and a VS. Both are the door's own preview of what clicking it opens.
       */
      const paintBigTv = (t) => {
        const { ctx, cw, ch, tex } = tvScreens[0].userData;
        ctx.fillStyle = '#04120a';
        ctx.fillRect(0, 0, cw, ch);
        ctx.textAlign = 'left';
        ctx.textBaseline = 'alphabetic';

        ctx.strokeStyle = 'rgba(141,243,166,.4)';
        ctx.lineWidth = 2;
        ctx.strokeRect(14, 14, cw - 28, ch - 28);

        ctx.fillStyle = '#8df3a6';
        ctx.font = '600 24px ui-monospace, monospace';
        ctx.letterSpacing = '0.22em';
        ctx.fillText('140.85', 30, 52);
        ctx.font = '500 15px ui-monospace, monospace';
        ctx.fillStyle = 'rgba(141,243,166,.62)';
        ctx.fillText('CALLING', cw - 122, 52);

        /* the waveform */
        ctx.beginPath();
        ctx.strokeStyle = '#8df3a6';
        ctx.lineWidth = 2.4;
        for (let x = 30; x < cw - 30; x += 4) {
          const k = (x - 30) / (cw - 60);
          const env = Math.sin(k * Math.PI);
          const y = ch * 0.5 + Math.sin(k * 22 + t / 130) * 30 * env * (0.5 + 0.5 * Math.sin(t / 400));
          if (x === 30) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();

        /* the alert */
        if (Math.floor(t / 520) % 2) {
          ctx.fillStyle = '#d8ffe4';
          ctx.font = '700 74px Archivo, sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('!', cw / 2, ch * 0.86);
          ctx.textAlign = 'left';
        }
        ctx.fillStyle = 'rgba(141,243,166,.55)';
        ctx.font = '500 13px ui-monospace, monospace';
        ctx.letterSpacing = '0.2em';
        ctx.fillText('FREQUÊNCIA ABERTA', 30, ch - 28);
        ctx.letterSpacing = '0em';

        for (let y = 0; y < ch; y += 3) {
          ctx.fillStyle = 'rgba(0,0,0,.28)';
          ctx.fillRect(0, y, cw, 1);
        }
        tex.needsUpdate = true;
      };

      const paintSmallTv = (t) => {
        const { ctx, cw, ch, tex } = tvScreens[1].userData;
        ctx.fillStyle = '#14120f';
        ctx.fillRect(0, 0, cw, ch);
        ctx.textAlign = 'left';
        ctx.textBaseline = 'alphabetic';

        /* two health bars draining out of step, because it is always mid-round */
        const bw = cw * 0.38;
        const p1 = 0.35 + 0.6 * (0.5 + 0.5 * Math.sin(t / 900));
        const p2 = 0.3 + 0.65 * (0.5 + 0.5 * Math.cos(t / 1100));
        [[24, p1, 1], [cw - 24 - bw, p2, -1]].forEach(([x, p, dir]) => {
          ctx.strokeStyle = '#f4f2ec';
          ctx.lineWidth = 2;
          ctx.strokeRect(x, 22, bw, 16);
          ctx.fillStyle = '#f4f2ec';
          if (dir > 0) ctx.fillRect(x + 2, 24, (bw - 4) * p, 12);
          else ctx.fillRect(x + bw - 2 - (bw - 4) * p, 24, (bw - 4) * p, 12);
        });
        ctx.fillStyle = 'rgba(244,242,236,.7)';
        ctx.font = '600 13px Archivo, sans-serif';
        ctx.letterSpacing = '0.18em';
        ctx.fillText('P1', 24, 56);
        ctx.textAlign = 'right';
        ctx.fillText('CPU', cw - 24, 56);
        ctx.textAlign = 'center';
        ctx.fillStyle = '#f4f2ec';
        ctx.font = '700 30px Archivo, sans-serif';
        ctx.fillText('VS', cw / 2, 40);

        /* two silhouettes trading a hit */
        const hit = Math.sin(t / 320) > 0.86;
        const gy = ch - 34;
        const lunge = Math.max(0, Math.sin(t / 320)) * 14;
        ctx.fillStyle = '#f4f2ec';
        ctx.fillRect(cw * 0.3 - 12 + lunge, gy - 54, 24, 54);
        ctx.fillRect(cw * 0.3 + 10 + lunge, gy - 44, 26, 7);
        ctx.fillRect(cw * 0.66 - 12, gy - 54 - (hit ? 6 : 0), 24, 54);
        ctx.fillRect(cw * 0.66 - 30, gy - 40, 20, 7);
        if (hit) {
          ctx.font = '700 26px Archivo, sans-serif';
          ctx.fillText('K.O.', cw * 0.66, gy - 64);
        }
        ctx.fillStyle = 'rgba(244,242,236,.5)';
        ctx.fillRect(0, gy + 4, cw, 2);

        ctx.font = '600 15px Archivo, sans-serif';
        ctx.letterSpacing = '0.24em';
        ctx.fillStyle = 'rgba(244,242,236,.85)';
        if (Math.floor(t / 620) % 2) ctx.fillText('ROUND 1 · FIGHT', cw / 2, ch - 12);
        ctx.letterSpacing = '0em';
        ctx.textAlign = 'left';
        tex.needsUpdate = true;
      };

      /* The laptop is the stereo: playlist, track, artist, and the queue underneath. */
      const paintLaptop = (t) => {
        const { ctx, cw, ch, tex } = lapScreen.userData;
        const now = PLAYLIST[track % PLAYLIST.length];
        ctx.fillStyle = '#12100e';
        ctx.fillRect(0, 0, cw, ch);
        ctx.textAlign = 'left';
        ctx.textBaseline = 'alphabetic';

        ctx.fillStyle = '#35d07a';
        ctx.fillRect(22, 22, 9, 9);
        ctx.fillStyle = 'rgba(244,242,236,.55)';
        ctx.font = '600 13px Archivo, sans-serif';
        ctx.letterSpacing = '0.2em';
        ctx.fillText(PLAYLIST_NAME.toUpperCase(), 40, 31);
        ctx.letterSpacing = '0em';

        /* cover art stand-in, and the bars that say something is playing */
        ctx.fillStyle = 'rgba(244,242,236,.1)';
        ctx.fillRect(22, 48, 74, 74);
        for (let i = 0; i < 5; i++) {
          const h = 8 + (Math.sin(t / 210 + i * 1.2) * 0.5 + 0.5) * 44;
          ctx.fillStyle = 'rgba(53,208,122,.85)';
          ctx.fillRect(32 + i * 13, 112 - h, 7, h);
        }

        ctx.fillStyle = '#f4f2ec';
        ctx.font = '600 26px Archivo, sans-serif';
        ctx.fillText(now[0], 110, 76);
        ctx.fillStyle = 'rgba(244,242,236,.66)';
        ctx.font = '300 19px Archivo, sans-serif';
        ctx.fillText(now[1], 110, 102);

        const p = (trackT % 12) / 12;
        ctx.fillStyle = 'rgba(244,242,236,.22)';
        ctx.fillRect(110, 116, cw - 132, 4);
        ctx.fillStyle = '#35d07a';
        ctx.fillRect(110, 116, (cw - 132) * p, 4);

        ctx.fillStyle = 'rgba(244,242,236,.4)';
        ctx.font = '600 11px Archivo, sans-serif';
        ctx.letterSpacing = '0.18em';
        ctx.fillText(PLAYLIST.length > 1 ? 'A SEGUIR' : `${PLAYLIST_COUNT} FAIXAS`, 22, 152);
        ctx.letterSpacing = '0em';
        ctx.strokeStyle = 'rgba(244,242,236,.16)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(22, 160);
        ctx.lineTo(cw - 22, 160);
        ctx.stroke();

        for (let i = 1; i <= 3; i++) {
          const nx = PLAYLIST[(track + i) % PLAYLIST.length];
          if (!nx || PLAYLIST.length === 1) break;
          const y = 160 + i * 30;
          ctx.fillStyle = 'rgba(244,242,236,.82)';
          ctx.font = '500 16px Archivo, sans-serif';
          ctx.fillText(nx[0], 22, y);
          ctx.fillStyle = 'rgba(244,242,236,.45)';
          ctx.font = '300 15px Archivo, sans-serif';
          ctx.fillText(nx[1], 22 + ctx.measureText(nx[0]).width + 78, y);
        }
        if (PLAYLIST.length === 1) {
          ctx.fillStyle = 'rgba(244,242,236,.34)';
          ctx.font = '300 15px Archivo, sans-serif';
          ctx.fillText('João Vitor Melo', 22, 190);
        }
        tex.needsUpdate = true;
      };

      /* ---------------------------------------------------------------- the cats */

      const cats = [];
      const catBodies = [];

      /* Rocky's three beds. `face` keeps his long axis ACROSS the camera — pointed at it, a lying
         cat is a lump. */
      const BEDS = [
        { name: 'arcade', x: -8.0, y: 5.9, z: -4.25, face: 0.2 },
        { name: 'laptop', x: 6.6, y: 1.8, z: -1.1, face: 3.0 },
        { name: 'floor', x: -4.6, y: 0.0, z: 2.6, face: -0.15 },
      ];
      const bed = BEDS[Math.floor(Math.random() * BEDS.length)];

      const HOMES = {
        tabby: { y: 1.7, x: [1.9, 5.2], z: [-2.95, -2.5], roam: 0.55 },
        white: { y: 0.0, x: [-6.4, 2.6], z: [-0.6, 4.2], roam: 1.0 },
        black: { y: bed.y, x: [bed.x, bed.x], z: [bed.z, bed.z], roam: 0 },
      };

      ['tabby', 'white', 'black'].forEach((v, i) => {
        const m = makeCat(kit, v, INK_COATS);
        m.scale.setScalar(1.3);
        const home = HOMES[v];
        room.add(m);
        catBodies.push(m);

        const asleep = v === 'black';
        if (asleep) {
          poseSleep(m.userData, 0);
          m.rotation.y = bed.face;
          m.position.set(bed.x, bed.y, bed.z);
        }

        cats.push({
          m, variant: v, home, asleep,
          x: asleep ? bed.x : (home.x[0] + home.x[1]) / 2 + i,
          z: asleep ? bed.z : (home.z[0] + home.z[1]) / 2,
          head: 0, face: i % 2 ? Math.PI : 0,
          walking: v === 'white', wait: 2.4 + i * 1.7, phase: i * 1.3,
          speed: 0.9 + i * 0.15, startle: 0, curious: 0, target: null,
          /* the ten-second nap cycle */
          nap: 0, stretch: -1,
        });
      });

      const yarnG = new THREE.Group();
      const yarn = ball(0.17, PAPER, 16);
      yarn.add(new THREE.LineSegments(new THREE.EdgesGeometry(new THREE.SphereGeometry(0.17, 8, 6)), lineSoft));
      yarnG.add(yarn);
      yarnG.position.set(-2.6, 0.17, 2.6);
      room.add(yarnG);

      /* ------------------------------------------------------------ interaction */

      const ray = new THREE.Raycaster();
      const ndc = new THREE.Vector2(-2, -2);
      const floorPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
      const pointer3 = new THREE.Vector3(0, 0, 0);
      let hasPointer = false;
      let hovered = null;

      const probes = [...doors, ...catBodies];
      const probeSet = new Set(probes);
      const resolve = (obj) => {
        let n = obj;
        while (n && !probeSet.has(n)) n = n.parent;
        return n || null;
      };

      const toNdc = (e) => {
        const r = canvas.getBoundingClientRect();
        ndc.x = ((e.clientX - r.left) / r.width) * 2 - 1;
        ndc.y = -((e.clientY - r.top) / r.height) * 2 + 1;
      };

      this.addEventListener('pointermove', (e) => {
        toNdc(e);
        hasPointer = true;
        ray.setFromCamera(ndc, camera);
        ray.ray.intersectPlane(floorPlane, pointer3);
        const hit = ray.intersectObjects(probes, true)[0];
        const next = hit ? resolve(hit.object) : null;
        if (next !== hovered) {
          hovered = next;
          this.style.cursor = hovered ? 'pointer' : 'default';
          reticle.style.opacity = hovered ? '1' : '0';
          if (hovered) badge.textContent = hovered.userData.label;
        }
      });

      this.addEventListener('pointerleave', () => {
        hasPointer = false;
        hovered = null;
        reticle.style.opacity = '0';
        this.style.cursor = 'default';
      });

      this.addEventListener('pointerdown', (e) => {
        toNdc(e);
        ray.setFromCamera(ndc, camera);
        const hit = ray.intersectObjects(probes, true)[0];
        const target = hit ? resolve(hit.object) : null;
        if (target && target.userData.door) {
          this.dispatchEvent(new CustomEvent('door', { detail: { id: target.userData.door }, bubbles: true }));
          return;
        }
        if (target && target.userData.variant) {
          this.dispatchEvent(new CustomEvent('cat', { detail: { variant: target.userData.variant }, bubbles: true }));
          return;
        }
        /* Nothing opened, so the cats take it personally. Rocky does not. */
        cats.forEach((c) => {
          if (c.asleep) return;
          c.startle = 1.1 + Math.random() * 0.5;
          c.walking = true;
          c.curious = 0;
        });
      });

      /* --------------------------------------------------------------- the loop */

      const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const box3 = new THREE.Box3();
      const corner = new THREE.Vector3();

      const placeReticle = () => {
        if (!hovered) return;
        box3.setFromObject(hovered);
        const r = canvas.getBoundingClientRect();
        let minX = 1e9, minY = 1e9, maxX = -1e9, maxY = -1e9;
        for (let i = 0; i < 8; i++) {
          corner.set(i & 1 ? box3.max.x : box3.min.x, i & 2 ? box3.max.y : box3.min.y, i & 4 ? box3.max.z : box3.min.z);
          corner.project(camera);
          const sx = (corner.x * 0.5 + 0.5) * r.width;
          const sy = (-corner.y * 0.5 + 0.5) * r.height;
          minX = Math.min(minX, sx); maxX = Math.max(maxX, sx);
          minY = Math.min(minY, sy); maxY = Math.max(maxY, sy);
        }
        const pad = 10;
        reticle.style.left = `${minX - pad}px`;
        reticle.style.top = `${minY - pad}px`;
        reticle.style.width = `${maxX - minX + pad * 2}px`;
        reticle.style.height = `${maxY - minY + pad * 2}px`;
      };

      let last = performance.now();

      const tick = (now) => {
        if (this._dead) return;
        const dt = Math.min(0.05, (now - last) / 1000);
        last = now;

        paintArcade(now);
        paintMonitor(now);
        paintLaptop(now);
        paintBigTv(now);
        paintSmallTv(now);

        trackT += dt;
        if (trackT > 12) { trackT = 0; track = (track + 1) % PLAYLIST.length; }

        if (!reduced) {
          armL.rotation.x = Math.sin(now / 150) * 0.06 - 0.05;
          armR.rotation.x = Math.sin(now / 150 + 1.9) * 0.06 - 0.05;
          headM.rotation.y = Math.sin(now / 2600) * 0.12;
          body.position.y = Math.sin(now / 1900) * 0.012;

          cats.forEach((c) => {
            c.phase += dt;
            const u = c.m.userData;

            if (c.asleep) {
              /*
               * Ten seconds of sleep, then a stretch, then ten more. `stretch` is a clock rather
               * than a flag so the pose can ramp up, hold and unwind through the same dial.
               */
              if (c.stretch < 0) {
                c.nap += dt;
                if (c.nap > 10) { c.nap = 0; c.stretch = 0; }
                const b = 1 + Math.sin(c.phase * 1.5) * 0.035;
                u.torso.scale.set(1, b, b);
                u.head.rotation.y = Math.sin(c.phase * 0.5) * 0.06;
              } else {
                c.stretch += dt;
                const s = c.stretch;
                const k = s < 0.7 ? s / 0.7 : s < 2.2 ? 1 : s < 3.1 ? 1 - (s - 2.2) / 0.9 : 0;
                /* eased, because a cat does not stretch linearly */
                const e = k * k * (3 - 2 * k);
                poseSleep(u, e);
                u.torso.scale.set(1, 1, 1);
                u.head.rotation.y = Math.sin(s * 2.4) * 0.22 * e;
                if (s > 3.1) { c.stretch = -1; poseSleep(u, 0); }
              }
              return;
            }

            c.wait -= dt;
            if (c.startle > 0) c.startle -= dt;
            if (c.curious > 0) c.curious -= dt;

            if (c.variant === 'white' && hasPointer && c.startle <= 0) {
              const d = Math.hypot(pointer3.x - c.x, pointer3.z - c.z);
              if (d > 0.7 && d < 8) { c.curious = 1.6; c.target = { x: pointer3.x, z: pointer3.z }; }
            }

            if (c.wait <= 0 && c.startle <= 0 && c.curious <= 0) {
              c.walking = !c.walking;
              c.wait = c.walking ? 2.4 + Math.random() * 4 * c.home.roam : 2 + Math.random() * 5;
              if (c.walking && Math.random() < 0.45) c.face += Math.PI;
              c.target = null;
            }

            let goX = null, goZ = null;
            if (c.startle > 0) {
              const ax = c.x - pointer3.x, az = c.z - pointer3.z;
              const l = Math.hypot(ax, az) || 1;
              goX = c.x + (ax / l) * 3; goZ = c.z + (az / l) * 3;
            } else if (c.curious > 0 && c.target) {
              goX = c.target.x; goZ = c.target.z;
            }

            const speed = c.speed * (c.startle > 0 ? 2.6 : c.curious > 0 ? 1.4 : 1);

            if (goX !== null) {
              const dx = goX - c.x, dz = goZ - c.z;
              const l = Math.hypot(dx, dz);
              if (l > 0.12) {
                c.x += (dx / l) * speed * dt;
                c.z += (dz / l) * speed * dt;
                c.face = Math.atan2(dz, dx);
                c.walking = true;
              } else { c.walking = false; }
            } else if (c.walking) {
              c.x += Math.cos(c.face) * speed * dt;
              c.z += Math.sin(c.face) * speed * dt;
            }

            const bx = c.home.x, bz = c.home.z;
            if (c.x < bx[0]) { c.x = bx[0]; c.face = Math.PI - c.face; }
            if (c.x > bx[1]) { c.x = bx[1]; c.face = Math.PI - c.face; }
            if (c.z < bz[0]) { c.z = bz[0]; c.face = -c.face; }
            if (c.z > bz[1]) { c.z = bz[1]; c.face = -c.face; }

            const bob = c.walking ? Math.abs(Math.sin(c.phase * 8)) * 0.035 : 0;
            c.m.position.set(c.x, c.home.y + bob, c.z);
            c.m.rotation.y = -c.face;

            const swing = c.walking ? Math.sin(c.phase * 9) * 0.55 : 0;
            u.legs[0].rotation.z = swing;
            u.legs[1].rotation.z = -swing;
            u.legs[2].rotation.z = -swing;
            u.legs[3].rotation.z = swing;
            u.tail.rotation.z = Math.sin(c.phase * 2.2) * 0.22 + (c.startle > 0 ? 0.5 : 0);
            u.tail.rotation.y = Math.sin(c.phase * 1.6) * 0.3;

            const want = hasPointer
              ? clamp(Math.atan2(pointer3.z - c.z, pointer3.x - c.x) + c.face, -0.7, 0.7)
              : 0;
            c.head += (want - c.head) * Math.min(1, dt * 4);
            u.head.rotation.y = c.head;
            u.spine.rotation.z = c.walking ? Math.sin(c.phase * 8) * 0.02 : 0;
          });

          yarnG.rotation.z -= dt * 0.6;
          const wc = cats[1];
          if (Math.hypot(wc.x - yarnG.position.x, wc.z - yarnG.position.z) < 0.6) {
            yarnG.position.x = clamp(yarnG.position.x + Math.cos(wc.phase * 6) * dt * 0.7, -6, 2.4);
          }
        }

        placeReticle();
        renderer.render(scene, camera);
        this._raf = requestAnimationFrame(tick);
      };

      const resize = () => {
        const w = this.clientWidth || 1;
        const h = this.clientHeight || 1;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        /*
         * Framed for the three breakpoints this room is designed at — 1366×768, 1440×900 and
         * 1920×1080. The pull is against 16:9; at 16:10 and anything narrower the camera steps
         * back so the whole room still fits rather than the sides being cropped away.
         */
        const pull = clamp(1.78 / camera.aspect, 1, 1.42);
        camera.position.set(3.6 * pull, 5.9 * pull, 16.4 * pull);
        camera.lookAt(-1.3, 3.5, -1.2);
        camera.updateProjectionMatrix();
      };
      this._ro = new ResizeObserver(resize);
      this._ro.observe(this);
      resize();

      this._raf = requestAnimationFrame(tick);
      this.dispatchEvent(new CustomEvent('ready', { bubbles: true }));
    }
  }

  /* ================================================================= portrait */

  /**
   * <cat-portrait variant="black"> — one cat, on a turntable, in phosphor green.
   *
   * The codec card wants a live subject rather than a picture of one: the same geometry the room
   * uses, re-inked, turning slowly and doing the small things a cat does while it waits.
   */
  const GREEN_INK = 0x8df3a6;
  const GREEN_COATS = {
    tabby: 0x2f7a4d, white: 0x63c483, black: 0x123a25, stripe: 0x0d2b1b,
    detail: () => 0xd8ffe4,
  };

  class CatPortrait extends HTMLElement {
    static get observedAttributes() { return ['variant']; }

    connectedCallback() {
      if (this._booted) return;
      this._booted = true;
      this.boot();
    }

    attributeChangedCallback(n, o, v) {
      if (n === 'variant' && this._swap && o !== v) this._swap(v || 'black');
    }

    disconnectedCallback() {
      this._dead = true;
      if (this._raf) cancelAnimationFrame(this._raf);
      if (this._ro) this._ro.disconnect();
    }

    async boot() {
      const THREE = await import('three');
      if (this._dead) return;

      const kit = makeKit(THREE, GREEN_INK);
      this.style.cssText = 'display:block;position:relative;width:100%;height:100%';

      const canvas = document.createElement('canvas');
      canvas.style.cssText = 'display:block;width:100%;height:100%';
      this.appendChild(canvas);

      const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, preserveDrawingBuffer: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 40);
      camera.position.set(1.7, 1.15, 2.5);
      camera.lookAt(0, 0.45, 0);

      const turntable = new THREE.Group();
      scene.add(turntable);

      /* a ground ring, so the cat is standing on something */
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(0.92, 0.96, 48),
        new THREE.MeshBasicMaterial({ color: GREEN_INK, transparent: true, opacity: 0.5 }),
      );
      ring.rotation.x = -Math.PI / 2;
      scene.add(ring);
      const grid = new THREE.Mesh(
        new THREE.CircleGeometry(0.92, 40),
        new THREE.MeshBasicMaterial({ color: 0x0a2417, transparent: true, opacity: 0.75 }),
      );
      grid.rotation.x = -Math.PI / 2;
      grid.position.y = -0.002;
      scene.add(grid);

      let cat = null;
      const swap = (variant) => {
        if (cat) turntable.remove(cat);
        cat = makeCat(kit, variant, GREEN_COATS);
        cat.scale.setScalar(1.35);
        turntable.add(cat);
      };
      this._swap = swap;
      swap(this.getAttribute('variant') || 'black');

      /* A short script of idle beats, looped: look about, sit, wash, stretch, walk in place. */
      let t = 0;
      let last = performance.now();
      const tick = (now) => {
        if (this._dead) return;
        const dt = Math.min(0.05, (now - last) / 1000);
        last = now;
        t += dt;

        turntable.rotation.y = Math.sin(t * 0.28) * 0.5 - 0.35;
        const u = cat.userData;
        const beat = t % 12;

        u.tail.rotation.z = Math.sin(t * 2.1) * 0.3;
        u.tail.rotation.y = Math.sin(t * 1.4) * 0.4;
        u.head.rotation.y = Math.sin(t * 0.9) * 0.32;
        u.head.rotation.z = Math.sin(t * 0.6) * 0.1;
        u.ears.forEach((e, i) => { e.rotation.z = Math.sin(t * 5 + i) * 0.06; });
        /* a blink, twice a loop */
        const blink = beat % 4.7 < 0.14;
        u.lids.visible = blink;
        u.eyes.visible = !blink;

        if (beat < 4) {
          /* walking in place */
          const sw = Math.sin(t * 8) * 0.5;
          u.legs[0].rotation.z = sw;
          u.legs[1].rotation.z = -sw;
          u.legs[2].rotation.z = -sw;
          u.legs[3].rotation.z = sw;
          u.spine.position.y = Math.abs(Math.sin(t * 8)) * 0.03;
          u.spine.rotation.z = 0;
        } else if (beat < 8) {
          /* sitting: back legs folded, front legs straight */
          const k = Math.min(1, (beat - 4) / 0.6);
          u.legs[0].rotation.z = 0;
          u.legs[1].rotation.z = 0;
          u.legs[2].rotation.z = lerp(0, 1.35, k);
          u.legs[3].rotation.z = lerp(0, 1.35, k);
          u.spine.position.y = lerp(0, -0.1, k);
          u.spine.rotation.z = lerp(0, 0.16, k);
        } else {
          /* the big stretch */
          const s = beat - 8;
          const k = s < 0.8 ? s / 0.8 : s < 2.6 ? 1 : Math.max(0, 1 - (s - 2.6) / 0.9);
          const e = k * k * (3 - 2 * k);
          u.legs[0].rotation.z = lerp(0, -0.95, e);
          u.legs[1].rotation.z = lerp(0, -1.05, e);
          u.legs[2].rotation.z = lerp(0, 0.5, e);
          u.legs[3].rotation.z = lerp(0, 0.6, e);
          u.spine.position.y = lerp(0, -0.06, e);
          u.spine.rotation.z = lerp(0, -0.26, e);
        }

        renderer.render(scene, camera);
        this._raf = requestAnimationFrame(tick);
      };

      const resize = () => {
        const w = this.clientWidth || 1;
        const h = this.clientHeight || 1;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      };
      this._ro = new ResizeObserver(resize);
      this._ro.observe(this);
      resize();

      this._raf = requestAnimationFrame(tick);
    }
  }

  if (!customElements.get('playground-room')) customElements.define('playground-room', PlaygroundRoom);
  if (!customElements.get('cat-portrait')) customElements.define('cat-portrait', CatPortrait);
})();

/*
 * A side-effect module: everything above registers itself with customElements and there is
 * nothing to hand back. The empty export is what makes TypeScript agree it is a module at all,
 * so `import('./room/playground-room.js')` typechecks in Room.tsx.
 */
export {};
