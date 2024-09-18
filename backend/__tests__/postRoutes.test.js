const dotenv = require('dotenv');
dotenv.config({ path: '.env.test' });

const request = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const app = require('../server');
const Post = require('../models/post');
const User = require('../models/user');

let token;
let testUser;

beforeAll(async () => {
  testUser = new User({
    username: 'testuser',
    email: 'testuser@example.com',
    password: 'password123',
  });

  await testUser.save();

  token = jwt.sign(
    { userId: testUser._id },
    process.env.JWT_SECRET || 'your_jwt_secret',
    { expiresIn: '1h' }
  );
});

afterAll(async () => {
  await Post.deleteMany({});
  await User.deleteMany({});
  await mongoose.disconnect();
});

describe('POST /api/posts', () => {
  it('新しい投稿を作成して保存する', async () => {
    const newPost = {
      title: 'テスト投稿',
      content: 'これはテストの投稿です',
      keywords: ['test', 'jest'],
      author: testUser._id,
      likes: [],
    };

    const res = await request(app)
      .post('/api/posts')
      .set('Authorization', `Bearer ${token}`)
      .send(newPost);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('_id');

    const savedPost = await Post.findById(res.body._id);
    expect(savedPost).not.toBeNull();
    expect(savedPost.title).toBe(newPost.title);
    expect(savedPost.author.toString()).toBe(testUser._id.toString());
  });
});

describe('GET /api/posts', () => {
  it('すべての投稿を取得する', async () => {
    const res = await request(app).get('/api/posts');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
