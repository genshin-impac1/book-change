const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');
const jwt = require('jsonwebtoken');

const app = express();
const server = http.createServer(app);

// 集成 Socket.io（实时聊天核心）
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// 全局挂载 io，方便路由中使用
global.io = io;

// 中间件
app.use(cors());
app.use(express.json({ limit: '10mb' })); // 支持大文件上传
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 路由引入（后面会逐个创建）
app.use('/api/auth', require('./routes/auth'));
app.use('/api/books', require('./routes/books'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/chat', require('./routes/chat'));
app.use('/api/admin', require('./routes/admin'));

// Socket.io 认证 + 消息处理
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) return next(new Error('未提供token'));

  try {
    const decoded = jwt.verify(token, 'your-secret-key-2025'); // 密钥要和登录时一致
    socket.user = decoded; // 挂载用户信息
    next();
  } catch (err) {
    next(new Error('token无效或过期'));
  }
});

io.on('connection', (socket) => {
  console.log(`用户 ${socket.user.id} 已连接聊天系统`);

  // 加入个人房间，用于接收消息
  socket.join(`user_${socket.user.id}`);

  // 监听发送消息
  socket.on('sendMessage', async (data) => {
    const { Message } = require('./models');
    const msg = await Message.create({
      fromUserId: socket.user.id,
      toUserId: data.toUserId,
      bookId: data.bookId || null,
      content: data.content,
      isRead: 0
    });

    // 推送到对方
    io.to(`user_${data.toUserId}`).emit('newMessage', msg);
    // 同时也推给自己（前端显示）
    socket.emit('messageSent', msg);
  });

  socket.on('disconnect', () => {
    console.log(`用户 ${socket.user.id} 断开连接`);
  });
});

// 启动服务器
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`后端服务已启动：http://localhost:${PORT}`);
  console.log(`WebSocket 聊天服务已就绪`);
});