const { Enquiry } = require('../models');
const mail = require('./mail.service');
const env = require('../config/env');

// Save first, then email the restaurant. A mail failure never loses a message.
exports.create = async (values) => {
  const enquiry = await Enquiry.create({ ...values, phone: values.phone || null });
  const body = [
    `From:     ${enquiry.name}`,
    `Email:    ${enquiry.email}`,
    `Phone:    ${enquiry.phone || '-'}`,
    `About:    ${enquiry.subject}`,
    '',
    enquiry.message,
    '',
    `Reference: #${enquiry.id}`,
  ].join('\n');

  try {
    if (mail.isConfigured()) {
      await mail.send({ to: env.mail.to, subject: `Website message #${enquiry.id}`, text: body, replyTo: enquiry.email });
      await enquiry.update({ notifiedAt: new Date() });
    } else {
      console.warn(`[enquiries] #${enquiry.id} saved, but no email was sent because SMTP is not configured.`);
    }
  } catch (error) {
    console.error(`[enquiries] #${enquiry.id} saved, but sending email failed:`, error.message);
  }
  return enquiry;
};
