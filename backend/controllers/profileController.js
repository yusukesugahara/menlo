const Profile = require('../models/Profile');

const getProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.params.userId }).populate('user');
    if (!profile) {
      return res.status(404).json({ message: 'プロフィールが見つかりません。' });
    }
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: 'サーバーエラーが発生しました。' });
  }
};

const createProfile = async (req, res) => {
  const { bio } = req.body;
  try {
    const existingProfile = await Profile.findOne({ user: req.userId });
    if (existingProfile) {
      return res.status(400).json({ message: 'すでにプロフィールが作成されています。' });
    }

    const profile = new Profile({
      bio,
      user: req.userId,
    });

    await profile.save();
    res.status(201).json(profile);
  } catch (err) {
    res.status(500).json({ message: 'サーバーエラーが発生しました。' });
  }
};

const updateProfile = async (req, res) => {
  const { bio } = req.body;
  try {
    const profile = await Profile.findOneAndUpdate(
      { user: req.params.userId },
      { bio },
      { new: true }
    );
    if (!profile) {
      return res.status(404).json({ message: 'プロフィールが見つかりません。' });
    }
    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: 'サーバーエラーが発生しました。' });
  }
};

const deleteProfile = async (req, res) => {
  try {
    const profile = await Profile.findOneAndDelete({ user: req.params.userId });
    if (!profile) {
      return res.status(404).json({ message: 'プロフィールが見つかりません。' });
    }
    res.json({ message: 'プロフィールが削除されました。' });
  } catch (err) {
    res.status(500).json({ message: 'サーバーエラーが発生しました。' });
  }
};


module.exports = {
  getProfile,
  createProfile,
  updateProfile,
  deleteProfile,
}