const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const postRoutes = require('./routes/postRoutes');
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');

dotenv.config();

const app = express();

connectDB();

app.use(
  cors({
    origin: ['https://menlo.vercel.app', 'http://localhost:3000'],
  })
);
app.use(express.json());

app.use('/api', postRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/profiles', profileRoutes);

app.use((req, res, next) => {
  res.status(404).json({ message: 'エンドポイントが存在しません' });
});


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'サーバーエラーが発生しました' });
});

module.exports = app;

if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
