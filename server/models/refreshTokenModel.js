const mongoose = require('mongoose');

const RefreshTokenSchema = mongoose.Schema(
  {
    refreshToken: { type: String, required: true },
  },
  {
    collection: 'user_refresh_token',
  }
);

module.exports = mongoose.model('RefreshToken', RefreshTokenSchema);
