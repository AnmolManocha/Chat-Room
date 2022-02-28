var http = require('http');
var express = require('express');
var app = express();

app.use(express.static('static'));

const server = http.createServer(app);

// Handle Socket Connections
const io = require("socket.io")(server);

const users = {};

io.on("connection", (Socket) => {
  Socket.on("user-joined", (name) => {
    users[Socket.id] = name;
    Socket.broadcast.emit("user-joined", name);
  });

  Socket.on("send", (message) => {
    Socket.broadcast.emit("receive", {
      message: message,
      name: users[Socket.id],
    });
  });

  Socket.on("disconnect", (message) => {
    Socket.broadcast.emit("left", users[Socket.id]);
    delete users[Socket.id];
  });
});


server.listen(process.env.PORT || 80,  () => console.log('Server started....'));
