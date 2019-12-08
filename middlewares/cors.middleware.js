const cors = require('cors');

module.exports.corsHandling = cors((req, callback) => {
  const whitelist = process.env.ALLOW_ORIGIN.split(';');
  const clientAPIKey = req.header('CLIENT-KEY');
  callback(null, {
    origin: (origin, callback) => {
      if (whitelist.includes(origin) || clientAPIKey === process.env.CLIENT_KEY) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    optionsSuccessStatus: 200,
    credentials: true
  });
});