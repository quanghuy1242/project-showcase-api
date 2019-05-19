const express = require('express');

const Project = require('../models/project.model');
const Technology = require('../models/technology.model');

const router = express.Router();

router.get('/', async (req, res) => {
  const technologies = await Technology.find().sort({ nameId: "ascending" });
  res.json({ technologies: technologies });
});

router.get('/:nameId', async (req, res, next) => {
  const { nameId } = req.params;
  try {
    const technology = await Technology.findOne({ nameId: nameId });
    if (!technology) { throw new Error('Can not found technology with this name Id'); }
    const projects = await Project.find({ technology: technology._id });
    res.json({ technology: {
      ...technology._doc,
      projects: projects
    } });
  } catch (error) {
    res.status(404).json({ message: 'Not Found' });
  }
});

module.exports = router;