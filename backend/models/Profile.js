const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  bio: {
    type: String,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Profile', profileSchema);
