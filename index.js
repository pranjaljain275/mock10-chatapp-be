const express = require("express");
const http = require("http");
const { connection } = require("./config/db");
require("dotenv").config();
const cors = require("cors");
const socketServer = require("socket.io");
const { userJoin, allUsers, getCurrentUser } = require("./utils/user");
const { viewMessage } = require("./utils/msg");
const { userRouter } = require("./routes/user.route");

const app = express();

app.use(express.json());
app.use(cors());
app.use("/", userRouter);

const httpServer = http.createServer(app);

const io = socketServer(httpServer);

io.on("connection", (socket) => {
  console.log("Client Connected");

  socket.on("join", ({ username }) => {
    const user = userJoin(socket.id, username);

    // socket.join(user);

    socket.emit("message", viewMessage("Admin", "Welcome to Chat Room"));
    socket.broadcast.emit(
      "message",
      viewMessage("Admin", `${user.username} joined the chat`)
    );

    io.emit("users", allUsers());
  });

  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id);
    io.emit("message", viewMessage(user.username, msg));
  });
});

httpServer.listen(process.env.port, async () => {
  try {
    await connection;
    console.log("DB Connection");
  } catch (err) {
    console.log("DB not connection");
  }
  console.log(`Server is running on port ${process.env.port}`);
});
