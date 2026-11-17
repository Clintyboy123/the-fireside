import { useEffect } from 'react';

// Keeps keyboard focus inside an open menu or dialog, closes it on Escape, makes the page behind inert,
// and returns focus to the control that opened it. Order matters (see the frontend reference).
export default function useFocusTrap(open, containerRef, onClose, backgroundSelector = '#app-root') {
  useEffect(() => {
    if (!open) return undefined;
    const opener = document.activeElement;
    const background = document.querySelector(backgroundSelector);
    background?.setAttribute('inert', '');
    document.documentElement.style.overflow = 'hidden';

    const focusables = () =>
      Array.from(containerRef.current?.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])') || []);
    requestAnimationFrame(() => focusables()[0]?.focus());

    const onKey = (event) => {
      if (event.key === 'Escape') onClose();
      if (event.key !== 'Tab') return;
      const items = focusables();
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);

    return () => {
      document.removeEventListener('keydown', onKey);
      document.documentElement.style.overflow = '';
      background?.removeAttribute('inert');
      if (opener instanceof HTMLElement) opener.focus({ preventScroll: true });
    };
  }, [open, containerRef, onClose, backgroundSelector]);
}
