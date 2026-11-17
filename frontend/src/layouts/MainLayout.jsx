import { useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useLocation } from 'react-router';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SmokeBackdrop from '../components/effects/SmokeBackdrop';
import Sparks from '../components/effects/Sparks';
import MusicPlayer from '../components/MusicPlayer';
import SocialRail from '../components/SocialRail';
import ScrollTop from '../components/ScrollTop';
import OrderToast from '../components/OrderToast';
import { page } from '../utils/motion';

// Scrolls to #section links (/#reserve, /menu#pizza) after the page has changed.
function useHashScroll() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) return undefined;
    const timer = setTimeout(() => {
      document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView({ behavior: 'smooth' });
    }, 80);
    return () => clearTimeout(timer);
  }, [pathname, hash]);
}

// Shared frame for every page: header, animated page area, footer, and the film-grain texture.
export default function MainLayout({ children }) {
  const location = useLocation();
  useHashScroll();

  return (
    <div id="app-root" className="flex min-h-dvh flex-col">
      <SmokeBackdrop />
      <Sparks />
      <a href="#main" className="label sr-only z-50 focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:bg-gold focus:px-4 focus:py-3 focus:text-coal">
        Skip to content
      </a>
      <Header />

      <AnimatePresence
        mode="wait"
        onExitComplete={() => {
          if (!window.location.hash) window.scrollTo(0, 0);
        }}
      >
        <motion.main id="main" key={location.pathname} className="flex-1" {...page}>
          {children}
        </motion.main>
      </AnimatePresence>

      <Footer />
      <SocialRail />
      <MusicPlayer />
      <ScrollTop />
      <OrderToast />
      <div className="grain" aria-hidden="true" />
    </div>
  );
}
