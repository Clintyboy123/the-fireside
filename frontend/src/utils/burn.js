// Burnt-paper edges, drawn as two small SVG images the browser renders once per frame size:
//   mask:  the ragged, burnt-away outline (what stays of the photo)
//   edge:  the charring on top: a near-black rim and a brown scorch that fades into the photo
// Both share the same noise (same seed, same settings) so the char sits exactly on the cut.
// No viewBox: the SVG is laid out at the frame's real pixel size, so the noise never stretches.

// Two noise scales: big lazy bites where the flame ate further in, plus fine tearing along the edge.
const ragged = (seed, bite) => `
  <feTurbulence type='fractalNoise' baseFrequency='0.009 0.012' numOctaves='2' seed='${seed}' result='big'/>
  <feTurbulence type='fractalNoise' baseFrequency='0.06' numOctaves='3' seed='${seed + 7}' result='fine'/>
  <feComposite in='big' in2='fine' operator='arithmetic' k2='0.75' k3='0.25' result='n'/>
  <feMorphology in='SourceGraphic' operator='erode' radius='${bite}' result='e'/>
  <feDisplacementMap in='e' in2='n' scale='${bite * 4}' xChannelSelector='R' yChannelSelector='G' result='r'/>`;

const svg = (body) => `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='100%' height='100%'>${body}</svg>`)}")`;

const cache = new Map();

export function burnImages(seed = 1, bite = 6) {
  const key = `${seed}-${bite}`;
  if (cache.has(key)) return cache.get(key);

  const mask = svg(`
    <filter id='m' x='0' y='0' width='100%' height='100%'>${ragged(seed, bite)}</filter>
    <rect width='100%' height='100%' fill='white' filter='url(#m)'/>`);

  const edge = svg(`
    <filter id='c' x='0' y='0' width='100%' height='100%' color-interpolation-filters='sRGB'>
      ${ragged(seed, bite)}
      <feMorphology in='r' operator='erode' radius='1.5' result='inner'/>
      <feComposite in='r' in2='inner' operator='out' result='rim'/>
      <feGaussianBlur in='inner' stdDeviation='3' result='soft'/>
      <feComposite in='r' in2='soft' operator='out' result='band'/>
      <feGaussianBlur in='inner' stdDeviation='12' result='wide'/>
      <feComposite in='r' in2='wide' operator='out' result='scorch'/>
      <feFlood flood-color='#5a3012' flood-opacity='0.4'/>
      <feComposite in2='scorch' operator='in' result='brown'/>
      <feFlood flood-color='#140b06' flood-opacity='0.92'/>
      <feComposite in2='band' operator='in' result='char'/>
      <feFlood flood-color='#050302'/>
      <feComposite in2='rim' operator='in' result='black'/>
      <feMerge><feMergeNode in='brown'/><feMergeNode in='char'/><feMergeNode in='black'/></feMerge>
    </filter>
    <rect width='100%' height='100%' fill='white' filter='url(#c)'/>`);

  const result = { mask, edge };
  cache.set(key, result);
  return result;
}
