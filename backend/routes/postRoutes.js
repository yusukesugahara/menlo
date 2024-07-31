const express = require('express');
const router = express.Router();
const { getPosts, createPost, getPostById } = require('../controllers/postController');

router.get('/posts', getPosts);
router.post('/posts', createPost);
router.get('/posts/:id', getPostById);

module.exports = router;
