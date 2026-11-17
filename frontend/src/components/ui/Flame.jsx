// The flame from the logo, redrawn as a small mark for ornaments and the loader.
export default function Flame({ className = '' }) {
  return (
    <svg viewBox="0 0 24 32" className={className} aria-hidden="true" fill="currentColor">
      <path d="M12.6 0c.9 4.6-1.6 7.2-3.9 9.8C6.4 12.4 4 15.1 4 19.6 4 25.4 7.6 30 12 30s8-3.9 8-9.4c0-3.6-1.7-6.2-3.3-8 .3 2.3-.5 4.1-2 5 .5-3.7-.2-7-2.1-9.6C11.6 6 12.9 3.5 12.6 0Zm-.4 30c-2.6 0-4.4-2.1-4.4-4.8 0-2.6 1.6-4 3-5.6 1-1.1 1.7-2.4 1.7-4 1.9 1.5 4.1 4.3 4.1 7.7 0 3.6-2 6.7-4.4 6.7Z" />
    </svg>
  );
}
