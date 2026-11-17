import logo from '../assets/brand/logo.png';

// The Fireside wordmark (the original logo, recoloured cream and brass for dark grounds).
export default function Logo({ className = '' }) {
  return <img src={logo} alt="The Fireside, Eatery & Venue" width="640" height="184" className={`h-auto ${className}`} />;
}
