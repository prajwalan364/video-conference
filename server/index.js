const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
const  { Server } = require('socket.io')
const io =new Server(server)
const path = require('path');
const cors = require('cors');

io.on('connection', (socket) => {
    socket.on('message', ({ name, message }) => {
        io.emit('message', { name, message })
    })
} )

server.listen(5000, () => console.log('server running on PORT: 5000'))