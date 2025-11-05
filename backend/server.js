require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/exams', require('./routes/exams'));

// Socket.io Chat
io.on('connection', (socket) => {
  socket.on('joinExam', (examId) => socket.join(examId));
  socket.on('sendMessage', (data) => io.to(data.examId).emit('message', data));
});

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/onlineexampro')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
