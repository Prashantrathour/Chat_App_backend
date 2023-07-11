// const express = require('express');
// const http = require('http');
// const { Server } = require('socket.io');
// const cors = require('cors');

// const app = express();
// app.use(cors());

// const server = http.createServer(app);
// const io = new Server(server, {
//   cors: {
//     origin: '*',
//     methods: ['GET', 'POST'],
//   },
// });

// const port = 3001;

// io.on('connection', (socket) => {
//   console.log('New client connected');

//   socket.on('message', (message) => {
//     console.log('New message:', message);
//     io.emit('message', message);
//   });

//   socket.on('disconnect', () => {
//     console.log('Client disconnected');
//   });
// });

// server.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });
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
    methods: ['GET', 'POST'],
  },
});

const port = 3001;

const users = {}; // To store connected users

io.on('connection', (socket) => {
  console.log('New client connected');

  // Handle user joining
  socket.on('join', (username) => {
    users[socket.id] = username;
    io.emit('userJoined', username);
  });

  // Handle receiving and broadcasting messages
  socket.on('message', (message) => {
    const username = users[socket.id];
    console.log(username,message);
    io.emit('message', { username, message });
  });

  // Handle user disconnecting
  socket.on('disconnect', () => {
    const username = users[socket.id];
    delete users[socket.id];
    io.emit('userLeft', username);
    console.log('Client disconnected');
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
