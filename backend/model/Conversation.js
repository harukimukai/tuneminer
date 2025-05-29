const mongoose = require('mongoose')

const conversationSchema = new mongoose.Schema({
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  lastMessage: {
    text: String,
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    timestamp: Date
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Conversation', conversationSchema)

