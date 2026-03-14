const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  phone: String,
  address: String,
  bio: { type: String, default: '' },
  profession: { type: String, default: '' },
  healthTopics: { type: [String], default: [] },
  profilePicture: { type: String, default: '' },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
