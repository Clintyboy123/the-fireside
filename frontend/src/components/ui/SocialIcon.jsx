// Brand marks drawn in the same line style as the site's other icons (24px grid, 1.75 stroke).
const paths = {
  facebook: <path d="M17 2.5h-2.6A4.4 4.4 0 0 0 10 6.9V10H7v3.6h3V21.5h3.7v-7.9h2.9l.6-3.6h-3.5V7.3c0-.6.4-1 1-1H17z" />,
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.4" cy="6.6" r="0.6" fill="currentColor" stroke="none" />
    </>
  ),
  whatsapp: (
    <>
      <path d="M3.5 20.5l1.3-4.2a8.6 8.6 0 1 1 3.3 3.1z" />
      <path d="M9.2 8.6c.2-.5.6-.6.9-.6h.5c.2 0 .4 0 .5.4l.7 1.6c.1.2 0 .5-.1.6l-.5.6c.6 1.2 1.6 2.2 2.8 2.8l.6-.6c.2-.2.4-.2.6-.1l1.6.7c.3.1.4.3.4.5v.5c0 .4-.2.7-.6.9-.6.3-1.6.4-2.9-.2a8.7 8.7 0 0 1-3.6-3.6c-.6-1.3-.5-2.3-.2-2.9z" />
    </>
  ),
};

export default function SocialIcon({ id, className = 'size-4' }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[id]}
    </svg>
  );
}
