module.exports = (io, socket, activeUsers) => {
  const userId = socket.handshake.query.userId

  if (userId) {
    activeUsers.set(userId, socket.id);
  }

  socket.on('sendNotificationToUser', ({ recipientId, notification }) => {
    const recipientSocketId = activeUsers.get(recipientId.toString());
    if (recipientSocketId) {
      io.to(recipientSocketId).emit('newNotification', notification);
    }
  });

  socket.on('disconnect', () => {
    if (userId) {
      activeUsers.delete(userId);
    }
  });
};
