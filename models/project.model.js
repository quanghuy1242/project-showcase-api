const mongoose = require('mongoose');

let projectSchema = mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  technical: { type: String, required: true },
  date: { type: Date, required: true, default: Date.now },
  image: { type: String, required: true },
  url: { type: String, required: true },
  screenshots: { type: [String] }
});

let Project = mongoose.model("Project", projectSchema);
module.exports = Project;