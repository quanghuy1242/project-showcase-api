const verifyJwtToken = require('../utils/verifyJwtToken');
require('dotenv').config();

module.exports.privateRoute = async (req, res, next) => {
  let token = req.headers['authorization'] || req.headers['x-access-token'];
  
  if (!token) {
    return res.status(403).json({ msg: 'No token provided.' })
  }

  if (token.startsWith('Bearer ')) { token = token.slice(7); }

  try {
    const decoded = await verifyJwtToken(token, process.env.JWT_SECRET);
    req.decoded = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ msg: 'Unauthorized access.' });
  }
}