const express = require('express');

const Administrator = require('../models/administrator.model');

const router = express.Router();

router.get('/', async (req, res) => {
  const administrator = await Administrator.findOne({ username: 'quanghuy1242' });
  res.json({ administrator: administrator });
});

module.exports = router;