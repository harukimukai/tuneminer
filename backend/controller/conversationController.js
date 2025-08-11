// controllers/conversationController.js
const Conversation = require('../model/Conversation')
const Message = require('../model/Message')
const asyncHandler = require('express-async-handler')

const createConversation = asyncHandler(async (req, res) => {
  const { recipientId } = req.body
  const userId = req._id

  // すでに会話があるかチェック
  let conversation = await Conversation.findOne({
    participants: { $all: [userId, recipientId] }
  })

  if (!conversation) {
    conversation = await Conversation.create({
      participants: [userId, recipientId]
    })
  }

  res.status(201).json(conversation)
})

const getUserConversations = asyncHandler(async (req, res) => {
  const userId = req._id

  const conversations = await Conversation.find({ participants: userId })
    .populate('participants', 'username icon')
    .populate('lastMessage.sender', 'username icon')

  res.json(conversations)
})

const getConversationById = asyncHandler(async (req, res) => {
  const conversation = await Conversation.findById(req.params.id)
    .populate('participants', 'username icon')

  if (!conversation) return res.status(404).json({ message: 'Conversation not found' })

  res.json(conversation)
})

// すでにある会話を探す
const findConversationWithUser = asyncHandler(async (req, res) => {
    const currentUserId = req.user._id   // verifyJWTミドルウェアでセットされる
    const otherUserId = req.params.userId
  
    if (!currentUserId || !otherUserId) {
      return res.status(400).json({ message: 'Missing user IDs' })
    }
  
    const conversation = await Conversation.findOne({
      participants: { $all: [currentUserId, otherUserId] }
    }).populate('participants', 'username icon')  // ついでに相手の情報も取れる！
  
    if (!conversation) {
      return res.status(404).json({ message: 'No conversation found' })
    }
  
    res.json(conversation)
})

const getUnreadCounts = asyncHandler(async (req, res) => {
    const userId = req._id

    const unreadCounts = await Message.aggregate([
        {
            $match: {
                read: false,
                sender: { $ne: userId } // 自分が送ったやつを省く
            }
        },
        {
            $group: {
            _id: '$conversationId',
            count: { $sum: 1 }}
        }
    ])

    const countsMap = {}
    unreadCounts.forEach(item => {
        countsMap[item._id.toString()] = item.count
    })
    
    res.json(countsMap)
})

module.exports = {
  createConversation,
  getUserConversations,
  getConversationById,
  findConversationWithUser,
  getUnreadCounts
}
