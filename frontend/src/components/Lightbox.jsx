import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import useFocusTrap from '../hooks/useFocusTrap';
import { cinema } from '../utils/motion';

// Full-screen photo viewer: arrows, keyboard (left, right, Escape) and swipe on phones.
export default function Lightbox({ photos, index, onClose, onChange }) {
  const ref = useRef(null);
  const [direction, setDirection] = useState(1);
  useFocusTrap(true, ref, onClose);

  const go = useCallback(
    (step) => {
      setDirection(step);
      onChange((index + step + photos.length) % photos.length);
    },
    [index, photos.length, onChange]
  );

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [go]);

  const current = photos[index];
  const control = 'bevel flex size-12 items-center justify-center border border-cream/25 text-cream transition-colors hover:border-gold hover:text-gold';

  return createPortal(
    <motion.div
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-label="Photo viewer"
      className="fixed inset-0 z-[65] flex flex-col bg-coal/97 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 0.4 } }}
      exit={{ opacity: 0, transition: { duration: 0.3 } }}
    >
      <div className="shell flex h-20 shrink-0 items-center justify-between">
        <p className="label text-smoke" aria-live="polite">
          {String(index + 1).padStart(2, '0')} <span className="text-ash">/ {String(photos.length).padStart(2, '0')}</span>
        </p>
        <button type="button" onClick={onClose} className={control} aria-label="Close photo viewer">
          <X className="size-5" aria-hidden="true" />
        </button>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden px-gutter">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.img
            key={current.id}
            src={current.src}
            srcSet={current.srcSet}
            sizes="90vw"
            alt={current.alt}
            custom={direction}
            className="max-h-full max-w-full cursor-grab object-contain active:cursor-grabbing"
            initial={(d) => ({ opacity: 0, x: d * 60 })}
            animate={{ opacity: 1, x: 0, transition: { duration: 0.7, ease: cinema } }}
            exit={(d) => ({ opacity: 0, x: d * -60, transition: { duration: 0.3 } })}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.4}
            onDragEnd={(e, info) => {
              if (info.offset.x < -60) go(1);
              if (info.offset.x > 60) go(-1);
            }}
          />
        </AnimatePresence>
      </div>

      <div className="shell flex h-24 shrink-0 items-center justify-center gap-4">
        <button type="button" onClick={() => go(-1)} className={control} aria-label="Previous photo">
          <ArrowLeft className="size-5" aria-hidden="true" />
        </button>
        <button type="button" onClick={() => go(1)} className={control} aria-label="Next photo">
          <ArrowRight className="size-5" aria-hidden="true" />
        </button>
      </div>
    </motion.div>,
    document.body
  );
}
