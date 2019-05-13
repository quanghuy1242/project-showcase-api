const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Does not exist' });
})

module.exports = router;