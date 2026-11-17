import RevealText from '../motion/RevealText';
import Reveal from '../motion/Reveal';
import Eyebrow from './Eyebrow';

// The one heading pattern on the site, so the rhythm never changes:
// eyebrow -> 24px -> heading -> 32px -> intro copy. (CTAs sit 40px below the copy: mt-10.)
// Phones centre everything on one axis; md and up align to the grid (left) unless `center` is set.
export default function SectionHeading({ id, eyebrow, lines, intro, center = false, as = 'h2', size = 'text-h2', className = '' }) {
  const align = center ? 'text-center items-center' : 'text-center items-center md:text-left md:items-start';
  return (
    <div className={`flex flex-col ${align} ${className}`}>
      {eyebrow && (
        <Reveal>
          <Eyebrow>{eyebrow}</Eyebrow>
        </Reveal>
      )}
      <RevealText as={as} id={id} lines={lines} className={`${eyebrow ? 'mt-6' : ''} font-display ${size} font-medium text-cream`} />
      {intro && (
        // The copy waits for the heading to start forming, so the heading always reads first.
        <Reveal group delay={0.6} className={`mt-8 max-w-[34ch] text-lead text-smoke md:max-w-[46ch] ${center ? 'mx-auto' : ''}`}>
          <Reveal.Item as="p">{intro}</Reveal.Item>
        </Reveal>
      )}
    </div>
  );
}
