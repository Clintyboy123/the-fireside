import { Link } from 'react-router';
import { LoaderCircle } from 'lucide-react';

// Buttons: square-edged, uppercase labels, a slow brass fill on hover. Pages choose a variant.
const base =
  'group/btn label relative inline-flex min-h-12 items-center justify-center gap-3 px-7 transition-[color,background-color,border-color] duration-500 ease-site disabled:cursor-not-allowed disabled:opacity-60';

const variants = {
  // The one gold action per view: reserve.
  // Boxed buttons fill burnt terracotta (#C65B32) on hover, with white text for readable contrast.
  primary: 'bevel btn-shadow bg-gold text-coal hover:bg-ember hover:text-white disabled:hover:bg-gold disabled:hover:text-coal',
  // Outline on dark grounds and over photos.
  outline: 'bevel btn-shadow border border-cream/40 text-cream hover:border-ember hover:bg-ember hover:text-white',
  // Text link with a drawing underline.
  link: 'min-h-11 px-0 text-gold hover:text-gold-bright after:absolute after:inset-x-0 after:bottom-2.5 after:h-px after:origin-left after:scale-x-100 after:bg-current after:transition-transform after:duration-500 after:ease-site hover:after:origin-right hover:after:scale-x-0',
};

export default function Button({ variant = 'primary', to, href, loading = false, disabled = false, className = '', children, ...props }) {
  const classes = `${base} ${variants[variant]} ${className}`;

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {children}
      </a>
    );
  }

  return (
    <button type="button" {...props} className={classes} disabled={loading || disabled} aria-busy={loading}>
      {loading && <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />}
      {children}
    </button>
  );
}
