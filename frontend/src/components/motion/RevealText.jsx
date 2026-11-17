import SmokeText from './SmokeText';

// Headings across the site condense out of smoke, the same way as the hero headline.
// `immediate` plays straight away (page titles at the top of a page); otherwise it plays when scrolled into view.
export default function RevealText({ as = 'h2', lines, text, className = '', delay = 0, immediate = false, gap = 0.05, ...rest }) {
  return (
    <SmokeText
      as={as}
      lines={lines || [text]}
      className={className}
      delay={immediate ? delay + 0.2 : delay}
      step={gap > 0.06 ? 0.035 : gap}
      trigger={immediate ? 'play' : 'view'}
      {...rest}
    />
  );
}
