const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

router.get('/history/:userId', chatController.getAllChats);
router.get('/messages/:chatId', chatController.getMessagesByChatId);
router.post('/message/send', chatController.handleChatMessage);
router.post('/create', chatController.createChat);

module.exports = router;
