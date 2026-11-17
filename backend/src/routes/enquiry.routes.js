const router = require('express').Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { formLimiter } = require('../middleware/rateLimit');
const controller = require('../controllers/enquiry.controller');

const SUBJECTS = ['General question', 'Events & functions', 'Catering (To Dine For)', 'Spit braai (Spit 4 U)', 'Feedback'];

router.post(
  '/',
  formLimiter,
  validate([
    body('name').trim().notEmpty().withMessage('Please enter your name').isLength({ max: 120 }),
    body('email').trim().isEmail().withMessage('Please enter a valid email address').isLength({ max: 254 }),
    body('phone').optional({ values: 'falsy' }).trim().matches(/^[+()\d\s-]{9,20}$/).withMessage('Please enter a valid phone number'),
    body('subject').isIn(SUBJECTS).withMessage('Choose what your message is about'),
    body('message').trim().isLength({ min: 10, max: 3000 }).withMessage('Please write a message (at least 10 characters)'),
    body('website').optional().isEmpty().withMessage('Invalid submission'),
  ]),
  controller.create
);

module.exports = router;
