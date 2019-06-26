const express = require('express');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const User = require('../models/user.model');

// const verifyUser = require('../utils/verifyUser');

const router = express.Router();

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username: username });
    if (!user) {
      return res.status(403).json({ msg: 'No user has that username!' });
    }
    if (user.checkPassword(password)) {
      const accessToken = jwt.sign(
        { username: username },
        process.env.JWT_SECRET, 
        { expiresIn: process.env.JWT_EXPIRATION }
      );
      const refreshToken = jwt.sign(
        { username: username },
        process.env.JWT_SECRET_RF, 
        { expiresIn: process.env.JWT_EXPIRATION_RF }
      );
      return res.json({ accessToken, refreshToken });
    } else {
      return res.status(403).json({ msg: 'Invalid Password!' });
    }
  } catch (error) {
    res.status(400).json({ msg: 'An error happened!' });
  }
});

// router.post('/register', async (req, res) => {
//   const { username, password } = req.body;
//   try {
//     const verifyStatus = verifyUser({ username, password });
//     if (!verifyStatus.isValid) {
//       return res.status(401).json(verifyStatus);
//     }
//     const user = await User.findOne({ username: username });
//     if (user) {
//       return res.status(404).json({ msg: 'User already exist!' });
//     }
//     const newUser = new User({
//       username: username,
//       password: password
//     });
//     newUser.save();
//     return res.json({ msg: 'Successfull' });
//   } catch (error) {
//     res.status(401).json({ msg: 'An error happened!' });
//   }
// });

module.exports = router;