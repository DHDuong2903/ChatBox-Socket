const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const connectDB = require("./configs/database");
const router = require("./routers");

app.use(express.json());

app.use(express.static("public"));

app.set("view engine", "ejs");
app.set("views", "views");

io.on("connection", (client) => {
  let room;
  // Tham gia chat
  client.on("join", (data) => {
    room = data;
    client.join(room);
  });
  client.on("message", (data) => {
    io.to(room).emit("thread", data);
  });
  client.on("emotion", (data) => {
    io.to(room).emit("emotion", data);
  });
});

connectDB();

router(app);

server.listen(3000, () => {
  console.log("Server run at http://localhost:3000");
});
