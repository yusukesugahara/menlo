const Profile = require('../models/profile'); 
const User = require('../models/user');

const getProfile = async (req, res) => {
  try {
    const userprofile = await Profile.findOne({ user: req.params.userId }).populate('user');
    if (!userprofile) {
      return res.status(404).json({ message: 'プロフィールが見つかりません。' });
    }
    res.json(userprofile);
  } catch (err) {
    res.status(500).json({ message: 'サーバーエラーが発生しました。' });
  }
};

const updateProfile = async (req, res) => {
  const { bio,username } = req.body;
  try {
    const existingUser = await User.findOne({ username, _id: { $ne: req.params.userId } });
    if (existingUser) {
      return res.status(400).json({ message: 'そのユーザー名は既に使用されています。' });
    }


    const userprofile = await Profile.findOneAndUpdate(
      { user: req.params.userId },
      { bio },
      { new: true }
    );
    if (!userprofile) {
      return res.status(404).json({ message: 'プロフィールが見つかりません。' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.userId, 
      { username },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'ユーザーが見つかりません。' });
    }

    res.json({ userprofile, user , message: 'プロフィールを更新しました。'});
  } catch (err) {
    res.status(500).json({ message: 'サーバーエラーが発生しました。' });
  }
};

const deleteProfile = async (req, res) => {
  try {
    const userprofile = await Profile.findOneAndDelete({ user: req.params.userId });
    if (!userprofile) {
      return res.status(404).json({ message: 'プロフィールが見つかりません。' });
    }
    res.json({ message: 'プロフィールが削除されました。' });
  } catch (err) {
    res.status(500).json({ message: 'サーバーエラーが発生しました。' });
  }
};


module.exports = {
  getProfile,
  updateProfile,
  deleteProfile,
}