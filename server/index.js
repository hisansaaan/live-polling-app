const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

let students = {};
let pollResults = {};

io.on('connection', (socket) => {
  socket.on('student-join', (name) => {
    students[socket.id] = name;
    io.emit('student-list', students);
  });

  socket.on('ask-question', ({ question, timeLimit }) => {
    io.emit('new-question', { question, timeLimit });
    pollResults = {};
  });

  socket.on('submit-answer', (answer) => {
    pollResults[socket.id] = answer;
    io.emit('poll-results', pollResults);
  });

  socket.on('remove-student', (id) => {
    io.to(id).emit('removed');
    delete students[id];
    io.emit('student-list', students);
  });

  socket.on('send-message', ({ sender, role, text }) => {
    io.emit('receive-message', { sender, role, text });
  });

  socket.on('disconnect', () => {
    delete students[socket.id];
    io.emit('student-list', students);
  });
});

server.listen(4000, () => {
  console.log('Server running on http://localhost:4000');
});