const express = require('express')
const router = express.Router()
const messageController = require('../controller/messageController')
const verifyJWT = require('../middleware/verifyJWT')

router.use(verifyJWT) // 全ルートで認証必須

router.route('/conversation/:conversationId')
    .get(messageController.getMessagesByConversationId)

// ✅ メッセージ送信
router.post('/', messageController.sendMessage)

// read = true
router.route('/read/:conversationId')
    .patch(messageController.markMessagesAsRead)

module.exports = router
