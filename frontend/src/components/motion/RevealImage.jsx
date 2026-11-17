import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { burnImages } from '../../utils/burn';
import { frameIn, settle, inView } from '../../utils/motion';

// A framed photo that rises out of the smoke as one piece: the burnt frame and the picture fade, lift and
// sharpen together, while the photo inside settles from a slight zoom. Optional gentle parallax.
// `burn` (a number) gives it burnt-paper edges; each number is a different burn pattern.
// The frame keeps its aspect ratio so nothing jumps while the image loads.
export default function RevealImage({ src, alt, className = '', imgClassName = '', parallax = 0, sizes, srcSet, loading = 'lazy', width, height, burn }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [`-${parallax}%`, `${parallax}%`]);

  const burnt = burn ? burnImages(burn) : null;
  const maskStyle = burnt
    ? { WebkitMaskImage: burnt.mask, maskImage: burnt.mask, WebkitMaskSize: '100% 100%', maskSize: '100% 100%', WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat' }
    : undefined;

  return (
    // The outer layer animates (so the frame animates with the picture); the inner layer carries the burnt mask.
    <motion.div ref={ref} className={`relative ${className}`} variants={frameIn} initial="hidden" whileInView="visible" viewport={inView}>
      {/* drop shadow, cut to the same burnt outline as the photo */}
      <div className="img-shadow" aria-hidden="true">
        <div style={maskStyle} />
      </div>
      <div className={`absolute inset-0 overflow-hidden ${burnt ? '' : 'bg-night'}`} style={maskStyle}>
        <motion.div className="absolute inset-0" style={parallax ? { y, scale: 1 + parallax / 50 } : undefined}>
          <motion.img
            src={src}
            srcSet={srcSet}
            sizes={sizes}
            alt={alt}
            width={width}
            height={height}
            loading={loading}
            decoding="async"
            variants={settle}
            className={`grade h-full w-full object-cover ${imgClassName}`}
          />
        </motion.div>
        {burnt && <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ backgroundImage: burnt.edge, backgroundSize: '100% 100%' }} />}
      </div>
    </motion.div>
  );
}
