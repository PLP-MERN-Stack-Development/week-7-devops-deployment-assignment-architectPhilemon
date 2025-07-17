const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const http = require('http');
const socketIo = require('socket.io');
const connectDB = require('./config/database');

// Load environment variables based on NODE_ENV
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env';
require('dotenv').config({ path: envFile });

// Connect to MongoDB Database
connectDB();

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const eventRoutes = require('./routes/events');
const studyGroupRoutes = require('./routes/studyGroups');
const chatRoutes = require('./routes/chat');
const resourceRoutes = require('./routes/resources');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? [process.env.FRONTEND_URL].filter(Boolean)
      : ['http://localhost:5173', 'http://localhost:4173'],
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", "https://api.stripe.com", process.env.FRONTEND_URL].filter(Boolean),
    },
  },
  crossOriginEmbedderPolicy: false
}));

// Compression middleware
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: {
    error: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.FRONTEND_URL].filter(Boolean)
    : ['http://localhost:5173', 'http://localhost:4173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Logging
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Socket.IO middleware for authentication
const { authenticateSocket } = require('./middleware/auth');
io.use(authenticateSocket);

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log(`User ${socket.userId} connected`);
  
  // Join user to their personal room
  socket.join(`user_${socket.userId}`);
  
  // Handle joining chat rooms
  socket.on('join_room', (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.userId} joined room ${roomId}`);
  });
  
  // Handle leaving chat rooms
  socket.on('leave_room', (roomId) => {
    socket.leave(roomId);
    console.log(`User ${socket.userId} left room ${roomId}`);
  });
  
  // Handle new messages
  socket.on('send_message', async (data) => {
    try {
      const { roomId, content, type = 'text' } = data;
      
      // Save message to database
      const Message = require('./models/Message');
      const newMessage = new Message({
        roomId,
        senderId: socket.userId,
        content,
        type
      });
      
      await newMessage.save();
      await newMessage.populate('senderId', 'firstName lastName');
      
      // Update room's last activity
      const ChatRoom = require('./models/ChatRoom');
      await ChatRoom.findByIdAndUpdate(roomId, { lastActivity: new Date() });
      
      // Emit message to all users in the room
      io.to(roomId).emit('new_message', newMessage);
    } catch (error) {
      console.error('Error sending message:', error);
      socket.emit('message_error', { error: 'Failed to send message' });
    }
  });
  
  // Handle typing indicators
  socket.on('typing_start', (roomId) => {
    socket.to(roomId).emit('user_typing', { userId: socket.userId, typing: true });
  });
  
  socket.on('typing_stop', (roomId) => {
    socket.to(roomId).emit('user_typing', { userId: socket.userId, typing: false });
  });
  
  socket.on('disconnect', () => {
    console.log(`User ${socket.userId} disconnected`);
  });
});

// Make io available to routes
app.set('io', io);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    uptime: process.uptime()
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/study-groups', studyGroupRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/resources', resourceRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: 'MongoDB Connected',
    uptime: process.uptime()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 3001;

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

server.listen(PORT, () => {
  console.log(`🚀 Campus Connect API running on port ${PORT}`);
  console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🗄️ Database: MongoDB`);
  console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || 'https://adorable-kataifi-91d952.netlify.app/'}`);
  console.log(`💬 Socket.IO enabled for real-time chat`);
});

module.exports = app;
