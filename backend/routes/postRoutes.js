const express = require('express');
const router = express.Router();
const { getPosts, createPost, getPostById, updatePost } = require('../controllers/postController');


router.get('/posts', getPosts);
router.post('/posts', createPost);
router.get('/posts/:id', getPostById);
router.put('/posts/:id', updatePost);

module.exports = router;
