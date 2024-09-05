const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.'], // メールアドレスの形式をチェック
  },
  password: {
    type: String,
    required: true,
  },
});


module.exports = mongoose.model('User', UserSchema);
