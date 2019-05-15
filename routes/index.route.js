const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.status(404).json({ message: 'Api does not exist' });
})

module.exports = router;