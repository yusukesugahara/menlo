const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    console.log('No token provided');  // トークンがない場合
    return res.status(401).json({ message: 'Authorization token missing' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    console.error('JWT verification failed:', err);  // JWTの検証エラーをログに出力
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = authMiddleware;