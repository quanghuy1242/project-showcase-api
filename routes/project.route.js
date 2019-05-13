const express = require('express');

const Project = require('../models/project.model');

const router = express.Router();

router.get('/', async (req, res) => {
  const projects = await Project.find();
  res.json({projects: projects})
});

module.exports = router;