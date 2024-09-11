const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, deleteProfile,} = require('../controllers/profileController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/:userId', getProfile);
router.put('/:userId', authMiddleware, updateProfile);
router.delete('/:userId', authMiddleware, deleteProfile);


module.exports = router;