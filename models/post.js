const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  user_id: mongoose.Schema.Types.ObjectId,
  title: String,
  content: String,
  photo: String,
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Post', postSchema);
