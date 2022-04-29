const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    uname: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  },
  {
    collection: 'users_data', // if not provided it will be default while saving like 'users' when user.save()
  }
);

module.exports = mongoose.model('User', UserSchema);
