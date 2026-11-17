// Trading hours, from the restaurant's current website (Contact Us page).
// 0 = Sunday ... 6 = Saturday. null = closed. Keep in step with frontend/src/content/site.js.
// Bookings are taken from opening time until LAST_BOOKING_BEFORE_CLOSE minutes before closing.
const hours = {
  0: { open: '08:30', close: '15:00' },
  1: null,
  2: { open: '12:00', close: '22:00' },
  3: { open: '12:00', close: '22:00' },
  4: { open: '12:00', close: '22:00' },
  5: { open: '12:00', close: '22:00' },
  6: { open: '08:00', close: '22:00' },
};

const LAST_BOOKING_BEFORE_CLOSE = 60;

const toMinutes = (hhmm) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};

// Is this time on this date (YYYY-MM-DD) one we take bookings for? Returns an error message or null.
const checkSlot = (date, time) => {
  const day = new Date(`${date}T12:00:00Z`).getUTCDay();
  const today = hours[day];
  if (!today) return 'We are closed on Mondays. Please choose another day.';
  const t = toMinutes(time);
  if (t < toMinutes(today.open) || t > toMinutes(today.close) - LAST_BOOKING_BEFORE_CLOSE) {
    return 'Please choose a time within our trading hours';
  }
  return null;
};

module.exports = { hours, checkSlot };
