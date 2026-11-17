import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import SectionHeading from '../ui/SectionHeading';
import Button from '../ui/Button';
import Reveal from '../motion/Reveal';
import MenuItem from '../MenuItem';
import Burnt from '../effects/Burnt';
import { categories } from '../../content/menu';
import { photo } from '../../content/photos';
import { ease, cinema, easyEase, frameIn, inView } from '../../utils/motion';

// A taste of the menu: six categories, six dishes each, one photograph per category that changes with the tab.
const featured = ['tapas', 'grills', 'pizza', 'kitchen', 'desserts', 'drinks'];

export default function MenuPreview() {
  const tabs = featured.map((id) => categories.find((c) => c.id === id));
  const [active, setActive] = useState(tabs[0].id);
  const current = tabs.find((t) => t.id === active);
  const image = photo(`menu-${active}`);

  const onKey = (event, index) => {
    const step = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
    if (!step) return;
    event.preventDefault();
    const next = tabs[(index + step + tabs.length) % tabs.length];
    setActive(next.id);
    document.getElementById(`tab-${next.id}`)?.focus();
  };

  return (
    <section id="menu" aria-labelledby="menu-title" className="py-section">
      <div className="shell">
        <div className="flex flex-col items-center gap-10 md:flex-row md:items-end md:justify-between">
          <SectionHeading id="menu-title" eyebrow="The menu" lines={['Made from scratch,', 'with a dash of love.']} />
          <Reveal className="hidden md:block">
            <Button to="/menu" variant="outline">
              View full menu
            </Button>
          </Reveal>
        </div>

        <Reveal className="mt-16 -mx-gutter overflow-x-auto px-gutter [scrollbar-width:none] md:mx-0 md:px-0">
          <div role="tablist" aria-label="Menu categories" className="flex min-w-max gap-8 border-b border-line md:gap-12">
            {tabs.map((tab, index) => (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                role="tab"
                type="button"
                aria-selected={active === tab.id}
                aria-controls="menu-panel"
                tabIndex={active === tab.id ? 0 : -1}
                onClick={() => setActive(tab.id)}
                onKeyDown={(e) => onKey(e, index)}
                className={`label relative min-h-12 whitespace-nowrap pb-4 transition-colors duration-300 ${active === tab.id ? 'text-cream' : 'text-ash hover:text-smoke'}`}
              >
                {tab.name}
                {active === tab.id && <motion.span layoutId="menu-tab-line" className="absolute inset-x-0 -bottom-px h-px bg-gold" transition={{ duration: 0.5, ease }} />}
              </button>
            ))}
          </div>
        </Reveal>

        <div id="menu-panel" role="tabpanel" aria-labelledby={`tab-${active}`} className="mt-12 grid gap-12 md:grid-cols-12 md:gap-x-8">
          <motion.div className="hidden md:col-span-5 md:block" variants={frameIn} initial="hidden" whileInView="visible" viewport={inView}>
          <Burnt seed={9} className="h-full">
          <div className="relative h-full min-h-[36rem] overflow-hidden">
            <AnimatePresence initial={false} mode="popLayout">
              <motion.img
                key={image.id}
                src={image.src}
                srcSet={image.srcSet}
                sizes="40vw"
                alt={image.alt}
                width={image.width}
                height={image.height}
                loading="lazy"
                className="grade absolute inset-0 h-full w-full object-cover"
                initial={{ opacity: 0, scale: 1.08 }}
                animate={{ opacity: 1, scale: 1, transition: { duration: 1.2, ease: cinema } }}
                exit={{ opacity: 0, transition: { duration: 0.6 } }}
              />
            </AnimatePresence>
          </div>
          </Burnt>
          </motion.div>

          <div className="md:col-span-7 md:pl-8 lg:pl-16">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 0.9, ease: easyEase } }}
                exit={{ opacity: 0, y: -8, transition: { duration: 0.35, ease: easyEase } }}
              >
                <p className="font-display text-lead italic text-smoke">{current.note}</p>
                <div className="mt-4 divide-y divide-line">
                  {current.items.slice(0, 6).map((item) => (
                    <MenuItem key={item.name} item={item} category={current.name} />
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="mt-16 flex justify-center md:justify-end">
          <Button to={`/menu#${active}`}>View full menu</Button>
        </div>
      </div>
    </section>
  );
}
