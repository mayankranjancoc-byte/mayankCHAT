const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Track users
let onlineUsers = [];

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // ---------------- MESSAGE ----------------
  socket.on("message", (msgData) => {
    console.log("Message received:", msgData);
    io.emit("message", msgData);
  });

  // ---------------- TYPING ----------------
  socket.on("typing", (username) => {
    socket.broadcast.emit("typing", username);
  });

  socket.on("stopTyping", () => {
    socket.broadcast.emit("stopTyping");
  });

  // ---------------- JOIN USER ----------------
  socket.on("join", (username) => {
    socket.username = username;

    if (!onlineUsers.includes(username)) {
      onlineUsers.push(username);
    }

    io.emit("onlineUsers", onlineUsers);
    console.log("Online users:", onlineUsers);
  });

  // ---------------- DISCONNECT ----------------
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);

    if (socket.username) {
      onlineUsers = onlineUsers.filter((u) => u !== socket.username);
      io.emit("onlineUsers", onlineUsers);
      console.log("Online users:", onlineUsers);
    }
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
