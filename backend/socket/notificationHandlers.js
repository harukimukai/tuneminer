module.exports = (io, socket, activeUsers) => {
  const userId = socket.handshake.query.userId;
  console.log('userId in notificationHandlers', userId)

  if (userId) {
    activeUsers.set(userId, socket.id);
    console.log(`✅ User ${userId} is now connected with socket ${socket.id}`);
  }

  // 通知をクライアントに送るイベント（サーバー側の他の処理から emit する）
  socket.on('sendNotificationToUser', ({ recipientId, notification }) => {
    const recipientSocketId = activeUsers.get(recipientId.toString());
    if (recipientSocketId) {
      io.to(recipientSocketId).emit('newNotification', notification);
      console.log('📡 通知対象 recipientId:', recipientId.toString());
      console.log('🧾 現在の activeUsers:', Array.from(activeUsers.entries()));
    }
  });

  socket.on('disconnect', () => {
    if (userId) {
      activeUsers.delete(userId);
      console.log(`❌ User ${userId} disconnected`);
    }
  });
};
