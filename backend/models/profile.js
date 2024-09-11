const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  bio: {
    type: String,
    maxlength: 500, // 最大500文字
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true, // インデックスを追加
  },
}, { timestamps: true });

module.exports = mongoose.model('Profile', ProfileSchema);
