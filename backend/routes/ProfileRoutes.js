const express = require('express');
const router = express.Router();
const {  getProfile, createProfile, updateProfile, deleteProfile,} = require('../controllers/postController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/:userId', getProfile);
router.post('/', authMiddleware, createProfile);
router.put('/:userId', authMiddleware, updateProfile);
router.delete('/:userId', authMiddleware, deleteProfile);


module.exports = router;
