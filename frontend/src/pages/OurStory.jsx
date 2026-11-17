import RevealText from '../components/motion/RevealText';
import RevealImage from '../components/motion/RevealImage';
import Reveal from '../components/motion/Reveal';
import Eyebrow from '../components/ui/Eyebrow';
import Button from '../components/ui/Button';
import Occasions from '../components/sections/Occasions';
import { photo } from '../content/photos';

// The long version of the story, told in the restaurant's own words.
export default function OurStory() {
  const lead = photo('story-hero');
  const kids = photo('story-kids');
  const table = photo('story-table');

  return (
    <>
      <title>Our Story | The Fireside, Overbaakens</title>
      <meta name="description" content="The Fireside is a family restaurant owned and run by a husband and wife with 17 years in hospitality. A home away from home, just without the dishes." />

      <header className="shell pb-section pt-44 md:pt-52">
        <div className="flex flex-col items-center text-center">
          <Eyebrow>Our story</Eyebrow>
          <RevealText as="h1" immediate delay={0.15} lines={['Families and friends,', 'gathered round the fire.']} className="mt-6 font-display text-h1 text-cream" />
        </div>
        <RevealImage {...lead} burn={21} loading="eager" parallax={8} sizes="100vw" className="mt-rhythm aspect-[4/5] sm:aspect-[16/9]" />
      </header>

      <section className="shell grid gap-16 pb-section md:grid-cols-12 md:gap-x-8">
        <Reveal className="text-center md:col-span-4 md:text-left">
          <p className="font-display text-[clamp(5rem,4rem+5vw,9rem)] leading-none text-gold">17</p>
          <p className="label mt-4 text-smoke">Years in hospitality</p>
        </Reveal>
        <Reveal group className="space-y-8 text-center text-lead text-smoke md:col-span-7 md:col-start-6 md:text-left">
          <Reveal.Item as="p" className="font-display text-h3 text-cream">
            The meaning behind The Fireside is all about families and friends getting together around the fire and enjoying a lovely evening.
          </Reveal.Item>
          <Reveal.Item as="p">
            We are a friendly family restaurant, owned and managed by a husband and wife driven by a passion for good food, good wine and good company. After seventeen years in the hospitality industry, this is our vision: exceptional food, outstanding service and a warm, inviting room.
          </Reveal.Item>
          <Reveal.Item as="p">
            Our menu runs from classic favourites to a few creations of our own, all made with the freshest ingredients and a dash of love. We want to serve more than a meal: an evening that brings people together.
          </Reveal.Item>
        </Reveal>
      </section>

      <section className="shell grid items-end gap-10 pb-section md:grid-cols-12 md:gap-x-8">
        <div className="md:col-span-5">
          <RevealImage {...kids} burn={8} parallax={5} sizes="(min-width: 768px) 40vw, 100vw" className="aspect-[4/5]" />
        </div>
        <Reveal className="flex flex-col items-center text-center md:col-span-6 md:col-start-7 md:items-start md:pb-12 md:text-left">
          <Eyebrow>Bring the whole family</Eyebrow>
          <h2 className="mt-6 font-display text-h2 text-cream">Let the kids play. Braai a marshmallow.</h2>
          <p className="mt-8 max-w-[44ch] text-lead text-smoke">
            Sit back and relax while the little ones run around, then gather at the fire: ask your waiter for marshmallows to braai, on the house. Bring the birthday cake too, at no extra charge. And on Tuesdays from 17:30, kids eat free.
          </p>
        </Reveal>
      </section>

      <section className="shell pb-section">
        <RevealImage {...table} burn={14} parallax={6} sizes="100vw" className="aspect-[4/5] sm:aspect-[21/9]" />
        <Reveal className="mt-16 flex flex-col items-center text-center">
          <p className="max-w-[24ch] font-display text-h2 italic text-cream">&ldquo;A home away from home, just without the dishes.&rdquo;</p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
            <Button to="/book">Book a table</Button>
            <Button to="/menu" variant="outline">
              See the menu
            </Button>
          </div>
        </Reveal>
      </section>

      <Occasions />
    </>
  );
}
