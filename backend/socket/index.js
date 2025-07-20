const { Server } = require('socket.io');
const chatHandlers = require('./chatHandlers');
const notificationHandlers = require('./notificationHandlers');
const notificationListener = require('../listeners/notificationListener')

const activeUsers = new Map()

const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true,
    }
  });

  io.on('connection', (socket) => {
    console.log('🔌 New client connected', socket.id);

    console.log('chatHandlers')
    chatHandlers(io, socket);
    console.log('notificationHandlers')
    notificationHandlers(io, socket, activeUsers);
    


    socket.on('disconnect', () => {
      console.log('❌ Client disconnected', socket.id);
    });
  });

  notificationListener(io, activeUsers)

  return io
};

module.exports = initializeSocket;
