const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const path = require('path'); // for file path handling
const { Server } = require('socket.io');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT']
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// ✅ Serve uploaded files (attachments)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Socket.IO connection
io.on('connection', (socket) => {
  console.log('🟢 A user connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('🔴 A user disconnected:', socket.id);
  });
});

// Make io accessible in req
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Routes
app.use('/auth', require('./routes/authRoutes'));

const requireAuth = require('./middleware/requireAuth');
app.use('/tasks', requireAuth, require('./routes/taskRoutes'));
app.use('/notifications', requireAuth, require('./routes/notificationRoutes'));
app.use('/analytics', requireAuth, require('./routes/analyticsRoutes')); // ✅ NEW route

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

