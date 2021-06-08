const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests created from this IP, please try again after 15 minutes',
});

module.exports = limiter;
