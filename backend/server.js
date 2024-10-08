const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const postRoutes = require('./routes/postRoutes');
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');

dotenv.config();

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors({
  origin: ['https://menlo.vercel.app', 'http://localhost:3000']
}));
app.use(express.json());

// Routes
app.use('/api', postRoutes);
app.use('/api/auth', authRoutes); 
app.use('/api/profiles', profileRoutes);

// 404エラー対応ミドルウェア
app.use((req, res, next) => {
  res.status(404).json({ message: 'エンドポイントが存在しません' });
});

// エラーハンドリングミドルウェア
app.use((err, req, res, next) => {
  console.error(err.stack); // エラーログをコンソールに出力
  res.status(500).json({ message: 'サーバーエラーが発生しました' }); // 500エラーを返す
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
