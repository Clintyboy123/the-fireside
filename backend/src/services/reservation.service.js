const { Reservation } = require('../models');
const mail = require('./mail.service');
const env = require('../config/env');

const formatDate = (iso) =>
  new Date(`${iso}T12:00:00`).toLocaleDateString('en-ZA', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

// Save first, then notify. If the email fails, the request is still safe in the database.
exports.create = async (values) => {
  const items = Array.isArray(values.items) && values.items.length ? values.items : null;
  const reservation = await Reservation.create({ ...values, requests: values.requests || null, items });

  const when = `${formatDate(reservation.date)} at ${reservation.time}`;
  const summary = [
    `Name:      ${reservation.name}`,
    `Guests:    ${reservation.guests}`,
    `When:      ${when}`,
    `Phone:     ${reservation.phone}`,
    `Email:     ${reservation.email}`,
    `Requests:  ${reservation.requests || '-'}`,
    '',
    items ? `Pre-order (to confirm with the table):\n${items.map((i) => `  ${i.qty} x ${i.name}${i.price ? `  (${i.price})` : ''}`).join('\n')}\n` : 'Pre-order: none',
    '',
    `Reference: #${reservation.id}`,
  ].join('\n');

  try {
    if (mail.isConfigured()) {
      // Visitor input only ever goes in the body, never in the subject or headers.
      await mail.send({
        to: env.mail.to,
        subject: `New table request #${reservation.id}`,
        text: `A new table request came in through the website.\n\n${summary}\n\nPlease confirm with the guest by phone or email.`,
        replyTo: reservation.email,
      });
      await mail.send({
        to: reservation.email,
        subject: 'We have your table request - The Fireside',
        text: `Hi ${reservation.name},\n\nThank you for your table request at The Fireside. This is not a confirmation yet: we will be in touch shortly to confirm your booking.\n\n${summary}\n\nNeed to change something? Call us on ${env.mail.phone} or reply to this email.\n\nThe Fireside\n41 Circular Drive, Overbaakens, Gqeberha`,
        replyTo: env.mail.to,
      });
      await reservation.update({ notifiedAt: new Date() });
    } else {
      console.warn(`[reservations] #${reservation.id} saved, but no email was sent because SMTP is not configured.`);
    }
  } catch (error) {
    console.error(`[reservations] #${reservation.id} saved, but sending email failed:`, error.message);
  }

  return reservation;
};
