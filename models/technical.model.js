const mongoose = require('mongoose');

let technicalSchema = mongoose.Schema({
  nameId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true }
});

const Technical = mongoose.model("Technical", technicalSchema);
module.exports = Technical;