const Message = require('../model/Message')
const User = require('../model/User')
const Conversation = require('../model/Conversation')
const asyncHandler = require('express-async-handler')

// メッセージ一覧取得（会話IDベース）
const getMessagesByConversationId = asyncHandler(async (req, res) => {
  const { conversationId } = req.params
  if (!conversationId) return res.status(400).json({ message: 'Conversation ID required' })

  const messages = await Message
    .find({ conversationId })
    .sort({ createdAt: 1 })
    .populate('sender', 'username icon')
    .lean()

  if (!messages) return res.status(404).json({ message: 'No messages found' })

  res.json(messages)
})


// メッセージ送信
const sendMessage = asyncHandler(async (req, res) => {
  const { conversationId, senderId, text } = req.body

  if (!conversationId) {
    return res.status(400).json({ message: 'Missing convId' })
  } else if (!senderId) {
    return res.status(400).json({ message: 'Missing senderId' })
  } else if (!text) {
    return res.status(400).json({ message: 'Missing text' })
  }

    const message = await Message.create({
      conversationId,
      sender: senderId,
      content: text,
    })

    const conversation = await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: {
        text,
        sender: senderId,
        timestamp: new Date()
      }
    })

    const senderUser = await User.findById(senderId).select('username icon')

    res.status(201).json({
      _id: message._id,
      content: message.content,
      sender: {
        _id: senderUser._id,
        username: senderUser.username,
        icon: senderUser.icon,
      },
      timestamp: message.timestamp,
      conversationId,
    })
})

// ✅ 既読処理
const markMessagesAsRead = asyncHandler(async (req, res) => {
  const { conversationId } = req.params;
  const userId = req.user._id;

  if (!conversationId) {
    return res.status(400).json({ message: 'Missing conversationId' });
  }

  // 自分以外が送った、かつ未読のメッセージをまとめて既読に
  await Message.updateMany(
    {
      conversationId,
      sender: { $ne: userId }, // 自分以外が送ったメッセージだけ
      read: false
    },
    { $set: { read: true } }
  );

  res.status(200).json({ message: 'Messages marked as read' });
});


module.exports = {
  getMessagesByConversationId,
  sendMessage,
  markMessagesAsRead
}
