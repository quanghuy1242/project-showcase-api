const verifyJwtToken = require('../utils/verifyJwtToken');
require('dotenv').config();

module.exports.privateRoute = async (req, res, next) => {
  const token = req.signedCookies.accessToken;

  if (!token) {
    return res.status(403).json({ msg: 'No token provided.' })
  }

  try {
    const decoded = await verifyJwtToken(token, process.env.JWT_SECRET);
    req.decoded = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ msg: 'Unauthorized access.' });
    } else {
      return res.status(403).json({ msg: 'Invalid Token.' })
    }
  }
}