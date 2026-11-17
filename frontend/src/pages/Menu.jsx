import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import RevealText from '../components/motion/RevealText';
import Reveal from '../components/motion/Reveal';
import MenuItem from '../components/MenuItem';
import Button from '../components/ui/Button';
import Eyebrow from '../components/ui/Eyebrow';
import { categories, formatPrice } from '../content/menu';
import { photo } from '../content/photos';
import { ease, easyEase } from '../utils/motion';

// The full menu: a sticky category index and every dish, set like a printed menu.
export default function Menu() {
  const [active, setActive] = useState(categories[0].id);
  const hero = photo('menu-hero');

  // The category whose heading has passed 40% down the screen is the one being read.
  useEffect(() => {
    const onScroll = () => {
      const line = window.innerHeight * 0.4;
      let current = categories[0].id;
      for (const c of categories) {
        const el = document.getElementById(c.id);
        if (el && el.getBoundingClientRect().top <= line) current = c.id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <title>Menu | The Fireside, Overbaakens</title>
      <meta name="description" content="The Fireside menu: tapas, breakfast, burgers and steaks, hand-rolled pizzas, wholehearted meals from the kitchen, boards to share, desserts and drinks." />

      <header className="relative isolate overflow-hidden pb-20 pt-44 md:pb-28 md:pt-52">
        <img src={hero.src} srcSet={hero.srcSet} sizes="100vw" alt="" className="grade absolute inset-0 -z-10 h-full w-full animate-ken-burns object-cover opacity-45" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-coal/70 via-coal/60 to-coal" aria-hidden="true" />
        <div className="shell flex flex-col items-center text-center">
          <Eyebrow>The Fireside menu</Eyebrow>
          <RevealText as="h1" immediate delay={0.15} lines={['Something for', 'every appetite.']} className="mt-6 font-display text-h1 text-cream" />
          <motion.p
            className="mt-8 max-w-[44ch] text-lead text-smoke"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 1, duration: 1.2, ease: easyEase } }}
          >
            Classic favourites and a few creations of our own, made with the freshest ingredients and a dash of love. Prices in rand.
          </motion.p>
        </div>
      </header>

      <nav aria-label="Menu sections" className="sticky top-18 z-30 border-y border-line bg-coal/90 backdrop-blur-md">
        <div className="shell overflow-x-auto [scrollbar-width:none]">
          <ul className="flex min-w-max gap-7 md:justify-center md:gap-10">
            {categories.map((c) => (
              <li key={c.id}>
                <a
                  href={`#${c.id}`}
                  aria-current={active === c.id ? 'true' : undefined}
                  className={`label relative flex min-h-14 items-center whitespace-nowrap transition-colors duration-300 ${active === c.id ? 'text-cream' : 'text-ash hover:text-smoke'}`}
                >
                  {c.short}
                  {active === c.id && <motion.span layoutId="menu-nav-line" className="absolute inset-x-0 bottom-0 h-px bg-gold" transition={{ duration: 0.5, ease }} />}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      <div className="shell">
        {categories.map((category, index) => (
          <section key={category.id} id={category.id} aria-labelledby={`${category.id}-title`} className="grid scroll-mt-36 gap-10 border-b border-line py-section md:grid-cols-12 md:gap-x-8 last:border-b-0">
            <div className="flex flex-col items-center text-center md:col-span-4 md:items-start md:text-left">
              <div className="md:sticky md:top-44">
                <Reveal>
                  <p className="font-display text-h3 italic text-gold/70">{String(index + 1).padStart(2, '0')}</p>
                  <h2 id={`${category.id}-title`} className="mt-6 font-display text-h2 text-cream">
                    {category.name}
                  </h2>
                  <p className="mx-auto mt-8 max-w-[30ch] text-smoke md:mx-0">{category.note}</p>
                </Reveal>
              </div>
            </div>

            <div className="md:col-span-8 lg:col-span-7 lg:col-start-6">
              <Reveal group gap={0.04} className="divide-y divide-line">
                {category.items.map((item) => (
                  <Reveal.Item key={item.name}>
                    <MenuItem item={item} category={category.name} />
                  </Reveal.Item>
                ))}
              </Reveal>

              {category.more?.map((block) => (
                <Reveal key={block.title} className="mt-16 border border-line p-8 md:p-10">
                  <div className="flex flex-col items-center gap-2 text-center md:flex-row md:items-baseline md:justify-between md:text-left">
                    <h3 className="font-display text-h3 text-cream">{block.title}</h3>
                    {block.note && <p className="text-small italic text-ash md:max-w-[36ch] md:text-right">{block.note}</p>}
                  </div>
                  <ul className="mt-8 grid gap-x-10 gap-y-3 md:grid-cols-2">
                    {block.lines.map((line) => (
                      <li key={line.name} className="flex items-baseline justify-between gap-4 text-small">
                        <span className="text-smoke">{line.name}</span>
                        <span className="shrink-0 font-semibold text-gold">
                          {formatPrice(line)}
                          {line.glass && <span className="ml-2 font-normal text-ash">R{line.glass} glass</span>}
                        </span>
                      </li>
                    ))}
                  </ul>
                </Reveal>
              ))}
            </div>
          </section>
        ))}
      </div>

      <section className="border-t border-line bg-night/35 py-section">
        <div className="shell flex flex-col items-center text-center">
          <Eyebrow>Hungry yet?</Eyebrow>
          <RevealText lines={['Your table is waiting.']} className="mt-6 font-display text-h2 text-cream" />
          <Reveal className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
            <Button to="/book">Book a table</Button>
            <Button to="/#visit" variant="outline">
              Find us
            </Button>
          </Reveal>
          <p className="mt-10 max-w-[52ch] text-small text-ash">
            Prices and availability can change. Please let us know about any allergies when you order. V = vegetarian.
          </p>
        </div>
      </section>
    </>
  );
}
