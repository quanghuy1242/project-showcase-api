const mongoose = require('mongoose');

let technologySchema = mongoose.Schema({
  nameId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true }
});

technologySchema.statics.isValid = function({
  _id, nameId, name, description, image
}) {
  if (!mongoose.Types.ObjectId.isValid(_id) && _id !== undefined) {
    return false;
  }
  if (!/[a-zA-Z]+/.test(nameId)) { return false; }
  if (!name.length !== 0) { return false; }
  if (!description.length !== 0) { return false; }
  if (!/(http|https):\/\/.+/.test(image)) { return false; }
  return true;
}

const Technology = mongoose.model("Technology", technologySchema);
module.exports = Technology;