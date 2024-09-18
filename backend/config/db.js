const dotenv = require('dotenv');
dotenv.config({ path: '.env.test' }); // テスト環境用の.envファイルを読み込む

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI =
      process.env.NODE_ENV === 'test' ? process.env.MONGO_URI_TEST : process.env.MONGO_URI;

    console.log(`Connecting to MongoDB at ${mongoURI}`); // デバッグ用

    await mongoose.connect(mongoURI);
    console.log('MongoDB connected');
  } catch (err) {
    console.error(err.message);
    if (process.env.NODE_ENV !== 'test') {
      process.exit(1);
    }
  }
};

module.exports = connectDB;
