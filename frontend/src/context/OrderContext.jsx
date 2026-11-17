import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { formatPrice } from '../content/menu';

// The dishes a visitor adds from the menu, to pre-order with their table request.
// Kept in this browser only (a convenience, like a basket): it survives page changes and refreshes.
const STORE = 'fireside-preorder';
const OrderContext = createContext(null);

const read = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORE) || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const dishId = (category, item) => `${category}:${item.name}`;

export function OrderProvider({ children }) {
  const [items, setItems] = useState(read);
  const [lastAdded, setLastAdded] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORE, JSON.stringify(items));
    } catch {
      /* storage unavailable: the list lasts for this visit only */
    }
  }, [items]);

  const add = useCallback((category, item) => {
    const id = dishId(category, item);
    setItems((list) => {
      const found = list.find((i) => i.id === id);
      if (found) return list.map((i) => (i.id === id ? { ...i, qty: Math.min(30, i.qty + 1) } : i));
      return [...list, { id, name: item.name, category, price: formatPrice(item), unit: item.price ?? null, qty: 1, include: true }];
    });
    setLastAdded({ name: item.name, at: Date.now() });
  }, []);

  const setQty = useCallback((id, qty) => {
    setItems((list) => (qty <= 0 ? list.filter((i) => i.id !== id) : list.map((i) => (i.id === id ? { ...i, qty: Math.min(30, qty) } : i))));
  }, []);

  const toggle = useCallback((id) => setItems((list) => list.map((i) => (i.id === id ? { ...i, include: !i.include } : i))), []);
  const remove = useCallback((id) => setItems((list) => list.filter((i) => i.id !== id)), []);
  const clear = useCallback(() => setItems([]), []);

  const value = useMemo(() => {
    const count = items.reduce((n, i) => n + i.qty, 0);
    const included = items.filter((i) => i.include);
    const total = included.reduce((sum, i) => sum + (i.unit ? i.unit * i.qty : 0), 0);
    return { items, count, included, total, add, setQty, toggle, remove, clear, lastAdded, qtyOf: (id) => items.find((i) => i.id === id)?.qty || 0 };
  }, [items, add, setQty, toggle, remove, clear, lastAdded]);

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}

export const useOrder = () => useContext(OrderContext);
