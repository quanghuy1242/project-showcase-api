const express = require('express');
const mongoose = require('mongoose');

const Project = require('../models/project.model');
const Technology = require('../models/technology.model'); // Cần để populate

const router = express.Router();

router.get('/', async (req, res) => {
  const { compact } = req.query;
  const projects = await Project.find()
    .sort({ date: 'descending' })
    .populate('technology');
  res.json({
    projects: compact
      ? projects.map(project => ({
          _id: project._id, 
          name: project.name,
          date: project.date,
          image: project.image
      }))
      : projects
  });
});

router.get('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) { throw new Error('Can not find project with this id'); }
    const project = await Project.findById(id).populate('technology');
    res.json({ project: project });
  } catch (error) {
    res.status(404).json({ message: 'Not Found' });
  }
});

router.get('/search', async (req, res) => {
  const { query, compact } = req.query;
  const projects = await Project.find({ name: new RegExp(query, 'i') })
    .sort({ date: 'descending' })
    .populate('technology');
    res.json({
      projects: compact
        ? projects.map(project => ({
            _id: project._id, 
            name: project.name,
            date: project.date,
            image: project.image
        }))
        : projects
    });
})

module.exports = router;