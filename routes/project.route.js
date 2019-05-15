const express = require('express');
const mongoose = require('mongoose');

const Project = require('../models/project.model');
const Technical = require('../models/technical.model'); // Cần để populate

const router = express.Router();

router.get('/', async (req, res) => {
  const projects = await Project.find()
    .sort({ date: 'descending' })
    .populate('technical');
  res.json({ projects: projects });
});

router.get('/:id', async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) { return next(); }
  try {
    const project = await Project.findById(id).populate('technical');
    res.json({ project: project });
  } catch (error) {
    res.status(404).json({ message: 'Not Found' });
  }
});

router.get('/search', async (req, res) => {
  const { query } = req.query;
  const projects = await Project.find({ name: new RegExp(query, 'i') })
    .sort({ date: 'descending' })
    .populate('technical');
  res.json({ projects: projects });
})

module.exports = router;