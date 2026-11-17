const { matchedData } = require('express-validator');
const reservations = require('../services/reservation.service');

exports.create = async (req, res) => {
  const { website, ...values } = matchedData(req); // "website" is the honeypot, never stored
  const reservation = await reservations.create(values);
  res.status(201).json({
    success: true,
    message: 'Thank you. Your request is in, and we will be in touch shortly to confirm your table.',
    data: { reference: reservation.id, date: reservation.date, time: reservation.time, guests: reservation.guests },
  });
};
