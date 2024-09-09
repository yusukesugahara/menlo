const express = require('express');
const router = express.Router();
const { getPosts, createPost, getPostById, updatePost, deletePost,getUserPosts,likePost,unlikePost,getPostsByAuthor,getKeywordStatistics,searchPosts} = require('../controllers/postController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/posts', getPosts);
router.post('/posts', authMiddleware, createPost);
router.get('/posts/:id', getPostById);
router.put('/posts/:id',authMiddleware,  updatePost);
router.delete('/posts/:id',authMiddleware, deletePost)
router.get('/user-page', authMiddleware, getUserPosts);

router.post('/posts/:id/like', authMiddleware, likePost);
router.post('/posts/:id/unlike', authMiddleware, unlikePost);

router.get('/author/:authorId', getPostsByAuthor);

router.get('/keywords/statistics', getKeywordStatistics);
router.get('/search', searchPosts);

module.exports = router;
