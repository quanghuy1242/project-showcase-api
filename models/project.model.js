const mongoose = require('mongoose');

let projectSchema = mongoose.Schema({
  name: { type: String, required: true },
  briefDescription: { type: String, required: true },
  description: { type: String, required: true },
  technology: { type: mongoose.Schema.Types.ObjectId, ref: 'Technology', required: true },
  date: { type: Date, required: true, default: Date.now },
  image: { type: String, required: true },
  url: { type: String, required: true },
  screenshots: { type: [String] }
});

projectSchema.statics.isValid = function({
  _id, name, briefDescription, description, technology, date, image, url, screenshots
}) {
  if (!mongoose.Types.ObjectId.isValid(_id) && _id !== undefined) {
    return false;
  }
  if (!/.+/.test(name) && !/.+/.test(briefDescription) && !/.+/.test(description)) {
    return false;
  }
  if (!mongoose.Types.ObjectId.isValid(technology)) {
    return false;
  }
  if (!/(http|https):\/\/.+/.test(image) && !/(http|https):\/\/.+/.test(url)) {
    return false;
  }
  if (!(date instanceof Date)) { return false; }
  if (!screenshots.length) {  }
  return true;
};

let Project = mongoose.model("Project", projectSchema);
module.exports = Project;