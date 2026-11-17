import { Link } from 'react-router';
import { Check, Plus, X } from 'lucide-react';
import { useOrder } from '../context/OrderContext';
import QtyStepper from './ui/QtyStepper';

// The dishes added from the menu, offered as options on the table request:
// tick or untick each one, change how many, or remove it. Shown with an estimated total.
export default function PreorderOptions() {
  const { items, included, total, setQty, toggle, remove } = useOrder();

  return (
    <fieldset className="sm:col-span-2">
      <legend className="label text-smoke">Pre-order from the menu (optional)</legend>

      {items.length === 0 ? (
        <div className="bevel mt-4 flex flex-col items-start gap-3 border border-dashed border-cream/20 p-5 text-small text-smoke">
          <p>Add dishes from the menu and they will appear here, so we can have them ready for your table.</p>
          <Link to="/menu" className="label inline-flex min-h-11 items-center gap-2 text-gold hover:text-gold-bright">
            <Plus className="size-3.5" aria-hidden="true" /> Browse the menu
          </Link>
        </div>
      ) : (
        <>
          <ul className="mt-4 divide-y divide-line border-y border-line">
            {items.map((item) => (
              <li key={item.id} className="flex items-center gap-3 py-3">
                <button
                  type="button"
                  role="checkbox"
                  aria-checked={item.include}
                  onClick={() => toggle(item.id)}
                  className={`bevel flex size-6 shrink-0 items-center justify-center border transition-colors duration-300 ${
                    item.include ? 'border-gold bg-gold text-coal' : 'border-cream/30 text-transparent hover:border-gold'
                  }`}
                  aria-label={`Include ${item.name}`}
                >
                  <Check className="size-3.5" aria-hidden="true" />
                </button>
                <div className={`min-w-0 flex-1 transition-opacity duration-300 ${item.include ? '' : 'opacity-45'}`}>
                  <p className="truncate text-cream">{item.name}</p>
                  <p className="text-[0.75rem] text-ash">
                    {item.category} &middot; {item.price}
                  </p>
                </div>
                <QtyStepper qty={item.qty} onChange={(n) => setQty(item.id, n)} label={item.name} />
                <button
                  type="button"
                  onClick={() => remove(item.id)}
                  className="bevel flex size-9 shrink-0 items-center justify-center text-ash transition-colors hover:text-danger"
                  aria-label={`Remove ${item.name}`}
                >
                  <X className="size-4" aria-hidden="true" />
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-col gap-3 text-small sm:flex-row sm:items-baseline sm:justify-between">
            <Link to="/menu" className="label inline-flex min-h-11 items-center gap-2 text-gold hover:text-gold-bright">
              <Plus className="size-3.5" aria-hidden="true" /> Add more dishes
            </Link>
            <p className="text-smoke">
              {included.length} {included.length === 1 ? 'dish' : 'dishes'} selected
              {total > 0 && (
                <>
                  {' '}
                  &middot; estimated <span className="font-semibold text-gold">R{total}</span>
                </>
              )}
            </p>
          </div>
          <p className="mt-2 text-[0.75rem] text-ash">We confirm your pre-order with your table. Prices may change; nothing is charged online.</p>
        </>
      )}
    </fieldset>
  );
}
