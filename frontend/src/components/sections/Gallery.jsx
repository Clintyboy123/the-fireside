import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Expand } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading';
import Lightbox from '../Lightbox';
import Burnt from '../effects/Burnt';
import { galleryPhotos } from '../../content/photos';
import { fadeUp, inView } from '../../utils/motion';

// An editorial masonry wall of the restaurant's own photography. Click any photo to open it full screen.
export default function Gallery() {
  const photos = galleryPhotos();
  const [open, setOpen] = useState(null);

  return (
    <section id="gallery" aria-labelledby="gallery-title" className="py-section">
      <div className="shell">
        <SectionHeading id="gallery-title" eyebrow="Gallery" lines={['Round the table', 'at The Fireside.']} center />

        <ul className="mt-rhythm columns-2 gap-3 md:columns-3 md:gap-4 lg:gap-5">
          {photos.map((p, index) => (
            <motion.li
              key={p.id}
              className="mb-3 break-inside-avoid md:mb-4 lg:mb-5"
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={inView}
              transition={{ delay: (index % 3) * 0.08 }}
            >
              <Burnt seed={31 + index * 3} bite={4}>
              <button
                type="button"
                onClick={() => setOpen(index)}
                className="group relative block w-full overflow-hidden"
                aria-label={`Open photo: ${p.alt}`}
              >
                <img
                  src={p.src}
                  srcSet={p.srcSet}
                  sizes="(min-width: 768px) 33vw, 50vw"
                  alt=""
                  width={p.width}
                  height={p.height}
                  loading="lazy"
                  decoding="async"
                  className="grade h-auto w-full transition-transform duration-[1.4s] ease-cinema group-hover:scale-[1.06]"
                />
                <span className="absolute inset-0 bg-coal/0 transition-colors duration-500 group-hover:bg-coal/35" aria-hidden="true" />
                <span className="bevel absolute bottom-4 right-4 flex size-10 translate-y-2 items-center justify-center bg-coal/70 text-cream opacity-0 transition-all duration-500 ease-site group-hover:translate-y-0 group-hover:opacity-100" aria-hidden="true">
                  <Expand className="size-4" />
                </span>
              </button>
              </Burnt>
            </motion.li>
          ))}
        </ul>
      </div>

      <AnimatePresence>{open !== null && <Lightbox photos={photos} index={open} onChange={setOpen} onClose={() => setOpen(null)} />}</AnimatePresence>
    </section>
  );
}
