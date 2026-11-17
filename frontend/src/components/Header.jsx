import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, NavLink, useLocation } from 'react-router';
import { AnimatePresence, motion } from 'motion/react';
import Logo from './Logo';
import Button from './ui/Button';
import Flame from './ui/Flame';
import SocialIcon from './ui/SocialIcon';
import { activeSocials } from './SocialRail';
import useFocusTrap from '../hooks/useFocusTrap';
import { useOrder } from '../context/OrderContext';
import { nav, site, hoursDisplay } from '../content/site';
import { ease, cinema, stagger, fadeUp } from '../utils/motion';

const linkClass = 'label ember-hover relative py-3 text-cream/80 hover:text-ember focus-visible:text-ember';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const { count } = useOrder();
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const menuRef = useRef(null);
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [location.pathname, location.hash]);

  return (
    <>
      <motion.header
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease, delay: 0.2 }}
        className={`fixed inset-x-0 top-0 z-40 transition-[background-color,border-color,backdrop-filter] duration-500 ease-site ${
          scrolled ? 'border-b border-line bg-coal/85 backdrop-blur-md' : 'border-b border-transparent'
        }`}
      >
        <div className={`shell flex items-center justify-between gap-8 transition-[height] duration-500 ease-site ${scrolled ? 'h-18' : 'h-22'}`}>
          <Link to="/" className="shrink-0" aria-label="The Fireside, home">
            <Logo className={`transition-[width] duration-500 ease-site ${scrolled ? 'w-32' : 'w-36 md:w-40'}`} />
          </Link>

          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center gap-10">
              {nav.map((item) => (
                <li key={item.to}>
                  <NavLink to={item.to} className={({ isActive }) => `${linkClass} ${isActive && !item.to.includes('#') ? 'text-gold' : ''}`}>
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-4">
            <span className="hidden sm:block">
              <Button to="/book" className="min-h-11 px-6" aria-label={count ? `Book a table, ${count} dishes added` : undefined}>
                Book a table
                {count > 0 && (
                  <span className="-mr-2 flex size-5 items-center justify-center rounded-full bg-coal text-[0.625rem] font-bold tracking-normal text-gold">{count}</span>
                )}
              </Button>
            </span>
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              className="label -mr-3 flex min-h-11 items-center gap-3 px-3 text-cream lg:hidden"
            >
              <span>Menu</span>
              <span aria-hidden="true" className="flex w-6 flex-col gap-1.5">
                <span className="h-px w-full bg-current" />
                <span className="h-px w-2/3 self-end bg-current" />
              </span>
            </button>
          </div>
        </div>
      </motion.header>

      {createPortal(
        <AnimatePresence>
          {open && (
            <MobileMenu ref={menuRef} onClose={close} />
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}

function MobileMenu({ ref, onClose }) {
  useFocusTrap(true, ref, onClose);

  return (
    <motion.div
      ref={ref}
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      className="fixed inset-0 z-50 flex flex-col bg-coal"
      initial={{ clipPath: 'inset(0% 0% 100% 0%)' }}
      animate={{ clipPath: 'inset(0% 0% 0% 0%)', transition: { duration: 0.8, ease: cinema } }}
      exit={{ clipPath: 'inset(0% 0% 100% 0%)', transition: { duration: 0.6, ease: cinema } }}
    >
      <div className="firelight pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="shell relative flex h-22 items-center justify-between">
        <Link to="/" onClick={onClose} aria-label="The Fireside, home">
          <Logo className="w-36" />
        </Link>
        <button type="button" onClick={onClose} className="label -mr-3 flex min-h-11 items-center gap-3 px-3 text-cream">
          Close
          <span aria-hidden="true" className="relative block size-5">
            <span className="absolute left-0 top-1/2 h-px w-full rotate-45 bg-current" />
            <span className="absolute left-0 top-1/2 h-px w-full -rotate-45 bg-current" />
          </span>
        </button>
      </div>

      <motion.nav aria-label="Main" className="shell relative flex flex-1 flex-col items-center justify-center text-center" variants={stagger(0.07, 0.25)} initial="hidden" animate="visible">
        <ul className="flex flex-col items-center gap-2">
          {[{ label: 'Home', to: '/' }, ...nav].map((item) => (
            <motion.li key={item.to} variants={fadeUp}>
              <Link to={item.to} onClick={onClose} className="ember-hover block py-1 font-display text-h2 text-cream hover:text-ember focus-visible:text-ember">
                {item.label}
              </Link>
            </motion.li>
          ))}
        </ul>
        <motion.div variants={fadeUp} className="mt-12">
          <Button to="/book" onClick={onClose}>
            Book a table
          </Button>
        </motion.div>
      </motion.nav>

      <motion.div className="shell relative flex flex-col items-center gap-2 pb-10 text-center text-small text-smoke" initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.6 } }}>
        <div className="mb-4 flex gap-3">
          {activeSocials().map((s) => (
            <a key={s.id} href={s.href} target="_blank" rel="noreferrer" aria-label={s.label} className="bevel flex size-11 items-center justify-center border border-cream/20 text-gold transition-colors hover:border-ember hover:bg-ember hover:text-white">
              <SocialIcon id={s.id} />
            </a>
          ))}
        </div>
        <Flame className="mb-2 h-5 w-4 text-gold" />
        <a href={site.phoneHref} className="text-cream">
          {site.phone}
        </a>
        <p>
          {hoursDisplay[1].days}, {hoursDisplay[1].time}
        </p>
      </motion.div>
    </motion.div>
  );
}
