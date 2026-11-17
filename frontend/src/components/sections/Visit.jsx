import { Mail, MapPin, Phone, Clock } from 'lucide-react';
import SectionHeading from '../ui/SectionHeading';
import Reveal from '../motion/Reveal';
import Button from '../ui/Button';
import { site, hoursDisplay } from '../../content/site';

// Contact and location: the map on one side, everything needed to get here on the other.
export default function Visit() {
  const rows = [
    { icon: MapPin, label: 'Address', content: site.address.map((line) => <span key={line} className="block">{line}</span>) },
    { icon: Phone, label: 'Call', content: <a href={site.phoneHref} className="transition-colors hover:text-gold">{site.phone}</a> },
    { icon: Mail, label: 'Email', content: <a href={`mailto:${site.email}`} className="break-all transition-colors hover:text-gold">{site.email}</a> },
  ];

  return (
    <section id="visit" aria-labelledby="visit-title" className="border-t border-line bg-night/35 py-section">
      <div className="shell grid gap-16 md:grid-cols-12 md:gap-x-8">
        <div className="md:col-span-5">
          <SectionHeading id="visit-title" eyebrow="Visit us" lines={['Find your way', 'to the fire.']} />

          <Reveal group as="dl" className="mt-12 grid gap-10 text-center sm:grid-cols-2 md:text-left">
            {rows.map(({ icon: Icon, label, content }) => (
              <Reveal.Item key={label} className="flex flex-col items-center md:items-start">
                <dt className="flex flex-col items-center gap-3 md:flex-row">
                  <Icon className="size-4 text-gold" aria-hidden="true" />
                  <span className="label text-ash">{label}</span>
                </dt>
                <dd className="mt-3 text-cream">{content}</dd>
              </Reveal.Item>
            ))}
            <Reveal.Item className="flex flex-col items-center md:items-start">
              <dt className="flex flex-col items-center gap-3 md:flex-row">
                <Clock className="size-4 text-gold" aria-hidden="true" />
                <span className="label text-ash">Hours</span>
              </dt>
              <dd className="mt-3 space-y-1 text-cream">
                {hoursDisplay.map((row) => (
                  <span key={row.days} className="block">
                    <span className="text-smoke">{row.days.replace(' to ', '–')}:</span> {row.time.replace(' to ', '–')}
                  </span>
                ))}
              </dd>
            </Reveal.Item>
          </Reveal>

          <Reveal className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center md:justify-start">
            <Button href={site.directionsUrl} target="_blank" rel="noreferrer">
              Get directions
            </Button>
            <Button href={site.phoneHref} variant="outline">
              Call us
            </Button>
          </Reveal>
        </div>

        <Reveal className="md:col-span-7">
          <div className="relative aspect-[4/5] overflow-hidden border border-line sm:aspect-[4/3] md:aspect-auto md:h-full md:min-h-[32rem]">
            <iframe
              title="Map showing The Fireside at 41 Circular Drive, Overbaakens, Gqeberha"
              src={site.mapEmbed}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 h-full w-full border-0 [filter:grayscale(1)_invert(0.92)_sepia(0.25)_contrast(0.9)]"
              allowFullScreen
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
