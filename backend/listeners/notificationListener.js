// listeners/notificationListener.js
const eventBus = require('../utils/eventBus')
const Notification = require('../model/Notification')

let isNotificationListenerInitialized = false

module.exports = (io, activeUsers) => {
  if (isNotificationListenerInitialized) return
  isNotificationListenerInitialized = true

  eventBus.on('commentCreated', async({ recipientId, senderId, songId, content }) => {
    console.log('📣 commentCreated イベント受信:', { recipientId, senderId, songId, content });
    try {
      const notification = await Notification.create({
        recipient: recipientId,
        sender: senderId,
        type: 'comment',
        content,
        link: `/songs/modal/${songId}`
      })

      console.log('✅ 通知作成完了:', notification);

      // Socket で通知を送る
      const recipientSocketId = activeUsers.get(recipientId.toString())
      console.log('📡 通知対象のSocket ID:', recipientSocketId);
      if (recipientSocketId){
        io.to(recipientSocketId).emit('newNotification', notification); // 必要に応じて null 安全演算子
        console.log('📤 通知をSocketで送信');
      }
    } catch (err) {
      console.error('通知作成エラー(comment) :', err.message)
    }
  })

  eventBus.on('follow', async({ recipientId, senderId, content }) => {
    console.log('📣 follow イベント受信:', { recipientId, senderId, content });
    try {
      const notification = await Notification.create({
        recipient: recipientId,
        sender: senderId,
        type: 'follow',
        content,
        link: `/users/${senderId}`
      })

      console.log('✅ 通知作成完了:', notification);

      // Socket で通知を送る
      const recipientSocketId = activeUsers.get(recipientId.toString())
      console.log('📡 通知対象のSocket ID:', recipientSocketId);
      if (recipientSocketId){
        io.to(recipientSocketId).emit('newNotification', notification); // 必要に応じて null 安全演算子
        console.log('📤 通知をSocketで送信');
      }
    } catch (err) {
      console.error('通知作成エラー(comment) :', err.message)
    }
  })

  eventBus.on('like', async({ recipientId, senderId, content, songId }) => {
    console.log('📣 like イベント受信:', { recipientId, senderId, content, songId });
    try {
      const notification = await Notification.create({
        recipient: recipientId,
        sender: senderId,
        type: 'like',
        content,
        link: `/songs/modal/${songId}`
      })

      console.log('✅ 通知作成完了:', notification);

      // Socket で通知を送る
      const recipientSocketId = activeUsers.get(recipientId.toString())
      console.log('📡 通知対象のSocket ID:', recipientSocketId);
      if (recipientSocketId){
        io.to(recipientSocketId).emit('newNotification', notification) // 必要に応じて null 安全演算子
        console.log('📤 通知をSocketで送信');
      }
    } catch (err) {
      console.error('通知作成エラー(comment) :', err.message)
    }
  })
}

// 今後他のイベントも追加可能:
// eventBus.on('liked', ...)
