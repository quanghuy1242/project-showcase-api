const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const SALT_FACTOR = 10;

let userSchema = mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  role: String
});

userSchema.pre('save', function(done) {
  let user = this;
  if (!user.isModified("password")) {
    return done();
  }
  bcrypt.genSalt(SALT_FACTOR, (err, salt) => {
    if (err) { return done(err); }
    bcrypt.hash(user.password, salt, () => {}, (err, hashPassword) => {
      if (err) { return done(err); }
      user.password = hashPassword;
      done();
    });
  })
});

userSchema.methods.checkPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
}

const User = mongoose.model("User", userSchema);
module.exports = User;