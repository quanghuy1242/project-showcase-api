const mongoose = require('mongoose');

let technologySchema = mongoose.Schema({
  nameId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true }
});

const Technology = mongoose.model("Technology", technologySchema);
module.exports = Technology;