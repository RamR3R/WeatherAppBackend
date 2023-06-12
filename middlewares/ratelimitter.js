const { rateLimit} = require("express-rate-limit");

const apiLimiter = rateLimit({
	windowMs: 3 * 60 * 1000, // 3 minutes
	max: 1, // Limit each IP to 1 requests per `window` (here, per 3 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

module.exports = apiLimiter;
