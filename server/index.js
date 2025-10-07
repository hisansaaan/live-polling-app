import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const server = http.createServer(app);

// Enable CORS for your frontend
app.use(cors({
  origin: 'https://live-polling-393oezwkj-hisansaaans-projects.vercel.app',
  methods: ['GET', 'POST']
}));

// Basic route to confirm backend is running
app.get('/', (req, res) => {
  res.send('Backend is running');
});

// Setup Socket.io
const io = new Server(server, {
  cors: {
    origin: 'https://live-polling-393oezwkj-hisansaaans-projects.vercel.app',
    methods: ['GET', 'POST']
  }
});

// Poll state
let currentQuestion = '';
let timeLimit = 60;
let students = {};
let answers = {};

// Socket.io logic
io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);

  socket.on('student-join', (name) => {
    students[socket.id] = name;
    io.emit('student-list', students);
  });

  socket.on('ask-question', ({ question, timeLimit: limit }) => {
    currentQuestion = question;
    timeLimit = limit;
    answers = {};
    io.emit('new-question', { question, timeLimit });
  });

  socket.on('submit-answer', (answer) => {
    answers[socket.id] = answer;
    io.emit('poll-results', answers);
  });

  socket.on('remove-student', (id) => {
    delete students[id];
    io.to(id).emit('removed');
    io.emit('student-list', students);
  });

  socket.on('send-message', ({ sender, role, text }) => {
    io.emit('receive-message', { sender, role, text });
  });

  socket.on('disconnect', () => {
    delete students[socket.id];
    delete answers[socket.id];
    io.emit('student-list', students);
    io.emit('poll-results', answers);
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// Start server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});