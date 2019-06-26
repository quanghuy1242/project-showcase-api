const express = require('express');
const jwt = require('jsonwebtoken');
const rd = require('../redis_connect/rd');
const verifyJwtToken = require('../utils/verifyJwtToken');
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

      rd.client.set(refreshToken, JSON.stringify({ username: username })); // Store refresh token

      return res.json({ accessToken, refreshToken });
    } else {
      return res.status(403).json({ msg: 'Invalid Password!' });
    }
  } catch (error) {
    res.status(400).json({ msg: 'An error happened!' });
  }
});

router.post('/refresh_token', async (req, res) => {
  const { refreshToken } = req.body;
  try {
    if (refreshToken && (await rd.client.existsAsync(refreshToken))) {
      await verifyJwtToken(refreshToken, process.env.JWT_SECRET_RF); // Kiểm tra refreshToken

      const user = JSON.parse(await rd.client.getAsync(refreshToken)); // Lấy từ redis, thông tin user

      // Nếu refreshToken valid và nó chưa hết hạn
      const accessToken = jwt.sign(
        { username: user.username },
        process.env.JWT_SECRET, 
        { expiresIn: process.env.JWT_EXPIRATION }
      );
      return res.json({ accessToken }); // Response accessToken mới
    } else {
      res.status(400).json({ msg: 'Bad Request' });
    }
  } catch (error) {
    res.status(403).json({ msg: 'Invalid or Expired Refresh Token' });
  }
})

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

// router.get('/redis', async (req, res) => {
//   // rd.client.keys('*', (err, keys) => {
//   //   res.json(keys);
//   // })
//   // const a = await rd.client.getAsync(undefined);
//   // res.json(a);
//   // const b = await rd.client.existsAsync('a');
//   // res.json({ exists: b });
// })

module.exports = router;