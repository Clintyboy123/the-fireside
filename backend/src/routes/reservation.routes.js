const router = require('express').Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { formLimiter } = require('../middleware/rateLimit');
const controller = require('../controllers/reservation.controller');
const { hours, checkSlot } = require('../config/hours');

const MAX_DAYS_AHEAD = 180;

// Today's date in South Africa, as YYYY-MM-DD, so "today" is right whatever the server's timezone.
const todayInSA = () => new Date().toLocaleDateString('en-CA', { timeZone: 'Africa/Johannesburg' });

router.post(
  '/',
  formLimiter,
  validate([
    body('name').trim().notEmpty().withMessage('Please enter your name').isLength({ max: 120 }).withMessage('That name is too long'),
    body('email').trim().isEmail().withMessage('Please enter a valid email address').isLength({ max: 254 }),
    body('phone')
      .trim()
      .matches(/^[+()\d\s-]{9,20}$/)
      .withMessage('Please enter a valid phone number'),
    body('guests').isInt({ min: 1, max: 40 }).withMessage('Choose between 1 and 40 guests').toInt(),
    body('date')
      .isISO8601({ strict: true })
      .withMessage('Choose a date')
      .bail()
      .custom((value) => {
        const today = todayInSA();
        const last = new Date(`${today}T00:00:00Z`);
        last.setUTCDate(last.getUTCDate() + MAX_DAYS_AHEAD);
        if (value < today) throw new Error('Please choose a date from today onwards');
        if (value > last.toISOString().slice(0, 10)) throw new Error('We take bookings up to six months ahead');
        if (!hours[new Date(`${value}T12:00:00Z`).getUTCDay()]) throw new Error('We are closed on Mondays. Please choose another day.');
        return true;
      }),
    body('time')
      .matches(/^([01]\d|2[0-3]):[0-5]\d$/)
      .withMessage('Choose a time')
      .bail()
      .custom((value, { req }) => {
        if (typeof req.body.date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(req.body.date)) return true; // the date rule reports it
        if (!hours[new Date(`${req.body.date}T12:00:00Z`).getUTCDay()]) return true; // closed day: the date rule reports it
        const problem = checkSlot(req.body.date, value);
        if (problem) throw new Error(problem);
        return true;
      }),
    body('requests').optional({ values: 'falsy' }).trim().isLength({ max: 1000 }).withMessage('Please keep requests under 1000 characters'),
    // Optional pre-order: dishes added from the menu.
    body('items').optional().isArray({ max: 40 }).withMessage('Too many dishes in one pre-order'),
    body('items.*.name').trim().notEmpty().isLength({ max: 120 }).withMessage('Unknown dish'),
    body('items.*.qty').isInt({ min: 1, max: 30 }).withMessage('Choose between 1 and 30 of each dish').toInt(),
    body('items.*.price').optional().trim().isLength({ max: 40 }),
    body('website').optional().isEmpty().withMessage('Invalid submission'), // honeypot: real visitors never fill it
  ]),
  controller.create
);

module.exports = router;
