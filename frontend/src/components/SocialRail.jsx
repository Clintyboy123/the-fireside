import { motion } from 'motion/react';
import SocialIcon from './ui/SocialIcon';
import { site } from '../content/site';
import { easyEase, stagger } from '../utils/motion';

// Social icons stacked vertically on the left, above the music button, under a fine brass hairline.
// Tablet and desktop only: on phones the narrow margin would put them over the text, so phones get the
// same icons in the footer and the menu instead.
export const activeSocials = () => site.socials.filter((s) => s.href);

const item = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: easyEase } },
};

export default function SocialRail() {
  const socials = activeSocials();
  if (!socials.length) return null;

  return (
    <motion.nav
      aria-label="Social media"
      className="fixed bottom-[5.25rem] left-6 z-40 hidden w-12 flex-col items-center gap-3 md:flex"
      variants={stagger(0.1, 1.2)}
      initial="hidden"
      animate="visible"
    >
      <motion.span variants={item} className="mb-1 h-14 w-px bg-gradient-to-b from-transparent to-gold/60" aria-hidden="true" />
      {socials.map((s) => (
        <motion.a
          key={s.id}
          variants={item}
          href={s.href}
          target="_blank"
          rel="noreferrer"
          aria-label={s.label}
          title={s.label}
          className="icon-float flex size-10 items-center justify-center text-gold"
        >
          <SocialIcon id={s.id} className="size-5" />
        </motion.a>
      ))}
    </motion.nav>
  );
}
