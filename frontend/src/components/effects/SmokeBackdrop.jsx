// A slow, smoky haze behind every page: five very soft clouds of warm grey and timber brown that drift,
// swell and fade on out-of-step loops (18 to 32 seconds): calm, but visibly moving, never quite the same.
// Pure CSS transforms and opacity: it costs almost nothing while scrolling. Still for reduced motion.
const clouds = [
  { className: 'left-[-20%] top-[-10%] size-[70vmax]', color: 'rgba(232,221,203,0.20)', anim: 'animate-[smoke-a_26s_ease-in-out_infinite_alternate]' },
  { className: 'right-[-25%] top-[20%] size-[80vmax]', color: 'rgba(110,82,60,0.55)', anim: 'animate-[smoke-b_32s_ease-in-out_infinite_alternate]' },
  { className: 'left-[10%] bottom-[-30%] size-[75vmax]', color: 'rgba(169,158,140,0.18)', anim: 'animate-[smoke-c_22s_ease-in-out_infinite_alternate]' },
  { className: 'left-[35%] top-[30%] size-[50vmax]', color: 'rgba(70,52,40,0.6)', anim: 'animate-[smoke-b_28s_ease-in-out_infinite_alternate-reverse]' },
  { className: 'right-[5%] top-[-20%] size-[45vmax]', color: 'rgba(232,221,203,0.16)', anim: 'animate-[smoke-a_18s_ease-in-out_infinite_alternate-reverse]' },
];

// Wisps: fractal noise, slightly taller than wide, turned into soft cream billows of smoke.
// No viewBox, so it renders once at the layer's real size; only its position animates.
const wisps = `url("data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='100%' height='100%'><filter id='w' x='0' y='0' width='100%' height='100%'><feTurbulence type='fractalNoise' baseFrequency='0.0024 0.0016' numOctaves='5' seed='9'/><feColorMatrix values='0 0 0 0 0.91  0 0 0 0 0.87  0 0 0 0 0.80  0 0 0 2.4 -1.15'/><feGaussianBlur stdDeviation='4'/></filter><rect width='100%' height='100%' filter='url(#w)'/></svg>`
)}")`;

export default function SmokeBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div
        className="absolute -inset-[25%] opacity-[0.2] will-change-transform motion-reduce:animate-none animate-[smoke-wisp_30s_ease-in-out_infinite_alternate]"
        style={{ backgroundImage: wisps, backgroundSize: '100% 100%' }}
      />
      {clouds.map((c, i) => (
        <div
          key={i}
          className={`absolute rounded-full blur-[64px] will-change-transform motion-reduce:animate-none ${c.className} ${c.anim}`}
          style={{ background: `radial-gradient(closest-side, ${c.color}, transparent)` }}
        />
      ))}
    </div>
  );
}
