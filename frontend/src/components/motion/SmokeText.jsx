import { useEffect, useId, useMemo, useRef } from 'react';
import { animate, motion, useInView, useReducedMotion } from 'motion/react';
import { easyEase } from '../../utils/motion';

// Type that condenses out of smoke.
//  1. Each letter starts as a grey, blurred wisp, a little larger and lower, and drifts up into place
//     while it sharpens to cream. Start times are slightly random so the line forms unevenly, like smoke.
//  2. A turbulence filter bends the whole line into wisps and relaxes to nothing as the letters land.
//  3. A faint ghost of each letter keeps rising and dissolves: the smoke lifting off.
// Plays once: on `play` (the hero, after the intro) or, with trigger="view", when it scrolls into view.
// Visitors who ask for reduced motion get a simple fade.

// Deterministic pseudo-random numbers, so the smoke is the same on every visit (and server/client agree).
const rand = (i, salt) => {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
};

const DURATION = 1.8;
const WISP = 22; // strongest bend of the smoke wisps, in px

export default function SmokeText({ as = 'h1', lines, className = '', delay = 0, step = 0.035, play = true, trigger = 'play', id }) {
  const Tag = as;
  const reduce = useReducedMotion();
  const filterId = `smoke-${useId().replace(/:/g, '')}`;
  const displaceRef = useRef(null);
  const turbulenceRef = useRef(null);
  const headingRef = useRef(null);
  const holdRef = useRef(null);
  const seen = useInView(holdRef, { once: true, amount: 0.4 });
  const active = trigger === 'view' ? seen : play;

  // Split into words (kept together so lines never break mid-word) and letters with their own timing.
  const rows = useMemo(() => {
    let n = 0;
    return lines.map((line) =>
      line.split(' ').map((word) =>
        Array.from(word).map((char) => {
          const i = n++;
          return {
            char,
            i,
            delay: delay + i * step + rand(i, 1) * 0.25,
            x: (rand(i, 2) - 0.5) * 18,
            y: 20 + rand(i, 3) * 22,
            rotate: (rand(i, 4) - 0.5) * 6,
          };
        })
      )
    );
  }, [lines, delay, step]);

  const total = rows.flat(2).length;
  const end = delay + total * step + 0.25 + DURATION;

  // Relax the wisp distortion from strong to none, then drop the filter so the type is pin-sharp.
  useEffect(() => {
    if (!active || reduce) return undefined;
    const heading = headingRef.current;
    const controls = animate(0, 1, {
      duration: end - delay,
      delay,
      ease: easyEase,
      onUpdate: (t) => {
        displaceRef.current?.setAttribute('scale', String(WISP * (1 - t) ** 2.4));
        turbulenceRef.current?.setAttribute('baseFrequency', `${0.004 + 0.003 * t} ${0.014 - 0.005 * t}`);
      },
      onComplete: () => heading && (heading.style.filter = 'none'),
    });
    return () => controls.stop();
  }, [active, reduce, delay, end]);

  // Before it plays, hold the space with invisible text. The animated letters mount only when it is time:
  // the page transition skips entrance animations for anything already on screen at first render.
  if (!active) {
    return (
      <Tag id={id} ref={holdRef} className={className} style={{ opacity: 0 }}>
        {lines.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </Tag>
    );
  }

  if (reduce) {
    return (
      <Tag id={id} className={className}>
        <motion.span className="block" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2, delay }}>
          {lines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </motion.span>
      </Tag>
    );
  }

  return (
    <Tag id={id} ref={headingRef} className={className} style={{ filter: `url(#${filterId})` }} aria-label={lines.join(' ')}>
      <svg width="0" height="0" className="absolute" aria-hidden="true" focusable="false">
        <filter id={filterId} x="-10%" y="-30%" width="120%" height="160%">
          <feTurbulence ref={turbulenceRef} type="fractalNoise" baseFrequency="0.004 0.014" numOctaves="2" seed="4" />
          <feDisplacementMap ref={displaceRef} in="SourceGraphic" scale="22" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>

      {rows.map((words, r) => (
        <span key={r} className="block" aria-hidden="true">
          {words.map((letters, w) => (
            <span key={w} className="inline-block whitespace-nowrap">
              {letters.map((l) => (
                <span key={l.i} className="relative inline-block">
                  {/* the letter condensing out of the smoke */}
                  <motion.span
                    className="inline-block will-change-[filter,transform,opacity]"
                    initial={{ opacity: 0, filter: 'blur(22px)', x: l.x, y: l.y, scale: 1.4, rotate: l.rotate, color: '#8a8172' }}
                    animate={active ? { opacity: 1, filter: 'blur(0px)', x: 0, y: 0, scale: 1, rotate: 0, color: '#e8ddcb' } : undefined}
                    transition={{
                      // Easy ease throughout: each letter eases out of the smoke and eases into place
                      default: { duration: DURATION, delay: l.delay, ease: easyEase },
                      opacity: { duration: DURATION * 0.6, delay: l.delay, ease: easyEase },
                      color: { duration: DURATION, delay: l.delay, ease: easyEase },
                    }}
                  >
                    {l.char}
                  </motion.span>
                  {/* the smoke lifting off it */}
                  <motion.span
                    className="pointer-events-none absolute inset-0 text-smoke"
                    initial={{ opacity: 0, y: 0, filter: 'blur(4px)', scale: 1 }}
                    animate={active ? { opacity: [0, 0.18, 0], y: -40, filter: 'blur(18px)', scale: 1.25 } : undefined}
                    transition={{ duration: 1.8, delay: l.delay + DURATION * 0.35, ease: easyEase, times: [0, 0.35, 1] }}
                  >
                    {l.char}
                  </motion.span>
                </span>
              ))}
              {w < words.length - 1 ? '\u00a0' : ''}
            </span>
          ))}
        </span>
      ))}
    </Tag>
  );
}
