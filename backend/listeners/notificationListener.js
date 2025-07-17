// listeners/notificationListener.js
const eventBus = require('../utils/eventBus')
const Notification = require('../model/Notification')

eventBus.on('commentCreated', async ({ recipientId, senderId, songId, content }) => {
  try {
    await Notification.create({
      recipient: recipientId,
      sender: senderId,
      type: 'comment',
      content,
      link: `/songs/modal/${songId}`
    })
  } catch (err) {
    console.error('通知作成エラー(comment) :', err.message)
  }
})

// 今後他のイベントも追加可能:
// eventBus.on('followed', ...)
// eventBus.on('liked', ...)
