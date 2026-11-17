import RevealImage from '../motion/RevealImage';
import Reveal from '../motion/Reveal';
import SectionHeading from '../ui/SectionHeading';
import { signatures, formatPrice } from '../../content/menu';
import { photo } from '../../content/photos';

// The dishes the restaurant calls out itself ("Best ever!", "Frank's favourite", "Recommended"),
// staged large and asymmetric like a magazine spread.
const picks = [
  { name: "Debbie's Famous Alfredo Pasta", photo: 'sig-alfredo' },
  { name: 'The Fireside', category: 'Pizza', photo: 'sig-pizza' },
  { name: 'Fireside Breakfast', photo: 'sig-breakfast' },
  { name: 'Fireside "Kuier" Platter', photo: 'sig-platter' },
];

// Alternating, offset frames: large-left, small-right, so the eye zig-zags down the spread.
const layouts = [
  { image: 'md:col-span-6', copy: 'md:col-span-5 md:col-start-8', ratio: 'aspect-[4/5]' },
  { image: 'md:col-span-5 md:col-start-8 md:row-start-1', copy: 'md:col-span-5 md:col-start-2 md:row-start-1', ratio: 'aspect-square' },
  { image: 'md:col-span-6 md:col-start-1', copy: 'md:col-span-5 md:col-start-8', ratio: 'aspect-[5/4]' },
  { image: 'md:col-span-5 md:col-start-8 md:row-start-1', copy: 'md:col-span-5 md:col-start-2 md:row-start-1', ratio: 'aspect-[4/5]' },
];

export default function Signatures() {
  const dishes = picks
    .map((pick) => ({ ...signatures.find((s) => s.name === pick.name && (!pick.category || s.category === pick.category)), image: photo(pick.photo) }))
    .filter((d) => d.name);

  return (
    <section aria-labelledby="signatures-title" className="relative py-section">
      <div className="shell">
        <SectionHeading
          id="signatures-title"
          eyebrow="Signature dishes"
          lines={['The plates people', 'come back for.']}
          intro="The ones our regulars order without opening the menu."
          center
        />

        <ol className="mt-rhythm space-y-16 md:space-y-20">
          {dishes.map((dish, index) => {
            const layout = layouts[index % layouts.length];
            return (
              <li key={dish.name + dish.category} className="grid items-center gap-10 md:grid-cols-12 md:gap-x-8">
                <div className={layout.image}>
                  <RevealImage {...dish.image} burn={11 + index * 4} parallax={5} sizes="(min-width: 768px) 55vw, 100vw" className={layout.ratio} />
                </div>
                <Reveal group className={`flex flex-col items-center text-center md:items-start md:text-left ${layout.copy}`}>
                  <Reveal.Item className="flex items-center gap-4">
                    <span className="font-display text-h3 italic text-gold/70">{String(index + 1).padStart(2, '0')}</span>
                    <span className="h-px w-10 bg-gold/50" aria-hidden="true" />
                    <span className="label text-gold">{dish.flag}</span>
                  </Reveal.Item>
                  <Reveal.Item as="h3" className="mt-6 max-w-[14ch] font-display text-title text-cream">
                    {dish.category === 'Pizza' ? 'The Fireside Pizza' : dish.name}
                  </Reveal.Item>
                  <Reveal.Item as="p" className="mt-8 max-w-[34ch] text-lead text-smoke">
                    {dish.description}
                  </Reveal.Item>
                  <Reveal.Item as="p" className="mt-10 font-display text-h3 text-gold">
                    {formatPrice(dish)}
                  </Reveal.Item>
                </Reveal>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
