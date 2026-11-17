// The small gold label above every heading. Always the same size, tracking and gap below.
export default function Eyebrow({ children, className = '' }) {
  return <p className={`label text-gold ${className}`}>{children}</p>;
}
