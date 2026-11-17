import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUp } from 'lucide-react';
import { easyEase } from '../utils/motion';

// Back to the top: bottom right, mirroring the music button. Appears once you are a screen and a bit down.
export default function ScrollTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 1.2);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toTop = () => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed bottom-4 right-4 z-40 md:bottom-6 md:right-6"
          initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.5, ease: easyEase } }}
          exit={{ opacity: 0, y: 12, transition: { duration: 0.35, ease: easyEase } }}
        >
          <button
            type="button"
            onClick={toTop}
            aria-label="Back to the top"
            title="Back to the top"
            className="bevel btn-shadow group flex size-12 items-center justify-center border border-cream/20 bg-coal/80 text-gold backdrop-blur-md transition-colors duration-300 ease-site hover:border-ember hover:bg-ember hover:text-white"
          >
            <ArrowUp className="size-5 transition-transform duration-300 ease-site group-hover:-translate-y-0.5" aria-hidden="true" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
