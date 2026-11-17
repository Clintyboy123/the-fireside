// The Fireside's motion language, defined once so every animation shares the same timing and easing.
// Unhurried, like a slow evening: text on Easy Ease, images on long ease-outs, short distances, nothing bounces.
// Keep in step with --ease-site / --ease-cinema in styles/index.css.
export const ease = [0.22, 1, 0.36, 1];
export const cinema = [0.16, 1, 0.3, 1];
// After Effects' "Easy Ease" (33% influence in and out): a symmetrical, unhurried S-curve. Used for all text.
export const easyEase = [0.33, 0, 0.67, 1];

export const duration = {
  fast: 0.25, // hovers, taps, small state changes
  base: 1.1, // copy and most entrances
  slow: 1.6, // headings rising into place
};

// Copy drifts up out of a soft blur, like smoke clearing: the block-level version of the hero's smoke type.
export const fadeUp = {
  hidden: { opacity: 0, y: 26, filter: 'blur(12px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.9, ease: easyEase } },
};

export const fade = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: duration.base, ease: easyEase } },
};

// Put on a parent so its children arrive one after another.
export const stagger = (gap = 0.1, delay = 0) => ({
  hidden: {},
  visible: { transition: { staggerChildren: gap, delayChildren: delay } },
});

// A line of type rising out of a mask (used by RevealText).
export const lineRise = {
  hidden: { y: '110%' },
  visible: { y: '0%', transition: { duration: duration.slow, ease: easyEase } },
};

// Framed image reveal: the whole picture, burnt frame and all, rises out of the smoke as one piece.
export const frameIn = {
  hidden: { opacity: 0, y: 30, scale: 0.96, filter: 'blur(18px)' },
  visible: { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', transition: { duration: 1.4, ease: easyEase } },
};

// Image reveal: the photo emerges from smoke (blur and haze clearing) while it settles from a slight push-in.
export const curtain = {
  hidden: { opacity: 0, filter: 'blur(22px)' },
  visible: { opacity: 1, filter: 'blur(0px)', transition: { duration: 1.6, ease: easyEase } },
};
export const settle = {
  hidden: { scale: 1.12 },
  visible: { scale: 1, transition: { duration: 2, ease: easyEase } },
};

// Page change: a quick fade so navigation feels instant.
export const page = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.7, ease: easyEase } },
  exit: { opacity: 0, transition: { duration: 0.35, ease: easyEase } },
};

export const inView = { once: true, amount: 0.25 };
