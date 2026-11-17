import { burnImages } from '../../utils/burn';

// Wraps a photo so its edges look like burnt paper: a ragged cut-out plus charring on top,
// with a soft Multiply drop shadow cut to the same outline underneath.
// `seed` changes the burn pattern, so neighbouring photos never share the same edge.
export default function Burnt({ seed = 1, bite = 6, className = '', children }) {
  const { mask, edge } = burnImages(seed, bite);
  const maskStyle = { WebkitMaskImage: mask, maskImage: mask, WebkitMaskSize: '100% 100%', maskSize: '100% 100%', WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat' };

  return (
    <div className={`relative ${className}`}>
      <div className="img-shadow" aria-hidden="true">
        <div style={maskStyle} />
      </div>
      <div className="relative h-full" style={maskStyle}>
        {children}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ backgroundImage: edge, backgroundSize: '100% 100%' }} />
      </div>
    </div>
  );
}
