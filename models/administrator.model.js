const mongoose = require('mongoose');

let administratorSchema = mongoose.Schema({
  username: { type: String, required: true, unique: true },
  displayName: { type: String, required: true },
  name: { type: String, required: true },
  image: { type: String, required: true },
  slogan: { type: String, required: true },
  introduction: { type: String, required: true },
  skill: { type: String, required: true },
  contact: { type: String, required: true },
  facebook: { type: String },
  twitter: { type: String },
  instagram: { type: String },
  wordpress: { type: String },
  github: { type: String }
});

administratorSchema.statics.isValid = function(
  { username, name, image, slogan, introduction, contact }
) {
  if (!/[a-z0-9]+/.test(username)) { return false; }
  if (!name.length) { return false; }
  if (!slogan.length) { return false; }
  if (!introduction.length) { return false; }
  if (!contact.length) { return false; }
  if (!/(http|https):\/\/.+/.test(image)) { return false; }
  return true;
}

const Administrator = mongoose.model("Administrator", administratorSchema);
module.exports = Administrator;