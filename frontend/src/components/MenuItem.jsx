import { Plus } from 'lucide-react';
import { formatPrice } from '../content/menu';
import { dishId, useOrder } from '../context/OrderContext';
import QtyStepper from './ui/QtyStepper';

// One dish: name, a fine leader line, price in brass, and an Add button to pre-order it with a table.
export default function MenuItem({ item, category }) {
  const order = useOrder();
  const id = dishId(category, item);
  const qty = order.qtyOf(id);

  return (
    <div className="group flex items-start gap-4 py-6 sm:gap-6">
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-4">
          <h3 className="font-display text-[1.625rem] leading-tight text-cream transition-colors duration-300 group-hover:text-gold-bright">
            {item.name}
            {item.tag === 'v' && (
              <abbr title="Vegetarian" className="ml-2 inline-flex size-5 -translate-y-1 items-center justify-center rounded-full border border-success/60 align-middle font-sans text-[0.625rem] font-bold not-italic text-success no-underline">
                V
              </abbr>
            )}
          </h3>
          <span className="mb-1.5 hidden min-w-6 flex-1 border-b border-dotted border-cream/20 sm:block" aria-hidden="true" />
          <p className="ml-auto shrink-0 font-sans text-small font-semibold tracking-wide text-gold sm:ml-0">{formatPrice(item)}</p>
        </div>
        {(item.description || item.flag) && (
          <p className="mt-2 max-w-[56ch] text-small text-smoke">
            {item.flag && <span className="label mr-3 text-[0.625rem] text-gold">{item.flag}</span>}
            {item.description}
          </p>
        )}
      </div>

      <div className="flex h-9 shrink-0 items-center pt-1">
        {qty > 0 ? (
          <QtyStepper qty={qty} onChange={(n) => order.setQty(id, n)} label={item.name} />
        ) : (
          <button
            type="button"
            onClick={() => order.add(category, item)}
            className="bevel btn-shadow label flex h-9 items-center gap-1.5 border border-cream/25 px-3 text-[0.625rem] text-cream transition-colors duration-300 ease-site hover:border-ember hover:bg-ember hover:text-white"
            aria-label={`Add ${item.name} (${category}) to your table`}
          >
            <Plus className="size-3.5" aria-hidden="true" />
            Add
          </button>
        )}
      </div>
    </div>
  );
}
