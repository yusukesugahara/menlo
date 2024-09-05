const express = require('express');
const router = express.Router();
const { getPosts, createPost, getPostById, updatePost, deletePost,getUserPosts} = require('../controllers/postController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/posts', getPosts);
router.post('/posts', authMiddleware, createPost);
router.get('/posts/:id', getPostById);
router.put('/posts/:id',authMiddleware,  updatePost);
router.delete('/posts/:id',authMiddleware, deletePost)
router.get('/user-page', authMiddleware, getUserPosts);


module.exports = router;
