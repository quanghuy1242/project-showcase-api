const express = require('express');
const jwt = require('jsonwebtoken');
const verifyJwtToken = require('../utils/verifyJwtToken');
require('dotenv').config();

const User = require('../models/user.model');

// const verifyUser = require('../utils/verifyUser');
const auth = require('../middlewares/auth.middleware');
const cookieOptions = {
  httpOnly: true,
  expires: new Date(Date.now() + 2592000000), // Một tháng
  signed: true,
  secure: process.env.PRODUCTION ? true : false
}

const router = express.Router();

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  let refreshToken = null;
  try {
    const user = await User.findOne({ username: username }); // Tìm user này
    if (!user) {
      return res.status(403).json({ msg: 'No user has that username!' });
    }
    if (!user.checkPassword(password)) {
      return res.status(403).json({ msg: 'Invalid Password!' });
    }
    let hasToken = false;
    if (user.refreshToken) {
      try { // đi verify token này
        await verifyJwtToken(user.refreshToken, process.env.JWT_SECRET_RF);
        hasToken = true; // Nếu token hợp lệ
      } catch (err) { hasToken = false; } // Nếu token hết hạn
    } else { hasToken = false; }
    if (hasToken) refreshToken = user.refreshToken;
    else {
      // Nếu chưa có thì tạo mới một cái rồi lưu nó vô db
      refreshToken = jwt.sign( // Tạo mới refreshToken
        { username: username },
        process.env.JWT_SECRET_RF, 
        { expiresIn: process.env.JWT_EXPIRATION_RF }
      );
      await User.findOneAndUpdate( // lưu nó vô db
        { username: username },
        { $set: { refreshToken: refreshToken } }
      );
    }
    const accessToken = jwt.sign(
      { username: username },
      process.env.JWT_SECRET, 
      { expiresIn: process.env.JWT_EXPIRATION }
    );
    // trả dữ liệu về client
    res.cookie('accessToken', accessToken, cookieOptions);
    res.cookie('refreshToken', refreshToken, cookieOptions);
    return res.json({ msg: 'Login Successfully' });
  } catch (error) {
    console.log(error);
    res.status(400).json({ msg: 'An error happened!' });
  }
});

router.post('/refresh_token', async (req, res) => {
  const refreshToken = req.signedCookies.refreshToken;
  try {
    const user = await User.findOne({ refreshToken: refreshToken });
    if (refreshToken && user) { // Nếu request có chứa refreshToken và refreshToken có trong db
      await verifyJwtToken(refreshToken, process.env.JWT_SECRET_RF); // Kiểm tra refreshToken

      // Nếu refreshToken valid và nó chưa hết hạn thì trả về hai token mới
      // Nếu để lâu quá mà user không request cái gì thì refreshToken sẽ hết hạn luôn
      // Lúc đó thì trời cứu, chỉ có nước đăng nhập lại
      const accessToken = jwt.sign(
        { username: user.username },
        process.env.JWT_SECRET, 
        { expiresIn: process.env.JWT_EXPIRATION }
      );
      const newRefreshToken = jwt.sign(
        { username: user.username },
        process.env.JWT_SECRET_RF, 
        { expiresIn: process.env.JWT_EXPIRATION_RF }
      );

      // cập nhật lại refreshToken mới này vào db
      await User.findOneAndUpdate(
        { username: user.username },
        { $set: { refreshToken: newRefreshToken } }
      ); 
      
      // Response accessToken và refreshToken mới
      res.cookie('accessToken', accessToken, cookieOptions);
      res.cookie('refreshToken', newRefreshToken, cookieOptions);
      return res.json({ msg: 'Refresh token is successfully' });
    } else {
      res.status(400).json({ msg: 'Bad Request' });
    }
  } catch (error) {
    res.status(403).json({ msg: 'Invalid or Expired Refresh Token' });
  }
});

router.post('/isAuthenticated', auth.privateRoute, (req, res) => {
  res.json({ isAuthenticated: true });
});

router.post('/logout', async (req, res) => {
  // Chỉ những request chứa token hợp lệ mới được logout
  const accessToken = req.signedCookies.accessToken;
  let isValid = undefined;
  if (!accessToken) { isValid = false; } 
  else {
    try {
      await verifyJwtToken(accessToken, process.env.JWT_SECRET);
      isValid = true;
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        isValid = true;
      } else { isValid = false; }
    }
  }
  if (isValid) {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.json({ msg: 'Logout Successfully' });
  } else {
    res.json({ msg: 'Invalid Token.' });
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