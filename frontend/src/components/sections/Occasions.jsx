import RevealImage from '../motion/RevealImage';
import Reveal from '../motion/Reveal';
import SectionHeading from '../ui/SectionHeading';
import Button from '../ui/Button';
import { photo } from '../../content/photos';
import { site } from '../../content/site';

// The venue: The Fireside hosts every kind of celebration, and its sister companies cater off-site.
export default function Occasions() {
  const image = photo('venue');

  return (
    <section id="venue" aria-labelledby="venue-title" className="relative overflow-hidden bg-night/35 py-section">
      <div className="shell grid items-center gap-16 md:grid-cols-12 md:gap-x-8">
        <div className="md:col-span-6 md:col-start-7 md:row-start-1 lg:col-span-5 lg:col-start-8">
          <RevealImage {...image} burn={5} parallax={6} sizes="(min-width: 768px) 45vw, 100vw" className="aspect-[4/5]" />
        </div>

        <div className="md:col-span-6 md:row-start-1">
          <SectionHeading
            id="venue-title"
            eyebrow="The venue"
            lines={['We cater for', 'any occasion.']}
            intro="Long tables, candlelight and a kitchen that knows how to feed a crowd. Tell us what you are celebrating and we will set the table."
          />

          <Reveal as="ul" group gap={0.04} className="mx-auto mt-12 grid max-w-md gap-x-8 gap-y-2 text-center font-display sm:grid-cols-2 sm:gap-y-3 sm:text-left text-[1.375rem] leading-snug text-cream/90 md:mx-0">
            {site.occasions.map((occasion) => (
              <Reveal.Item as="li" key={occasion} className="flex items-baseline justify-center gap-3 sm:justify-start">
                <span className="size-1.5 shrink-0 -translate-y-1 rotate-45 bg-gold/70" aria-hidden="true" />
                {occasion}
              </Reveal.Item>
            ))}
          </Reveal>

          <Reveal className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center md:justify-start">
            <Button href={`mailto:${site.email}?subject=Event%20enquiry`}>Plan an event</Button>
            <Button href={site.phoneHref} variant="outline">
              Call {site.phone}
            </Button>
          </Reveal>
        </div>
      </div>

      <div className="shell mt-rhythm">
        <Reveal className="ornament label text-center">
          <span className="px-2">Part of a family of three</span>
        </Reveal>
        <Reveal group as="ul" className="mt-12 grid gap-12 text-center md:grid-cols-2 md:gap-x-8 md:text-left">
          {site.sisterBrands.map((brand) => (
            <Reveal.Item as="li" key={brand.name} className="flex flex-col items-center md:items-start">
              <p className="label text-ash">{brand.role}</p>
              <h3 className="mt-4 font-display text-h3 text-cream">{brand.name}</h3>
              <p className="mt-4 max-w-[40ch] text-smoke">{brand.description}</p>
              <Button href={brand.href} target="_blank" rel="noreferrer" variant="link" className="mt-4">
                Visit {brand.name}
              </Button>
            </Reveal.Item>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
