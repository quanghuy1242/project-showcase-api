const express = require('express');
const mongoose = require('mongoose');

const Project = require('../models/project.model');

const router = express.Router();

router.get('/', async (req, res) => {
  const projects = await Project.find().sort({ date: 'descending' });
  res.json({ projects: projects });
});

router.get('/:id', async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) { return next(); }
  try {
    const project = await Project.findById(id);
    res.json({ project: project });
  } catch (error) {
    res.status(404).json({ message: 'Not Found' });
  }
});

module.exports = router;