const express = require('express');
const router = express.Router();
const { getAllChatBtwTwoUser, sendNewMessage } = require('../controllers/chatControllers');

router.get('/:senderId/:receiverId',getAllChatBtwTwoUser);
router.post('/',sendNewMessage)

module.exports = router;