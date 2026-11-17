import Reveal from '../motion/Reveal';
import SectionHeading from '../ui/SectionHeading';
import { week, lunch } from '../../content/specials';

// The experience, told through the restaurant's real week rather than generic promises.
export default function Week() {
  return (
    <section aria-labelledby="week-title" className="relative overflow-hidden bg-night/35 py-section">
      <div className="firelight pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="shell relative">
        <SectionHeading
          id="week-title"
          eyebrow="The Fireside experience"
          lines={['Every night has', 'its own fire.']}
          intro="Fresh food made with love, a team that looks after you, and a room that feels like home. Here is how the week runs."
        />

        {/* Four nights, divided by hairlines: a printed weekly calendar, not cards. */}
        <Reveal group as="ol" className="mt-rhythm grid gap-y-12 md:grid-cols-2 md:gap-x-8 lg:grid-cols-4 lg:gap-x-0">
          {week.map((night) => (
            <Reveal.Item
              as="li"
              key={night.day}
              className="flex flex-col items-center border-t border-line pt-10 text-center md:items-start md:text-left lg:border-l lg:border-t-0 lg:px-8 lg:pt-0 lg:first:border-l-0 lg:first:pl-0 lg:last:pr-0"
            >
              <p className="label text-gold">{night.day}</p>
              <h3 className="mt-6 font-display text-h3 text-cream">{night.title}</h3>
              <p className="mt-2 text-small italic text-ash">{night.time}</p>
              <p className="mt-6 max-w-[32ch] text-smoke">{night.detail}</p>
            </Reveal.Item>
          ))}
        </Reveal>

        <Reveal className="mt-rhythm grid items-center gap-8 border-y border-line py-10 text-center md:grid-cols-12 md:gap-x-8 md:text-left">
          <div className="flex flex-col items-center gap-3 md:col-span-5 md:items-start">
            <p className="label text-gold">{lunch.time}</p>
            <p className="font-display text-h3 text-cream">
              {lunch.title} <span className="text-gold">{lunch.price}</span>
            </p>
          </div>
          <div className="md:col-span-7">
            <p className="mx-auto max-w-[52ch] text-smoke md:mx-0">{lunch.detail}</p>
            <p className="mt-3 text-small text-ash">Specials change from time to time. T&rsquo;s &amp; C&rsquo;s apply.</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
