require('dotenv').config();
const express = require('express');
const http = require('http')
const { Server } = require('socket.io')
const app = express();
const path = require('path');
const cors = require('cors');
const multer = require('multer')
const verifyJWT = require('./middleware/verifyJWT');
const cookieParser = require('cookie-parser');
const corsOptions = require('./config/corsOptions');
const session = require('express-session')
const passport = require('passport')
require('./config/passport')
const credentials = require('./middleware/credentials');
const { sendMessage } = require('./controller/messageController')
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');
const PORT = process.env.PORT || 3500;


// --- ここからサーバー立ち上げ
const server = http.createServer(app)

app.use(session({
  secret: 'your-session-secret',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  }
})  

io.on('connection', (socket) => {
  console.log('New client connected', socket.id);

  socket.on('sendMessage', async (savedMessage) => {
    console.log('★ sendMessage socket event fired', savedMessage)

    try {
      // 自分以外にbroadcast
      console.log('★ inside try block')
      socket.broadcast.emit('receiveMessage', savedMessage);
      console.log('receiveMessage', savedMessage)

      // 送った本人にも即返しておきたいならここでemitしてもOK
      socket.emit('messageSent', savedMessage);

    } catch (error) {
      console.error('Error sending message:', error.message);
      socket.emit('errorMessage', { message: error.message });
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected', socket.id);
  });
});

//Connect to mongoDB
connectDB();

// handle options credentials check - before CORS!
//and fetch cookies credentials requirement
app.use(credentials);

//Cors Origin Resource Sharing
app.use(cors(corsOptions));

// built-in middleWare to handle urlencoded data
// in other words, form data:
// 'content-type: application/x-www-form-urlencoded'
app.use(express.urlencoded({ extended: false }));

// built-in middleWare for json
app.use(express.json());

//middleware for cookies
app.use(cookieParser());

// uploads フォルダ内のファイルが Web 上でアクセス可能になる
app.use('/uploads', express.static('uploads'))

// routes
app.use('/', require('./routes/root'))
app.use('/auth', require('./routes/authRoutes'))

app.use('/songs', require('./routes/songRoutes'))
app.use('/users', require('./routes/userRoutes'))
app.use('/comments', require('./routes/commentRoutes'))
app.use('/playlists', require('./routes/playlistRoutes'))

app.use(verifyJWT); // このコードより下のコードに影響を与えるから、関係のないものはここより上に位置させる
app.use('/mining-history', require('./routes/miningHistoryRoutes'))
app.use('/play-history', require('./routes/playHistoryRoutes'))
app.use('/conversations', require('./routes/conversationRoutes'))
app.use('/messages', require('./routes/messageRoutes'))

app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError || err.message.includes('Only')) {
      return res.status(400).json({ message: err.message });
    }
    console.error('Server error:', err)
    res.status(500).json({ message: 'サーバーエラーが発生しました' })
    next(err);
});

app.all('*', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if (req.accepts('json')) {
        res.json({ err: "404 Not Found"});
    } else {
        res.type('txt').send({ err: "404 Not Found"});
    }
})


mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
})