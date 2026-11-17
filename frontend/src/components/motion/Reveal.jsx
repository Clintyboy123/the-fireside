import { motion } from 'motion/react';
import { fadeUp, stagger, inView } from '../../utils/motion';

// Animates its content in the first time it scrolls into view.
//   <Reveal>...</Reveal>                       one block fades up
//   <Reveal group> <Reveal.Item/> ... </Reveal> children arrive one after another
export default function Reveal({ as = 'div', group = false, gap, delay, className, children, ...props }) {
  const Tag = motion[as];
  return (
    <Tag className={className} variants={group ? stagger(gap, delay) : fadeUp} initial="hidden" whileInView="visible" viewport={inView} {...props}>
      {children}
    </Tag>
  );
}

Reveal.Item = function RevealItem({ as = 'div', className, children, ...props }) {
  const Tag = motion[as];
  return (
    <Tag className={className} variants={fadeUp} {...props}>
      {children}
    </Tag>
  );
};
