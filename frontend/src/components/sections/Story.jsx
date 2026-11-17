import RevealImage from '../motion/RevealImage';
import Reveal from '../motion/Reveal';
import SectionHeading from '../ui/SectionHeading';
import Button from '../ui/Button';
import { photo } from '../../content/photos';

// Our story: split editorial layout. The dictionary definition of "fireside" is the restaurant's own
// framing (it is printed on their menu), and it carries the idea of the whole site: gathering round the fire.
export default function Story() {
  const image = photo('story');

  return (
    <section id="story" aria-labelledby="story-title" className="relative py-section">
      <div className="shell grid items-center gap-16 md:grid-cols-12 md:gap-x-8">
        <div className="md:col-span-6 lg:col-span-5">
          <RevealImage {...image} burn={3} parallax={6} sizes="(min-width: 768px) 45vw, 100vw" className="aspect-[4/5]" />
        </div>

        <div className="md:col-span-6 lg:col-span-6 lg:col-start-7">
          <Reveal className="mb-12 flex flex-col items-center border-t border-gold/40 pt-6 text-center md:items-start md:border-l md:border-t-0 md:pl-6 md:pt-0 md:text-left">
            <p className="font-display text-h3 text-cream">
              fire&middot;side <span className="text-lead italic text-smoke">noun</span>
            </p>
            <p className="mt-3 max-w-[32ch] text-small text-smoke md:max-w-[40ch]">
              The area round a fireplace, used especially with reference to a person&rsquo;s home or family life.
            </p>
          </Reveal>

          <SectionHeading
            id="story-title"
            eyebrow="Our story"
            lines={['Good food, good wine', 'and good company.']}
            intro="The Fireside is a friendly family restaurant, owned and run by a husband and wife who bring seventeen years in hospitality to every table. Sit back and relax while the kids play, or braai marshmallows by the fire."
          />

          <Reveal className="mt-10 flex justify-center md:justify-start">
            <Button to="/our-story" variant="link">
              Discover our story
            </Button>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
