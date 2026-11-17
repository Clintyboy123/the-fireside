import { Minus, Plus } from 'lucide-react';

// − 2 + : a compact quantity control, 44px tall touch targets.
export default function QtyStepper({ qty, onChange, label }) {
  const btn = 'bevel flex size-9 items-center justify-center text-cream transition-colors duration-300 hover:text-gold';
  return (
    <div className="bevel flex items-center border border-gold/50" role="group" aria-label={`${label}: quantity`}>
      <button type="button" onClick={() => onChange(qty - 1)} className={btn} aria-label={qty === 1 ? `Remove ${label}` : `One less ${label}`}>
        <Minus className="size-3.5" aria-hidden="true" />
      </button>
      <span className="w-6 text-center text-small font-semibold tabular-nums text-cream" aria-live="polite">
        {qty}
      </span>
      <button type="button" onClick={() => onChange(qty + 1)} className={btn} aria-label={`One more ${label}`}>
        <Plus className="size-3.5" aria-hidden="true" />
      </button>
    </div>
  );
}
