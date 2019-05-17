const mongoose = require('mongoose');

let administratorSchema = mongoose.Schema({
  displayName: { type: String, required: true },
  name: { type: String, required: true },
  image: { type: String, required: true },
  slogan: { type: String, required: true },
  introduction: { type: String, required: true },
  skill: { type: String, required: true },
  contact: { type: String, required: true }
});

const Administrator = mongoose.model("Administrator", administratorSchema);
module.exports = Administrator;