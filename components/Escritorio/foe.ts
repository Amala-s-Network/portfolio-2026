/*
 * The minotaur, ported from the design reference with its geometry untouched.
 *
 * An ORIGINAL silhouette — one path set, drawn rather than lifted from anywhere — bold enough to
 * read on a CRT and cheap enough to redraw every frame. It is a plain function over a canvas and
 * a clock, deliberately outside React: it runs at 60fps and lifting any of it into state would be
 * sixty reconciliations a second to move one number.
 *
 * Two things in here are load-bearing and easy to "tidy" into bugs:
 *   - the knock-up is a half-second SINE arc, not a linear decay. A hit that eases out does not
 *     feel like a hit.
 *   - the monster has NO health bar anywhere in the UI. Progress is read from the gashes that
 *     open below 68% and 34% and from the line at the foot of the stage. That is the difference
 *     between reading a fight and reading a progress meter.
 */

export type FoeClock = { hitT: number; deadT: number; last: number };

export function drawFoe(
  c: HTMLCanvasElement,
  now: number,
  clock: FoeClock,
  foeHp: number,
): void {
    const ctx = c.getContext('2d');
    /* No 2D context means no canvas support at all; there is nothing to draw and nothing to say. */
    if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = c.clientWidth || 1;
    const H = c.clientHeight || 1;
    if (c.width !== Math.round(W * dpr) || c.height !== Math.round(H * dpr)) {
      c.width = Math.round(W * dpr);
      c.height = Math.round(H * dpr);
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);

    const r = clock;
    const dt = Math.min(0.05, (now - (r.last || now)) / 1000);
    r.last = now;
    if (r.hitT > 0) r.hitT = Math.max(0, r.hitT - dt);

    const hp = foeHp;
    const dead = hp <= 0;
    if (dead) r.deadT = Math.min(1, r.deadT + dt * 1.1);

    const k = r.hitT > 0 ? Math.sin((1 - r.hitT / 0.5) * Math.PI) : 0;
    const knock = k * 36;
    const flash = Math.max(0, Math.min(1, (r.hitT - 0.3) / 0.18));
    const bob = Math.sin(now / 900) * 3;

    const s = Math.min(W / 730, (H * 0.78) / 400);

    /* the ground he stands on */
    ctx.save();
    ctx.translate(W / 2, H * 0.88);
    ctx.scale(1, 0.24);
    ctx.beginPath();
    ctx.arc(0, 0, 150 * s, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0,0,0,.55)';
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.translate(W / 2, H * 0.88);
    ctx.scale(s, s);
    ctx.translate(36, -knock + bob);
    ctx.rotate(k * 0.14 + r.deadT * 0.5);
    ctx.translate(0, r.deadT * 90);
    ctx.globalAlpha = 1 - r.deadT * 0.75;

    const body = flash > 0 ? '#f6e6c8' : '#2b1613';
    const line = flash > 0 ? '#fff6e2' : '#e0552c';
    ctx.lineWidth = 2.6 / s;
    ctx.lineJoin = 'round';

    /* `fill` is optional and falls back to the hide colour — most calls want the body. */
    const shape = (draw: () => void, fill?: string) => {
      ctx.beginPath();
      draw();
      ctx.closePath();
      ctx.fillStyle = fill || body;
      ctx.fill();
      ctx.strokeStyle = line;
      ctx.stroke();
    };

    const dark = flash > 0 ? '#fff6e2' : '#3a1e19';

    /* hooves */
    shape(() => ctx.rect(-84, -22, 50, 22));
    shape(() => ctx.rect(34, -22, 50, 22));

    /* digitigrade legs — thigh out, hock back, pastern down; thick enough to carry the chest */
    shape(() => {
      ctx.moveTo(-82, -162);
      ctx.lineTo(-94, -98);
      ctx.lineTo(-72, -54);
      ctx.lineTo(-78, -20);
      ctx.lineTo(-40, -20);
      ctx.lineTo(-34, -56);
      ctx.lineTo(-54, -100);
      ctx.lineTo(-42, -158);
    });
    shape(() => {
      ctx.moveTo(82, -162);
      ctx.lineTo(94, -98);
      ctx.lineTo(72, -54);
      ctx.lineTo(78, -20);
      ctx.lineTo(40, -20);
      ctx.lineTo(34, -56);
      ctx.lineTo(54, -100);
      ctx.lineTo(42, -158);
    });

    /* torso: waist at ±62, chest out to ±92 so the shoulders land inside it */
    shape(() => {
      ctx.moveTo(-62, -142);
      ctx.lineTo(-88, -200);
      ctx.lineTo(-92, -244);
      ctx.lineTo(-58, -264);
      ctx.lineTo(58, -264);
      ctx.lineTo(92, -244);
      ctx.lineTo(88, -200);
      ctx.lineTo(62, -142);
    });
    /* the pectoral shelf, so the chest is not a flat plate */
    ctx.beginPath();
    ctx.moveTo(-74, -228);
    ctx.quadraticCurveTo(0, -206, 74, -228);
    ctx.strokeStyle = line;
    ctx.lineWidth = 2.6 / s;
    ctx.stroke();

    /* arms, seated into the shoulders */
    shape(() => ctx.arc(-96, -244, 28, 0, Math.PI * 2));
    shape(() => ctx.arc(96, -244, 28, 0, Math.PI * 2));
    shape(() => {
      ctx.moveTo(-114, -248);
      ctx.lineTo(-122, -140);
      ctx.lineTo(-88, -136);
      ctx.lineTo(-80, -246);
    });
    shape(() => {
      ctx.moveTo(114, -248);
      ctx.lineTo(122, -140);
      ctx.lineTo(88, -136);
      ctx.lineTo(80, -246);
    });
    shape(() => ctx.arc(-101, -124, 24, 0, Math.PI * 2));
    shape(() => ctx.arc(101, -124, 24, 0, Math.PI * 2));

    /* the axe: haft through the fist, curved cutting edge, poll behind the haft */
    shape(() => {
      ctx.moveTo(-110, -28);
      ctx.lineTo(-126, -32);
      ctx.lineTo(-144, -308);
      ctx.lineTo(-128, -310);
    });
    shape(() => {
      ctx.moveTo(-130, -296);
      ctx.lineTo(-104, -290);
      ctx.lineTo(-106, -260);
      ctx.lineTo(-132, -262);
    }, dark);
    shape(() => {
      ctx.moveTo(-136, -308);
      ctx.lineTo(-178, -332);
      ctx.quadraticCurveTo(-216, -296, -196, -248);
      ctx.lineTo(-134, -256);
    }, dark);
    /* the edge catches what little light there is */
    ctx.beginPath();
    ctx.moveTo(-178, -330);
    ctx.quadraticCurveTo(-212, -295, -195, -250);
    ctx.strokeStyle = flash > 0 ? '#fff6e2' : '#f0d27a';
    ctx.lineWidth = 4 / s;
    ctx.stroke();

    /* neck */
    shape(() => ctx.rect(-28, -272, 56, 30));

    /* the skull: wide at the horn line, tapering into the snout */
    shape(() => {
      ctx.moveTo(-46, -326);
      ctx.lineTo(-50, -296);
      ctx.lineTo(-34, -268);
      ctx.lineTo(-29, -240);
      ctx.lineTo(29, -240);
      ctx.lineTo(34, -268);
      ctx.lineTo(50, -296);
      ctx.lineTo(46, -326);
      ctx.quadraticCurveTo(0, -346, -46, -326);
    });
    /* ears, at the horn bases */
    shape(() => {
      ctx.moveTo(-48, -318);
      ctx.lineTo(-76, -310);
      ctx.lineTo(-50, -294);
    }, dark);
    shape(() => {
      ctx.moveTo(48, -318);
      ctx.lineTo(76, -310);
      ctx.lineTo(50, -294);
    }, dark);
    /* the snout */
    shape(() => {
      ctx.moveTo(-30, -258);
      ctx.lineTo(-27, -238);
      ctx.lineTo(27, -238);
      ctx.lineTo(30, -258);
    }, dark);

    /* horns: an outer sweep and an inner sweep meeting at a point */
    shape(() => {
      ctx.moveTo(-52, -330);
      ctx.quadraticCurveTo(-98, -344, -116, -376);
      ctx.quadraticCurveTo(-74, -330, -40, -304);
    });
    shape(() => {
      ctx.moveTo(52, -330);
      ctx.quadraticCurveTo(98, -344, 116, -376);
      ctx.quadraticCurveTo(74, -330, 40, -304);
    });

    /* the eyes are the only light on him */
    ctx.save();
    ctx.shadowColor = 'rgba(240,210,122,.9)';
    ctx.shadowBlur = 18 / s;
    ctx.fillStyle = dead ? 'rgba(240,210,122,.25)' : '#f0d27a';
    ctx.fillRect(-38, -300, 19, 8);
    ctx.fillRect(19, -300, 19, 8);
    ctx.restore();
    ctx.fillStyle = flash > 0 ? '#3a1e19' : '#0d0706';
    ctx.fillRect(-17, -250, 6, 7);
    ctx.fillRect(11, -250, 6, 7);

    /* he wears the fight */
    if (hp < 68) {
      ctx.strokeStyle = line;
      ctx.lineWidth = 3.4 / s;
      ctx.beginPath();
      ctx.moveTo(-46, -238); ctx.lineTo(-10, -196); ctx.lineTo(-32, -168);
      ctx.stroke();
    }
    if (hp < 34) {
      ctx.beginPath();
      ctx.moveTo(58, -244); ctx.lineTo(18, -210); ctx.lineTo(46, -176);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(96, -352); ctx.lineTo(116, -376);
      ctx.stroke();
    }

    /* the slash, on the frames right after a hit */
    if (r.hitT > 0.26) {
      ctx.strokeStyle = '#fff6e2';
      ctx.lineWidth = 9 / s;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(-150, -330);
      ctx.lineTo(130, -120);
      ctx.stroke();
      ctx.lineWidth = 3.5 / s;
      ctx.beginPath();
      ctx.moveTo(-130, -376);
      ctx.lineTo(104, -196);
      ctx.stroke();
      ctx.lineCap = 'butt';
    }

    ctx.restore();
}
