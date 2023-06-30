const rateLimit = require('express-rate-limit');
const { logEvents } = require('./logger');

const loginLimiter = rateLimit({
  windowMs: 60 * 10000, // 1 minute
  max: 5,
  message: {
    message:
      'Too many login attempts from this IP, please try again after a 60 sec pause',
  },
  handler: (req, res, next, options) => {
    logEvents(
      `Too many Requests: ${options.message.message}\t${req.method}\t${req.url}\t${req.headers.origin}`,
      'errLog'
    );
    res.status(options.statusCode).send(options.message);
  },
  standardHeaders: true, // return rate limit info in the 'RateLimit' headers
  legacyHEaders: false,
});

module.exports = loginLimiter;
