const express = require('express');
const mongoose = require('mongoose');

const Project = require('../models/project.model');
const Technology = require('../models/technology.model'); // Cần để populate

const auth = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/', async (req, res) => {
  const { compact, query } = req.query; 
  const projects = await Project
    .find({
      ...(query) && { name: new RegExp(query, 'i') }
    })
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
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new Error('Can not find project with this id');
    }
    const project = await Project.findById(id).populate('technology');
    res.json({ project: project });
  } catch (error) {
    res.status(404).json({ message: 'Not Found' });
  }
});

router.post('/', auth.privateRoute, (req, res) => {
  const project = req.body.project;
  if (!Project.isValid({ _id: undefined, ...project })) {
    return res.status(400).json({ msg: 'Data is not valid' });
  }
  const newProject = new Project({
    ...project
  });
  newProject.save();
  return res.json({ msg: 'New Project is added to database' });
});

router.put('/:id', auth.privateRoute, async (req, res) => {
  const project = req.body.project;
  if (!Project.isValid({ ...project })) {
    return res.status(400).json({ msg: 'Data is not valid' });
  }
  const foundProject = await Project.findByIdAndUpdate(
    project._id, { $set: { ...project } }
  );
  if (!foundProject) {
    return res.status(404).json({ msg: `Project with provided id does not exist` })
  }
  return res.json({ msg: `The project with id ${project._id} is updated` })
});

router.delete('/:id', auth.privateRoute, async (req, res) => {
  const { _id } = req.body;
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return res.status(400).json({ msg: 'Data is not valid' });
  }
  const foundProject = await Project.findByIdAndDelete(_id);
  if (!foundProject) {
    return res.status(404).json({ msg: `Project with provided id does not exist` })
  }
  return res.json({ msg: `The project with id ${project._id} is deleted` });
})

module.exports = router;