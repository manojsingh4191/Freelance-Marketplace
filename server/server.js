require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL ? [process.env.FRONTEND_URL, 'http://localhost:5173'] : ['http://localhost:5173', 'https://your-vercel-app-url.vercel.app'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }
});

// Middleware
const corsOptions = {
  origin: process.env.FRONTEND_URL ? [process.env.FRONTEND_URL, 'http://localhost:5173'] : ['http://localhost:5173', 'https://your-vercel-app-url.vercel.app'],
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());

// Database connection
mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 5000 
})
  .then(async () => {
    console.log("DB Connected");
    // Seed Demo Projects
    const Project = require('./models/Project');
    const mongoose = require('mongoose');
    const count = await Project.countDocuments();
    if (count === 0) {
      console.log('Seeding demo projects...');
      const dummyClient = new mongoose.Types.ObjectId();
      await Project.insertMany([
        { title: 'React Developer Needed', description: 'Looking for an expert React dev to build a web app dashboard.', budget: 500, client: dummyClient, status: 'Open' },
        { title: 'Logo Design for Startup', description: 'We need a modern, minimalist logo for our AI startup.', budget: 150, client: dummyClient, status: 'Open' },
        { title: 'Node API Bug Fix', description: 'Fix an ongoing 500 error on our register route.', budget: 100, client: dummyClient, status: 'Open' },
        { title: 'Full Stack MERN E-Commerce', description: 'Build a complete e-commerce store with Stripe integration.', budget: 1500, client: dummyClient, status: 'Open' },
        { title: 'Figma to Tailwind CSS', description: 'Convert our 5-page Figma design into responsive Tailwind HTML.', budget: 300, client: dummyClient, status: 'Open' },
        { title: 'SEO Optimization & Copywriting', description: 'Optimize our landing page and write SEO-friendly copy.', budget: 200, client: dummyClient, status: 'Open' }
      ]);
      console.log('Demo projects seeded successfully.');
    }
  })
  .catch(err => console.error("DB Error:", err));

// Routes
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const proposalRoutes = require('./routes/proposalRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const messageRoutes = require('./routes/messageRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/proposals', proposalRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/payments', paymentRoutes);

// Basic route
app.get('/api', (req, res) => {
  res.send('Freelance Marketplace API is running...');
});

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/dist', 'index.html'));
  });
}

// Socket.io connection
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  
  socket.on('join_room', async (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
    const Message = require('./models/Message');
    try {
      const messages = await Message.find({ roomId }).sort({ createdAt: 1 });
      socket.emit('chat_history', messages);
    } catch (err) {
      console.error(err);
    }
  });

  socket.on('send_message', async (data) => {
    const Message = require('./models/Message');
    try {
      const messageObj = {
        sender: data.sender,
        receiver: data.receiver,
        text: data.text,
        roomId: data.roomId
      };
      
      if (data.expiresInSeconds && data.expiresInSeconds > 0) {
        messageObj.expiresAt = new Date(Date.now() + data.expiresInSeconds * 1000);
      }
      
      const newMessage = await Message.create(messageObj);
      io.to(data.roomId).emit('receive_message', newMessage);
    } catch (err) {
      console.error('Error saving message:', err);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
