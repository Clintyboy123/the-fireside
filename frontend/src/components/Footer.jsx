import { Link } from 'react-router';
import { Mail, MapPin, Phone } from 'lucide-react';
import Logo from './Logo';
import Flame from './ui/Flame';
import SocialIcon from './ui/SocialIcon';
import { activeSocials } from './SocialRail';
import { nav, site, hoursDisplay } from '../content/site';

export default function Footer() {
  return (
    <footer className="relative border-t border-gold/50 bg-night/35">
      <div className="shell py-section">
        <div className="grid gap-16 text-center md:grid-cols-12 md:gap-x-8 md:text-left">
          <div className="flex flex-col items-center md:col-span-5 md:items-start">
            <Logo className="w-48" />
            <p className="mt-8 max-w-xs font-display text-h3 italic text-cream/90">{site.tagline}</p>
            <ul className="mt-8 flex gap-3" aria-label="Social media">
              {activeSocials().map((s) => (
                <li key={s.id}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={s.label}
                    className="bevel btn-shadow flex size-11 items-center justify-center border border-cream/20 text-gold transition-colors duration-300 hover:border-ember hover:bg-ember hover:text-white"
                  >
                    <SocialIcon id={s.id} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <nav aria-label="Footer" className="md:col-span-2">
            <h2 className="label text-gold">Explore</h2>
            <ul className="mt-6 space-y-1">
              {[{ label: 'Home', to: '/' }, ...nav, { label: 'Book a table', to: '/book' }].map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="inline-block py-1.5 text-smoke transition-colors hover:text-cream">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-3">
            <h2 className="label text-gold">Find us</h2>
            <ul className="mt-6 space-y-4 text-smoke">
              <li>
                <a href={site.directionsUrl} target="_blank" rel="noreferrer" className="inline-flex flex-col items-center gap-2 transition-colors hover:text-cream md:flex-row md:items-start md:gap-3">
                  <MapPin className="size-4 shrink-0 text-gold md:mt-1.5" aria-hidden="true" />
                  <span>{site.address.join(', ')}</span>
                </a>
              </li>
              <li>
                <a href={site.phoneHref} className="inline-flex flex-col items-center gap-2 transition-colors hover:text-cream md:flex-row md:gap-3">
                  <Phone className="size-4 shrink-0 text-gold" aria-hidden="true" />
                  {site.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${site.email}`} className="inline-flex flex-col items-center gap-2 break-all transition-colors hover:text-cream md:flex-row md:gap-3">
                  <Mail className="size-4 shrink-0 text-gold" aria-hidden="true" />
                  {site.email}
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h2 className="label text-gold">Hours</h2>
            <dl className="mt-6 space-y-3 text-smoke">
              {hoursDisplay.map((row) => (
                <div key={row.days}>
                  <dt className="text-small text-ash">{row.days}</dt>
                  <dd className="text-cream/90">{row.time}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="mt-section flex flex-col items-center gap-6 border-t border-line pt-10 text-center text-small text-ash md:flex-row md:justify-between md:text-left">
          <p>© {new Date().getFullYear()} The Fireside, Eatery & Venue. All rights reserved.</p>
          <Flame className="hidden h-5 w-4 text-gold/70 md:block" />
          <p>Part of the To Dine For family, with Spit 4 U.</p>
        </div>
      </div>
    </footer>
  );
}
