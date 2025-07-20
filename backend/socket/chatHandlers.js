module.exports = (io, socket) => {
  socket.on('sendMessage', async (savedMessage) => {
    try {
      socket.broadcast.emit('receiveMessage', savedMessage);
      socket.emit('messageSent', savedMessage);
    } catch (err) {
      socket.emit('errorMessage', { message: err.message });
    }
  });
};