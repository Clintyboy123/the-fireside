import { hours, LAST_BOOKING_BEFORE_CLOSE } from '../content/site';

const toMinutes = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};
const toTime = (minutes) => `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;

// Today in South Africa as YYYY-MM-DD (the restaurant's day, wherever the visitor is).
export const todayInSA = () => new Date().toLocaleDateString('en-CA', { timeZone: 'Africa/Johannesburg' });

export const addDays = (iso, days) => {
  const d = new Date(`${iso}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
};

export const dayOf = (iso) => new Date(`${iso}T12:00:00Z`).getUTCDay();

// The bookable times for a date: every 30 minutes from opening to an hour before closing.
// For today, only times at least an hour from now.
export const slotsFor = (iso) => {
  if (!iso) return [];
  const day = hours[dayOf(iso)];
  if (!day) return [];
  let start = toMinutes(day.open);
  const end = toMinutes(day.close) - LAST_BOOKING_BEFORE_CLOSE;
  if (iso === todayInSA()) {
    const now = new Date().toLocaleTimeString('en-GB', { timeZone: 'Africa/Johannesburg', hour: '2-digit', minute: '2-digit', hour12: false });
    const earliest = Math.ceil((toMinutes(now) + 60) / 30) * 30;
    start = Math.max(start, earliest);
  }
  const slots = [];
  for (let t = start; t <= end; t += 30) slots.push(toTime(t));
  return slots;
};

export const isClosed = (iso) => Boolean(iso) && !hours[dayOf(iso)];

export const longDate = (iso) =>
  new Date(`${iso}T12:00:00Z`).toLocaleDateString('en-ZA', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC' });
