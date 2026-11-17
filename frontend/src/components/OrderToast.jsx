import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useLocation } from 'react-router';
import { CircleCheck } from 'lucide-react';
import { useOrder } from '../context/OrderContext';
import Button from './ui/Button';
import { easyEase } from '../utils/motion';

// "Added to your table": a short confirmation after an Add, with the way to the booking page.
export default function OrderToast() {
  const { lastAdded, count } = useOrder();
  const [shown, setShown] = useState(null);
  const { pathname } = useLocation();

  useEffect(() => {
    if (!lastAdded) return undefined;
    setShown(lastAdded);
    const t = setTimeout(() => setShown(null), 3800);
    return () => clearTimeout(t);
  }, [lastAdded]);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-20 z-40 flex justify-center px-4 md:bottom-6" aria-live="polite">
      <AnimatePresence>
        {shown && (
          <motion.div
            key={shown.at}
            className="bevel pointer-events-auto flex items-center gap-4 border border-gold/40 bg-coal/90 py-2 pl-4 pr-2 shadow-2xl shadow-black/50 backdrop-blur-md"
            initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.45, ease: easyEase } }}
            exit={{ opacity: 0, y: 10, transition: { duration: 0.3, ease: easyEase } }}
          >
            <CircleCheck className="size-4 shrink-0 text-gold" aria-hidden="true" />
            <p className="text-small text-cream">
              <span className="font-semibold">{shown.name}</span> added to your table <span className="text-ash">({count})</span>
            </p>
            {pathname !== '/book' && (
              <Button to="/book" variant="outline" className="min-h-9 px-3 text-[0.625rem]">
                Book
              </Button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
