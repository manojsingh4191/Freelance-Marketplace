const express = require('express');
const router = express.Router();
const { getConversations, getMessages } = require('../controllers/messageController');
const { protect } = require('../middleware/auth');

// @route   GET /api/messages/conversations
// @desc    Get all active conversations for the current user
// @access  Private
router.get('/conversations', protect, getConversations);

// @route   GET /api/messages/:roomId
// @desc    Get all messages for a specific room
// @access  Private
router.get('/:roomId', protect, getMessages);

module.exports = router;
