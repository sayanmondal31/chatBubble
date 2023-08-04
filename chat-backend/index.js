const express = require("express");
const cors = require("cors");
const connectWithMongodb = require("./db/db");
const { Server } = require("socket.io");
const http = require("http");
require("dotenv").config();
const Chat = require("./model/chat");
const morgan = require("morgan");
const User = require("./model/user");

connectWithMongodb();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    credentials: true,
    origin: true,
  },
});

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));

app.use("/api/users", require("./router/user"));
app.use("/api/chat", require("./router/chat"));

io.on("connection", async (socket) => {
  console.log("User connected");

  socket.on("user-connected", (userId) => {
    //   Store the MongoDB user ID in the socketId field

    socket.emit("check-user-online");
    console.log(userId, "id");
    User.findByIdAndUpdate(userId, { socketId: socket.id }, { new: true })
      .then((user) => {
        console.log("User connected:", user.username);
      })
      .catch((error) => {
        console.error("Error updating socket ID:", error);
      });
  });

  socket.on("send-message", async (messages) => {
    console.log(messages, "mm");
    try {
      const { sender, receiver, message } = messages;
      const chat = new Chat({
        sender,
        receiver,
        message,
      });
      await chat.save();

      //   emit message to sender
      io.to(socket?.id).emit("receive-message", messages);

      // Emit the message to the receiver
      const receiverUser = await User.findById(receiver);
      if (receiverUser?.socketId) {
        io.to(receiverUser.socketId).emit("receive-message", messages);
      }
    } catch (error) {
      console.log(error?.message);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
    User.findOneAndUpdate({ socketId: socket.id }, { socketId: null })
      .then((user) => {
        console.log("User disconnected");
      })
      .catch((error) => {
        console.error("Error updating socket ID:", error);
      });
  });
});

const PORT = process.env.PORT || 5001;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
