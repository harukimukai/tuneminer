// listeners/notificationListener.js
const eventBus = require('../utils/eventBus')
const Notification = require('../model/Notification')

let isNotificationListenerInitialized = false

module.exports = (io, activeUsers) => {
  if (isNotificationListenerInitialized) return
  isNotificationListenerInitialized = true

  eventBus.on('commentCreated', async({ recipientId, senderId, songId, content }) => {
    if (recipientId.toString() === senderId.toString()) {
      return
    }
    try {
      const notification = await Notification.create({
        recipient: recipientId,
        sender: senderId,
        type: 'comment',
        content,
        link: `/songs/modal/${songId}`
      })

      const recipientSocketId = activeUsers.get(recipientId.toString())
      if (recipientSocketId){
        io.to(recipientSocketId).emit('newNotification', notification); 
      }
    } catch (err) {
      console.error('Error (commentNotification) :', err.message)
    }
  })

  eventBus.on('follow', async({ recipientId, senderId, content }) => {
    if (recipientId.toString() === senderId.toString()) {
      return
    }
    try {
      const notification = await Notification.create({
        recipient: recipientId,
        sender: senderId,
        type: 'follow',
        content,
        link: `/users/${senderId}`
      })

      // Socket で通知を送る
      const recipientSocketId = activeUsers.get(recipientId.toString())
      if (recipientSocketId){
        io.to(recipientSocketId).emit('newNotification', notification);
      }
    } catch (err) {
      console.error('Error (followNotification) :', err.message)
    }
  })

  eventBus.on('like', async({ recipientId, senderId, content, songId }) => {
    if (recipientId.toString() === senderId.toString()) {
      return
    }
    try {
      const notification = await Notification.create({
        recipient: recipientId,
        sender: senderId,
        type: 'like',
        content,
        link: `/songs/modal/${songId}`
      })

      const recipientSocketId = activeUsers.get(recipientId.toString())
      if (recipientSocketId){
        io.to(recipientSocketId).emit('newNotification', notification)
      }
    } catch (err) {
      console.error('Error (likeNotification) :', err.message)
    }
  })

  eventBus.on('addSongPlaylist', async({ recipientId, senderId, content, playlistId }) => {
    if (recipientId.toString() === senderId.toString()) {
      return
    }
    try {
      const notification = await Notification.create({
        recipient: recipientId,
        sender: senderId,
        type: 'addSongList',
        content,
        link: `/playlists/${playlistId}`
      })

      const recipientSocketId = activeUsers.get(recipientId.toString())
      if (recipientSocketId){
        io.to(recipientSocketId).emit('newNotification', notification) 
      }
    } catch (err) {
      console.error('Error (playlistNotification) :', err.message)
    }
  })
}

// 今後他のイベントも追加可能:
// eventBus.on('liked', ...)
