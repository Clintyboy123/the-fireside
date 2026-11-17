// Everything the site says about the restaurant, in one place. Sourced from thefireside.co.za (2026).
// Keep hours in step with backend/src/config/hours.js (the API validates bookings against them).

export const site = {
  name: 'The Fireside',
  descriptor: 'Eatery & Venue',
  tagline: 'A home away from home. Just without the dishes.',
  phone: '066 210 5819',
  phoneHref: 'tel:+27662105819',
  email: 'Debbie@thefireside.co.za',
  address: ['41 Circular Drive', 'Overbaakens', 'Gqeberha, 6065'],
  directionsUrl: 'https://www.google.com/maps/dir/?api=1&destination=41+Circular+Dr,+Overbaakens,+Gqeberha,+6065',
  mapEmbed:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3308.5208134547697!2d25.545961975010698!3d-33.9791539731845!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1e7ad1eb3480b053%3A0x2fb0f43e692dde9d!2s41%20Circular%20Dr%2C%20Overbaakens%2C%20Gqeberha%2C%206065!5e0!3m2!1sen!2sza!4v1739958234047!5m2!1sen!2sza',
  // Social links. A link set to null is hidden everywhere, so there is never a dead icon.
  // Facebook and Instagram link to a search for The Fireside until the restaurant supplies its own page addresses.
  socials: [
    { id: 'facebook', label: 'The Fireside on Facebook', href: 'https://www.facebook.com/search/top?q=The%20Fireside%20Overbaakens' },
    { id: 'instagram', label: 'The Fireside on Instagram', href: 'https://www.instagram.com/explore/search/keyword/?q=The%20Fireside%20Overbaakens' },
    { id: 'whatsapp', label: 'WhatsApp The Fireside on 066 210 5819', href: 'https://wa.me/27662105819' },
  ],
  sisterBrands: [
    { name: 'To Dine For', role: 'Catering & events coordinating', description: 'Offsite catering for casual events, weddings and corporate functions, big or small.', href: 'http://todinefor.co.za/' },
    { name: 'Spit 4 U', role: 'Spit braai catering', description: 'The best braais and spit braais, brought to you.', href: 'https://www.facebook.com/spit4ucatering' },
  ],
  occasions: [
    'Weddings',
    'Engagements',
    'Bridal showers',
    'Baby showers',
    'Birthday parties',
    'Family dinners',
    'Reunions',
    'Retirement parties',
    'Corporate events',
    'Holiday parties',
    'Braais & spit braais',
  ],
};

// 0 = Sunday ... 6 = Saturday. null = closed.
export const hours = {
  0: { open: '08:30', close: '15:00' },
  1: null,
  2: { open: '12:00', close: '22:00' },
  3: { open: '12:00', close: '22:00' },
  4: { open: '12:00', close: '22:00' },
  5: { open: '12:00', close: '22:00' },
  6: { open: '08:00', close: '22:00' },
};

// How the hours read on the page.
export const hoursDisplay = [
  { days: 'Monday', time: 'Closed' },
  { days: 'Tuesday to Friday', time: '12:00 to 22:00' },
  { days: 'Saturday', time: '08:00 to 22:00' },
  { days: 'Sunday', time: '08:30 to 15:00' },
];

// Bookings run from opening until an hour before closing, every 30 minutes.
export const LAST_BOOKING_BEFORE_CLOSE = 60;

export const nav = [
  { label: 'Our Story', to: '/our-story' },
  { label: 'Menu', to: '/menu' },
  { label: 'Gallery', to: '/#gallery' },
  { label: 'Contact', to: '/contact' },
];
