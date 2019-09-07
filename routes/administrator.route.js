const express = require('express');

const Administrator = require('../models/administrator.model');

const auth = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/', async (req, res) => {
  const administrator = await Administrator.findOne({ username: 'quanghuy1242' });
  res.json({ administrator: administrator });
});

router.put('/:username', auth.privateRoute, async (req, res) => {
  const { username } = req.params;
  const info = (({ username, ...rest }) => ({...rest}))(req.body.info); // Không cập nhật username
  if (!Administrator.isValid(info)) {
    return res.status(400).json({ msg: 'Data is not valid' });
  }
  const foundInfo = await Administrator.findOneAndUpdate(
    { username: username },
    { $set: { ...info } }
  );
  if (!foundInfo) {
    return res.status(404).json({ msg: `Data with provided username does not exist` })
  }
  return res.json({ msg: `The information of username ${username} is updated` })
});

module.exports = router;