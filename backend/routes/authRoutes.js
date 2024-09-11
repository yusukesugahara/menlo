const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Profile = require('../models/profile'); 

const router = express.Router();

router.post('/signup', async (req, res) => {
  let { username, email, password } = req.body;

  email = email.trim();
  password = password.trim();

  if (!username || !email || !password) {
    return res.status(400).json({ message: '全てのフィールドを入力してください。' });
  }

  try {   
     const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: 'ユーザー名またはメールアドレスは既に使用されています。' });
    }
 
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Hashed password during signup:', hashedPassword);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });
   
    await newUser.save();

    console.log(newUser._id)

   const newProfile = new Profile({
    user: newUser._id,
    bio: '',
  });

  await newProfile.save();

    res.status(201).json({ message: 'ユーザー登録が完了しました。' });

  } catch (err) {
    console.error('サインアップエラー:', err.message);
    res.status(500).json({ message: 'ユーザー登録に失敗しました。' });
  }
});


router.post('/login', async (req, res) => {
  let { email, password } = req.body;

  email = email.trim();
  password = password.trim();

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.error('User not found:', email);
      return res.status(401).json({ message: '無効なユーザー名またはパスワードです。' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('Is password valid:', isPasswordValid);
    if (!isPasswordValid) {
      console.error('Invalid password for user:', email);
      return res.status(401).json({ message: '無効なユーザー名またはパスワードです。' });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });
    res.json({ token, userId: user._id});
  } catch (err) {
    console.error('ログインエラー:', err);
    res.status(500).json({ message: 'ログインに失敗しました。' });
  }
});


module.exports = router;
