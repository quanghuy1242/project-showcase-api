const express = require('express');

const Technology = require('../models/technology.model');

const router = express.Router();

router.get('/', async (req, res) => {
  const technologies = await Technology.find().sort({ nameId: "ascending" });
  res.json({ technologies: technologies });
});

module.exports = router;