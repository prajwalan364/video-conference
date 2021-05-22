const express = require('express');
const http = require('http');
const path = require('path');

const app = express();
const server = http.createServer(app);
const { ExpressPeerServer } = require('peer');

const peerServer = ExpressPeerServer(server, {
  debug: true,
});

app.use('/peerjs', peerServer);

const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  },
});

app.use(express.json());

app.get('/', (req, res) => {
  res.send('<h1>Socket.io</h1>');
});

io.on('connection', (socket) => {
  console.log(' user connected', socket.id);
  socket.on('join-room', (roomId, userId) => {
    console.log(roomId, userId);
    socket.join(roomId);
    socket.broadcast.to(roomId).emit('user-connected', userId);

    socket.on('message', ({ message, userId }) => {
      console.log(message, userId);
      io.to(roomId).emit('createMessage', message, userId);
    });

    // When User Disconnected
    socket.on('disconnect', (userId) => {
      socket.broadcast.to(roomId).emit('user-disconnected', userId);
    });
  });
});

const port = 8000;
server.listen(port, () => {
  console.log(`Running on Port: ${port}`);
});
