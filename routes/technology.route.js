const express = require('express');
const mongoose = require('mongoose');

const Project = require('../models/project.model');
const Technology = require('../models/technology.model');

const auth = require('../middlewares/auth.middleware');

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

router.post('/', auth.privateRoute, (req, res) => {
  const tech = req.body.tech;
  if (!Technology.isValid({ _id: undefined, ...tech })) {
    return res.status(400).json({ msg: 'Data is not valid' });
  }
  (new Technology({ ...tech })).save();
  return res.json({ msg: 'New Technology is added to database' });
});

router.put('/:nameId', auth.privateRoute, async (req, res) => {
  const tech = req.body.tech;
  const { nameId } = req.params;
  if (!Technology.isValid({ ...tech })) {
    return res.status(400).json({ msg: 'Data is not valid' });
  }
  const foundTech = await Technology.findOneAndUpdate(
    { nameId: nameId }, { $set: { ...tech } }
  );
  if (!foundTech) {
    return res.status(404).json({ msg: `Technology with provided id does not exist` });
  }
  return res.json({ msg: `The Technology with id ${tech._id} is updated` });
});

router.delete('/:id', auth.privateRoute, async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ msg: 'Data is not valid' });
  }
  const foundTech = await Technology.findByIdAndDelete(id);
  if (!foundTech) {
    return res.status(404).json({ msg: `Technology with provided id does not exist` });
  }
  return res.json({ msg: `The Technology with id ${id} is deleted` });
});

module.exports = router;