// routes/conversationRoutes.js
const express = require('express')
const router = express.Router()
const conversationController = require('../controller/conversationController')
const verifyJWT = require('../middleware/verifyJWT')

router.use(verifyJWT)

router.route('/')
    .post(conversationController.createConversation)       // 新規会話を開始
    .get(conversationController.getUserConversations)     // 自分の会話一覧

router.route('/unread-counts')
    .get(conversationController.getUnreadCounts)

router.route('/find/:userId')
    .get(conversationController.findConversationWithUser)

router.route('/:id')
    .get(conversationController.getConversationById)      // 会話詳細を取得

module.exports = router
