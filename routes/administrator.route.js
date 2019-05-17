const express = require('express');

const Administrator = require('../models/administrator.model');

const router = express.Router();

router.get('/', async (req, res) => {
  const administrator = await Administrator.findOne({ displayName: 'quang-huy' });
  res.json({ administrator: administrator });
});

module.exports = router;