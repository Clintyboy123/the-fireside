import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import SmokeText from '../motion/SmokeText';
import Sparks from '../effects/Sparks';
import Button from '../ui/Button';
import { photo } from '../../content/photos';
import { site } from '../../content/site';
import { easyEase, fadeUp, stagger } from '../../utils/motion';

// The first impression: one photograph, warm and slow, and the restaurant's own promise as the headline.
export default function Hero() {
  const ready = true; // the hero plays as soon as the page loads
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const imageY = useTransform(scrollYProgress, [0, 1], ['0%', '22%']);
  const copyY = useTransform(scrollYProgress, [0, 1], ['0%', '-30%']);
  const copyOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const image = photo('hero');

  return (
    <section ref={ref} aria-labelledby="hero-title" className="relative isolate flex min-h-svh items-end overflow-hidden">
      <motion.div className="absolute inset-0 -z-10" style={{ y: imageY }}>
        <img
          src={image.src}
          srcSet={image.srcSet}
          sizes="100vw"
          alt={image.alt}
          width={image.width}
          height={image.height}
          fetchPriority="high"
          className="grade h-full w-full animate-ken-burns object-cover"
        />
      </motion.div>
      {/* Depth: darken top for the header, and the lower left where the type sits. */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-coal/80 via-coal/30 to-coal" aria-hidden="true" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-coal/80 via-coal/30 to-transparent" aria-hidden="true" />
      <div className="firelight absolute inset-0 -z-10 opacity-80" aria-hidden="true" />
      <Sparks contained />

      <motion.div style={{ y: copyY, opacity: copyOpacity }} className="shell w-full pb-24 pt-40 text-center md:pb-28 md:text-left">
        <motion.p
          className="label text-gold"
          initial={{ opacity: 0, y: 12 }}
          animate={ready ? { opacity: 1, y: 0 } : undefined}
          transition={{ duration: 1.4, ease: easyEase, delay: 0.1 }}
        >
          <span className="hidden sm:inline">{site.name} &middot; </span>Overbaakens, Gqeberha
        </motion.p>

        <SmokeText
          id="hero-title"
          play={ready}
          delay={0.25}
          className="mt-6 font-display text-display font-medium tracking-[-0.01em] text-cream"
          lines={['A home away', 'from home.']}
        />
        <SmokeText
          as="p"
          play={ready}
          delay={0.7}
          step={0.02}
          className="mx-auto mt-8 max-w-md font-display text-h3 italic text-cream/85 md:mx-0"
          lines={['Just without the dishes.']}
        />

        <motion.div variants={stagger(0.12, 2.3)} initial="hidden" animate={ready ? 'visible' : 'hidden'}>
          <motion.div variants={fadeUp} className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center md:justify-start">
            <Button to="/menu" className="w-full sm:w-auto">
              Explore our menu
            </Button>
            <Button to="/book" variant="outline" className="w-full sm:w-auto">
              Book a table
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.a
        href="#story"
        className="label absolute bottom-8 right-gutter hidden items-center gap-4 text-cream/70 transition-colors hover:text-cream md:flex"
        initial={{ opacity: 0 }}
        animate={ready ? { opacity: 1 } : undefined}
        transition={{ delay: 1.8, duration: 1 }}
      >
        Scroll
        <span className="relative block h-12 w-px overflow-hidden bg-cream/20" aria-hidden="true">
          <span className="absolute inset-0 animate-cue bg-gold" />
        </span>
      </motion.a>
    </section>
  );
}
