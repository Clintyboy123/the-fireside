import { useEffect, useRef } from 'react';

// Embers carried on a slow draught. Every 20 seconds a stream of sparks drifts in from the lower left and
// glides diagonally up and across the site, swaying gently and cooling from gold to ember red, then
// fades away after 5 seconds. Slow and smooth by design: constant speed, soft sway, eased fades, no hard flicker.
//
// One <canvas>, drawn only while sparks are alive: between bursts it sleeps (no frames, no cost).
// Off for visitors who ask for reduced motion. Pauses with the tab like any animation frame.

const EVERY = 20000; // ms between bursts
const FIRST = 5500; // first burst lands just after the hero has formed
const COUNT = 30;

// The draught: up and to the right, about 32 degrees above horizontal.
const ANGLE = (-32 * Math.PI) / 180;
const smooth = (t) => t * t * (3 - 2 * t); // smoothstep: eased in and out

// Each ember glows for 5 seconds, then fades away over a further 1.2 seconds.
const FADE_IN = 0.6;
const HOLD = 5;
const FADE_OUT = 1.2;

// Ember colour as it cools: white-gold, orange, ember red (r, g, b) by life 0 to 1.
const COLD = [
  [0, [255, 236, 180]],
  [0.25, [255, 170, 70]],
  [0.65, [230, 95, 35]],
  [1, [150, 40, 20]],
];
const colourAt = (t) => {
  for (let i = 1; i < COLD.length; i++) {
    const [t1, c1] = COLD[i];
    const [t0, c0] = COLD[i - 1];
    if (t <= t1) {
      const k = (t - t0) / (t1 - t0);
      return c0.map((v, j) => Math.round(v + (c1[j] - v) * k));
    }
  }
  return COLD[COLD.length - 1][1];
};

const rand = (a, b) => a + Math.random() * (b - a);

function makeSpark(w, h) {
  // Enter from the bottom edge (left two-thirds) or the lower left edge, so the stream crosses the page.
  const fromLeft = Math.random() < 0.4;
  const angle = ANGLE + rand(-0.14, 0.14); // each spark rides the draught at a slightly different angle
  return {
    x0: fromLeft ? rand(-30, 0) : rand(-0.1 * w, 0.65 * w),
    y0: fromLeft ? rand(0.35 * h, h) : h + rand(0, 30),
    dx: Math.cos(angle),
    dy: Math.sin(angle),
    speed: rand(32, 58), // px per second: a slow glide
    sway: rand(8, 22), // px, side to side across the path
    swaySpeed: rand(0.25, 0.55), // radians per second: a lazy wave
    phase: rand(0, Math.PI * 2),
    size: rand(0.7, 1.7),
    life: HOLD + FADE_OUT, // seconds
    delay: rand(0, 4), // a stream over a few seconds, not a pop
    flicker: rand(1.5, 3),
    age: 0,
  };
}

// `contained`: fill the parent (used inside the hero, between photo and headline) instead of the window.
export default function Sparks({ contained = false }) {
  const ref = useRef(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    let sparks = [];
    let frame = 0;
    let last = 0;
    let w = 0;
    let h = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const box = contained ? canvas.parentElement.getBoundingClientRect() : { width: window.innerWidth, height: window.innerHeight };
      w = box.width;
      h = box.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = (now) => {
      const dt = Math.min((now - last) / 1000, 0.05); // capped, so a dropped frame never makes a spark jump
      last = now;
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'lighter';

      sparks = sparks.filter((s) => s.age < s.delay + s.life);
      for (const s of sparks) {
        s.age += dt;
        const e = s.age - s.delay; // seconds since this spark appeared
        if (e < 0) continue;
        const t = e / s.life;
        // glide along the draught, with a gentle wave across it
        const along = s.speed * e;
        const across = Math.sin(e * s.swaySpeed + s.phase) * s.sway;
        const x = s.x0 + s.dx * along - s.dy * across;
        const y = s.y0 + s.dy * along + s.dx * across;
        // eased fade in, five seconds of glow, then an eased fade away; only a soft shimmer on top
        const fadeIn = smooth(Math.min(1, e / FADE_IN));
        const fadeOut = 1 - smooth(Math.min(1, Math.max(0, (e - HOLD) / FADE_OUT)));
        const shimmer = 0.9 + 0.1 * Math.sin(e * s.flicker + s.phase);
        const alpha = fadeIn * fadeOut * shimmer;
        if (!(alpha > 0.002)) continue; // invisible (or past its life): skip drawing it
        const [r, g, b] = colourAt(smooth(t));
        const size = s.size * (1 - t * 0.3);

        const glow = ctx.createRadialGradient(x, y, 0, x, y, size * 6);
        glow.addColorStop(0, `rgba(${r},${g},${b},${0.55 * alpha})`);
        glow.addColorStop(1, `rgba(${r},${g},${b},0)`);
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(x, y, size * 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }

      if (sparks.length) frame = requestAnimationFrame(draw);
      else {
        ctx.clearRect(0, 0, w, h);
        frame = 0;
      }
    };

    const burst = () => {
      for (let i = 0; i < COUNT; i++) sparks.push(makeSpark(w, h));
      if (!frame) {
        last = performance.now();
        frame = requestAnimationFrame(draw);
      }
    };

    const first = setTimeout(burst, FIRST);
    const every = setInterval(burst, EVERY);

    return () => {
      clearTimeout(first);
      clearInterval(every);
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
    };
  }, [contained]);

  return <canvas ref={ref} aria-hidden="true" className={`pointer-events-none inset-0 -z-10 h-full w-full ${contained ? 'absolute' : 'fixed'}`} />;
}
