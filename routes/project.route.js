const express = require('express');

const Project = require('../models/project.model');

const router = express.Router();

router.get('/', async (req, res) => {
  const projects = await Project.find().sort({ date: 'descending' });
  res.json({ projects: projects });
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const project = await Project.findById(id);
    res.json({ project: project });
  } catch (error) {
    res.status(404).json({ message: 'Not Found' });
  }
});

module.exports = router;