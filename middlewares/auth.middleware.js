const verifyJwtToken = require('../utils/verifyJwtToken');
require('dotenv').config();

module.exports.privateRoute = async (req, res, next) => {
  const token = req.body.token || req.query.token || req.headers['x-access-token'];
  if (!token) {
    return res.status(403).json({ msg: 'No token provided.' })
  }
  try {
    const decoded = await verifyJwtToken(token, process.env.JWT_SECRET);
    req.decoded = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ msg: 'Unauthorized access.' });
  }
}